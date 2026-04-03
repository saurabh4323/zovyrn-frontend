import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';

const Insights = () => {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const data = {
      expenses: 0,
      income: 0,
      categories: {},
      months: {}
    };

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const date = new Date(t.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (t.type === 'expense') {
        data.expenses += amt;
        data.categories[t.category] = (data.categories[t.category] || 0) + amt;
      } else {
        data.income += amt;
      }

      if (!data.months[monthYear]) data.months[monthYear] = { income: 0, expense: 0 };
      data.months[monthYear][t.type] += amt;
    });

    const res = [];
    
    // Overall health
    if (data.expenses > data.income) {
      res.push({
        title: "Deficit Warning",
        desc: "Your expenses exceed your income overall. Consider reviewing your budget.",
        icon: AlertCircle,
        color: "var(--danger-color)",
        bg: "var(--danger-bg)"
      });
    } else if (data.income > 0) {
      const savingsRate = ((data.income - data.expenses) / data.income * 100).toFixed(1);
      res.push({
        title: "Savings Rate",
        desc: `You are saving ${savingsRate}% of your income! Keep it up.`,
        icon: TrendingUp,
        color: "var(--success-color)",
        bg: "var(--success-bg)"
      });
    }

    // High spend category
    if (Object.keys(data.categories).length > 0) {
      let maxCat = '';
      let maxVal = 0;
      for (const [cat, val] of Object.entries(data.categories)) {
        if (val > maxVal) {
          maxVal = val;
          maxCat = cat;
        }
      }
      res.push({
        title: "Highest Expense Category",
        desc: `You spent the most on ${maxCat} ($${maxVal.toLocaleString()}).`,
        icon: Lightbulb,
        color: "var(--warning-color)",
        bg: "var(--bg-color)"
      });
    }

    return res;
  }, [transactions]);

  return (
    <div>
      <h1 className="page-title">Financial Insights</h1>
      
      {insights.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)' }}>Add more data to generate insights.</div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {insights.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div key={i} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div 
                  style={{ 
                    backgroundColor: ins.bg, 
                    color: ins.color, 
                    width: 64, height: 64, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Icon size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{ins.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{ins.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Insights;
