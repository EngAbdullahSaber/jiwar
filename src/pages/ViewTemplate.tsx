// import { useLocation, useRoute } from "wouter";
// import { useQuery } from '@tanstack/react-query';
// import { TopHeader } from '../../components/TopHeader';
// import { Shell } from '../../components/shared/Shell';
// import { 
//   ChevronLeft, 
//   MapPin,
//   Ruler,
//   Info,
//   Check,
//   FileText,
//   Calendar,
//   Layers,
//   Sparkles,
//   ArrowUpRight,
//   BedDouble,
//   Bath,
//   Edit,
//   Download,
//   Share2,
//   Heart,
//   Home,
//   DoorOpen,
//   Maximize2,
//   Users,
//   Coffee,
//   Utensils,
//   Wifi,
//   Tv,
//   Wind,
//   Camera,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Copy,
//   Image as ImageIcon
// } from 'lucide-react';
// import api from '@/lib/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { cn } from '@/lib/utils';
// import { useState } from 'react';

// interface Template {
//   id: number;
//   name: {
//     arabic: string;
//     english: string;
//   };
//   modelType: string;
//   sku: string;
//   managementFees: string;
//   size: number;
//   totalRooms: number;
//   bedrooms: number;
//   bathrooms: number;
//   balconyAccess: boolean;
//   location: string;
//   file: string;
//   duelEntrances: boolean;
//   familyLounge: boolean;
//   guestMajlis: boolean;
//   kitchen: boolean;
// }

// interface TemplateResponse {
//   code: number;
//   message: {
//     arabic: string;
//     english: string;
//   };
//   data: Template;
// }

// export default function ViewTemplate() {
//   const [, params] = useRoute("/templates/:id");
//   const [, setLocation] = useLocation();
//   const id = params?.id;
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);

//   const { data, isLoading, error } = useQuery<TemplateResponse>({
//     queryKey: ['template', id],
//     queryFn: async () => {
//       const response = await api.get(`/template/${id}`);
//       return response.data;
//     },
//     enabled: !!id
//   });

//   if (isLoading) {
//     return (
//       <Shell>
//         <TopHeader />
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center space-y-6">
//             <div className="relative">
//               <div className="w-20 h-20 border-4 border-[#B39371]/20 border-t-[#B39371] rounded-full animate-spin mx-auto" />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-8 h-8 bg-white rounded-full animate-pulse" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-lg font-semibold text-gray-900">Loading Template</p>
//               <p className="text-sm text-gray-400">Fetching template details...</p>
//             </div>
//           </div>
//         </div>
//       </Shell>
//     );
//   }

//   if (error || !data) {
//     return (
//       <Shell>
//         <TopHeader />
//         <div className="min-h-screen flex items-center justify-center p-6">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-md w-full text-center space-y-6"
//           >
//             <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
//               <XCircle className="w-12 h-12 text-red-500" />
//             </div>
//             <div className="space-y-2">
//               <h2 className="text-2xl font-bold text-gray-900">Template Not Found</h2>
//               <p className="text-gray-500">The template you're looking for doesn't exist or has been removed.</p>
//             </div>
//             <motion.button 
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setLocation('/templates')}
//               className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B39371] to-[#C4A484] text-white rounded-2xl font-semibold shadow-xl shadow-[#B39371]/30 hover:shadow-2xl transition-all"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Back to Templates
//             </motion.button>
//           </motion.div>
//         </div>
//       </Shell>
//     );
//   }

//   const template = data.data;
//   const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

//   const getPlaceholderImage = (id: number) => {
//     const images = [
//       'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
//       'https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&w=1200&q=80',
//       'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1200&q=80',
//       'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
//     ];
//     return images[id % images.length];
//   };

//   const imageUrl = template.file 
//     ? (template.file.startsWith('http') ? template.file : `${baseUrl}/${template.file}`) 
//     : getPlaceholderImage(template.id);

//   const images = [
//     getPlaceholderImage(template.id),
//     getPlaceholderImage(template.id + 1),
//     getPlaceholderImage(template.id + 2),
//     getPlaceholderImage(template.id + 3)
//   ];

//   const features = [
//     { key: 'duelEntrances', label: 'Dual Entrances', icon: DoorOpen, color: 'from-blue-500/20 to-blue-500/5' },
//     { key: 'familyLounge', label: 'Family Lounge', icon: Users, color: 'from-green-500/20 to-green-500/5' },
//     { key: 'guestMajlis', label: 'Guest Majlis', icon: Coffee, color: 'from-purple-500/20 to-purple-500/5' },
//     { key: 'kitchen', label: 'Kitchen', icon: Utensils, color: 'from-orange-500/20 to-orange-500/5' },
//     { key: 'balconyAccess', label: 'Balcony Access', icon: Wind, color: 'from-cyan-500/20 to-cyan-500/5' }
//   ];

//   return (
//     <Shell>
//       <TopHeader />
      
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
          
