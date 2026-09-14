import React from 'react';
import { MapPin } from 'lucide-react';
import { REGIONS } from '../data/regions';

export default function RegionSelector({ selectedRegion, onSelectRegion }) {
  return (
    <section className="region-section">
      <div className="section-label">
        <span>১. অঞ্চল নির্বাচন করুন (Select Dialect Region)</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>৭টি আঞ্চলিক উপভাষা সমর্থিত</span>
      </div>

      <div className="region-grid">
        {REGIONS.map((reg) => {
          const isSelected = selectedRegion.id === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              className={`region-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectRegion(reg)}
            >
              <div className="reg-en">
                <span>{reg.nameEn}</span>
                <span className="reg-badge">{reg.division}</span>
              </div>
              <div className="reg-bn">{reg.nameBn} উপভাষা</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
