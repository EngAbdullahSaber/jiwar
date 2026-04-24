 import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Award,
  FileText,
  Building2,
  RefreshCw
} from 'lucide-react';
import { Shell } from '../../components/shared/Shell';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
 } from 'recharts';
import { DataTable } from '../../components/shared/DataTable';
import type { Column } from '../../components/shared/DataTable';
import { Button } from '@/components/ui/button';

interface SalesmanStat {
  id: number;
  fullName: string;
  totalContractValue: number;
  totalPaidAmount: number;
}

interface TopSalesman {
  id: number;
  fullName: string;
  totalContractValue: number;
}

interface TopContract {
  id: number;
  type: string;
  contractValue: number;
  apartmentName: {
    arabic: string;
    english: string;
  };
  projectName: {
    arabic: string;
    english: string;
  };
}

interface FinanceStatsResponse {
  code: number;
  data: {
    salesmanStats: SalesmanStat[];
    top5Salesmen: TopSalesman[];
    top3Contracts: TopContract[];
  };
}

export default function FinanceDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { data, isLoading, refetch } = useQuery<FinanceStatsResponse>({
    queryKey: ['finance-statistics'],
    queryFn: async () => {
      const response = await api.get('/salesman/statistics');
      return response.data;
    }
  });

  const stats = data?.data;

  const totalSales = stats?.salesmanStats.reduce((acc, curr) => acc + curr.totalContractValue, 0) || 0;
  const totalPaid = stats?.salesmanStats.reduce((acc, curr) => acc + curr.totalPaidAmount, 0) || 0;
  const collectionRate = totalSales > 0 ? (totalPaid / totalSales) * 100 : 0;

  const summaryCards = [
    {
      label: t('financeDashboard.stats.totalSales'),
      value: `${totalSales.toLocaleString()} ${t('common.sar')}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: '+12.5%',
      trendUp: true
    },
    {
      label: t('financeDashboard.stats.totalPaid'),
      value: `${totalPaid.toLocaleString()} ${t('common.sar')}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      trend: `${collectionRate.toFixed(1)}%`,
      trendUp: true
    },
    {
      label: t('financeDashboard.stats.totalSalesmen'),
      value: stats?.salesmanStats.length || 0,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      trend: 'Active Now',
      trendUp: true
    },
    {
      label: t('financeDashboard.stats.avgSales'),
      value: `${((stats?.salesmanStats.length || 0) > 0 ? totalSales / (stats?.salesmanStats.length || 1) : 0).toLocaleString()} ${t('common.sar')}`,
      icon: BarChart3,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      trend: 'Per Member',
      trendUp: true
    }
  ];

  const columns: Column<SalesmanStat>[] = [
    {
      header: t('financeDashboard.salesmenTable.fullName'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {row.fullName.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{row.fullName}</span>
        </div>
      )
    },
    {
      header: t('financeDashboard.salesmenTable.totalSales'),
      cell: (row) => (
        <span className="font-medium">{row.totalContractValue.toLocaleString()} {t('common.sar')}</span>
      )
    },
    {
      header: t('financeDashboard.salesmenTable.totalPaid'),
      cell: (row) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {row.totalPaidAmount.toLocaleString()} {t('common.sar')}
        </span>
      )
    },
    {
      header: t('financeDashboard.salesmenTable.collected'),
      cell: (row) => {
        const rate = row.totalContractValue > 0 ? (row.totalPaidAmount / row.totalContractValue) * 100 : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  rate > 70 ? "bg-emerald-500" : rate > 30 ? "bg-amber-500" : "bg-rose-500"
                )}
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500">{rate.toFixed(0)}%</span>
          </div>
        );
      }
    }
  ];

  const chartData = stats?.top5Salesmen.map(s => ({
    name: s.fullName,
    value: s.totalContractValue
  })) || [];

  const COLORS = ['#4A1B1B', '#6B2727', '#8B3A3A', '#B39371', '#D4A574'];

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#4A1B1B]/10 transition-all duration-500" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center border border-white/10">
                    <PieChartIcon className="w-8 h-8 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B39371]" />
                    <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                      {t('financeDashboard.title')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {t('financeDashboard.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                    {t('financeDashboard.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm shadow-sm"
                  onClick={() => refetch()}
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2", isLoading && "animate-spin")} />
                  {t('common.refresh')}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className={cn("p-3 rounded-xl transition-colors", card.bg)}>
                    <card.icon className={cn("w-6 h-6", card.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                    card.trendUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                  )}>
                    {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend}
                  </div>
                </div>
                <div className="mt-4 relative z-10">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <card.icon className="w-24 h-24" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Salesmen Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('financeDashboard.charts.topSalesmen')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {t('financeDashboard.charts.salesVsPaid')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#B39371]" />
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 rounded-xl shadow-xl">
                              <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">{payload[0].payload.name}</p>
                              <p className="text-sm font-extrabold text-[#B39371]">
                                {payload[0].value?.toLocaleString()} {t('common.sar')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Contracts */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('financeDashboard.topContracts.title')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {t('financeDashboard.topContracts.subtitle')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#B39371]" />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {stats?.top3Contracts.map((contract, i) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#4A1B1B]/5 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#4A1B1B]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#B39371] transition-colors">
                            {isRtl ? contract.apartmentName.arabic : contract.apartmentName.english}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            <p className="text-[10px] text-gray-500 font-medium">
                              {isRtl ? contract.projectName.arabic : contract.projectName.english}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#4A1B1B] dark:text-[#D4A574]">
                        #{i + 1}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {t('financeDashboard.topContracts.contractValue')}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {contract.contractValue.toLocaleString()} {t('common.sar')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('financeDashboard.salesmenTable.title')}
              </h3>
            </div>
            <DataTable 
              columns={columns} 
              data={stats?.salesmanStats || []}
              isLoading={isLoading}
              loadingMessage={t('common.loading')}
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}
