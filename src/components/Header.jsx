import React from 'react';
import { Languages, BookOpen, Settings, Sun, Moon } from 'lucide-react';

export default function Header({ 
  onOpenInsights, 
  onOpenSettings, 
  isSimulationMode, 
  backendOnline,
  theme,
  onToggleTheme 
}) {
  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Languages size={24} />
        </div>
        <div className="brand-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1>
              <span className="gradient-text">Bangla Dialect</span> Translator
            </h1>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', fontWeight: 600 }}>
              BanglaT5 Final
            </span>
          </div>
          <p>৭টি আঞ্চলিক উপভাষা থেকে প্রমিত বাংলা রূপান্তরক • Research Model Deliverable</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Backend / Model Status Badge */}
        <div 
          className={`banner-alert ${isSimulationMode ? 'warning' : 'success'}`} 
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title={isSimulationMode ? "Simulation fallback active (No HF token set)" : "Connected to Hugging Face Live Model"}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isSimulationMode ? '#f59e0b' : '#10b981', display: 'inline-block' }} />
          {backendOnline ? (isSimulationMode ? "Demo Mode" : "HF Live") : "Connecting..."}
        </div>

        {/* Research Insights Button */}
        <button 
          className="action-btn primary" 
          onClick={onOpenInsights}
          title="View Thesis Benchmarks & Dataset Findings"
        >
          <BookOpen size={16} />
          <span>Research Insights</span>
        </button>

        {/* Settings Button */}
        <button 
          className="action-btn" 
          onClick={onOpenSettings}
          title="Configure Hugging Face Model & Token"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        {/* Theme Toggle Button (Dark / Light) */}
        <button 
          className="theme-toggle-btn" 
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="theme-icon sun" />
          ) : (
            <Moon size={18} className="theme-icon moon" />
          )}
        </button>
      </div>
    </header>
  );
}
