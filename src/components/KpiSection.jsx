import React from 'react';
import { Shield, Activity, Clock, UserCheck, CheckCircle, BarChart3, Info } from 'lucide-react';

const KpiCard = ({ title, agentData, icon: Icon, color }) => {
    if (!agentData) return null;

    return (
        <div className="card kpi-card" style={{ padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: `${color}15` }}>
                        <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#4b5563', fontSize: '14px' }}>{title}</span>
                </div>
                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                    <Info size={14} color="#9ca3af" />
                    <div className="tooltip-content" style={{ minWidth: '200px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '12px', borderBottom: '1px solid #eee' }}>{title} Details</div>
                        <div style={{ fontSize: '11px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <span>Avg Latency:</span> <strong>{agentData.avg_latency_ms?.toFixed(0)} ms</strong>
                            <span>Sec:</span> <strong>{agentData.avg_latency_seconds?.toFixed(2)} s</strong>
                            <span>Min:</span> <strong>{agentData.min_latency_ms} ms</strong>
                            <span>Max:</span> <strong>{agentData.max_latency_ms} ms</strong>
                            <span>Invocations:</span> <strong>{agentData.invocation_count}</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                {agentData.avg_latency_seconds?.toFixed(2)}s
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Avg Latency
            </div>
        </div>
    );
};

const KpiSection = ({ kpis, satisfaction }) => {
    if (!kpis) return null;

    const agents = kpis.per_agent_latencies || {};

    return (
        <div className="kpi-section-container">
            {/* Agent Specific KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <KpiCard title="Competitor 360" agentData={agents.competitor_360} icon={Shield} color="#3b82f6" />
                <KpiCard title="Traffic 360" agentData={agents.Tariff360} icon={Activity} color="#f59e0b" />
                <KpiCard title="Spends" agentData={agents.Spend} icon={BarChart3} color="#10b981" />
                <KpiCard title="OK 360" agentData={agents.OKR360} icon={CheckCircle} color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Accuracy and Breakdown */}
                <div className="card" style={{ padding: '24px' }}>
                    <h5 style={{ margin: '0 0 20px 0', color: '#374151', fontSize: '16px', fontWeight: 600 }}>Performance Breakdown</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Task Completion Accuracy</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{kpis.task_completion_accuracy}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${kpis.task_completion_accuracy}%`, height: '100%', backgroundColor: '#10b981' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Plan Execution Success</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6' }}>{kpis.plan_execution_success_rate}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${kpis.plan_execution_success_rate}%`, height: '100%', backgroundColor: '#3b82f6' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <div style={{ height: '32px', display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', position: 'relative' }}>
                            {Object.entries(kpis.latency_breakdown || {}).filter(([k]) => k !== 'sample_size').map(([key, val], i, arr) => {
                                const filteredArr = Object.entries(kpis.latency_breakdown || {}).filter(([k]) => k !== 'sample_size');
                                const total = filteredArr.reduce((a, b) => a + b[1], 0);
                                const pct = (val / total * 100).toFixed(1);
                                const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                                const label = key.replace('_ms', '').replace(/_/g, ' ');

                                const descriptions = {
                                    'apolo planning': 'Strategic agent selection and task decomposition by the AI Orchestrator.',
                                    'user approval': 'Time elapsed while waiting for human-in-the-loop verification and plan approval.',
                                    'ares preparation': 'Data retrieval, vector search, and context formatting for agent execution.',
                                    'agent_execution': 'Processing time for specialized LLM agents to execute sub-queries.',
                                    'response generation': 'Final synthesis of agent results into a comprehensive natural language report.'
                                };

                                return (
                                    <div
                                        key={key}
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: colors[i % colors.length],
                                            position: 'relative',
                                            cursor: 'help',
                                            transition: 'opacity 0.2s',
                                            borderTopLeftRadius: i === 0 ? '8px' : '0',
                                            borderBottomLeftRadius: i === 0 ? '8px' : '0',
                                            borderTopRightRadius: i === filteredArr.length - 1 ? '8px' : '0',
                                            borderBottomRightRadius: i === filteredArr.length - 1 ? '8px' : '0',
                                        }}
                                        className="tooltip-trigger"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '0.85';
                                            e.currentTarget.style.zIndex = '1000';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                            e.currentTarget.style.zIndex = '1';
                                        }}
                                    >
                                        <div
                                            className="tooltip-content"
                                            style={{
                                                minWidth: '240px',
                                                whiteSpace: 'normal',
                                                top: 'auto',
                                                bottom: 'calc(100% + 10px)',
                                                left: i < 2 ? '0' : (i > filteredArr.length - 2 ? 'auto' : '50%'),
                                                right: i > filteredArr.length - 2 ? '0' : 'auto',
                                                transform: (i < 2 || i > filteredArr.length - 2) ? 'none' : 'translateX(-50%)',
                                                zIndex: 10000,
                                            }}
                                        >
                                            <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff', marginBottom: '6px', textTransform: 'capitalize', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                                {label === 'apolo planning' ? 'Apollo Planning' : label}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px', lineHeight: '1.5' }}>
                                                {descriptions[key.replace('_ms', '')] || 'No description available for this stage.'}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 800, color: colors[i % colors.length] }}>{pct}%</span>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{val.toFixed(0)} ms</div>
                                                    <div style={{ fontSize: '10px', color: '#64748b' }}>of total latency</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {Object.entries(kpis.latency_breakdown || {}).filter(([k]) => k !== 'sample_size').map(([key, val], i) => {
                                const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                                const label = key.replace('_ms', '').replace(/_/g, ' ');
                                return (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: colors[i % colors.length] }}></div>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#4b5563', textTransform: 'capitalize' }}>
                                            {label === 'apolo planning' ? 'Apollo Planning' : label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Active Users */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <UserCheck size={18} color="#3b82f6" />
                        <h5 style={{ margin: 0, color: '#374151', fontSize: '16px', fontWeight: 600 }}>Active Users</h5>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                        {kpis.active_users}
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {/* We don't have user names in KPIs, but we have them in drill_down or analytics.
                             I'll just list placeholders or attempt to find them in props if available */}
                        <div style={{ fontSize: '13px', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                            Monitoring user sessions in real-time.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KpiSection;
