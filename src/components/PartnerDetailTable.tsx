import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { PartnerDetailRow } from '../types';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { PaginationFooter } from './PaginationFooter';
import { formatCurrency } from '../lib/utils';

const columnHelper = createColumnHelper<PartnerDetailRow>();

interface PartnerDetailTableProps {
  data: PartnerDetailRow[];
}

export default function PartnerDetailTable({ data }: PartnerDetailTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    const lowerFilter = globalFilter.toLowerCase();
    
    return data.filter(row => 
      row.khuVuc.toLowerCase().includes(lowerFilter) ||
      row.nganhHang.toLowerCase().includes(lowerFilter) ||
      row.sanPham.toLowerCase().includes(lowerFilter) ||
      row.nhaBaoHiem.toLowerCase().includes(lowerFilter) ||
      row.partnerName.toLowerCase().includes(lowerFilter)
    );
  }, [data, globalFilter]);

  const columns = [
    columnHelper.accessor('partnerName', {
      id: 'partnerName',
      header: 'Đại lý',
      cell: info => <span className="font-semibold text-emerald-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('khuVuc', {
      id: 'khuVuc',
      header: 'Thành phố',
      cell: info => <span className="font-medium text-gray-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('nganhHang', {
      id: 'nganhHang',
      header: 'Ngành hàng',
      cell: info => <span className="font-medium text-gray-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('sanPham', {
      header: 'Sản phẩm',
      cell: info => <span className="text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('thoiHan', {
      header: 'Thời hạn',
      cell: info => <span className="text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('nhaBaoHiem', {
      header: 'Nhà bảo hiểm',
      cell: info => <span className="font-semibold text-blue-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('phuongThucThanhToan', {
      header: 'Thanh toán',
      cell: info => <span className="text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('quantity', {
      header: 'SL Bán',
      cell: info => <span className="font-medium text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('tongDoanhThu', {
      header: 'Tổng Doanh Thu',
      cell: info => <span className="font-bold text-blue-900">{formatCurrency(info.getValue())}</span>,
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="w-full mb-6 bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200 gap-4">
        <h3 className="text-lg font-bold text-[#002060]">Chi tiết Sản phẩm &amp; Đối tác</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-[#0a2342] text-white">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="p-3 font-bold border-r border-white/10 last:border-r-0 cursor-pointer select-none hover:bg-[#163a6a] transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-yellow-300" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-yellow-300" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <tr 
                  key={row.id} 
                  className={`bg-white hover:bg-gray-50 border-t border-gray-200`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="p-3 border-r border-gray-100 last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PaginationFooter 
        currentPage={table.getState().pagination.pageIndex}
        totalPages={table.getPageCount()}
        onPageChange={table.setPageIndex}
      />
    </div>
  );
}
