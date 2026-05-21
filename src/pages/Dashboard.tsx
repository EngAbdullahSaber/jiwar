import { useState } from 'react';
import { TopHeader } from '../components/TopHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { SalesTrendsChart } from '../components/Dashboard/SalesTrendsChart';
import { LatestTransactions } from '../components/Dashboard/LatestTransactions';
import { Shell } from '../components/shared/Shell';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useRedux';
import DatePicker from '@/components/shared/DatePicker';
import {
  PlusSquare,
  Home,
  XCircle,
  FileText,
  Calendar,
  LayoutDashboard,
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state: any) => state.auth);
  const [dateRange, setDateRange] = useState('');

  let startDate = '';
  let endDate = '';
  if (dateRange?.includes(' to ')) {
    [startDate, endDate] = dateRange.split(' to ');
  }

  const { data: response, isLoading, isFetching } = useDashboardStats({ startDate, endDate });
  const stats = response?.data;

  if (isLoading && !response) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-[#B39371]/20 border-t-[#B39371] rounded-md animate-spin" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning', 'Good morning');
    if (hour < 17) return t('dashboard.goodAfternoon', 'Good afternoon');
    return t('dashboard.goodEvening', 'Good evening');
  };

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Fetching indicator */}
        {isFetching && (
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#B39371] to-transparent animate-pulse" />
        )}

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* ── Hero Header ── */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative hidden sm:block shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A1B1B] to-[#B39371] rounded-md blur-xl opacity-25" />
                <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-7 h-7 text-[#B39371]" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#B39371] uppercase tracking-widest mb-0.5">
                  {greeting()}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {user?.email?.split('@')[0] || t('dashboard.title')}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>

            {/* Date range filter */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                <Calendar className="w-4 h-4 text-[#B39371]" />
                <span className="hidden sm:inline">{t('common.filters')}:</span>
              </div>
              <div className="w-[240px]">
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-dashed border-red-200 dark:border-red-800/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs font-semibold"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {t('common.clearAll')}
                </button>
              )}
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label={t('dashboard.stats.totalProjects')}
              value={stats?.totalProjects?.toString() ?? '0'}
              icon={PlusSquare}
              iconBg="bg-[#F5F1ED] dark:bg-gray-800"
              iconColor="text-[#4A1B1B] dark:text-[#B39371]"
              accent="bg-[#B39371]"
            />
            <StatCard
              label={t('dashboard.stats.totalContracts')}
              value={stats?.totalContracts?.toString() ?? '0'}
              icon={FileText}
              iconBg="bg-sky-50 dark:bg-sky-900/20"
              iconColor="text-sky-600 dark:text-sky-400"
              accent="bg-sky-400"
            />
            <StatCard
              label={t('dashboard.stats.availableApartments')}
              value={stats?.availableApartments?.toString() ?? '0'}
              icon={Home}
              iconBg="bg-emerald-50 dark:bg-emerald-900/20"
              iconColor="text-emerald-600 dark:text-emerald-400"
              accent="bg-emerald-400"
            />
            <StatCard
              label={t('dashboard.stats.notAvailable')}
              value={stats?.notAvailableApartments?.toString() ?? '0'}
              icon={XCircle}
              iconBg="bg-rose-50 dark:bg-rose-900/20"
              iconColor="text-rose-600 dark:text-rose-400"
              accent="bg-rose-400"
            />
          </div>

          {/* ── Chart + Transactions ── */}
          <SalesTrendsChart data={stats?.contractsPerMonth} />
          <LatestTransactions transactions={stats?.recentPayments} />

        </div>
      </div>
    </Shell>
  );
}
