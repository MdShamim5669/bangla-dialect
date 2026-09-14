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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>
              <span className="gradient-text">Bangla Dialect</span> Translator
            </h1>
            <span className="version-badge">
              BanglaT5 Final
            </span>
          </div>
          <p>৭টি আঞ্চলিক উপভাষা থেকে প্রমিত বাংলা রূপান্তরক • Research Model Deliverable</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Backend / Model Status Badge */}
        <div 
          className={`status-pill ${isSimulationMode ? 'warning' : 'success'}`}
          title={isSimulationMode ? "Simulation fallback active (Dataset Verified)" : "Connected to Hugging Face Live Model"}
        >
          <span className={`status-dot ${isSimulationMode ? 'warning' : 'success'}`} />
          <span>{backendOnline ? (isSimulationMode ? "Demo Mode" : "HF Live") : "Connecting..."}</span>
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
