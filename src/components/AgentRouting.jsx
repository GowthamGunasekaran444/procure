import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Share2 } from 'lucide-react';
import '../dashboard/dashboard.css';

const AgentRouting = ({ routing }) => {
    const performance = routing?.agent_performance || [];

    return (
        <div className="card agent-routing-card">
            <div className="card-title">
                <Share2 size={18} className="text-indigo-500" />
                Agent Routing & Performance
            </div>
            <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={performance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="agent" style={{ fontSize: '12px' }} />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Bar dataKey="total_invocations" name="Invocations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avg_latency_seconds" name="Latency (s)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgentRouting;
