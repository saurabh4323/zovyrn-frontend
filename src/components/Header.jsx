import React from 'react';
import { Menu, Sun, Moon, Shield, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme, role, toggleRole, transactions } = useAppContext();

  const downloadCSV = () => {
    const headers = ['ID', 'Date', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t =>
      `${t.id},${t.date},${t.amount},${t.category},${t.type}`
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'transactions.csv' });
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="header">
      {/* Left: Hamburger */}
      <div className="header-left">
        <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Right: Controls */}
      <div className="header-right">
        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
            onClick={() => role !== 'viewer' && toggleRole()}
          >
            Viewer
          </button>
          <button
            className={`role-btn ${role === 'admin' ? 'active-admin' : ''}`}
            onClick={() => role !== 'admin' && toggleRole()}
          >
            <Shield size={13} />
            Admin
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme} role="button" aria-label="Toggle theme">
          <div className="knob" />
          <div className={`icon ${theme === 'light' ? 'active' : ''}`}>
            <Sun size={13} />
          </div>
          <div className={`icon ${theme === 'dark' ? 'active' : ''}`}>
            <Moon size={13} />
          </div>
        </div>

        {/* Export */}
        <button className="btn-export" onClick={downloadCSV}>
          <Download size={16} />
          <span className="label">Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
