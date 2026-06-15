import { useState, useRef, useEffect } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from "wouter";
import {
  Trash2,
  PlusCircle,
  Gavel,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface EditStep {
  id: string;
  stepId?: number;
  name: string;
  nameAr: string;
  isDefault: boolean;
}

export default function UpdateLegality() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/legality/:id/edit');
  const queryClient = useQueryClient();
  const legalityId = params?.id;

  const [formData, setFormData] = useState({ nameEn: '', nameAr: '' });
  const [steps, setSteps] = useState<EditStep[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const stepsEndRef = useRef<HTMLDivElement>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['legality', legalityId],
    queryFn: async () => {
      const resp = await api.get(`/legality/${legalityId}`);
      return resp.data;
    },
    enabled: !!legalityId,
  });

  const legality = response?.data;

  useEffect(() => {
    if (legality && !initialized) {
      setFormData({
        nameEn: legality.name.english,
        nameAr: legality.name.arabic,
      });

      const mapped: EditStep[] = legality.legalitySteps.map((item: any) => ({
        id: `existing-${item.id}`,
        stepId: item.step.id,
        name: item.step.name.english
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        nameAr: item.step.name.arabic,
        isDefault: item.step.isDefault,
      }));
      setSteps(mapped);
      setInitialized(true);
    }
  }, [legality, initialized]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await api.patch(`/legality/${legalityId}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success(t('legality.updateSuccess') || 'Updated successfully', {
        icon: '✅',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' },
      });
      queryClient.invalidateQueries({ queryKey: ['legalities'] });
      queryClient.invalidateQueries({ queryKey: ['legality', legalityId] });
      setLocation('/legality');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.[i18n.language === 'ar' ? 'arabic' : 'english'] ||
          t('common.error'),
        {
          icon: '❌',
          style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' },
        }
      );
    },
  });

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', nameAr: '', isDefault: false },
    ]);
    setShouldScroll(true);
  };

  useEffect(() => {
    if (shouldScroll) {
      stepsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShouldScroll(false);
    }
  }, [steps.length, shouldScroll]);

  const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id));

  const updateStep = (id: string, field: 'name' | 'nameAr', value: string) => {
    const updated = steps.map(s => (s.id === id ? { ...s, [field]: value } : s));
    setSteps(updated);
    if (stepErrors[id] && value.trim()) {
      const step = updated.find(s => s.id === id);
      if (step && step.name.trim() && step.nameAr.trim()) {
        setStepErrors(prev => { const { [id]: _, ...rest } = prev; return rest; });
      }
    }
  };

  const hasEmptyStep = steps.some(s => !s.isDefault && (!s.name.trim() || !s.nameAr.trim()));
  const isFormInvalid =
    updateMutation.isPending || !formData.nameEn || !formData.nameAr || hasEmptyStep;

  const handleSubmit = () => {
    const newStepErrors: Record<string, boolean> = {};
    steps.forEach(s => {
      if (!s.isDefault && (!s.name.trim() || !s.nameAr.trim())) newStepErrors[s.id] = true;
    });
    if (Object.keys(newStepErrors).length > 0) {
      setStepErrors(newStepErrors);
    }
    if (isFormInvalid) return;

    const payload = {
      name: {
        arabic: formData.nameAr,
        english: formData.nameEn,
      },
      steps: steps.map(s => ({
        name: {
          arabic: s.nameAr,
          english: s.name,
        },
      })),
    };

    updateMutation.mutate(payload);
  };

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

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link
                href={`/legality/${legalityId}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('legality.updateLegality')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {legality
                    ? (i18n.language === 'ar' ? legality.name.arabic : legality.name.english)
                    : '...'}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-8 space-y-10">

              {/* Legality Name Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#4A1B1B] to-[#B39371] rounded-md" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('legality.basicInfo')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('legality.name')} ({t('common.english' as any) || 'English'}){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.nameEn}
                      onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      placeholder={t('legality.namePlaceholder') || 'e.g. Annual Compliance Audit 2024'}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-md focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('legality.name')} ({t('common.arabic' as any) || 'Arabic'}){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.nameAr}
                      onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder={t('legality.namePlaceholderAr') || 'مثال: تدقيق الامتثال السنوي 2024'}
                      dir="rtl"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-md focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Workflow Steps Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#4A1B1B] to-[#B39371] rounded-md" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('legality.workflowSteps')}
                    </h2>
                  </div>
                  <motion.button
                    onClick={addStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('legality.addNewStep')}
                  </motion.button>
                </div>

                {/* Steps list */}
                <div className="space-y-3 relative">
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                  <AnimatePresence mode="popLayout">
                    {steps.map((step, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key={step.id}
                        className="relative flex items-start gap-4"
                      >
                        {/* Step number */}
                        <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center text-white font-semibold">
                          <span>{index + 1}</span>
                        </div>

                        {/* Step fields */}
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 hover:border-[#B39371]/30 transition-all">
                          {/* Default badge */}
                          {step.isDefault && (
                            <div className="flex items-center gap-1.5 mb-4">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#B39371]" />
                              <span className="text-[10px] font-semibold text-[#B39371] uppercase tracking-wider">
                                {t('legality.profile.default')}
                              </span>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-4">

                              {/* English name */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {t('legality.stepNameEn')} {!step.isDefault && <span className="text-red-500">*</span>}
                                </label>
                                <Input
                                  value={step.name}
                                  onChange={e => updateStep(step.id, 'name', e.target.value)}
                                  placeholder={t('legality.stepNameEnPlaceholder')}
                                  disabled={step.isDefault}
                                  className={cn(
                                    "bg-white dark:bg-gray-900 h-10 rounded-md focus:ring-2 focus:border-[#B39371] disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400",
                                    !step.isDefault && stepErrors[step.id] && !step.name.trim()
                                      ? "border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20"
                                      : "border-gray-200 dark:border-gray-700 focus:ring-[#B39371]/20"
                                  )}
                                />
                                {!step.isDefault && stepErrors[step.id] && !step.name.trim() && (
                                  <p className="flex items-center gap-1 text-xs text-red-500">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    {t('common.fieldRequired')}
                                  </p>
                                )}
                              </div>

                              {/* Arabic name */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {t('legality.stepNameAr')} {!step.isDefault && <span className="text-red-500">*</span>}
                                </label>
                                <Input
                                  value={step.nameAr}
                                  onChange={e => updateStep(step.id, 'nameAr', e.target.value)}
                                  placeholder={t('legality.stepNameArPlaceholder')}
                                  dir="rtl"
                                  disabled={step.isDefault}
                                  className={cn(
                                    "bg-white dark:bg-gray-900 h-10 rounded-md focus:ring-2 focus:border-[#B39371] text-right disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400",
                                    !step.isDefault && stepErrors[step.id] && !step.nameAr.trim()
                                      ? "border-red-400 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20"
                                      : "border-gray-200 dark:border-gray-700 focus:ring-[#B39371]/20"
                                  )}
                                />
                                {!step.isDefault && stepErrors[step.id] && !step.nameAr.trim() && (
                                  <p className="flex items-center gap-1 text-xs text-red-500">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    {t('common.fieldRequired')}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Remove button (non-default steps only) */}
                            {!step.isDefault && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeStep(step.id)}
                                className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={stepsEndRef} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-end gap-4">
                <Link href={`/legality/${legalityId}`}>
                  <button className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                    {t('common.cancel')}
                  </button>
                </Link>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isFormInvalid}
                  whileHover={{ scale: isFormInvalid ? 1 : 1.02 }}
                  whileTap={{ scale: isFormInvalid ? 1 : 0.98 }}
                  className={cn(
                    'px-8 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all',
                    isFormInvalid
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl'
                  )}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      {t('legality.updateLegality')}
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Validation hint */}
          {(!formData.nameEn || !formData.nameAr || hasEmptyStep) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('legality.fillRequiredFields')}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Shell>
  );
}
