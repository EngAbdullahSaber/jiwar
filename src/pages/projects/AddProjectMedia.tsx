import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from "wouter";
import { 
  ChevronRight, 
   FileText, 
  Trash2, 
  Compass,
  Image as ImageIcon,
  CheckCircle2,
   Loader2,
 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FileUpload } from '../../components/shared/FileUpload';
import { FormActions } from '../../components/shared/FormActions';

interface ProjectImage {
  url: string;
  isMain: boolean;
}

interface ProjectAssets {
  documents: string[];
  blueprints: string[];
  images: ProjectImage[];
}

export default function AddProjectMedia() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/projects/:id/media");
  const projectId = params?.id;
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const [assets, setAssets] = useState<ProjectAssets>({
    documents: [],
    blueprints: [],
    images: []
  });

  // Fetch project data
  const { data: projectResponse, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await api.get(`/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId
  });

  useEffect(() => {
    if (projectResponse?.data) {
      const project = projectResponse.data;
      setAssets({
        documents: project.documents || [],
        blueprints: project.blueprints || [],
        images: project.images || []
      });
    }
  }, [projectResponse]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProjectAssets) => {
      const response = await api.patch(`/project/${projectId}/assets`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('projects.media.success'), {
        icon: '✅',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setLocation(`/projects/${projectId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('projects.media.error'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleImageUpload = (url: string) => {
    setAssets(prev => ({
      ...prev,
      images: [...prev.images, { url, isMain: prev.images.length === 0 }]
    }));
  };

  const handleMultipleImagesUpload = (urls: string[]) => {
    setAssets(prev => ({
      ...prev,
      images: [
        ...prev.images,
        ...urls.map((url, index) => ({
          url,
          isMain: prev.images.length === 0 && index === 0
        }))
      ]
    }));
  };

  const handleMultipleDocumentsUpload = (urls: string[]) => {
    setAssets(prev => ({
      ...prev,
      documents: [...prev.documents, ...urls]
    }));
  };

  const handleMultipleBlueprintsUpload = (urls: string[]) => {
    setAssets(prev => ({
      ...prev,
      blueprints: [...prev.blueprints, ...urls]
    }));
  };

  const setMainImage = (index: number) => {
    setAssets(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    }));
  };

  const removeImage = (index: number) => {
    setAssets(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the main image and there are other images, set the first one as main
      if (prev.images[index]?.isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const removeDocument = (index: number) => {
    setAssets(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const removeBlueprint = (index: number) => {
    setAssets(prev => ({
      ...prev,
      blueprints: prev.blueprints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    saveMutation.mutate(assets);
  };

  if (isLoadingProject) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#B39371] animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

  const project = projectResponse?.data;

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Breadcrumb & Header */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#4A1B1B] blur-lg opacity-20 rounded-md" />
                <div className="relative w-12 h-12 bg-[#F5F1ED] dark:bg-gray-800 rounded-md flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371]">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <Link href="/projects" className="hover:text-[#B39371] transition-colors">{t('sidebar.projects')}</Link>
                  <ChevronRight className={cn("w-3 h-3 text-gray-300", isRtl && "rotate-180")} />
                  <Link href={`/projects/${projectId}`} className="hover:text-[#B39371] transition-colors">
                    {project ? (isRtl ? project.name.arabic : project.name.english) : t('projects.labels.projectName')}
                  </Link>
                  <ChevronRight className={cn("w-3 h-3 text-gray-300", isRtl && "rotate-180")} />
                  <span className="text-gray-500 dark:text-gray-400 font-bold">{t('projects.media.title')}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{t('projects.media.title')}</h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Visual Assets Section */}
            <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-8 sm:p-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('projects.media.visualAssets')}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-5 space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{t('projects.media.uploadImages')}</label>
                    <FileUpload 
                      accept="image/*"
                      onUploadSuccess={handleImageUpload}
                      onUploadMultipleSuccess={handleMultipleImagesUpload}
                      multiple={true}
                      helperText={t('projects.media.imageHelper')}
                      label={t('projects.media.uploadImages')}
                    />
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{t('projects.media.visualAssets')} ({assets.images.length})</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {assets.images.map((image, idx) => (
                          <motion.div 
                            key={image.url}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-[4/3] rounded-md overflow-hidden shadow-sm group border-2 border-transparent hover:border-[#B39371]/50 transition-all"
                          >
                            <img 
                              src={image.url.startsWith('http') ? image.url : `${import.meta.env.VITE_API_BASE_URL}/${image.url}`} 
                              className="w-full h-full object-cover" 
                              alt={`Project ${idx}`} 
                            />
                            
                            {image.isMain && (
                              <div className="absolute top-2 left-2 bg-white/90 dark:bg-[#4A1B1B]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] text-[#4A1B1B] dark:text-[#B39371] font-bold uppercase tracking-wider shadow-sm z-20">
                                {t('projects.media.primary')}
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!image.isMain && (
                                <button 
                                  type="button"
                                  onClick={() => setMainImage(idx)}
                                  className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-md text-white transition-all"
                                  title={t('projects.media.setAsMain')}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-md text-white transition-all"
                                title={t('projects.media.remove')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {assets.images.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 rounded-md border-2 border-dashed border-gray-100 dark:border-gray-800/50 group transition-all hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-[#B39371] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative w-16 h-16 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:scale-110 transition-transform duration-500">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{t('projects.media.noImages')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Documentation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Documents */}
              <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('projects.media.documents')}</h2>
                  </div>
                </div>

                <FileUpload 
                  accept=".pdf,.doc,.docx"
                  onUploadSuccess={(url) => setAssets(prev => ({ ...prev, documents: [...prev.documents, url] }))}
                  onUploadMultipleSuccess={handleMultipleDocumentsUpload}
                  multiple={true}
                  label={t('projects.media.documents')}
                  helperText={t('projects.media.docHelper')}
                />

                <div className="space-y-3 mt-6">
                  {assets.documents.map((doc, idx) => (
                    <div key={doc} className="p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-md flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-950 rounded-md flex items-center justify-center text-red-500 shadow-sm">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{doc.split('/').pop()}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t('projects.media.uploadedPdf')}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {assets.documents.length === 0 && (
                    <div className="py-8 text-center bg-gray-50/30 dark:bg-gray-800/20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-md">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('projects.media.noDocs')}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Blueprints */}
              <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-md" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('projects.media.blueprints')}</h2>
                </div>

                <FileUpload 
                  accept=".pdf,.dwg,.bim"
                  onUploadSuccess={(url) => setAssets(prev => ({ ...prev, blueprints: [...prev.blueprints, url] }))}
                  onUploadMultipleSuccess={handleMultipleBlueprintsUpload}
                  multiple={true}
                  label={t('projects.media.blueprints')}
                  helperText={t('projects.media.blueprintHelper')}
                />

                <div className="space-y-3 mt-6">
                  {assets.blueprints.map((plan, idx) => (
                    <div key={plan} className="p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-md flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-950 rounded-md flex items-center justify-center text-[#B39371] shadow-sm">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{plan.split('/').pop()}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t('projects.media.planFile')}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeBlueprint(idx)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {assets.blueprints.length === 0 && (
                    <div className="py-8 text-center bg-gray-50/30 dark:bg-gray-800/20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-md">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('projects.media.noDocs')}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <FormActions 
              onCancel={() => setLocation(`/projects/${projectId}`)}
              isSubmitting={saveMutation.isPending}
              submitText={t('projects.media.save')}
              submittingText={t('common.saving')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
