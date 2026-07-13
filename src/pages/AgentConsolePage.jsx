import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { demoCustomers } from '../data/demoCustomers';
import { mockAgentService } from '../services/mockAgentService';
import { Bot, Play, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentConsolePage() {
  const { state, dispatch } = useDemo();
  const [running, setRunning] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);

  const customer = demoCustomers.find(c => c.customerId === state.selectedCustomerId);
  
  const agents = [
    { id: 'intent', name: 'Intent Verification Agent', icon: Bot, tool: 'Intent Scoring Engine' },
    { id: 'income', name: 'Income Reconstruction Agent', icon: Bot, tool: 'Income Aggregator' },
    { id: 'capacity', name: 'Repayment Capacity Agent', icon: Bot, tool: 'Cash Flow Simulator' },
    { id: 'eligibility', name: 'Product Eligibility Agent', icon: Bot, tool: 'Rule Engine' },
    { id: 'nba', name: 'Next-Best-Action Agent', icon: Bot, tool: 'Uplift Simulator' }
  ];

  const handleRunAll = async () => {
    if (!customer) return;
    if (state.events.length === 0 || !state.engineeredFeatures) {
      toast.error('Please run the Customer Simulator and connect Data Sources first.');
      return;
    }

    setRunning(true);
    
    try {
      const intentResult = await mockAgentService.runIntentAgent(state.events, customer.expectedDecision);
      dispatch({ type: 'SET_AGENT_RUN', payload: { agentId: 'intent', data: intentResult } });

      const incomeResult = await mockAgentService.runIncomeAgent(state.transactions, customer.expectedDecision);
      dispatch({ type: 'SET_AGENT_RUN', payload: { agentId: 'income', data: incomeResult } });

      const capacityResult = await mockAgentService.runCapacityAgent(state.engineeredFeatures, customer.expectedDecision);
      dispatch({ type: 'SET_AGENT_RUN', payload: { agentId: 'capacity', data: capacityResult } });

      const eligResult = await mockAgentService.runEligibilityAgent(capacityResult, customer.expectedDecision);
      dispatch({ type: 'SET_AGENT_RUN', payload: { agentId: 'eligibility', data: eligResult } });

      const nbaResult = await mockAgentService.runNextBestActionAgent(intentResult, capacityResult, customer.expectedDecision);
      dispatch({ type: 'SET_AGENT_RUN', payload: { agentId: 'nba', data: nbaResult } });

      // Create final decision object
      dispatch({ type: 'SET_FINAL_DECISION', payload: {
        ...customer.expectedDecision,
        intentScore: intentResult.intentScore,
        sustainableIncome: incomeResult.sustainableIncome,
        stressSafeEmi: capacityResult.stressSafeEmi
      }});

      toast.success('All agents executed successfully');
    } catch (err) {
      toast.error('Workflow failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Agent Console</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Governed execution of specialised agents.</p>
        </div>
        <div id="tour-run-agents">
          <button onClick={handleRunAll} disabled={running} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            backgroundColor: running ? 'var(--surface-muted)' : 'var(--idbi-teal)',
            color: running ? 'var(--text-muted)' : '#fff', borderRadius: '8px', fontWeight: 600
          }}>
            {running ? <Clock size={16} className="spin" /> : <Play size={16} />} 
            {running ? 'Agents Running...' : 'Run All Agents'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {agents.map(agent => {
          const result = state.agentRuns[agent.id];
          const isExpanded = expandedAgent === agent.id;
          
          return (
            <div key={agent.id} style={{
              backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div 
                id={agent.id === 'intent' ? 'tour-agent-trace' : undefined}
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '16px 20px', cursor: 'pointer', backgroundColor: isExpanded ? 'var(--surface-muted)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    backgroundColor: result ? 'var(--idbi-teal-soft)' : 'var(--surface-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: result ? 'var(--idbi-teal)' : 'var(--text-muted)'
                  }}>
                    <agent.icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{agent.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tool: {agent.tool}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {result ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {result.latencyMs}ms
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> Completed
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Waiting...</span>
                  )}
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded Trace */}
              {isExpanded && result && (
                <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Model Version</strong>
                      <div style={{ fontSize: '14px', marginTop: '4px' }}>{result.version}</div>
                    </div>
                    <div>
                      <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confidence</strong>
                      <div style={{ fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${result.confidence || 90}%`, backgroundColor: 'var(--idbi-teal)', borderRadius: '3px' }} />
                        </div>
                        {result.confidence || 90}%
                      </div>
                    </div>
                    {result.reasonCodes && (
                      <div>
                        <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reason Codes</strong>
                        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {result.reasonCodes.map((rc, i) => <li key={i}>{rc}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Structured Output JSON</strong>
                    <pre style={{ 
                      marginTop: '8px', padding: '16px', backgroundColor: '#282c34', 
                      color: '#abb2bf', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', margin: 0 
                    }}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
