import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { cubeLoadMulti } from '../lib/cubeClient';
import {
  KPI_QUERY,
  ORDERS_BY_STATUS_QUERY,
  REVENUE_BY_CITY_QUERY,
  REVENUE_BY_PRODUCT_QUERY,
  REVENUE_BY_PAYMENT_METHOD_QUERY,
  REVENUE_BY_PROVIDER_QUERY,
  DAILY_ORDERS_QUERY,
  DAILY_REVENUE_BY_PROVIDER_QUERY,
  PARTNER_DETAIL_QUERY,
  REVENUE_BY_PRODUCT_NAME_QUERY,
  REVENUE_BY_DURATION_QUERY,
} from '../lib/cubeQueries';
import { mapCubeDataToDashboard } from '../lib/cubeDataMapper';
import { DateRangeValue } from '../components/LookerDateRangePicker';
import { FilterState } from '../components/FilterSection';

// Map FilterState selections → Cube.js filter objects
function buildCubeFilters(filters: FilterState): Array<{ member: string; operator: string; values: string[] }> {
  const cubeFilters: Array<{ member: string; operator: string; values: string[] }> = [];

  if (filters.regions.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.agencies_name',
      operator: 'equals',
      values: filters.regions,
    });
  }
  if (filters.categories.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.order_items_productName',
      operator: 'equals',
      values: filters.categories,
    });
  }
  if (filters.products.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.order_items_packageName',
      operator: 'equals',
      values: filters.products,
    });
  }
  if (filters.durations.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.order_items_durationName',
      operator: 'equals',
      values: filters.durations,
    });
  }
  if (filters.providers.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.order_items_providerName',
      operator: 'equals',
      values: filters.providers,
    });
  }
  if (filters.partners.length > 0) {
    cubeFilters.push({
      member: 'dashboard_overview.paymentmethod',
      operator: 'equals',
      values: filters.partners,
    });
  }

  return cubeFilters;
}

export const useFetchDashboardData = (
  dateRange: DateRangeValue = 'This month',
  filters: FilterState = { regions: [], products: [], categories: [], durations: [], providers: [], partners: [] },
) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only show full-page spinner on initial load (no data yet)
        if (!data) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const cubeFilters = buildCubeFilters(filters);

        // Build query with time dimension + cross-filters
        const buildQuery = (baseQuery: any, dateDim: string) => {
          return {
            ...baseQuery,
            filters: [
              ...(baseQuery.filters || []),
              ...cubeFilters,
            ],
            timeDimensions: [{
              dimension: dateDim,
              dateRange: dateRange,
              ...(baseQuery.timeDimensions?.[0]?.granularity ? { granularity: baseQuery.timeDimensions[0].granularity } : {})
            }]
          };
        };

        const queries = {
          kpi: buildQuery(KPI_QUERY, 'dashboard_overview.orderdate'),
          status: buildQuery(ORDERS_BY_STATUS_QUERY, 'dashboard_overview.orderdate'),
          city: buildQuery(REVENUE_BY_CITY_QUERY, 'dashboard_overview.orderdate'),
          product: buildQuery(REVENUE_BY_PRODUCT_QUERY, 'dashboard_overview.order_items_createdat'),
          payment: buildQuery(REVENUE_BY_PAYMENT_METHOD_QUERY, 'dashboard_overview.orderdate'),
          provider: buildQuery(REVENUE_BY_PROVIDER_QUERY, 'dashboard_overview.order_items_createdat'),
          daily: buildQuery(DAILY_ORDERS_QUERY, 'dashboard_overview.orderdate'),
          dailyProvider: buildQuery(DAILY_REVENUE_BY_PROVIDER_QUERY, 'dashboard_overview.order_items_createdat'),
          details: buildQuery(PARTNER_DETAIL_QUERY, 'dashboard_overview.order_items_createdat'),
          pieProduct: buildQuery(REVENUE_BY_PRODUCT_NAME_QUERY, 'dashboard_overview.order_items_createdat'),
          pieDuration: buildQuery(REVENUE_BY_DURATION_QUERY, 'dashboard_overview.order_items_createdat'),
        };

        const results = await cubeLoadMulti(queries);

        const dashboardData = mapCubeDataToDashboard(results as any);
        setData(dashboardData);
        setLoading(false);
        setRefreshing(false);
      } catch (err) {
        console.error('Failed to fetch Cube.js data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data from Cube.js');
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [
    dateRange ? JSON.stringify(dateRange) : null,
    JSON.stringify(filters),
  ]);

  return { data, loading, refreshing, error };
};
