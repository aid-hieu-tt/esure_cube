import React, { useState } from 'react';
import { useFetchDashboardData } from '../hooks/useFetchDashboardData';
import { useCubeFilterOptions } from '../hooks/useCubeFilterOptions';
import { Header } from './Header';
import { FilterSection, FilterState } from './FilterSection';
import { KPISection } from './KPISection';
import { MiniTables } from './MiniTables';
import { DashboardPieCharts } from './DashboardPieCharts';
import PartnerDetailTable from './PartnerDetailTable';
import { ChartsSection } from './ChartsSection';

import { RegionPerformanceTable } from './RegionPerformanceTable';
import RightDrawer from './Drawer';
import TargetSetupForm from './TargetSetupForm';
import { DateRangeValue } from './LookerDateRangePicker';

export const DashboardContainer: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeValue>('This month');
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    products: [],
    categories: [],
    durations: [],
    providers: [],
    partners: []
  });

  // Pass filters to the hook — Cube.js will apply server-side filtering
  const { data, loading, refreshing, error } = useFetchDashboardData(dateRange, filters);
  const filterOptions = useCubeFilterOptions(dateRange);
  const [activePartner, setActivePartner] = useState<'MIC' | 'BaoLong' | null>(null);

  const [isSettingOpen, setIsSettingOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="text-red-500 font-medium">{error || 'No data available'}</div>
      </div>
    );
  }

  const handlePartnerClick = (partner: 'MIC' | 'BaoLong' | null) => {
    setActivePartner(prev => prev === partner ? null : partner);
  };



  return (
    <main className="min-h-screen bg-[#f4f7f6] p-4 md:p-6 lg:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <Header 
          onOpenSettings={() => setIsSettingOpen(true)} 
          dateValue={dateRange}
          onDateChange={setDateRange}
        />
        
        <FilterSection 
          filters={filters} 
          onChange={setFilters}
          cityOptions={filterOptions.cities}
          categoryOptions={filterOptions.categories}
          productOptions={filterOptions.products}
          durationOptions={filterOptions.durations}
          providerOptions={filterOptions.providers}
          paymentMethodOptions={filterOptions.paymentMethods}
          optionsLoading={filterOptions.loading}
        />
        
        <KPISection 
          kpis={data.kpis} 
          onPartnerClick={handlePartnerClick} 
        />
        
        <MiniTables 
          topPerformers={data.topPerformers} 
          inactiveUnits={data.inactiveUnits}
          providerDailyRevenue={data.providerDailyRevenue}
          providerNames={data.providerNames}
        />
        
        <DashboardPieCharts pieCharts={data.pieCharts} />
        
        <PartnerDetailTable data={data.partnerDetails} />
        
        <ChartsSection 
          timeTracking={data.timeTracking} 
          regions={data.regions}
        />
        
        <RegionPerformanceTable data={data.regionPerformance} />
        

      </div>

      <RightDrawer 
        isOpen={isSettingOpen} 
        onClose={() => setIsSettingOpen(false)}
        title="Cài đặt hệ thống"
      >
        <TargetSetupForm onSaved={() => setIsSettingOpen(false)} cityOptions={filterOptions.cities} />
      </RightDrawer>
    </main>
  );
};