//           {/* Header & Navigation */}
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
//                 <button 
//                   onClick={() => setLocation('/templates')} 
//                   className="hover:text-[#B39371] transition-colors flex items-center gap-1"
//                 >
//                   <Home className="w-3.5 h-3.5" />
//                   Templates
//                 </button>
//                 <span className="text-gray-300">/</span>
//                 <span className="text-[#B39371] font-semibold">{template.sku}</span>
//               </div>
//               <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-6">
//                 <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight">
//                   {template.name.english}
//                 </h1>
//                 <div className="text-right lg:mb-1">
//                   <span className="text-lg lg:text-xl font-bold text-[#B39371] font-arabic" dir="rtl">
//                     {template.name.arabic}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsLiked(!isLiked)}
//                 className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:border-gray-200 transition-all shadow-sm"
//               >
//                 <Heart className={cn("w-4 h-4 lg:w-5 lg:h-5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-400")} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:border-gray-200 transition-all shadow-sm"
//               >
//                 <Share2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
//               </motion.button>
//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setLocation('/templates')}
//                 className="px-4 lg:px-6 py-2.5 lg:py-3 bg-white border border-gray-100 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium text-gray-600 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
//               >
//                 <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                 Back
//               </motion.button>
//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setLocation(`/templates/${id}/edit`)}
//                 className="px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#B39371] to-[#C4A484] text-white rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium shadow-lg shadow-[#B39371]/30 hover:shadow-xl transition-all flex items-center gap-2"
//               >
//                 <Edit className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                 Edit
//               </motion.button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
//             {/* Left Column: Visuals */}
//             <div className="lg:col-span-8 space-y-4 lg:space-y-6">
//               {/* Main Image Gallery */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="relative group h-[300px] lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl"
//               >
//                 <AnimatePresence mode="wait">
//                   <motion.img 
//                     key={activeImageIndex}
//                     initial={{ opacity: 0, scale: 1.1 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                     src={images[activeImageIndex]}
//                     alt={template.name.english}
//                     className="w-full h-full object-cover"
//                   />
//                 </AnimatePresence>
                
//                 {/* Image Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
//                 {/* Image Navigation */}
//                 <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
//                   <div className="flex gap-2">
//                     {images.map((_, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setActiveImageIndex(idx)}
//                         className={cn(
//                           "w-2 h-2 rounded-full transition-all",
//                           activeImageIndex === idx 
//                             ? "w-8 bg-white" 
//                             : "bg-white/50 hover:bg-white/80"
//                         )}
//                       />
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors">
//                       <Camera className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Location Badge */}
//                 <div className="absolute top-4 right-4">
//                   <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5 shadow-lg">
//                     <MapPin className="w-3.5 h-3.5 text-[#B39371]" />
//                     {template.location} VIEW
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Thumbnail Grid */}
//               <div className="grid grid-cols-4 gap-3 lg:gap-4">
//                 {images.map((img, idx) => (
//                   <motion.button
//                     key={idx}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => setActiveImageIndex(idx)}
//                     className={cn(
//                       "relative rounded-xl lg:rounded-2xl overflow-hidden aspect-video transition-all",
//                       activeImageIndex === idx ? "ring-2 ring-[#B39371] ring-offset-2" : "opacity-70 hover:opacity-100"
//                     )}
//                   >
//                     <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Quick Stats Grid */}
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
//                 {[
//                   { icon: Maximize2, label: "Total Area", value: `${template.size} m²`, sub: "Built-up area" },
//                   { icon: Layers, label: "Configuration", value: `${template.totalRooms} Rooms`, sub: "Total spaces" },
//                   { icon: BedDouble, label: "Bedrooms", value: `${template.bedrooms} BR`, sub: "Sleeping quarters" },
//                   { icon: Bath, label: "Bathrooms", value: `${template.bathrooms} BA`, sub: "Washrooms" }
//                 ].map((stat, i) => (
//                   <motion.div 
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                     className="p-3 lg:p-4 bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#F5F1ED] flex items-center justify-center">
//                         <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-[#B39371]" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-medium text-gray-400 uppercase">{stat.label}</p>
//                         <p className="text-sm lg:text-base font-bold text-gray-900">{stat.value}</p>
//                         <p className="text-[8px] text-gray-300 mt-0.5">{stat.sub}</p>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Features & Amenities */}
//               <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="p-4 lg:p-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
//                   <h3 className="text-sm lg:text-base font-bold text-gray-900 flex items-center gap-2">
//                     <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-[#B39371]" />
//                     Features & Amenities
//                   </h3>
//                 </div>
//                 <div className="p-4 lg:p-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
//                     {features.map((feature) => {
//                       const Icon = feature.icon;
//                       const isActive = template[feature.key as keyof Template];
//                       return (
//                         <div 
//                           key={feature.key}
//                           className={cn(
//                             "relative p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all group",
//                             isActive 
//                               ? "bg-gradient-to-br from-[#B39371]/5 to-transparent border-[#B39371]/20" 
//                               : "bg-gray-50 border-gray-100 opacity-50 grayscale"
//                           )}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className={cn(
//                               "w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center",
//                               isActive ? "bg-[#B39371]/10 text-[#B39371]" : "bg-gray-200 text-gray-400"
//                             )}>
//                               <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-xs lg:text-sm font-semibold text-gray-900">{feature.label}</span>
//                                 {isActive ? (
//                                   <CheckCircle className="w-4 h-4 text-[#B39371]" />
//                                 ) : (
//                                   <XCircle className="w-4 h-4 text-gray-300" />
//                                 )}
//                               </div>
//                               <p className="text-[10px] text-gray-400 mt-0.5">
//                                 {isActive ? 'Included in this template' : 'Not available'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Details & Actions */}
//             <div className="lg:col-span-4 space-y-4 lg:space-y-6">
//               <div className="sticky top-24 space-y-4 lg:space-y-6">
//                 {/* Management Fees Card */}
//                 <motion.div 
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="bg-gradient-to-br from-[#4A1B1B] to-[#2D1111] rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl"
//                 >
//                   <div className="space-y-6">
//                     <div>
//                       <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Management Fees</p>
//                       <p className="text-3xl lg:text-4xl font-bold">{template.managementFees}</p>
//                     </div>
                    
