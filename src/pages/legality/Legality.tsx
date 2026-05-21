import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Pagination } from '../../components/shared/Pagination';
import {
  Search,
  PlusCircle,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ChevronDown,
  Scale,
  Pencil,
  Trash2
} from 'lucide-react';
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { Can } from '../../components/shared/Can';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { DeleteDialog } from '../../components/shared/DeleteDialog';

interface LegalityStep {
  id: number;
  step: {
    id: number;
    name: { arabic: string; english: string };
    fromDate: string | null;
    toDate: string | null;
  };
}

interface Legality {
  id: number;
  name: { arabic: string; english: string };
  createdAt: string;
  createdBy: { id: number; email: string };
  legalitySteps: LegalityStep[];
}

interface LegalityResponse {
  code: number;
  data: Legality[];
  totalItems: number;
  totalPages: number;
}

const statusMap = {
  completed: {
    gradient: 'from-emerald-500 to-teal-600',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
  },
  inProgress: {
    gradient: 'from-violet-500 to-indigo-600',
    pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20',
    icon: Activity,
    dot: 'bg-violet-500',
  },
  started: {
    gradient: 'from-amber-400 to-orange-500',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
    icon: Clock,
    dot: 'bg-amber-400',
  },
  pending: {
    gradient: 'from-slate-400 to-slate-500',
    pill: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20',
    icon: AlertCircle,
    dot: 'bg-slate-400',
  },
};

