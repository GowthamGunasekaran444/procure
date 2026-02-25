import React from 'react';
import { Clock, Bell, Settings } from 'lucide-react';
import './layout.css';

import jsonData from '../assets/output.json';

const Header = ({ timeRange, setTimeRange }) => {
    const timeRanges = Object.keys(jsonData);

    return (
        <header className="header">
            <div className="header-left">
                <span className="breadcrumb">Dashboards / Observability</span>
            </div>
            <div className="header-right">
                <div className="time-range-selector">
                    <Clock size={16} />
                    {timeRanges.map((range) => (
                        <button
                            key={range}
                            className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <div className="header-actions">
                    <button className="icon-btn"><Bell size={20} /></button>
                    <button className="icon-btn"><Settings size={20} /></button>
                </div>
            </div>
        </header>
    );
};

export default Header;
