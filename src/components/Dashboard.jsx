import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck, Database, Users } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#0ea5e9'];

const Dashboard = () => {
  const { transactions, role } = useAppContext();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      if (t.type === 'expense') exp += Number(t.amount);
    });
    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp
    };
  }, [transactions]);

  const trendData = useMemo(() => {
    // Group by date and calculate running balance
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    const data = [];
    
    sorted.forEach(t => {
      currentBalance += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
      data.push({
        name: new Date(t.date).toLocaleDateString(),
        balance: currentBalance
      });
    });
    
    return data;
  }, [transactions]);

  const barData = useMemo(() => {
    // Income vs Expense over time
    const grouped = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const monthStr = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();
      if (!grouped[monthStr]) {
        grouped[monthStr] = { name: monthStr, income: 0, expense: 0 };
      }
      if (t.type === 'income') grouped[monthStr].income += Number(t.amount);
      else grouped[monthStr].expense += Number(t.amount);
    });
    return Object.values(grouped);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    }));
  }, [transactions]);

  const radarData = useMemo(() => {
    // Show distribution of total amount and frequency per category
    const grouped = {};
    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      if (!grouped[t.category]) grouped[t.category] = { spent: 0, count: 0 };
      grouped[t.category].spent += Number(t.amount);
      grouped[t.category].count += 1;
    });
    return Object.keys(grouped).map(key => ({
      category: key,
      spent: grouped[key].spent,
      count: grouped[key].count * 50 // Scale count purely for visual parity on the chart
    }));
  }, [transactions]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        {role === 'admin' && (
          <span className="badge badge-income" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Administrator Access Active
          </span>
        )}
      </div>
      
      {/* Admin Quick Actions Card */}
      {role === 'admin' && (
        <div className="card" style={{ marginBottom: 32, backgroundColor: 'var(--bg-color)', border: '1px dashed var(--primary-color)' }}>
          <h3 style={{ marginBottom: 16, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={20} /> System Metrics (Admin Only)
          </h3>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Transactions</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{transactions.length}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Users Viewing</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                3 <Users size={18} color="var(--text-secondary)"/>
              </p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Highest Ever Expense</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                ${Math.max(0, ...transactions.filter(t => t.type === 'expense').map(t => Number(t.amount))).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid-cards">
        <div className="card">
          <div className="card-icon" style={{ backgroundColor: 'var(--primary-hover)', color: '#fff' }}>
            <DollarSign size={24} />
          </div>
          <div className="card-title">Total Balance</div>
          <div className="card-value">${balance.toLocaleString()}</div>
        </div>
        
        <div className="card">
          <div className="card-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-color)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="card-title">Total Income</div>
          <div className="card-value">${totalIncome.toLocaleString()}</div>
        </div>
        
        <div className="card">
          <div className="card-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)' }}>
            <TrendingDown size={24} />
          </div>
          <div className="card-title">Total Expenses</div>
          <div className="card-value">${totalExpense.toLocaleString()}</div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Chart 1: Time-based Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">Income vs Expense (Monthly)</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="var(--success-color)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--danger-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Time-based Line Chart */}
        <div className="chart-card">
          <div className="chart-header">Balance Trend</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }} />
                <Line type="monotone" dataKey="balance" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 3: Categorical Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">Spending Breakdown</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Simple Categorical Chart */}
        <div className="chart-card">
          <div className="chart-header">Total Spent by Category</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart layout="vertical" data={radarData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="category" type="category" stroke="var(--text-secondary)" width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar name="Total Spent ($)" dataKey="spent" fill="var(--primary-color)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
