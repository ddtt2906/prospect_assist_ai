import React, { useEffect, useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';

const steps = [
  { target: '#tour-welcome', content: 'Welcome to LAKSHYA. This walkthrough shows how a customer’s digital behaviour becomes an explainable and actionable retail-lending lead.', placement: 'bottom', disableBeacon: true },
  { target: '#tour-persona-picker', content: 'Start with Riya, a freelancer seeking an auto loan. Her income is irregular, but her borrowing intent is genuine.', placement: 'top' },
  { target: '#tour-run-behaviour', content: 'Play Riya’s journey to generate actual frontend events such as calculator use, document-page viewing and application abandonment.', placement: 'bottom', route: '/customer-simulator' },
  { target: '#tour-event-stream', content: 'Every digital action is converted into a structured event. These events are used to distinguish serious intent from casual browsing.', placement: 'left' },
  { target: '#tour-connectors', content: 'LAKSHYA combines clickstream events with synthetic bank, Account Aggregator and credit-profile data.', placement: 'bottom', route: '/data-capture' },
  { target: '#tour-consent', content: 'The customer controls which financial information is shared. Only the data required for repayment-capacity assessment is requested.', placement: 'center' }, // Modal requires manual trigger in a real app, but we will just point to the button or center for now
  { target: '#tour-transaction-classification', content: 'Genuine earnings are separated from refunds, internal transfers and loan proceeds. This prevents the system from overstating income.', placement: 'bottom', route: '/transaction-intelligence' },
  { target: '#tour-feature-store', content: 'The models receive structured, inspectable features rather than an unverified raw statement or an LLM opinion.', placement: 'top' },
  { target: '#tour-run-agents', content: 'Start the governed agent workflow. Each agent has a specific role, controlled inputs, a tool and a structured output contract.', placement: 'left', route: '/agent-console' },
  { target: '#tour-agent-trace', content: 'Inspect each agent’s input, tool, output JSON, confidence, latency and reason codes.', placement: 'bottom' },
  { target: '#tour-decision', content: 'LAKSHYA separates borrowing intent, safe affordability and conversion uplift before creating a lead.', placement: 'bottom', route: '/lead-decision' },
  { target: '#tour-rm-brief', content: 'The relationship manager receives a conversation-ready lead dossier rather than another unexplained score.', placement: 'right', route: '/rm-workbench' },
  { target: '#tour-ai-lab', content: 'Use Demo AI immediately, or optionally connect a personal Groq test key for live multilingual explanations.', placement: 'left', route: '/ai-lab' },
  { target: '#tour-feedback', content: 'Conversion and underwriting outcomes are captured as future learning labels.', placement: 'bottom', route: '/feedback-loop' },
  { target: '#tour-architecture', content: 'This frontend simulates the complete pipeline. The production architecture would replace local services with secure bank APIs, event streaming, feature stores and governed model services.', placement: 'right', route: '/architecture' }
];

export default function GlobalTour() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Initial load auto-start if not done in session
    if (!sessionStorage.getItem('lakshya_tour_done') && !state.tourState.run) {
      const timer = setTimeout(() => {
        dispatch({ type: 'UPDATE_TOUR', payload: { run: true, stepIndex: 0 } });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [dispatch, state.tourState.run]);

  useEffect(() => {
    setRun(state.tourState.run);
  }, [state.tourState.run]);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      dispatch({ type: 'UPDATE_TOUR', payload: { run: false, stepIndex: 0 } });
      sessionStorage.setItem('lakshya_tour_done', 'true');
      return;
    }

    if (type === 'step:after' || type === 'target:notFound') {
      const nextStepIndex = index + (action === 'prev' ? -1 : 1);
      
      if (nextStepIndex < steps.length && nextStepIndex >= 0) {
        const nextStep = steps[nextStepIndex];
        
        if (nextStep) {
          if (nextStep.route && nextStep.route !== location.pathname) {
            navigate(nextStep.route);
          }
          dispatch({ type: 'UPDATE_TOUR', payload: { stepIndex: nextStepIndex } });
        }
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={state.tourState.stepIndex}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'var(--idbi-orange)',
          textColor: 'var(--text-primary)',
          backgroundColor: 'var(--surface)',
          overlayColor: 'rgba(23, 52, 46, 0.4)',
        },
        buttonNext: { borderRadius: '6px', fontWeight: 600 },
        buttonBack: { color: 'var(--text-secondary)' },
        buttonSkip: { color: 'var(--text-secondary)' }
      }}
    />
  );
}
