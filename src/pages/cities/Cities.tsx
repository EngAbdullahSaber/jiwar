import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { DataTable } from '../../components/shared/DataTable';
import type { Column } from '../../components/shared/DataTable';
import { FilterBar } from '../../components/shared/FilterBar';
import type { FilterField } from '../../components/shared/FilterBar';
import { Shell } from '../../components/shared/Shell';
import { 
  Building2,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Calendar,
  User,
  MapPin,
  Globe,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from "wouter";
import toast from 'react-hot-toast';
import { DeleteDialog } from '../../components/shared/DeleteDialog';

interface City {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  createdAt: string;
  updatedAt: string | null;
  country: {
    id: number;
    name: {
      arabic: string;
      english: string;
    };
  };
  createdBy: {
    id: number;
    email: string;
  };
  updatedBy: any;
}

interface CitiesResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: City[];
  totalItems: number;
  totalPages: number;
}

export default function Cities() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [cityToDelete, setCityToDelete] = useState<number | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data: response, isLoading, refetch } = useQuery<CitiesResponse>({
    queryKey: ['cities', currentPage, pageSize, filters.search],
    queryFn: async () => {
      const res = await api.get('/city', {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
        }
      });
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/city/${id}`);
    },
    onSuccess: () => {
      toast.success(t('cities.deleteSuccess'), {
        style: { borderRadius: '1rem', background: '#4A1B1B', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setCityToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    }
  });

  const handleDelete = () => {
    if (cityToDelete) {
      deleteMutation.mutate(cityToDelete);
    }
  };

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('cities.title'),
      placeholder: t('legality.searchPlaceholder'),
      key: 'search'
    }
  ];

  const columns: Column<City>[] = [
    {
      header: t('cities.name'),
      cell: (c: City) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#4A1B1B] dark:text-[#B39371]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name?.english || 'N/A'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="rtl">{c.name?.arabic || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      header: t('cities.country'),
      cell: (c: City) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
            <Globe className="w-3.5 h-3.5 text-[#B39371]" />
            <span className="text-sm">{c.country?.name?.english || 'N/A'}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="rtl">{c.country?.name?.arabic || 'N/A'}</span>
        </div>
      )
    },
    {
      header: t('legality.createdAt'),
      cell: (c: City) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{new Date(c.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: t('legality.createdBy'),
      cell: (c: City) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span className="text-sm">{c.createdBy?.email || 'System'}</span>
        </div>
      )
    },
    {
      header: t('common.actions'),
      headerClassName: "text-center",
      cell: (c: City) => (
        <div className="flex items-center justify-center gap-2">
          
          <Link href={`/cities/${c.id}/edit`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
          <button 
            onClick={() => setCityToDelete(c.id)}
            disabled={deleteMutation.isPending}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" 
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const cities = response?.data || [];

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
                    <MapPin className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('cities.localizationSettings')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('cities.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('cities.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="h-10 px-4 rounded-md border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.refresh')}
                </Button>

                <Link href="/cities/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    {t('cities.add')}
                  </motion.button>
                </Link>
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
          />
  
          <DataTable 
            columns={columns} 
            data={cities}
            isLoading={isLoading}
            loadingMessage={t('common.loading')}
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <DeleteDialog 
        isOpen={cityToDelete !== null}
        onClose={() => setCityToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        title={t('cities.edit')}
        description={t('deleteDialog.confirmDescription')}
        confirmText={t('cities.deleteSuccess')}
      />
    </Shell>
  );
}
