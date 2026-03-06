import React, { useState, useMemo } from 'react';
import { Search, Share, Download, FileText, ChevronDown, ChevronRight, Play, Copy, Eye, X, Layers } from 'lucide-react';
import './EventVisualizer.css';

const EventVisualizer = ({ cachedData, selectedUser, setSelectedUser, selectedConv, setSelectedConv }) => {
    const conversations = cachedData?.conversations || [];
    const messages = cachedData?.messages || [];

    // Map user IDs to emails for a more user-friendly dropdown
    const userOptions = useMemo(() => {
        const map = {};
        const allItems = [...messages, ...(cachedData?.internal_events || [])];
        allItems.forEach(item => {
            if (item.user_id && item.user_email && !map[item.user_id]) {
                map[item.user_id] = item.user_email;
            }
        });

        const uniqueIds = Array.from(new Set(conversations.map(c => c.user_id))).filter(Boolean);
        return uniqueIds.map(id => ({
            id: id,
            email: map[id] || id
        })).sort((a, b) => a.email.localeCompare(b.email));
    }, [conversations, messages, cachedData?.internal_events]);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Timeline');
    const [expandedTurns, setExpandedTurns] = useState({});

    // Reset filters when conversation changes
    React.useEffect(() => {
        handleClearFilters();
    }, [selectedConv]);

    // Table specific filters
    const [selectedObjectType, setSelectedObjectType] = useState('All');
    const [selectedActor, setSelectedActor] = useState('All');
    const [selectedTurnFilter, setSelectedTurnFilter] = useState('All');

    // Modal state
    const [previewContent, setPreviewContent] = useState(null);

    // Filter conversations based on selected user
    const filteredConvs = useMemo(() => {
        if (!selectedUser) return conversations;
        return conversations.filter(c => c.user_id === selectedUser);
    }, [conversations, selectedUser]);

    // Handle user selection change
    const handleUserChange = (e) => {
        const user = e.target.value;
        setSelectedUser(user);
        setSelectedConv(''); // reset conversation when user changes
    };

    // Calculate turns data for the selected conversation
    const turnsData = useMemo(() => {
        if (!selectedConv) return [];

        const convMessages = messages.filter(m => m.conversation_id === selectedConv);
        const convEvents = (cachedData?.internal_events || []).filter(e => e.conversation_id === selectedConv);

        const turnsMap = {};
        // Find all turn IDs from both messages and internal events
        const allTurnItems = [...convMessages, ...convEvents];
        allTurnItems.forEach(item => {
            const tid = item.turn_id || 'unknown_turn';
            if (!turnsMap[tid]) {
                turnsMap[tid] = [];
            }
            // Avoid duplicate tracking if an item appears in both for some reason
            if (!turnsMap[tid].some(existing => existing._id === item._id)) {
                turnsMap[tid].push(item);
            }
        });

        // Convert map to sorted array of turns
        let turnsList = Object.keys(turnsMap).map((tid, index) => {
            // Find initial event for naming (prefer USER_QUERY_RECEIVED)
            let initialEvent = turnsMap[tid].find(m => m.type === 'USER_QUERY_RECEIVED');
            if (!initialEvent) {
                // Fallback to first message or anything
                initialEvent = turnsMap[tid].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
            }
            let type = initialEvent ? initialEvent.type : 'INTERNAL_PROCESS';

            // Gather all events for this turn and sort
            let msgs = turnsMap[tid].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

            // Mark which are messages and which are events for filtering
            msgs = msgs.map(item => {
                const isMsg = messages.some(m => m._id === item._id);
                return { ...item, _objectType: isMsg ? 'MESSAGE' : 'EVENT' };
            });

            const startTime = msgs.length > 0 ? new Date(msgs[0].created_at).getTime() : 0;
            const endTime = msgs.length > 0 ? new Date(msgs[msgs.length - 1].created_at).getTime() : 0;
            const totalDurationMs = Math.max(0, endTime - startTime);

            // Calculate timing stats
            const senderTimes = {};
            let totalExplicitDuration = 0;

            msgs.forEach(current => {
                if (current.payload && current.payload.duration_ms) {
                    let sender = current.sender ? current.sender.toUpperCase() : 'OTHER';
                    // Custom sender mapping for ARES
                    if (['UTILITY_AGENT_RESPONDED', 'UTILITY_AGENT_INVOKED'].includes(current.type) || current.sender === 'SARO') {
                        sender = 'ARES';
                    }
                    senderTimes[sender] = (senderTimes[sender] || 0) + current.payload.duration_ms;
                    totalExplicitDuration += current.payload.duration_ms;
                }
                if (current.sender === 'APOLO' && current.extra_payload) {
                    const dur = (current.extra_payload.plan_generation_duration_ms || 0) + (current.extra_payload.context_retrieval_duration_ms || 0);
                    if (dur > 0) {
                        senderTimes['APOLO'] = (senderTimes['APOLO'] || 0) + dur;
                        totalExplicitDuration += dur;
                    }
                }
            });

            const remainingTime = Math.max(0, totalDurationMs - totalExplicitDuration);
            if (remainingTime > 0) senderTimes['USER'] = remainingTime;

            // Apply Timeline-Specific Filtering
            if (activeTab === 'Timeline') {
                if (selectedObjectType !== 'All') {
                    msgs = msgs.filter(e => e._objectType === selectedObjectType);
                }
                if (selectedActor !== 'All') {
                    msgs = msgs.filter(e => {
                        let s = (e.sender || '').toUpperCase();
                        if (['UTILITY_AGENT_RESPONDED', 'UTILITY_AGENT_INVOKED'].includes(e.type) || e.sender === 'SARO') s = 'ARES';
                        return s === (selectedActor === 'OTHER' ? '' : selectedActor) || (selectedActor === 'OTHER' && !e.sender);
                    });
                }
                if (searchTerm) {
                    const low = searchTerm.toLowerCase();
                    msgs = msgs.filter(e =>
                        (e.type || '').toLowerCase().includes(low) ||
                        (e.content || '').toLowerCase().includes(low) ||
                        (e.sender || '').toLowerCase().includes(low) ||
                        JSON.stringify(e.payload || {}).toLowerCase().includes(low)
                    );
                }
            }

            return {
                id: tid,
                name: initialEvent && initialEvent.content ? initialEvent.content : (initialEvent?.sender === 'USER' ? 'User Query' : `Turn ${index + 1}`),
                type: type,
                events: msgs,
                totalDurationMs,
                senderTimes
            };
        });

        if (activeTab === 'Timeline' && selectedTurnFilter !== 'All') {
            turnsList = turnsList.filter(t => t.id === selectedTurnFilter);
        }

        return turnsList.filter(t => t.events.length > 0).sort((a, b) => {
            if (a.events.length === 0) return 1;
            if (b.events.length === 0) return -1;
            return new Date(a.events[0].created_at) - new Date(b.events[0].created_at);
        });
    }, [messages, selectedConv, searchTerm, cachedData?.internal_events, activeTab, selectedObjectType, selectedActor, selectedTurnFilter]);

    const formatDuration = (ms) => {
        if (ms === 0) return '0s';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    const toggleTurn = (turnId) => {
        setExpandedTurns(prev => ({
            ...prev,
            [turnId]: !prev[turnId]
        }));
    };

    const renderModalContent = (content) => {
        if (!content) return null;
        let isJson = false;
        let displayContent = content;
        try {
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                const parsed = JSON.parse(content);
                displayContent = JSON.stringify(parsed, null, 2);
                isJson = true;
            }
        } catch (e) { }

        const hasHtml = /<[a-z][\s\S]*>/i.test(content);

        return (
            <div className="ev-modal-preview-container">
                {isJson ? (
                    <pre className="ev-preview-json">{displayContent}</pre>
                ) : hasHtml ? (
                    <iframe title="content-preview" srcDoc={content} style={{ width: '100%', height: '70vh', border: 'none', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '200px', whiteSpace: 'pre-wrap', color: '#1e293b' }}>
                        {content}
                    </div>
                )}
            </div>
        );
    };

    const renderHtmlContent = (content) => {
        const hasHtml = /<[a-z][\s\S]*>/i.test(content);
        if (hasHtml) {
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
        }
        return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedObjectType('All');
        setSelectedActor('All');
        setSelectedTurnFilter('All');
    };



    // ---------- Table Tab Specific Logic ----------
    const flatEvents = useMemo(() => {
        let evs = [];
        if (selectedConv) {
            evs = [
                ...messages.filter(m => m.conversation_id === selectedConv).map(m => ({ ...m, _objectType: 'MESSAGE' })),
                ...(cachedData?.internal_events || []).filter(e => e.conversation_id === selectedConv).map(e => ({ ...e, _objectType: 'EVENT' }))
            ];
        } else {
            evs = [
                ...messages.map(m => ({ ...m, _objectType: 'MESSAGE' })),
                ...(cachedData?.internal_events || []).map(e => ({ ...e, _objectType: 'EVENT' }))
            ];
        }
        return evs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [messages, cachedData?.internal_events, selectedConv]);

    const uniqueActors = useMemo(() => {
        const actors = new Set();
        flatEvents.forEach(e => {
            let s = (e.sender || '').toUpperCase();
            if (['UTILITY_AGENT_RESPONDED', 'UTILITY_AGENT_INVOKED'].includes(e.type) || e.sender === 'SARO') s = 'ARES';
            actors.add(s || 'OTHER');
        });
        return Array.from(actors).sort();
    }, [flatEvents]);

    const turnOptions = useMemo(() => {
        return turnsData.map(t => ({
            id: t.id,
            name: t.name.length > 50 ? t.name.substring(0, 47) + '...' : t.name
        }));
    }, [turnsData]);

    const tableFilteredEvents = useMemo(() => {
        let evs = flatEvents;

        if (selectedObjectType !== 'All') {
            evs = evs.filter(e => e._objectType === selectedObjectType);
        }

        if (selectedActor !== 'All') {
            evs = evs.filter(e => {
                let s = (e.sender || '').toUpperCase();
                if (['UTILITY_AGENT_RESPONDED', 'UTILITY_AGENT_INVOKED'].includes(e.type) || e.sender === 'SARO') s = 'ARES';
                const target = selectedActor === 'OTHER' ? '' : selectedActor;
                return s === target || (selectedActor === 'OTHER' && !s);
            });
        }

        if (selectedTurnFilter !== 'All') {
            evs = evs.filter(e => e.turn_id === selectedTurnFilter);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            evs = evs.filter(e =>
                (e.type || '').toLowerCase().includes(lowerSearch) ||
                (e.content || '').toLowerCase().includes(lowerSearch) ||
                (e.sender || '').toLowerCase().includes(lowerSearch) ||
                (e.receiver || '').toLowerCase().includes(lowerSearch) ||
                JSON.stringify(e.payload || {}).toLowerCase().includes(lowerSearch) ||
                JSON.stringify(e.extra_payload || {}).toLowerCase().includes(lowerSearch)
            );
        }

        return evs;
    }, [flatEvents, selectedObjectType, selectedActor, selectedTurnFilter, searchTerm]);

    const tableStats = useMemo(() => {
        const messagesCount = tableFilteredEvents.filter(e => e._objectType === 'MESSAGE').length;
        const eventsCount = tableFilteredEvents.filter(e => e._objectType === 'EVENT').length;
        const turnIds = new Set(tableFilteredEvents.map(e => e.turn_id).filter(Boolean));

        let totalTurnDurationMs = 0;
        let matchTurnsCount = 0;

        turnsData.forEach(t => {
            if (turnIds.has(t.id) || selectedTurnFilter === 'All') {
                totalTurnDurationMs += t.totalDurationMs;
                matchTurnsCount++;
            }
        });

        const avgDurationMs = matchTurnsCount > 0 ? (totalTurnDurationMs / matchTurnsCount) : 0;

        // Calculate actor activity (messages sent)
        const actorStatsMap = {};
        tableFilteredEvents.filter(e => e._objectType === 'MESSAGE').forEach(e => {
            let s = (e.sender || '').toUpperCase();
            if (['UTILITY_AGENT_RESPONDED', 'UTILITY_AGENT_INVOKED'].includes(e.type) || e.sender === 'SARO') s = 'ARES';
            if (!s) s = 'OTHER';
            actorStatsMap[s] = (actorStatsMap[s] || 0) + 1;
        });
        const actorStats = Object.entries(actorStatsMap).sort((a, b) => b[1] - a[1]);

        // Calculate event distribution
        const typeStatsMap = {};
        tableFilteredEvents.forEach(e => {
            const t = e.type || 'UNKNOWN';
            typeStatsMap[t] = (typeStatsMap[t] || 0) + 1;
        });
        const typeStats = Object.entries(typeStatsMap).sort((a, b) => b[1] - a[1]);

        return {
            total: tableFilteredEvents.length,
            messages: messagesCount,
            internalEvents: eventsCount,
            turns: turnIds.size,
            avgDurationS: (avgDurationMs / 1000).toFixed(2),
            actorStats,
            typeStats
        };
    }, [tableFilteredEvents, turnsData, selectedTurnFilter]);

    const plansData = useMemo(() => {
        if (!selectedConv) return [];
        const planEvents = (cachedData?.internal_events || []).filter(e =>
            e.conversation_id === selectedConv &&
            (e.type === 'INITIAL_PLAN_PRESENTED' || e.type === 'PLAN_REVISION_PRESENTED')
        );

        return planEvents.map(e => ({
            id: e._id,
            turn_id: e.turn_id,
            type: e.type,
            timestamp: e.created_at,
            mode: e.extra_payload?.mode || 'sequential',
            explanation: e.extra_payload?.explanation || e.content,
            steps: e.extra_payload?.sub_queries || [],
            raw: e
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [cachedData?.internal_events, selectedConv]);

    const getActorClass = (actor) => {
        const a = (actor || '').toUpperCase();
        if (a === 'USER') return 'ev-actor-user';
        if (a === 'APOLO') return 'ev-actor-apolo';
        if (a === 'SARO') return 'ev-actor-saro';
        if (a === 'SYSTEM') return 'ev-actor-system';
        if (a === 'ARES') return 'ev-actor-ares';
        return 'ev-actor-other';
    };

    return (
        <div className="event-visualizer-container">
            <div className="ev-header">
                <div className="ev-header-title">
                    <Search size={28} color="#60a5fa" />
                    Orchestrator Events Visualizer
                </div>
                <div className="ev-controls">
                    <select className="ev-input" value={selectedUser} onChange={handleUserChange} style={{ minWidth: '180px' }}>
                        <option value="">Choose User Email...</option>
                        {userOptions.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
                    </select>
                    <select className="ev-input" value={selectedConv} onChange={(e) => setSelectedConv(e.target.value)} disabled={!selectedUser} style={{ minWidth: '220px' }}>
                        <option value="">{selectedUser ? "Select Conversation..." : "Choose User First"}</option>
                        {filteredConvs.map(c => <option key={c._id} value={c._id}>{c.title || c._id}</option>)}
                    </select>
                    <button className="ev-btn ev-btn-secondary">
                        <Share size={16} /> Share
                    </button>
                    <button className="ev-btn ev-btn-secondary">
                        <Download size={16} /> Export JSON
                    </button>
                    <button className="ev-btn ev-btn-secondary">
                        <FileText size={16} /> Export Timeline to PDF
                    </button>
                </div>
            </div>

            <div className="ev-tabs">
                {['Timeline', 'Table', 'Statistics', 'Plans'].map(tab => (
                    <button
                        key={tab}
                        className={`ev-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {!selectedConv && (
                <div className="ev-welcome-placeholder">
                    <div className="ev-placeholder-content">
                        <Layers size={64} color="#94a3b8" strokeWidth={1.5} />
                        <h2>Ready to Decode?</h2>
                        <p>Select a <b>User Email</b> and <b>Conversation Session</b> from the header above to initialize the execution sequence visualization.</p>
                        <div className="ev-placeholder-hint">
                            <span>Timeline</span>
                            <span>Table</span>
                            <span>Statistics</span>
                        </div>
                    </div>
                </div>
            )}

            {selectedConv && activeTab === 'Timeline' && (
                <>
                    <div className="ev-filters">
                        <select className="ev-filter-select" value={selectedObjectType} onChange={(e) => setSelectedObjectType(e.target.value)}>
                            <option value="All">All Types</option>
                            <option value="MESSAGE">MESSAGE</option>
                            <option value="EVENT">EVENT</option>
                        </select>
                        <select className="ev-filter-select" value={selectedActor} onChange={(e) => setSelectedActor(e.target.value)}>
                            <option value="All">All Actors</option>
                            {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select className="ev-filter-select" value={selectedTurnFilter} onChange={(e) => setSelectedTurnFilter(e.target.value)}>
                            <option value="All">All Turns</option>
                            {turnOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <input
                            className="ev-search"
                            type="text"
                            placeholder="Search Events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="ev-clear-btn" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>

                    <div className="ev-timeline">
                        {turnsData.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
                                <div style={{ marginBottom: '16px' }}><Search size={48} opacity={0.5} /></div>
                                <h3>No matching events found</h3>
                                <p>Adjust your filters or try a different conversation.</p>

                                <button className="ev-clear-btn" style={{ marginTop: '16px' }} onClick={handleClearFilters}>Reset All Filters</button>
                            </div>

                        ) : (
                            turnsData.map(turn => {
                                const isExpanded = expandedTurns[turn.id];
                                return (
                                    <div key={turn.id} className="ev-turn-bar">
                                        <div className="ev-turn-header" onClick={() => toggleTurn(turn.id)}>
                                            <div className="ev-turn-info">
                                                <span className="ev-turn-name">{turn.name}</span>
                                                <span className="ev-turn-type">{turn.type}</span>
                                                <span className="ev-turn-events">{turn.events.length} events</span>
                                            </div>
                                            <div className="ev-turn-stats">
                                                <span className="ev-stat-pill ev-stat-total" title="Total Duration">
                                                    ⏱ {formatDuration(turn.totalDurationMs)}
                                                </span>
                                                {turn.senderTimes['ARES'] && (
                                                    <span className="ev-stat-pill ev-stat-ares">
                                                        ARES: {formatDuration(turn.senderTimes['ARES'])}
                                                    </span>
                                                )}
                                                {turn.senderTimes['APOLO'] && (
                                                    <span className="ev-stat-pill ev-stat-apolo">
                                                        APOLO: {formatDuration(turn.senderTimes['APOLO'])}
                                                    </span>
                                                )}
                                                {turn.senderTimes['USER'] && (
                                                    <span className="ev-stat-pill ev-stat-user">
                                                        User: {formatDuration(turn.senderTimes['USER'])}
                                                    </span>
                                                )}
                                                {Object.entries(turn.senderTimes).map(([sender, time]) => {
                                                    if (['ARES', 'APOLO', 'USER'].includes(sender)) return null;
                                                    return (
                                                        <span key={sender} className="ev-stat-pill ev-stat-other">
                                                            {sender}: {formatDuration(time)}
                                                        </span>
                                                    );
                                                })}
                                                {isExpanded ? <ChevronDown size={20} /> : <Play size={16} />}
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div className="ev-turn-content">
                                                <div className="ev-event-list">
                                                    {turn.events.map(ev => {
                                                        const date = new Date(ev.created_at);
                                                        const timeStr = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + date.getMilliseconds();
                                                        return (
                                                            <div key={ev._id} className="ev-event-item">
                                                                <div className="ev-event-header">
                                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                                        <div title={ev.sender} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>{ev.sender ? ev.sender.substring(0, 2).toUpperCase() : '??'}</div>
                                                                        <span className="ev-event-type">{ev.type} <span style={{ color: '#64748b', fontWeight: 'normal' }}>{timeStr}</span></span>
                                                                    </div>
                                                                    <div className="ev-event-participants">
                                                                        {ev.payload && ev.payload.duration_ms && <span style={{ backgroundColor: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{ev.sender === 'SARO' ? 'SARO' : ev.sender || '??'}: {Math.floor(ev.payload.duration_ms / 1000)}s</span>}
                                                                        {ev.receiver && <span><strong>Receiver:</strong> {ev.receiver}</span>}
                                                                        {ev.user_attachment_file_id !== undefined && <span><strong>Attachment:</strong> {ev.user_attachment_file_id ? 'Yes' : 'No'}</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="ev-event-body custom-scrollbar">
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                                        <div style={{ flex: 1 }}>
                                                                            {ev.payload ? (
                                                                                <pre style={{ margin: 0, fontSize: '11px', color: '#8b5cf6', backgroundColor: '#faf5ff', padding: '8px', borderRadius: '4px' }}>{JSON.stringify(ev.payload, null, 2)}</pre>
                                                                            ) : (
                                                                                renderHtmlContent(ev.extra_payload?.research_dump?.final_answer || ev.extra_payload?.natural_language_proposed_plan || ev.content || 'N/A')
                                                                            )}
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                                            <button
                                                                                className="ev-icon-btn"
                                                                                title="Preview content"
                                                                                onClick={() => {
                                                                                    const contentData = ev.payload
                                                                                        ? JSON.stringify(ev.payload, null, 2)
                                                                                        : (ev.content ? ev.content : JSON.stringify(ev.extra_payload || {}));
                                                                                    setPreviewContent(contentData);
                                                                                }}
                                                                            >
                                                                                <Eye size={16} />
                                                                            </button>
                                                                            <button
                                                                                className="ev-icon-btn"
                                                                                title="Copy content"
                                                                                onClick={(e) => {
                                                                                    const contentData = ev.payload
                                                                                        ? JSON.stringify(ev.payload, null, 2)
                                                                                        : (ev.content ? ev.content : JSON.stringify(ev.extra_payload || {}));
                                                                                    navigator.clipboard.writeText(contentData);
                                                                                    const btn = e.currentTarget;
                                                                                    const originalColor = btn.style.color;
                                                                                    btn.style.color = '#10b981';
                                                                                    setTimeout(() => btn.style.color = originalColor, 1000);
                                                                                }}
                                                                            >
                                                                                <Copy size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )
            }

            {
                selectedConv && activeTab === 'Table' && (
                    <>
                        <div className="ev-filters">
                            <select className="ev-filter-select" value={selectedObjectType} onChange={(e) => setSelectedObjectType(e.target.value)}>
                                <option value="All">All Types</option>
                                <option value="MESSAGE">MESSAGE</option>
                                <option value="EVENT">EVENT</option>
                            </select>
                            <select className="ev-filter-select" value={selectedActor} onChange={(e) => setSelectedActor(e.target.value)}>
                                <option value="All">All Actors</option>
                                {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select className="ev-filter-select" value={selectedTurnFilter} onChange={(e) => setSelectedTurnFilter(e.target.value)}>
                                <option value="All">All Turns</option>
                                {turnOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <input
                                className="ev-search"
                                type="text"
                                placeholder="Search Events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="ev-clear-btn" onClick={handleClearFilters}>
                                Clear Filters
                            </button>
                        </div>

                        <div className="ev-cards">
                            <div className="ev-stat-card">
                                <span className="ev-card-value">{tableStats.total}</span>
                                <span className="ev-card-label">TOTAL EVENTS</span>
                            </div>
                            <div className="ev-stat-card">
                                <span className="ev-card-value">{tableStats.messages}</span>
                                <span className="ev-card-label">MESSAGES</span>
                            </div>
                            <div className="ev-stat-card">
                                <span className="ev-card-value">{tableStats.internalEvents}</span>
                                <span className="ev-card-label">INTERNAL EVENTS</span>
                            </div>
                            <div className="ev-stat-card">
                                <span className="ev-card-value">{tableStats.turns}</span>
                                <span className="ev-card-label">TURNS</span>
                            </div>
                            <div className="ev-stat-card">
                                <span className="ev-card-value">{tableStats.avgDurationS}s</span>
                                <span className="ev-card-label">AVG TURN DURATION</span>
                            </div>
                        </div>

                        <div className="ev-table-wrapper custom-scrollbar">
                            <table className="ev-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Type</th>
                                        <th>Object</th>
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th>Content</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableFilteredEvents.map(ev => {
                                        const date = new Date(ev.created_at);
                                        let dtStr = date.toLocaleDateString();
                                        let tmStr = date.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

                                        const content = ev.payload
                                            ? JSON.stringify(ev.payload)
                                            : (ev.content ? ev.content : JSON.stringify(ev.extra_payload || {}));

                                        return (
                                            <tr key={ev._id || date.getTime() + Math.random()}>
                                                <td style={{ width: '90px' }}>
                                                    <div>{dtStr}</div>
                                                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{tmStr}</div>
                                                </td>
                                                <td style={{ width: '200px' }}>{ev.type || 'N/A'}</td>
                                                <td>
                                                    <span className={`ev-table-object ${ev._objectType.toLowerCase()}`}>
                                                        {ev._objectType}
                                                    </span>
                                                </td>
                                                <td>
                                                    {ev.sender && (
                                                        <span className={`ev-table-actor ${getActorClass(ev.sender)}`}>
                                                            {ev.sender === selectedUser ? (userOptions.find(u => u.id === ev.sender)?.email || ev.sender) : ev.sender.toUpperCase()}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {ev.receiver && (
                                                        <span className={`ev-table-actor ${getActorClass(ev.receiver)}`}>
                                                            {ev.receiver === selectedUser ? (userOptions.find(u => u.id === ev.receiver)?.email || ev.receiver) : ev.receiver.toUpperCase()}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                        <div className="ev-table-content custom-scrollbar" style={{ flex: 1 }}>
                                                            {content}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button
                                                                className="ev-icon-btn"
                                                                title="Preview content"
                                                                onClick={() => setPreviewContent(content)}
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                className="ev-icon-btn"
                                                                title="Copy content"
                                                                onClick={(e) => {
                                                                    navigator.clipboard.writeText(content);
                                                                    const btn = e.currentTarget;
                                                                    const originalColor = btn.style.color;
                                                                    btn.style.color = '#10b981';
                                                                    setTimeout(() => btn.style.color = originalColor, 1000);
                                                                }}
                                                            >
                                                                <Copy size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            }

            {
                selectedConv && activeTab === 'Statistics' && (
                    <div style={{ padding: '24px' }}>
                        <div className="ev-filters" style={{ marginBottom: '24px' }}>
                            <select className="ev-filter-select" value={selectedObjectType} onChange={(e) => setSelectedObjectType(e.target.value)}>
                                <option value="All">All Types</option>
                                <option value="MESSAGE">MESSAGE</option>
                                <option value="EVENT">EVENT</option>
                            </select>
                            <select className="ev-filter-select" value={selectedActor} onChange={(e) => setSelectedActor(e.target.value)}>
                                <option value="All">All Actors</option>
                                {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select className="ev-filter-select" value={selectedTurnFilter} onChange={(e) => setSelectedTurnFilter(e.target.value)}>
                                <option value="All">All Turns</option>
                                {turnOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <button className="ev-clear-btn" onClick={handleClearFilters}>
                                Clear Filters
                            </button>
                        </div>

                        <div className="ev-stats-section">
                            <h2 className="ev-stats-title">Event Type Distribution</h2>
                            <div className="ev-stats-table-wrapper">
                                <table className="ev-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Event Type</th>
                                            <th>Count</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableStats.typeStats.map(([type, count]) => {
                                            const percent = ((count / tableStats.total) * 100).toFixed(1);
                                            return (
                                                <tr key={type}>
                                                    <td style={{ fontWeight: 500, color: '#334155' }}>{type}</td>
                                                    <td>{count}</td>
                                                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{percent}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="ev-stats-section">
                            <h2 className="ev-stats-title">Actor Activity</h2>
                            <div className="ev-stats-table-wrapper">
                                <table className="ev-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Actor</th>
                                            <th>Messages Sent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableStats.actorStats.map(([actor, count]) => (
                                            <tr key={actor}>
                                                <td>
                                                    <span className={`ev-actor-pill pill-${actor.toLowerCase()}`}>
                                                        {actor}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600, color: '#334155' }}>{count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                selectedConv && activeTab === 'Plans' && (
                    <div className="ev-plans-view">
                        {plansData.length === 0 ? (
                            <div className="ev-empty-state">
                                <Play size={48} opacity={0.2} />
                                <h3>No plans found for this session</h3>
                                <p>The orchestrator may have skipped the planning phase for this specific query.</p>
                            </div>
                        ) : (
                            <div className="ev-plans-list">
                                {plansData.map((plan, pIdx) => (
                                    <div key={plan.id} className="ev-plan-card">
                                        <div className="ev-plan-header">
                                            <div className="ev-plan-title-group">
                                                <span className="ev-plan-badge">
                                                    {plan.type === 'INITIAL_PLAN_PRESENTED' ? 'INITIAL PLAN' : 'REVISED PLAN'}
                                                </span>
                                                <h3>Turn: {plan.turn_id}</h3>
                                            </div>
                                            <div className={`ev-plan-mode mode-${plan.mode}`}>
                                                {plan.mode.toUpperCase()} EXECUTION
                                            </div>
                                        </div>

                                        <div className="ev-plan-explanation" dangerouslySetInnerHTML={{ __html: plan.explanation }} />

                                        {plan.steps && plan.steps.length > 0 && (
                                            <div className="ev-plan-steps">
                                                <h4>Execution Steps ({plan.steps.length})</h4>
                                                <div className="ev-steps-grid">
                                                    {plan.steps.map((step, sIdx) => (
                                                        <div key={step.id || sIdx} className="ev-step-item">
                                                            <div className="ev-step-number">{sIdx + 1}</div>
                                                            <div className="ev-step-content">
                                                                <div className="ev-step-meta">
                                                                    <span className="ev-step-agent">{step.agent?.toUpperCase()}</span>
                                                                    {step.depends_on && step.depends_on.length > 0 && (
                                                                        <span className="ev-step-dep">Depends on: {step.depends_on.join(', ')}</span>
                                                                    )}
                                                                </div>
                                                                <div className="ev-step-query">{step.query}</div>
                                                                {step.dependency_explanation && (
                                                                    <div className="ev-step-reason">{step.dependency_explanation}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="ev-plan-footer">
                                            <span className="ev-plan-time">{plan.timestamp}</span>
                                            <button className="ev-icon-btn" onClick={() => setPreviewContent(JSON.stringify(plan.raw, null, 2))}>
                                                <Eye size={16} /> Raw JSON
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            }

            {
                previewContent && (
                    <div className="ev-modal-overlay" onClick={() => setPreviewContent(null)}>
                        <div className="ev-modal-content custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                            <div className="ev-modal-header">
                                <h3>Content Preview</h3>
                                <button className="ev-icon-btn" onClick={() => setPreviewContent(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="ev-modal-body">
                                {renderModalContent(previewContent)}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default EventVisualizer;
