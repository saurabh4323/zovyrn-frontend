import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck, Database, Users } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
      fontSize: '0.85rem',
    }}>
      {label && <p style={{ color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: ${Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { transactions, role } = useAppContext();

  const stats = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let bal = 0;
    return sorted.map(t => {
      bal += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
      return {
        name: new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        balance: bal,
      };
    });
  }, [transactions]);

  const barData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const key = new Date(t.date).toLocaleString('en', { month: 'short' });
      if (!map[key]) map[key] = { name: key, income: 0, expense: 0 };
      map[key][t.type] += Number(t.amount);
    });
    return Object.values(map);
  }, [transactions]);

  const pieData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const hBarData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const peakExpense = Math.max(0, ...transactions.filter(t => t.type === 'expense').map(t => Number(t.amount)));

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        {role === 'admin' && (
          <span className="badge badge-admin">
            <ShieldCheck size={14} /> Admin Mode
          </span>
        )}
      </div>

      {/* Admin Card */}
      {role === 'admin' && (
        <div className="admin-card">
          <div className="admin-card-title">
            <Database size={20} /> System Insights
          </div>
          <div className="admin-stats">
            <div>
              <div className="admin-stat-label">Total Records</div>
              <div className="admin-stat-value">{transactions.length}</div>
            </div>
            <div>
              <div className="admin-stat-label">Active Sessions</div>
              <div className="admin-stat-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                12 <Users size={18} color="var(--primary)" />
              </div>
            </div>
            <div>
              <div className="admin-stat-label">Peak Expense</div>
              <div className="admin-stat-value">${peakExpense.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="cards-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-label">Net Balance</div>
          <div className="stat-value">${stats.balance.toLocaleString()}</div>
          <div className="stat-trend" style={{ color: stats.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {stats.balance >= 0 ? '↑ In the green' : '↓ In deficit'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-label">Total Income</div>
          <div className="stat-value">${stats.income.toLocaleString()}</div>
          <div className="stat-trend" style={{ color: 'var(--success)' }}>↑ Revenue earned</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <TrendingDown size={24} />
          </div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${stats.expense.toLocaleString()}</div>
          <div className="stat-trend" style={{ color: 'var(--danger)' }}>↓ Money spent</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">

        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-title">Revenue vs Spending</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-title">Balance Trend</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-title">Expense Breakdown</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="46%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal Bar */}
        <div className="chart-card">
          <div className="chart-title">Top Spending Categories</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              layout="vertical"
              data={hBarData}
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                stroke="var(--muted)"
                tick={{ fontSize: 11, fontFamily: 'Outfit' }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Spent" fill="var(--primary)" radius={[0, 6, 6, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
