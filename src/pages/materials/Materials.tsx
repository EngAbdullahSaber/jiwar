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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { 
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  Wallet,
  FileEdit,
  Sparkles,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Material {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  requestStatus: string;
  approvalStatus: string;
  projectId: number;
  createdAt: string;
  updatedAt: string | null;
  projectStagesEstimateCost: number;
}

interface MaterialsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Material[];
  totalItems: number;
  totalPages: number;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const statusConfig: Record<string, { color: string; hover: string; icon: any; label: string }> = {
    pending: { 
      color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", 
      hover: "hover:bg-blue-100 dark:hover:bg-blue-500/20",
      icon: Clock,
      label: t('materials.statuses.pending')
    },
    draft: { 
      color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20", 
      hover: "hover:bg-gray-100 dark:hover:bg-gray-500/20",
      icon: FileEdit,
      label: t('materials.statuses.draft')
    },
    ordered: { 
      color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", 
      hover: "hover:bg-amber-100 dark:hover:bg-amber-500/20",
      icon: Layers,
      label: t('materials.statuses.ordered')
    },
    received: { 
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", 
      hover: "hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
      icon: CheckCircle2,
      label: t('materials.statuses.received')
    },
    approved: { 
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", 
      hover: "hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
      icon: CheckCircle2,
      label: t('materials.statuses.approved')
    },
    finalized: { 
      color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", 
      hover: "hover:bg-purple-100 dark:hover:bg-purple-500/20",
      icon: CheckCircle2,
      label: t('materials.statuses.finalized')
    },
    rejected: { 
      color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20", 
      hover: "hover:bg-red-100 dark:hover:bg-red-500/20",
      icon: AlertCircle,
      label: t('materials.statuses.rejected')
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "rounded-lg px-3 py-1 text-xs font-medium border shadow-sm transition-all duration-300",
        config.color,
        config.hover,
        "hover:shadow-md hover:scale-[1.02] cursor-default"
      )}
    >
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </Badge>
  );
};

export default function Materials() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ search: '', requestStatus: 'all', approvalStatus: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery<MaterialsResponse>({
    queryKey: ['materials', currentPage, pageSize, filters.search, filters.requestStatus, filters.approvalStatus],
    queryFn: async () => {
      const res = await api.get('/material', {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
          requestStatus: filters.requestStatus !== 'all' ? filters.requestStatus : undefined,
          approvalStatus: filters.approvalStatus !== 'all' ? filters.approvalStatus : undefined
        }
      });
      return res.data;
    }
  });

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('common.search'),
      placeholder: t('materials.name'),
      key: 'search'
    },
    {
      type: 'select',
      label: t('materials.requestStatus'),
      placeholder: t('materials.allStatus'),
      key: 'requestStatus',
      options: [
        { value: 'all', label: t('materials.allStatus') },
        { value: 'pending', label: t('materials.statuses.pending') },
        { value: 'ordered', label: t('materials.statuses.ordered') },
        { value: 'received', label: t('materials.statuses.received') },
      ]
    },
    {
      type: 'select',
      label: t('materials.approvalStatus'),
      placeholder: t('materials.allStatus'),
      key: 'approvalStatus',
      options: [
        { value: 'all', label: t('materials.allStatus') },
        { value: 'draft', label: t('materials.statuses.draft') },
        { value: 'approved', label: t('materials.statuses.approved') },
        { value: 'finalized', label: t('materials.statuses.finalized') },
      ]
    }
  ];

  const columns: Column<Material>[] = [
    {
      header: t('materials.materialId'),
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371]"
    },
    {
      header: t('materials.name'),
      cell: (m) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.name || 'N/A'}</p>
        </div>
      )
    },
    {
      header: t('materials.supplier'),
      cell: (m) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{m.supplier || 'N/A'}</span>
      )
    },
    {
      header: t('materials.quantity'),
      cell: (m) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{m.quantity || 0}</span>
      ),
      className: "text-center",
      headerClassName: "text-center"
    },
    {
      header: t('materials.requestStatus'),
      cell: (m) => <StatusBadge status={m.requestStatus || "draft"} />
    },
    {
      header: t('materials.approvalStatus'),
      cell: (m) => <StatusBadge status={m.approvalStatus || "draft"} />
    },
    {
      header: t('materials.estimateCost'),
      cell: (m) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          SAR {m.projectStagesEstimateCost?.toLocaleString() || 0}
        </span>
      )
    },
    {
      header: t('common.actions'),
      headerClassName: "text-center",
      cell: (m) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/materials/${m.id}`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title={t('materials.view')}>
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/materials/${m.id}/edit`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title={t('common.edit')}>
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
           
        </div>
      )
    }
  ];

  const materials = response?.data || [];
 
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
                    <Layers className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('materials.title')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('materials.subtitle')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('materials.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/materials/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    {t('materials.create')}
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
            data={materials}
            isLoading={isLoading}
            loadingMessage="Loading materials..."
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && materials.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('materials.empty')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search || filters.requestStatus !== 'all' || filters.approvalStatus !== 'all'
                  ? t('materials.emptyDesc')
                  : t('materials.createFirst')}
              </p>
              {!filters.search && filters.requestStatus === 'all' && filters.approvalStatus === 'all' && (
                <Link href="/materials/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t('materials.create')}
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
