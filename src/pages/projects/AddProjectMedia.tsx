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

const visualAssets = [
  { id: 1, type: 'gallery', label: 'GALLERY', isMain: true, status: 'complete' },
  { id: 2, type: 'gallery', label: 'GALLERY', isMain: false, status: 'complete' },
  { id: 3, type: 'gallery', label: 'GALLERY', isMain: false, status: 'uploading', progress: 65 },
];

const documents = [
  { name: "Building_Permit_2024.pdf", size: "2.4 MB", date: "Oct 24", icon: FileText },
  { name: "Environmental_Impact.docx", size: "1.1 MB", date: "Oct 23", icon: FileText },
];

export default function AddProjectMedia() {
  const [, setLocation] = useLocation();

  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
        {/* Breadcrumb & Header */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5F1ED] rounded-xl flex items-center justify-center text-[#4A1B1B]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Link href="/projects" className="hover:text-[#B39371] transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-500 font-bold">Media & Documents</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Add Media & Documents</h1>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 space-y-16">
            
            {/* Visual Assets Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#4A1B1B] pl-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Visual Assets</h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Main Cover Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Main Cover Image</label>
                  <div className="group relative w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all hover:border-[#B39371]/50 hover:bg-white cursor-pointer overflow-hidden">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4A1B1B] group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">Upload Cover</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">JPG, PNG UP TO 10MB</p>
                    </div>
                    
                    {/* Interactive Circles Decor */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* Gallery Grid */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gallery</label>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    {/* Add More Button */}
                    <button className="aspect-[4/3] bg-white border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#B39371]/30 hover:text-[#B39371] transition-all group">
                      <div className="p-2 bg-gray-50 rounded-full group-hover:bg-[#F5F1ED]">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                    </button>

                    {visualAssets.map((asset) => (
                      <div key={asset.id} className="relative aspect-[4/3] bg-[#C1B087] rounded-2xl flex flex-col items-center justify-center text-white/40 font-bold overflow-hidden shadow-sm group">
                        <span className="text-[10px] tracking-[0.2em] relative z-10">{asset.label}</span>
                        
                        {/* Main Image Badge */}
                        {asset.isMain && (
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] text-[#4A1B1B] font-bold uppercase tracking-wider shadow-sm">
                            Main Image
                          </div>
                        )}

                        {/* Uploading State */}
                        {asset.status === 'uploading' && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2">
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

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Legal & Technical Documents Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#4A1B1B] pl-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Legal & Technical Documents</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Licenses List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Licenses</h3>
                    <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      ADD DOCUMENT
                    </button>
                  </div>

                  <div className="space-y-3">
                    {documents.map((doc, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={doc.name} 
                        className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md hover:shadow-[#4A1B1B]/5 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm">
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">{doc.size} • Uploaded {doc.date}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    {/* Drop Area */}
                    <div className="py-8 bg-white border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:border-[#B39371]/30 transition-all cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-[#F5F1ED] group-hover:text-[#4A1B1B] transition-all">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drag files here to upload license docs</p>
                    </div>
                  </div>
                </div>

                {/* Blue Prints Upload */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blue Prints</h3>
                  <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-10 text-center gap-6 group hover:border-[#B39371]/50 hover:bg-white transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#4A1B1B] transition-transform group-hover:rotate-12">
                      <Compass className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-900">Upload Engineering Plans</p>
                      <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed mx-auto">
                        Support for high-resolution PDF, DWG, and BIM files up to 100MB.
                      </p>
                    </div>
                    <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-[#4A1B1B] hover:text-white hover:border-[#4A1B1B] transition-all shadow-sm">
                      SELECT FILE
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50/50 p-8 flex items-center justify-end gap-4 border-t border-gray-100">
            <button 
              onClick={() => setLocation('/projects')}
              className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
            >
              Cancel
            </button>
            <button 
              className="px-8 py-3 bg-[#B39371] text-white rounded-xl text-sm font-bold shadow-xl shadow-[#B39371]/20 hover:bg-[#4A1B1B] transition-all flex items-center gap-2 group"
            >
              Add Media & Documents
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
