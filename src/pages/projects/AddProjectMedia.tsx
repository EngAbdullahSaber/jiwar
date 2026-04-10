import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  UploadCloud, 
  Plus, 
  FileText, 
  Trash2, 
  Compass,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { motion } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const visualAssets = [
  { id: 1, type: 'gallery', label: 'EXTERIOR_VIEW.JPG', isMain: true, status: 'complete' },
  { id: 2, type: 'gallery', label: 'INTERIOR_LOBBY.PNG', isMain: false, status: 'complete' },
  { id: 3, type: 'gallery', label: 'UNIT_PLAN_A.JPG', isMain: false, status: 'uploading', progress: 65 },
];

const documents = [
  { name: "Building_Permit_2024.pdf", size: "2.4 MB", date: "Oct 24", icon: FileText },
  { name: "Environmental_Impact.docx", size: "1.1 MB", date: "Oct 23", icon: FileText },
];

export default function AddProjectMedia() {
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Breadcrumb & Header */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
            <div className="relative">
              <div className="absolute inset-0 bg-[#4A1B1B] blur-lg opacity-20 rounded-xl" />
              <div className="relative w-12 h-12 bg-[#F5F1ED] dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371]">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Link href="/projects" className="hover:text-[#B39371] transition-colors">{t('sidebar.projects')}</Link>
                <ChevronRight className={cn("w-3 h-3 text-gray-300", isRtl && "rotate-180")} />
                <span className="text-gray-500 dark:text-gray-400 font-bold">Media & Documents</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">Media & Documents</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 sm:p-10 space-y-16">
              
              {/* Visual Assets Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-full" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Visual Assets</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Main Cover Upload */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Main Cover Image</label>
                    <div className="group relative w-full aspect-[4/3] bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all hover:border-[#B39371]/50 hover:bg-white dark:hover:bg-[#B39371]/5 cursor-pointer overflow-hidden shadow-inner">
                      <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371] group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Upload Cover</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-medium">JPG, PNG UP TO 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Grid */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Assets Gallery</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* Add More Button */}
                      <button className="aspect-[4/3] bg-white dark:bg-gray-800/50 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-[#B39371]/30 hover:text-[#B39371] transition-all group">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-[#F5F1ED] dark:group-hover:bg-[#B39371]/20 group-hover:scale-110 transition-all duration-300">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                      </button>

                      {visualAssets.map((asset) => (
                        <div key={asset.id} className="relative aspect-[4/3] bg-[#C1B087] dark:bg-gray-800 rounded-3xl flex flex-col items-center justify-center text-white/40 font-bold overflow-hidden shadow-sm group">
                          <span className="text-[10px] tracking-[0.2em] relative z-10 break-all px-2 text-center uppercase">{asset.label}</span>
                          
                          {/* Main Image Badge */}
                          {asset.isMain && (
                            <div className="absolute top-2 left-2 bg-white/90 dark:bg-[#4A1B1B]/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] text-[#4A1B1B] dark:text-[#B39371] font-bold uppercase tracking-wider shadow-sm z-20">
                              Primary
                            </div>
                          )}

                          {/* Uploading State */}
                          {asset.status === 'uploading' && (
                            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2 z-20">
                              <div className="relative w-12 h-12">
                                <svg className="w-12 h-12 -rotate-90">
                                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/20" />
                                  <circle 
                                    cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" 
                                    className="text-white"
                                    strokeDasharray={125}
                                    strokeDashoffset={125 - (125 * (asset.progress || 0)) / 100}
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                                  {asset.progress}%
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-colors pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Documentation Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#4A1B1B] dark:bg-[#B39371] rounded-full" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Documentation</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Licenses List */}
                  <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Project Licenses</h3>
                      <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] dark:hover:text-white transition-colors flex items-center gap-1 bg-[#F5F1ED] dark:bg-gray-800 px-3 py-1 rounded-lg">
                        <Plus className="w-3 h-3" />
                        ADJOIN DOCUMENT
                      </button>
                    </div>

                    <div className="space-y-3">
                      {documents.map((doc, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={doc.name} 
                          className="p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-[20px] flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl dark:hover:shadow-none hover:shadow-[#4A1B1B]/5 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-950 rounded-xl flex items-center justify-center text-red-500 shadow-sm border border-gray-50 dark:border-gray-800">
                              <doc.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{doc.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">{doc.size} • Uploaded {doc.date}</p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}

                      {/* Drop Area */}
                      <div className="py-8 bg-gray-50/30 dark:bg-gray-800/20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex items-center justify-center gap-3 hover:border-[#B39371]/30 dark:hover:border-[#B39371]/50 transition-all cursor-pointer group shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 dark:text-gray-600 group-hover:scale-110 group-hover:bg-[#F5F1ED] dark:group-hover:bg-[#B39371]/20 group-hover:text-[#4A1B1B] dark:group-hover:text-[#B39371] transition-all duration-300">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center px-4">Drag files here to upload license docs</p>
                      </div>
                    </div>
                  </div>

                  {/* Blue Prints Upload */}
                  <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-3">
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Engineering Plans</h3>
                    <div className="flex-1 bg-gray-50 dark:bg-[#B39371]/5 border-2 border-dashed border-gray-200 dark:border-[#B39371]/20 rounded-[40px] flex flex-col items-center justify-center p-10 text-center gap-6 group hover:border-[#B39371]/50 hover:bg-white dark:hover:bg-[#B39371]/10 transition-all cursor-pointer shadow-inner min-h-[300px]">
                      <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[28px] shadow-xl flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371] transition-transform group-hover:rotate-12 duration-500 border border-gray-50 dark:border-gray-800">
                        <Compass className="w-10 h-10" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Upload Engineering Plans</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-[240px] leading-relaxed mx-auto font-medium">
                          Support for high-resolution PDF, DWG, and BIM files up to 100MB per file.
                        </p>
                      </div>
                      <button className="px-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-[10px] font-bold text-gray-600 dark:text-[#B39371] hover:bg-[#4A1B1B] dark:hover:bg-[#B39371] hover:text-white dark:hover:text-gray-900 hover:border-[#4A1B1B] transition-all shadow-md group-hover:scale-110">
                        SELECT FILE
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sticky Form Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-6 z-50">
              <div className="max-w-6xl mx-auto flex items-center justify-end gap-4">
                <button 
                  onClick={() => setLocation('/projects')}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent shadow-sm"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  className="px-10 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-bold shadow-xl shadow-[#4A1B1B]/20 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                  Save Media & Documents
                  <ArrowRight className={cn("w-4 h-4 group-hover:translate-x-1 transition-transform", isRtl && "rotate-180")} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
