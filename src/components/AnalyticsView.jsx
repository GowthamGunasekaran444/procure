import React from 'react';
import AnalyticsPage from './analytics/AnalyticsPage';
import jsonData from '../assets/output.json';

const AnalyticsView = ({ timeRange }) => {
    const data = jsonData[timeRange] || jsonData['1h'];

    return (
        <div className="analytics-view">
            <AnalyticsPage data={data} />
        </div>
    );
};

export default AnalyticsView;
