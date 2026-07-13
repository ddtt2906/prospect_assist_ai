import React from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { formatCurrency } from '../utils/formatters';
import { AlertCircle, Target, Shield, CheckCircle2 } from 'lucide-react';

export default function LeadDecisionPage() {
  const { state } = useDemo();
  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);
  const decision = state.finalDecision;

  if (!decision) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <h2>No Decision Generated</h2>
        <p>Please run the agents in the Agent Console first.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
            {customer.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '16px' }}>
            {customer.requestedProduct.replace('_', ' ')} — 
            <span style={{ color: 'var(--idbi-teal-dark)', fontWeight: 600, marginLeft: '6px' }}>Qualified Assisted Lead</span>
          </p>
        </div>
      </div>

      <div id="tour-decision" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {[
          { label: 'Intent', score: decision.intentScore, max: 100 },
          { label: 'Income Confidence', score: decision.incomeConfidence, max: 100 },
          { label: 'Affordability Fit', score: 78, max: 100 }, // Simulated
          { label: 'Eligibility Confidence', score: 86, max: 100 },
          { label: 'Trust Confidence', score: decision.trustConfidence, max: 100 }
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: s.score > 70 ? 'var(--success)' : s.score > 40 ? 'var(--warning)' : 'var(--danger)' }}>
              {s.score}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{s.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Main Recommendation */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 24px 0' }}>Recommendation Summary</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Requested amount:</span>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{formatCurrency(customer.requestedAmount)}</div>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Stress-safe recommended amount:</span>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--idbi-teal-dark)' }}>{formatCurrency(decision.recommendedAmount)}</div>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Recommended EMI:</span>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Approx. {formatCurrency(decision.stressSafeEmi)}</div>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Primary conversion barrier:</span>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--danger)' }}>{decision.barrier.replace(/_/g, ' ')}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--idbi-teal-soft)', padding: '20px', borderRadius: '8px', border: '1px solid var(--idbi-teal)' }}>
            <span style={{ fontSize: '13px', color: 'var(--idbi-teal-dark)', fontWeight: 600, textTransform: 'uppercase' }}>Recommended Action</span>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {decision.recommendedAction.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        {/* NBA Table */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '16px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} style={{ color: 'var(--idbi-orange)' }}/> Next-Best-Action
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            {[
              { action: 'No action', conv: '29%' },
              { action: 'Generic notification', conv: '33%' },
              { action: 'Personalised message', conv: '45%' },
              { action: 'RM call (original offer)', conv: '49%' },
              { action: 'RM call (revised offer)', conv: '57%', highlight: true }
            ].map((row, i) => (
              <div key={i} style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '12px', 
                backgroundColor: row.highlight ? 'var(--idbi-orange-soft)' : 'transparent',
                border: row.highlight ? '1px solid var(--idbi-orange)' : '1px solid var(--border)',
                borderRadius: '6px', fontWeight: row.highlight ? 600 : 400
              }}>
                <span style={{ color: row.highlight ? 'var(--idbi-orange-dark)' : 'var(--text-primary)' }}>{row.action}</span>
                <span>{row.conv}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
            Synthetic demonstration estimates. Not trained on production data.
          </p>
        </div>

      </div>
    </div>
  );
}
