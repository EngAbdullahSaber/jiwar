import { useState } from 'react';
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
      label: 'Search Apartments',
      placeholder: 'Search by major name or secondary name...',
      key: 'search'
    }
  ];

  const columns: Column<Apartment>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371] w-16"
    },
    {
      header: "Apartment No.",
      cell: (a) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.mainName?.english || 'N/A'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="rtl">{a.mainName?.arabic || 'N/A'}</p>
        </div>
      )
    },
    {
      header: "Suite / Secondary Name",
      cell: (a) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{a.secondaryName?.english || 'N/A'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="rtl">{a.secondaryName?.arabic || 'N/A'}</p>
        </div>
      )
    },
    {
      header: "Floor",
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{a.floorNumber}</span>
      )
    },
    {
      header: "Size",
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{a.size} sqm</span>
      )
    },
    {
      header: "Template",
      cell: (a) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-white">{a.templateName?.english || 'N/A'}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{a.templateTotalRooms} Rooms</span>
        </div>
      )
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      cell: (a) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/apartments/${a.id}`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="View Details">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/apartments/${a.id}/edit`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="Edit">
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
                      Property Management
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Apartments
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage individual apartments and view templates across your properties
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
                    Add Apartment
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard 
              icon={Building}
              label="TOTAL APARTMENTS"
              value={(statics?.total || 0).toLocaleString()}
              subValue="Across all projects"
              color="from-blue-500 to-blue-600"
            />
            <StatCard 
              icon={CheckCircle2}
              label="AVAILABLE COUNT"
              value={(statics?.availableCount || 0).toLocaleString()}
              subValue="Ready units"
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
            loadingMessage="Loading apartments..."
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
                No apartments found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search 
                  ? 'Try adjusting your search to find what you\'re looking for'
                  : 'Get started by adding your first apartment'}
              </p>
              {!filters.search && (
                <Link href="/apartments/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    Add Apartment
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
