import { useState } from 'react';
import { TopHeader } from '../components/TopHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { SalesTrendsChart } from '../components/Dashboard/SalesTrendsChart';
import { LatestTransactions } from '../components/Dashboard/LatestTransactions';
import { Shell } from '../components/shared/Shell';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import DatePicker from '@/components/shared/DatePicker';
import { 
  PlusSquare, 
  Home, 
  XCircle, 
  FileText,
  Filter,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('');

  // Extract startDate and endDate from the range string "YYYY-MM-DD to YYYY-MM-DD"
  let startDate = '';
  let endDate = '';
  if (dateRange && dateRange.includes(' to ')) {
    const parts = dateRange.split(' to ');
    startDate = parts[0];
    endDate = parts[1];
  }

  const { data: response, isLoading, isFetching } = useDashboardStats({ startDate, endDate });
  const stats = response?.data;

  if (isLoading && !response) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#B39371]/20 border-t-[#B39371] rounded-md animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-7xl mx-auto">
        {/* Creative General Overview Header with Integrated Date Filters */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8 relative overflow-hidden group">
          {/* Decorative premium ambient gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#4A1B1B]/10 transition-all duration-500 pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#B39371]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Top progress line indicating data refetch */}
          {isFetching && (
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#B39371] to-transparent animate-pulse z-20" />
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            {/* Title & Badge */}
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center border border-white/10">
                  <Filter className="w-8 h-8 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B39371] animate-pulse" />
                  <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                    {t('topHeader.overview') || 'Overview'}
                  </p>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t('dashboard.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>

            {/* Date Filters Controller */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/20 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800/80 backdrop-blur-sm self-start lg:self-center w-full lg:w-auto">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider px-1">
                <Calendar className="w-4 h-4 text-[#B39371]" />
                <span className="hidden sm:inline">{t('common.filters')}:</span>
              </div>

              <div className="w-full sm:w-[260px] relative">
                <DatePicker
                  value={dateRange}
                  onChange={setDateRange}
                  mode="range"
                  placeholder={t('common.dateRange')}
                />
              </div>

              {dateRange && (
                <button
                  onClick={() => setDateRange('')}
                  className="h-11 px-4 rounded-xl border border-dashed border-red-200 dark:border-red-800/30 text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <XCircle className="w-4 h-4" />
                  {t('common.clearAll')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label={t('dashboard.stats.totalProjects')} 
            value={stats?.totalProjects.toString() || "0"} 
            icon={PlusSquare}
          />
          <StatCard 
            label={t('dashboard.stats.totalContracts')} 
            value={stats?.totalContracts.toString() || "0"} 
            icon={FileText}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard 
            label={t('dashboard.stats.availableApartments')} 
            value={stats?.availableApartments.toString() || "0"} 
            icon={Home}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard 
            label={t('dashboard.stats.notAvailable')} 
            value={stats?.notAvailableApartments.toString() || "0"} 
            icon={XCircle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 gap-8">
          <SalesTrendsChart data={stats?.contractsPerMonth} />
          <LatestTransactions transactions={stats?.recentPayments} />
        </div>
      </div>
    </Shell>
  );
}
