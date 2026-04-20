/**
 * Hook lấy distinct dimension values từ Cube.js cho filter dropdowns
 * Kèm theo metric (totalRevenue) theo dateRange hiện tại
 */
import { useState, useEffect } from 'react';
import { cubeLoad, CubeResultRow } from '../lib/cubeClient';
import { DateRangeValue } from '../components/LookerDateRangePicker';

export interface FilterOption {
  id: string;
  label: string;
  metric?: number; // e.g. total revenue for this option
}

export interface FilterOptions {
  cities: FilterOption[];
  statuses: FilterOption[];
  productOptions: FilterOption[];
  packageOptions: FilterOption[];
  paymentStatuses: FilterOption[];
  durations: FilterOption[];
  providers: FilterOption[];
  paymentMethods: FilterOption[];
  regions: FilterOption[];
  branches: FilterOption[];
  loading: boolean;
}

function toOptionsWithMetric(rows: CubeResultRow[], dimKey: string, measureKey: string): FilterOption[] {
  return rows
    .map(r => {
      const val = String(r[dimKey] ?? '').trim();
      const metric = Number(r[measureKey] ?? 0);
      return { val, metric };
    })
    .filter(v => v.val !== '' && v.val !== 'null' && v.val !== 'N/A')
    .sort((a, b) => (b.metric || 0) - (a.metric || 0)) // Sort descending by metric
    .map(v => ({ id: v.val, label: v.val, metric: v.metric }));
}

function combineMasterWithRevenue(
  masterRows: CubeResultRow[], 
  revenueRows: CubeResultRow[], 
  masterDim: string, 
  revenueDim: string, 
  measureKey: string
): FilterOption[] {
  const metricMap: Record<string, number> = {};
  for(const r of revenueRows) {
    const key = String(r[revenueDim] ?? '').trim();
    if(key) metricMap[key] = Number(r[measureKey] ?? 0);
  }

  return masterRows
    .map(r => {
      const val = String(r[masterDim] ?? '').trim();
      return { id: val, label: val, metric: metricMap[val] || 0 };
    })
    .filter(v => v.label !== '' && v.label !== 'null' && v.label !== 'N/A')
    .sort((a, b) => (b.metric || 0) - (a.metric || 0));
}

export function useCubeFilterOptions(dateRange: DateRangeValue = 'This month'): FilterOptions {
  const [options, setOptions] = useState<FilterOptions>({
    cities: [],
    statuses: [],
    productOptions: [],
    packageOptions: [],
    paymentStatuses: [],
    durations: [],
    providers: [],
    paymentMethods: [],
    regions: [],
    branches: [],
    loading: true,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const orderTimeDim = { dimension: 'dashboard_overview.orderdate', dateRange };
        const itemTimeDim = { dimension: 'dashboard_overview.order_items_createdat', dateRange };

        const tenantFilter = {
          member: 'dashboard_overview.user_agencies_tenantName',
          operator: 'equals',
          values: ['VIETBANK']
        };
        const loadWithFilter = (query: any) => cubeLoad({ ...query, filters: [tenantFilter] });

        const [cityRows, statusRows, productRows, catRows, durationRows, providerRows, paymentRows, revenueRegionsRows, revenueBranchesRows, regionRows, branchRows] = await Promise.all([
          loadWithFilter({
            measures: ['dashboard_overview.totalRevenue'],
            dimensions: ['dashboard_overview.agencies_name'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.totalRevenue': 'desc' },
            limit: 100,
          }),
          loadWithFilter({
            dimensions: ['dashboard_overview.status'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.status': 'asc' },
            limit: 50,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.order_items_totalRevenue'],
            dimensions: ['dashboard_overview.order_items_productName', 'dashboard_overview.order_items_packageName'],
            timeDimensions: [itemTimeDim],
            order: { 'dashboard_overview.order_items_totalRevenue': 'desc' },
            limit: 200,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.totalRevenue'],
            dimensions: ['dashboard_overview.paymentstatus'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.totalRevenue': 'desc' },
            limit: 50,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.order_items_totalRevenue'],
            dimensions: ['dashboard_overview.order_items_durationName'],
            timeDimensions: [itemTimeDim],
            order: { 'dashboard_overview.order_items_totalRevenue': 'desc' },
            limit: 100,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.order_items_totalRevenue'],
            dimensions: ['dashboard_overview.order_items_providerName'],
            timeDimensions: [itemTimeDim],
            order: { 'dashboard_overview.order_items_totalRevenue': 'desc' },
            limit: 50,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.totalRevenue'],
            dimensions: ['dashboard_overview.paymentmethod'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.totalRevenue': 'desc' },
            limit: 50,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.totalRevenue'],
            dimensions: ['dashboard_overview.user_agencies_regionName'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.totalRevenue': 'desc' },
            limit: 50,
          }),
          loadWithFilter({
            measures: ['dashboard_overview.totalRevenue'],
            dimensions: ['dashboard_overview.user_agencies_branchName'],
            timeDimensions: [orderTimeDim],
            order: { 'dashboard_overview.totalRevenue': 'desc' },
            limit: 200,
          }),
          cubeLoad({
            dimensions: ['regions.name'],
            limit: 200,
          }),
          cubeLoad({
            dimensions: ['branches.name'],
            limit: 500,
          }),
        ]);

        setOptions({
          cities: toOptionsWithMetric(cityRows, 'dashboard_overview.agencies_name', 'dashboard_overview.totalRevenue'),
          statuses: toOptionsWithMetric(statusRows, 'dashboard_overview.status', 'dashboard_overview.totalRevenue'),
          productOptions: toOptionsWithMetric(productRows, 'dashboard_overview.order_items_productName', 'dashboard_overview.order_items_totalRevenue'),
          packageOptions: toOptionsWithMetric(productRows, 'dashboard_overview.order_items_packageName', 'dashboard_overview.order_items_totalRevenue'),
          paymentStatuses: toOptionsWithMetric(catRows, 'dashboard_overview.paymentstatus', 'dashboard_overview.totalRevenue'),
          durations: toOptionsWithMetric(durationRows, 'dashboard_overview.order_items_durationName', 'dashboard_overview.order_items_totalRevenue'),
          providers: toOptionsWithMetric(providerRows, 'dashboard_overview.order_items_providerName', 'dashboard_overview.order_items_totalRevenue'),
          paymentMethods: toOptionsWithMetric(paymentRows, 'dashboard_overview.paymentmethod', 'dashboard_overview.totalRevenue'),
          regions: combineMasterWithRevenue(regionRows, revenueRegionsRows, 'regions.name', 'dashboard_overview.user_agencies_regionName', 'dashboard_overview.totalRevenue'),
          branches: combineMasterWithRevenue(branchRows, revenueBranchesRows, 'branches.name', 'dashboard_overview.user_agencies_branchName', 'dashboard_overview.totalRevenue'),
          loading: false,
        });
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
        setOptions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchOptions();
  }, [JSON.stringify(dateRange)]);

  return options;
}
