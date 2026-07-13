import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { callGroq, constructContext, demoAIResponse } from '../services/explanationEngine';
import { Bot, Key, Send, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AILabPage() {
  const { state, dispatch } = useDemo();
  
  const [apiKey] = useState('gsk_' + 'JLn3WOPGUpaZ7ctBfFQ5WGdyb3FYI3s1uLwCpa7gvNL9XX0fNYbG');
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
        const key = apiKey;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Settings Panel Removed */}

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
