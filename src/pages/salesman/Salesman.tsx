import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { 
  Users as UsersIcon,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Percent,
  Wallet,
  Target
} from 'lucide-react';
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { Can } from '../../components/shared/Can';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from '../../components/shared/DataTable';
import type { Column } from '../../components/shared/DataTable';
import { FilterBar } from '../../components/shared/FilterBar';
import type { FilterField } from '../../components/shared/FilterBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from '@tanstack/react-query';
import { DeleteDialog } from '../../components/shared/DeleteDialog';
import { useToast } from "@/hooks/use-toast";

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
  createdBy: {
    id: number;
    email: string;
  };
  contractsCount: number;
  apartmentContractsCount: number;
  totalContractValue: number;
  totalPaidAmount: number;
  totalCommission: number;
}

interface SalesmanStatics {
  totalContracts: number;
  totalApartmentContracts: number;
  totalContractValue: number;
  totalCommission: number;
  mostSalesman: any;
}

interface SalesmanResponse {
  code: number;
  data: {
    salesmen: Salesman[];
    statics: SalesmanStatics;
  };
  totalItems: number;
  totalPages: number;
}

export default function SalesmanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [filters, setFilters] = useState({ search: '', agentType: 'all', paymentType: 'all' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [salesmanToDelete, setSalesmanToDelete] = useState<number | null>(null);
  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery<SalesmanResponse>({
    queryKey: ['salesmen', currentPage, filters.search, filters.agentType, filters.paymentType],
    queryFn: async () => {
      const response = await api.get('/salesman', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: filters.search || undefined,
          agentType: filters.agentType !== 'all' ? filters.agentType : undefined,
          paymentType: filters.paymentType !== 'all' ? filters.paymentType : undefined
        }
      });
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/salesman/${id}`);
    },
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('salesman.deleteSuccess'),
        variant: 'default',
      });
      refetch();
      setIsDeleteDialogOpen(false);
      setSalesmanToDelete(null);
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('salesman.deleteError'),
        variant: 'destructive',
      });
    }
  });

  const handleDelete = (id: number) => {
    setSalesmanToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (salesmanToDelete) {
      deleteMutation.mutate(salesmanToDelete);
    }
  };

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('salesman.fullName'),
      placeholder: t('common.search'),
      key: 'search'
    },
    {
      type: 'select',
      label: t('salesman.agentType'),
      placeholder: t('salesman.agentType'),
      key: 'agentType',
      options: [
        { value: 'all', label: t('common.all') },
        { value: 'INTERNAL', label: t('salesman.types.internal') },
        { value: 'EXTERNAL', label: t('salesman.types.external') }
      ]
    },
    {
      type: 'select',
      label: t('salesman.paymentType'),
      placeholder: t('salesman.paymentType'),
      key: 'paymentType',
      options: [
        { value: 'all', label: t('common.all') },
        { value: 'CASH', label: t('salesman.payments.cash') },
        { value: 'INSTALLMENT', label: t('salesman.payments.installment') },
        { value: 'COMMISSION', label: t('salesman.payments.commission') }
      ]
    }
  ];

  const columns: Column<Salesman>[] = [
    {
      header: t('salesman.fullName'),
      cell: (salesman) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] text-white text-xs font-bold">
              {salesman.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {salesman.fullName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Mail className="w-3 h-3" />
              {salesman.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('salesman.phoneNumber'),
      cell: (salesman) => (
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Phone className="w-3.5 h-3.5" />
          {salesman.phoneNumber}
        </div>
      )
    },
    {
      header: t('salesman.agentType'),
      cell: (salesman) => (
        <Badge 
          variant="outline"
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shadow-sm transition-all",
            salesman.agentType === 'INTERNAL' 
              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
          )}
        >
          {salesman.agentType === 'INTERNAL' ? t('salesman.types.internal') : t('salesman.types.external')}
        </Badge>
      )
    },
    {
      header: t('salesman.commissionValue'),
      cell: (salesman) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
            {salesman.commissionBase === 'PERCENTAGE' ? (
              <Percent className="w-3.5 h-3.5 text-[#B39371]" />
            ) : (
              <Wallet className="w-3.5 h-3.5 text-[#B39371]" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {salesman.commissionValue}
              <span className="text-[10px] text-gray-400 ml-1">
              {salesman.commissionBase === 'PERCENTAGE' ? '%' : t('common.sar')}
            </span>
            </p>
          </div>
        </div>
      )
    },
    {
      header: t('salesman.targetGoal'),
      cell: (salesman) => (
        <div className="space-y-1.5 min-w-[120px]">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <Target className="w-3 h-3" />
              {t('salesman.targetGoal')}
            </span>
            <span className={cn(
              "font-bold",
              salesman.completeTarget ? "text-emerald-500" : "text-amber-500"
            )}>
              {salesman.apartmentTargetGoal} {t('common.units')}
            </span>
          </div>
         
        </div>
      )
    },
    {
      header: t('salesman.status'),
      cell: (salesman) => {
        const isActive = new Date(salesman.endDate) > new Date();
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isActive ? "text-emerald-600" : "text-rose-600"
            )}>
              {isActive ? t('common.active') : t('common.inactive')}
            </span>
          </div>
        );
      }
    },
    {
      header: t('common.actions'),
      headerClassName: "text-right rtl:text-left",
      className: "text-right rtl:text-left",
      cell: (salesman) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-md border-gray-200 dark:border-gray-800 shadow-xl p-1">
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t('salesman.actions')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
            <Can I="READ" a="salesman">
              <Link href={`/salesman/${salesman.id}`}>
                <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-3 focus:bg-gray-50 dark:focus:bg-gray-800">
                  <UsersIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
                  <span className="text-xs font-medium">{t('common.details')}</span>
                </DropdownMenuItem>
              </Link>
            </Can>
            <Can I="UPDATE" a="salesman">
              <Link href={`/salesman/${salesman.id}/edit`}>
                <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-3 focus:bg-gray-50 dark:focus:bg-gray-800">
                  <Edit className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
                  <span className="text-xs font-medium">{t('common.edit')}</span>
                </DropdownMenuItem>
              </Link>
            </Can>
            <Can I="DELETE" a="salesman">
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer py-2 px-3 focus:bg-rose-50 dark:focus:bg-rose-900/10 text-rose-600"
                onClick={() => handleDelete(salesman.id)}
              >
                <Trash2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span className="text-xs font-medium">{t('common.delete')}</span>
              </DropdownMenuItem>
            </Can>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-8 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#4A1B1B]/10 transition-all duration-500" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-16 h-16 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center border border-white/10">
                    <UsersIcon className="w-8 h-8 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B39371]" />
                    <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                      {t('salesman.title')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {t('salesman.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                    {t('salesman.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-md border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm shadow-sm"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 group-hover:rotate-180 transition-transform duration-500" />
                  {t('common.refresh')}
                </Button>
                
                <Can I="CREATE" a="salesman">
                  <Link href="/salesman/new">
                    <motion.button
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-bold shadow-xl shadow-[#4A1B1B]/20 hover:shadow-2xl hover:shadow-[#4A1B1B]/30 transition-all border border-white/10"
                    >
                      <Plus className="w-5 h-5" />
                      {t('salesman.create')}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: t('salesman.stats.totalContracts'), 
                value: data?.data?.statics?.totalContracts || 0, 
                icon: Wallet,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-500/10'
              },
              { 
                label: t('salesman.stats.totalApartmentContracts'), 
                value: data?.data?.statics?.totalApartmentContracts || 0, 
                icon: Target,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10'
              },
              { 
                label: t('salesman.stats.totalContractValue'), 
                value: `${(data?.data?.statics?.totalContractValue || 0).toLocaleString()} SAR`, 
                icon: UsersIcon,
                color: 'text-amber-600',
                bg: 'bg-amber-50 dark:bg-amber-500/10'
              },
              { 
                label: t('salesman.stats.totalCommission'), 
                value: `${(data?.data?.statics?.totalCommission || 0).toLocaleString()} SAR`, 
                icon: Percent,
                color: 'text-rose-600',
                bg: 'bg-rose-50 dark:bg-rose-500/10'
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <FilterBar 
              fields={filterFields} 
              values={filters} 
              onChange={(key, value) => {
                setFilters(prev => ({ ...prev, [key]: value }));
                setCurrentPage(1);
              }} 
              onReset={() => setFilters({ search: '', agentType: 'all', paymentType: 'all' })}
            />

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <DataTable 
                columns={columns} 
                data={data?.data?.salesmen || []}
                isLoading={isLoading}
                loadingMessage={t('salesman.loading')}
                currentPage={currentPage}
                totalPages={data?.totalPages}
                totalItems={data?.totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          {/* Empty State */}
          {!isLoading && (!data?.data?.salesmen || data.data.salesmen.length === 0) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-16 text-center shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#4A1B1B] to-transparent opacity-20" />
              <div className="w-24 h-24 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-gray-800">
                <UsersIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('salesman.empty.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                {filters.search 
                  ? t('salesman.empty.description')
                  : t('salesman.empty.createDescription')}
              </p>
              {!filters.search && (
                <Link href="/salesman/new">
                  <button className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-bold shadow-xl shadow-[#4A1B1B]/20 hover:shadow-2xl transition-all border border-white/10">
                    <Plus className="w-5 h-5" />
                    {t('salesman.create')}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </Shell>
  );
}
