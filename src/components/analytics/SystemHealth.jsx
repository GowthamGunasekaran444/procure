import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Cpu, Info, Activity } from 'lucide-react';

const SystemHealth = ({ health }) => {
    if (!health) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'met': return '#10b981';
            case 'at_risk': return '#f59e0b';
            case 'violated': return '#ef4444';
            default: return '#64748b';
        }
    };

    return (
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={20} color="#3b82f6" />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>System Health & Reliability</h3>
                </div>
                <div
                    className={health.overall_health === 'healthy' ? 'status-indicator status-pulse-green' : 'status-indicator'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        backgroundColor: health.overall_health === 'healthy' ? '#f0fdf4' : '#fef2f2',
                        color: health.overall_health === 'healthy' ? '#166534' : '#991b1b',
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        boxShadow: health.overall_health === 'healthy' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                    }}
                >
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: health.overall_health === 'healthy' ? '#10b981' : '#ef4444',
                        boxShadow: health.overall_health === 'healthy' ? '0 0 8px #10b981' : 'none'
                    }} />
                    {health.overall_health}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Compliance Rate</div>
                                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                                    <Info size={12} color="#94a3b8" />
                                    <div className="tooltip-content">
                                        Overall percentage of Service Level Objectives (SLOs) currently being met.
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{health.slo_summary.compliance_rate}%</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Success Rate</div>
                                <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                                    <Info size={12} color="#94a3b8" />
                                    <div className="tooltip-content">
                                        Percentage of successful operations vs total attempts.
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6' }}>{health.metrics.success_rate}%</div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Key Reliability Metrics</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                            {[
                                { label: 'SLOs Targets Met', value: `${health.slo_summary.met} of ${health.slo_summary.total}`, icon: ShieldCheck, color: '#10b981', tooltip: 'Number of individual targets achieved.' },
                                { label: 'SLA Violations', value: health.slo_summary.violated, icon: AlertCircle, color: health.slo_summary.violated > 0 ? '#ef4444' : '#64748b', tooltip: 'Count of critical threshold breaches.' },
                                { label: 'Volume Volatility', value: `${health.metrics.volume_change_pct}%`, icon: TrendingUp, color: '#8b5cf6', tooltip: 'Change in query volume compared to the previous period.' }
                            ].map((m, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '10px',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                                        <m.icon size={16} color={m.color} />
                                        {m.label}
                                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                                            <Info size={12} color="#cbd5e1" />
                                            <div className="tooltip-content">
                                                {m.tooltip}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>SLO Monitoring</h4>
                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                            <Info size={12} color="#94a3b8" />
                            <div className="tooltip-content right">
                                Real-time tracking of performance against predefined service level targets.
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {health.slos.map((slo, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{slo.name}</span>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        backgroundColor: `${getStatusColor(slo.status)}15`,
                                        color: getStatusColor(slo.status),
                                        textTransform: 'uppercase'
                                    }}>
                                        {slo.status}
                                    </span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: `${slo.actual}%`,
                                        backgroundColor: getStatusColor(slo.status),
                                        borderRadius: '3px',
                                        transition: 'width 1s ease-out'
                                    }} />
                                    {/* Target indicator */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${slo.target}%`,
                                        top: 0,
                                        bottom: 0,
                                        width: '2px',
                                        backgroundColor: '#1e293b',
                                        zIndex: 2,
                                        opacity: 0.5
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                                    <span>Target: {slo.target}%</span>
                                    <span>Actual: <strong>{slo.actual}%</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {health.anomalies.length > 0 && (
                <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 600, fontSize: '13px' }}>
                        <AlertCircle size={16} />
                        Anomalies Detected
                    </div>
                    {health.anomalies.map((a, i) => <div key={i} style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>{a}</div>)}
                </div>
            )}
        </div>
    );
};

export default SystemHealth;
