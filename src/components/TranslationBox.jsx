import React, { useState } from 'react';
import { Copy, Check, Volume2, RotateCcw, ArrowRight, Sparkles, Loader2, Shuffle } from 'lucide-react';

export default function TranslationBox({
  selectedRegion,
  inputText,
  setInputText,
  translatedText,
  onTranslate,
  onShuffleSamples,
  isLoading,
  loadingMessage,
  mode,
}) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleSpeak = () => {
    if (!translatedText || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    setInputText("");
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Workspace Grid */}
      <div className="workspace-grid">
        {/* Input Box */}
        <div className="box-card">
          <div className="box-header">
            <div className="box-title">
              <span>{selectedRegion.nameEn} Dialect ({selectedRegion.nameBn})</span>
            </div>
            <div className="box-tools">
              {onShuffleSamples && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={onShuffleSamples}
                  title="র‌্যান্ডম নমুনা বাক্য লোড করুন (Random Sample from Dataset)"
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
                >
                  <Shuffle size={13} />
                  <span>র‌্যান্ডম বাক্য</span>
                </button>
              )}
              {inputText && (
                <button className="icon-btn" onClick={handleClear} title="Clear text">
                  <RotateCcw size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="textarea-wrapper">
            <textarea
              className="custom-textarea"
              placeholder={`এখানে ${selectedRegion.nameBn} অঞ্চলের ভাষায় বাক্য লিখুন...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onTranslate();
                }
              }}
              rows={4}
            />
          </div>

          <div className="box-footer">
            <span>{wordCount} শব্দ • {charCount} অক্ষর</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Enter চাপলে অনুবাদ হবে</span>
          </div>
        </div>

        {/* Output Box */}
        <div className="box-card">
          <div className="box-header">
            <div className="box-title">
              <span className="emerald-gradient-text" style={{ fontWeight: 700 }}>
                Standard Bengali (প্রমিত বাংলা)
              </span>
            </div>
            <div className="box-tools">
              {translatedText && (
                <>
                  <button 
                    className="icon-btn" 
                    onClick={handleSpeak} 
                    title="উচ্চারণ শুনুন (Listen)"
                    style={{ color: isPlayingAudio ? '#10b981' : undefined }}
                  >
                    <Volume2 size={16} />
                  </button>
                  <button className="icon-btn" onClick={handleCopy} title="Copy to clipboard">
                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="textarea-wrapper" style={{ alignItems: 'flex-start' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: 12 }}>
                <Loader2 size={32} className="spin-loader" color="#6366f1" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {loadingMessage || "মডেল রূপান্তর করছে..."}
                </span>
              </div>
            ) : translatedText ? (
              <div className="output-display">
                {translatedText}
              </div>
            ) : (
              <div className="output-placeholder">
                অনূদিত প্রমিত বাংলা বাক্য এখানে প্রদর্শিত হবে...
              </div>
            )}
          </div>

          <div className="box-footer">
            <span>
              {mode === 'simulation' && (
                <span style={{ color: '#f59e0b', fontSize: '0.78rem' }}>Demo Simulation Mode</span>
              )}
              {mode === 'huggingface' && (
                <span style={{ color: '#10b981', fontSize: '0.78rem' }}>Hugging Face Model Output</span>
              )}
            </span>
            {copied && <span style={{ color: '#10b981', fontWeight: 600 }}>কপি করা হয়েছে!</span>}
          </div>
        </div>
      </div>

      {/* Quick Example Sentences Chips */}
      {selectedRegion.examples && selectedRegion.examples.length > 0 && (
        <div className="examples-section">
          <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>দ্রুত পরীক্ষার জন্য নমুনা বাক্য (Click to try):</span>
            {onShuffleSamples && (
              <button
                type="button"
                className="icon-btn"
                onClick={onShuffleSamples}
                title="রিসার্চ ডেটাসেট থেকে নতুন ৪টি নমুনা লোড করুন"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
              >
                <Shuffle size={12} />
                <span>নতুন নমুনা বদলান (Shuffle)</span>
              </button>
            )}
          </div>
          <div className="examples-pills">
            {selectedRegion.examples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                className="example-chip"
                onClick={() => {
                  setInputText(ex);
                  onTranslate(ex);
                }}
              >
                <Sparkles size={13} color="#a5b4fc" />
                <span>{ex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Big Center Action Button */}
      <div className="translate-btn-wrapper">
        <button
          type="button"
          className="translate-btn"
          onClick={onTranslate}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="spin-loader" />
              <span>অনুবাদ হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>অনুবাদ করুন (Translate)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
