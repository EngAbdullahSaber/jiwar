import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { Link, useRoute, useLocation } from "wouter";
import {
  Building,
  ArrowLeft,
  FileText,
  Ruler,
  Tags,
  Link as LinkIcon,
  Pencil,
  CheckCircle2,
  XCircle,
  Download,
  Clock,
  Layout,
  ChevronRight,
  ArrowUpRight,
  ImageOff,
  FilePlus2,
} from 'lucide-react';
import { Shell } from '../../components/shared/Shell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Apartment {
  id: number;
  mainName: { arabic: string; english: string };
  secondaryName: { arabic: string; english: string };
  floorNumber: number;
  buildingOrBlock: string;
  basePrice: string;
  apartmentType: string;
  streetCount: string;
  isAvailable: boolean;
  serialNumber: string;
  accountNumber: string;
  subscriptionNumber: string;
  size: string;
  ownerStatus: string;
  status: string;
  requestDate: string;
  requestNumber: string;
  meterNumber: number;
  projectSakPdfUrl: string;
  apartmentSakPdfUrl: string;
  apartmentSubDivisionPdfUrl: string;
  project: { id: number; name: { arabic: string; english: string }; projectIdentity: string } | null;
  template: { id: number; name: { arabic: string; english: string }; totalRooms?: number; sku?: string } | null;
  createdBy: { id: number; email: string } | null;
  updatedBy: { id: number; email: string } | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ApartmentResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Apartment;
}

interface DataField {
  label: string;
  value: string | number;
  dir?: string;
  isLink?: boolean;
  href?: string;
}

