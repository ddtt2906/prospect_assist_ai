import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { formatCurrency } from '../utils/formatters';
import { PhoneCall, MessageSquare, FileText, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function RMWorkbenchPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);
  const decision = state.finalDecision;

  if (!decision) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <h2>No Lead Generated</h2>
        <p>Complete the workflow first.</p>
      </div>
    );
  }

  const handleAction = (msg) => {
    toast.success(msg);
    navigate('/feedback-loop');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', height: '100%' }}>
      
      {/* Left: Lead Dossier */}
      <div id="tour-rm-brief" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 24px 0', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            Lead Dossier: {customer.name}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Customer objective</strong>
                <div style={{ fontSize: '15px' }}>Purchase a car within {customer.purchaseTimelineDays} days.</div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Why this is a serious lead</strong>
                <div style={{ fontSize: '15px', lineHeight: 1.5 }}>Repeated calculator use, application initiation, return after abandonment and confirmed purchase timeline.</div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Why the application stopped</strong>
                <div style={{ fontSize: '15px', color: 'var(--danger)' }}>Customer was uncertain about {decision.barrier.toLowerCase().replace(/_/g, ' ')}.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'var(--surface-muted)', padding: '24px', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Observed sustainable income</strong>
                <div style={{ fontSize: '15px' }}>{formatCurrency(decision.sustainableIncome)} monthly median.</div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Stress-adjusted income</strong>
                <div style={{ fontSize: '15px' }}>{formatCurrency(decision.stressAdjustedIncome)}.</div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Recommended offer</strong>
                <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--idbi-teal-dark)' }}>{formatCurrency(decision.recommendedAmount)}.</div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Recommended action</strong>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>Call with {decision.barrier.toLowerCase().replace(/_/g, ' ')} assistance.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>Call Preparation (RM Copilot)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--warning)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}>
              <strong>Important constraints:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Do not tell the customer that an AI has labelled them high risk.</li>
                <li>Do not promise sanction.</li>
                <li>Do not alter calculated figures.</li>
              </ul>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <strong style={{ fontSize: '14px' }}>Recommended Opening:</strong>
              <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "Hi {customer.name}, I noticed you were exploring our Auto Loan options. I'm calling to personally assist you with the income documentation for freelancers to make the process completely hassle-free."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Execute Action</h3>
        
        <button onClick={() => handleAction('Call initiated')} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px',
          backgroundColor: 'var(--idbi-teal)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600
        }}>
          <PhoneCall size={20} /> Start simulated call
        </button>

        <button onClick={() => handleAction('Message sent')} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px',
          backgroundColor: 'var(--surface)', color: 'var(--idbi-teal-dark)', border: '1px solid var(--idbi-teal)', cursor: 'pointer', fontWeight: 600
        }}>
          <MessageSquare size={20} /> Send personalised message
        </button>

        <button onClick={() => handleAction('Document link sent')} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px',
          backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 500
        }}>
          <FileText size={20} /> Request documents
        </button>

        <button onClick={() => handleAction('Marked unavailable')} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px',
          backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 500
        }}>
          <XCircle size={20} /> Mark customer unavailable
        </button>
        
        <button onClick={() => navigate('/feedback-loop')} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px',
          backgroundColor: 'var(--surface-muted)', color: 'var(--text-primary)', border: '1px dashed var(--border-strong)', cursor: 'pointer', fontWeight: 600, marginTop: '16px'
        }}>
          <CheckCircle size={20} /> Record outcome
        </button>
      </div>

    </div>
  );
}
