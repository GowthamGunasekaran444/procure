import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import DataExplorer from './components/DataExplorer';
import AnalyticsView from './components/AnalyticsView';
import UserBehaviorView from './components/UserBehaviorView';
import { Layout, FileText, Layers, Info, CheckCircle2 } from 'lucide-react';
import jsonData from './assets/output.json';
import './components/layout.css';
import './dashboard/dashboard.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const availableRanges = Object.keys(jsonData);
  const [timeRange, setTimeRange] = useState(availableRanges.includes('1h') ? '1h' : availableRanges[0]);
  const [activeView, setActiveView] = useState('overview');

  const data = jsonData[timeRange] || jsonData[availableRanges[0]];
  const cachedData = data.cached_data || {};

  // Configuration for Data Explorer tables
  const conversationColumns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'created_at' }
  ];

  const planColumns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Query', render: (row) => row.metadata?.initial_user_query || 'N/A' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'created_at' }
  ];

  const messageColumns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Conv ID', accessor: 'conversation_id' },
    { header: 'Turn ID', accessor: 'turn_id' },
    { header: 'Created', accessor: 'created_at' },
    { header: 'Type', accessor: 'type' },
    { header: 'Sender', accessor: 'sender' },
    { header: 'Receiver', accessor: 'receiver' },
    { header: 'User ID', accessor: 'user_id' },
    {
      header: 'Attachment',
      render: (row) => row.user_attachment_file_id ? (
        <span style={{ color: '#ef4444', fontWeight: 600 }}>True</span>
      ) : <span style={{ color: '#94a3b8' }}>False</span>
    },
    {
      header: 'Summary',
      render: (row) => {
        const summary = row.extra_payload?.research_dump?.summary_of_findings ||
          row.extra_payload?.research_dump?.final_answer?.summary_of_the_finding;
        if (!summary) return <span style={{ color: '#e2e8f0' }}>—</span>;
        return (
          <div className="tooltip-trigger">
            <div style={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              backgroundColor: '#f8fafc',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              {summary}
            </div>
            <div className="tooltip-content bottom" style={{ minWidth: '300px' }}>
              {summary}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Final Answer',
      render: (row) => {
        const hasHtml = (str) => /<[a-z][\s\S]*>/i.test(str);
        const htmlContent = row.extra_payload?.research_dump?.final_answer ||
          row.extra_payload?.natural_language_proposed_plan ||
          (hasHtml(row.content) ? row.content : null);

        if (!htmlContent) return <span style={{ color: '#e2e8f0' }}>—</span>;

        return (
          <div className="tooltip-trigger">
            <div style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={16} />
            </div>
            <div className="tooltip-content bottom" style={{ minWidth: '450px', maxHeight: '400px', overflowY: 'auto' }}>
              <div className="html-tooltip-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Subqueries',
      render: (row) => {
        const subqueries = row.extra_payload?.sub_queries;
        if (!subqueries || subqueries.length === 0) return <span style={{ color: '#e2e8f0' }}>—</span>;
        return (
          <div className="tooltip-trigger">
            <div style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={16} />
            </div>
            <div className="tooltip-content bottom" style={{ minWidth: '350px' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px', color: '#10b981', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '4px' }}>
                Sub-Query Execution Plan
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {subqueries.map((sq, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px' }}>{sq.agent.toUpperCase()}</div>
                    <div style={{ opacity: 0.9 }}>{sq.query}</div>
                    {sq.depends_on?.length > 0 && (
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                        Dependency: {sq.depends_on.join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
    }
  ];

  const renderMessageExpandedRow = (row) => {
    const subqueries = row.extra_payload?.sub_queries;
    const hasHtml = (str) => /<[a-z][\s\S]*>/i.test(str);
    const htmlContent = row.extra_payload?.research_dump?.final_answer ||
      row.extra_payload?.natural_language_proposed_plan ||
      (hasHtml(row.content) ? row.content : null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {subqueries && subqueries.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#10b981', fontWeight: 700 }}>
              <Layers size={16} /> Sub-Query Execution Details
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '12px',
              scrollbarWidth: 'thin',
              msOverflowStyle: 'none'
            }} className="custom-scrollbar">
              {subqueries.map((sq, i) => (
                <div key={i} style={{
                  flex: '0 0 350px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  border: '1px solid #d1fae5',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Agent: {sq.agent}
                  </div>
                  <div style={{ fontSize: '14px', color: '#064e3b', fontWeight: 600, marginBottom: '8px', lineHeight: '1.4' }}>{sq.query}</div>
                  {sq.dependency_explanation && (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid rgba(5, 150, 105, 0.1)', paddingTop: '8px', marginTop: '8px' }}>
                      {sq.dependency_explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#2563eb', fontWeight: 800 }}>
            <FileText size={16} /> Full Message Content & Payload
          </div>
          <div
            className="custom-scrollbar"
            style={{
              padding: '28px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
              overflowX: 'auto',
              minWidth: 0
            }}
          >
            {htmlContent ? (
              <div className="html-tooltip-content" style={{ color: '#1e293b', minWidth: 'fit-content' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: '#1e293b', lineHeight: '1.6', minWidth: 'fit-content' }}>{row.content || 'No content available.'}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPlanExpandedRow = (row) => {
    const plan = row.metadata?.plan_definition;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>PLAN GOAL</div>
            <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>{row.metadata?.goal || 'N/A'}</div>
          </div>
          <div style={{ width: '200px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>PLANNING AGENT</div>
            <div style={{ fontSize: '14px', color: '#1e293b' }}>v{row.planning_agent_version || '1.0.0'}</div>
          </div>
        </div>

        {plan?.turns && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>HISTORY & TURNS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plan.turns.map((turn, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#64748b' }}>TURN {turn.turn_number}</span>
                  </div>
                  <div style={{ color: '#334155' }}>{turn.user_query}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview timeRange={timeRange} />;
      case 'analytics':
        return <AnalyticsView timeRange={timeRange} />;
      case 'conversations':
        return <DataExplorer title="Conversations" data={cachedData.conversations || []} columns={conversationColumns} />;
      case 'plans':
        return <DataExplorer title="Execution Plans" data={cachedData.plans || []} columns={planColumns} renderExpandedRow={renderPlanExpandedRow} />;
      case 'users':
        return <UserBehaviorView timeRange={timeRange} allUsers={cachedData.users || []} />;
      case 'raw':
        return (
          <DataExplorer
            title="Raw Logs"
            data={cachedData.messages || []}
            columns={messageColumns}
            renderExpandedRow={renderMessageExpandedRow}
            pageSize={10}
            showFilters={true}
          />
        );
      default:
        return <DashboardOverview timeRange={timeRange} />;
    }
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="main-content">
        <Header timeRange={timeRange} setTimeRange={setTimeRange} />
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
