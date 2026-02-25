import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, User, ArrowRight, Info } from 'lucide-react';

const UserBehavior = ({ behavior }) => {
    if (!behavior) return null;

    const segmentationData = Object.entries(behavior.segmentation).map(([key, val]) => ({
        name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: val.count,
        percentage: val.percentage
    }));

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    const renderUserTable = (users, title, tooltip) => (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{title}</h4>
                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                    <Info size={12} color="#94a3b8" />
                    <div className="tooltip-content left">
                        {tooltip}
                    </div>
                </div>
            </div>
            <table className="drilldown-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th style={{ textAlign: 'center' }}>Conversations</th>
                        <th style={{ textAlign: 'center' }}>Avg Complexity</th>
                        <th style={{ textAlign: 'center' }}>Total Plans</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map((u, i) => (
                        <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td style={{ color: '#64748b', fontSize: '12px' }}>{u.email}</td>
                            <td style={{ textAlign: 'center' }}>{u.conversations}</td>
                            <td style={{ textAlign: 'center' }}>{u.avg_complexity.toFixed(1)}</td>
                            <td style={{ textAlign: 'center' }}>{u.total_plans}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No users in this segment</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={20} color="#8b5cf6" />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>User Behavior & Segmentation</h3>
                </div>
                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                    <Info size={16} color="#94a3b8" />
                    <div className="tooltip-content right">
                        Categorization of users based on their interaction frequency and query complexity.
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                <div>
                    <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>User Segments</h4>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segmentationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {segmentationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ marginTop: '24px', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', backgroundColor: '#fdfaff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b21a8', fontWeight: 600, marginBottom: '12px', fontSize: '13px' }}>
                            <ArrowRight size={14} />
                            User Journey Insight
                        </div>
                        {behavior.user_journey.user.name !== "N/A" ? (
                            <div style={{ fontSize: '12px' }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{behavior.user_journey.user.name}</div>
                                <div style={{ color: '#64748b' }}>{behavior.user_journey.user.conversations} conversations analyzed</div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                                No specific journey trends identified in this time range.
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {renderUserTable(behavior.segmentation.power_users.users, "Power Users", "Users with frequent interactions (3+ conversations).")}
                    {renderUserTable(behavior.segmentation.regular_users.users, "Regular Users", "Users with moderate interaction frequency (2 conversations).")}
                    {renderUserTable(behavior.segmentation.casual_users.users, "Casual Users", "Users with infrequent interactions (1 conversation).")}
                </div>
            </div>
        </div>
    );
};

export default UserBehavior;
