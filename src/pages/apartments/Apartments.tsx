import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { StatCard } from '../../components/shared/StatCard';
import { DataTable } from '../../components/shared/DataTable';
import type { Column } from '../../components/shared/DataTable';
import { FilterBar } from '../../components/shared/FilterBar';
import type { FilterField } from '../../components/shared/FilterBar';

import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { 
  Building,
  Plus,
  Eye,
  Pencil,
  Sparkles,
  Home,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Apartment {
  id: number;
  mainName: {
    arabic: string;
    english: string;
  };
  secondaryName: {
    arabic: string;
    english: string;
  };
  floorNumber: number;
  size: string;
  templateName: {
    arabic: string;
    english: string;
  };
  templateTotalRooms: number;
}

interface ApartmentsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Apartment[];
  statics: {
    total: number;
    availableCount: number;
  };
  totalItems: number;
  totalPages: number;
}





export default function Apartments() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery<ApartmentsResponse>({
    queryKey: ['apartments', currentPage, pageSize, filters.search],
    queryFn: async () => {
      const res = await api.get('/apartment', {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
        }
      });
      return res.data;
    }
  });

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('apartments.title'),
      placeholder: t('apartments.placeholders.search'),
      key: 'search'
    }
  ];

  const columns: Column<Apartment>[] = [
    {
      header: t('common.id'),
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371] w-16"
    },
    {
      header: t('apartments.labels.apartmentNo'),
      cell: (a) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {i18n.language === 'ar' ? a.mainName?.arabic : a.mainName?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === 'ar' ? a.mainName?.english : a.mainName?.arabic}
          </p>
        </div>
      )
    },
    {
      header: t('apartments.labels.suite'),
      cell: (a) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">
            {i18n.language === 'ar' ? a.secondaryName?.arabic : a.secondaryName?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === 'ar' ? a.secondaryName?.english : a.secondaryName?.arabic}
          </p>
        </div>
      )
    },
    {
      header: t('apartments.labels.floor'),
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{a.floorNumber}</span>
      )
    },
    {
      header: t('apartments.labels.size'),
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{a.size} {t('apartments.labels.sqmLabel')}</span>
      )
    },
    {
      header: t('apartments.labels.template'),
      cell: (a) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-white">
            {i18n.language === 'ar' ? a.templateName?.arabic : a.templateName?.english}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{a.templateTotalRooms} {t('apartments.labels.rooms')}</span>
        </div>
      )
    },
    {
      header: t('common.actions'),
      headerClassName: "text-center",
      cell: (a) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/apartments/${a.id}`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title={t('common.view')}>
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/apartments/${a.id}/edit`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title={t('common.edit')}>
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )
    }
  ];

  const apartments = response?.data || [];
  const statics = response?.statics;

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
                    <Building className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('apartments.management')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('apartments.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('apartments.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/apartments/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    {t('apartments.add')}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard 
              icon={Building}
              label={t('apartments.stats.total')}
              value={(statics?.total || 0).toLocaleString()}
              subValue={t('apartments.stats.acrossAll')}
              color="from-blue-500 to-blue-600"
            />
            <StatCard 
              icon={CheckCircle2}
              label={t('apartments.stats.available')}
              value={(statics?.availableCount || 0).toLocaleString()}
              subValue={t('apartments.stats.readyUnits')}
              color="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Filter Bar */}
             <FilterBar 
              fields={filterFields} 
              values={filters} 
              onChange={(key, value) => {
                setFilters(prev => ({ ...prev, [key]: value }));
                setCurrentPage(1);
              }} 
            />
 
          <DataTable 
            columns={columns} 
            data={apartments}
            isLoading={isLoading}
            loadingMessage={t('common.loading')}
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && apartments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('apartments.empty.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search 
                  ? t('apartments.empty.description')
                  : t('apartments.empty.createFirst')}
              </p>
              {!filters.search && (
                <Link href="/apartments/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t('apartments.add')}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Shell>
  );
}
