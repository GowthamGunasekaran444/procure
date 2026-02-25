import { AlertCircle, XOctagon, RotateCcw, Clock, Info, CheckCircle } from 'lucide-react';

const FailuresOverview = ({ failedConversations, turnFailures }) => {
    if (!failedConversations || !turnFailures) return null;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Failed Conversations & Details */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <XOctagon size={20} color="#ef4444" />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Conversation Failures</h3>
                    </div>
                    <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                        <Info size={16} color="#94a3b8" />
                        <div className="tooltip-content right">
                            Tracking of complete user sessions that ended prematurely or encountered fatal errors.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
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

                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                    <h4 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Event Log: Failures</h4>
                    {failedConversations.failed_details.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {failedConversations.failed_details.map((detail, i) => (
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
                                        <span style={{ opacity: 0.6 }}>{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ color: '#1e293b', marginBottom: '2px' }}>
                                        <span style={{ color: '#ef4444' }}>ERR_ID:</span> {detail.conversation_id}
                                    </div>
                                    <div style={{ color: '#64748b' }}>
                                        <span style={{ color: '#ef4444' }}>REASON:</span> {detail.reason}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '30px 20px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '16px',
                            color: '#94a3b8',
                            fontSize: '12px',
                            border: '1px dashed #e2e8f0'
                        }}>
                            <CheckCircle size={24} color="#10b981" style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <div>All systems operational. No session failures detected.</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Turn-Level Failures */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <RotateCcw size={20} color="#f59e0b" />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Turn Execution Health</h3>
                    </div>
                    <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                        <Info size={16} color="#94a3b8" />
                        <div className="tooltip-content right">
                            Monitoring of individual interaction steps (turns) to identify specific point-of-failure clusters.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <h4 style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>By Mode</h4>
                        {Object.entries(turnFailures.failures_by_mode).map(([mode, count]) => (
                            <div key={mode} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#1e293b', marginBottom: '4px' }}>
                                <span>{mode}</span>
                                <span style={{ fontWeight: 700 }}>{count}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>By Type</h4>
                        {Object.entries(turnFailures.failures_by_type).map(([type, count]) => (
                            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
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
