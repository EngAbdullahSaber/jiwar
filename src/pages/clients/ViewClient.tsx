import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useRoute } from 'wouter';
import {
  ArrowLeft,
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  CreditCard,
  FileText,
  AlertCircle,
  BadgeCheck,
   Hash,
  Landmark,
  Wallet,
  Receipt,
  Eye,
  Plus,
  Edit,
  PhoneCall,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { Shell } from '../../components/shared/Shell';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AddClientPaymentDialog } from '../../components/clients/AddClientPaymentDialog';

interface CommonEntity {
  id: number;
  name: { arabic: string; english: string };
}

interface Contract {
  id: number;
  type: string;
  contractDate: string;
  pdfUrl: string;
  apartment: {
    id: number;
    mainName: { arabic: string; english: string };
  };
  totalValue: number;
  totalPaid: number;
  remaining: number;
}

interface Client {
  id: number;
  fullName: string;
  type: string;
  phoneNumber: string;
  vatNumber: string | null;
  iqama: string | null;
  iban: string | null;
  email: string | null;
  physicalAddress: string | null;
  createdAt: string;
  updatedAt: string | null;
  country: CommonEntity | null;
  city: CommonEntity | null;
  bank: CommonEntity | null;
  createdBy: { id: number; email: string };
  updatedBy: { id: number; email: string } | null;
  totalPaid: number;
  totalRemaining: number;
  apartmentsCount: number;
  contracts: Contract[];
}

interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  receipt: string[];
  clientId: number;
  createdAt: string;
  contract: any | null;
  apartment?: {
    id: number;
    mainName: { arabic: string; english: string };
    floorNumber: number;
    buildingOrBlock: string;
    size: string;
  };
}

interface ClientResponse {
  code: number;
  data: Client;
}

interface PaymentsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Payment[];
  totalItems: number;
  totalPages: number;
}

