import React from 'react';
import { Moon, Sun, Download, Shield, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { theme, toggleTheme, role, toggleRole, transactions } = useAppContext();

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['ID', 'Date', 'Amount', 'Category', 'Type'];
    csvRows.push(headers.join(','));

    transactions.forEach(t => {
      csvRows.push(`${t.id},${t.date},${t.amount},${t.category},${t.type}`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="header">
      <div></div> {/* Placeholder for LHS */}
      
      <div className="header-right">
        {/* Role Pill Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-color)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '4px' }}>
          <button 
            style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', backgroundColor: role === 'viewer' ? 'var(--surface-color)' : 'transparent', color: role === 'viewer' ? 'var(--text-primary)' : 'var(--text-secondary)', boxShadow: role === 'viewer' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => role !== 'viewer' && toggleRole()}
          >
            Viewer
          </button>
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', backgroundColor: role === 'admin' ? 'var(--surface-color)' : 'transparent', color: role === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)', boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => role !== 'admin' && toggleRole()}
          >
            <Shield size={14} /> Admin
          </button>
        </div>

        {/* Theme Switch */}
        <div className="theme-switch" onClick={toggleTheme}>
          <div className="slider"></div>
          <div className="icon" data-active={theme === 'light'}>
            <Sun size={14} />
          </div>
          <div className="icon" data-active={theme === 'dark'}>
            <Moon size={14} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={downloadCSV}>
          <Download size={18} />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default Header;
