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
import { CrossFilterProvider, useCrossFilter } from '../context/CrossFilterContext';
import { FilterBadge } from './FilterBadge';

function DashboardContent() {
  const [dateRange, setDateRange] = useState<DateRangeValue>('This month');
  const [filters, setFilters] = useState<FilterState>({
    agencies: [], products: [], paymentStatuses: [], durations: [], providers: [], partners: [], regionCodes: [], branchCodes: []
  });

  const { filters: crossFilters } = useCrossFilter();
  const { data, loading, refreshing, error } = useFetchDashboardData(dateRange, filters, crossFilters);
  const filterOptions = useCubeFilterOptions(dateRange);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-200 border-b-blue-700"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
          {error || 'No data available'}
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 px-4 py-5 md:px-6 md:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <Header onOpenSettings={() => setIsSettingOpen(true)} dateValue={dateRange} onDateChange={setDateRange} />
        <FilterSection filters={filters} onChange={setFilters} cityOptions={filterOptions.cities} paymentStatusOptions={filterOptions.paymentStatuses} productOptions={filterOptions.products} durationOptions={filterOptions.durations} providerOptions={filterOptions.providers} paymentMethodOptions={filterOptions.paymentMethods} regionOptions={filterOptions.regions} branchOptions={filterOptions.branches} optionsLoading={filterOptions.loading} />
        <FilterBadge />
        <KPISection kpis={data.kpis} />
        <ChartsSection timeTracking={data.timeTracking} regions={data.regions} />
        <RegionPerformanceTable data={data.regionPerformance} />
        <MiniTables topPerformers={data.topPerformers} inactiveUnits={data.inactiveUnits} providerDailyRevenue={data.providerDailyRevenue} providerNames={data.providerNames} />
        <DashboardPieCharts pieCharts={data.pieCharts} />
        <PartnerDetailTable data={data.partnerDetails} />
      </div>

      <RightDrawer isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} title="Cài đặt hệ thống">
        <TargetSetupForm onSaved={() => setIsSettingOpen(false)} cityOptions={filterOptions.regions} />
      </RightDrawer>
    </main>
  );
}

export const DashboardContainer: React.FC = () => {
  return (
    <CrossFilterProvider>
      <DashboardContent />
    </CrossFilterProvider>
  );
};
