import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieChartData } from '../types';

function formatVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} tr`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

const COLORS = [
  '#4285F4', // Google Blue
  '#FBBC05', // Google Yellow
  '#EA4335', // Google Red
  '#00BCD4', // Cyan
  '#34A853', // Google Green
  '#F48FB1', // Light Pink
  '#FF9800', // Orange
  '#9C27B0'  // Purple
];

interface ChartBoxProps {
  title: string;
  data: PieChartData[];
}

const ChartBox: React.FC<ChartBoxProps> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col items-center justify-center h-[300px] text-gray-400">
        <p className="text-sm font-semibold mb-2">{title}</p>
        <p className="text-xs">Không có dữ liệu</p>
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  // Transform data for MUI X Charts with static colors matching the legend
  const muiData = data.map((d, index) => ({
    id: index,
    value: d.value,
    label: d.name,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[300px]">
      <div className="bg-[#f0f4f8] text-center py-2 font-bold text-[#002060] border-b border-gray-200 text-sm shrink-0">
        {title}
      </div>
      <div className="flex-1 w-full flex flex-row items-center justify-center p-2">
        {/* Left 50% for strictly the Pie Chart */}
        <div className="w-[50%] h-full flex justify-center items-center">
          <PieChart
            series={[
              {
                data: muiData,
                outerRadius: 105,
                innerRadius: 0,
                paddingAngle: 1, 
                cornerRadius: 3, 
                arcLabel: (item) => `${((item.value / total) * 100).toFixed(0)}%`,
                arcLabelMinAngle: 15, 
                valueFormatter: (item: any) => {
                  const val = typeof item === 'number' ? item : item?.value;
                  return val !== undefined && val !== null ? formatVND(val) : '';
                },
              },
            ]}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            hideLegend // Hide internal MUI legend
          />
        </div>

        {/* Right 50% strictly for the custom balanced HTML legend */}
        <div className="w-[50%] h-full flex flex-col justify-center px-4 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {muiData.map((d) => (
              <div key={d.id} className="flex items-center text-[12px] text-gray-800">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 mr-2.5 shadow-sm"
                  style={{ backgroundColor: d.color }}
                ></span>
                <span className="font-semibold truncate" title={d.label}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

interface DashboardPieChartsProps {
  pieCharts: {
    product: PieChartData[];
    duration: PieChartData[];
    provider: PieChartData[];
    payment: PieChartData[];
  };
}

export const DashboardPieCharts: React.FC<DashboardPieChartsProps> = ({ pieCharts }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <ChartBox title="Ngành hàng" data={pieCharts.product} />
      <ChartBox title="Thời hạn" data={pieCharts.duration} />
      <ChartBox title="Nhà bảo hiểm" data={pieCharts.provider} />
      <ChartBox title="Thanh toán" data={pieCharts.payment} />
    </div>
  );
};
