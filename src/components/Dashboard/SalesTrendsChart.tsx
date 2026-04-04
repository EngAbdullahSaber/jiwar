import { 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'JAN', value: 30 },
  { name: 'FEB', value: 45 },
  { name: 'MAR', value: 35 },
  { name: 'APR', value: 55 },
  { name: 'MAY', value: 65 },
  { name: 'JUN', value: 80 },
];

const colors = ['#A88686', '#8E6B6B', '#A88686', '#A88686', '#A88686', '#4A1B1B'];

export function SalesTrendsChart() {
  return (
    <div className="bg-card p-8 rounded-[32px] shadow-sm border border-border h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">Sales Trends</h2>
          <p className="text-sm text-muted-foreground mt-1">Monthly performance analytics for 2024</p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground border border-border">
          Last 6 Months
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
                    <div className="bg-card p-3 shadow-xl rounded-xl border border-border">
                      <p className="text-sm font-bold text-foreground">{payload[0].value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={90}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
