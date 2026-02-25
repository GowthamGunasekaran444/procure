import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, ChevronDown, ChevronRight, AlertCircle, ChevronLeft,
    ChevronsLeft, ChevronsRight, Filter, X, CornerDownRight,
    Maximize2, Copy, Download, Clock, User as UserIcon, List
} from 'lucide-react';

const DataExplorer = ({ title, data = [], columns, renderExpandedRow, pageSize: initialPageSize = 20, showFilters = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    const [modalRow, setModalRow] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [isScrolledX, setIsScrolledX] = useState(false);

    const filterOptions = useMemo(() => {
        if (!showFilters) return {};
        const options = {
            type: new Set(),
            sender: new Set(),
            receiver: new Set(),
            user_id: new Set()
        };

        data.forEach(row => {
            if (row.type) options.type.add(row.type);
            if (row.sender) options.sender.add(row.sender);
            if (row.receiver) options.receiver.add(row.receiver);
            if (row.user_id) options.user_id.add(row.user_id);
        });

        return {
            type: Array.from(options.type).sort(),
            sender: Array.from(options.sender).sort(),
            receiver: Array.from(options.receiver).sort(),
            user_id: Array.from(options.user_id).sort()
        };
    }, [data, showFilters]);

    const filteredData = useMemo(() => {
        let result = data;

        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key]) {
                result = result.filter(row => String(row[key]) === String(activeFilters[key]));
            }
        });

        if (!searchTerm) return result;
        const lowSearch = searchTerm.toLowerCase();
        return result.filter(row => {
            return columns.some(col => {
                const val = col.accessor ? row[col.accessor] : col.render ? col.render(row) : '';
                if (typeof val === 'string' || typeof val === 'number') {
                    return String(val).toLowerCase().includes(lowSearch);
                }
                return JSON.stringify(row).toLowerCase().includes(lowSearch);
            });
        });
    }, [data, searchTerm, columns, activeFilters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const handleCopyId = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleScroll = (e) => {
        setIsScrolledX(e.target.scrollLeft > 0);
    };

    const Modal = ({ row }) => {
        if (!row) return null;

        return createPortal(
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '2vh 2vw',
                animation: 'modalFadeIn 0.3s ease-out'
            }} onClick={() => setModalRow(null)}>
                <div style={{
                    width: '95vw',
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    borderRadius: '32px',
                    boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    position: 'relative',
                    animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }} onClick={e => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div style={{
                        padding: '24px 48px',
                        background: 'linear-gradient(to right, #ffffff, #f8fafc)',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 12px 24px -6px rgba(59, 130, 246, 0.5)'
                            }}>
                                <Maximize2 size={28} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                                    Enterprise Log Analysis
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Message Index Detail</span>
                                    <code style={{ fontSize: '13px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                                        {row._id || row.id}
                                    </code>
                                    <button
                                        onClick={() => handleCopyId(row._id || row.id)}
                                        style={{ background: 'none', border: 'none', color: copySuccess ? '#10b981' : '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800 }}
                                    >
                                        <Copy size={14} /> {copySuccess ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '14px', fontWeight: 700, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                                <Download size={18} /> Export Results
                            </button>
                            <button
                                onClick={() => setModalRow(null)}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.4)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '60px',
                        background: '#ffffff',
                        backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }} className="custom-scrollbar">
                        <div style={{ minWidth: 'min-content' }}>
                            {renderExpandedRow(row)}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                        padding: '24px 48px',
                        background: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', gap: '48px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                <span style={{ fontSize: '13px', color: '#64748b' }}>Precision: <strong>High Resolution</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={16} style={{ color: '#94a3b8' }} />
                                <span style={{ fontSize: '13px', color: '#64748b' }}>Analyzed at: <strong>{new Date().toLocaleTimeString()}</strong></span>
                            </div>
                        </div>
                        <button
                            onClick={() => setModalRow(null)}
                            style={{
                                padding: '14px 48px',
                                borderRadius: '16px',
                                border: 'none',
                                background: '#0f172a',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '15px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Return to Grid
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    if (!data || data.length === 0) {
        return (
            <div className="card" style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>No Data Stream Found</h3>
                <p style={{ fontSize: '15px', marginTop: '12px' }}>The current selection has no records to display.</p>
            </div>
        );
    }

    return (
        <div className="card" style={{
            overflow: 'hidden',
            padding: 0,
            border: '1px solid #e2e8f0',
            borderRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '0',
            height: '80vh',
            minHeight: '500px',
            maxHeight: '1200px',
            backgroundColor: '#ffffff',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1)',
            position: 'relative'
        }}>
            <Modal row={modalRow} />

            {/* Main Header Area - Compacted */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showFilters ? '16px' : 0 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.04em' }}>{title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0f9ff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e0f2fe' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0ea5e9', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontSize: '10px', color: '#0369a1', fontWeight: 800, textTransform: 'uppercase' }}>Live Matrix</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                                <strong>{filteredData.length}</strong> total interactions
                            </span>
                        </div>
                    </div>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Quick lookup..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 16px 10px 44px',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '13px',
                                outline: 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backgroundColor: '#fcfcfd',
                                fontWeight: 600
                            }}
                        />
                    </div>
                </div>

                {showFilters && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <Filter size={12} style={{ color: '#3b82f6' }} /> Filters
                        </div>
                        {['type', 'sender', 'receiver', 'user_id'].map(key => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <div style={{ fontSize: '8px', fontWeight: 950, color: '#3b82f6', position: 'absolute', top: '-7px', left: '10px', background: '#fff', padding: '0 4px', zIndex: 1, textTransform: 'uppercase' }}>{key.replace('_', ' ')}</div>
                                <select
                                    value={activeFilters[key] || ''}
                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '12px',
                                        backgroundColor: activeFilters[key] ? '#f0f7ff' : '#fff',
                                        color: activeFilters[key] ? '#2563eb' : '#1e293b',
                                        minWidth: '130px',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        outline: 'none',
                                        paddingRight: '28px'
                                    }}
                                >
                                    <option value="">ALL SYSTEMS</option>
                                    {filterOptions[key]?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <ChevronDown size={10} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Responsive Table Scroll Container */}
            <div
                style={{
                    overflow: 'auto',
                    flex: 1,
                    background: '#fff',
                    position: 'relative'
                }}
                className="custom-scrollbar explorer-table-viewport"
                onScroll={handleScroll}
            >
                <table className="drilldown-table" style={{
                    width: 'max-content',
                    minWidth: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    tableLayout: 'auto'
                }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                        <tr style={{ background: '#f8fafc' }}>
                            {renderExpandedRow && (
                                <th style={{
                                    width: '60px',
                                    paddingLeft: '24px',
                                    background: '#f8fafc',
                                    borderBottom: '2px solid #e2e8f0',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 110,
                                    boxShadow: isScrolledX ? '4px 0 8px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'box-shadow 0.2s'
                                }}></th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx} style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontWeight: '950',
                                    color: '#475569',
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderBottom: '2px solid #e2e8f0',
                                    background: '#f8fafc',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ background: '#fff' }}>
                        {paginatedData.length > 0 ? paginatedData.map((row, rowIndex) => {
                            const rowId = row._id || row.id || rowIndex;

                            return (
                                <tr
                                    key={rowId}
                                    onClick={() => renderExpandedRow && setModalRow(row)}
                                    style={{
                                        cursor: renderExpandedRow ? 'pointer' : 'default',
                                        transition: 'all 0.2s ease-in-out',
                                        background: 'inherit'
                                    }}
                                    className="premium-interactive-row"
                                >
                                    {renderExpandedRow && (
                                        <td style={{
                                            paddingLeft: '24px',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 25,
                                            background: 'inherit',
                                            boxShadow: isScrolledX ? '4px 0 8px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'box-shadow 0.2s'
                                        }}>
                                            <div className="maximize-trigger-icon" style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                backgroundColor: '#f1f5f9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#64748b',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <Maximize2 size={14} />
                                            </div>
                                        </td>
                                    )}
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} style={{
                                            padding: '12px 16px',
                                            color: colIndex === 0 ? '#0f172a' : '#475569',
                                            fontWeight: colIndex === 0 ? 800 : 500,
                                            fontSize: '12px',
                                            borderBottom: '1px solid #f8fafc',
                                            whiteSpace: 'nowrap',
                                            background: 'inherit'
                                        }}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={columns.length + (renderExpandedRow ? 1 : 0)} style={{ padding: '60px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                        <Search size={40} style={{ color: '#cbd5e1' }} />
                                        <div style={{ fontWeight: 900, fontSize: '18px', color: '#1e293b' }}>No Records Found</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Pagination Controls Area - Compacted */}
            <div style={{
                padding: '12px 32px',
                borderTop: '2px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                zIndex: 150,
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                        Batch <strong style={{ color: '#0f172a', fontSize: '14px' }}>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                        <List size={12} style={{ color: '#94a3b8' }} />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Show:</span>
                        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
                            {[10, 20, 50, 100].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setPageSize(size)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: pageSize === size ? '#fff' : 'transparent',
                                        color: pageSize === size ? '#3b82f6' : '#64748b',
                                        boxShadow: pageSize === size ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="nav-btn-v3" title="First Batch"><ChevronsLeft size={16} /></button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="nav-btn-v3-rect"
                        >
                            <ChevronLeft size={16} /> Earlier
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />

                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="nav-btn-v3-rect"
                        >
                            Later <ChevronRight size={16} />
                        </button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="nav-btn-v3" title="Latest Batch"><ChevronsRight size={16} /></button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes modalFadeIn {
                    from { opacity: 0; backdrop-filter: blur(0); }
                    to { opacity: 1; backdrop-filter: blur(16px); }
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(60px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .premium-interactive-row:hover {
                    background-color: #f8fafc !important;
                }
                .premium-interactive-row:hover .maximize-trigger-icon {
                    background-color: #3b82f6 !important;
                    color: #ffffff !important;
                    box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
                    transform: scale(1.1);
                }
                .nav-btn-v3 {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .nav-btn-v3:hover:not(:disabled) {
                    background-color: #f8fafc;
                    border-color: #3b82f6;
                    color: #3b82f6;
                }
                .nav-btn-v3-rect {
                    padding: 0 16px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: #1e293b;
                    font-weight: 800;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                .nav-btn-v3-rect:hover:not(:disabled) {
                    background-color: #0f172a;
                    color: #ffffff;
                    border-color: #0f172a;
                }
                .nav-btn-v3:disabled, .nav-btn-v3-rect:disabled {
                    cursor: not-allowed;
                    background: #fcfcfd;
                    border-color: #f1f5f9;
                    color: #cbd5e1;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 5px;
                    border: 2px solid #f1f5f9;
                }
            `}} />
        </div>
    );
};

export default DataExplorer;