export default function Legality() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [legalityToDelete, setLegalityToDelete] = useState<number | null>(null);
  const pageSize = 12;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/legality/${id}`);
    },
    onSuccess: () => {
      toast.success(t('legality.deleteSuccess'), {
        style: { borderRadius: '1rem', background: '#1C1917', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['legalities'] });
      setLegalityToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    }
  });

  const { data, isLoading } = useQuery<LegalityResponse>({
    queryKey: ['legalities', currentPage, searchValue, filterStatus],
    queryFn: async () => {
      const response = await api.get('/legality', {
        params: {
          page: currentPage,
          pageSize,
          search: searchValue || undefined,
          status: filterStatus === 'all' ? undefined : filterStatus,
        },
      });
      return response.data;
    },
  });

  useEffect(() => { setCurrentPage(1); }, [filterStatus, searchValue]);

  const calcProgress = (steps: LegalityStep[]) => {
    if (!steps?.length) return 0;
    return Math.round((steps.filter(s => s.step.toDate).length / steps.length) * 100);
  };

  const getStatus = (progress: number) => {
    if (progress === 100) return { key: 'completed', label: t('legality.completed'), ...statusMap.completed };
    if (progress >= 50) return { key: 'inProgress', label: t('legality.inProgress'), ...statusMap.inProgress };
    if (progress >= 25) return { key: 'started', label: t('legality.started'), ...statusMap.started };
    return { key: 'pending', label: t('legality.pending'), ...statusMap.pending };
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const lang = i18n.language === 'ar' ? 'arabic' : 'english';

  return (
    <Shell>
      <TopHeader />

      <DeleteDialog
        isOpen={legalityToDelete !== null}
        onClose={() => setLegalityToDelete(null)}
        onConfirm={() => legalityToDelete && deleteMutation.mutate(legalityToDelete)}
        isDeleting={deleteMutation.isPending}
        title={t('common.delete')}
        description={t('deleteDialog.confirmDescription')}
        confirmText={t('common.delete')}
      />

      <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#0E0E0F]">

        {/* ── Top bar ──────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0E0E0F]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-[1560px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#1C1917] dark:bg-white flex items-center justify-center shadow-sm">
                <Scale className="w-4 h-4 text-white dark:text-[#1C1917]" />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#78716C] dark:text-[#78716C] leading-none block">
                  {t('legality.management')}
                </span>
                <span className="text-[15px] font-bold text-[#1C1917] dark:text-white leading-none tracking-tight">
                  {t('legality.title')}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Can I="CREATE" a="legality">
              <Link href="/legality/new">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 h-9 px-5 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] rounded-md text-[13px] font-semibold shadow-sm hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('legality.create')}
                </motion.button>
              </Link>
            </Can>
          </div>
        </header>

        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 py-8 space-y-6">

      

          {/* ── Toolbar ─────────────────────────────────── */}
          <div className="bg-white dark:bg-[#18181B] rounded-md border border-black/[0.06] dark:border-white/[0.06] px-4 py-3 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="text"
                placeholder={t('legality.searchPlaceholder')}
                className="w-full pl-9 pr-4 h-9 rounded-md bg-[#F7F6F3] dark:bg-[#0E0E0F] text-[13px] font-medium text-[#1C1917] dark:text-white placeholder:text-[#A8A29E] border border-transparent focus:border-[#1C1917]/20 dark:focus:border-white/20 focus:outline-none transition-colors"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-[#F7F6F3] dark:bg-[#0E0E0F] text-[13px] font-medium text-[#1C1917] dark:text-white border border-transparent focus:border-[#1C1917]/20 dark:focus:border-white/20 focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="all">{t('legality.allStatus')}</option>
                <option value="completed">{t('legality.completed')}</option>
                <option value="inProgress">{t('legality.inProgress')}</option>
                <option value="pending">{t('legality.pending')}</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E] pointer-events-none" />
            </div>
          </div>

          {/* ── Grid ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {/* New card */}
            <Can I="CREATE" a="legality">
              <Link href="/legality/new">
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  className="group h-full min-h-[220px] rounded-md border-2 border-dashed border-[#D6D3D1] dark:border-[#3F3F46] hover:border-[#1C1917] dark:hover:border-white transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-md bg-[#F7F6F3] dark:bg-[#27272A] group-hover:bg-[#1C1917] dark:group-hover:bg-white transition-colors flex items-center justify-center">
                    <PlusCircle className="w-5 h-5 text-[#A8A29E] group-hover:text-white dark:group-hover:text-[#1C1917] transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#1C1917] dark:text-white">{t('legality.newLegality')}</p>
                    <p className="text-[11px] text-[#A8A29E] mt-0.5">{t('legality.startWorkflow')}</p>
                  </div>
                </motion.div>
              </Link>
            </Can>

            {/* Skeletons */}
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#18181B] rounded-md border border-black/[0.06] dark:border-white/[0.06] p-5 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                  <div className="h-4 w-4 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                </div>
                <div className="h-5 w-3/4 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                <div className="h-2 w-full bg-[#E7E5E4] dark:bg-[#27272A] rounded-md" />
                <div className="h-8 w-1/2 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
              </div>
            ))}

            {/* Data cards */}
            {!isLoading && data?.data.map((item, idx) => {
              const progress = calcProgress(item.legalitySteps);
              const status = getStatus(progress);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  className="group bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md hover:shadow-gray-200/60 dark:hover:shadow-black/40 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 flex flex-col"
                >
                  {/* Top accent strip */}
                  <div className={cn('h-[3px] w-full bg-gradient-to-r shrink-0', status.gradient)} />

                  <div className="p-5 flex flex-col gap-3 flex-1">

                    {/* Header: ID + status pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded-md tracking-wider">
                        LF-{item.id.toString().padStart(4, '0')}
                      </span>
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold', status.pill)}>
                        <span className={cn('w-1.5 h-1.5 rounded-md', status.dot)} />
                        {status.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[40px]">
                      {item.name[lang]}
                    </h3>

                    {/* Steps count */}
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {item.legalitySteps.length} {t('legality.steps')}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-gray-400 dark:text-gray-500">{t('legality.progress')}</span>
                        <span className="font-bold tabular-nums text-gray-900 dark:text-white">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.04 }}
                          className={cn('h-full rounded-md bg-gradient-to-r', status.gradient)}
                        />
                      </div>
                    </div>

                    {/* Last Steps */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        {t('legality.lastSteps')}
                      </p>
                      {item.legalitySteps?.slice(-2).length > 0 ? item.legalitySteps.slice(-2).map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-md shrink-0',
                              s.step?.toDate ? 'bg-emerald-500' : 'bg-amber-400'
                            )} />
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">
                              {s.step?.name?.[lang] || '—'}
                            </span>
                          </div>
                          {s.step?.toDate
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          }
                        </div>
                      )) : (
                        <p className="text-[11px] text-gray-400 dark:text-gray-600">—</p>
                      )}
                    </div>

                    {/* Meta: user + date */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-gray-900 dark:bg-white flex items-center justify-center text-[9px] font-bold text-white dark:text-gray-900 shrink-0">
                          {item.createdBy.email.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium truncate max-w-[80px]">{item.createdBy.email.split('@')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{fmtDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <Can I="READ" a="legality">
                        <Link href={`/legality/${item.id}`}>
                          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[12px] font-semibold hover:opacity-90 transition-opacity">
                            {t('legality.viewDetails')}
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </button>
                        </Link>
                      </Can>

                      <div className="flex items-center gap-1">
                        <Can I="UPDATE" a="legality">
                          <Link href={`/legality/${item.id}/edit`}>
                            <button className="w-8 h-8 rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#B39371] hover:text-[#B39371] transition-colors" title={t('common.edit')}>
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </Can>
                        <Can I="DELETE" a="legality">
                          <button
                            onClick={() => setLegalityToDelete(item.id)}
                            disabled={deleteMutation.isPending}
                            className="w-8 h-8 rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Can>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Pagination ──────────────────────────────── */}
          {data && data.totalPages > 1 && (
            <div className="bg-white dark:bg-[#18181B] rounded-md border border-black/[0.06] dark:border-white/[0.06] px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[12px] text-[#78716C] dark:text-[#A8A29E]">
                {t('common.showing')}{' '}
                <span className="font-semibold text-[#1C1917] dark:text-white">
                  {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.totalItems)}
                </span>{' '}
                {t('common.of')}{' '}
                <span className="font-semibold text-[#1C1917] dark:text-white">{data.totalItems}</span> {t('common.results')}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                 onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* ── Empty state ──────────────────────────────── */}
          {!isLoading && data?.data.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#18181B] rounded-md border border-black/[0.06] dark:border-white/[0.06] py-20 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-md bg-[#F7F6F3] dark:bg-[#27272A] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#A8A29E]" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1C1917] dark:text-white">{t('legality.noLegalities')}</h3>
                <p className="text-[12px] text-[#A8A29E] mt-1 max-w-xs">
                  {searchValue || filterStatus !== 'all' ? t('legality.adjustSearch') : t('legality.getStarted')}
                </p>
              </div>
              {!searchValue && filterStatus === 'all' && (
                <Link href="/legality/new">
                  <button className="inline-flex items-center gap-2 h-9 px-5 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] rounded-md text-[13px] font-semibold shadow-sm hover:opacity-90 transition-opacity mt-2">
                    <PlusCircle className="w-4 h-4" />
                    {t('legality.create')}
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