import { LayoutDashboard, Activity, Search, AlertCircle, MessageSquare, BarChart2, Settings, ThumbsUp, FileText, ChevronLeft, ChevronRight, Menu, Users } from 'lucide-react';
import './layout.css';

const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed }) => {
    const menuItems = [
        { name: 'Dashboard Overview', icon: LayoutDashboard, id: 'overview' },
        { name: 'Analytics', icon: BarChart2, id: 'analytics' },
        { name: 'History', icon: MessageSquare, id: 'conversations' },
        { name: 'Execution Plans', icon: FileText, id: 'plans' },
        { name: 'User Insights', icon: Users, id: 'users' },
        { name: 'Event Visualizer', icon: Search, id: 'visualizer' },
        { name: 'Raw Logs', icon: Activity, id: 'raw' },
    ];

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!isCollapsed && <h2>Observability</h2>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="sidebar-toggle-btn"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`menu-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                        title={isCollapsed ? item.name : ''}
                    >
                        <item.icon size={18} />
                        {!isCollapsed && <span>{item.name}</span>}
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">G</div>
                    {!isCollapsed && (
                        <div className="user-info">
                            <span className="user-name">Gowtham G.</span>
                            <span className="user-role">Admin</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
