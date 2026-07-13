import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MousePointerClick, 
  Database, 
  GitCompare, 
  Bot, 
  Lightbulb, 
  UserCircle, 
  FlaskConical, 
  RefreshCcw, 
  Network
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/customer-simulator', label: 'Customer Simulator', icon: MousePointerClick },
  { path: '/data-capture', label: 'Data Capture', icon: Database },
  { path: '/transaction-intelligence', label: 'Transaction Intelligence', icon: GitCompare },
  { path: '/agent-console', label: 'Agent Console', icon: Bot },
  { path: '/lead-decision', label: 'Lead Decision', icon: Lightbulb },
  { path: '/rm-workbench', label: 'RM Workbench', icon: UserCircle },
  { path: '/ai-lab', label: 'AI Lab', icon: FlaskConical },
  { path: '/feedback-loop', label: 'Feedback Loop', icon: RefreshCcw },
  { path: '/architecture', label: 'Architecture', icon: Network },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      overflowY: 'auto'
    }}>
      <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--idbi-teal-dark)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--idbi-teal-soft)' : 'transparent',
              textDecoration: 'none'
            })}
          >
            <item.icon size={18} style={{ opacity: 0.8 }} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p style={{ margin: 0 }}><strong>IDBI Innovate 2026</strong></p>
        <p style={{ margin: '4px 0 0 0' }}>Prototype uses synthetic data. Not connected to real banking systems.</p>
      </div>
    </aside>
  );
}
