import { TopHeader } from '../components/TopHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { SalesTrendsChart } from '../components/Dashboard/SalesTrendsChart';
import { LatestTransactions } from '../components/Dashboard/LatestTransactions';
import { Shell } from '../components/shared/Shell';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import { 
  PlusSquare, 
   Home, 
  XCircle, 
  FileText
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useDashboardStats();
  const stats = response?.data;

  if (isLoading) {
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
        {/* General Overview Header */}
        <div className="bg-card p-8 rounded-md shadow-sm border border-border mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-2 font-medium">{t('dashboard.subtitle')}</p>
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
