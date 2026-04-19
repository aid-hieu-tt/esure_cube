import React from 'react';
import { KPIData } from '../types';
import { BaseMetricCard } from './BaseMetricCard';
import { useCrossFilter } from '../context/CrossFilterContext';

interface KPISectionProps {
  kpis: KPIData[];
}

export const KPISection: React.FC<KPISectionProps> = ({ kpis }) => {
  const { toggleFilter, filters } = useCrossFilter();
  const providerFilterMap: Record<string, string> = {
    mic: 'MIC',
    baolong: 'BaoLong',
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {kpis.map((kpi) => {
        const filterValue = providerFilterMap[kpi.id];
        const onClick = filterValue ? () => toggleFilter('providers', filterValue) : undefined;
        const isDimmed = filterValue ? Boolean(filters['providers'] && filters['providers'] !== filterValue) : false;

        return (
          <div key={kpi.id} className={`h-full transition-opacity duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}>
            <BaseMetricCard
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              bgColor={kpi.bgColor}
              textColor={kpi.textColor}
              logo={kpi.logo}
              onClick={onClick}
            />
          </div>
        );
      })}
    </div>
  );
};
