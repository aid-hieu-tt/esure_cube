import React, { useState } from 'react';
import { RegionPerformanceData } from '../types';
import { PaginationFooter } from './PaginationFooter';
import { formatCurrency } from '../lib/utils';
import { useCrossFilter } from '../context/CrossFilterContext';

interface RegionPerformanceTableProps {
  data: RegionPerformanceData[];
}

export const RegionPerformanceTable: React.FC<RegionPerformanceTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { filters, toggleFilter } = useCrossFilter();

  if (!data || data.length === 0) return null;

  const filteredData = React.useMemo(() => {
    let result = data;
    if (filters['regionCodes']) {
      result = result.filter(r => r.region === filters['regionCodes']);
    }
    return result;
  }, [data, filters]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentData = filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

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
    <section className="mb-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Hiệu suất theo Vùng
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Vùng</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">DS ngày</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">DS tháng</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">Chỉ tiêu</th>
              <th className="whitespace-nowrap px-4 py-3 text-center font-semibold text-slate-600">Hoàn thành</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">Case Size</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.map((row) => {
              const isSelected = filters['regionCodes'] === row.region;
              return (
              <tr 
                key={row.id} 
                className={`transition-colors hover:bg-blue-50/20 ${isSelected ? 'border-l-4 border-l-blue-600 bg-blue-50/40' : 'border-l-4 border-l-transparent'}`}
              >
                <td 
                  className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:underline hover:text-blue-700 decoration-blue-700 underline-offset-2"
                  onClick={() => toggleFilter('regionCodes', row.region)}
                >
                  {row.region}
                </td>
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
              );
            })}
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