const statusConfig: Record<string, { dot: string; pill: string }> = {
  available: { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/40' },
  sold:      { dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/40' },
  reserved:  { dot: 'bg-amber-500',   pill: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/40' },
  reselling: { dot: 'bg-blue-500',    pill: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-800/40' },
};

export default function ViewApartment() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/apartments/:id');
  const [, setLocation] = useLocation();
  const id = params?.id;

  const { data: response, isLoading } = useQuery<ApartmentResponse>({
    queryKey: ['apartment', id],
    queryFn: async () => {
      const res = await api.get(`/apartment/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const apartment = response?.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return t('common.na');
    try { return format(new Date(dateString), 'MMM dd, yyyy'); }
    catch { return dateString; }
  };

  const formatPrice = (price: string) => {
    const num = Number(price);
    return isNaN(num) ? price : num.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  };

  /* ─── loading ─── */
  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#B39371]/10 rounded-md" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-md animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building className="w-6 h-6 text-[#B39371]" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ─── not found ─── */
  if (!apartment) {
    return (
      <Shell>
        <TopHeader />
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('apartments.notFound')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('apartments.notFoundDesc')}</p>
          <Link href="/apartments">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('common.back')}
            </button>
          </Link>
        </div>
      </Shell>
    );
  }

  /* ─── derived data ─── */
  const currentStatus = statusConfig[apartment.status] ?? statusConfig.reselling;

  const identificationFields: DataField[] = [
    { label: t('apartments.labels.majorNameEn'),        value: apartment.mainName.english },
    { label: t('apartments.labels.majorNameAr'),        value: apartment.mainName.arabic, dir: 'rtl' },
    { label: t('apartments.labels.secondaryNameEn'),    value: apartment.secondaryName.english || t('common.na') },
    { label: t('apartments.labels.secondaryNameAr'),    value: apartment.secondaryName.arabic  || t('common.na'), dir: 'rtl' },
    { label: t('apartments.labels.serialNumber'),       value: apartment.serialNumber       || t('common.na') },
    { label: t('apartments.labels.accountNumber'),      value: apartment.accountNumber      || t('common.na') },
    { label: t('apartments.labels.subscriptionNumber'), value: apartment.subscriptionNumber || t('common.na') },
  ];

  const locationFields: DataField[] = [
    { label: t('apartments.labels.buildingOrBlock'), value: apartment.buildingOrBlock || t('common.na') },
    { label: t('apartments.labels.floorNo'),         value: apartment.floorNumber },
    { label: t('apartments.labels.size'),            value: `${apartment.size} ${t('apartments.labels.sqmLabel')}` },
    { label: t('apartments.labels.meterNumber'),     value: apartment.meterNumber || '0' },
    { label: t('apartments.labels.streetCount'),     value: apartment.streetCount ? t(`apartments.streetCounts.${apartment.streetCount}`) : t('common.na') },
    {
      label: t('apartments.labels.linkedProject'),
      value: apartment.project ? (i18n.language === 'ar' ? apartment.project.name.arabic : apartment.project.name.english) : t('common.na'),
      isLink: !!apartment.project,
      href: apartment.project ? `/projects/${apartment.project.id}` : undefined,
    },
    {
      label: t('apartments.labels.linkedTemplate'),
      value: apartment.template ? (i18n.language === 'ar' ? apartment.template.name.arabic : apartment.template.name.english) : t('common.na'),
      isLink: !!apartment.template,
      href: apartment.template ? `/templates/${apartment.template.id}` : undefined,
    },
  ];

  const specSections = [
    { id: 'identification', icon: FileText, title: t('apartments.sections.identification'), data: identificationFields },
    { id: 'structure',      icon: Ruler,    title: t('apartments.sections.locational'),     data: locationFields },
  ];

  const documents = [
    { label: t('apartments.labels.projectSak'),    url: apartment.projectSakPdfUrl,            color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: t('apartments.labels.apartmentSak'),  url: apartment.apartmentSakPdfUrl,           color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-950/30' },
    { label: t('apartments.labels.subDivision'),   url: apartment.apartmentSubDivisionPdfUrl,   color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  ].filter(d => d.url);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const quickStats = [
    { icon: Layout,       label: t('apartments.unitType'),       value: t(`apartments.types.${apartment.apartmentType}`) },
    { icon: Ruler,        label: t('apartments.totalArea'),      value: `${apartment.size} ${t('apartments.labels.sqmLabel')}` },
    { icon: Building,     label: t('apartments.floorLevel'),     value: t('apartments.level', { level: apartment.floorNumber }) },
    { icon: CheckCircle2, label: t('apartments.ownershipStatus'),value: t(`apartments.owners.${apartment.ownerStatus}`) },
  ];

  const financials = [
    { label: t('apartments.valuation'),  value: `${formatPrice(apartment.basePrice)} ${t('common.sar')}`, accent: true },
    { label: t('apartments.requestId'),  value: apartment.requestNumber || t('common.pending') },
    { label: t('apartments.submission'), value: formatDate(apartment.requestDate) },
    { label: t('apartments.meterId'),    value: `#${apartment.meterNumber || '0000'}` },
  ];

  /* ─── render ─── */
  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ── Top bar ── */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link href="/apartments">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors shrink-0">
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                </button>
              </Link>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <Link href="/apartments" className="hover:text-[#B39371] transition-colors shrink-0">{t('apartments.title')}</Link>
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {i18n.language === 'ar' ? apartment.mainName.arabic : apartment.mainName.english}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {apartment.status === 'available' && (
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    const name = i18n.language === 'ar' ? apartment.mainName.arabic : apartment.mainName.english;
                    setLocation(`/contracts/new?apartmentId=${apartment.id}&apartmentName=${encodeURIComponent(name)}`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A1B1B] hover:bg-[#3a1515] text-white rounded-md text-sm font-medium transition-colors"
                >
                  <FilePlus2 className="w-4 h-4" />
                  {t('contracts.create')}
                </motion.button>
              )}
              <Link href={`/apartments/${apartment.id}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#B39371]" />
                  {t('common.edit')}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* ── Main grid: 2/3 + 1/3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Hero card */}
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">

                {/* Name + Price */}
                <div className="px-6 pt-6 pb-5 flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1',
                        currentStatus.pill
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-md', currentStatus.dot)} />
                        {t(`apartments.statuses.${apartment.status}`)}
                      </span>
                      <span className="text-xs font-mono text-gray-400">#{apartment.id.toString().padStart(4, '0')}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {i18n.language === 'ar' ? apartment.mainName.arabic : apartment.mainName.english}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1 italic">
                      {i18n.language === 'ar' ? apartment.mainName.english : apartment.mainName.arabic}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 p-4 rounded-md bg-[#F5F1ED] dark:bg-gray-800 border border-[#E8DDD3] dark:border-gray-700">
                    <p className="text-[10px] text-[#B39371] font-semibold uppercase tracking-widest mb-1">
                      {t('apartments.labels.basePrice')}
                    </p>
                    <p className="text-2xl font-black text-[#4A1B1B] dark:text-[#B39371] leading-none">
                      {formatPrice(apartment.basePrice)}
                    </p>
                    <p className="text-xs text-[#B39371] font-medium mt-0.5">{t('common.sar')}</p>
                  </div>
                </div>

                {/* Gallery placeholder */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 h-52">
                    {/* Main slot */}
                    <div className="col-span-2 relative rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-150 dark:from-gray-800 dark:to-gray-750 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                      <div
                        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 20px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 20px)' }}
                      />
                      <div className="relative flex flex-col items-center gap-2.5">
                        <div className="w-12 h-12 rounded-md bg-white/70 dark:bg-gray-900/60 flex items-center justify-center shadow-sm">
                          <ImageOff className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">{t('apartments.noImages')}</span>
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-md border border-gray-200/60 dark:border-gray-700/60">
                        <ImageOff className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t('apartments.noImages')}</span>
                      </div>
                    </div>
                    {/* Side slots */}
                    <div className="grid grid-rows-2 gap-3">
                      {[0, 1].map(i => (
                        <div key={i} className="relative rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-150 dark:from-gray-800 dark:to-gray-750 flex items-center justify-center border border-gray-200 dark:border-gray-700">
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

                {/* Quick stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 dark:border-gray-800 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800">
                  {quickStats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-4">
                      <div className="w-8 h-8 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center shrink-0">
                        <stat.icon className="w-4 h-4 text-[#B39371]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-tight">{stat.label}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spec cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specSections.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="w-7 h-7 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                        <section.icon className="w-3.5 h-3.5 text-[#B39371]" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {section.data.map((item, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <span className="text-[11px] text-gray-400 shrink-0 mt-0.5 w-28 leading-tight">{item.label}</span>
                          {item.isLink ? (
                            <Link href={item.href || '#'}>
                              <span className="text-xs font-medium text-[#B39371] hover:text-[#4A1B1B] dark:hover:text-[#d4b08a] transition-colors flex items-center gap-1 cursor-pointer">
                                {item.value}
                                <ArrowUpRight className="w-3 h-3 shrink-0" />
                              </span>
                            </Link>
                          ) : (
                            <span className={cn(
                              'text-xs font-medium text-gray-900 dark:text-white text-right break-words',
                              item.dir === 'rtl' && 'font-normal'
                            )}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Financial metrics */}
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <Tags className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('apartments.sections.economics')}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800">
                  {financials.map((item, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                      <p className={cn(
                        'text-sm font-semibold',
                        item.accent ? 'text-[#4A1B1B] dark:text-[#B39371]' : 'text-gray-900 dark:text-white'
                      )}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-5">

              {/* Availability */}
              <div className={cn(
                'rounded-md border p-4 flex items-center gap-3',
                apartment.isAvailable
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              )}>
                {apartment.isAvailable
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  : <XCircle      className="w-5 h-5 text-gray-400 shrink-0" />
                }
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('apartments.labels.isAvailable')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {apartment.isAvailable ? t('common.available') : t('common.notAvailable')}
                  </p>
                </div>
              </div>

              {/* Linkage */}
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <LinkIcon className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('apartments.structuralLinkage')}</h3>
                </div>

                <div className="p-4 space-y-4">
                  {/* Project */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">{t('apartments.masterProject')}</p>
                    {apartment.project ? (
                      <Link href={`/projects/${apartment.project.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/40 hover:bg-[#F5F1ED]/40 dark:hover:bg-gray-800 transition-all group cursor-pointer">
                          <div className="w-8 h-8 rounded-md bg-[#4A1B1B]/8 dark:bg-[#4A1B1B]/20 flex items-center justify-center shrink-0 bg-[#F5F1ED] dark:bg-gray-800">
                            <Building className="w-4 h-4 text-[#B39371]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {i18n.language === 'ar' ? apartment.project.name.arabic : apartment.project.name.english}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{apartment.project.projectIdentity}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </Link>
                    ) : (
                      <div className="p-3 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-400 italic">{t('apartments.noProjectLinked')}</p>
                      </div>
                    )}
                  </div>

                  {/* Template */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">{t('apartments.architecturalTemplate')}</p>
                    {apartment.template ? (
                      <div className="space-y-2">
                        <Link href={`/templates/${apartment.template.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:border-[#B39371]/40 hover:bg-[#F5F1ED]/40 dark:hover:bg-gray-800 transition-all group cursor-pointer">
                            <div className="w-8 h-8 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center shrink-0">
                              <Layout className="w-4 h-4 text-[#B39371]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#B39371] truncate">
                                {i18n.language === 'ar' ? apartment.template.name.arabic : apartment.template.name.english}
                              </p>
                              {apartment.template.totalRooms != null && (
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {apartment.template.totalRooms} {t('apartments.labels.rooms')}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                        </Link>
                        {apartment.template.sku && (
                          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] text-gray-400 font-medium">{t('apartments.designSku')}</span>
                            <span className="text-xs font-mono font-semibold text-[#B39371]">{apartment.template.sku}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-400 italic">{t('apartments.noTemplateLinked')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-[#B39371]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('apartments.sections.documents')}</h3>
                  </div>
                  {documents.length > 0 && (
                    <button className="flex items-center gap-1 text-xs text-[#B39371] hover:text-[#4A1B1B] transition-colors">
                      <Download className="w-3 h-3" />
                      {t('apartments.archiveAll')}
                    </button>
                  )}
                </div>

                <div className="p-3">
                  {documents.length > 0 ? (
                    <div className="space-y-1">
                      {documents.map((doc, i) => (
                        <a
                          key={i}
                          href={`${baseUrl}/${doc.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <div className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0', doc.bg)}>
                            <FileText className={cn('w-4 h-4', doc.color)} />
                          </div>
                          <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{doc.label}</span>
                          <Download className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B39371] transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FileText className="w-7 h-7 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">{t('apartments.noDocuments')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* History timeline */}
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-[#B39371]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('apartments.unitHistory')}</h3>
                </div>

                <div className="p-5">
                  <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-[5px] top-2 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />

                    <div className="space-y-5">
                      {/* Created */}
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-md bg-[#B39371] border-2 border-white dark:border-gray-900 shrink-0 mt-0.5 relative z-10" />
                        <div className="min-w-0 pb-1">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{t('apartments.recordCreated')}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('apartments.initialEntry', { date: formatDate(apartment.createdAt) })}
                          </p>
                          {apartment.createdBy && (
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{apartment.createdBy.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Updated / original state */}
                      {apartment.updatedAt ? (
                        <div className="flex gap-4">
                          <div className="w-3 h-3 rounded-md bg-emerald-400 border-2 border-white dark:border-gray-900 shrink-0 mt-0.5 relative z-10" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{t('apartments.lastModification')}</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                              {t('apartments.updatedOn', { date: formatDate(apartment.updatedAt) })}
                            </p>
                            {apartment.updatedBy && (
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{apartment.updatedBy.email}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-3 h-3 rounded-md bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 shrink-0 mt-0.5 relative z-10" />
                          <div>
                            <p className="text-[11px] text-gray-400 italic">{t('apartments.originalState')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
