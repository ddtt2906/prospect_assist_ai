import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { RefreshCw, RotateCcw, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the demo? All unsaved data will be lost.")) {
      dispatch({ type: 'RESET_DEMO' });
      navigate('/');
    }
  };

  const handleRestartTour = () => {
    dispatch({ type: 'UPDATE_TOUR', payload: { run: true, stepIndex: 0 } });
    navigate('/');
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ color: 'var(--idbi-teal)', margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>
          LAKSHYA
        </h1>
        <span style={{
          backgroundColor: 'var(--idbi-teal-soft)',
          color: 'var(--idbi-teal-dark)',
          padding: '4px 10px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          IDBI Innovate 2026 Prototype
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Demo Customer:</span>
          <strong style={{ color: 'var(--idbi-teal-dark)' }}>{state.selectedCustomerId}</strong>
        </div>
        
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', fontWeight: 600,
          color: state.aiMode === 'Live Groq' ? 'var(--idbi-orange)' : 'var(--text-muted)'
        }}>
          <Zap size={14} />
          {state.aiMode}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleRestartTour} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', fontSize: '13px',
            backgroundColor: 'var(--surface-muted)',
            border: '1px solid var(--border)', borderRadius: '6px',
            color: 'var(--text-secondary)'
          }}>
            <RotateCcw size={14} /> Tour
          </button>
          <button onClick={handleReset} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', fontSize: '13px',
            backgroundColor: 'var(--surface-muted)',
            border: '1px solid var(--border)', borderRadius: '6px',
            color: 'var(--text-secondary)'
          }}>
            <RefreshCw size={14} /> Reset
          </button>
          <button onClick={() => navigate('/ai-lab')} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', fontSize: '13px',
            backgroundColor: 'var(--surface-muted)',
            border: '1px solid var(--border)', borderRadius: '6px',
            color: 'var(--text-secondary)'
          }}>
            <Settings size={14} /> AI
          </button>
        </div>
      </div>
    </header>
  );
}
