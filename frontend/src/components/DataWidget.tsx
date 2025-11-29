import React from 'react';

interface DataWidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

export function DataWidget({ icon, label, value, trend }: DataWidgetProps) {
  const trendColors = {
    up: 'text-[#10B981]',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-gray-500 text-sm mb-1">{label}</div>
          <div className={`text-2xl font-semibold ${trend ? trendColors[trend] : 'text-[#0F172A]'}`}>
            {value}
          </div>
        </div>
        <div className="text-[#10B981]">
          {icon}
        </div>
      </div>
    </div>
  );
}
