import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from 'wouter';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  DollarSign,
  FileText,
  Loader2,
  Save,
  Paperclip,
  X,
  Gavel,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FileUpload } from '../../components/shared/FileUpload';
import { Shell } from '../../components/shared/Shell';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '../../components/shared/DatePicker';

const FormSection = ({ icon: Icon, title, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center shadow">
        <Icon className="w-4 h-4 text-[#B39371]" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

export default function UpdateStep() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/legality/:id/steps/:stepId/edit');
  const queryClient = useQueryClient();

  const legalityId = params?.id;
  const stepRecordId = params?.stepId ? Number(params.stepId) : null;

  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    details: '',
    fromDate: '',
    toDate: '',
    amount: '',
  });
  const [files, setFiles] = useState<string[]>([]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['legality', legalityId],
    queryFn: async () => {
      const resp = await api.get(`/legality/${legalityId}`);
      return resp.data;
    },
    enabled: !!legalityId,
  });

  const legality = response?.data;
  const stepRecord = legality?.legalitySteps?.find((item: any) => item.id === stepRecordId);
  const step = stepRecord?.step;
  const isDefault = step?.isDefault !== false;
  const isCompleted = step?.isUpdated || !!step?.toDate;

  useEffect(() => {
    if (step && !initialized) {
      setFormData({
        nameEn: step.name.english || '',
        nameAr: step.name.arabic || '',
        details: step.details || '',
        fromDate: step.fromDate ? step.fromDate.split('T')[0] : '',
        toDate: step.toDate ? step.toDate.split('T')[0] : '',
        amount: step.amount?.toString() || '',
      });
      setFiles(step.files || []);
      setInitialized(true);
    }
  }, [step, initialized]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await api.patch(`/legality/${legalityId}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success(t('common.successUpdate') || 'Step updated successfully', {
        icon: '✅',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' },
      });
      queryClient.invalidateQueries({ queryKey: ['legality', legalityId] });
      setLocation(`/legality/${legalityId}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.[i18n.language === 'ar' ? 'arabic' : 'english'] ||
          t('common.error'),
        { icon: '❌', style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' } }
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.fromDate &&
      formData.toDate &&
      new Date(formData.fromDate) > new Date(formData.toDate)
    ) {
      toast.error(t('common.startDateBeforeEndDate'));
      return;
    }

    const payload: any = {
      id: step.id,
      details: formData.details,
      fromDate: formData.fromDate || null,
      toDate: formData.toDate || null,
      amount: formData.amount ? Number(formData.amount) : null,
      files,
    };

    if (!isDefault) {
      payload.name = {
        english: formData.nameEn,
        arabic: formData.nameAr,
      };
    }

    updateMutation.mutate({ step: payload });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const stepDisplayName = i18n.language === 'ar'
    ? step?.name?.arabic
    : (step?.name?.english || '')
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B39371]" />
        </div>
      </Shell>
    );
  }

  if (!step) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('legality.failedLoad')}
              </h2>
              <Link href={`/legality/${legalityId}`}>
                <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium">
                  {t('legality.backToList')}
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <form onSubmit={handleSubmit}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/legality/${legalityId}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-40" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-[#B39371]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('legality.updateStep')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {stepDisplayName}
                    </h1>
                    <Badge
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-md font-medium',
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      )}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('legality.completed')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t('legality.pending')}
                        </span>
                      )}
                    </Badge>
                    {isDefault && (
                      <Badge className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {t('legality.profile.default')}
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step Name — only for non-default steps */}
            {!isDefault && (
              <FormSection icon={FileText} title={`${t('legality.labels.stepNameEn')} / ${t('legality.labels.stepNameAr')}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('legality.labels.stepNameEn')}
                    </Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                      placeholder={t('legality.placeholders.stepNameEn')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('legality.labels.stepNameAr')}
                    </Label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      dir="rtl"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl text-right"
                      placeholder={t('legality.placeholders.stepNameAr')}
                    />
                  </div>
                </div>
              </FormSection>
            )}

            {/* Details */}
            <FormSection icon={Info} title={t('legality.labels.details')}>
              <Textarea
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl min-h-[120px] resize-none"
                placeholder={t('legality.placeholders.details')}
              />
            </FormSection>

            {/* Dates & Amount */}
            <FormSection icon={CalendarIcon} title={`${t('legality.labels.startDate')} / ${t('legality.labels.endDate')} / ${t('legality.labels.amount')}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      {t('legality.labels.startDate')}
                    </Label>
                  </div>
                  <DatePicker
                    value={formData.fromDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, fromDate: date }))}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      {t('legality.labels.endDate')}
                    </Label>
                  </div>
                  <DatePicker
                    value={formData.toDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, toDate: date }))}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      {t('legality.labels.amount')}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                    placeholder={t('legality.placeholders.amount')}
                    min="0"
                  />
                </div>
              </div>
            </FormSection>

            {/* Attachments */}
            <FormSection icon={Paperclip} title={t('legality.labels.attachments')}>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {files.map((file, idx) => (
                    <motion.div
                      layout
                      key={idx}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#B39371]/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center text-[#B39371] shrink-0 border border-gray-100 dark:border-gray-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
                        {file.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <FileUpload
                  multiple
                  label={t('legality.placeholders.uploadFiles')}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  maxSizeMB={5}
                  onUploadSuccess={(url) => setFiles(prev => [...prev, url])}
                  onUploadMultipleSuccess={(urls) => setFiles(prev => [...prev, ...urls])}
                />
              </div>
            </FormSection>

            {/* Footer Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-end gap-3">
              <Link href={`/legality/${legalityId}`}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateMutation.isPending}
                  className="rounded-xl border-gray-200 dark:border-gray-700"
                >
                  {t('common.cancel')}
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('common.saving') || 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </div>

          </div>
        </form>
      </div>
    </Shell>
  );
}
