import { TopHeader } from '../components/TopHeader';
import { Link, useRoute } from "wouter";
import { 
  Building2, 
  ChevronRight, 
   Clock, 
   FileText, 
  Download,
   ArrowUpRight,
  Maximize2,
  Info,
  Wallet,
  Compass,
   Layers
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shell } from '../components/shared/Shell';
import { useTranslation } from 'react-i18next';
 import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { LocationMap } from '../components/shared/LocationMap';

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

export default function ProjectProfile() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  const isRtl = i18n.language === 'ar';

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await api.get(`/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId
  });

  const project = response?.data as ProjectData;

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#B39371]/20 border-t-[#B39371] rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !project) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 font-bold">{t('projects.errors.loadDetails') || 'Failed to load project details.'}</p>
        </div>
      </Shell>
    );
  }

  const totalEstimate = project.stages.reduce((sum, s) => sum + s.estimateCost, 0);
  const formattedDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'demolition': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
      case 'construction': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
      case 'handover': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
      default: return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
    }
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Breadcrumb & Header */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#4A1B1B] blur-lg opacity-20 rounded-md" />
                <div className="relative w-12 h-12 bg-[#F5F1ED] dark:bg-gray-800 rounded-md flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371]">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <Link href="/projects" className="hover:text-[#B39371] transition-colors">{t('sidebar.projects')}</Link>
                  <ChevronRight className={cn("w-3 h-3 text-gray-300", isRtl && "rotate-180")} />
                  <span className="text-gray-500 dark:text-gray-400">{t('projects.profile.title')}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{isRtl ? project.name.arabic : project.name.english}</h1>
              </div>
            </div>
            
            <Badge className={cn("px-4 py-1.5 rounded-md uppercase tracking-widest text-[10px] font-bold border-none", getStatusColor(project.status))}>
              {t(`projects.statuses.${project.status.toLowerCase()}`)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Gallery, Stages, Map */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Project Gallery (Using Placeholders or first images) */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">{t('projects.media.visualAssets')}</h2>
                </div>
                <div className="grid grid-cols-12 gap-4 aspect-video sm:aspect-[21/9]">
                  <div className="col-span-12 sm:col-span-4 grid grid-cols-3 sm:grid-cols-1 gap-4">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-md shadow-sm hover:scale-105 transition-transform" alt={t('projects.media.visualAssets')} />
                    <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-md shadow-sm hover:scale-105 transition-transform" alt={t('projects.media.visualAssets')} />
                    <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-md shadow-sm hover:scale-105 transition-transform" alt={t('projects.media.visualAssets')} />
                  </div>
                  <div className="col-span-12 sm:col-span-8 relative group overflow-hidden rounded-md">
                    <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover shadow-md border-4 border-white dark:border-gray-800 transition-transform duration-700 group-hover:scale-110" alt={t('projects.media.visualAssets')} />
                    <button className="absolute bottom-6 right-6 px-6 py-3 bg-black/60 dark:bg-gray-900/80 backdrop-blur-md text-white rounded-md text-xs font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl border border-white/10">
                       <Maximize2 className="w-4 h-4" /> {t('common.details')}
                    </button>
                  </div>
                </div>
              </section>

              {/* Construction Stages (Real Data) */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">{t('projects.stages.phasesTitle')}</h2>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{t('projects.profile.totalPhases')}</span>
                      <span className="text-sm font-bold text-[#4A1B1B] dark:text-[#B39371]">{project.stages.length}</span>
                    </div>
                    <Progress value={project.stages.length > 0 ? 35 : 0} className="h-2 w-full sm:w-64 bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>

                <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800/30 ml-2 sm:ml-4">
                  {project.stages.map((stage) => (
                    <div key={stage.id} className="relative pl-14 flex flex-col gap-4 group">
                      {/* Main Stage Marker */}
                      <div className="absolute left-0 p-3 rounded-md z-10 shadow-sm border-4 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800 transition-transform group-hover:scale-110">
                        <Layers className="w-5 h-5 text-[#B39371]" />
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                           <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-[#B39371]">
                              {isRtl ? stage.name.arabic : stage.name.english}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-bold text-[#B39371] bg-[#B39371]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                {stage.estimateCost.toLocaleString()} {t('common.sar')}
                              </span>
                            </div>
                           </div>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1 rounded-md border border-gray-100/50 dark:border-gray-700/50">
                            <Clock className="w-3 h-3" /> {formattedDate(stage.fromDate)} — {formattedDate(stage.toDate)}
                          </span>
                        </div>

                        {/* Children (Sub-stages) */}
                        {stage.children && stage.children.length > 0 && (
                          <div className="mt-4 space-y-4 pl-4 border-l-2 border-dashed border-gray-100 dark:border-gray-800">
                            {stage.children.map((child) => (
                              <div key={child.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100/50 dark:border-gray-800/50">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-md bg-[#B39371]/50" />
                                  <div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                      {isRtl ? child.name.arabic : child.name.english}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                      {child.estimateCost.toLocaleString()} {t('common.sar')}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                                  {formattedDate(child.fromDate)} — {formattedDate(child.toDate)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {project.stages.length === 0 && (
                    <div className="py-12 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-md border border-dashed border-gray-200 dark:border-gray-800">
                      <Compass className="w-12 h-12 text-gray-100 dark:text-gray-800 mx-auto mb-4" />
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('projects.profile.noStages')}</p>
                      <Link href={`/projects/${projectId}/stages`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors uppercase tracking-[0.2em] border-b border-[#B39371]">
                        {t('projects.profile.addFirstStage')} <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              {/* Project Location - MAP */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">{t('projects.labels.location')}</h2>
                </div>
                <div className="relative aspect-video rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 bg-[#E5E9EC] dark:bg-gray-900 group shadow-inner">
                  <LocationMap 
                    latitude={project.latitude} 
                    longitude={project.longitude} 
                    readOnly={true} 
                  />
                  
                  <div className="absolute bottom-6 left-6 p-4 rounded-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 dark:border-gray-800/50 shadow-2xl max-w-xs z-[400]">
                    <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-widest mb-1">{t('projects.labels.address')}</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{project.address}</p>
                    <div className="mt-2 flex gap-2">
                       <span className="text-[9px] font-bold text-gray-400">Lat: {project.latitude.toFixed(4)}</span>
                       <span className="text-[9px] font-bold text-gray-400">Lng: {project.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Info Cards & Sidebar Content */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Project Information */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Info className="w-5 h-5 text-[#4A1B1B] dark:text-[#B39371]" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">{t('projects.profile.infoTitle')}</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { label: t('projects.labels.projectId'), value: project.id },
                    { label: t('projects.profile.internalId'), value: project.projectIdentity },
                    { label: t('projects.profile.legalityRecord'), value: project.legality ? (isRtl ? project.legality.name.arabic : project.legality.name.english) : t('common.noData') },
                    { label: t('materials.createdAt'), value: formattedDate(project.createdAt) },
                    { label: t('projects.labels.status'), value: t(`projects.statuses.${project.status.toLowerCase()}`) },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2 group">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest group-hover:text-[#B39371] transition-colors">{item.label}</p>
                      <p className={cn("text-sm font-bold text-gray-800 dark:text-gray-200 capitalize", item.label === t('projects.labels.status') && "text-[#B39371]")}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Financial Overview (Derived from Stages) */}
              <section className="bg-gradient-to-br from-[#4A1B1B] to-[#2D0D0D] p-8 rounded-md shadow-2xl shadow-[#4A1B1B]/30 space-y-8 text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-md blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/10 rounded-md backdrop-blur-sm">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t('projects.profile.financeTitle')}</h3>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('projects.profile.estCost')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{t('common.sar')} {totalEstimate.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
                       <span>{t('projects.profile.liquidity')}</span>
                       <span className="text-[#B39371]">{t('common.available')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-md overflow-hidden">
                       <div className="h-full bg-[#B39371] w-[100%]" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('projects.profile.totalPhases')}</p>
                      <p className="text-xl font-bold text-gray-100">{project.stages.length}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('projects.profile.avgPerStage')}</p>
                       <p className="text-xs font-bold text-[#B39371]">
                         {t('common.sar')} {project.stages.length > 0 ? (totalEstimate / project.stages.length).toLocaleString() : '0'}
                       </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Document Lists Cards (Placeholders using real style) */}
              <div className="space-y-6">
                 <section className="bg-white dark:bg-gray-900 p-7 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{t('projects.profile.docsTitle')}</h3>
                      <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-all px-2 py-1 rounded-md">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="py-8 text-center border-2 border-dashed border-gray-50 dark:border-gray-800 rounded-md">
                       <FileText className="w-8 h-8 text-gray-100 dark:text-gray-800 mx-auto mb-2" />
                       <p className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase">{t('projects.profile.noDocs')}</p>
                    </div>
                 </section>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

