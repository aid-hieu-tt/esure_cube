import React from 'react';
import { KPIData } from '../types';
import { BaseMetricCard } from './BaseMetricCard';

interface KPISectionProps {
  kpis: KPIData[];
  onPartnerClick: (partner: 'MIC' | 'BaoLong' | null) => void;
}

export const KPISection: React.FC<KPISectionProps> = ({ kpis, onPartnerClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      {kpis.map((kpi) => {
        let onClick = undefined;

        if (kpi.id === 'mic') {
          onClick = () => onPartnerClick('MIC');
        } else if (kpi.id === 'baolong') {
          onClick = () => onPartnerClick('BaoLong');
        }

        return (
          <BaseMetricCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            bgColor={kpi.bgColor}
            textColor={kpi.textColor}
            logo={kpi.logo}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
};
