import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';
import { Clock, Calendar, TrendingUp, Info } from 'lucide-react';

const TimeTrends = ({ trends }) => {
    if (!trends) return null;

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const hourlyData = Object.entries(trends.hourly_distribution).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count
    }));

    const dailyVolume = trends.daily_volume.map(d => ({
        date: d.date,
        count: d.count
    }));

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
                    <TrendingUp size={20} color="#3b82f6" />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Usage Patterns & Temporal Trends</h3>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ padding: '8px 16px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={14} color="#3b82f6" />
                        <div>
                            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Peak Hour</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{trends.peak_usage.peak_hour.hour}:00 ({trends.peak_usage.peak_hour.count} queries)</div>
                        </div>
                    </div>
                    <div style={{ padding: '8px 16px', backgroundColor: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={14} color="#8b5cf6" />
                        <div>
                            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Peak Day</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{trends.peak_usage.peak_day.day} ({trends.peak_usage.peak_day.count} queries)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Hourly Query Distribution</h4>
                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                            <Info size={14} color="#94a3b8" />
                            <div className="tooltip-content">
                                Total number of queries submitted during each hour of the day.
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="hour" style={{ fontSize: '10px' }} />
                                <YAxis style={{ fontSize: '10px' }} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Query Count" animationDuration={1000} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Daily Volume Trend</h4>
                        <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                            <Info size={14} color="#94a3b8" />
                            <div className="tooltip-content">
                                Aggregated query volume tracked over the selected period.
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyVolume}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" style={{ fontSize: '10px' }} />
                                <YAxis style={{ fontSize: '10px' }} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} name="Total Queries" animationDuration={1000} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Category Trends Over Time</h4>
                    <div className="tooltip-trigger" style={{ cursor: 'help' }}>
                        <Info size={14} color="#94a3b8" />
                        <div className="tooltip-content right">
                            Breakdown of query categories and their daily volume trends.
                        </div>
                    </div>
                </div>
                <div style={{ height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trends.topic_trends.reduce((acc, curr) => {
                            curr.data.forEach(d => {
                                const found = acc.find(item => item.date === d.date);
                                if (found) {
                                    found[curr.category] = d.count;
                                } else {
                                    acc.push({ date: d.date, [curr.category]: d.count });
                                }
                            });
                            return acc;
                        }, [])}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                style={{ fontSize: '10px' }}
                            />
                            <YAxis style={{ fontSize: '10px' }} />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Legend />
                            {trends.topic_trends.map((category, idx) => (
                                <Bar
                                    key={category.category}
                                    dataKey={category.category}
                                    name={category.category}
                                    fill={COLORS[idx % COLORS.length]}
                                    radius={[4, 4, 0, 0]}
                                    stackId="a"
                                    animationDuration={1000}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TimeTrends;
