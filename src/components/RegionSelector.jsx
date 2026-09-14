import React from 'react';
import { MapPin } from 'lucide-react';
import { REGIONS } from '../data/regions';

export default function RegionSelector({ regions = [], selectedRegion, onSelectRegion }) {
  const activeList = regions && regions.length > 0 ? regions : REGIONS;

  return (
    <section className="region-section">
      <div className="section-label">
        <span>১. অঞ্চল নির্বাচন করুন (Select Dialect Region)</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>৭টি আঞ্চলিক উপভাষা সমর্থিত • Real Dataset Linked</span>
      </div>

      <div className="region-grid">
        {activeList.map((reg) => {
          const isSelected = selectedRegion?.id === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              className={`region-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectRegion(reg)}
            >
              <div className="reg-en">
                <span>{reg.nameEn}</span>
                <span className="reg-badge">{reg.dataset_pairs ? `${reg.dataset_pairs} pairs` : reg.division}</span>
              </div>
              <div className="reg-bn">
                {reg.nameBn} উপভাষা
                {reg.bleu ? <span style={{ fontSize: '0.72rem', opacity: 0.8, marginLeft: 4 }}>({reg.bleu} BLEU)</span> : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
