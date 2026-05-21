import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { useTranslation } from "react-i18next";
import { BarChart2 } from "lucide-react";

interface SalesTrendsChartProps {
  data?: { month: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label, isEmpty }: any) => {
  if (!active || !payload?.length || isEmpty) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md px-4 py-3 shadow-xl">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {payload[0].value}
      </p>
      <p className="text-xs text-[#B39371] font-medium mt-0.5">contracts</p>
    </div>
  );
};

function buildChartData(rawData?: { month: string; count: number }[]) {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = startOfMonth(subMonths(today, 5 - i));
    const key = format(date, "yyyy-MM");
    const found = rawData?.find((d) => d.month === key);
    return {
      name: format(date, "MMM").toUpperCase(),
      value: found?.count ?? 0,
      hasData: !!found,
    };
  });
}

export function SalesTrendsChart({ data: rawData }: SalesTrendsChartProps) {
  const { t } = useTranslation();

  const chartData = buildChartData(rawData);
  const total = chartData.reduce((s, d) => s + d.value, 0);
  const maxVal = Math.max(...chartData.map((d) => d.value));
  const isEmpty = total === 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-md bg-[#B39371]" />
            <p className="text-[11px] font-semibold text-[#B39371] uppercase tracking-widest">
              {t("dashboard.salesTrends.last6Months")}
            </p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.salesTrends.title")}
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {t("dashboard.salesTrends.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-md">
          <BarChart2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">
            {total} {t("dashboard.salesTrends.contracts")}
          </span>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "currentColor",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "Plus Jakarta Sans, Cairo, sans-serif",
              }}
              className="text-gray-400 dark:text-gray-500"
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "currentColor",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "Plus Jakarta Sans, Cairo, sans-serif",
              }}
              className="text-gray-400 dark:text-gray-500"
              width={24}
              allowDecimals={false}
              domain={isEmpty ? [0, 5] : undefined}
              tickCount={isEmpty ? 6 : undefined}
            />
            <Tooltip
              cursor={{ fill: "currentColor", opacity: 0.04, radius: 6 }}
              content={<CustomTooltip isEmpty={isEmpty} />}
            />
            <Bar dataKey="value" radius={[6, 6, 3, 3]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isEmpty
                      ? "#F3EDE6"
                      : entry.value === maxVal && maxVal > 0
                        ? "#4A1B1B"
                        : "#E2D0C0"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Empty state overlay */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md px-6 py-4 flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-800 shadow-sm">
              <BarChart2 className="w-7 h-7 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                {t("dashboard.salesTrends.noData", "No contracts yet")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Month legend dots */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-[#4A1B1B]" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            {t("dashboard.salesTrends.highest", "Highest")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-[#E2D0C0] dark:bg-gray-700" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            {t("dashboard.salesTrends.others", "Others")}
          </span>
        </div>
      </div>
    </div>
  );
}
