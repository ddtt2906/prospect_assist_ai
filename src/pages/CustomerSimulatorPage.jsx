import React, { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { Play, Square, FastForward, RotateCcw, ChevronRight, Activity, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerSimulatorPage() {
  const { state, dispatch, trackEvent } = useDemo();
  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const timeline = customer?.behaviouralTimeline || [];
  
  useEffect(() => {
    // If we switch customers, reset simulation state
    setCurrentEventIndex(state.events.length);
    setIsPlaying(false);
  }, [state.selectedCustomerId, state.events.length]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentEventIndex < timeline.length) {
      const delay = (700 / playbackSpeed);
      timer = setTimeout(() => {
        const evt = timeline[currentEventIndex];
        trackEvent(evt.eventType, evt.properties);
        setCurrentEventIndex(prev => prev + 1);
      }, delay);
    } else if (currentEventIndex >= timeline.length && isPlaying) {
      setIsPlaying(false);
      toast.success('Simulation completed');
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentEventIndex, timeline, playbackSpeed, trackEvent]);

  const handlePlay = () => {
    if (currentEventIndex >= timeline.length) {
      dispatch({ type: 'CLEAR_EVENTS' });
      setCurrentEventIndex(0);
    }
    setIsPlaying(true);
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_EVENTS' });
    setCurrentEventIndex(0);
    setIsPlaying(false);
  };

  if (!customer) return <div>No customer selected.</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 350px', gap: '24px', height: '100%' }}>
      
      {/* Left: Customer Profile */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--idbi-teal-soft)',
            color: 'var(--idbi-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px'
          }}>
            {customer.initials}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px' }}>{customer.name}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{customer.customerId}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div><strong>Employment:</strong> {customer.employmentType}</div>
          <div><strong>Location:</strong> {customer.city}</div>
          <div><strong>Requested:</strong> ₹{customer.requestedAmount.toLocaleString('en-IN')}</div>
          <div><strong>Product:</strong> {customer.requestedProduct.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Center: Simulator Controls & Mock UI */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--idbi-orange)' }}/> Journey Simulator
          </h2>
          <div id="tour-run-behaviour" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={handlePlay} disabled={isPlaying} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
              backgroundColor: isPlaying ? 'var(--surface-muted)' : 'var(--idbi-teal)',
              color: isPlaying ? 'var(--text-muted)' : '#fff',
              borderRadius: '6px', fontWeight: 600, fontSize: '13px'
            }}>
              <Play size={14} /> Play
            </button>
            <button onClick={() => setIsPlaying(false)} disabled={!isPlaying} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
              backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px'
            }}>
              <Square size={14} />
            </button>
            <button onClick={handleClear} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
              backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px'
            }}>
              <RotateCcw size={14} />
            </button>
            <select 
              value={playbackSpeed} 
              onChange={e => setPlaybackSpeed(Number(e.target.value))}
              style={{ padding: '7px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--page-bg)', borderRadius: '8px', border: '1px dashed var(--border-strong)' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>The simulator replays {customer.name}'s digital footprint.</p>
            <p style={{ fontSize: '13px' }}>Click Play to generate the events.</p>
          </div>
        </div>
      </div>

      {/* Right: Event Stream */}
      <div id="tour-event-stream" style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: 0, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} /> Live Event Stream
        </h2>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {state.events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No events captured yet.<br/>Run the simulator.
            </div>
          ) : (
            state.events.map((evt, idx) => (
              <div key={idx} style={{ 
                padding: '12px', backgroundColor: 'var(--page-bg)', borderRadius: '8px', borderLeft: '3px solid var(--idbi-teal)',
                fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11px' }}>
                  <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  <span>{evt.eventId}</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{evt.eventType.replace(/_/g, ' ').toUpperCase()}</strong>
                <pre style={{ margin: '4px 0 0 0', padding: '8px', backgroundColor: 'var(--surface)', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', color: 'var(--text-secondary)' }}>
                  {JSON.stringify(evt.properties, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
