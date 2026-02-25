import React, { useState } from 'react';
import DashboardMetrics from './DashboardMetrics';
import KpiSection from './KpiSection';
import DrillDownSection from './DrillDownSection';
import SystemHealth from './SystemHealth';
import jsonData from '../assets/output.json';

const DashboardOverview = ({ timeRange }) => {
    const data = jsonData[timeRange] || jsonData[Object.keys(jsonData)[0]];

    const dashboardMetrics = data.dashboard_metrics;
    const systemHealth = data.analytics.system_health;
    const kpis = dashboardMetrics.kpis;
    const userSatisfaction = dashboardMetrics.user_satisfaction;
    const drillDown = data.drill_down;

    return (
        <div className="dashboard-overview" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, color: '#111827', fontSize: '24px', fontWeight: 700 }}>Data Dashboard</h3>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    Computed at: {data.computed_at}
                </div>
            </div>

            {/* 1. Dashboard Metrics (Planning, Agents, Execution, Business) */}
            <section style={{ marginBottom: '40px' }}>
                <h4 style={{ color: '#374151', marginBottom: '16px', fontWeight: 600 }}>Performance Metrics</h4>
                <DashboardMetrics metrics={dashboardMetrics} />
            </section>

            {/* 2. KPI Section */}
            <section style={{ marginBottom: '40px' }}>
                <h4 style={{ color: '#374151', marginBottom: '16px', fontWeight: 600 }}>Key Performance Indicators</h4>
                <KpiSection kpis={kpis} satisfaction={userSatisfaction} />
            </section>

            {/* 3. System health row for context */}
            <section style={{ marginBottom: '40px' }}>
                <div className="dashboard-grid-top">
                    <SystemHealth data={systemHealth} />
                    <div className="card" style={{ padding: '20px' }}>
                        <h5 style={{ margin: '0 0 15px 0', color: '#374151' }}>User Satisfaction</h5>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{userSatisfaction.positive_count || 0}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Positive</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{userSatisfaction.negative_count || 0}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Negative</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{userSatisfaction.total_feedbacks || 0}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Drill Down Section */}
            <section style={{ marginBottom: '40px' }}>
                <h4 style={{ color: '#374151', marginBottom: '16px', fontWeight: 600 }}>Drill Down Analytics</h4>
                <DrillDownSection drillDown={drillDown} />
            </section>
        </div>
    );
};

export default DashboardOverview;
