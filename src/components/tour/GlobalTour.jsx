/**
 * GlobalTour — LAKSHYA
 * Custom tour, zero library dependencies.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { X, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';

const STEPS = [
  { target: '#tour-welcome',                  placement: 'bottom', title: '👋 Welcome to LAKSHYA',             content: "This walkthrough shows how a customer's digital behaviour becomes an explainable and actionable retail-lending lead.", route: '/' },
  { target: '#tour-persona-picker',           placement: 'top',    title: '👤 Choose a Customer Persona',      content: 'Start with Riya, a freelancer seeking an auto loan. Her income is irregular, but her borrowing intent is genuine.',   route: '/customer-simulator' },
  { target: '#tour-run-behaviour',            placement: 'bottom', title: '▶️ Simulate Customer Journey',       content: "Play Riya's journey to generate actual frontend events: calculator use, document viewing, and application abandonment.", route: '/customer-simulator' },
  { target: '#tour-event-stream',             placement: 'left',   title: '📡 Live Event Stream',               content: 'Every digital action is converted into a structured event. These distinguish serious intent from casual browsing.',     route: '/customer-simulator' },
  { target: '#tour-connectors',               placement: 'bottom', title: '🔗 Data Connectors',                 content: 'LAKSHYA combines clickstream events with synthetic bank, Account Aggregator, and credit-profile data.',               route: '/data-capture' },
  { target: '#tour-consent',                  placement: 'bottom', title: '🔐 Consent Management',              content: 'The customer controls which financial information is shared. Only repayment-capacity data is requested.',               route: '/data-capture' },
  { target: '#tour-transaction-classification', placement: 'bottom', title: '📊 Transaction Intelligence',      content: 'Genuine earnings are separated from refunds, internal transfers, and loan proceeds — preventing income overstatement.', route: '/transaction-intelligence' },
  { target: '#tour-feature-store',            placement: 'top',    title: '🗄️ Feature Store',                   content: 'Models receive structured, inspectable features rather than raw statements or LLM opinions.',                          route: '/transaction-intelligence' },
  { target: '#tour-run-agents',               placement: 'left',   title: '🤖 Agent Workflow',                  content: 'Start the governed agent workflow. Each agent has a specific role, controlled inputs, and a structured output contract.', route: '/agent-console' },
  { target: '#tour-agent-trace',              placement: 'bottom', title: '🔍 Agent Trace',                     content: 'Inspect each agent\'s input, tool, output JSON, confidence, latency and reason codes.',                               route: '/agent-console' },
  { target: '#tour-decision',                 placement: 'bottom', title: '⚖️ Lead Decision',                   content: 'LAKSHYA separates borrowing intent, safe affordability and conversion uplift before creating a lead.',                  route: '/lead-decision' },
  { target: '#tour-rm-brief',                 placement: 'right',  title: '💼 RM Workbench',                    content: 'The relationship manager receives a conversation-ready lead dossier rather than another unexplained score.',           route: '/rm-workbench' },
  { target: '#tour-ai-lab',                   placement: 'left',   title: '🧪 AI Lab',                          content: 'Use Demo AI immediately, or connect a personal Groq key for live multilingual explanations.',                         route: '/ai-lab' },
  { target: '#tour-feedback',                 placement: 'bottom', title: '🔄 Feedback Loop',                   content: 'Conversion and underwriting outcomes are captured as future learning labels.',                                         route: '/feedback-loop' },
  { target: '#tour-architecture',             placement: 'right',  title: '🏗️ Architecture',                    content: 'This frontend simulates the complete pipeline. Production replaces local services with secure bank APIs and event streaming.', route: '/architecture' },
];

function getTooltipPosition(targetEl, placement, tooltipEl) {
  if (!targetEl) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  const rect = targetEl.getBoundingClientRect();
  const tw = tooltipEl?.offsetWidth || 340;
  const th = tooltipEl?.offsetHeight || 180;
  const gap = 16;
  let top, left;
  switch (placement) {
    case 'bottom': top = rect.bottom + gap; left = rect.left + rect.width / 2 - tw / 2; break;
    case 'top':    top = rect.top - th - gap; left = rect.left + rect.width / 2 - tw / 2; break;
    case 'left':   top = rect.top + rect.height / 2 - th / 2; left = rect.left - tw - gap; break;
    case 'right':  top = rect.top + rect.height / 2 - th / 2; left = rect.right + gap; break;
    default:       return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
  top  = Math.max(8, Math.min(top,  window.innerHeight - th - 8));
  left = Math.max(8, Math.min(left, window.innerWidth  - tw - 8));
  return { top: `${top}px`, left: `${left}px` };
}

export default function GlobalTour() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({});
  const tooltipRef = useRef(null);
  const pendingStep = useRef(null);

  const step = STEPS[stepIndex];
  const isRunning = state.tourState?.run;

  useEffect(() => {
    if (pendingStep.current !== null) {
      const idx = pendingStep.current;
      pendingStep.current = null;
      setTimeout(() => setStepIndex(idx), 500);
    }
    const flag = sessionStorage.getItem('lakshya-start-tour');
    if (flag === 'true') {
      sessionStorage.removeItem('lakshya-start-tour');
      setTimeout(() => {
        dispatch({ type: 'UPDATE_TOUR', payload: { run: true, stepIndex: 0 } });
        setStepIndex(0);
      }, 400);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isRunning || !step) return;
    const update = () => {
      const el = step.target ? document.querySelector(step.target) : null;
      setTargetRect(el ? el.getBoundingClientRect() : null);
      setTooltipPos(getTooltipPosition(el, step.placement, tooltipRef.current));
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [isRunning, stepIndex, step]);

  useEffect(() => {
    if (isRunning) setStepIndex(state.tourState?.stepIndex ?? 0);
  }, [state.tourState?.run, state.tourState?.stepIndex]);

  const goTo = (idx) => {
    if (idx < 0 || idx >= STEPS.length) return endTour();
    const next = STEPS[idx];
    const nextRoute = next.route?.split('?')[0];
    dispatch({ type: 'UPDATE_TOUR', payload: { run: true, stepIndex: idx } });
    if (nextRoute && nextRoute !== location.pathname) {
      pendingStep.current = idx;
      navigate(nextRoute);
    } else {
      setStepIndex(idx);
    }
  };

  const endTour = () => {
    dispatch({ type: 'UPDATE_TOUR', payload: { run: false, stepIndex: 0 } });
    localStorage.setItem('lakshya-tour-completed', 'true');
  };

  if (!isRunning || !step) return null;

  const isCenter = !step.target || step.placement === 'center';
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.55)', pointerEvents: isCenter ? 'auto' : 'none' }} />
      {targetRect && !isCenter && (
        <div style={{ position: 'fixed', top: targetRect.top - 6, left: targetRect.left - 6, width: targetRect.width + 12, height: targetRect.height + 12, zIndex: 9999, borderRadius: 8, boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)', pointerEvents: 'none', border: '2px solid #1a6eb0' }} />
      )}
      <div ref={tooltipRef} style={{ position: 'fixed', zIndex: 10000, width: 340, background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: '24px', fontFamily: 'inherit', ...tooltipPos }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', lineHeight: 1.4, flex: 1 }}>{step.title}</div>
          <button onClick={endTour} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#666', marginLeft: 8 }}><X size={16} /></button>
        </div>
        <p style={{ fontSize: 13.5, color: '#3a4a5c', lineHeight: 1.6, margin: '0 0 20px 0' }}>{step.content}</p>
        <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === stepIndex ? 18 : 6, height: 6, borderRadius: 3, background: i === stepIndex ? '#1a6eb0' : i < stepIndex ? '#6b8fa8' : '#dce8f0', transition: 'all 0.3s ease' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={endTour} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
            <SkipForward size={13} /> Skip Tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button onClick={() => goTo(stepIndex - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #ccd6e0', background: '#fff', color: '#0f1923', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button onClick={() => isLast ? endTour() : goTo(stepIndex + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#1a6eb0', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              {isLast ? 'Finish ✓' : <><span>Next</span><ArrowRight size={14} /></>}
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#888', marginTop: 12 }}>Step {stepIndex + 1} of {STEPS.length}</div>
      </div>
    </>
  );
}
