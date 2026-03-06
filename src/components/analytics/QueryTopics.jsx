import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Tag, Globe, Package, Building2, Calendar, Search, Info } from 'lucide-react';

const TopListCard = ({ title, data, labelKey, icon: Icon, color, description }) => (
    <div className="card" style={{
        padding: '24px',
        backgroundColor: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: '220px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
        transition: 'transform 0.2s ease'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    padding: '12px',
                    borderRadius: '14px',
                    backgroundColor: `${color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={20} color={color} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{title}</span>
            </div>
            <div className="tooltip-trigger">
                <Info size={14} color="#cbd5e1" />
                <div className="tooltip-content">
                    {description}
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
            {data && data.length > 0 ? data.slice(0, 6).map((item, idx) => (
                <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1px solid transparent'
                }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>{item[labelKey]}</span>
                    <span style={{
                        backgroundColor: `${color}10`,
                        color: color,
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '11px',
                        minWidth: '24px',
                        textAlign: 'center'
                    }}>
                        {item.count}
                    </span>
                </div>
            )) : (
                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    padding: '20px'
                }}>
                    No entities detected
                </div>
            )}
        </div>
    </div>
);

const QueryTopics = ({ topics }) => {
    const [keywordSearch, setKeywordSearch] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    if (!topics) return null;

    const filteredKeywords = topics.top_keywords.filter(k =>
        k.keyword.toLowerCase().includes(keywordSearch.toLowerCase())
    );

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    return (
        <div className="card" style={{ padding: '40px', marginBottom: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                        padding: '14px',
                        borderRadius: '18px',
                        backgroundColor: '#f0fdf4',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Search size={28} color="#10b981" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                            Intelligence & Intent
                        </h3>
                        <div style={{ fontSize: '15px', color: '#64748b', marginTop: '6px' }}>
                            Semantic entity extraction and natural language pattern analysis
                        </div>
                    </div>
                </div>
                <div className="tooltip-trigger">
                    <div style={{
                        padding: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'help'
                    }}>
                        <Info size={20} color="#64748b" />
                    </div>
                    <div className="tooltip-content right">
                        This module uses advanced NLP to classify user intents and extract specific procurement entities like materials, geographies, and organizations.
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                {/* Intent Distribution */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '32px',
                    borderRadius: '28px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '18px', color: '#1e293b', fontWeight: 700, margin: 0 }}>Intent Distribution</h4>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Session Volume
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topics.categories} layout="vertical" margin={{ left: 10, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="category"
                                    type="category"
                                    width={140}
                                    style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                        fontSize: '12px',
                                        padding: '16px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20}>
                                    {topics.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Keyword Cloud / Trends */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '32px',
                    borderRadius: '28px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '18px', color: '#1e293b', fontWeight: 700, margin: 0 }}>Emerging Trends</h4>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search keywords..."
                                value={keywordSearch}
                                onChange={(e) => setKeywordSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                style={{
                                    padding: '10px 16px 10px 42px',
                                    borderRadius: '14px',
                                    border: `1.5px solid ${isSearchFocused ? '#3b82f6' : '#f1f5f9'}`,
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '200px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backgroundColor: isSearchFocused ? '#fff' : '#f8fafc'
                                }}
                            />
                            <Search size={16} style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: isSearchFocused ? '#3b82f6' : '#94a3b8',
                                transition: 'color 0.3s'
                            }} />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '4px',
                        alignContent: 'flex-start'
                    }}>
                        {filteredKeywords.length > 0 ? filteredKeywords.map((k, idx) => (
                            <div key={idx} style={{
                                backgroundColor: '#f8fafc',
                                border: '1px solid #f1f5f9',
                                padding: '8px 16px',
                                borderRadius: '14px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s',
                                cursor: 'default'
                            }} className="trend-tag">
                                <span style={{ fontWeight: 600, color: '#334155' }}>{k.keyword}</span>
                                <span style={{
                                    color: '#64748b',
                                    fontSize: '11px',
                                    backgroundColor: '#fff',
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                    fontWeight: 900,
                                    border: '1px solid #f1f5f9'
                                }}>{k.count}</span>
                            </div>
                        )) : (
                            <div style={{ width: '100%', textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '15px' }}>
                                No trends found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Entity Identification Section */}
            <div>
                <div style={{ marginBottom: '32px', paddingLeft: '4px' }}>
                    <h4 style={{ fontSize: '20px', color: '#1e293b', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>Entity Identification</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Detection frequency of strategic procurement objects</p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '32px',
                    rowGap: '48px', // Increased row gap to prevent overlap
                    alignItems: 'start'
                }}>
                    <TopListCard
                        title="Materials"
                        data={topics.top_materials}
                        labelKey="material"
                        icon={Package}
                        color="#10b981"
                        description="Key raw materials and commodities mentioned in conversations."
                    />
                    <TopListCard
                        title="Geographies"
                        data={topics.top_geographies}
                        labelKey="country"
                        icon={Globe}
                        color="#3b82f6"
                        description="Regions and countries involved in the analyzed trade corridors."
                    />
                    <TopListCard
                        title="Organizations"
                        data={topics.top_organizations}
                        labelKey="company"
                        icon={Building2}
                        color="#f59e0b"
                        description="Companies, competitors, and organizational entities detected."
                    />
                    <TopListCard
                        title="Time Periods"
                        data={topics.top_time_periods}
                        labelKey="period"
                        icon={Calendar}
                        color="#8b5cf6"
                        description="Specific years, quarters, and timeframes referenced by users."
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .trend-tag:hover {
                    background-color: #fff !important;
                    border-color: #3b82f6 !important;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
                }
            `}} />
        </div>
    );
};

export default QueryTopics;
