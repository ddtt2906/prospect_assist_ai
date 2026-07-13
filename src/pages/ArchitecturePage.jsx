import React, { useState } from 'react';

export default function ArchitecturePage() {
  const [targetMode, setTargetMode] = useState(false);

  const demoBoxes = [
    { label: 'React Customer Simulator', type: 'demo' },
    { label: 'Local Event Collector', type: 'demo' },
    { label: 'Session Event Store', type: 'demo' },
    { label: 'Synthetic Financial Connectors', type: 'sim' },
    { label: 'Transaction Classification', type: 'demo' },
    { label: 'Feature Engineering', type: 'demo' },
    { label: 'Agent Orchestrator', type: 'demo' },
    { label: 'Decision Engine', type: 'demo' },
    { label: 'RM Workbench', type: 'demo' },
    { label: 'Outcome Feedback', type: 'demo' }
  ];

  const targetBoxes = [
    { label: 'IDBI Web / Mobile / Call Centre', type: 'prod' },
    { label: 'API Gateway and Event Streaming', type: 'prod' },
    { label: 'Consent and Account Aggregator', type: 'prod' },
    { label: 'Core Banking and Credit Sources', type: 'prod' },
    { label: 'Feature Store and Model Services', type: 'prod' },
    { label: 'Governed Agent Orchestrator', type: 'prod' },
    { label: 'CRM / Lead Management / RM Workbench', type: 'prod' },
    { label: 'Outcome and Model Monitoring', type: 'prod' }
  ];

  const boxes = targetMode ? targetBoxes : demoBoxes;

  const getColor = (type) => {
    switch (type) {
      case 'demo': return 'var(--success)';
      case 'sim': return 'var(--warning)';
      case 'prod': return 'var(--text-muted)';
      default: return 'var(--border)';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Architecture</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Visual mapping of the LAKSHYA platform architecture.</p>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <button
            onClick={() => setTargetMode(false)}
            style={{
              padding: '10px 16px', fontSize: '14px', fontWeight: !targetMode ? 600 : 400,
              backgroundColor: !targetMode ? 'var(--idbi-teal-soft)' : 'transparent',
              color: !targetMode ? 'var(--idbi-teal-dark)' : 'var(--text-secondary)',
              borderRight: '1px solid var(--border)'
            }}
          >
            Demo Architecture
          </button>
          <button
            onClick={() => setTargetMode(true)}
            style={{
              padding: '10px 16px', fontSize: '14px', fontWeight: targetMode ? 600 : 400,
              backgroundColor: targetMode ? 'var(--idbi-teal-soft)' : 'transparent',
              color: targetMode ? 'var(--idbi-teal-dark)' : 'var(--text-secondary)'
            }}
          >
            Target Architecture
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        <div id="tour-architecture" style={{ flex: 1, backgroundColor: 'var(--surface-muted)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {boxes.map((box, idx) => (
            <React.Fragment key={idx}>
              <div style={{ 
                width: '100%', maxWidth: '400px', padding: '16px', textAlign: 'center',
                backgroundColor: 'var(--surface)', borderRadius: '8px',
                border: `2px solid ${getColor(box.type)}`,
                fontWeight: 600, color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {box.label}
              </div>
              {idx < boxes.length - 1 && (
                <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>↓</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ width: '250px', backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Legend</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid var(--success)', borderRadius: '4px' }} />
              <span>Implemented in this frontend demo.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid var(--warning)', borderRadius: '4px' }} />
              <span>Simulated integration.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid var(--text-muted)', borderRadius: '4px' }} />
              <span>Target production component.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
