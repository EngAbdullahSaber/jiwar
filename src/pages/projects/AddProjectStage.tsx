import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
   Layers,
  X,
  PlusCircle,
   Sparkles,
  Clock,
  Briefcase,
   ArrowRightCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { cn } from "@/lib/utils";
import DatePicker from '../../components/shared/DatePicker';
import { FormActions } from '../../components/shared/FormActions';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRoute } from 'wouter';


interface Name {
  arabic: string;
  english: string;
}

interface SubStage {
  id: string;
  name: Name;
  estimateCost: number;
  fromDate: string;
  toDate: string;
}

interface Phase {
  id: string;
  name: Name;
  estimateCost: number;
  fromDate: string;
  toDate: string;
  subStages: SubStage[];
}


export default function AddProjectStage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/projects/:id/stages");
  const projectId = params?.id;
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [phases, setPhases] = useState<Phase[]>([
    {
      id: '1',
      name: { arabic: 'الحفر والأساسات', english: 'Excavation & Foundation' },
      estimateCost: 125000,
      fromDate: '2023-11-01',
      toDate: '2023-12-15',
      subStages: [
        {
          id: '1-1',
          name: { arabic: 'تنظيف الموقع', english: 'Site Clearing' },
          estimateCost: 15000,
          fromDate: '2023-11-01',
          toDate: '2023-11-05'
        }
      ]
    }
  ]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post(`/project/${projectId}/stages`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('common.success'));
      setLocation(`/projects/${projectId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.[i18n.language] || t('common.error'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out invalid phases (those with empty names)
    const validPhases = phases.filter(p => p.name.arabic.trim() !== '' || p.name.english.trim() !== '');
    if (validPhases.length === 0) {
      toast.error(t('projects.stages.validation.emptyPhases') || 'Please add at least one stage with a name');
      return;
    }
    
    // The backend expects ONE stage per request based on the user's curl
    // We will submit the first valid phase
    const phase = validPhases[0];
    
    // Filter out empty sub-stages
    const validSubStages = phase.subStages.filter(s => s.name.arabic.trim() !== '' || s.name.english.trim() !== '');
    
    // Check total cost rule: total sub-tasks <= parent cost
    const totalSubCost = validSubStages.reduce((sum, s) => sum + s.estimateCost, 0);
    if (totalSubCost > phase.estimateCost) {
      toast.error(t('projects.stages.validation.costExceeded') || 'Sub-tasks total cannot exceed stage cost');
      return;
    }

    // Check date range rule: sub-tasks must be within parent range
    for (const sub of validSubStages) {
      if (sub.fromDate < phase.fromDate || sub.toDate > phase.toDate) {
        toast.error(t('projects.stages.validation.dateRangeExceeded') || 'Sub-task timeline must be within the stage timeline');
        return;
      }
    }

    const payload = {


      name: {
        arabic: phase.name.arabic || phase.name.english,
        english: phase.name.english || phase.name.arabic
      },
      estimateCost: phase.estimateCost.toString(),
      fromDate: phase.fromDate,
      toDate: phase.toDate,
      subStages: validSubStages.map(s => ({
        ...s,
        estimateCost: s.estimateCost.toString()
      }))
    };
    
    mutation.mutate(payload);
  };



  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: { arabic: '', english: '' },
      estimateCost: 0,
      fromDate: '',
      toDate: '',
      subStages: []
    };

    setPhases([...phases, newPhase]);
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter(p => p.id !== id));
  };

  const addSubStage = (phaseId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          subStages: [
            ...p.subStages,
            { 
              id: Date.now().toString(), 
              name: { arabic: '', english: '' }, 
              estimateCost: 0, 
              fromDate: '', 
              toDate: '' 
            }
          ]

        };
      }
      return p;
    }));
  };

  const updatePhase = (phaseId: string, updates: Partial<Phase>) => {
    setPhases(prevPhases => prevPhases.map(p => {
      if (p.id === phaseId) {
        const updatedPhase = { ...p, ...updates };
        
        // Rule: If parent fromDate changes, sync it to the first sub-stage
        if (updates.fromDate && updatedPhase.subStages.length > 0) {
          updatedPhase.subStages = [
            { ...updatedPhase.subStages[0], fromDate: updates.fromDate },
            ...updatedPhase.subStages.slice(1)
          ];
        }
        
        return updatedPhase;
      }
      return p;
    }));
  };

  const updateSubStage = (phaseId: string, subId: string, updates: Partial<SubStage>) => {
    setPhases(prevPhases => prevPhases.map(p => {
      if (p.id === phaseId) {
        const updatedSubStages = p.subStages.map(s => {
          if (s.id === subId) {
            return { ...s, ...updates };
          }
          return s;
        });

        // Rule: If first sub-stage exists and fromDate changed, sync parent fromDate
        let parentFromDate = p.fromDate;
        if (updates.fromDate && p.subStages[0]?.id === subId) {
          parentFromDate = updates.fromDate;
        }

        return { 
          ...p, 
          subStages: updatedSubStages, 
          fromDate: parentFromDate
        };
      }
      return p;
    }));
  };

  const removeSubStage = (phaseId: string, subId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          subStages: p.subStages.filter(s => s.id !== subId)
        };
      }
      return p;
    }));
  };



  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Enhanced Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Layers className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-[#B39371] uppercase tracking-widest">
                    <Link href="/projects" className="hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors">{t('sidebar.projects')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-gray-300", isRtl && "rotate-180")} />
                    <span className="text-gray-500 dark:text-gray-400">{t('projects.stages.addStage')}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('projects.stages.addTitle')}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                  type="button"
                  onClick={addPhase}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-bold shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all group"
                >
                  <Plus className="w-5 h-5" />
                  {t('projects.stages.addNewStage')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#B39371] rounded-md" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('projects.stages.phasesTitle')}</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('projects.stages.phasesDescription')}</p>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {phases.map((phase, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={phase.id}
                    className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md  hover:border-[#B39371]/50 transition-all shadow-sm hover:shadow-xl dark:shadow-none"
                  >
                    {/* Phase Header Decorator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B39371] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-12 gap-6 items-end">
                        <div className="col-span-1 border-r border-gray-100 dark:border-gray-800 flex flex-col items-center">
                             <div className="w-10 h-10 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-[#4A1B1B] dark:text-[#B39371]">
                              {index + 1}
                             </div>
                        </div>

                        <div className="col-span-11 grid grid-cols-1 sm:grid-cols-12 gap-6">
                           <div className="sm:col-span-4 space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                              <Briefcase className="w-3 h-3" />
                              {t('projects.stages.stageName')}
                            </label>
                            <div className="space-y-2">
                              <div className="relative">
                                <Input 
                                  value={phase.name.arabic} 
                                  placeholder={t('projects.stages.nameArabic')} 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 h-10 rounded-md focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm"
                                  onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { 
                                    ...p, 
                                    name: { ...p.name, arabic: e.target.value }
                                  } : p))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-gray-300 uppercase">Ar</span>
                              </div>
                              <div className="relative">
                                <Input 
                                  value={phase.name.english} 
                                  placeholder={t('projects.stages.nameEnglish')} 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 h-10 rounded-md focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm"
                                  onChange={(e) => updatePhase(phase.id, { 
                                    name: { ...phase.name, english: e.target.value }
                                  })}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-gray-300 uppercase">En</span>
                              </div>
                            </div>
                          </div>
                          <div className="sm:col-span-3 space-y-2">
                             <div className="flex items-center justify-between ml-1">
                               <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                {t('projects.stages.estCost')}
                              </label>
                             </div>
                            <div className="relative">
                              <Input 
                                type="number"
                                value={phase.estimateCost} 
                                placeholder="0.00" 
                                className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 h-12 rounded-md focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 pr-12 rtl:pr-4 rtl:pl-12"
                                onChange={(e) => updatePhase(phase.id, { estimateCost: Number(e.target.value) })}
                              />
                              <span className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#B39371]">SAR</span>
                            </div>
                          </div>
                          <div className="sm:col-span-4 space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                              <Clock className="w-3 h-3" />
                              {t('projects.stages.timeline')}
                            </label>
                            <DatePicker
                              mode="range"
                              value={phase.fromDate && phase.toDate ? `${phase.fromDate} to ${phase.toDate}` : ""} 
                              placeholder={t('projects.stages.timeline')}
                              onChange={(val) => {
                                const [start, end] = val.split(' to ');
                                updatePhase(phase.id, { fromDate: start || '', toDate: end || '' });
                              }}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button 
                              type="button"
                              onClick={() => removePhase(phase.id)}
                              className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sub-stages Section */}
                      <div className="relative bg-gray-50/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-md p-6 ml-0 sm:ml-16 space-y-6 border border-gray-100/50 dark:border-gray-700/30">
                        <div className="absolute top-6 bottom-6 -left-8 rtl:-left-auto rtl:-right-8 w-px bg-gradient-to-b from-[#B39371]/0 via-[#B39371]/30 to-[#B39371]/0 hidden sm:block" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{t('projects.stages.subTasksTitle')}</h3>
                              {phase.estimateCost > 0 && (
                                <p className={cn(
                                  "text-[10px] font-medium",
                                  phase.subStages.reduce((sum, s) => sum + s.estimateCost, 0) > phase.estimateCost 
                                    ? "text-red-500" 
                                    : "text-gray-400 dark:text-gray-500"
                                )}>
                                  {t('projects.stages.remainingBudget')}: {(phase.estimateCost - phase.subStages.reduce((sum, s) => sum + s.estimateCost, 0)).toLocaleString()} SAR
                                </p>
                              )}
                            </div>
                            <button 
                              type="button"
                              onClick={() => addSubStage(phase.id)}
                              className="flex items-center gap-2 text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] dark:hover:text-white transition-colors uppercase tracking-widest group"
                            >
                              <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              {t('projects.stages.addSubStage')}
                            </button>
                        </div>

                        <AnimatePresence mode="popLayout">
                          {phase.subStages.length > 0 ? (
                            phase.subStages.map((sub) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                key={sub.id} 
                                className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                              >
                                <div className="sm:col-span-4 space-y-2">
                                  <div className="relative">
                                    <Input 
                                      value={sub.name.arabic} 
                                      placeholder={t('projects.stages.nameArabic')} 
                                      className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 h-9 rounded-md focus:border-[#B39371] transition-all text-xs dark:text-gray-100 placeholder:text-gray-500"
                                      onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { 
                                        ...p, 
                                        subStages: p.subStages.map(s => s.id === sub.id ? { 
                                          ...s, 
                                          name: { ...s.name, arabic: e.target.value }
                                        } : s) 
                                      } : p))}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[7px] font-bold text-gray-300 uppercase">Ar</span>
                                  </div>
                                  <div className="relative">
                                    <Input 
                                      value={sub.name.english} 
                                      placeholder={t('projects.stages.nameEnglish')} 
                                      className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 h-9 rounded-md focus:border-[#B39371] transition-all text-xs dark:text-gray-100 placeholder:text-gray-500"
                                      onChange={(e) => updateSubStage(phase.id, sub.id, { 
                                        name: { ...sub.name, english: e.target.value }
                                      })}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[7px] font-bold text-gray-300 uppercase">En</span>
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <Input 
                                      type="number"
                                      value={sub.estimateCost} 
                                      placeholder={t('projects.stages.cost')} 
                                      className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 h-10 rounded-md focus:border-[#B39371] transition-all text-sm font-medium dark:text-gray-100 pr-12 rtl:pr-4 rtl:pl-12"
                                      onChange={(e) => updateSubStage(phase.id, sub.id, { estimateCost: Number(e.target.value) })}
                                    />
                                    <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-[#B39371]">SAR</span>
                                  </div>
                                </div>
                                <div className="sm:col-span-4">
                                  <DatePicker 
                                    mode="range"
                                    value={sub.fromDate && sub.toDate ? `${sub.fromDate} to ${sub.toDate}` : ""} 
                                    placeholder={t('projects.stages.timelineLabel')} 
                                    className="h-10 text-xs sm:text-sm"
                                    onChange={(val) => {
                                      const [start, end] = val.split(' to ');
                                      updateSubStage(phase.id, sub.id, { fromDate: start || '', toDate: end || '' });
                                    }}
                                  />
                                </div>
                                <div className="sm:col-span-1 flex justify-end">
                                  <button 
                                    type="button"
                                    onClick={() => removeSubStage(phase.id, sub.id)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-all rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="py-4 text-center">
                              <p className="text-xs text-gray-400 italic">{t('projects.stages.noSubStages')}</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Large Add Phase Button */}
              <motion.button 
                type="button"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={addPhase}
                className="w-full py-12 bg-white dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-md flex flex-col items-center justify-center gap-4 hover:border-[#B39371] hover:bg-gray-50/50 dark:hover:bg-[#B39371]/5 transition-all group"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-300 group-hover:scale-110 group-hover:bg-[#F5F1ED] dark:group-hover:bg-[#B39371]/20 group-hover:text-[#4A1B1B] dark:group-hover:text-[#B39371] transition-all duration-300 shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] group-hover:text-[#4A1B1B] dark:group-hover:text-[#B39371] transition-colors">
                    {t('projects.stages.addPhase')}
                  </p>
                </div>
              </motion.button>
            </div>
          </div>

          <FormActions
            onCancel={() => setLocation('/projects')}
            submitText={t('projects.stages.addStage')}
            isSubmitting={mutation.isPending}
            submitIcon={<ArrowRightCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            className="  !mt-12"
          />
        </form>
      </div>
    </Shell>
  );
}
