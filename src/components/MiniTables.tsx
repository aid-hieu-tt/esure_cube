import React, { useState } from 'react';
import { TopPerformerData, InactiveUnitData, ProviderDailyRevenue } from '../types';
import { PaginationFooter } from './PaginationFooter';
import { formatCurrency } from '../lib/utils';
import { ProviderRevenueChart } from './ProviderRevenueChart';
import { useCrossFilter } from '../context/CrossFilterContext';

interface MiniTablesProps {
  topPerformers: TopPerformerData[];
  inactiveUnits: InactiveUnitData[];
  providerDailyRevenue: ProviderDailyRevenue[];
  providerNames: string[];
}

export const MiniTables: React.FC<MiniTablesProps> = ({ topPerformers, inactiveUnits, providerDailyRevenue, providerNames }) => {
  const [topPage, setTopPage] = useState(0);
  const { filters, toggleFilter } = useCrossFilter();

  const filteredTop = React.useMemo(() => {
     let res = topPerformers;
     if (filters['regionCodes']) res = res.filter(r => r.region === filters['regionCodes']);
     if (filters['products']) res = res.filter(r => r.businessUnit === filters['products']);
     return res;
  }, [topPerformers, filters]);

  const pageSize = 10;
  
  const topTotalPages = Math.ceil(filteredTop.length / pageSize);
  const pagedTop = filteredTop.slice(topPage * pageSize, (topPage + 1) * pageSize);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
      {/* Top 7 Doanh số */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-100 to-amber-50 py-2 text-center text-sm font-bold text-slate-900">
          Top 7 doanh số sản phẩm theo vùng
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="border-r border-white/20 px-3 py-2 font-semibold">Vùng</th>
              <th className="border-r border-white/20 px-3 py-2 font-semibold">Sản phẩm</th>
              <th className="px-3 py-2 text-center font-semibold">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {pagedTop.map((item, index) => {
              const isRegionSelected = filters['regionCodes'] === item.region;
              const isProductSelected = filters['products'] === item.businessUnit;
              return (
              <tr
                key={item.id} 
                className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
              >
                <td 
                  className={`cursor-pointer border-r border-slate-200 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 ${isRegionSelected ? 'bg-blue-50/70 font-bold text-blue-800' : ''}`}
                  onClick={() => toggleFilter('regionCodes', item.region)}
                >
                  {item.region}
                </td>
                <td 
                  className={`cursor-pointer border-r border-slate-200 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 ${isProductSelected ? 'bg-blue-50/70 font-bold text-blue-800' : ''}`}
                  onClick={() => toggleFilter('products', item.businessUnit)}
                >
                  {item.businessUnit}
                </td>
                <td className="bg-amber-50/60 px-3 py-2 text-center font-semibold text-slate-700">{formatCurrency(item.total)}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationFooter 
          currentPage={topPage}
          totalPages={topTotalPages}
          onPageChange={setTopPage}
        />
      </div>

      {/* Line Chart: Doanh thu theo Nhà bảo hiểm */}
      <ProviderRevenueChart data={providerDailyRevenue} providerNames={providerNames} />
    </div>
  );
};
