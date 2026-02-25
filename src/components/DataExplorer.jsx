import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Info, AlertCircle } from 'lucide-react';

const DataExplorer = ({ title, data = [], columns, renderExpandedRow }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowSearch = searchTerm.toLowerCase();
        return data.filter(row => {
            return columns.some(col => {
                const val = col.accessor ? row[col.accessor] : col.render ? col.render(row) : '';
                if (typeof val === 'string' || typeof val === 'number') {
                    return String(val).toLowerCase().includes(lowSearch);
                }
                // If it's a React element (from render), we might need to be smarter, 
                // but usually searching against raw data is better.
                // Let's also check common raw fields that might not be in columns
                return JSON.stringify(row).toLowerCase().includes(lowSearch);
            });
        });
    }, [data, searchTerm, columns]);

    if (!data || data.length === 0) {
        return (
            <div className="card" style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#64748b', margin: 0 }}>No Data Available</h3>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>There are no records to display for {title} in this time range.</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ overflow: 'visible', padding: 0, border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{title}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Exploring {filteredData.length} records</p>
                </div>
                <div style={{ position: 'relative', minWidth: '320px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            backgroundColor: '#f8fafc'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '0 0 16px 16px' }} className="custom-scrollbar">
                <table className="drilldown-table" style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr>
                            {renderExpandedRow && <th style={{ width: '48px', paddingLeft: '24px' }}></th>}
                            {columns.map((col, idx) => (
                                <th key={idx} style={{
                                    padding: '16px',
                                    textAlign: 'left',
                                    fontWeight: '700',
                                    color: '#475569',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    borderBottom: '2px solid #f1f5f9',
                                    background: '#f8fafc',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((row, rowIndex) => {
                            const rowId = row._id || row.id || rowIndex;
                            const isExpanded = expandedRows.has(rowId);

                            return (
                                <React.Fragment key={rowId}>
                                    <tr
                                        onClick={() => renderExpandedRow && toggleRow(rowId)}
                                        style={{ cursor: renderExpandedRow ? 'pointer' : 'default', transition: 'background-color 0.2s' }}
                                    >
                                        {renderExpandedRow && (
                                            <td style={{ paddingLeft: '24px', color: '#94a3b8' }}>
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </td>
                                        )}
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} style={{
                                                padding: '16px',
                                                color: colIndex === 0 ? '#1e293b' : '#475569',
                                                fontWeight: colIndex === 0 ? 600 : 400,
                                                fontSize: '13px'
                                            }}>
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                    {isExpanded && renderExpandedRow && (
                                        <tr>
                                            <td colSpan={columns.length + 1} style={{ padding: '0 24px 24px 72px', backgroundColor: '#f8fafc' }}>
                                                <div style={{
                                                    padding: '24px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '16px',
                                                    border: '1px solid #e2e8f0',
                                                    borderLeft: '4px solid #3b82f6',
                                                    boxShadow: '0 6px 12px -2px rgba(59, 130, 246, 0.08), 0 3px 6px -3px rgba(0, 0, 0, 0.05)',
                                                    marginTop: '-8px'
                                                }}>
                                                    {renderExpandedRow(row)}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        }) : (
                            <tr>
                                <td colSpan={columns.length + (renderExpandedRow ? 1 : 0)} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ marginBottom: '12px', opacity: 0.3 }}>
                                        <Search size={40} style={{ margin: '0 auto' }} />
                                    </div>
                                    No results found for "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <span>Use icons for detailed summaries and execution plans</span>
                <span style={{ fontWeight: 600 }}>Total: {filteredData.length} records</span>
            </div>
        </div>
    );
};

export default DataExplorer;
