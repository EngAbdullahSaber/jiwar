import { useState, useRef, useEffect } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
   Trash2, 
  Lock,
  PlusCircle,
  Gavel,
  CheckCircle2,
   ArrowLeft,
  Sparkles,
  AlertCircle,
 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  name: string;
  nameAr?: string;
  isLocked: boolean;
  isDefault?: boolean;
}

interface DefaultStep {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
}

interface DefaultStepsResponse {
  code: number;
  data: DefaultStep[];
}

export default function CreateLegality() {
  const { t,  i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: ''
  });
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const stepsEndRef = useRef<HTMLDivElement>(null);

  const { isLoading: isLoadingDefaults } = useQuery<DefaultStepsResponse>({
    queryKey: ['default-steps'],
    queryFn: async () => {
      const response = await api.get('/legality/steps/default');
      const defaultSteps: WorkflowStep[] = response.data.data.map((step: DefaultStep) => ({
        id: `default-${step.id}`,
        name: step.name.english.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        nameAr: step.name.arabic,
        isLocked: true,
        isDefault: true
      }));
      setSteps(defaultSteps);
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/legality', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('legality.createSuccess'), {
        icon: '🎉',
        style: {
          borderRadius: '1rem',
          background: '#10b981',
          color: '#fff',
        }
      });
      queryClient.invalidateQueries({ queryKey: ['legalities'] });
      setLocation('/legality');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.[i18n.language === 'ar' ? 'arabic' : 'english'] || t('common.error'), {
        icon: '❌',
        style: {
          borderRadius: '1rem',
          background: '#ef4444',
          color: '#fff',
        }
      });
    }
  });

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: '',
      nameAr: '',
      isLocked: false,
      isDefault: false
    };
    setSteps([...steps, newStep]);
    setShouldScroll(true);
  };

  useEffect(() => {
    if (shouldScroll) {
      stepsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShouldScroll(false);
    }
  }, [steps.length, shouldScroll]);

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: 'name' | 'nameAr', value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const defaultEnNames = steps.filter(s => s.isDefault).map(s => s.name.toLowerCase());
  const defaultArNames = steps.filter(s => s.isDefault).map(s => s.nameAr?.toLowerCase() || "");
  
  const hasConflict = steps.some(s => 
    !s.isDefault && (
      (s.name && defaultEnNames.includes(s.name.toLowerCase())) || 
      (s.nameAr && defaultArNames.includes(s.nameAr.toLowerCase()))
    )
  );

  const isFormInvalid = hasConflict || createMutation.isPending || !formData.nameEn || !formData.nameAr;

  const handleSubmit = () => {
    if (isFormInvalid) return;

    const payload = {
      name: {
        arabic: formData.nameAr,
        english: formData.nameEn
      },
      steps: steps
        .filter(s => !s.isDefault)
        .map(s => ({
          name: {
            arabic: s.nameAr || s.name,
            english: s.name
          }
        }))
    };

    createMutation.mutate(payload);
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Breadcrumb & Header */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/legality" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('legality.create')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('legality.newLegality')}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-8 space-y-10">
              
              {/* Legality Name Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#4A1B1B] to-[#B39371] rounded-full" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('legality.basicInfo')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('legality.name')} ({t('common.english' as any) || 'English'}) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={formData.nameEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      placeholder={t('legality.namePlaceholder') || "e.g. Annual Compliance Audit 2024"} 
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('legality.name')} ({t('common.arabic' as any) || 'Arabic'}) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder={t('legality.namePlaceholderAr') || "مثال: تدقيق الامتثال السنوي 2024"} 
                      dir="rtl"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Workflow Steps Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#4A1B1B] to-[#B39371] rounded-full" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('legality.workflowSteps')}
                    </h2>
                  </div>
                  
                  <motion.button 
                    onClick={addStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('legality.addNewStep')}
                  </motion.button>
                </div>

                {/* Steps List */}
                <div className="space-y-3 relative">
                  {/* Connector Line */}
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                  <AnimatePresence mode="popLayout">
                    {isLoadingDefaults ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#B39371]" />
                      </div>
                    ) : (
                      steps.map((step, index) => {
                        const hasConflictStep = !step.isDefault && (
                          (step.name && defaultEnNames.includes(step.name.toLowerCase())) ||
                          (step.nameAr && defaultArNames.includes(step.nameAr.toLowerCase()))
                        );

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key={step.id}
                            className="relative flex items-start gap-4"
                          >
                            {/* Step Number */}
                            <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center text-white font-semibold">
                              {step.isLocked ? (
                                <Lock className="w-5 h-5 text-[#B39371]" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>

                            {/* Step Content */}
                            <div className={cn(
                              "flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border transition-all",
                              hasConflictStep 
                                ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10" 
                                : "border-gray-200 dark:border-gray-700 hover:border-[#B39371]/30"
                            )}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-4">
                                  {/* English Step Name */}
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                      {t('legality.stepNameEn')}
                                    </label>
                                    <Input 
                                      value={step.name}
                                      onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                      placeholder={t('legality.stepNameEnPlaceholder')}
                                      disabled={step.isLocked}
                                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                                    />
                                  </div>

                                  {/* Arabic Step Name (for custom steps) */}
                                  {!step.isDefault && (
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {t('legality.stepNameAr')}
                                      </label>
                                      <Input 
                                        value={step.nameAr}
                                        onChange={(e) => updateStep(step.id, 'nameAr', e.target.value)}
                                        placeholder={t('legality.stepNameArPlaceholder')}
                                        dir="rtl"
                                        className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] text-right"
                                      />
                                    </div>
                                  )}

                                  {/* Default Step Arabic Display */}
                                  {step.isDefault && step.nameAr && (
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {t('legality.stepNameAr')}
                                      </label>
                                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-10 rounded-lg px-3 flex items-center text-sm text-gray-600 dark:text-gray-400" dir="rtl">
                                        {step.nameAr}
                                      </div>
                                    </div>
                                  )}

                                  {/* Conflict Warning */}
                                  {hasConflictStep && (
                                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                      <span>{t('legality.conflictWarning')}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Delete Button (for custom steps only) */}
                                {!step.isDefault && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeStep(step.id)}
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Default Steps Info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#B39371]/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-[#B39371]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {t('legality.defaultSteps')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('legality.defaultStepsDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-end gap-4">
                <Link href="/legality">
                  <button 
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </Link>
                <motion.button 
                  onClick={handleSubmit}
                  disabled={isFormInvalid}
                  whileHover={{ scale: isFormInvalid ? 1 : 1.02 }}
                  whileTap={{ scale: isFormInvalid ? 1 : 0.98 }}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all",
                    isFormInvalid
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl"
                  )}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      {t('legality.create')}
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Form Validation Summary */}
          {(!formData.nameEn || !formData.nameAr) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('legality.fillRequiredFields')}
                </p>
              </div>
            </motion.div>
          )}
          <div ref={stepsEndRef} />
        </div>
      </div>
    </Shell>
  );
}