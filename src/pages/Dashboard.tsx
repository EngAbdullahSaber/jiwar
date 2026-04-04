import { TopHeader } from '../components/TopHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { SalesTrendsChart } from '../components/Dashboard/SalesTrendsChart';
import { LatestTransactions } from '../components/Dashboard/LatestTransactions';
import { Shell } from '../components/shared/Shell';
import { 
  PlusSquare, 
  TrendingUp, 
  Home, 
  Tag, 
  Bell,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-7xl mx-auto">
        {/* General Overview Header */}
        <div className="bg-card p-8 rounded-[32px] shadow-sm border border-border mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">General Overview</h1>
            <p className="text-muted-foreground mt-2 font-medium">Welcome back, here's what's happening in your system.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Sort by: Date</p>
              <div className="flex items-center gap-3 bg-muted px-4 py-2.5 rounded-xl border border-border cursor-pointer hover:bg-card transition-colors">
                <span className="text-sm font-bold text-muted-foreground">DD/MM/YYYY</span>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard 
            label="Total Projects" 
            value="24" 
            change="+12%" 
            icon={PlusSquare}
          />
          <StatCard 
            label="Total Sales (SAR)" 
            value="14.2M" 
            change="+8.4%" 
            icon={TrendingUp}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard 
            label="Remaining Apartments" 
            value="112" 
            icon={Home}
            iconBg="bg-red-50"
            iconColor="text-red-900"
          />
          <StatCard 
            label="Total Discounts" 
            value="18" 
            icon={Tag}
            iconBg="bg-red-950"
            iconColor="text-white"
          />
          <StatCard 
            label="Notifications" 
            value="22" 
            icon={Bell}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 gap-8">
          <SalesTrendsChart />
          <LatestTransactions />
        </div>
      </div>
    </Shell>
  );
}
