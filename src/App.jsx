import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DemoProvider } from './context/DemoContext';
import Layout from './components/layout/Layout';
import GlobalTour from './components/tour/GlobalTour';

// Pages
import LandingPage from './pages/LandingPage';
import CustomerSimulatorPage from './pages/CustomerSimulatorPage';
import DataCapturePage from './pages/DataCapturePage';
import TransactionIntelligencePage from './pages/TransactionIntelligencePage';
import AgentConsolePage from './pages/AgentConsolePage';
import LeadDecisionPage from './pages/LeadDecisionPage';
import RMWorkbenchPage from './pages/RMWorkbenchPage';
import AILabPage from './pages/AILabPage';
import FeedbackLoopPage from './pages/FeedbackLoopPage';
import ArchitecturePage from './pages/ArchitecturePage';

export default function App() {
  return (
    <DemoProvider>
      <Toaster position="top-right" />
      <GlobalTour />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="customer-simulator" element={<CustomerSimulatorPage />} />
          <Route path="data-capture" element={<DataCapturePage />} />
          <Route path="transaction-intelligence" element={<TransactionIntelligencePage />} />
          <Route path="agent-console" element={<AgentConsolePage />} />
          <Route path="lead-decision" element={<LeadDecisionPage />} />
          <Route path="rm-workbench" element={<RMWorkbenchPage />} />
          <Route path="ai-lab" element={<AILabPage />} />
          <Route path="feedback-loop" element={<FeedbackLoopPage />} />
          <Route path="architecture" element={<ArchitecturePage />} />
        </Route>
      </Routes>
    </DemoProvider>
  );
}
