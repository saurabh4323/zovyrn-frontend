import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const initialTransactions = [
  { id: 1, date: '2023-10-01', amount: 3500, category: 'Salary', type: 'income' },
  { id: 2, date: '2023-10-02', amount: 50, category: 'Food', type: 'expense' },
  { id: 3, date: '2023-10-05', amount: 120, category: 'Transport', type: 'expense' },
  { id: 4, date: '2023-10-10', amount: 800, category: 'Rent', type: 'expense' },
  { id: 5, date: '2023-10-15', amount: 200, category: 'Entertainment', type: 'expense' },
  { id: 6, date: '2023-10-20', amount: 150, category: 'Freelance', type: 'income' },
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleRole = () => setRole(prev => (prev === 'viewer' ? 'admin' : 'viewer'));
  
  const addTransaction = (t) => {
    setTransactions(prev => [{ ...t, id: Date.now() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      role, toggleRole,
      transactions, addTransaction, deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};
