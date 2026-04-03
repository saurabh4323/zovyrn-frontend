import React from 'react';
import { Home, List, PieChart, Activity } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Activity size={28} />
        Zovyrn Finance
      </div>
      <ul className="nav-menu">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <li key={tab.id} className="nav-item">
              <a
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
