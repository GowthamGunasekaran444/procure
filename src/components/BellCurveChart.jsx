import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Clock } from 'lucide-react';

const BellCurveChart = ({ latencies, title, color = '#3b82f6', description }) => {
    if (!latencies) return null;

    // Utilize a sanitized ID for the gradient to prevent SVG rendering issues (e.g., spaces in IDs causing black fill)
    const gradientId = `colorGradient-${title.replace(/\s+/g, '')}`;

    // Generate standard normal distribution data (mean=0, std=1)
    const generateNormalDist = () => {
        const data = [];
        for (let x = -3.5; x <= 3.5; x += 0.1) {
            const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
            data.push({ x: parseFloat(x.toFixed(1)), y });
        }
        return data;
    };

    const data = generateNormalDist();

    // Map percentiles to approximate Z-scores for visualization
    const markers = [
        { z: 0, label: 'P50', value: latencies.p50, color: '#8b5cf6' },      // Mean
        { z: 1.28, label: 'P90', value: latencies.p90, color: '#10b981' },   // ~90th percentile
        { z: 1.645, label: 'P95', value: latencies.p95, color: '#f59e0b' },  // ~95th percentile
        { z: 2.33, label: 'P99', value: latencies.p99, color: '#ef4444' }    // ~99th percentile
    ];

    const formatLatency = (ms) => {
        if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
        return `${Math.round(ms)}ms`;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    padding: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    maxWidth: '200px'
                }}>
                    <p style={{ fontWeight: 600, fontSize: '12px', color: '#374151', marginBottom: '4px' }}>{title}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{description}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card bell-curve-card" style={{
            flex: 1,
            minWidth: '300px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
            border: '1px solid #e5e7eb',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${color}, #ffffff)`
            }} />
            <div className="card-title" style={{ fontSize: '14px', marginBottom: '10px' }}>
                <Clock size={16} style={{ color: color, marginRight: '8px' }} />
                {title}
            </div>
            <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="x" hide={true} />
                        <YAxis hide={true} domain={[0, 'dataMax + 0.1']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="y"
                            stroke={color}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            strokeWidth={2}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                        {markers.map((marker, index) => (
                            <ReferenceLine key={index} x={marker.z} stroke={marker.color} strokeDasharray="3 3">
                                <Label
                                    value={`${marker.label}`}
                                    position="top"
                                    fill={marker.color}
                                    fontSize={12}
                                    fontWeight={600}
                                    offset={10}
                                />
                                <Label
                                    value={formatLatency(marker.value)}
                                    position="insideTop"
                                    fill="#374151"
                                    fontSize={11}
                                    dy={18}
                                />
                            </ReferenceLine>
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                {markers.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color }}></div>
                        <span>{m.label}: {formatLatency(m.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BellCurveChart;
