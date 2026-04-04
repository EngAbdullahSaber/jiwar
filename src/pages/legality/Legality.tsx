import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Pagination } from '../../components/shared/Pagination';
import { 
  Search,
  MoreVertical,
  PlusCircle,
  ArrowRight,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Activity,
  ChevronDown,
  Scale
} from 'lucide-react';
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const pageSize = 12;

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

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const lang = i18n.language === 'ar' ? 'arabic' : 'english';

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#0E0E0F]">

        {/* ── Top bar ──────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0E0E0F]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-[1560px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1C1917] dark:bg-white flex items-center justify-center shadow-sm">
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
            <Link href="/legality/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 h-9 px-5 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] rounded-lg text-[13px] font-semibold shadow-sm hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="w-4 h-4" />
                {t('legality.create')}
              </motion.button>
            </Link>
          </div>
        </header>

        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 py-8 space-y-6">

      

          {/* ── Toolbar ─────────────────────────────────── */}
          <div className="bg-white dark:bg-[#18181B] rounded-xl border border-black/[0.06] dark:border-white/[0.06] px-4 py-3 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="text"
                placeholder={t('legality.searchPlaceholder') || 'Search legalities…'}
                className="w-full pl-9 pr-4 h-9 rounded-lg bg-[#F7F6F3] dark:bg-[#0E0E0F] text-[13px] font-medium text-[#1C1917] dark:text-white placeholder:text-[#A8A29E] border border-transparent focus:border-[#1C1917]/20 dark:focus:border-white/20 focus:outline-none transition-colors"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-[#F7F6F3] dark:bg-[#0E0E0F] text-[13px] font-medium text-[#1C1917] dark:text-white border border-transparent focus:border-[#1C1917]/20 dark:focus:border-white/20 focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="all">{t('legality.allStatus') || 'All status'}</option>
                <option value="completed">{t('legality.completed') || 'Completed'}</option>
                <option value="inProgress">{t('legality.inProgress') || 'In Progress'}</option>
                <option value="pending">{t('legality.pending') || 'Pending'}</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E] pointer-events-none" />
            </div>
          </div>

          {/* ── Grid ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {/* New card */}
            <Link href="/legality/new">
              <motion.div
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
                className="group h-full min-h-[220px] rounded-xl border-2 border-dashed border-[#D6D3D1] dark:border-[#3F3F46] hover:border-[#1C1917] dark:hover:border-white transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] dark:bg-[#27272A] group-hover:bg-[#1C1917] dark:group-hover:bg-white transition-colors flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-[#A8A29E] group-hover:text-white dark:group-hover:text-[#1C1917] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[#1C1917] dark:text-white">{t('legality.newLegality') || 'New Legality'}</p>
                  <p className="text-[11px] text-[#A8A29E] mt-0.5">{t('legality.startWorkflow') || 'Start a new workflow'}</p>
                </div>
              </motion.div>
            </Link>

            {/* Skeletons */}
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#18181B] rounded-xl border border-black/[0.06] dark:border-white/[0.06] p-5 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                  <div className="h-4 w-4 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                </div>
                <div className="h-5 w-3/4 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
                <div className="h-2 w-full bg-[#E7E5E4] dark:bg-[#27272A] rounded-full" />
                <div className="h-8 w-1/2 bg-[#E7E5E4] dark:bg-[#27272A] rounded" />
              </div>
            ))}

            {/* Data cards */}
            {!isLoading && data?.data.map((item, idx) => {
              const progress = calcProgress(item.legalitySteps);
              const status = getStatus(progress);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  className="group bg-white dark:bg-[#18181B] rounded-xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden hover:shadow-lg hover:shadow-black/[0.08] dark:hover:shadow-black/40 transition-shadow flex flex-col"
                >
                  {/* Accent bar */}
                  <div className={cn('h-[3px] w-full bg-gradient-to-r', status.gradient)} />

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono font-semibold text-[#A8A29E] tracking-wider mb-1">
                          LF-{item.id.toString().padStart(4, '0')}
                        </p>
                        <h3 className="text-[14px] font-semibold text-[#1C1917] dark:text-white leading-snug line-clamp-2">
                          {item.name[lang]}
                        </h3>
                      </div>
                      <button className="p-1 rounded-md hover:bg-[#F7F6F3] dark:hover:bg-[#27272A] transition-colors flex-shrink-0">
                        <MoreVertical className="w-4 h-4 text-[#A8A29E]" />
                      </button>
                    </div>

                    {/* Status + steps */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium', status.pill)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E]">
                        <Layers className="w-3 h-3" />
                        {item.legalitySteps.length} {t('legality.steps') || 'steps'}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-[#78716C] dark:text-[#A8A29E]">{t('legality.progress') || 'Progress'}</span>
                        <span className="font-bold text-[#1C1917] dark:text-white font-mono">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F7F6F3] dark:bg-[#27272A] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.04 }}
                          className={cn('h-full rounded-full bg-gradient-to-r', status.gradient)}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#78716C] dark:text-[#A8A29E]">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate font-medium">{item.createdBy.email.split('@')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#78716C] dark:text-[#A8A29E]">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium">{fmtDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-[#F7F6F3] dark:border-[#27272A] flex items-center justify-between">
                      <Link href={`/legality/${item.id}`}>
                        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1C1917] dark:text-white hover:opacity-70 transition-opacity">
                          {t('legality.viewDetails') || 'View details'}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                      <div className="w-7 h-7 rounded-full bg-[#1C1917] dark:bg-white flex items-center justify-center text-[10px] font-bold text-white dark:text-[#1C1917]">
                        {item.createdBy.email.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Pagination ──────────────────────────────── */}
          {data && data.totalPages > 1 && (
            <div className="bg-white dark:bg-[#18181B] rounded-xl border border-black/[0.06] dark:border-white/[0.06] px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[12px] text-[#78716C] dark:text-[#A8A29E]">
                Showing{' '}
                <span className="font-semibold text-[#1C1917] dark:text-white">
                  {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-[#1C1917] dark:text-white">{data.totalItems}</span> results
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                totalItems={data.totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* ── Empty state ──────────────────────────────── */}
          {!isLoading && data?.data.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#18181B] rounded-xl border border-black/[0.06] dark:border-white/[0.06] py-20 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F7F6F3] dark:bg-[#27272A] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#A8A29E]" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1C1917] dark:text-white">{t('legality.noLegalities') || 'No legalities found'}</h3>
                <p className="text-[12px] text-[#A8A29E] mt-1 max-w-xs">
                  {searchValue || filterStatus !== 'all' ? t('legality.adjustSearch') : t('legality.getStarted')}
                </p>
              </div>
              {!searchValue && filterStatus === 'all' && (
                <Link href="/legality/new">
                  <button className="inline-flex items-center gap-2 h-9 px-5 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] rounded-lg text-[13px] font-semibold shadow-sm hover:opacity-90 transition-opacity mt-2">
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