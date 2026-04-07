import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, AlertCircle, Lightbulb, PiggyBank, Zap } from 'lucide-react';

export default function Insights() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (!transactions.length) return [];

    let income = 0, expense = 0;
    const categories = {};
    const months = {};

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (t.type === 'income') income += amt;
      else {
        expense += amt;
        categories[t.category] = (categories[t.category] || 0) + amt;
      }

      if (!months[key]) months[key] = { income: 0, expense: 0, label: d.toLocaleString('en', { month: 'long', year: 'numeric' }) };
      months[key][t.type] += amt;
    });

    const list = [];

    // Savings rate or deficit
    if (expense > income) {
      list.push({
        icon: AlertCircle,
        color: 'var(--danger)',
        bg: 'var(--danger-bg)',
        title: 'Deficit Warning',
        desc: `You've spent $${(expense - income).toLocaleString()} more than you earned. Review your budget immediately.`,
      });
    } else if (income > 0) {
      const rate = (((income - expense) / income) * 100).toFixed(1);
      list.push({
        icon: TrendingUp,
        color: 'var(--success)',
        bg: 'var(--success-bg)',
        title: `${rate}% Savings Rate`,
        desc: `Great discipline! You're saving ${rate}% of your income. Financial advisors recommend 20%+.`,
      });
    }

    // Highest spend category
    const topCat = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      list.push({
        icon: Lightbulb,
        color: 'var(--warning)',
        bg: 'rgba(245,158,11,0.12)',
        title: 'Top Expense Category',
        desc: `You spent the most on ${topCat[0]} — $${topCat[1].toLocaleString()} total. Consider if this aligns with your goals.`,
      });
    }

    // Expense ratio
    if (income > 0) {
      const ratio = ((expense / income) * 100).toFixed(0);
      list.push({
        icon: PiggyBank,
        color: 'var(--primary)',
        bg: 'var(--primary-light)',
        title: `${ratio}% Expense Ratio`,
        desc: `You're spending ${ratio}% of your income. ${ratio > 80 ? 'This is high — try to cut back.' : 'Looking healthy, keep it up!'}`,
      });
    }

    // Most active month
    const busiest = Object.values(months).sort((a, b) => (b.income + b.expense) - (a.income + a.expense))[0];
    if (busiest) {
      list.push({
        icon: Zap,
        color: 'var(--primary)',
        bg: 'var(--primary-light)',
        title: 'Most Active Month',
        desc: `${busiest.label} had the most activity — $${busiest.income.toLocaleString()} earned and $${busiest.expense.toLocaleString()} spent.`,
      });
    }

    return list;
  }, [transactions]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
      </div>

      {insights.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 24px' }}>
          <Lightbulb size={48} strokeWidth={1.2} style={{ opacity: 0.4 }} />
          <span>Add transactions to generate insights</span>
        </div>
      ) : (
        <div className="insights-grid">
          {insights.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div key={i} className="insight-card">
                <div
                  className="insight-icon"
                  style={{ background: ins.bg, color: ins.color }}
                >
                  <Icon size={28} />
                </div>
                <div className="insight-body">
                  <h3>{ins.title}</h3>
                  <p>{ins.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
