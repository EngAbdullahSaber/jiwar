import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { 
  MoreVertical,
   Phone,
  MapPin,
  Building2,
  Users as UsersIcon,
  RefreshCw,
  Sparkles,
  Plus,
  Eye,
  Edit,
  Trash2,
  CreditCard
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
import { DeleteDialog } from '../../components/shared/DeleteDialog';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddClientPaymentDialog } from '../../components/clients/AddClientPaymentDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Name {
  arabic: string;
  english: string;
}

interface CommonEntity {
  id: number;
  name: Name;
}

interface Client {
  id: number;
  fullName: string;
  type: string;
  phoneNumber: string;
  vatNumber: string | null;
  iqama: string | null;
  iban: string | null;
  email: string | null;
  physicalAddress: string | null;
  createdAt: string;
  updatedAt: string | null;
  country: CommonEntity | null;
  city: CommonEntity | null;
  bank: CommonEntity | null;
  createdBy: {
    id: number;
    email: string;
  };
  updatedBy: {
    id: number;
    email: string;
  } | null;
  activeContract: number;
  totalValution: number;
}

interface ClientResponse {
  code: number;
  data: Client[];
  totalItems: number;
  totalPages: number;
}

export default function Clients() {
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ search: '', type: 'all' });
  const pageSize = 10;
  const queryClient = useQueryClient();
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [paymentClient, setPaymentClient] = useState<{ id: number; name: string } | null>(null);

  const isRtl = i18n.language === 'ar';

  const { data, isLoading, refetch } = useQuery<ClientResponse>({
    queryKey: ['clients', currentPage, filters.search, filters.type],
    queryFn: async () => {
      const response = await api.get('/client', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: filters.search || undefined,
          type: filters.type && filters.type !== 'all' ? filters.type : undefined
        }
      });
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/client/${id}`);
    },
    onSuccess: () => {
      toast.success(t('clients.success.delete'), {
        style: { borderRadius: '1rem', background: '#4A1B1B', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setClientToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.[isRtl ? 'arabic' : 'english'] || t('clients.errors.delete'));
    }
  });

  const handleDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete);
    }
  };

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('common.search'),
      placeholder: t('clients.placeholders.search'),
      key: 'search'
    },
    {
      type: 'select',
      label: t('clients.type'),
      placeholder: t('clients.type'),
      key: 'type',
      options: [
        { value: 'all', label: t('common.all') },
        { value: 'individual', label: t('clients.individual') },
        { value: 'corporate', label: t('clients.company') }
      ]
    }
  ];

  const columns: Column<Client>[] = [
    {
      header: t('clients.fullName'),
      cell: (client) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] text-white text-xs font-bold">
              {client.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {client.fullName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Badge variant="outline" className={cn(
                "px-2 py-0 text-[10px] font-medium rounded-full",
                client.type === 'individual' 
                  ? "bg-blue-50 text-blue-600 border-blue-100" 
                  : "bg-purple-50 text-purple-600 border-purple-100"
              )}>
                {t(`clients.${client.type}`)}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('clients.phoneNumber'),
      cell: (client) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {client.phoneNumber}
        </div>
      )
    },
    {
      header: t('clients.location'),
      cell: (client) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>
              {client.city?.name?.[isRtl ? 'arabic' : 'english'] || '—'}, {client.country?.name?.[isRtl ? 'arabic' : 'english'] || '—'}
            </span>
          </div>
          {client.physicalAddress && (
            <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
              {client.physicalAddress}
            </span>
          )}
        </div>
      )
    },
    {
      header: t('contracts.title') || 'Contracts',
      cell: (client) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className={cn(
              "px-2 py-0 text-[10px] font-medium rounded-full",
              client.activeContract > 0 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-gray-50 text-gray-400 border-gray-100"
            )}>
              {client.activeContract} {t('contracts.title')}
            </Badge>
          </div>
          <div className="text-[11px] font-bold text-[#B39371]">
            {client.totalValution?.toLocaleString()} {t('common.sar')}
          </div>
        </div>
      )
    },
    {
      header: t('clients.bank'),
      cell: (client) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          {client.bank?.name?.[isRtl ? 'arabic' : 'english'] || '—'}
        </div>
      )
    },
    {
      header: t('common.actions'),
      headerClassName: "text-right",
      className: "text-right",
      cell: (client) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-md">
            <DropdownMenuLabel className="text-xs font-medium text-gray-400">
              {t('common.actions')}
            </DropdownMenuLabel>
            <Can I="READ" a="client">
              <Link href={`/clients/${client.id}`}>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Eye className="w-3.5 h-3.5 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                  <span className="text-xs">{t('common.details')}</span>
                </DropdownMenuItem>
              </Link>
            </Can>
            <Can I="CREATE" a="finance">
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer text-emerald-600 focus:text-emerald-700"
                  onClick={() => setPaymentClient({ id: client.id, name: client.fullName })}
                >
                  <CreditCard className="w-3.5 h-3.5 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span className="text-xs">{t('payments.addPayment')}</span>
                </DropdownMenuItem>
              </>
            </Can>
            <Can I="UPDATE" a="client">
              <>
                <DropdownMenuSeparator />
                <Link href={`/clients/${client.id}/edit`}>
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <Edit className="w-3.5 h-3.5 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                    <span className="text-xs">{t('common.edit')}</span>
                  </DropdownMenuItem>
                </Link>
              </>
            </Can>
            <Can I="DELETE" a="client">
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer text-red-600"
                  onClick={() => setClientToDelete(client.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span className="text-xs">{t('common.delete')}</span>
                </DropdownMenuItem>
              </>
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
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <UsersIcon className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('clients.businessRelations')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('clients.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('clients.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="h-10 px-4 rounded-md border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('common.refresh')}
                </Button>
                
                <Can I="CREATE" a="client">
                  <Link href="/clients/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t('clients.create')}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>

         

          {/* Filter Bar */}
          <FilterBar 
            fields={filterFields} 
            values={filters} 
            onChange={(key, value) => {
              setFilters(prev => ({ ...prev, [key]: value }));
              setCurrentPage(1);
            }} 
            onReset={() => setFilters({ search: '', type: 'all' })}
          />

          <DataTable 
            columns={columns} 
            data={data?.data || []}
            isLoading={isLoading}
            loadingMessage={t('clients.loading')}
            currentPage={currentPage}
            totalPages={data?.totalPages}
            totalItems={data?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && (!data?.data || data?.data.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('clients.empty.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search || filters.type !== 'all'
                  ? t('clients.empty.description')
                  : t('clients.empty.createDescription')}
              </p>
              {!filters.search && filters.type === 'all' && (
                <Link href="/clients/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5 rtl:ml-2 rtl:mr-0" />
                    {t('clients.create')}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <DeleteDialog 
        isOpen={clientToDelete !== null}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        title={t('sidebar.clients')}
        description={t('deleteDialog.confirmDescription')}
        confirmText={t('common.delete')}
      />

      <AddClientPaymentDialog 
        isOpen={!!paymentClient}
        onClose={() => setPaymentClient(null)}
        clientId={paymentClient?.id || null}
        clientName={paymentClient?.name || ''}
      />
    </Shell>
  );
}
