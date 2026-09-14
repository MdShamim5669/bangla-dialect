import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RegionSelector from './components/RegionSelector';
import TranslationBox from './components/TranslationBox';
import InsightsModal from './components/InsightsModal';
import SettingsModal from './components/SettingsModal';
import { REGIONS } from './data/regions';
import { API_BASE_URL } from './config/api';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]); // Default Chittagong
  const [inputText, setInputText] = useState("ক্যান আছু?");
  const [translatedText, setTranslatedText] = useState("কেমন আছো?");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [mode, setMode] = useState("simulation"); // 'simulation' | 'huggingface'
  
  // Backend & Settings state
  const [backendOnline, setBackendOnline] = useState(false);
  const [hfRepoId, setHfRepoId] = useState(() => localStorage.getItem('hf_repo_id') || "");
  const [hfApiToken, setHfApiToken] = useState(() => localStorage.getItem('hf_api_token') || "");
  
  // Modals
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Live Render backend API base URL
  const API_BASE = API_BASE_URL;

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
          const data = await res.json();
          setBackendOnline(true);
          if (!hfRepoId && data.default_repo_id) {
            setHfRepoId(data.default_repo_id);
          }
          if (data.token_configured || hfApiToken) {
            setMode("huggingface");
          } else {
            setMode("simulation");
          }
        }
      } catch (err) {
        setBackendOnline(false);
        console.warn("Backend not yet connected:", err);
      }
    };
    checkHealth();
  }, [hfApiToken, API_BASE]);

  // Handle translation execution
  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setLoadingMessage("অনুবাদ করা হচ্ছে...");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion.id,
          sentence: inputText.trim(),
          hf_repo_id: hfRepoId || undefined,
          hf_api_token: hfApiToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "অনুবাদে সমস্যা হয়েছে।");
      }

      if (data.loading) {
        // Model is cold starting on Hugging Face
        setLoadingMessage(data.message || `মডেল লোড হচ্ছে (অনুমানিক ${data.estimated_time || 20}s)...`);
        // Poll once after a few seconds or alert user
        setTranslatedText(`[Model Loading: ${data.message}]`);
      } else if (data.success) {
        setTranslatedText(data.translation);
        setMode(data.mode);
      } else {
        throw new Error(data.error || "অনুবাদ সম্পন্ন করা যায়নি।");
      }
    } catch (err) {
      setErrorMessage(err.message || "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন।");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = ({ hfRepoId: newRepo, hfApiToken: newToken }) => {
    setHfRepoId(newRepo);
    setHfApiToken(newToken);
    localStorage.setItem('hf_repo_id', newRepo);
    localStorage.setItem('hf_api_token', newToken);
    if (newToken) {
      setMode("huggingface");
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation & App Branding */}
      <Header
        onOpenInsights={() => setIsInsightsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSimulationMode={mode === 'simulation'}
        backendOnline={backendOnline}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Optional Error Alert */}
      {errorMessage && (
        <div className="banner-alert warning">
          <span>{errorMessage}</span>
          <button 
            className="icon-btn" 
            style={{ marginLeft: 'auto', padding: 2 }} 
            onClick={() => setErrorMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Dialect Region Selection (7 regions) */}
      <RegionSelector
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          // Set first example as starter if input is empty
          if (!inputText.trim() && reg.examples?.length > 0) {
            setInputText(reg.examples[0]);
          }
        }}
      />

      {/* Main Translation Interface */}
      <TranslationBox
        selectedRegion={selectedRegion}
        inputText={inputText}
        setInputText={setInputText}
        translatedText={translatedText}
        onTranslate={handleTranslate}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        mode={mode}
      />

      {/* Footer Info */}
      <footer style={{ marginTop: 'auto', paddingTop: 20, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>
          Research Project: <em>Preserving Dialects, Enhancing Communication: A Model For Translating Regional Bangladeshi Languages into Standard Bengali</em>
        </p>
        <p style={{ marginTop: 4 }}>
          Fine-tuned BanglaT5 Architecture • SacreBLEU: 50.87 • chrF: 75.34 • BERTScore: 0.9392
        </p>
      </footer>

      {/* Modals */}
      <InsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hfRepoId={hfRepoId}
        setHfRepoId={setHfRepoId}
        hfApiToken={hfApiToken}
        setHfApiToken={setHfApiToken}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
