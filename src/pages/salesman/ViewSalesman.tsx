import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { Link, useRoute } from "wouter";
import { 
  Users as UsersIcon,
  ArrowLeft,
  Mail,
  Phone,
  Pencil,
  Target,
  Wallet,
  Percent,
  Calendar,
  Clock,
  Briefcase,
  TrendingUp,
  FileText,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Shell } from '../../components/shared/Shell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Contract {
  id: number;
  type: string;
  contractDate: string;
  paidAmount: number;
  client: {
    id: number;
    fullName: string;
  };
  apartment: {
    id: number;
    mainName: {
      arabic: string;
      english: string;
    };
  };
}

interface Salesman {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  paymentType: string;
  startDate: string;
  endDate: string;
  commissionBase: string;
  commissionValue: number;
  completeTarget: boolean;
  apartmentTargetGoal: number | null;
  agentType: string;
  createdAt: string;
  updatedAt: string | null;
  createdById: number;
  createdBy?: {
    id: number;
    email: string;
  };
  contracts?: Contract[];
  contractsCount?: number;
  apartmentContractsCount?: number;
  totalContractValue?: number;
  totalCommission?: number;
}

interface SalesmanResponse {
  code: number;
  data: Salesman;
}

export default function ViewSalesman() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/salesman/:id");
  const id = params?.id;

  const { data: response, isLoading } = useQuery<SalesmanResponse>({
    queryKey: ['salesman', id],
    queryFn: async () => {
      const res = await api.get(`/salesman/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const salesman = response?.data;

  // Calculate stats if not provided by backend
  const contracts = salesman?.contracts || [];
  const contractsCount = salesman?.contractsCount ?? contracts.length;
  
  const uniqueApartments = new Set(contracts.map(c => c.apartment?.id).filter(Boolean));
  const apartmentContractsCount = salesman?.apartmentContractsCount ?? uniqueApartments.size;
  
  const totalContractValue = salesman?.totalContractValue ?? contracts.reduce((sum, c) => sum + (Number(c.paidAmount) || 0), 0);
  
  let calculatedCommission = 0;
  if (salesman) {
    if (salesman.commissionBase === 'FIXED') {
      calculatedCommission = contracts.length * salesman.commissionValue;
    } else {
      calculatedCommission = totalContractValue * (salesman.commissionValue / 100);
    }
  }
  const totalCommission = salesman?.totalCommission ?? calculatedCommission;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[#B39371]/10 rounded-md" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-md animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <UsersIcon className="w-8 h-8 text-[#B39371] animate-pulse" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!salesman) {
    return (
      <Shell>
        <TopHeader />
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('common.error')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('salesman.empty.description')}</p>
          <Link href="/salesman">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#4A1B1B] text-white rounded-md font-bold mx-auto hover:bg-[#6B2727] transition-all">
              <ArrowLeft className="w-5 h-5" /> {t('common.back')}
            </button>
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Breadcrumb Header */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/salesman" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all">
                <ArrowLeft className="w-5 h-5 text-gray-400 rtl:rotate-180" />
              </Link>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Link href="/salesman" className="hover:text-[#B39371] transition-colors">{t('salesman.title')}</Link>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-gray-500">{salesman.fullName}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('salesman.snapshot')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/salesman/${salesman.id}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-bold shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4 text-[#B39371]" />
                  {t('common.edit')}
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Main Info */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              
              {/* Profile Hero */}
              <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-md -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                
                <div className="p-10 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-2xl">
                    <AvatarFallback className="bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] text-white text-3xl font-black">
                      {salesman.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left rtl:md:text-right space-y-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                          {salesman.fullName}
                        </h2>
                        <Badge className={cn(
                          "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          salesman.agentType === 'INTERNAL' 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                            : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        )}>
                          {salesman.agentType === 'INTERNAL' ? t('salesman.types.internal') : t('salesman.types.external')}
                        </Badge>
                      </div>
                      <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4 text-[#B39371]" />
                        {salesman.email}
                      </p>
                      <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Phone className="w-4 h-4 text-[#B39371]" />
                        {salesman.phoneNumber}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('salesman.paymentType')}</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {t(`salesman.payments.${salesman.paymentType.toLowerCase()}`)}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('salesman.status')}</p>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-md animate-pulse",
                            new Date(salesman.endDate) > new Date() ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                          <p className={cn(
                            "text-xs font-bold",
                            new Date(salesman.endDate) > new Date() ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {new Date(salesman.endDate) > new Date() ? t('common.active') : t('common.inactive')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Performance Card */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-md text-indigo-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('salesman.performance')}</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center text-[#B39371] shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-500">{t('salesman.stats.totalContracts')}</span>
                      </div>
                      <span className="text-lg font-black text-gray-900 dark:text-white">{contractsCount}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center text-[#B39371] shadow-sm">
                          <Building className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-500">{t('salesman.stats.totalApartmentContracts')}</span>
                      </div>
                      <span className="text-lg font-black text-gray-900 dark:text-white">{apartmentContractsCount}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-md border border-emerald-100 dark:border-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-600 shadow-sm">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-emerald-700/70">{t('salesman.stats.totalContractValue')}</span>
                      </div>
                      <span className="text-lg font-black text-emerald-700">
                        {totalContractValue.toLocaleString()} <span className="text-[10px] uppercase">{t('common.sar')}</span>
                      </span>
                    </div>
                  </div>
                </motion.section>

                {/* Commission Card */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-md text-amber-600">
                      <Percent className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('salesman.commissionDetails')}</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('salesman.commissionBase')}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {t(`salesman.bases.${salesman.commissionBase.toLowerCase()}`)}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('salesman.commissionValue')}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {salesman.commissionValue}{salesman.commissionBase === 'PERCENTAGE' ? '%' : ' ' + t('common.sar')}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-[#4A1B1B]/5 dark:bg-[#4A1B1B]/10 rounded-md border border-[#4A1B1B]/10 text-center">
                      <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em] mb-2">{t('salesman.stats.totalCommission')}</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">{totalCommission.toLocaleString()}</span>
                        <span className="text-xs font-bold text-[#B39371] uppercase">{t('common.sar')}</span>
                      </div>
                    </div>

                    {salesman.completeTarget && (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-md border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-700">{t('salesman.targetGoal')}</span>
                        </div>
                        <span className="text-sm font-black text-indigo-700">{salesman.apartmentTargetGoal} {t('common.units')}</span>
                      </div>
                    )}
                  </div>
                </motion.section>
              </div>

             
            </div>

            {/* Right Column - Timeline & System Info */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              
              {/* Employment Dates */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-md text-rose-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('salesman.employmentInfo')}</h3>
                </div>

                <div className="space-y-6 relative before:absolute before:left-6 rtl:before:left-auto rtl:before:right-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 dark:before:bg-gray-800">
                  <div className="relative pl-12 rtl:pl-0 rtl:pr-12">
                    <div className="absolute left-[21px] rtl:left-auto rtl:right-[21px] top-1 w-2 h-2 rounded-md bg-[#B39371] shadow-lg shadow-[#B39371]/40" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('salesman.startDate')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(salesman.startDate)}</p>
                  </div>

                  <div className="relative pl-12 rtl:pl-0 rtl:pr-12">
                    <div className="absolute left-[21px] rtl:left-auto rtl:right-[21px] top-1 w-2 h-2 rounded-md bg-rose-400 shadow-lg shadow-rose-400/40" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('salesman.endDate')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(salesman.endDate)}</p>
                  </div>
                </div>
              </section>

              {/* System Metadata */}
              <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-md border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#B39371]" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('common.updated_at')}</h4>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('common.details')}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">{t('legality.labels.createdAt')}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{formatDate(salesman.createdAt)}</span>
                    </div>
                    {salesman.createdBy && (
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-gray-800">
                        <span className="text-[9px] font-medium text-gray-400 italic">{t('common.by')}</span>
                        <span className="text-[9px] font-bold text-[#B39371]">{salesman.createdBy.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Quick Actions / Link */}
              <div className="bg-[#4A1B1B] p-8 rounded-md shadow-2xl shadow-[#4A1B1B]/20 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-md blur-3xl" />
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#B39371]" />
                  {t('salesman.quickView')}
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <Link href={`/contracts?salesmanId=${salesman.id}`}>
                    <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 group cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#B39371]" />
                        <span className="text-xs font-bold">{t('salesman.viewContracts')}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
           {/* Contracts List */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-md text-emerald-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('contracts.title')}</h3>
                      <p className="text-[10px] text-gray-400 font-medium">{t('salesman.contractStats')}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-md">{contracts.length}</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-8 py-4 text-left rtl:text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('contracts.labels.client')}</th>
                        <th className="px-8 py-4 text-left rtl:text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('contracts.labels.apartment')}</th>
                        <th className="px-8 py-4 text-left rtl:text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('contracts.labels.contractDate')}</th>
                        <th className="px-8 py-4 text-right rtl:text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('contracts.labels.paidAmount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {contracts.length > 0 ? contracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-[#B39371] transition-colors">
                                <UsersIcon className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{contract.client?.fullName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <Building className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {i18n.language === 'ar' ? contract.apartment?.mainName?.arabic : contract.apartment?.mainName?.english}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                            {formatDate(contract.contractDate)}
                          </td>
                          <td className="px-8 py-5 text-right rtl:text-left">
                            <span className="text-sm font-black text-[#4A1B1B] dark:text-[#B39371]">
                              {contract.paidAmount.toLocaleString()} <span className="text-[10px] font-bold opacity-60 uppercase">{t('common.sar')}</span>
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="w-8 h-8 text-gray-200" />
                              <p className="text-xs font-bold text-gray-400">{t('contracts.empty.title')}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.section>
        </div>
      </div>
    </Shell>
  );
}
