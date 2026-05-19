import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { FilterBar } from '../../components/shared/FilterBar';
import type { FilterField } from '../../components/shared/FilterBar';
import { Shell } from '../../components/shared/Shell';
import { Pagination } from '../../components/shared/Pagination';
import { Can } from '../../components/shared/Can';
import { DeleteDialog } from '../../components/shared/DeleteDialog';
import {
  Layers,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Clock,
  Hash,
  Loader2,
  GitBranch,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StageChild {
  id: number;
  name: { arabic: string; english: string };
  estimateCost: number;
  fromDate: string;
  toDate: string;
  parentId: number;
}

interface Stage {
  id: number;
  projectId: number;
  name: { arabic: string; english: string };
  estimateCost: number;
  fromDate: string;
  toDate: string;
  parentId: null;
  children: StageChild[];
}

interface StagesResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Stage[];
  totalItems: number;
  totalPages: number;
}

const COL = 'grid-cols-[2fr_100px_140px_180px_110px_64px]';

export default function Stages() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [stageToDelete, setStageToDelete] = useState<number | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/stage/${id}`);
    },
    onSuccess: () => {
      toast.success(t('stages.deleteSuccess'), {
        style: { borderRadius: '1rem', background: '#4A1B1B', color: '#fff' },
      });
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      setStageToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });

  const { data: response, isLoading, refetch } = useQuery<StagesResponse>({
    queryKey: ['stages', currentPage, pageSize, filters.search],
    queryFn: async () => {
      const res = await api.get('/stage', {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
        },
      });
      return res.data;
    },
  });

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: t('stages.title'),
      placeholder: t('stages.searchPlaceholder'),
      key: 'search',
    },
  ];

  const lang = i18n.language === 'ar' ? 'arabic' : 'english';
  const otherLang = lang === 'english' ? 'arabic' : 'english';
  const stages = response?.data || [];

  const fmtDate = (d: string) => {
    try { return format(new Date(d), 'dd/MM/yyyy'); } catch { return d; }
  };

  return (
    <Shell>
      <TopHeader />

      <DeleteDialog
        isOpen={stageToDelete !== null}
        onClose={() => setStageToDelete(null)}
        onConfirm={() => stageToDelete && deleteMutation.mutate(stageToDelete)}
        isDeleting={deleteMutation.isPending}
        title={t('common.delete')}
        description={t('deleteDialog.confirmDescription')}
        confirmText={t('common.delete')}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <GitBranch className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('stages.management')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('stages.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('stages.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-10 px-4 rounded-md border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.refresh')}
                </Button>
                <Can I="CREATE" a="project">
                  <Link href="/stages/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t('stages.add')}
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
          />

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

            {/* Header row */}
            <div className={cn('grid gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', COL)}>
              <span>{t('stages.labels.name')}</span>
              <span>{t('stages.labels.projectId')}</span>
              <span>{t('stages.labels.estimateCost')}</span>
              <span>{t('stages.labels.dateRange')}</span>
              <span className="text-right">{t('stages.labels.subStages')}</span>
              <span className="text-center">{t('common.actions')}</span>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin text-[#B39371]" />
                  <span className="text-sm">{t('common.loading')}</span>
                </div>
              </div>
            )}

            {/* Data rows */}
            {!isLoading && stages.map((stage, idx) => {
              const isExpanded = expandedRows.has(stage.id);
              const hasChildren = (stage.children?.length ?? 0) > 0;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                >
                  {/* Parent row */}
                  <div
                    className={cn(
                      'grid gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 transition-colors',
                      COL,
                      isExpanded
                        ? 'bg-[#B39371]/5 dark:bg-[#B39371]/5'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/30',
                    )}
                  >
                    {/* Name + expand toggle */}
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => hasChildren && toggleRow(stage.id)}
                        className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors',
                          hasChildren
                            ? 'bg-[#F5F1ED] dark:bg-gray-800 hover:bg-[#B39371]/20 cursor-pointer text-[#4A1B1B] dark:text-[#B39371]'
                            : 'bg-gray-100 dark:bg-gray-800 cursor-default text-gray-400',
                        )}
                      >
                        {hasChildren
                          ? isExpanded
                            ? <ChevronDown className="w-3.5 h-3.5" />
                            : <ChevronRight className="w-3.5 h-3.5" />
                          : <Layers className="w-3.5 h-3.5" />}
                      </button>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {stage.name[lang]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate" dir="rtl">
                          {stage.name[otherLang]}
                        </p>
                      </div>
                    </div>

                    {/* Project ID */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Hash className="w-3.5 h-3.5 text-[#B39371]" />
                        {stage.projectId}
                      </span>
                    </div>

                    {/* Estimate Cost */}
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-[#4A1B1B] dark:text-[#B39371]">
                        {stage.estimateCost.toLocaleString()} {t('common.sar')}
                      </span>
                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{fmtDate(stage.fromDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{fmtDate(stage.toDate)}</span>
                      </div>
                    </div>

                    {/* Sub-stages count */}
                    <div className="flex items-center justify-end">
                      {hasChildren ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F1ED] text-[#4A1B1B] dark:bg-gray-800 dark:text-[#B39371]">
                          {stage.children.length}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center">
                      <Can I="DELETE" a="project">
                        <button
                          onClick={() => setStageToDelete(stage.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Can>
                    </div>
                  </div>

                  {/* Children rows */}
                  <AnimatePresence>
                    {isExpanded && hasChildren && stage.children.map((child) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          'grid gap-4 px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-[#FAFAF9] dark:bg-gray-800/20',
                          COL,
                        )}
                      >
                        {/* Name with indent */}
                        <div className="flex items-center gap-3 pl-10 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-[#B39371]/10 flex items-center justify-center shrink-0">
                            <Layers className="w-3 h-3 text-[#B39371]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                              {child.name[lang]}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate" dir="rtl">
                              {child.name[otherLang]}
                            </p>
                          </div>
                        </div>

                        {/* Project ID — inherited, shown as dash */}
                        <div className="flex items-center">
                          <span className="text-xs text-gray-400">—</span>
                        </div>

                        {/* Estimate Cost */}
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {child.estimateCost.toLocaleString()} {t('common.sar')}
                          </span>
                        </div>

                        {/* Date Range */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>{fmtDate(child.fromDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{fmtDate(child.toDate)}</span>
                          </div>
                        </div>

                        <div />
                        <div />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Empty state */}
            {!isLoading && stages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <GitBranch className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('stages.empty.title')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('stages.empty.description')}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {response && response.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('common.showing')}{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, response.totalItems)}
                </span>{' '}
                {t('common.of')}{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{response.totalItems}</span>{' '}
                {t('common.results')}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={response.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

        </div>
      </div>
    </Shell>
  );
}
