import React, { useState } from 'react';
import { X, Settings, Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  hfRepoId,
  setHfRepoId,
  hfApiToken,
  setHfApiToken,
  onSave,
}) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const res = await fetch(`${API_BASE}/api/settings/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hf_repo_id: hfRepoId,
          hf_api_token: hfApiToken,
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ valid: false, error: "Failed to connect to backend server." });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAndClose = () => {
    onSave({ hfRepoId, hfApiToken });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Settings size={22} color="#6366f1" />
            <span>Model & API Settings</span>
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Configure the Hugging Face Serverless Inference API connection. If unconfigured, the application runs in a simulated demonstration mode.
          </p>

          <div className="form-group">
            <label>Hugging Face Model Repository ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. your-username/banglat5-dialect-to-standard"
              value={hfRepoId}
              onChange={(e) => setHfRepoId(e.target.value)}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              The fine-tuned model uploaded to Hugging Face Hub.
            </span>
          </div>

          <div className="form-group">
            <label>Hugging Face Access Token</label>
            <input
              type="password"
              className="form-input"
              placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={hfApiToken}
              onChange={(e) => setHfApiToken(e.target.value)}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Create a free token at huggingface.co/settings/tokens with Read permissions.
            </span>
          </div>

          {/* Test Connection Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <button
              type="button"
              className="action-btn"
              onClick={handleTestConnection}
              disabled={testing || !hfRepoId.trim()}
            >
              {testing ? <Loader2 size={16} className="spin-loader" /> : <Key size={16} />}
              <span>Test Connection</span>
            </button>

            {testResult && (
              <span style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 6, color: testResult.valid ? '#10b981' : '#ef4444' }}>
                {testResult.valid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {testResult.valid ? "Verified successfully!" : testResult.error}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" className="action-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="action-btn primary" onClick={handleSaveAndClose}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