// ─── Small info card ──────────────────────────────────────────────────────────
const InfoField = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A1B1B]/10 to-[#6B2727]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-[#B39371]" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={cn('text-sm font-medium break-all', accent ? 'text-[#B39371]' : 'text-gray-900 dark:text-white')}>
        {value ?? <span className="text-gray-400 font-normal italic">—</span>}
      </p>
    </div>
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ViewClient() {
  const [, params] = useRoute('/clients/:id');
  const { t, i18n } = useTranslation();
  const id = params?.id;
  const isRtl = i18n.language === 'ar';
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleShare = async (client: Client) => {
    const text = [
      client.fullName,
      client.phoneNumber,
      client.email,
      client.physicalAddress,
    ]
      .filter(Boolean)
      .join(' | ');

    if (navigator.share) {
      try {
        await navigator.share({ title: client.fullName, text });
      } catch (_) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      // toast would require import; a simple alert is fine as fallback
      alert(t('common.copiedToClipboard'));
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // ── Client query ──────────────────────────────────────────────────────────
  const { data: clientResp, isLoading, error } = useQuery<ClientResponse>({
    queryKey: ['client', id],
    queryFn: async () => {
      const res = await api.get(`/client/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ── Payments query ────────────────────────────────────────────────────────
  const { data: paymentsResp, isLoading: paymentsLoading } = useQuery<PaymentsResponse>({
    queryKey: ['client-payments', id],
    queryFn: async () => {
      const res = await api.get('/client-payment', {
        params: {
          clientId: id,
          page: 1,
          pageSize: 10,
          sortOption: 'newest'
        }
      });
      return res.data;
    },
    enabled: !!id,
  });

  const client = clientResp?.data;
  const payments = paymentsResp?.data ?? [];

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="h-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse" />
              ))}
            </div>
            <div className="h-72 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
          </div>
        </div>
      </Shell>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !client) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center max-w-md w-full"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('clients.errors.load')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t('clients.errors.notFound')}
            </p>
            <Link href="/clients">
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20">
                {t('common.backToList')}
              </button>
            </Link>
          </motion.div>
        </div>
      </Shell>
    );
  }

  const isCorporate = client.type !== 'individual';
  const typeBadgeClass = isCorporate
    ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400'
    : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400';

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/clients"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>

                {/* Avatar */}
                <Avatar className="w-14 h-14 border-2 border-white shadow-lg flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] text-white text-lg font-bold">
                    {client.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B39371]" />
                    <p className="text-xs font-semibold text-[#B39371] uppercase tracking-wider">
                      {t('clients.clientProfile')}
                    </p>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {client.fullName}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', typeBadgeClass)}>
                      {t(`clients.${client.type}`)}
                    </Badge>
                    <span className="text-xs text-gray-400">#{client.id}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* ── Quick contact buttons ── */}
                <a
                  href={`tel:${client.phoneNumber}`}
                  title={t('common.call')}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${client.phoneNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t('common.whatsapp')}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleShare(client)}
                  title={t('common.share')}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

                <button
                  onClick={() => setPaymentDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t('payments.addPayment')}
                </button>
                <Link href={`/clients/${client.id}/edit`}>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Edit className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── Stats row ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <StatCard
              icon={FileText}
              label={t('sidebar.apartments')}
              value={client.apartmentsCount || 0}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Wallet}
              label={t('clients.totalPaid')}
              value={`${client.totalPaid?.toLocaleString()} ${t('common.sar')}`}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={Receipt}
              label={t('clients.totalRemaining')}
              value={`${client.totalRemaining?.toLocaleString()} ${t('common.sar')}`}
              color="bg-gradient-to-br from-[#4A1B1B] to-[#6B2727]"
            />
          </motion.div>

          {/* ── Details grid ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Personal / Contact */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#B39371]" />
                {t('clients.personalInfo')}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <InfoField icon={Phone} label={t('clients.phoneNumber')} value={client.phoneNumber} />
                <InfoField icon={Mail} label={t('clients.email')} value={client.email} />
                <InfoField icon={Hash} label={t('clients.iqama')} value={client.iqama} />
              </div>
            </div>

            {/* Financial */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#B39371]" />
                {t('clients.financialInfo')}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <InfoField icon={BadgeCheck} label={t('clients.vatNumber')} value={client.vatNumber} accent />
                <InfoField icon={Landmark} label={t('clients.iban')} value={client.iban} accent />
                <InfoField
                  icon={Building2}
                  label={t('clients.bank')}
                  value={client.bank?.name?.[isRtl ? 'arabic' : 'english']}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 lg:col-span-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B39371]" />
                {t('clients.location')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InfoField
                  icon={MapPin}
                  label={t('clients.country')}
                  value={client.country?.name?.[isRtl ? 'arabic' : 'english']}
                />
                <InfoField
                  icon={MapPin}
                  label={t('clients.city')}
                  value={client.city?.name?.[isRtl ? 'arabic' : 'english']}
                />
                <InfoField icon={FileText} label={t('clients.address')} value={client.physicalAddress} />
              </div>
            </div>
          </motion.div>

          {/* ── Payment History ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B39371]" />
                {t('contracts.title')}
              </h2>
            </div>

            {(!client.contracts || client.contracts.length === 0) ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('clients.noContracts')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {client.contracts.map((contract, idx) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {contract.apartment.mainName[isRtl ? 'arabic' : 'english']}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {t(`contracts.types.${contract.type}`)} · {formatDate(contract.contractDate)}
                          </p>
                        </div>
                      </div>
                      {contract.pdfUrl && (
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}/${contract.pdfUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#B39371] hover:bg-[#B39371]/10 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('common.value')}</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {contract.totalValue.toLocaleString()} <span className="text-[10px] font-normal">{t('common.sar')}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('common.paid')}</p>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {contract.totalPaid.toLocaleString()} <span className="text-[10px] font-normal">{t('common.sar')}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t('common.remaining')}</p>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {contract.remaining.toLocaleString()} <span className="text-[10px] font-normal">{t('common.sar')}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Payment History ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#B39371]" />
                {t('clients.paymentHistory')}
              </h2>
              <button
                onClick={() => setPaymentDialogOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#B39371] hover:text-[#8B6951] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('payments.addPayment')}
              </button>
            </div>

            {paymentsLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('clients.noPayments')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((payment, idx) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.apartment
                            ? payment.apartment.mainName[isRtl ? 'arabic' : 'english']
                            : `${t('common.payment')} #${payment.id}`}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[11px] text-gray-400">{formatDate(payment.paymentDate)}</p>
                          {payment.apartment && (
                            <>
                              <span className="text-[10px] text-gray-300">|</span>
                              <p className="text-[11px] text-gray-400">
                                {t('common.bldg')}: {payment.apartment.buildingOrBlock} · {t('common.floor')}: {payment.apartment.floorNumber}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        +{payment.amount.toLocaleString()} {t('common.sar')}
                      </span>
                      {payment.receipt && payment.receipt.length > 0 && (
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}/${payment.receipt[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#B39371] hover:bg-[#B39371]/10 rounded-lg transition-all"
                          title={t('common.viewReceipt')}
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Audit footer ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-xs text-gray-400 px-1"
          >
            <span>
              {t('common.createdBy')}:{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">{client.createdBy.email}</span>
            </span>
            <span>·</span>
            <span>
              {t('common.createdAt')}:{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">{formatDate(client.createdAt)}</span>
            </span>
            {client.updatedAt && (
              <>
                <span>·</span>
                <span>
                  {t('common.lastUpdated')}:{' '}
                  <span className="font-medium text-gray-600 dark:text-gray-300">{formatDate(client.updatedAt)}</span>
                  {client.updatedBy && (
                    <span className="ml-1 text-[10px] text-gray-400">
                      ({client.updatedBy.email})
                    </span>
                  )}
                </span>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Payment Dialog ──────────────────────────────────────────────────── */}
      <AddClientPaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        clientId={client.id}
        clientName={client.fullName}
      />
    </Shell>
  );
}
