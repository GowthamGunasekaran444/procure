import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MessageSquare, Layers, Tag, Globe, Package, FileText, Activity, Info } from 'lucide-react';

const QueryTopics = ({ topics }) => {
    const categories = topics?.categories || [];
    const topKeywords = topics?.top_keywords || [];
    const topMaterials = topics?.top_materials || [];
    const topGeographies = topics?.top_geographies || [];

    const summaryMetrics = [
        { label: 'Total Queries', value: topics?.total_queries || 0, icon: MessageSquare, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Plans Generated', value: topics?.total_plans || 0, icon: FileText, color: '#10b981', bg: '#f0fdf4' },
        { label: 'Unique Keywords', value: topKeywords.length, icon: Tag, color: '#8b5cf6', bg: '#f5f3ff' },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#eff6ff' }}>
                        <Activity size={20} color="#3b82f6" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Query Intelligence</h3>
                </div>
                <div className="tooltip-trigger">
                    <Info size={16} color="#94a3b8" />
                    <div className="tooltip-content" style={{ width: '220px' }}>
                        Analysis of natural language queries, extracted entities, and intent classification.
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {summaryMetrics.map((metric, index) => (
                    <div key={index} style={{
                        background: '#f8fafc',
                        padding: '16px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '12px',
                            marginRight: '12px',
                            background: metric.bg,
                            color: metric.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <metric.icon size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{metric.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                {/* Categories Chart */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '14px', color: '#475569', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={14} /> Intent Distribution
                    </h4>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categories} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="category" type="category" width={100} style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14}>
                                    {categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Entities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <h4 style={{ fontSize: '14px', color: '#475569', fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag size={14} /> Emerging Keywords
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {topKeywords.slice(0, 8).map((kw, i) => (
                                <span key={i} style={{
                                    padding: '5px 12px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {kw.keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Package size={12} /> Materials
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {topMaterials.slice(0, 3).map((m, i) => (
                                    <div key={i} style={{ fontSize: '11px', color: '#334155', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{m.material}</span>
                                        <span style={{ color: '#94a3b8' }}>{m.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Globe size={12} /> Geographies
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {topGeographies.slice(0, 3).map((g, i) => (
                                    <div key={i} style={{ fontSize: '11px', color: '#334155', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{g.country}</span>
                                        <span style={{ color: '#94a3b8' }}>{g.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryTopics;
