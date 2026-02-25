import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import '../dashboard/dashboard.css';

const ActiveAlerts = ({ alerts }) => {
    return (
        <div className="card active-alerts-card">
            <div className="card-title">
                <AlertCircle size={18} className="text-yellow-500" />
                Active Alerts
            </div>
            <div className="alerts-list">
                {alerts && alerts.map((alert) => (
                    <div key={alert.id} style={{
                        display: 'flex', alignItems: 'center', padding: '12px',
                        marginBottom: '8px', background: alert.severity === 'success' ? '#f0fdf4' : '#fffbeb',
                        borderRadius: '6px', border: `1px solid ${alert.severity === 'success' ? '#bbf7d0' : '#fde68a'}`
                    }}>
                        {alert.severity === 'success' ?
                            <CheckCircle size={16} color="#15803d" style={{ marginRight: '10px' }} /> :
                            <AlertCircle size={16} color="#b45309" style={{ marginRight: '10px' }} />
                        }
                        <span style={{ fontSize: '13px', color: alert.severity === 'success' ? '#15803d' : '#b45309' }}>
                            {alert.message}
                        </span>
                    </div>
                ))}
                {(!alerts || alerts.length === 0) && (
                    <div style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>No active alerts</div>
                )}
            </div>
        </div>
    );
};

export default ActiveAlerts;
