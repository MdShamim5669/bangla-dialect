import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RegionSelector from './components/RegionSelector';
import TranslationBox from './components/TranslationBox';
import InsightsModal from './components/InsightsModal';
import SettingsModal from './components/SettingsModal';
import { REGIONS } from './data/regions';
import { API_BASE_URL } from './config/api';

export default function App() {
  const [regions, setRegions] = useState(REGIONS);
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

  // Check backend health & fetch dynamic regions from real dataset
  useEffect(() => {
    const initBackend = async () => {
      try {
        const [healthRes, regionsRes] = await Promise.all([
          fetch(`${API_BASE}/api/health`),
          fetch(`${API_BASE}/api/regions`),
        ]);

        if (healthRes.ok) {
          const data = await healthRes.json();
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

        if (regionsRes.ok) {
          const regionsData = await regionsRes.json();
          if (Array.isArray(regionsData) && regionsData.length > 0) {
            setRegions(regionsData);
            setSelectedRegion(prev => regionsData.find(r => r.id === prev?.id) || regionsData[0]);
          }
        }
      } catch (err) {
        setBackendOnline(false);
        console.warn("Backend connection notice:", err);
      }
    };
    initBackend();
  }, [hfApiToken, API_BASE]);

  // Handle translation execution
  const handleTranslate = async (overrideText, overrideRegion) => {
    const textToUse = (typeof overrideText === 'string' ? overrideText : inputText).trim();
    const regionToUse = overrideRegion || selectedRegion;

    if (!textToUse) return;

    setIsLoading(true);
    setLoadingMessage("অনুবাদ করা হচ্ছে...");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: regionToUse.id,
          sentence: textToUse,
          hf_repo_id: hfRepoId || undefined,
          hf_api_token: hfApiToken || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTranslatedText(data.translation);
        if (data.mode) setMode(data.mode);
      } else {
        setErrorMessage(data.error || data.message || "অনুবাদে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setErrorMessage("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Fetch fresh random samples from the backend dataset for the current or specified region
  const handleShuffleSamples = async (targetRegion) => {
    const reg = targetRegion || selectedRegion;
    if (!reg) return;

    try {
      const res = await fetch(`${API_BASE}/api/random-sample?region=${reg.id}&count=4`);
      if (res.ok) {
        const data = await res.json();
        if (data.samples && data.samples.length > 0) {
          // Update selectedRegion with fresh examples from dataset
          setSelectedRegion(prev => ({
            ...prev,
            examples: data.samples,
          }));
          // Put the primary random dialect sentence into the display and translate it
          const randomSentence = data.primary_dialect || data.samples[0];
          setInputText(randomSentence);
          handleTranslate(randomSentence, reg);
        }
      }
    } catch (err) {
      console.warn("Could not fetch random samples from backend:", err);
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

      {/* Dialect Region Selection (7 regions dynamically fetched from dataset) */}
      <RegionSelector
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          handleShuffleSamples(reg);
        }}
      />

      {/* Main Translation Interface */}
      <TranslationBox
        selectedRegion={selectedRegion}
        inputText={inputText}
        setInputText={setInputText}
        translatedText={translatedText}
        onTranslate={handleTranslate}
        onShuffleSamples={() => handleShuffleSamples(selectedRegion)}
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