//                     <div className="h-px bg-white/10" />
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-white/50 mb-1">SKU</p>
//                         <p className="text-sm font-semibold">{template.sku}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-white/50 mb-1">Type</p>
//                         <p className="text-sm font-semibold">{template.modelType}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 pt-2">
//                       <div className="flex-1 p-3 bg-white/10 rounded-xl">
//                         <p className="text-xs text-white/50 mb-1">Last Updated</p>
//                         <div className="flex items-center gap-1.5 text-sm">
//                           <Clock className="w-4 h-4" />
//                           Oct 24, 2024
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Documents Card */}
//                 <motion.div 
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
//                 >
//                   <div className="p-4 lg:p-6 border-b border-gray-50">
//                     <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                       <FileText className="w-4 h-4 text-[#B39371]" />
//                       Documents
//                     </h4>
//                   </div>
//                   <div className="p-4 lg:p-6 space-y-3">
//                     <a 
//                       href={imageUrl} 
//                       target="_blank" 
//                       rel="noreferrer"
//                       className="group flex items-center justify-between p-3 lg:p-4 bg-gray-50 hover:bg-[#F5F1ED] rounded-xl lg:rounded-2xl transition-all border border-transparent hover:border-[#B39371]/20"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
//                           <FileText className="w-5 h-5 text-[#B39371]" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">Floor Plan</p>
//                           <p className="text-xs text-gray-400">PDF • 2.4 MB</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="p-2 hover:bg-white rounded-lg transition-colors">
//                           <Download className="w-4 h-4 text-gray-400 group-hover:text-[#B39371]" />
//                         </button>
//                         <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] transition-colors" />
//                       </div>
//                     </a>

//                     <a 
//                       href={imageUrl} 
//                       target="_blank" 
//                       rel="noreferrer"
//                       className="group flex items-center justify-between p-3 lg:p-4 bg-gray-50 hover:bg-[#F5F1ED] rounded-xl lg:rounded-2xl transition-all border border-transparent hover:border-[#B39371]/20"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
//                           <ImageIcon className="w-5 h-5 text-[#B39371]" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">Rendering</p>
//                           <p className="text-xs text-gray-400">JPG • 5.1 MB</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="p-2 hover:bg-white rounded-lg transition-colors">
//                           <Download className="w-4 h-4 text-gray-400 group-hover:text-[#B39371]" />
//                         </button>
//                         <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#B39371] transition-colors" />
//                       </div>
//                     </a>
//                   </div>
//                 </motion.div>

//                 {/* Quick Actions */}
//                 <motion.div 
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="grid grid-cols-2 gap-3 lg:gap-4"
//                 >
//                   <button className="p-4 lg:p-5 bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
//                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#F5F1ED] group-hover:bg-[#B39371]/10 flex items-center justify-center mb-3">
//                       <Users className="w-4 h-4 lg:w-5 lg:h-5 text-[#B39371]" />
//                     </div>
//                     <p className="text-xs lg:text-sm font-semibold text-gray-900">Assign Project</p>
//                     <p className="text-[10px] text-gray-400 mt-1">Link to development</p>
//                   </button>
                  
//                   <button className="p-4 lg:p-5 bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
//                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#F5F1ED] group-hover:bg-[#B39371]/10 flex items-center justify-center mb-3">
//                       <Copy className="w-4 h-4 lg:w-5 lg:h-5 text-[#B39371]" />
//                     </div>
//                     <p className="text-xs lg:text-sm font-semibold text-gray-900">Duplicate</p>
//                     <p className="text-[10px] text-gray-400 mt-1">Create a copy</p>
//                   </button>
//                 </motion.div>

//                 {/* Status Banner */}
//                 <motion.div 
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 lg:p-6 rounded-2xl lg:rounded-3xl text-white shadow-xl shadow-emerald-500/20"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="flex-1">
//                       <h4 className="text-lg lg:text-xl font-bold mb-1">Ready to Use</h4>
//                       <p className="text-xs lg:text-sm text-white/80">This template is verified and ready for project allocation.</p>
//                     </div>
//                     <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl backdrop-blur-xl flex items-center justify-center">
//                       <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" />
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Shell>
//   );
// }