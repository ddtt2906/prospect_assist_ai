import React, { useState, useEffect, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { generateTransactions } from '../utils/generateTransactions';
import { engineerFeatures } from '../services/featureEngineering';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileDigit, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionIntelligencePage() {
  const { state, dispatch } = useDemo();
  const [activeTab, setActiveTab] = useState('Classification');
  
  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);

  // Generate transactions when we load the page (simulating fetching from connected sources)
  useEffect(() => {
    if (customer && state.connectedSources.coreBanking && state.connectedSources.accountAggregator) {
      if (state.transactions.length === 0) {
        const txns = generateTransactions(customer);
        dispatch({ type: 'SET_TRANSACTIONS', payload: txns });
        
        // Also engineer features immediately
        const features = engineerFeatures(txns, 42250, customer.existingMonthlyEmi);
        dispatch({ type: 'SET_ENGINEERED_FEATURES', payload: features });
        
        toast.success("Transactions loaded and classified");
      }
    }
  }, [customer, state.connectedSources, state.transactions.length, dispatch]);

  const monthlyChartData = useMemo(() => {
    if (!state.transactions || state.transactions.length === 0) return [];
    const monthlyMap = {};
    
    state.transactions.forEach(txn => {
      const month = txn.date.substring(0, 7);
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, GenuineIncome: 0, TotalCredits: 0, EssentialExp: 0 };
      }
      if (txn.credit > 0) {
        monthlyMap[month].TotalCredits += txn.credit;
        if (txn.includedInIncome) monthlyMap[month].GenuineIncome += txn.credit;
      }
      if (txn.category === 'UTILITY') {
        monthlyMap[month].EssentialExp += txn.debit;
      }
    });

    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
  }, [state.transactions]);

  if (!state.connectedSources.coreBanking || !state.connectedSources.accountAggregator) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <AlertTriangle size={48} style={{ color: 'var(--warning)', margin: '0 auto 16px' }} />
        <h2>Data Sources Required</h2>
        <p>Please connect Core Banking and Account Aggregator to view transaction intelligence.</p>
      </div>
    );
  }

  const features = state.engineeredFeatures;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Transaction Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Classifying raw transactions to reconstruct true income.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          {['Classification', 'Raw Transactions', 'Monthly Cash Flow', 'Feature Store'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px', fontSize: '14px', fontWeight: activeTab === tab ? 600 : 400,
                backgroundColor: activeTab === tab ? 'var(--idbi-teal-soft)' : 'transparent',
                color: activeTab === tab ? 'var(--idbi-teal-dark)' : 'var(--text-secondary)',
                borderRight: tab !== 'Feature Store' ? '1px solid var(--border)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
        
        {activeTab === 'Classification' && (
          <div id="tour-transaction-classification" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--surface-muted)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
                <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Income Reconciliation</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Average monthly credits</span>
                    <strong>{formatCurrency(131800)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>Less: Internal transfers</span>
                    <span>- {formatCurrency(18200)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>Less: Refunds</span>
                    <span>- {formatCurrency(4100)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>Less: Loan/non-income credits</span>
                    <span>- {formatCurrency(9500)}</span>
                  </div>
                  <hr style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: 'var(--idbi-teal-dark)' }}>
                    <strong>Estimated sustainable income</strong>
                    <strong>{formatCurrency(features?.recurringMonthlyIncome)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <span>Stress-adjusted income</span>
                    <strong>{formatCurrency(features?.stressAdjustedIncome)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Income confidence</span>
                    <strong>89%</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Account Transfer Graph</h3>
                <div style={{ flex: 1, backgroundColor: 'var(--surface-muted)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', width: '200px' }}>
                    <strong>External Current Account</strong>
                  </div>
                  <div style={{ padding: '12px 0', color: 'var(--idbi-orange)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>₹18,000 transfer</span>
                    <span>↓</span>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid var(--idbi-teal)', borderRadius: '8px', textAlign: 'center', width: '200px', color: 'var(--idbi-teal-dark)' }}>
                    <strong>IDBI Savings Account</strong>
                  </div>
                  <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px' }}>
                    Excluded from income because both accounts belong to the same customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Raw Transactions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-muted)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>Credit</th>
                  <th style={{ padding: '12px' }}>Debit</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Included?</th>
                </tr>
              </thead>
              <tbody>
                {state.transactions.slice(0, 50).map(txn => (
                  <tr key={txn.transactionId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{txn.date}</td>
                    <td style={{ padding: '12px' }}>{txn.description}</td>
                    <td style={{ padding: '12px', color: 'var(--success)' }}>{txn.credit ? formatCurrency(txn.credit) : '-'}</td>
                    <td style={{ padding: '12px' }}>{txn.debit ? formatCurrency(txn.debit) : '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-muted)', fontSize: '11px' }}>
                        {txn.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {txn.includedInIncome ? 
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Yes</span> : 
                        <span style={{ color: 'var(--text-muted)' }}>No</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '16px', fontSize: '13px' }}>Showing first 50 transactions</p>
          </div>
        )}

        {activeTab === 'Monthly Cash Flow' && (
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="TotalCredits" name="Total Credits" fill="var(--idbi-teal-light)" />
                <Bar dataKey="GenuineIncome" name="Genuine Income" fill="var(--idbi-teal)" />
                <Bar dataKey="EssentialExp" name="Essential Expenditure" fill="var(--idbi-orange)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'Feature Store' && (
          <div id="tour-feature-store" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>The models receive structured, inspectable features rather than an unverified raw statement or an LLM opinion.</p>
            <div style={{ backgroundColor: '#282c34', padding: '24px', borderRadius: '12px', overflowX: 'auto', color: '#abb2bf', fontFamily: 'monospace', fontSize: '14px' }}>
              <pre style={{ margin: 0 }}>
{JSON.stringify({
  loanPageVisits7d: 4,
  calculatorUses7d: 7,
  applicationCompletionPct: 62,
  returnedAfterAbandonment: true,
  confirmedPurchaseTimelineDays: 30,
  recurringMonthlyIncome: features?.recurringMonthlyIncome,
  stressAdjustedIncome: features?.stressAdjustedIncome,
  incomeVolatility: features?.incomeVolatility?.toFixed(4),
  incomeSourceCount: 4,
  largestIncomeSourceShare: 0.37,
  essentialMonthlyExpense: features?.essentialMonthlyExpense,
  discretionaryMonthlyExpense: 14000,
  existingMonthlyEmi: features?.existingMonthlyEmi,
  minimumMonthlySurplus: features?.minimumMonthlySurplus,
  negativeBalanceDays: 0,
  emiBounceCount12m: 0
}, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
