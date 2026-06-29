import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  DollarSign,
  FileText,
  Loader2,
  Save,
  Paperclip,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FileUpload } from '../../components/shared/FileUpload';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '../../components/shared/DatePicker';

interface UpdateStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  legalityId: string | number;
  stepData: any;
}

export function UpdateStepDialog({
  isOpen,
  onClose,
  legalityId,
  stepData,
}: UpdateStepDialogProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const isDefault = stepData?.step?.isDefault !== false;
  const isCompleted = stepData?.step?.isCompleted ?? false;

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    details: '',
    fromDate: '',
    toDate: '',
    amount: '',
    isCompleted: false,
  });
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (stepData) {
      setFormData({
        nameEn: stepData.step.name.english || '',
        nameAr: stepData.step.name.arabic || '',
        details: stepData.step.details || '',
        fromDate: stepData.step.fromDate ? stepData.step.fromDate.split('T')[0] : '',
        toDate: stepData.step.toDate ? stepData.step.toDate.split('T')[0] : '',
        amount: stepData.step.amount?.toString() || '',
        isCompleted: stepData.step.isCompleted ?? false,
      });
      setFiles(stepData.step.files || []);
    }
  }, [stepData, isOpen]);

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
      queryClient.invalidateQueries({ queryKey: ['legality', legalityId.toString()] });
      onClose();
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

    if (formData.fromDate && formData.toDate && new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error(t('common.startDateBeforeEndDate'));
      return;
    }

    const step: any = {
      id: stepData.step.id,
      details: formData.details,
      fromDate: formData.fromDate || null,
      toDate: formData.toDate || null,
      amount: formData.amount ? Number(formData.amount) : null,
      files,
      isCompleted: formData.isCompleted,
    };

    if (!isDefault) {
      step.name = {
        english: formData.nameEn,
        arabic: formData.nameAr,
      };
    }

    updateMutation.mutate({ step });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const stepDisplayName = i18n.language === 'ar'
    ? stepData?.step?.name?.arabic
    : (stepData?.step?.name?.english || '')
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl p-0 overflow-visible"
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement)?.closest?.('.flatpickr-calendar')) {
            e.preventDefault();
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-30" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('legality.updateStep')}
                  </DialogTitle>
                  <Badge
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-md font-medium',
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
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
                    <Badge className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {t('legality.profile.default')}
                      </span>
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {stepDisplayName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">

            {/* Step Name — shown only for non-default steps */}
            {!isDefault && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('legality.labels.stepNameEn')} / {t('legality.labels.stepNameAr')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400">{t('legality.labels.stepNameEn')}</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg text-sm"
                      placeholder={t('legality.placeholders.stepNameEn')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400">{t('legality.labels.stepNameAr')}</Label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      dir="rtl"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg text-sm text-right"
                      placeholder={t('legality.placeholders.stepNameAr')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Info className="w-3.5 h-3.5" />
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  {t('legality.labels.details')}
                </Label>
              </div>
              <Textarea
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl min-h-[90px] resize-none text-sm"
                placeholder={t('legality.placeholders.details')}
              />
            </div>

            {/* Dates + Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-xl"
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
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-xl"
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
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-xl text-sm"
                  placeholder={t('legality.placeholders.amount')}
                  min="0"
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    {t('legality.labels.attachments')}
                  </Label>
                </div>
                {files.length > 0 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                    {files.length} {t('legality.labels.files')}
                  </span>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {files.map((file, idx) => (
                  <motion.div
                    layout
                    key={idx}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#B39371]/40 transition-colors"
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
          </div>

          {/* Mark as Completed */}
          <div className="px-6 pb-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="dialog-isCompleted"
              checked={formData.isCompleted}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isCompleted: e.target.checked }))
              }
              className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="dialog-isCompleted" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t('legality.markAsCompleted')}
            </label>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              {t('common.cancel')}
            </Button>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
