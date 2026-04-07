import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Transactions() {
  const { transactions, role, addTransaction, deleteTransaction } = useAppContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ date: '', amount: '', category: '', type: 'expense' });

  const filtered = useMemo(() =>
    transactions
      .filter(t => {
        const matchSearch = t.category.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || t.type === filter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, search, filter]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) return;
    addTransaction({ ...form });
    setModalOpen(false);
    setForm({ date: '', amount: '', category: '', type: 'expense' });
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        {role === 'admin' && (
          <button className="btn-add" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> New
          </button>
        )}
      </div>

      {/* Table wrapper */}
      <div className="table-wrapper">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={16} color="var(--muted)" />
            <input
              type="text"
              placeholder="Search category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={40} strokeWidth={1.2} />
            <span>No transactions found</span>
          </div>
        ) : (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div className="desktop-table-wrap">
              <table className="desktop-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    {role === 'admin' && <th style={{ textAlign: 'center' }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--muted)', fontWeight: 500 }}>
                        {formatDate(t.date)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{t.category}</td>
                      <td>
                        <span className={`badge badge-${t.type}`}>
                          {t.type === 'income'
                            ? <ArrowUpCircle size={13} />
                            : <ArrowDownCircle size={13} />}
                          {t.type}
                        </span>
                      </td>
                      <td style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: t.type === 'income' ? 'var(--success)' : 'var(--text)',
                      }}>
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <button className="tx-delete" onClick={() => deleteTransaction(t.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="mobile-tx-list">
              {filtered.map(t => (
                <div key={t.id} className="tx-card">
                  {/* Icon */}
                  <div
                    className="tx-icon"
                    style={{
                      background: t.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {t.type === 'income'
                      ? <ArrowUpCircle size={20} />
                      : <ArrowDownCircle size={20} />}
                  </div>

                  {/* Info */}
                  <div className="tx-info">
                    <div className="tx-category">{t.category}</div>
                    <div className="tx-date">{formatDate(t.date)}</div>
                  </div>

                  {/* Amount */}
                  <div className="tx-right">
                    <div
                      className="tx-amount"
                      style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--text)' }}
                    >
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                    </div>
                    <div
                      className="tx-type"
                      style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}
                    >
                      {t.type}
                    </div>
                  </div>

                  {/* Delete (admin) */}
                  {role === 'admin' && (
                    <button className="tx-delete" onClick={() => deleteTransaction(t.id)}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MODAL ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <h2 className="modal-title">New Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Rent…"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
