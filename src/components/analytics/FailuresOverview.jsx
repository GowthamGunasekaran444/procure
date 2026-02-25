import React, { useState } from 'react';
import { AlertCircle, XOctagon, RotateCcw, Clock, Info, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const FailuresOverview = ({ failedConversations, turnFailures }) => {
    const [page, setPage] = useState(1);
    const pageSize = 20;

    if (!failedConversations || !turnFailures) return null;

    const totalPages = Math.ceil(failedConversations.failed_details.length / pageSize);
    const paginatedDetails = failedConversations.failed_details.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            {/* Top Stats - Now separate to give more space for log */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <XOctagon size={20} color="#ef4444" />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Conversation Failures</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#991b1b', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>{failedConversations.total_conversations}</div>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#991b1b', textTransform: 'uppercase', marginBottom: '4px' }}>Failed</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>{failedConversations.failed_conversations}</div>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>Success</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{failedConversations.success_rate}%</div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <RotateCcw size={20} color="#f59e0b" />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Turn Execution Health</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Turns</div>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>{turnFailures.total_turns}</div>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#9a3412', textTransform: 'uppercase', marginBottom: '4px' }}>Failed</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>{turnFailures.failed_turns}</div>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#991b1b', textTransform: 'uppercase', marginBottom: '4px' }}>Failure %</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>{turnFailures.failure_rate}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Log & Failure Analysis - Full width now */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Event Log: Failures (Paginated)</h4>
                    {paginatedDetails.length > 0 ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '300px' }}>
                                {paginatedDetails.map((detail, i) => (
                                    <div key={i} style={{
                                        padding: '12px',
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        border: '1px solid #fee2e2',
                                        borderLeft: '4px solid #ef4444',
                                        fontFamily: 'monospace'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#991b1b' }}>
                                            <span style={{ fontWeight: 700 }}>SESSION_FAIL</span>
                                            <span style={{ opacity: 0.6 }}>LOG_ID: {detail.conversation_id.slice(-6)}</span>
                                        </div>
                                        <div style={{ color: '#1e293b', marginBottom: '2px' }}>
                                            <span style={{ color: '#ef4444' }}>CONV_ID:</span> {detail.conversation_id}
                                        </div>
                                        <div style={{ color: '#64748b' }}>
                                            <span style={{ color: '#ef4444' }}>REASON:</span> {detail.reason}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Page {page} of {totalPages}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button onClick={() => setPage(1)} disabled={page === 1} className="icon-btn-sm" style={{ opacity: page === 1 ? 0.3 : 1 }}><ChevronsLeft size={14} /></button>
                                        <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1} className="icon-btn-sm" style={{ opacity: page === 1 ? 0.3 : 1 }}><ChevronLeft size={14} /></button>
                                        <button onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="icon-btn-sm" style={{ opacity: page === totalPages ? 0.3 : 1 }}><ChevronRight size={14} /></button>
                                        <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="icon-btn-sm" style={{ opacity: page === totalPages ? 0.3 : 1 }}><ChevronsRight size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 40px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>
                            <CheckCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                            <div>All systems operational. No records to display.</div>
                        </div>
                    )}
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>Failure Categorization</h4>
                    <div style={{ marginBottom: '24px' }}>
                        <h5 style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>By Mode</h5>
                        {Object.entries(turnFailures.failures_by_mode).map(([mode, count]) => (
                            <div key={mode} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#1e293b', marginBottom: '8px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>{mode}</span>
                                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{count}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h5 style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>By Type</h5>
                        {Object.entries(turnFailures.failures_by_type).map(([type, count]) => (
                            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={type}>{type.replace('ERROR_', '').replace('_', ' ')}</span>
                                <span style={{ fontWeight: 700 }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FailuresOverview;
