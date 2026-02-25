import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';
import { Users, Route, Zap, PieChart, Activity, Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AgentRouting = ({ routing }) => {
    const [activeTab, setActiveTab] = useState('performance');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    if (!routing) return null;

    const formatArray = (arr) => Array.isArray(arr) ? arr.join(", ") : arr;

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const Pagination = ({ total, current, onChange }) => {
        const totalPages = Math.ceil(total / pageSize);
        if (totalPages <= 1) return null;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Page {current} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => onChange(1)} disabled={current === 1} className="icon-btn-sm" style={{ opacity: current === 1 ? 0.3 : 1 }}><ChevronsLeft size={14} /></button>
                    <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="icon-btn-sm" style={{ opacity: current === 1 ? 0.3 : 1 }}><ChevronLeft size={14} /></button>
                    <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages} className="icon-btn-sm" style={{ opacity: current === totalPages ? 0.3 : 1 }}><ChevronRight size={14} /></button>
                    <button onClick={() => onChange(totalPages)} disabled={current === totalPages} className="icon-btn-sm" style={{ opacity: current === totalPages ? 0.3 : 1 }}><ChevronsRight size={14} /></button>
                </div>
            </div>
        );
    };

    const paginate = (data) => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };

    const renderPerformanceTable = () => {
        const paginated = paginate(routing.agent_performance);
        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="drilldown-table">
                    <thead>
                        <tr>
                            <th>Agent</th>
                            <th>Invocations</th>
                            <th>Success Rate</th>
                            <th>Avg Latency</th>
                            <th>Query Types</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 600 }}>{item.agent}</td>
                                <td>{item.total_invocations}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: item.success_rate > 80 ? '#f0fdf4' : '#fef2f2',
                                        color: item.success_rate > 80 ? '#166534' : '#991b1b',
                                        fontSize: '11px',
                                        fontWeight: 600
                                    }}>
                                        {item.success_rate}%
                                    </span>
                                </td>
                                <td>{item.avg_latency_seconds.toFixed(2)}s</td>
                                <td style={{ fontSize: '12px', color: '#64748b' }}>{formatArray(item.query_types)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination total={routing.agent_performance.length} current={page} onChange={setPage} />
            </div>
        );
    };

    const renderRoutingPatterns = () => {
        const paginated = paginate(routing.routing_patterns);
        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="drilldown-table">
                    <thead>
                        <tr>
                            <th>Query Pattern</th>
                            <th>Assigned Agent</th>
                            <th>Usage Count</th>
                            <th>Usage %</th>
                            <th>Success Rate</th>
                            <th>Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.query_pattern}</td>
                                <td style={{ fontWeight: 600 }}>{item.agent}</td>
                                <td>{item.usage_count}</td>
                                <td>{item.usage_percentage}%</td>
                                <td>{item.success_rate}%</td>
                                <td>{item.avg_latency_seconds}s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination total={routing.routing_patterns.length} current={page} onChange={setPage} />
            </div>
        );
    };

    const renderCombinations = () => {
        const paginated = paginate(routing.agent_combinations);
        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="drilldown-table">
                    <thead>
                        <tr>
                            <th>Agents Involved</th>
                            <th>Execution Count</th>
                            <th>Avg Latency</th>
                            <th>Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 600 }}>
                                    {item.agents.map(agent => (
                                        <span key={agent} style={{
                                            backgroundColor: '#eff6ff',
                                            color: '#2563eb',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            marginRight: '4px',
                                            fontSize: '11px'
                                        }}>
                                            {agent}
                                        </span>
                                    ))}
                                </td>
                                <td>{item.count}</td>
                                <td>{item.avg_latency_seconds}s</td>
                                <td>{item.success_rate}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination total={routing.agent_combinations.length} current={page} onChange={setPage} />
            </div>
        );
    };

    const renderUtilization = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {routing.utilization_insights.underutilized.map((item, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #fee2e2', borderRadius: '12px', backgroundColor: '#fffafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 600, marginBottom: '8px' }}>
                        <Zap size={16} />
                        Underutilized: {item.agent}
                    </div>
                    <div style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '8px' }}>
                        Invocations: <strong>{item.invocations}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                        "{item.suggestion}"
                    </div>
                </div>
            ))}
        </div>
    );

    const ChartTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#1e293b',
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px', borderBottom: '1px solid #334155', paddingBottom: '4px' }}>{label}</div>
                    {payload.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: i === payload.length - 1 ? 0 : '4px' }}>
                            <span style={{ color: '#94a3b8' }}>{p.name}:</span>
                            <span style={{ fontWeight: 700, color: p.color || '#fff' }}>{p.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Route size={20} color="#3b82f6" />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Agent Routing & Intelligence</h3>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Total Agents</div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{routing.total_agents}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Total Plans</div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{routing.total_plans}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                {[
                    { id: 'performance', label: 'Performance', icon: Activity },
                    { id: 'patterns', label: 'Routing Patterns', icon: Route },
                    { id: 'combinations', label: 'Combinations', icon: PieChart },
                    { id: 'utilization', label: 'Utilization', icon: Zap }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setPage(1); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                            color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'performance' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '24px' }}>
                    {renderPerformanceTable()}
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={routing.agent_performance.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="agent" style={{ fontSize: '9px' }} interval={0} />
                                <YAxis style={{ fontSize: '11px' }} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="total_invocations" name="Invocations" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {routing.agent_performance.slice(0, 10).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'patterns' && renderRoutingPatterns()}
            {activeTab === 'combinations' && renderCombinations()}
            {activeTab === 'utilization' && renderUtilization()}
        </div>
    );
};

export default AgentRouting;
