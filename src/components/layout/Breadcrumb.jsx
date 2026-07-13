import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const STAGES = [
  { path: '/customer-simulator', label: 'Capture Signal', desc: 'Simulate behavioral intent' },
  { path: '/data-capture', label: 'Connect Data', desc: 'Secure financial data via AA' },
  { path: '/transaction-intelligence', label: 'Engineer Features', desc: 'Classify income & capacity' },
  { path: '/agent-console', label: 'Run Agents', desc: 'Execute governed models' },
  { path: '/lead-decision', label: 'Generate Lead', desc: 'Explainable recommendation' },
  { path: '/rm-workbench', label: 'RM Action', desc: 'Next-best action handoff' },
  { path: '/feedback-loop', label: 'Learn', desc: 'Capture outcome for models' }
];

export default function Breadcrumb() {
  const location = useLocation();
  const currentIndex = STAGES.findIndex(s => s.path === location.pathname);

  // If not on a workflow page, don't show the breadcrumb
  if (currentIndex === -1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    }}>
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;
        const isPending = idx > currentIndex;

        return (
          <React.Fragment key={stage.path}>
            <NavLink
              to={stage.path}
              title={stage.desc}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--idbi-orange-dark)' : isCompleted ? 'var(--idbi-teal)' : 'var(--text-muted)'
              }}
            >
              <div style={{
                width: '24px', height: '24px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600,
                backgroundColor: isActive ? 'var(--idbi-orange-soft)' : isCompleted ? 'var(--idbi-teal-soft)' : 'var(--surface-muted)',
                border: `1.5px solid ${isActive ? 'var(--idbi-orange)' : isCompleted ? 'var(--idbi-teal)' : 'var(--border)'}`,
                color: isActive ? 'var(--idbi-orange-dark)' : isCompleted ? 'var(--idbi-teal)' : 'var(--text-muted)'
              }}>
                {isCompleted ? <Check size={14} strokeWidth={3} /> : (idx + 1)}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>
                {stage.label}
              </span>
            </NavLink>
            
            {idx < STAGES.length - 1 && (
              <div style={{
                width: '30px',
                height: '1.5px',
                backgroundColor: isCompleted ? 'var(--idbi-teal)' : 'var(--border)',
                margin: '0 8px'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
