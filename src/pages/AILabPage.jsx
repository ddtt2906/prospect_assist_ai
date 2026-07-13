import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { callGroq, constructContext, demoAIResponse } from '../services/explanationEngine';
import { Bot, Key, Send, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AILabPage() {
  const { state, dispatch } = useDemo();
  
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('lakshya_groq_key') || import.meta.env.VITE_GROQ_API_KEY || '');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSaveKey = () => {
    sessionStorage.setItem('lakshya_groq_key', apiKey);
    dispatch({ type: 'SET_AI_MODE', payload: 'Live Groq' });
    toast.success('Live Groq mode activated for this session.');
  };

  const handleClearKey = () => {
    sessionStorage.removeItem('lakshya_groq_key');
    setApiKey('');
    dispatch({ type: 'SET_AI_MODE', payload: 'Demo AI' });
    toast.success('Key cleared. Returned to Demo AI mode.');
  };

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const newHistory = [...history, { role: 'user', content: query }];
    setHistory(newHistory);
    setQuery('');
    setLoading(true);

    try {
      if (state.aiMode === 'Demo AI') {
        // Use local deterministic logic
        await new Promise(r => setTimeout(r, 600)); // fake delay
        const ans = demoAIResponse(query, state);
        setHistory([...newHistory, { role: 'assistant', content: ans }]);
      } else {
        // Use Live Groq
        const key = sessionStorage.getItem('lakshya_groq_key');
        if (!key) throw new Error("No API key found in session storage.");

        // Construct context only if needed, append it to a system message for Groq
        const ctxMsg = {
          role: 'system',
          content: `Current application state: ${constructContext(state)}`
        };

        const ans = await callGroq(key, state.groqModel, [ctxMsg, ...newHistory]);
        setHistory([...newHistory, { role: 'assistant', content: ans }]);
      }
    } catch (err) {
      toast.error(err.message || 'Error communicating with AI');
      setHistory([...newHistory, { role: 'assistant', content: `[Error: ${err.message}] Falling back to Demo AI...` }]);
      dispatch({ type: 'SET_AI_MODE', payload: 'Demo AI' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', height: '100%' }}>
      
      {/* Settings Panel */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} style={{ color: 'var(--idbi-teal)' }}/> AI Settings
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>AI Mode</label>
            <div style={{ display: 'flex', backgroundColor: 'var(--surface-muted)', borderRadius: '6px', padding: '4px' }}>
              <button 
                onClick={() => dispatch({ type: 'SET_AI_MODE', payload: 'Demo AI' })}
                style={{
                  flex: 1, padding: '6px 12px', borderRadius: '4px',
                  backgroundColor: state.aiMode === 'Demo AI' ? 'var(--surface)' : 'transparent',
                  fontWeight: state.aiMode === 'Demo AI' ? 600 : 400,
                  boxShadow: state.aiMode === 'Demo AI' ? 'var(--shadow-sm)' : 'none'
                }}
              >Demo AI</button>
              <button 
                onClick={() => dispatch({ type: 'SET_AI_MODE', payload: 'Live Groq' })}
                style={{
                  flex: 1, padding: '6px 12px', borderRadius: '4px',
                  backgroundColor: state.aiMode === 'Live Groq' ? 'var(--idbi-orange)' : 'transparent',
                  color: state.aiMode === 'Live Groq' ? '#fff' : 'inherit',
                  fontWeight: state.aiMode === 'Live Groq' ? 600 : 400,
                  boxShadow: state.aiMode === 'Live Groq' ? 'var(--shadow-sm)' : 'none'
                }}
              >Live Groq</button>
            </div>
          </div>

          {state.aiMode === 'Live Groq' && (
            <>
              <div style={{ padding: '12px', backgroundColor: 'var(--warning)', color: '#fff', borderRadius: '6px', fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Browser-based demonstration mode. The key you enter is used directly from this browser.
                  Use only a disposable test key with suitable limits.
                  LAKSHYA does not store the key outside this browser session.
                </span>
              </div>
              
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Groq API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Model</label>
                <select 
                  value={state.groqModel} 
                  onChange={e => dispatch({ type: 'SET_GROQ_MODEL', payload: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSaveKey} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--idbi-teal)', color: '#fff', borderRadius: '6px', fontWeight: 600 }}>Save Key</button>
                <button onClick={handleClearKey} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px' }}>Clear Key</button>
              </div>
            </>
          )}

          {state.aiMode === 'Demo AI' && (
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)' }}>
              Demo AI runs locally without any API calls. It uses a deterministic fallback to answer a few specific queries for demonstration.
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div id="tour-ai-lab" style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bot size={20} style={{ color: 'var(--idbi-teal)' }}/>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px' }}>Explanation & RM Copilot</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Powered by {state.aiMode === 'Live Groq' ? state.groqModel : 'Local Demo Rules'}</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              Ask me why a decision was made, to explain an agent's trace, or to translate the recommendation to Hindi.
            </div>
          ) : (
            history.map((msg, i) => (
              <div key={i} style={{ 
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <div style={{ 
                  maxWidth: '70%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.5,
                  backgroundColor: msg.role === 'user' ? 'var(--idbi-teal)' : 'var(--surface-muted)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                <Loader2 size={16} className="spin" style={{ color: 'var(--idbi-teal)' }}/>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask about the current lead..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              style={{ 
                padding: '0 20px', backgroundColor: 'var(--idbi-teal)', color: '#fff', 
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
