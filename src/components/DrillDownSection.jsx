import React, { useState } from 'react';
import { Users, AlertCircle, Cpu, MessageSquare, Search, Filter, Calendar, X } from 'lucide-react';

const DrillDownSection = ({ drillDown }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [failureView, setFailureView] = useState('hour'); // 'hour' or 'day'

    // Search and filter states for conversations (input states)
    const [searchId, setSearchId] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Applied filter states (those actually used for filtering)
    const [appliedSearchId, setAppliedSearchId] = useState('');
    const [appliedFilterStatus, setAppliedFilterStatus] = useState('all');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');

    if (!drillDown) return null;

    const handleSearch = () => {
        setAppliedSearchId(searchId);
        setAppliedFilterStatus(filterStatus);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    const handleReset = () => {
        setSearchId('');
        setFilterStatus('all');
        setStartDate('');
        setEndDate('');
        setAppliedSearchId('');
        setAppliedFilterStatus('all');
        setAppliedStartDate('');
        setAppliedEndDate('');
    };

    const tabs = [
        { id: 'users', label: 'Top Users', icon: Users, data: drillDown.drill_down_data?.top_users },
        { id: 'failures', label: 'Failure Correlations', icon: AlertCircle, data: failureView === 'hour' ? drillDown.failure_correlations?.by_hour : drillDown.failure_correlations?.by_day },
        { id: 'agents', label: 'Agent Complexity', icon: Cpu, data: drillDown.agent_complexity_correlation },
        { id: 'conversations', label: 'Recent Conversations', icon: MessageSquare, data: drillDown.recent_conversations },
    ];

    const filteredConversations = (drillDown.recent_conversations || []).filter(conv => {
        const matchesId = conv.conversation_id.toLowerCase().includes(appliedSearchId.toLowerCase());
        const matchesStatus = appliedFilterStatus === 'all' || conv.status === appliedFilterStatus;

        const convDate = new Date(conv.created_at);
        const matchesStartDate = !appliedStartDate || convDate >= new Date(appliedStartDate);
        const matchesEndDate = !appliedEndDate || convDate <= new Date(appliedEndDate + 'T23:59:59');

        return matchesId && matchesStatus && matchesStartDate && matchesEndDate;
    });

    const renderTable = () => {
        const activeTabObj = tabs.find(t => t.id === activeTab);
        let activeData = activeTabObj?.data;

        if (activeTab === 'conversations') {
            activeData = filteredConversations;
        }

        if (!activeData || activeData.length === 0) return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No data available for this view.</div>;

        switch (activeTab) {
            case 'users':
                return (
                    <table className="drilldown-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Conversations</th>
                                <th>Last Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeData.map((user, i) => (
                                <tr key={i}>
                                    <td><code style={{ fontSize: '12px', color: '#4b5563' }}>{user.user_id}</code></td>
                                    <td style={{ fontWeight: 600 }}>{user.conversation_count}</td>
                                    <td style={{ color: '#6b7280', fontSize: '13px' }}>{new Date(user.last_activity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'failures':
                return (
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '0 4px' }}>
                            <button
                                onClick={() => setFailureView('hour')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: failureView === 'hour' ? '#3b82f6' : '#fff',
                                    color: failureView === 'hour' ? '#fff' : '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                By Hour
                            </button>
                            <button
                                onClick={() => setFailureView('day')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: failureView === 'day' ? '#3b82f6' : '#fff',
                                    color: failureView === 'day' ? '#fff' : '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                By Day
                            </button>
                        </div>
                        <table className="drilldown-table">
                            <thead>
                                <tr>
                                    <th>{failureView === 'hour' ? 'Hour' : 'Day'}</th>
                                    <th>Total Conversions</th>
                                    <th>Failed</th>
                                    <th>Failure Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeData.map((item, i) => (
                                    <tr key={i}>
                                        <td>{failureView === 'hour' ? `${item.hour}:00` : item.day}</td>
                                        <td>{item.total_conversations}</td>
                                        <td style={{ color: item.failed > 0 ? '#ef4444' : '#10b981' }}>{item.failed}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ flex: 1, height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px' }}>
                                                    <div style={{ width: `${item.failure_rate}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: '3px' }}></div>
                                                </div>
                                                <span style={{ fontSize: '12px' }}>{item.failure_rate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'agents':
                return (
                    <table className="drilldown-table">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>Avg Plan Complexity</th>
                                <th>Avg Agents / Plan</th>
                                <th>Usage Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeData.map((agent, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{agent.agent}</td>
                                    <td>{agent.avg_plan_complexity}</td>
                                    <td>{agent.avg_agents_per_plan}</td>
                                    <td>{agent.usage_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'conversations':
                return (
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '0 4px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px' }}>
                                <Search size={16} color="#64748b" />
                                <input
                                    type="text"
                                    placeholder="Conversation ID"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 150px' }}>
                                <Filter size={16} color="#64748b" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '2 1 300px' }}>
                                <Calendar size={16} color="#64748b" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                                />
                                <span style={{ color: '#94a3b8' }}>to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={handleSearch}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#3b82f6',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                >
                                    <Search size={14} /> Search
                                </button>
                                {(searchId || filterStatus !== 'all' || startDate || endDate) && (
                                    <button
                                        onClick={handleReset}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #fee2e2',
                                            backgroundColor: '#fef2f2',
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={14} /> Reset
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="drilldown-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Created At</th>
                                        <th>Query excerpt</th>
                                        <th>Has Plan</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeData.map((conv, i) => (
                                        <tr key={i}>
                                            <td><code style={{ fontSize: '11px' }}>{conv.conversation_id.substring(0, 8)}...</code></td>
                                            <td style={{ fontSize: '12px' }}>{new Date(conv.created_at).toLocaleString()}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>{conv.user_query}</td>
                                            <td>{conv.has_plan ? '✅' : '❌'}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    backgroundColor: conv.status === 'success' ? '#ecfdf5' : '#fef2f2',
                                                    color: conv.status === 'success' ? '#059669' : '#b91c1c'
                                                }}>
                                                    {conv.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card drill-down-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>
            <div style={{ padding: '20px', maxHeight: '550px', overflowY: 'auto' }}>
                {renderTable()}
            </div>
        </div>
    );
};

export default DrillDownSection;
