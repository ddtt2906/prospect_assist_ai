import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackLoopPage() {
  const { state, dispatch } = useDemo();
  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);

  const [form, setForm] = useState({
    contacted: true,
    callConnected: true,
    applicationResumed: true,
    documentsSubmitted: false,
    demoApproved: false,
    demoDisbursed: false,
    acceptedAmount: customer?.requestedAmount || 0,
    nonConversionReason: '',
    rmComments: ''
  });

  const handleSave = () => {
    const outcome = {
      leadId: `LEAD-${state.selectedCustomerId}-001`,
      ...form,
      outcomeTimestamp: new Date().toISOString()
    };
    dispatch({ type: 'SET_FEEDBACK', payload: outcome });
    toast.success('Outcome recorded for model training.');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Feedback Loop</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Record synthetic conversion outcome to train future models.</p>
      </div>

      <div id="tour-feedback" style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 24px 0' }}>Record Outcome for {customer?.name}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { key: 'contacted', label: 'Customer contacted?' },
            { key: 'callConnected', label: 'Call connected?' },
            { key: 'applicationResumed', label: 'Application resumed?' },
            { key: 'documentsSubmitted', label: 'Documents submitted?' },
            { key: 'demoApproved', label: 'Approved in demo?' },
            { key: 'demoDisbursed', label: 'Disbursed in demo?' }
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="checkbox" 
                checked={form[item.key]}
                onChange={e => setForm({ ...form, [item.key]: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--idbi-teal)' }}
              />
              <label style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</label>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Accepted Amount (₹)</label>
            <input 
              type="number" 
              value={form.acceptedAmount}
              onChange={e => setForm({ ...form, acceptedAmount: Number(e.target.value) })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Non-conversion Reason (if applicable)</label>
            <select 
              value={form.nonConversionReason}
              onChange={e => setForm({ ...form, nonConversionReason: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
            >
              <option value="">-- Select --</option>
              <option value="RATES_TOO_HIGH">Rates too high</option>
              <option value="WENT_TO_COMPETITOR">Went to competitor</option>
              <option value="PURCHASE_DELAYED">Purchase delayed</option>
              <option value="CANNOT_PROVIDE_DOCS">Cannot provide required documents</option>
              <option value="NOT_INTERESTED">Not interested</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>RM Comments</label>
            <textarea 
              rows={3}
              value={form.rmComments}
              onChange={e => setForm({ ...form, rmComments: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
            backgroundColor: 'var(--idbi-teal)', color: '#fff', borderRadius: '8px', fontWeight: 600
          }}>
            <Save size={18} /> Save Outcome
          </button>

          {state.feedbackOutcome && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Outcome stored in current demo session. Future training label created.
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
