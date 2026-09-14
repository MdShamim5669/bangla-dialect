import React, { useState } from 'react';
import { X, Award, BarChart3, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RESEARCH_BENCHMARKS } from '../data/researchData';

export default function InsightsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('benchmarks'); // 'benchmarks' | 'regions' | 'findings'

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>
            <BookOpen size={22} color="#6366f1" />
            <span>Thesis & Research Insights</span>
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 24px 0 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            className={`action-btn ${activeTab === 'benchmarks' ? 'primary' : ''}`}
            onClick={() => setActiveTab('benchmarks')}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Award size={15} />
            <span>Overall Evaluation</span>
          </button>
          <button
            className={`action-btn ${activeTab === 'regions' ? 'primary' : ''}`}
            onClick={() => setActiveTab('regions')}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <BarChart3 size={15} />
            <span>Per-Region Breakdown</span>
          </button>
          <button
            className={`action-btn ${activeTab === 'findings' ? 'primary' : ''}`}
            onClick={() => setActiveTab('findings')}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <AlertCircle size={15} />
            <span>Key Research Findings</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* TAB 1: OVERALL BENCHMARKS */}
          {activeTab === 'benchmarks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="info-card">
                <h4>Research Scope & Dataset</h4>
                <p>
                  14,130 parallel sentence pairs derived from 2,500 core sentences across 7 regional dialects of Bangladesh. Evaluated on 1,419 strictly held-out test pairs using an ID-grouped, leakage-free split.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
                  Model Benchmark Comparison (Test Set: 1,419 pairs)
                </h3>
                <div className="table-responsive-wrapper">
                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Model Architecture</th>
                        <th>BLEU</th>
                        <th>chrF</th>
                        <th>BERTScore F1</th>
                        <th>STS Cosine</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RESEARCH_BENCHMARKS.overall.map((row, idx) => (
                        <tr key={idx} className={row.winner ? 'highlight-row' : ''}>
                          <td>
                            <strong>{row.model}</strong>
                          </td>
                          <td>{row.bleu}</td>
                          <td>{row.chrf}</td>
                          <td>{row.bertF1}</td>
                          <td>{row.sts}</td>
                          <td>
                            {row.winner ? (
                              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CheckCircle2 size={14} /> Selected
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Comparison</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="banner-alert success">
                <CheckCircle2 size={18} />
                <span>
                  <strong>BanglaT5 Superiority:</strong> Outperformed multilingual mT5-base (+3.27 BLEU) and mT5-small (+7.29 BLEU) across all lexical and semantic metrics.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PER REGION BREAKDOWN */}
          {activeTab === 'regions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="info-card">
                <h4>Dialect-by-Dialect Evaluation (BanglaT5 Final Model)</h4>
                <p>
                  Performance varies significantly by regional linguistic distance. Notice how Jashore's top score strongly correlates with its high "Exact-Same-as-Standard" rate in the dataset.
                </p>
              </div>

              <div className="table-responsive-wrapper">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Test N</th>
                      <th>BLEU</th>
                      <th>chrF</th>
                      <th>BERTScore</th>
                      <th>Exact Match</th>
                      <th>Dataset Identity Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_BENCHMARKS.perRegion.map((reg, idx) => (
                      <tr key={idx} className={reg.region === 'Chittagong' ? 'highlight-row' : ''}>
                        <td><strong>{reg.region}</strong></td>
                        <td>{reg.testN}</td>
                        <td>{reg.bleu}</td>
                        <td>{reg.chrf}</td>
                        <td>{reg.bertF1}</td>
                        <td>{reg.exactMatch}</td>
                        <td style={{ color: parseFloat(reg.identityRate) > 10 ? '#38bdf8' : 'inherit' }}>
                          {reg.identityRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="banner-alert info">
                <span>
                  <strong>Linguistic Divergence:</strong> Chittagong represents the most linguistically divergent dialect (0.07-0.14 Jaccard similarity to all others), resulting in genuine high-difficulty translation.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: KEY RESEARCH FINDINGS */}
          {activeTab === 'findings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {RESEARCH_BENCHMARKS.edaFindings.map((finding, idx) => (
                <div key={idx} className="info-card">
                  <h4 style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>#{idx + 1}</span> {finding.title}
                  </h4>
                  <p>{finding.content}</p>
                </div>
              ))}

              <div className="info-card" style={{ borderLeft: '3px solid #10b981' }}>
                <h4>Final Inference Specifications</h4>
                <p>
                  • <strong>Exact Input Prompt:</strong> <code>translate &#123;region&#125; to Bangla: &#123;dialect_sentence&#125;</code><br />
                  • <strong>Decoding Parameters:</strong> <code>num_beams = 4, max_new_tokens = 32, length_penalty = 1.0, early_stopping = True</code><br />
                  • <strong>Normalization:</strong> Unicode NFC normalization & invisible character removal before scoring.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
