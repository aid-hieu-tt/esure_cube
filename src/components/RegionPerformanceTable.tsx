import React, { useState } from 'react';
import { RegionPerformanceData } from '../types';
import { PaginationFooter } from './PaginationFooter';
import { formatCurrency } from '../lib/utils';

interface RegionPerformanceTableProps {
  data: RegionPerformanceData[];
}

export const RegionPerformanceTable: React.FC<RegionPerformanceTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!data || data.length === 0) return null;

  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const getCompletionColor = (rate: number) => {
    if (rate >= 100) return 'text-green-600 bg-green-50';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <span className="text-green-500">▲</span>;
    if (trend === 'down') return <span className="text-red-500">▼</span>;
    return <span className="text-gray-400">−</span>;
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Hiệu suất theo Đại lý
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Đại lý</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right whitespace-nowrap">DS ngày</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right whitespace-nowrap">DS tháng</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right whitespace-nowrap">Chỉ tiêu</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-center whitespace-nowrap">Hoàn thành</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right whitespace-nowrap">Case Size</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{row.region}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.dailySales)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(row.monthlySales)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(row.target)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${getCompletionColor(row.completionRate)}`}>
                    {row.completionRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatCurrency(row.caseSize)} {getTrendIcon(row.caseSizeTrend)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationFooter 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default RegionPerformanceTable;
