import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RT, ResponsiveContainer, Legend } from 'recharts';
import { Layers, Info } from 'lucide-react';

const PlanComplexity = ({ complexity }) => {
    if (!complexity) return null;

    const data = Object.entries(complexity.distribution).map(([key, val]) => ({
        name: val.label,
        value: val.count,
        percentage: val.percentage
    }));

    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{payload[0].name}</div>
                    <div style={{ color: '#94a3b8' }}>Count: <span style={{ color: '#fff' }}>{payload[0].value}</span></div>
                    <div style={{ color: '#94a3b8' }}>Percentage: <span style={{ color: '#fff' }}>{payload[0].payload.percentage}%</span></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={20} color="#8b5cf6" />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Plan Complexity Analysis</h3>
                </div>
                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                    <Info size={16} color="#94a3b8" />
                    <div className="tooltip-content right">
                        Measurement of the logic required to fulfill user queries, based on the number of generated subqueries.
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Avg Subqueries</div>
                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                            <Info size={10} color="#94a3b8" />
                            <div className="tooltip-content">
                                Average number of internal tasks generated per query.
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{complexity.avg_subqueries.toFixed(1)}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Max Subqueries</div>
                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                            <Info size={10} color="#94a3b8" />
                            <div className="tooltip-content">
                                Highest number of sub-tasks in a single plan.
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{complexity.max_subqueries}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Total Plans</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#8b5cf6' }}>{complexity.total_plans}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div style={{ height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RT content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fdfaff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b21a8', fontWeight: 600, marginBottom: '12px' }}>
                            <Info size={16} />
                            Most Complex Conversation
                        </div>
                        <div style={{ fontSize: '13px', color: '#1e293b', marginBottom: '8px' }}>
                            ID: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '11px' }}>{complexity.most_complex_conversation.conversation_id}</code>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                            <span>Subqueries: <strong>{complexity.most_complex_conversation.num_subqueries}</strong></span>
                            <span>{new Date(complexity.most_complex_conversation.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanComplexity;
