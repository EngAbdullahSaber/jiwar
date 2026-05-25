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
  Target,
  Banknote,
  Loader2,
} from 'lucide-react';
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { Can } from '../../components/shared/Can';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { DeleteDialog } from '../../components/shared/DeleteDialog';
import { useToast } from "@/hooks/use-toast";
import { toast } from 'react-hot-toast';
import DatePicker from '../../components/shared/DatePicker';

interface Salesman {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  agentType: string;
  startDate: string;
  endDate: string;
  roleId: number | null;
  role: { id: number; name: string; description: string } | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: { id: number; email: string };
  updatedBy: { id: number; email: string } | null;
  contractsCount: number;
  apartmentContractsCount: number;
  totalContractValue: number;
  totalPaidAmount: number;
  totalCommission: number;
  totalPaidToSalesman: number;
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
  const { toast: shadToast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', agentType: 'all' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [salesmanToDelete, setSalesmanToDelete] = useState<number | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(null);
  const [payForm, setPayForm] = useState({ paidDate: '', amount: '', notes: '' });
  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery<SalesmanResponse>({
    queryKey: ['salesmen', currentPage, filters.search, filters.agentType],
    queryFn: async () => {
      const response = await api.get('/salesman', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: filters.search || undefined,
          agentType: filters.agentType !== 'all' ? filters.agentType : undefined,
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
      shadToast({
        title: t('common.success'),
        description: t('salesman.deleteSuccess'),
        variant: 'default',
      });
      refetch();
      setIsDeleteDialogOpen(false);
      setSalesmanToDelete(null);
    },
    onError: () => {
      shadToast({
        title: t('common.error'),
        description: t('salesman.deleteError'),
        variant: 'destructive',
      });
    }
  });

  const payMutation = useMutation({
    mutationFn: async (payload: { salesManId: number; paidDate: string; amount: number; notes: string }) => {
      await api.post('/salesman-paid-log', payload);
    },
    onSuccess: () => {
      toast.success(t('salesman.payBalance.success'));
      queryClient.invalidateQueries({ queryKey: ['salesmen'] });
      setPayDialogOpen(false);
      setSelectedSalesman(null);
      setPayForm({ paidDate: '', amount: '', notes: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('salesman.payBalance.error'));
    },
  });

  const handlePaySubmit = () => {
    const amount = parseFloat(payForm.amount);
    const balance = selectedSalesman ? selectedSalesman.totalCommission - selectedSalesman.totalPaidToSalesman : 0;
    if (!payForm.paidDate) {
      toast.error(t('salesman.payBalance.dateRequired'));
      return;
    }
    if (!payForm.amount || isNaN(amount) || amount <= 0) {
      toast.error(t('salesman.payBalance.amountRequired'));
      return;
    }
    if (amount > balance) {
      toast.error(t('salesman.payBalance.exceedsBalance'));
      return;
    }
    payMutation.mutate({ salesManId: selectedSalesman!.id, paidDate: payForm.paidDate, amount, notes: payForm.notes });
  };

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
            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border shadow-sm transition-all",
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
      header: t('salesman.stats.totalCommission'),
      cell: (salesman) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {salesman.totalCommission.toLocaleString()}
            <span className="text-[10px] text-gray-400 ml-1">{t('common.sar')}</span>
          </span>
          <span className="text-[10px] text-gray-400">
            {t('salesman.stats.totalContracts')}: {salesman.contractsCount}
          </span>
        </div>
      )
    },
    {
      header: t('salesman.stats.balance'),
      cell: (salesman) => {
        const balance = salesman.totalCommission - salesman.totalPaidToSalesman;
        return (
          <div className="flex flex-col gap-0.5">
            <span className={cn(
              "text-sm font-bold",
              balance > 0 ? "text-amber-600" : "text-gray-400"
            )}>
              {balance.toLocaleString()}
              <span className="text-[10px] ml-1">{t('common.sar')}</span>
            </span>
            <span className="text-[10px] text-gray-400">
              {t('salesman.stats.totalPaid')}: {salesman.totalPaidToSalesman.toLocaleString()}
            </span>
          </div>
        );
      }
    },
    {
      header: t('salesman.status'),
      cell: (salesman) => {
        const isActive = new Date(salesman.endDate) > new Date();
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-md",
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
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
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
                <DropdownMenuItem className="rounded-md cursor-pointer py-2 px-3 focus:bg-gray-50 dark:focus:bg-gray-800">
                  <UsersIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
                  <span className="text-xs font-medium">{t('common.details')}</span>
                </DropdownMenuItem>
              </Link>
            </Can>
            <Can I="UPDATE" a="salesman">
              <Link href={`/salesman/${salesman.id}/edit`}>
                <DropdownMenuItem className="rounded-md cursor-pointer py-2 px-3 focus:bg-gray-50 dark:focus:bg-gray-800">
                  <Edit className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
                  <span className="text-xs font-medium">{t('common.edit')}</span>
                </DropdownMenuItem>
              </Link>
            </Can>
            <Can I="UPDATE" a="salesman">
              <DropdownMenuItem
                className="rounded-md cursor-pointer py-2 px-3 focus:bg-emerald-50 dark:focus:bg-emerald-900/10 text-emerald-600"
                onClick={() => {
                  setSelectedSalesman(salesman);
                  setPayForm({ paidDate: '', amount: '', notes: '' });
                  setPayDialogOpen(true);
                }}
              >
                <Banknote className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span className="text-xs font-medium">{t('salesman.payBalance.button')}</span>
              </DropdownMenuItem>
            </Can>
            <Can I="DELETE" a="salesman">
              <DropdownMenuItem 
                className="rounded-md cursor-pointer py-2 px-3 focus:bg-rose-50 dark:focus:bg-rose-900/10 text-rose-600"
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-md -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#4A1B1B]/10 transition-all duration-500" />
            
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
                    <div className="w-1.5 h-1.5 rounded-md bg-[#B39371]" />
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
                className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-md transition-colors", stat.bg)}>
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
              onReset={() => setFilters({ search: '', agentType: 'all' })}
            />

            <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
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
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-16 text-center shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#4A1B1B] to-transparent opacity-20" />
              <div className="w-24 h-24 rounded-md bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-gray-800">
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
                  <button className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-bold shadow-xl shadow-[#4A1B1B]/20 hover:shadow-2xl transition-all border border-white/10">
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

      {/* Pay Balance Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={(open) => !open && setPayDialogOpen(false)}>
        <DialogContent
          className="sm:max-w-[440px] rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Banknote className="w-5 h-5" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('salesman.payBalance.title')}
                </DialogTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {selectedSalesman?.fullName}
                </p>
              </DialogHeader>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Balance summary */}
            {selectedSalesman && (() => {
              const balance = selectedSalesman.totalCommission - selectedSalesman.totalPaidToSalesman;
              return (
                <div className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-md border",
                  balance > 0
                    ? "bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                )}>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    balance > 0 ? "text-amber-700 dark:text-amber-400" : "text-gray-500"
                  )}>
                    {t('salesman.stats.balance')}
                  </span>
                  <span className={cn(
                    "text-base font-black",
                    balance > 0 ? "text-amber-700 dark:text-amber-400" : "text-gray-400"
                  )}>
                    {balance.toLocaleString()}
                    <span className="text-[10px] font-bold ml-1 uppercase">{t('common.sar')}</span>
                  </span>
                </div>
              );
            })()}

            {/* Payment Date */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('salesman.payBalance.date')}
              </Label>
              <DatePicker
                value={payForm.paidDate}
                onChange={(date) => setPayForm(prev => ({ ...prev, paidDate: date }))}
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('salesman.payBalance.amount')}
                </Label>
                {selectedSalesman && (() => {
                  const balance = selectedSalesman.totalCommission - selectedSalesman.totalPaidToSalesman;
                  const entered = parseFloat(payForm.amount);
                  const exceeds = !isNaN(entered) && entered > balance;
                  return exceeds ? (
                    <span className="text-[10px] font-bold text-rose-500">{t('salesman.payBalance.exceedsBalance')}</span>
                  ) : null;
                })()}
              </div>
              <div className="relative">
                <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold pointer-events-none">
                  {t('common.sar')}
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedSalesman ? selectedSalesman.totalCommission - selectedSalesman.totalPaidToSalesman : undefined}
                  placeholder="0.00"
                  className={cn(
                    "h-11 pl-12 rtl:pl-4 rtl:pr-12 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium",
                    selectedSalesman && parseFloat(payForm.amount) > (selectedSalesman.totalCommission - selectedSalesman.totalPaidToSalesman)
                      ? "border-rose-400 dark:border-rose-500 focus:border-rose-400"
                      : ""
                  )}
                  value={payForm.amount}
                  onChange={(e) => setPayForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('salesman.payBalance.notes')}
                <span className="ml-1 text-gray-400 normal-case font-normal">({t('common.optional')})</span>
              </Label>
              <Input
                type="text"
                placeholder={t('salesman.payBalance.notesPlaceholder')}
                className="h-11 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                value={payForm.notes}
                onChange={(e) => setPayForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 gap-3">
            <Button
              variant="ghost"
              onClick={() => setPayDialogOpen(false)}
              disabled={payMutation.isPending}
              className="rounded-md font-semibold"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handlePaySubmit}
              disabled={payMutation.isPending}
              className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg min-w-[140px]"
            >
              {payMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('common.processing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  {t('salesman.payBalance.pay')}
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
