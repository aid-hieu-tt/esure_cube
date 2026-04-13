import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileSpreadsheet, Save, MapPin } from 'lucide-react';

const targetSchema = z.object({
  month: z.string().min(1, "Vui lòng chọn tháng"),
  targets: z.array(z.object({
    cityId: z.string(),
    cityName: z.string(),
    chiTieuDoanhThu: z.number().min(0, "Chỉ tiêu không được âm"),
  }))
});

type TargetFormValues = z.infer<typeof targetSchema>;

interface CityOption {
  id: string;
  label: string;
}

interface TargetSetupFormProps {
  onSaved?: () => void;
  cityOptions?: CityOption[];
}

export default function TargetSetupForm({ onSaved, cityOptions = [] }: TargetSetupFormProps) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      month: '',
      targets: [],
    }
  });

  const { fields } = useFieldArray({ control, name: "targets" });

  useEffect(() => {
    if (cityOptions.length > 0) {
      reset({
        month: '',
        targets: cityOptions.map(city => ({
          cityId: city.id,
          cityName: city.label,
          chiTieuDoanhThu: 0,
        })),
      });
    }
  }, [cityOptions, reset]);

  const onSubmit = async (data: TargetFormValues) => {
    console.log("Payload gửi đi:", data);
    alert("Đã lưu cấu hình! Xem console để biết chi tiết payload.");
    if (onSaved) onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-white">
        <h2 className="text-base font-bold text-gray-800">Cấu hình Chỉ tiêu</h2>
        <div className="flex gap-2">
          <button 
            type="button" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <FileSpreadsheet size={14} />
            Import Excel
          </button>
          <button 
            type="submit" 
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Save size={14} />
            Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Month Picker */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tháng áp dụng</label>
          <input 
            type="month" 
            {...register("month")} 
            className="w-52 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white hover:border-gray-300"
          />
          {errors.month && <span className="text-red-500 text-xs mt-1 block">{errors.month.message}</span>}
        </div>

        {/* Table */}
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 animate-pulse">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <p className="text-sm">Đang tải danh sách đại lý...</p>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr] bg-gray-50 border-b border-gray-200">
              <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Đại lý</div>
              <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Chỉ tiêu doanh thu (tr)</div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="grid grid-cols-[1fr_1fr] items-center hover:bg-blue-50/30 transition-colors duration-150 group"
                >
                  <div className="px-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{field.cityName}</span>
                  </div>
                  <div className="px-4 py-1.5">
                    <input
                      type="number"
                      {...register(`targets.${index}.chiTieuDoanhThu`, { valueAsNumber: true })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white hover:border-gray-300 group-hover:bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
