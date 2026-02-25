import React from 'react';
import { MOCK_DATA } from '../data/mock_data';
import SystemHealth from '../components/SystemHealth';
import ActiveAlerts from '../components/ActiveAlerts';
import RecentFailures from '../components/RecentFailures';
import QueryTopics from '../components/QueryTopics';
import DashboardMetrics from '../components/DashboardMetrics';
import PlanComplexity from '../components/PlanComplexity';
import AgentRouting from '../components/AgentRouting';
import './dashboard.css';

const Dashboard = ({ timeRange }) => {
    const data = MOCK_DATA[timeRange] || MOCK_DATA['1h'];

    const systemHealth = data.analytics.system_health;
    const alerts = data.alerts;
    const conversations = data.drill_down.recent_conversations;
    const queryTopics = data.analytics.query_topics;
    const dashboardMetrics = data.dashboard_metrics;
    const planComplexity = data.analytics.plan_complexity;
    const agentRouting = data.analytics.agent_routing;

    return (
        <div className="dashboard-container">
            <h3 style={{ marginBottom: '20px', color: '#111827', fontWeight: 600 }}>Dashboard Overview</h3>

            {/* Top Metrics Row */}
            <DashboardMetrics metrics={dashboardMetrics} />

            {/* Second Row: System Health & Alerts */}
            <div className="dashboard-grid-top">
                <SystemHealth data={systemHealth} />
                <ActiveAlerts alerts={alerts} />
            </div>

            {/* Third Row: Recent Failures */}
            <div className="dashboard-row">
                <RecentFailures conversations={conversations} />
            </div>

            {/* Fourth Row: Plan Complexity & Agent Routing */}
            <div className="dashboard-grid-top">
                <PlanComplexity complexity={planComplexity} />
                <AgentRouting routing={agentRouting} />
            </div>

            {/* Fifth Row: Query Analytics */}
            <div className="dashboard-row">
                <QueryTopics topics={queryTopics} />
            </div>
        </div>
    );
};

export default Dashboard;
