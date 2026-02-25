import React, { useEffect } from 'react';
import KPIGrid from './KPIGrid';
import AgentRouting from './AgentRouting';
import PlanComplexity from './PlanComplexity';
import QueryTopics from './QueryTopics';
import SystemHealth from './SystemHealth';
import UserBehavior from './UserBehavior';
import TimeTrends from './TimeTrends';
import FailuresOverview from './FailuresOverview';
import { Layout } from 'lucide-react';

const AnalyticsPage = ({ data }) => {
    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!data || !data.analytics) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <Layout size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3>No Analytics Data Available</h3>
                <p>Data for this time range is currently being processed.</p>
            </div>
        );
    }

    const { analytics } = data;

    return (
        <div className="analytics-page-container" style={{ padding: '20px', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#111827', fontSize: '24px', fontWeight: 700 }}>Executive Analytics</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
                        Comprehensive mission-critical insights and performance monitoring.
                    </p>
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    Computed at: {data.computed_at}
                </div>
            </div>

            {/* Top Level KPIs */}
            <KPIGrid analytics={analytics} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Agent Routing Intelligence */}
                <AgentRouting routing={analytics.agent_routing} />

                {/* Query Intelligence & Intent */}
                <QueryTopics topics={analytics.query_topics} />

                {/* System Health Monitoring */}
                <SystemHealth health={analytics.system_health} />

                {/* Failure Monitoring */}
                <FailuresOverview
                    failedConversations={analytics.failed_conversations}
                    turnFailures={analytics.turn_failures}
                />

                {/* Secondary Analytics (Side by Side) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                    <PlanComplexity complexity={analytics.plan_complexity} />
                    <UserBehavior behavior={analytics.user_behavior} />
                </div>

                {/* Time Trends (Full Width) */}
                <TimeTrends trends={analytics.time_trends} />
            </div>

            {/* CSS for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .analytics-page-container .card {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .analytics-page-container .card:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
            `}} />
        </div >
    );
};

export default AnalyticsPage;
