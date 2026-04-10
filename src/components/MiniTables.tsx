import React, { useState } from 'react';
import { TopPerformerData, InactiveUnitData, ProviderDailyRevenue } from '../types';
import { PaginationFooter } from './PaginationFooter';
import { formatCurrency } from '../lib/utils';
import { ProviderRevenueChart } from './ProviderRevenueChart';

interface MiniTablesProps {
  topPerformers: TopPerformerData[];
  inactiveUnits: InactiveUnitData[];
  providerDailyRevenue: ProviderDailyRevenue[];
  providerNames: string[];
}

export const MiniTables: React.FC<MiniTablesProps> = ({ topPerformers, inactiveUnits, providerDailyRevenue, providerNames }) => {
  const [topPage, setTopPage] = useState(0);

  const pageSize = 10;
  
  const topTotalPages = Math.ceil(topPerformers.length / pageSize);
  const pagedTop = topPerformers.slice(topPage * pageSize, (topPage + 1) * pageSize);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Top 7 Doanh số */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#fcd5b4] text-center py-2 font-bold text-gray-900 border-b border-gray-300">
          Top 7 doanh số sản phẩm theo thành phố
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-[#002060] text-white">
            <tr>
              <th className="py-2 px-3 font-medium border-r border-white/20">Thành phố</th>
              <th className="py-2 px-3 font-medium border-r border-white/20">Sản phẩm</th>
              <th className="py-2 px-3 font-medium text-center">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {pagedTop.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 border-r border-gray-200">{item.region}</td>
                <td className="py-2 px-3 border-r border-gray-200">{item.businessUnit}</td>
                <td className="py-2 px-3 text-center bg-[#fff3e0] font-medium">{formatCurrency(item.total)}</td>
              </tr>
            ))}
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
