import { TopHeader } from '../components/TopHeader';
import { Link, useRoute } from "wouter";
import {
  Building2,
  ChevronRight,
  FileText,
  Download,
  ArrowUpRight,
  Info,
  Wallet,
  Pencil,
  ImageOff,
  MapPin,
  Image,
  ArrowLeft,
  Plus,
  Layers,
  Compass,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Shell } from '../components/shared/Shell';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { LocationMap } from '../components/shared/LocationMap';
import { motion } from 'framer-motion';

interface ProjectStage {
  id: number;
  name: { arabic: string; english: string };
  estimateCost: number;
  fromDate: string;
  toDate: string;
  parentId: number | null;
  children?: ProjectStage[];
}

interface ProjectData {
  id: number;
  name: { arabic: string; english: string };
  projectIdentity: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  legality?: { id: number; name: { arabic: string; english: string } };
  stages: ProjectStage[];
}

const statusConfig: Record<string, { dot: string; pill: string }> = {
  planning:     { dot: 'bg-blue-500',    pill: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-800/40' },
  evacuation:   { dot: 'bg-orange-500',  pill: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-800/40' },
  demolition:   { dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/40' },
  construction: { dot: 'bg-amber-500',   pill: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/40' },
  handover:     { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/40' },
  onhold:       { dot: 'bg-gray-400',    pill: 'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700' },
};

export default function ProjectProfile() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/projects/:id');
  const projectId = params?.id;
  const isRtl = i18n.language === 'ar';

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await api.get(`/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });

  const project = response?.data as ProjectData;

  const fmtDate = (d: string) => {
    try { return format(new Date(d), 'MMM d, yyyy'); } catch { return d; }
  };

  /* ── loading ── */
  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#B39371]/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#B39371]" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ── error ── */
  if (error || !project) {
    return (
      <Shell>
        <TopHeader />
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('projects.errors.loadDetails')}</h2>
          <Link href="/projects">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-4">
              <ArrowLeft className="w-4 h-4" /> {t('common.back')}
            </button>
          </Link>
        </div>
      </Shell>
    );
  }

  const totalEstimate = project.stages.reduce((sum, s) => sum + s.estimateCost, 0);
  const currentStatus = statusConfig[project.status] ?? statusConfig.planning;

  const infoFields = [
    { label: t('projects.labels.projectId'),     value: `#${project.id}` },
    { label: t('projects.profile.internalId'),   value: project.projectIdentity },
    { label: t('projects.profile.legalityRecord'), value: project.legality ? (isRtl ? project.legality.name.arabic : project.legality.name.english) : t('common.na') },
    { label: t('materials.createdAt'),            value: fmtDate(project.createdAt) },
  ];

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ── Top bar ── */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link href="/projects">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0">
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                </button>
              </Link>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <Link href="/projects" className="hover:text-[#B39371] transition-colors shrink-0">{t('sidebar.projects')}</Link>
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {isRtl ? project.name.arabic : project.name.english}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/projects/${projectId}/media`}>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Image className="w-3.5 h-3.5 text-[#B39371]" />
                  {t('projects.media.uploadImages')}
                </motion.button>
              </Link>
              <Link href={`/projects/${projectId}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A1B1B] hover:bg-[#3a1515] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {t('common.edit')}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* ── Hero name + status ── */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#B39371]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1',
                    currentStatus.pill
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', currentStatus.dot)} />
                    {t(`projects.statuses.${project.status}`)}
                  </span>
                  <span className="text-xs font-mono text-gray-400">#{project.id.toString().padStart(4, '0')}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {isRtl ? project.name.arabic : project.name.english}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5 italic">
                  {isRtl ? project.name.english : project.name.arabic}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{t('projects.profile.totalPhases')}</p>
                <p className="text-2xl font-bold text-[#4A1B1B] dark:text-[#B39371]">{project.stages.length}</p>
              </div>
              <div className="h-10 w-px bg-gray-100 dark:bg-gray-800" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{t('projects.profile.estCost')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalEstimate.toLocaleString()} <span className="text-xs text-[#B39371] font-medium">{t('common.sar')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Main grid 2/3 + 1/3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Gallery */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5 text-[#B39371]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.media.visualAssets')}</h3>
                  </div>
                  <Link href={`/projects/${projectId}/media`}>
                    <button className="flex items-center gap-1.5 text-xs text-[#B39371] hover:text-[#4A1B1B] transition-colors font-medium">
                      <Plus className="w-3.5 h-3.5" />
                      {t('projects.media.uploadImages')}
                    </button>
                  </Link>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 h-52">
                    {/* Main slot */}
                    <div className="col-span-2 relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                      <div
                        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 20px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 20px)' }}
                      />
                      <div className="relative flex flex-col items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-white/70 dark:bg-gray-900/60 flex items-center justify-center shadow-sm">
                          <ImageOff className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">{t('projects.profile.noImages')}</span>
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                        <ImageOff className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t('projects.profile.noImages')}</span>
                      </div>
                    </div>
                    {/* Side slots */}
                    <div className="grid grid-rows-2 gap-3">
                      {[0, 1].map(i => (
                        <div key={i} className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          <div
                            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
                            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 20px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 20px)' }}
                          />
                          <ImageOff className="relative w-4 h-4 text-gray-300 dark:text-gray-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stages timeline */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5 text-[#B39371]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.stages.phasesTitle')}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {project.stages.length} {t('legality.steps')}
                    </span>
                    <Link href={`/projects/${projectId}/stages`}>
                      <button className="flex items-center gap-1.5 text-xs text-[#B39371] hover:text-[#4A1B1B] transition-colors font-medium">
                        <Plus className="w-3.5 h-3.5" />
                        {t('projects.stages.addStage')}
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="p-5">
                  {project.stages.length === 0 ? (
                    <div className="py-12 text-center rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                        <Compass className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-400">{t('projects.profile.noStages')}</p>
                      <Link href={`/projects/${projectId}/stages`}>
                        <button className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#B39371] hover:text-[#4A1B1B] transition-colors font-medium">
                          {t('projects.profile.addFirstStage')} <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* vertical connector */}
                      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-100 dark:bg-gray-800" />

                      <div className="space-y-1">
                        {project.stages.map((stage, idx) => (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            {/* Parent stage */}
                            <div className="flex gap-4 py-3 group">
                              <div className="w-6 h-6 rounded-full bg-[#4A1B1B] dark:bg-[#B39371] border-2 border-white dark:border-gray-900 flex items-center justify-center shrink-0 mt-0.5 relative z-10 shadow-sm">
                                <Layers className="w-3 h-3 text-white dark:text-[#4A1B1B]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/30 hover:bg-[#F5F1ED]/20 dark:hover:bg-gray-800/40 transition-all">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#4A1B1B] dark:group-hover:text-[#B39371] transition-colors">
                                      {isRtl ? stage.name.arabic : stage.name.english}
                                    </p>
                                    <span className="inline-flex items-center mt-1 text-[10px] font-semibold text-[#B39371] bg-[#B39371]/10 px-2 py-0.5 rounded-full">
                                      {stage.estimateCost.toLocaleString()} {t('common.sar')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <CalendarDays className="w-3 h-3 text-[#B39371]" />
                                    <span>{fmtDate(stage.fromDate)}</span>
                                    <span className="text-gray-300">→</span>
                                    <span>{fmtDate(stage.toDate)}</span>
                                  </div>
                                </div>

                                {/* Children */}
                                {stage.children && stage.children.length > 0 && (
                                  <div className="mt-2 ml-4 space-y-1.5 pl-3 border-l-2 border-dashed border-gray-100 dark:border-gray-800">
                                    {stage.children.map(child => (
                                      <div key={child.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#B39371]/60 shrink-0" />
                                          <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                              {isRtl ? child.name.arabic : child.name.english}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                              {child.estimateCost.toLocaleString()} {t('common.sar')}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                                          <Clock className="w-2.5 h-2.5" />
                                          <span>{fmtDate(child.fromDate)}</span>
                                          <span>–</span>
                                          <span>{fmtDate(child.toDate)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.labels.location')}</h3>
                </div>
                <div className="relative h-72 overflow-hidden">
                  <LocationMap
                    latitude={project.latitude}
                    longitude={project.longitude}
                    readOnly={true}
                  />
                  {/* Address overlay */}
                  <div className="absolute bottom-4 left-4 p-3.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg max-w-xs z-[400]">
                    <p className="text-[10px] font-semibold text-[#B39371] uppercase tracking-widest mb-1">{t('projects.labels.address')}</p>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{project.address}</p>
                    <div className="mt-2 flex gap-3">
                      <span className="text-[9px] text-gray-400 font-mono">Lat: {project.latitude?.toFixed(4)}</span>
                      <span className="text-[9px] text-gray-400 font-mono">Lng: {project.longitude?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-5">

              {/* Project Info */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.profile.infoTitle')}</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {infoFields.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <span className="text-[11px] text-gray-400 shrink-0 mt-0.5 w-28 leading-tight">{item.label}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white text-right break-words">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Overview */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.profile.financeTitle')}</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Total cost */}
                  <div className="p-4 rounded-xl bg-[#F5F1ED] dark:bg-gray-800 border border-[#E8DDD3] dark:border-gray-700">
                    <p className="text-[10px] text-[#B39371] font-semibold uppercase tracking-widest mb-1">{t('projects.profile.estCost')}</p>
                    <p className="text-2xl font-black text-[#4A1B1B] dark:text-[#B39371] leading-none">
                      {totalEstimate.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#B39371] font-medium mt-0.5">{t('common.sar')}</p>
                  </div>

                  {/* Phases + avg */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{t('projects.profile.totalPhases')}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{project.stages.length}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{t('projects.profile.avgPerStage')}</p>
                      <p className="text-sm font-bold text-[#B39371]">
                        {project.stages.length > 0
                          ? Math.round(totalEstimate / project.stages.length).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </div>

                  {/* Liquidity bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{t('projects.profile.liquidity')}</span>
                      <span className="text-[10px] font-semibold text-emerald-600">{t('common.available')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#B39371] to-[#4A1B1B] w-full rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-[#B39371]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('projects.profile.docsTitle')}</h3>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-[#B39371] hover:text-[#4A1B1B] transition-colors">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="py-8 text-center rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <FileText className="w-7 h-7 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">{t('projects.profile.noDocs')}</p>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 gap-2">
                <Link href={`/projects/${projectId}/stages`}>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/40 hover:bg-[#F5F1ED]/30 dark:hover:bg-gray-800 transition-all group cursor-pointer bg-white dark:bg-gray-900">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#B39371]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('projects.stages.phasesTitle')}</p>
                      <p className="text-[10px] text-gray-400">{t('projects.stages.addNewStage')}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] transition-colors shrink-0" />
                  </div>
                </Link>
                <Link href={`/projects/${projectId}/media`}>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/40 hover:bg-[#F5F1ED]/30 dark:hover:bg-gray-800 transition-all group cursor-pointer bg-white dark:bg-gray-900">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Image className="w-4 h-4 text-[#B39371]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('projects.media.title')}</p>
                      <p className="text-[10px] text-gray-400">{t('projects.media.uploadImages')}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] transition-colors shrink-0" />
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
