import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import '../dashboard/dashboard.css';

const RecentFailures = ({ conversations }) => {
    const failedConversations = conversations?.filter(c => c.status === 'failed') || [];

    return (
        <div className="card recent-failures-card">
            <div className="card-title">
                <XCircle size={18} className="text-red-500" />
                Recent Failures (Last 24h)
            </div>

            {failedConversations.length > 0 ? (
                <div className="failures-table-container">
                    <table className="failures-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', fontSize: '12px', textAlign: 'left', color: '#6b7280' }}>
                                <th style={{ padding: '8px' }}>Conversation ID</th>
                                <th style={{ padding: '8px' }}>Time</th>
                                <th style={{ padding: '8px' }}>Error Type</th>
                                <th style={{ padding: '8px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {failedConversations.map((conv) => (
                                <tr key={conv.conversation_id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                                    <td style={{ padding: '8px', fontFamily: 'monospace' }}>{conv.conversation_id.substring(0, 8)}...</td>
                                    <td style={{ padding: '8px' }}>{new Date(conv.created_at).toLocaleTimeString()}</td>
                                    <td style={{ padding: '8px', color: '#ef4444' }}>Plan Generation Failed</td>
                                    <td style={{ padding: '8px' }}>
                                        <button style={{
                                            padding: '4px 8px', background: 'transparent', border: '1px solid #d1d5db',
                                            borderRadius: '4px', cursor: 'pointer', fontSize: '11px'
                                        }}>Debug</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    <div style={{ marginBottom: '8px' }}>No recent failures detected</div>
                </div>
            )}
        </div>
    );
};

export default RecentFailures;
