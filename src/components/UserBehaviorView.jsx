import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jsonData from '../assets/output.json';
import { Users, Search, MoreHorizontal, Mail, MapPin, Briefcase, Building2, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const UserBehaviorView = ({ timeRange, allUsers = [] }) => {
    const data = jsonData[timeRange] || jsonData['1h'];
    const userBehavior = data.analytics.user_behavior;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Merge and prepare user data
    const processedUsers = useMemo(() => {
        const segments = [
            { key: 'power_users', label: 'Power User', color: '#8b5cf6' },
            { key: 'regular_users', label: 'Regular User', color: '#3b82f6' },
            { key: 'casual_users', label: 'Casual User', color: '#10b981' }
        ];

        let unified = [];
        segments.forEach(seg => {
            const segUsers = userBehavior.segmentation[seg.key]?.users || [];
            segUsers.forEach(u => {
                // Find matching user in allUsers for additional details
                const detail = allUsers.find(au => au.email?.toLowerCase() === u.email?.toLowerCase());
                unified.push({
                    ...u,
                    id: detail?._id || 'N/A',
                    firstName: detail?.first_name || u.name.split(' ')[0],
                    lastName: detail?.last_name || u.name.split(' ')[1] || '',
                    department: detail?.department || 'N/A',
                    designation: detail?.designation || 'N/A',
                    segment: seg.label,
                    segmentColor: seg.color
                });
            });
        });

        // Add users from allUsers that might not be in the current time-range segments (as Inactive)
        allUsers.forEach(au => {
            if (!unified.find(u => u.email?.toLowerCase() === au.email?.toLowerCase())) {
                unified.push({
                    name: `${au.first_name} ${au.last_name}`,
                    email: au.email,
                    id: au._id,
                    firstName: au.first_name,
                    lastName: au.last_name,
                    department: au.department || 'N/A',
                    designation: au.designation || 'N/A',
                    conversations: 0,
                    avg_complexity: 0,
                    total_plans: 0,
                    segment: 'Inactive',
                    segmentColor: '#94a3b8'
                });
            }
        });

        return unified;
    }, [userBehavior, allUsers]);

    // Filter based on search
    const filteredUsers = useMemo(() => {
        return processedUsers.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [processedUsers, searchTerm]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

    const segmentation = [
        { name: 'Power Users', value: userBehavior.segmentation.power_users.count, color: '#8b5cf6' },
        { name: 'Regular Users', value: userBehavior.segmentation.regular_users.count, color: '#3b82f6' },
        { name: 'Casual Users', value: userBehavior.segmentation.casual_users.count, color: '#10b981' }
    ];

    const totalUsers = userBehavior.total_active_users;

    return (
        <div className="user-behavior-view" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#111827', fontWeight: 700, fontSize: '24px' }}>User Behavior & Engagement</h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Insights into user interaction patterns and segmentation</p>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', margin: 0 }}>
                    <div style={{ background: '#eef2ff', padding: '8px', borderRadius: '50%', color: '#4f46e5' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Total Active Users</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{totalUsers}</div>
                    </div>
                </div>
            </div>

            {/* Changed to separate lines as requested */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h4 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        User Segmentation
                    </h4>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segmentation}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {segmentation.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <h4 className="card-title" style={{ marginBottom: '20px' }}>Engagement Insights</h4>
                    <div style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.7' }}>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', marginBottom: '20px' }}>
                            <p style={{ margin: 0 }}>
                                Most users are currently categorized as <strong style={{ color: '#10b981' }}>Casual Users</strong> ({segmentation[2].value}).
                            </p>
                        </div>

                        <p style={{ fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Recommended Strategies:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start', padding: '16px', background: '#f1f5f9', borderRadius: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }}>1</div>
                                <span>Launch <strong>onboarding campaigns</strong> tailored for casual users to showcase advanced features.</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start', padding: '16px', background: '#f1f5f9', borderRadius: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f620', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }}>2</div>
                                <span>Send <strong>feature highlighting</strong> digests to regular users to transition them to power users.</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start', padding: '16px', background: '#f1f5f9', borderRadius: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#8b5cf620', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }}>3</div>
                                <span>Implement <strong>loyalty recognition</strong> for power users to maintain high engagement levels.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', overflow: 'visible' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h4 className="card-title" style={{ margin: 0 }}>Detailed User Base</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Showing {paginatedUsers.length} of {filteredUsers.length} total users</p>
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by name, email, department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 36px',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#f8fafc'
                            }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto', margin: '0 -24px' }} className="custom-scrollbar">
                    <table className="drilldown-table" style={{ borderTop: '1px solid #f1f5f9', minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '24px' }}>User Details</th>
                                <th>Org Context</th>
                                <th>Unique User ID</th>
                                <th>Segment</th>
                                <th style={{ textAlign: 'center' }}>Engagement</th>
                                <th style={{ textAlign: 'center', paddingRight: '24px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? paginatedUsers.map((u, i) => (
                                <tr key={u.id}>
                                    <td style={{ paddingLeft: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={10} /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                                <Building2 size={12} /> {u.department}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                                                <Briefcase size={12} /> {u.designation}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#475569' }}>
                                            {u.id}
                                        </code>
                                    </td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            background: `${u.segmentColor}15`,
                                            color: u.segmentColor,
                                            border: `1px solid ${u.segmentColor}30`
                                        }}>
                                            {u.segment}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                            <div title="Conversations">
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{u.conversations}</div>
                                                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94a3b8' }}>Conv</div>
                                            </div>
                                            <div title="Execution Plans">
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{u.total_plans}</div>
                                                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94a3b8' }}>Plans</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', paddingRight: '24px' }}>
                                        <button className="icon-btn" style={{ padding: '8px' }}>
                                            < MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                        <Search size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                        <div>No users found matching "{searchTerm}"</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', margin: '0 -24px -24px -24px', borderRadius: '0 0 16px 16px' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="icon-btn"
                                style={{ padding: '8px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f1f5f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: '#64748b' }}
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f1f5f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === totalPages ? '#f1f5f9' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="icon-btn"
                                style={{ padding: '8px', border: '1px solid #e2e8f0', background: currentPage === totalPages ? '#f1f5f9' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: '#64748b' }}
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBehaviorView;
