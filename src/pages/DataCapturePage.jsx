import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { Database, ShieldCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataCapturePage() {
  const { state, dispatch } = useDemo();
  const [showConsent, setShowConsent] = useState(false);

  const connectors = [
    { id: 'clickstream', name: 'Digital Clickstream', source: 'Web and mobile behavioural events', type: 'internal' },
    { id: 'coreBanking', name: 'IDBI Core Banking', source: 'Synthetic savings-account transactions', type: 'internal' },
    { id: 'creditProfile', name: 'Credit Profile', source: 'Synthetic bureau summary and obligations', type: 'internal' },
    { id: 'accountAggregator', name: 'Account Aggregator', source: 'Synthetic external current account', type: 'external' }
  ];

  const handleConnect = (id) => {
    if (id === 'accountAggregator') {
      setShowConsent(true);
    } else {
      dispatch({ type: 'UPDATE_CONNECTION', payload: { source: id, status: true } });
      toast.success('Connected successfully');
    }
  };

  const handleDisconnect = (id) => {
    dispatch({ type: 'UPDATE_CONNECTION', payload: { source: id, status: false } });
    if (id === 'accountAggregator') {
      dispatch({ type: 'SET_CONSENT', payload: null });
    }
    toast.success('Disconnected successfully');
  };

  const grantConsent = () => {
    dispatch({ type: 'UPDATE_CONNECTION', payload: { source: 'accountAggregator', status: true } });
    dispatch({
      type: 'SET_CONSENT',
      payload: {
        consentId: `CONSENT-${state.selectedCustomerId}-001`,
        customerId: state.selectedCustomerId,
        purpose: "REPAYMENT_CAPACITY_ASSESSMENT",
        dataTypes: ["TRANSACTIONS", "ACCOUNT_METADATA", "RECURRING_OBLIGATIONS"],
        accounts: [`ACC-IDBI-${state.selectedCustomerId.split('-')[1]}`, `ACC-EXT-${state.selectedCustomerId.split('-')[1]}`],
        status: "GRANTED",
        grantedAt: new Date().toISOString(),
        storagePolicy: "SESSION_ONLY"
      }
    });
    setShowConsent(false);
    toast.success('Consent granted and Account Aggregator connected');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Data Capture</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Manage synthetic data sources. Note that external sources require customer consent.
      </p>

      <div id="tour-connectors" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {connectors.map(c => {
          const isConnected = state.connectedSources[c.id];
          return (
            <div key={c.id} style={{
              backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px',
              border: `1px solid ${isConnected ? 'var(--idbi-teal)' : 'var(--border)'}`,
              display: 'flex', flexDirection: 'column', gap: '16px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Database size={24} style={{ color: isConnected ? 'var(--idbi-teal)' : 'var(--text-muted)' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{c.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.source}</div>
                  </div>
                </div>
                {isConnected ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                    <CheckCircle2 size={14} /> Connected
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--warning)', fontWeight: 600 }}>
                    <AlertCircle size={14} /> {c.type === 'external' ? 'Consent Required' : 'Available'}
                  </span>
                )}
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                {isConnected ? (
                  <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                    <button onClick={() => handleDisconnect(c.id)} style={{
                      padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                      backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', color: 'var(--text-secondary)'
                    }}>
                      Disconnect
                    </button>
                    <div style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '11px', backgroundColor: '#1e1e1e', color: '#4caf50', border: '1px solid var(--border)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {c.id === 'clickstream' && '{"events": 142, "last": "page_view"}'}
                      {c.id === 'coreBanking' && '{"txns": 850, "balance": 45000}'}
                      {c.id === 'creditProfile' && '{"score": 750, "loans": 2}'}
                      {c.id === 'accountAggregator' && '{"banks": 2, "txns": 320}'}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => handleConnect(c.id)} style={{
                    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                    backgroundColor: 'var(--idbi-teal)', color: '#fff'
                  }}>
                    Connect Source
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showConsent && (
        <div id="tour-consent" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(23, 52, 46, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'var(--surface)', padding: '32px', borderRadius: '16px',
            width: '100%', maxWidth: '600px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)'
          }}>
            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <ShieldCheck size={24} style={{ color: 'var(--idbi-teal)' }}/> Data Sharing Consent Request
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Purpose:</strong>
                <p style={{ margin: '4px 0 0 0' }}>Estimate sustainable income and repayment capacity.</p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Requested:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  <li>12 months of account transactions</li>
                  <li>Existing recurring obligations</li>
                  <li>Account ownership metadata</li>
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Not requested:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  <li>Investment holdings</li>
                  <li>Insurance information</li>
                  <li>Unrelated financial products</li>
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Retention:</strong>
                <p style={{ margin: '4px 0 0 0' }}>Current demo session only.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConsent(false)} style={{
                padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', color: 'var(--text-primary)'
              }}>
                Cancel
              </button>
              <button onClick={grantConsent} style={{
                padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                backgroundColor: 'var(--idbi-teal)', color: '#fff'
              }}>
                Allow Selected Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
