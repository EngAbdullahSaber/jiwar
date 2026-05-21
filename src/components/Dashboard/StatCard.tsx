import type { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  accent?: string;
}

export function StatCard({ label, value, icon: Icon, iconBg, iconColor, accent }: StatCardProps) {
  const numericValue = Number(value);
  const isEmpty = numericValue === 0;
  const displayValue = numericValue.toLocaleString();

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-6 overflow-hidden group hover:shadow-md hover:shadow-gray-100/80 dark:hover:shadow-none hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">

      {/* Corner glow — dimmed when empty */}
      <div className={cn(
        "absolute -top-8 -right-8 w-28 h-28 rounded-md blur-2xl pointer-events-none transition-opacity duration-300",
        accent || "bg-[#B39371]",
        isEmpty
          ? "opacity-5 group-hover:opacity-10"
          : "opacity-15 group-hover:opacity-25"
      )} />

      <div className="relative flex items-center justify-between mb-5">
        <div className={cn(
          "w-11 h-11 rounded-md flex items-center justify-center transition-colors",
          isEmpty
            ? "bg-gray-50 dark:bg-gray-800/60"
            : iconBg || "bg-[#F5F1ED] dark:bg-gray-800"
        )}>
          <Icon className={cn(
            "w-5 h-5 transition-colors",
            isEmpty
              ? "text-gray-300 dark:text-gray-600"
              : iconColor || "text-[#4A1B1B] dark:text-[#B39371]"
          )} />
        </div>
      </div>

      <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>

      <p className={cn(
        "text-[34px] font-bold tracking-tight leading-none tabular-nums transition-colors",
        isEmpty
          ? "text-gray-200 dark:text-gray-700"
          : "text-gray-900 dark:text-white"
      )}>
        {displayValue}
      </p>

      {isEmpty && (
        <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-2 font-medium">
          No data yet
        </p>
      )}
    </div>
  );
}
