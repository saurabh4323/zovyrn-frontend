import React from 'react';
import { Home, List, PieChart, Activity, X } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'insights', label: 'Insights', icon: PieChart },
];

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <Activity size={28} strokeWidth={2.5} />
        <span>Zovyrn</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <ul className="nav-menu">
        {tabs.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <div
              className={`nav-link ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        © 2026 Zovyrn Finance<br />v1.2.0
      </div>
    </aside>
  );
};

export default Sidebar;
