import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { demoReducer, initialState } from './demoReducer';
import { loadState, saveState } from '../utils/sessionStorage';

const DemoContext = createContext();

const STATE_KEY = 'lakshya_demo_state';

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(
    demoReducer, 
    initialState, 
    (initial) => loadState(STATE_KEY, initial)
  );

  useEffect(() => {
    // Only persist safe state. Groq key should not be here, it's handled separately in sessionStorage by the component.
    saveState(STATE_KEY, state);
  }, [state]);

  const trackEvent = (eventType, properties) => {
    const event = {
      eventId: `EVT-${Math.floor(Math.random() * 10000)}`,
      customerId: state.selectedCustomerId,
      sessionId: `SESSION-${state.selectedCustomerId}`,
      eventType,
      timestamp: new Date().toISOString(),
      channel: "WEB",
      product: properties.product || "AUTO_LOAN",
      pagePath: window.location.pathname,
      properties
    };
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  return (
    <DemoContext.Provider value={{ state, dispatch, trackEvent }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
