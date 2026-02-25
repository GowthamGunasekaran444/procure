import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const SystemHealth = ({ data }) => {
    const healthScore = data?.slo_summary?.compliance_rate || 100;
    const chartData = [
        { name: 'Score', value: healthScore },
        { name: 'Remaining', value: 100 - healthScore },
    ];
    const COLORS = ['#10b981', '#f3f4f6'];

    const slos = data?.slos || [];

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Activity size={18} color="#10b981" />
                <h5 style={{ margin: 0, color: '#374151', fontSize: '16px', fontWeight: 600 }}>System Health & SLOs</h5>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={42}
                                outerRadius={55}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{healthScore}%</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>HEALTH</div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    {slos.slice(0, 3).map((slo, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>{slo.name}</span>
                                <span style={{ fontWeight: 700, color: slo.status === 'met' ? '#10b981' : '#ef4444' }}>
                                    {slo.actual}%
                                </span>
                            </div>
                            <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${slo.actual}%`, height: '100%', backgroundColor: slo.status === 'met' ? '#10b981' : '#ef4444' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
