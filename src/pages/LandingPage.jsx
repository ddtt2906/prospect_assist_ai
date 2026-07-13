import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { Play, Compass, Activity, Database, LineChart, Target, Users, Server, FileDigit, Cpu, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useDemo();

  const handleStartTour = () => {
    dispatch({ type: 'UPDATE_TOUR', payload: { run: true, stepIndex: 0 } });
  };

  const handleCustomerSelect = (customerId) => {
    dispatch({ type: 'SET_CUSTOMER', payload: customerId });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ fontSize: '34px', color: 'var(--idbi-teal-deep)', marginBottom: '16px' }}>
            From Digital Footprints to Qualified Lending Opportunities
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            LAKSHYA verifies intent, reconstructs sustainable income, calculates stress-safe affordability and recommends the next action most likely to create responsible conversion.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              id="tour-welcome"
              onClick={handleStartTour}
              style={{
                backgroundColor: 'var(--idbi-orange)', color: '#fff',
                padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Play size={18} /> Start Technical Tour
            </button>
            <button 
              onClick={() => navigate('/customer-simulator')}
              style={{
                backgroundColor: 'var(--surface)', color: 'var(--idbi-teal)',
                border: '2px solid var(--idbi-teal)',
                padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Compass size={18} /> Explore Application
            </button>
          </div>
        </motion.div>
      </section>

      {/* Product Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { icon: Activity, title: 'Behavioural Signal Capture', color: 'var(--idbi-teal)' },
          { icon: Database, title: 'Actual Income Reconstruction', color: 'var(--idbi-orange)' },
          { icon: LineChart, title: 'Repayment Capacity Simulation', color: 'var(--info)' },
          { icon: Target, title: 'Causal Next-Best Action', color: 'var(--success)' }
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.5 }}
            style={{
              backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'
            }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--surface-muted)', borderRadius: '8px', color: card.color }}>
              <card.icon size={24} />
            </div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>{card.title}</h3>
          </motion.div>
        ))}
      </section>

      {/* Statistics */}
      <section style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', 
        backgroundColor: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' 
      }}>
        {[
          { icon: Bot, stat: '6', label: 'Specialised Agents' },
          { icon: Server, stat: '4', label: 'Simulated Data Sources' },
          { icon: FileDigit, stat: '12', label: 'Months Financial History' },
          { icon: Cpu, stat: '1', label: 'End-to-End Explainable Trace' }
        ].map((item, i) => (
          <div key={i} style={{ backgroundColor: 'var(--surface)', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <item.icon size={24} style={{ color: 'var(--text-muted)' }} />
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--idbi-teal-dark)' }}>{item.stat}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</div>
          </div>
        ))}
      </section>

      {/* Demo Customers */}
      <section id="tour-persona-picker">
        <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} style={{ color: 'var(--idbi-teal)' }}/> Select Demo Customer
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {demoCustomers.map(customer => (
            <div 
              key={customer.customerId}
              onClick={() => handleCustomerSelect(customer.customerId)}
              style={{
                backgroundColor: 'var(--surface)',
                border: `2px solid ${state.selectedCustomerId === customer.customerId ? 'var(--idbi-orange)' : 'var(--border)'}`,
                borderRadius: '12px', padding: '16px', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: state.selectedCustomerId === customer.customerId ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: state.selectedCustomerId === customer.customerId ? 'var(--idbi-orange-soft)' : 'var(--idbi-teal-soft)',
                    color: state.selectedCustomerId === customer.customerId ? 'var(--idbi-orange-dark)' : 'var(--idbi-teal-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}>
                    {customer.initials}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{customer.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{customer.employmentType.replace('_', ' ')} • {customer.city}</span>
                  </div>
                </div>
                <div style={{
                  fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px',
                  backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)'
                }}>
                  {customer.requestedProduct.replace('_', ' ')}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, padding: '8px', backgroundColor: 'var(--page-bg)', borderRadius: '6px' }}>
                <strong>Scenario:</strong> {customer.demoScenario.replace(/_/g, ' ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p><strong>IDBI Innovate 2026 Hackathon Prototype</strong></p>
        <p>Uses synthetic customer and transaction data. Not connected to IDBI Bank systems. Not a real loan offer or credit decision.</p>
      </footer>
    </div>
  );
}
