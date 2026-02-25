import React from 'react';
import { Target, Zap, Users, Briefcase, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import '../dashboard/dashboard.css';

const SparkPercentileChart = ({ latencies, color }) => {
    if (!latencies) return null;

    // Standard normal distribution values
    const data = [
        { x: -3, y: 0.004 }, { x: -2.5, y: 0.017 }, { x: -2, y: 0.054 },
        { x: -1.5, y: 0.129 }, { x: -1, y: 0.242 }, { x: -0.5, y: 0.352 },
        { x: 0, y: 0.398 }, { x: 0.5, y: 0.352 }, { x: 1, y: 0.242 },
        { x: 1.5, y: 0.129 }, { x: 2, y: 0.054 }, { x: 2.5, y: 0.017 }, { x: 3, y: 0.004 }
    ];

    return (
        <div style={{ height: '50px', width: '100px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="y"
                        stroke={color}
                        fill={`url(#grad-${color})`}
                        strokeWidth={1.5}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const MetricCard = ({ title, icon: Icon, data, color }) => {
    if (!data) return null;

    const trendColor = data.trend_direction === 'up' ? '#10b981' : data.trend_direction === 'down' ? '#ef4444' : '#6b7280';
    const TrendIcon = data.trend_direction === 'up' ? TrendingUp : data.trend_direction === 'down' ? TrendingDown : Minus;

    return (
        <div className="card metric-detail-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${color}10` }}>
                        <Icon size={22} color={color} />
                    </div>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '18px' }}>{title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: trendColor, backgroundColor: `${trendColor}10`, padding: '4px 10px', borderRadius: '20px' }}>
                    <TrendIcon size={16} />
                    {data.trend_percentage || 0}% {data.trend_direction?.toUpperCase()}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                        {title === 'Planning' ? 'Plans Generated' :
                            title === 'Execution' ? 'Executions Completed' :
                                title === 'Agents' ? 'Total Invocations' : 'Total Conversations'}
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>
                        {data.plans_generated || data.executions_completed || data.total_invocations || data.total_conversations || 0}
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                        {title === 'Planning' ? 'Revision Rate' :
                            title === 'Execution' ? 'Avg Latency' :
                                title === 'Agents' ? 'Active Invocations' : 'Total Queries'}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#374151' }}>
                        {title === 'Planning' ? `${data.plan_revision_rate?.toFixed(1)}%` :
                            title === 'Execution' ? `${(data.avg_latency_ms / 1000).toFixed(1)}s` :
                                title === 'Agents' ? data.active_invocations : data.queries}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Latency Percentiles</span>
                        <div className="tooltip-trigger">
                            <Info size={14} color="#94a3b8" style={{ cursor: 'help' }} />
                            <div className="tooltip-content" style={{ zIndex: 99999, minWidth: '220px' }}>
                                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px', borderBottom: '1px solid #334155', paddingBottom: '4px' }}>Distribution Data</div>
                                {data.latency_percentiles ? Object.entries(data.latency_percentiles).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '11px', marginBottom: '3px' }}>
                                        <span style={{ color: '#94a3b8' }}>{k.toUpperCase()}</span>
                                        <span style={{ fontWeight: 600 }}>{(v / 1000).toFixed(2)}s</span>
                                    </div>
                                )) : <div style={{ fontSize: '11px' }}>No latency data</div>}
                                {title === 'Agents' && data.top_agents && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #334155' }}>
                                        <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '11px' }}>Top Agents</div>
                                        {data.top_agents.map((a, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                                <span>{a.agent}</span>
                                                <span>{a.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {['P50', 'P90', 'P95', 'P99'].map((p) => {
                            const val = data.latency_percentiles?.[p.toLowerCase()];
                            return (
                                <div key={p} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>{p}</div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>{val ? `${(val / 1000).toFixed(1)}s` : '-'}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <SparkPercentileChart latencies={data.latency_percentiles} color={color} />
            </div>

            {data.plans_failed !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: data.plans_failed > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: data.plans_failed > 0 ? '#ef4444' : '#10b981' }}></div>
                    {data.plans_failed} failures in loop
                </div>
            )}
        </div>
    );
};

const DashboardMetrics = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <MetricCard title="Planning" icon={Target} data={metrics.planning} color="#8b5cf6" />
            <MetricCard title="Agents" icon={Users} data={metrics.agents} color="#3b82f6" />
            <MetricCard title="Execution" icon={Zap} data={metrics.execution} color="#f59e0b" />
            <MetricCard title="Business" icon={Briefcase} data={metrics.business} color="#10b981" />
        </div>
    );
};

export default DashboardMetrics;
