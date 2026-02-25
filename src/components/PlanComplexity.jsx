import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart2 } from 'lucide-react';
import '../dashboard/dashboard.css';

const PlanComplexity = ({ complexity }) => {
    const distribution = complexity?.distribution || {};
    const data = [
        { name: 'Simple', value: distribution.simple?.count || 0, color: '#10b981' },
        { name: 'Moderate', value: distribution.moderate?.count || 0, color: '#f59e0b' },
        { name: 'Complex', value: distribution.complex?.count || 0, color: '#ef4444' },
    ];

    return (
        <div className="card plan-complexity-card">
            <div className="card-title">
                <BarChart2 size={18} className="text-purple-500" />
                Plan Complexity
            </div>
            <div style={{ height: '200px' }}>
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
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Avg Subqueries</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{complexity?.avg_subqueries || 0}</div>
            </div>
        </div>
    );
};

export default PlanComplexity;
