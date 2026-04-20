import { 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface SalesTrendsChartProps {
  data?: {
    month: string;
    count: number;
  }[];
}

const colors = ['#A88686', '#8E6B6B', '#A88686', '#A88686', '#A88686', '#4A1B1B'];

export function SalesTrendsChart({ data: rawData }: SalesTrendsChartProps) {
  const { t } = useTranslation();
  const chartData = rawData?.map(item => {
    try {
      const date = parseISO(`${item.month}-01`);
      return {
        name: format(date, 'MMM').toUpperCase(),
        value: item.count
      };
    } catch {
      return {
        name: item.month,
        value: item.count
      };
    }
  }) || [];

  return (
    <div className="bg-card p-8 rounded-md shadow-sm border border-border h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t('dashboard.salesTrends.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('dashboard.salesTrends.subtitle')}</p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-md text-sm font-medium text-muted-foreground border border-border">
          {t('dashboard.salesTrends.last6Months')}
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="text-border" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
              className="text-muted-foreground"
              dy={15}
            />
            <Tooltip 
              cursor={{ fill: 'currentColor', opacity: 0.1 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card p-3 shadow-xl rounded-md border border-border">
                      <p className="text-sm font-bold text-foreground">{payload[0].value} {t('dashboard.salesTrends.contracts')}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={90}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
