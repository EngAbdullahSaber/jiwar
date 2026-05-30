import { useState, useEffect } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from 'wouter';
import {
  ArrowLeft,
  GitBranch,
  Sparkles,
  Type,
  DollarSign,
  Plus,
  Trash2,
  Layers,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormActions } from '../../components/shared/FormActions';
import { Shell } from '../../components/shared/Shell';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/shared/DatePicker';
import { FormField } from '../../components/shared/FormField';
import { scrollToFirstError } from '@/lib/utils';

const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#B39371]" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

interface SubStage {
  name: { arabic: string; english: string };
  estimateCost: string;
  fromDate: string;
  toDate: string;
}

const emptySubStage = (): SubStage => ({
  name: { arabic: '', english: '' },
  estimateCost: '',
  fromDate: '',
  toDate: '',
});

export default function UpdateStage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/stages/:id/edit');
  const stageId = params?.id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: { arabic: '', english: '' },
    estimateCost: '',
    fromDate: '',
    toDate: '',
  });

  const [subStages, setSubStages] = useState<SubStage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: stageData, isLoading } = useQuery({
    queryKey: ['stage', stageId],
    queryFn: async () => {
      const res = await api.get(`/stage/${stageId}`);
      return res.data;
    },
    enabled: !!stageId,
  });

  useEffect(() => {
    if (stageData?.data) {
      const s = stageData.data;
      setFormData({
        name: { arabic: s.name?.arabic || '', english: s.name?.english || '' },
        estimateCost: s.estimateCost?.toString() || '',
        fromDate: s.fromDate || '',
        toDate: s.toDate || '',
      });
      if (s.children?.length) {
        setSubStages(
          s.children.map((c: any) => ({
            name: { arabic: c.name?.arabic || '', english: c.name?.english || '' },
            estimateCost: c.estimateCost?.toString() || '',
            fromDate: c.fromDate || '',
            toDate: c.toDate || '',
          }))
        );
      }
    }
  }, [stageData]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: formData.name,
        estimateCost: parseFloat(formData.estimateCost),
        fromDate: formData.fromDate,
        toDate: formData.toDate,
      };
      if (subStages.length > 0) {
        payload.subStages = subStages.map(s => ({
          name: s.name,
          estimateCost: parseFloat(s.estimateCost),
          fromDate: s.fromDate,
          toDate: s.toDate,
        }));
      }
      const res = await api.patch(`/stage/${stageId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t('stages.updateSuccess'), {
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' },
      });
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      queryClient.invalidateQueries({ queryKey: ['stage', stageId] });
      setLocation('/stages');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'), {
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, estimateCost, fromDate, toDate } = formData;
    const newErrors: Record<string, string> = {};
    if (!name.english) newErrors.nameEn = t('common.fieldRequired');
    if (!name.arabic) newErrors.nameAr = t('common.fieldRequired');
    if (!estimateCost) newErrors.estimateCost = t('common.fieldRequired');
    if (!fromDate) newErrors.fromDate = t('common.fieldRequired');
    if (!toDate) newErrors.toDate = t('common.fieldRequired');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    for (const [i, s] of subStages.entries()) {
      if (!s.name.arabic || !s.name.english || !s.estimateCost || !s.fromDate || !s.toDate) {
        toast.error(`${t('stages.subStageIncomplete')} #${i + 1}`, {
          style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' },
        });
        return;
      }
    }
    updateMutation.mutate();
  };

  const addSubStage = () => setSubStages(prev => [...prev, emptySubStage()]);

  const removeSubStage = (idx: number) =>
    setSubStages(prev => prev.filter((_, i) => i !== idx));

  const updateSubStage = (idx: number, patch: Partial<SubStage>) =>
    setSubStages(prev =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );

  const updateSubStageName = (idx: number, field: 'arabic' | 'english', value: string) =>
    setSubStages(prev =>
      prev.map((s, i) =>
        i === idx ? { ...s, name: { ...s.name, [field]: value } } : s
      )
    );

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#B39371]" />
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">

          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link
                href="/stages"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('stages.management')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('stages.edit')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('stages.editDescription')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Stage Details */}
            <FormSection
              icon={GitBranch}
              title={t('stages.sections.details')}
              description={t('stages.sections.detailsDesc')}
              delay={0.1}
            >
              <div className="space-y-6">

                {/* Stage Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={t('stages.labels.nameEn')} required error={errors.nameEn}>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={t('stages.placeholders.nameEn')}
                        value={formData.name.english}
                        onChange={e => {
                          setFormData(prev => ({ ...prev, name: { ...prev.name, english: e.target.value } }));
                          if (errors.nameEn) setErrors(p => { const { nameEn, ...r } = p; return r; });
                        }}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      />
                    </div>
                  </FormField>
                  <FormField label={t('stages.labels.nameAr')} required error={errors.nameAr}>
                    <div className="relative">
                      <Type className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={t('stages.placeholders.nameAr')}
                        value={formData.name.arabic}
                        onChange={e => {
                          setFormData(prev => ({ ...prev, name: { ...prev.name, arabic: e.target.value } }));
                          if (errors.nameAr) setErrors(p => { const { nameAr, ...r } = p; return r; });
                        }}
                        className="pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                        dir="rtl"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Estimate Cost */}
                <FormField label={t('stages.labels.estimateCost')} required error={errors.estimateCost}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('stages.placeholders.estimateCost')}
                      value={formData.estimateCost}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, estimateCost: e.target.value }));
                        if (errors.estimateCost) setErrors(p => { const { estimateCost, ...r } = p; return r; });
                      }}
                      className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={t('common.startDate')} required error={errors.fromDate}>
                    <DatePicker
                      value={formData.fromDate}
                      onChange={date => {
                        setFormData(prev => ({ ...prev, fromDate: date }));
                        if (errors.fromDate) setErrors(p => { const { fromDate, ...r } = p; return r; });
                      }}
                      placeholder={t('stages.placeholders.fromDate')}
                    />
                  </FormField>
                  <FormField label={t('common.endDate')} required error={errors.toDate}>
                    <DatePicker
                      value={formData.toDate}
                      onChange={date => {
                        setFormData(prev => ({ ...prev, toDate: date }));
                        if (errors.toDate) setErrors(p => { const { toDate, ...r } = p; return r; });
                      }}
                      placeholder={t('stages.placeholders.toDate')}
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>

            {/* Sub-stages */}
            <FormSection
              icon={Layers}
              title={t('stages.sections.subStages')}
              description={t('stages.sections.subStagesDesc')}
              delay={0.2}
            >
              <div className="space-y-4">
                <AnimatePresence>
                  {subStages.map((sub, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.18 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-5 space-y-5 bg-gray-50/50 dark:bg-gray-800/30"
                    >
                      {/* Sub-stage header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#B39371]/15 text-[#4A1B1B] dark:text-[#B39371] text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('stages.subStageLabel')} {idx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSubStage(idx)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Sub-stage Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label={t('stages.labels.nameEn')} required>
                          <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder={t('stages.placeholders.nameEn')}
                              value={sub.name.english}
                              onChange={e => updateSubStageName(idx, 'english', e.target.value)}
                              className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                            />
                          </div>
                        </FormField>
                        <FormField label={t('stages.labels.nameAr')} required>
                          <div className="relative">
                            <Type className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder={t('stages.placeholders.nameAr')}
                              value={sub.name.arabic}
                              onChange={e => updateSubStageName(idx, 'arabic', e.target.value)}
                              className="pr-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                              dir="rtl"
                            />
                          </div>
                        </FormField>
                      </div>

                      {/* Sub-stage Cost */}
                      <FormField label={t('stages.labels.estimateCost')} required>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t('stages.placeholders.estimateCost')}
                            value={sub.estimateCost}
                            onChange={e => updateSubStage(idx, { estimateCost: e.target.value })}
                            className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                          />
                        </div>
                      </FormField>

                      {/* Sub-stage Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label={t('common.startDate')} required>
                          <DatePicker
                            value={sub.fromDate}
                            onChange={date => updateSubStage(idx, { fromDate: date })}
                            placeholder={t('stages.placeholders.fromDate')}
                          />
                        </FormField>
                        <FormField label={t('common.endDate')} required>
                          <DatePicker
                            value={sub.toDate}
                            onChange={date => updateSubStage(idx, { toDate: date })}
                            placeholder={t('stages.placeholders.toDate')}
                          />
                        </FormField>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add sub-stage button */}
                <button
                  type="button"
                  onClick={addSubStage}
                  className="w-full h-11 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-[#B39371] hover:text-[#B39371] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('stages.addSubStage')}
                </button>
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/stages')}
              isSubmitting={updateMutation.isPending}
              submitText={t('common.save')}
              submittingText={t('common.processing')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
