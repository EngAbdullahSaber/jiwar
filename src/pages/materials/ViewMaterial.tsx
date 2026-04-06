import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Layers,
  Sparkles,
  Building2,
  Hash,
  Clock,
  CheckCircle2,
  FileEdit,
  Package,
  User,
  Calendar,
  FolderOpen,
  Paperclip,
  ExternalLink,
  Pencil,
  Loader2,
  AlertCircle,
  Tag,
  Phone,
  Mail,
  Scale,
  DollarSign,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MaterialDetail {
  id: number;
  name: string;
  supplier: {
    name: string;
    phoneNumber?: string;
    optionalPhoneNumber?: string;
    email?: string;
    quantityText?: string;
    price?: number;
    editPrice?: number;
    editPriceDate?: string;
    documents?: string[];
  };
  quantity: number;
  requestStatus: string;
  approvalStatus: string;
  files: string[];
  createdAt: string;
  updatedAt: string | null;
  project: {
    id: number;
    name: { arabic: string; english: string };
    projectIdentity: string;
  } | null;
  createdBy: { id: number; email: string } | null;
  updatedBy: { id: number; email: string } | null;
}

interface MaterialDetailResponse {
  code: number;
  data: MaterialDetail;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, type }: { status: string; type: 'request' | 'approval' }) => {
  const { t } = useTranslation();
  const requestConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: {
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      icon: Clock,
      label: t('materials.statuses.pending'),
    },
    ordered: {
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
      icon: Layers,
      label: t('materials.statuses.ordered'),
    },
    received: {
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      icon: CheckCircle2,
      label: t('materials.statuses.received'),
    },
  };

  const approvalConfig: Record<string, { color: string; icon: any; label: string }> = {
    draft: {
      color: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20',
      icon: FileEdit,
      label: t('materials.statuses.draft'),
    },
    approved: {
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      icon: CheckCircle2,
      label: t('materials.statuses.approved'),
    },
    finalized: {
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      icon: CheckCircle2,
      label: t('materials.statuses.finalized'),
    },
  };

  const map = type === 'request' ? requestConfig : approvalConfig;
  const config = map[status?.toLowerCase()] || map.draft || requestConfig.pending;
  const Icon = config.icon;

  return (
    <Badge className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold border gap-1.5', config.color)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
};

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[#4A1B1B]/6 dark:bg-[#B39371]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-[#4A1B1B] dark:text-[#B39371]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
  >
    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/60 to-white dark:from-gray-800/40 dark:to-gray-900 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#B39371]" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h2>
    </div>
    <div className="px-6 py-2">{children}</div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ViewMaterial() {
  const [, params] = useRoute('/materials/:id');
  const materialId = params?.id;
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { data, isLoading, isError } = useQuery<MaterialDetailResponse>({
    queryKey: ['material', materialId],
    queryFn: async () => {
      const res = await api.get(`/material/${materialId}`);
      return res.data;
    },
    enabled: !!materialId,
  });

  const material = data?.data;

  // ── Loading ──
  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#B39371] animate-spin" />
            <p className="text-sm text-gray-500">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Error / Not Found ──
  if (isError || !material) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-9 h-9 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('common.error')}</h2>
            <p className="text-sm text-gray-500 mb-6">{t('materials.empty')}</p>
            <Link href="/materials">
              <Button variant="outline" className="rounded-lg gap-2">
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                {t('materials.backToList')}
              </Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const projectName = isRtl
    ? material.project?.name?.arabic
    : material.project?.name?.english;

  const formatDate = (iso: string | null | undefined) =>
    iso
      ? new Date(iso).toLocaleDateString(isRtl ? 'ar-SA' : 'en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/materials" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-40" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Layers className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B39371]" />
                    <p className="text-[10px] font-semibold text-[#B39371] uppercase tracking-widest">
                      {t('materials.details')}
                    </p>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {material.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    #{material.id} · {material.supplier?.name}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/materials/${material.id}/edit`}>
                  <Button className="gap-2 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-lg hover:shadow-lg transition-all text-sm">
                    <Pencil className="w-4 h-4" />
                    {t('materials.edit')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── Status Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              {
                label: t('materials.quantity'),
                value: material.quantity.toLocaleString(),
                icon: Hash,
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-500/10',
              },
              {
                label: t('materials.attachments'),
                value: material.files?.length || 0,
                icon: Paperclip,
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-500/10',
              },
              {
                label: t('materials.requestStatus'),
                value: <StatusBadge status={material.requestStatus} type="request" />,
                icon: Tag,
                color: 'text-[#4A1B1B] dark:text-[#B39371]',
                bg: 'bg-[#4A1B1B]/5 dark:bg-[#B39371]/10',
              },
              {
                label: t('materials.approvalStatus'),
                value: <StatusBadge status={material.approvalStatus} type="approval" />,
                icon: CheckCircle2,
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex items-center gap-3"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">
                    {stat.label}
                  </p>
                  <div className="mt-0.5">{typeof stat.value === 'object' ? stat.value : (
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  )}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Main Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Material Details + Project */}
            <div className="lg:col-span-2 space-y-6">

              {/* Material Details */}
              <SectionCard icon={Package} title={t('materials.details')} delay={0.1}>
                <DetailRow icon={Layers} label={t('materials.name')} value={material.name} />
                <DetailRow icon={Hash} label={t('materials.quantity')} value={material.quantity.toLocaleString()} />
              </SectionCard>

              {/* Supplier Information */}
              {material.supplier && (
                <SectionCard icon={Building2} title={t('materials.supplier')} delay={0.12}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailRow icon={Building2} label={t('materials.supplierName')} value={material.supplier.name} />
                    <DetailRow icon={Mail} label={t('materials.supplierEmail')} value={material.supplier.email || '—'} />
                    <DetailRow icon={Phone} label={t('materials.supplierPhone')} value={material.supplier.phoneNumber || '—'} />
                    <DetailRow icon={Phone} label={t('materials.supplierOptionalPhone')} value={material.supplier.optionalPhoneNumber || '—'} />
                    <DetailRow icon={Scale} label={t('materials.quantityText')} value={material.supplier.quantityText || '—'} />
                    <DetailRow 
                      icon={DollarSign} 
                      label={t('materials.price')} 
                      value={material.supplier.price ? `${material.supplier.price.toLocaleString()} ${t('common.sar') || 'SAR'}` : '—'} 
                    />
                    {material.supplier.editPrice && (
                      <>
                        <DetailRow 
                          icon={DollarSign} 
                          label={t('materials.editPrice')} 
                          value={`${material.supplier.editPrice.toLocaleString()} ${t('common.sar') || 'SAR'}`} 
                        />
                        <DetailRow 
                          icon={Calendar} 
                          label={t('materials.editPriceDate')} 
                          value={formatDate(material.supplier.editPriceDate)} 
                        />
                      </>
                    )}
                  </div>

                  {/* Supplier Documents */}
                  {material.supplier.documents && material.supplier.documents.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        {t('materials.supplierDocuments')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {material.supplier.documents.map((doc, i) => {
                          const fileName = doc.split('/').pop() || doc;
                          return (
                            <a
                              key={i}
                              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#B39371]/40 transition-all group"
                            >
                              <Paperclip className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#B39371]" />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{fileName}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Project Information */}
              {material.project && (
                <SectionCard icon={FolderOpen} title={t('materials.linkedProject')} delay={0.15}>
                  <DetailRow
                    icon={FolderOpen}
                    label={t('materials.linkedProject')}
                    value={
                      <Link href={`/projects/${material.project.id}`} className="flex items-center gap-1 text-[#B39371] hover:text-[#9A7A5A] transition-colors">
                        {projectName}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    }
                  />
                  <DetailRow
                    icon={Tag}
                    label={t('materials.projectIdentity')}
                    value={
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono text-gray-700 dark:text-gray-300">
                        {material.project.projectIdentity}
                      </span>
                    }
                  />
                </SectionCard>
              )}

              {/* Files */}
              <SectionCard icon={Paperclip} title={t('materials.attachments')} delay={0.2}>
                {!material.files || material.files.length === 0 ? (
                  <div className="py-8 text-center">
                    <Paperclip className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {t('materials.empty')}
                    </p>
                  </div>
                ) : (
                  <div className="py-3 space-y-2">
                    {material.files.map((file, i) => {
                      const fileName = file.split('/').pop() || file;
                      const ext = fileName.split('.').pop()?.toLowerCase() || '';
                      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                      return (
                        <a
                          key={i}
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#B39371]/40 hover:bg-[#B39371]/5 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                            {isImage ? (
                              <Package className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Paperclip className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{fileName}</p>
                            <p className="text-xs text-gray-400 uppercase">{ext}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#B39371] transition-colors flex-shrink-0 rtl:rotate-180" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Right — Metadata */}
            <div className="space-y-6">
              <SectionCard icon={User} title={t('materials.auditInfo')} delay={0.25}>
                <DetailRow
                  icon={User}
                  label={t('materials.createdBy')}
                  value={material.createdBy?.email || '—'}
                />
                <DetailRow
                  icon={Calendar}
                  label={t('materials.createdAt')}
                  value={
                    <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(material.createdAt)}</span>
                  }
                />
                <DetailRow
                  icon={User}
                  label={t('materials.updatedBy')}
                  value={material.updatedBy?.email || '—'}
                />
                <DetailRow
                  icon={Calendar}
                  label={t('materials.lastUpdated')}
                  value={
                    <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(material.updatedAt)}</span>
                  }
                />
              </SectionCard>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-2"
              >
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {t('materials.quickActions')}
                </p>
                <Link href={`/materials/${material.id}/edit`}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#4A1B1B]/5 dark:bg-[#B39371]/10 text-[#4A1B1B] dark:text-[#B39371] hover:bg-[#4A1B1B]/10 dark:hover:bg-[#B39371]/20 transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" />
                    {t('materials.edit')}
                  </button>
                </Link>
                <Link href="/materials">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium mt-2">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                    {t('materials.backToList')}
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}
