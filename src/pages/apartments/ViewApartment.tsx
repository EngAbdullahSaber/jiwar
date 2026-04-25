 import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { Link, useRoute } from "wouter";
import { 
  Building,
  ArrowLeft,
   FileText,
  Ruler,
  Tags,
  Link as LinkIcon,
  Pencil,
  CheckCircle2,
  XCircle,
   Download,
   Info,
  Clock,
  Layout,
  ChevronRight,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { Shell } from '../../components/shared/Shell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
 import { format } from 'date-fns';

interface Apartment {
  id: number;
  mainName: {
    arabic: string;
    english: string;
  };
  secondaryName: {
    arabic: string;
    english: string;
  };
  floorNumber: number;
  buildingOrBlock: string;
  basePrice: string;
  apartmentType: string;
  isAvailable: boolean;
  serialNumber: string;
  accountNumber: string;
  subscriptionNumber: string;
  size: string;
  ownerStatus: string;
  status: string;
  requestDate: string;
  requestNumber: string;
  meterNumber: number;
  projectSakPdfUrl: string;
  apartmentSakPdfUrl: string;
  apartmentSubDivisionPdfUrl: string;
  project: {
    id: number;
    name: {
      arabic: string;
      english: string;
    };
    projectIdentity: string;
  } | null;
  template: {
    id: number;
    name: {
      arabic: string;
      english: string;
    };
    totalRooms?: number;
    sku?: string;
  } | null;
  createdBy: {
    id: number;
    email: string;
  } | null;
  updatedBy: {
    id: number;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ApartmentResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Apartment;
}

interface DataField {
  label: string;
  value: string | number;
  dir?: string;
  isLink?: boolean;
  href?: string;
  isHighlight?: boolean;
}

export default function ViewApartment() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/apartments/:id");
  const id = params?.id;

  const { data: response, isLoading } = useQuery<ApartmentResponse>({
    queryKey: ['apartment', id],
    queryFn: async () => {
      const res = await api.get(`/apartment/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const apartment = response?.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return t('common.na');
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[#B39371]/10 rounded-md" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-md animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building className="w-8 h-8 text-[#B39371] animate-pulse" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!apartment) {
    return (
      <Shell>
        <TopHeader />
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('apartments.notFound')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('apartments.notFoundDesc')}</p>
          <Link href="/apartments">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#F5F1ED] dark:bg-gray-800 text-[#4A1B1B] dark:text-[#B39371] rounded-md font-bold mx-auto hover:bg-[#B39371]/10 transition-all">
              <ArrowLeft className="w-5 h-5" /> {t('common.back')}
            </button>
          </Link>
        </div>
      </Shell>
    );
  }

  const sections: { id: string; icon: any; title: string; data: DataField[] }[] = [
    {
      id: 'identification',
      icon: FileText,
      title: t('apartments.sections.identification'),
      data: [
        { label: t('apartments.labels.majorNameEn'), value: apartment.mainName.english },
        { label: t('apartments.labels.majorNameAr'), value: apartment.mainName.arabic, dir: 'rtl' },
        { label: t('apartments.labels.secondaryNameEn'), value: apartment.secondaryName.english || t('common.na') },
        { label: t('apartments.labels.secondaryNameAr'), value: apartment.secondaryName.arabic || t('common.na'), dir: 'rtl' },
        { label: t('apartments.labels.serialNumber'), value: apartment.serialNumber || t('common.na') },
        { label: t('apartments.labels.accountNumber'), value: apartment.accountNumber || t('common.na') },
        { label: t('apartments.labels.subscriptionNumber'), value: apartment.subscriptionNumber || t('common.na') },
      ]
    },
    {
      id: 'structure',
      icon: Ruler,
      title: t('apartments.sections.locational'),
      data: [
        { label: t('apartments.labels.buildingOrBlock'), value: apartment.buildingOrBlock || t('common.na') },
        { label: t('apartments.labels.floorNo'), value: apartment.floorNumber },
        { label: t('apartments.labels.size'), value: `${apartment.size} ${t('apartments.labels.sqmLabel')}` },
        { label: t('apartments.labels.meterNumber'), value: apartment.meterNumber || '0' },
        { 
          label: t('apartments.labels.linkedProject'), 
          value: apartment.project ? (i18n.language === 'ar' ? apartment.project.name.arabic : apartment.project.name.english) : t('common.na'),
          isLink: !!apartment.project,
          href: apartment.project ? `/projects/${apartment.project.id}` : undefined
        },
        { 
          label: t('apartments.labels.linkedTemplate'), 
          value: apartment.template ? (i18n.language === 'ar' ? apartment.template.name.arabic : apartment.template.name.english) : t('common.na'),
          isLink: !!apartment.template,
          href: apartment.template ? `/templates/${apartment.template.id}` : undefined
        },
      ]
    }
  ];

  const documents = [
    { label: t('apartments.labels.projectSak'), url: apartment.projectSakPdfUrl, color: "text-blue-500", bgColor: "bg-blue-50" },
    { label: t('apartments.labels.apartmentSak'), url: apartment.apartmentSakPdfUrl, color: "text-red-500", bgColor: "bg-red-50" },
    { label: t('apartments.labels.subDivision'), url: apartment.apartmentSubDivisionPdfUrl, color: "text-emerald-500", bgColor: "bg-emerald-50" },
  ].filter(doc => doc.url);

  // Gallery Placeholders
  const gallery = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800"
  ];

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const formatPrice = (price: string) => {
    const num = Number(price);
    return isNaN(num) ? price : num.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Breadcrumb Header */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] rounded-md flex items-center justify-center text-[#B39371] shadow-lg">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Link href="/apartments" className="hover:text-[#B39371] transition-colors">{t('apartments.title')}</Link>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-gray-500">{i18n.language === 'ar' ? apartment.mainName.arabic : apartment.mainName.english}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{t('apartments.unitSnapshot')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/apartments/${apartment.id}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Pencil className="w-4 h-4 text-[#B39371]" />
                  {t('common.edit')}
                </motion.button>
              </Link>
              
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column (8/12) */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              
              {/* Unit Hero & Gallery */}
              <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Hero Header Overlay */}
                <div className="p-10 pb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#B39371]/5 to-transparent rounded-md -mr-64 -mt-64 blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                          apartment.status === 'available' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          apartment.status === 'sold' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-amber-50 text-amber-600 border border-amber-100"
                        )}>
                          {t(`apartments.statuses.${apartment.status}`)}
                        </div>
                        <div className="h-4 w-[1px] bg-gray-200" />
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase italic opacity-60">
                          {t('apartments.verifiedAsset')}{apartment.id.toString().padStart(4, '0')}
                        </span>
                      </div>
                      
                      <div>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                          {i18n.language === 'ar' ? apartment.mainName.arabic : apartment.mainName.english}
                        </h2>
                        <p className="text-xl text-[#B39371] font-medium mt-2 opacity-80 italic">
                          {i18n.language === 'ar' ? apartment.mainName.english : apartment.mainName.arabic}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800 backdrop-blur-sm min-w-[240px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{t('apartments.labels.basePrice')}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                          {formatPrice(apartment.basePrice)}
                        </span>
                        <span className="text-sm font-bold text-[#B39371] uppercase tracking-widest">{t('common.sar')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refined Gallery Section */}
                <div className="px-10 pb-10">
                  <div className="grid grid-cols-12 gap-5 aspect-[21/10]">
                    <div className="col-span-8 relative group overflow-hidden rounded-md shadow-2xl shadow-black/10">
                      <img src={gallery[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Main" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <div className="absolute top-8 left-8 flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                         <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-2">
                           <Maximize2 className="w-4 h-4 text-[#B39371]" />
                           {t('apartments.fullScreenPreview')}
                         </div>
                      </div>
                    </div>
                    <div className="col-span-4 grid grid-rows-2 gap-5">
                      <div className="relative group overflow-hidden rounded-md shadow-lg">
                        <img src={gallery[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="G1" />
                        <div className="absolute inset-0 bg-[#4A1B1B]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative group overflow-hidden rounded-md shadow-lg">
                        <img src={gallery[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="G2" />
                        <div className="absolute inset-0 bg-[#4A1B1B]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Feature Bar */}
                <div className="flex flex-wrap gap-8 py-6 border-t border-gray-100 dark:border-gray-800">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                       <Layout className="w-5 h-5 text-[#B39371]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.unitType')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{t(`apartments.types.${apartment.apartmentType}`)}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                       <Ruler className="w-5 h-5 text-[#B39371]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.totalArea')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white uppercase truncate max-w-[100px]">{apartment.size} {t('apartments.labels.sqmLabel')}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                       <Building className="w-5 h-5 text-[#B39371]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.floorLevel')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{t('apartments.level', { level: apartment.floorNumber })}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.ownershipStatus')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{t(`apartments.owners.${apartment.ownerStatus}`)}</p>
                     </div>
                   </div>
                </div>
              </section>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                  <motion.section
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (idx + 1) }}
                    className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-[#F5F1ED] dark:bg-gray-800 rounded-md">
                        <section.icon className="w-5 h-5 text-[#4A1B1B] dark:text-[#B39371]" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{section.title}</h3>
                    </div>

                    <div className="space-y-5">
                      {section.data.map((item: DataField, i) => (
                        <div key={i} className="flex flex-col gap-1 py-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                          {item.isLink ? (
                            <Link href={item.href || '#'}>
                              <span className="text-sm font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors cursor-pointer flex items-center gap-1.5 group">
                                {item.value}
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </span>
                            </Link>
                          ) : (
                            <p className={cn(
                              "text-sm font-bold text-gray-900 dark:text-white",
                              item.dir === 'rtl' && "text-right font-medium"
                            )}>
                              {item.value || 'N/A'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Economic Detailed Analysis */}
               <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[#F5F1ED] dark:bg-gray-800 rounded-md">
                      <Tags className="w-5 h-5 text-[#4A1B1B] dark:text-[#B39371]" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('apartments.sections.economics')}</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.valuation')}</p>
                       <p className="text-lg font-black text-[#B39371]">{formatPrice(apartment.basePrice)} <span className="text-[10px] text-gray-400">{t('common.sar')}</span></p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.requestId')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{apartment.requestNumber || t('common.pending' as any) || 'PENDING'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.submission')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(apartment.requestDate)}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{t('apartments.meterId')}</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">#{apartment.meterNumber || '0000'}</p>
                    </div>
                  </div>
               </section>
            </div>

            {/* Right Column (4/12) */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              
              {/* Linked Metadata Sidebar Cards */}
              <div className="bg-[#4A1B1B] p-8 rounded-md shadow-2xl shadow-[#4A1B1B]/10 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-md blur-3xl" />
                <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                   <LinkIcon className="w-4 h-4 text-[#B39371]" />
                   {t('apartments.structuralLinkage')}
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('apartments.masterProject')}</p>
                    {apartment.project ? (
                      <Link href={`/projects/${apartment.project.id}`}>
                        <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 group cursor-pointer transition-all">
                          <span className="font-bold text-sm truncate pr-4">
                            {i18n.language === 'ar' ? apartment.project.name.arabic : apartment.project.name.english}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#B39371] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ) : (
                      <div className="p-4 bg-white/5 rounded-md border border-dashed border-white/10 text-white/30 text-xs font-bold text-center italic">
                         {t('apartments.noProjectLinked')}
                      </div>
                    )}
                  </div>

                   <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('apartments.architecturalTemplate')}</p>
                      {apartment.template ? (
                        <div className="space-y-3">
                          <Link href={`/templates/${apartment.template.id}`}>
                            <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 group cursor-pointer transition-all">
                              <span className="font-bold text-sm truncate pr-4 text-[#B39371]">
                                {i18n.language === 'ar' ? apartment.template.name.arabic : apartment.template.name.english}
                              </span>
                              <ChevronRight className="w-4 h-4 text-[#B39371] group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                          {apartment.template.sku && (
                            <div className="px-4 py-2 bg-[#B39371]/10 rounded-md border border-[#B39371]/20 flex items-center justify-between">
                               <span className="text-[9px] font-bold text-[#B39371] uppercase tracking-tighter">{t('apartments.designSku')}</span>
                               <span className="text-[10px] font-mono font-medium text-white/60">{apartment.template.sku}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-white/5 rounded-md border border-dashed border-white/10 text-white/30 text-xs font-bold text-center italic">
                          {t('apartments.noTemplateLinked')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                   <div className="flex justify-between items-center bg-white/5 rounded-md p-4">
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">{t('apartments.layoutRooms')}</p>
                        <p className="text-xl font-black text-[#B39371]">{apartment.template?.totalRooms || '?'}</p>
                      </div>
                      <div className="w-10 h-10 bg-[#B39371]/20 rounded-md flex items-center justify-center">
                        <Layout className="w-6 h-6 text-[#B39371]" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Documents Section */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('apartments.sections.documents')}</h3>
                    <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors flex items-center gap-1.5">
                      <Download className="w-3 h-3" /> {t('apartments.archiveAll')}
                    </button>
                 </div>

                 <div className="space-y-3">
                    {documents.length > 0 ? documents.map((doc, i) => (
                      <a 
                        key={i}
                        href={`${baseUrl}/${doc.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-900 hover:border-[#B39371]/20 transition-all cursor-pointer shadow-sm"
                      >
                         <div className="flex items-center gap-3">
                           <div className={cn("p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-50 dark:border-gray-700", doc.color)}>
                              <FileText className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-gray-800 dark:text-white uppercase tracking-tighter truncate max-w-[120px]">{doc.label}</p>
                              <p className="text-[8px] text-gray-400 font-medium">{t('apartments.documentSak')}</p>
                           </div>
                         </div>
                         <div className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300 group-hover:text-[#B39371] transition-colors">
                           <Download className="w-4 h-4" />
                         </div>
                      </a>
                    )) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-md">
                        <Info className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-medium">{t('apartments.noDocuments')}</p>
                      </div>
                    )}
                 </div>
              </section>

              {/* Maintenance & Support Quick Info */}
              <section className="p-8 bg-gradient-to-br from-[#B39371]/10 to-transparent dark:from-[#B39371]/5 rounded-md border border-[#B39371]/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-md shadow-sm flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#B39371]" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('apartments.unitHistory')}</h4>
                </div>
                <div className="space-y-4">
                  <div className="pl-4 border-l-2 border-[#B39371]/30 space-y-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{t('apartments.recordCreated')}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{t('apartments.initialEntry', { date: formatDate(apartment.createdAt) })}</p>
                    {apartment.createdBy && (
                      <p className="text-[9px] text-gray-400 italic">{t('apartments.by', { email: apartment.createdBy.email })}</p>
                    )}
                  </div>
                  {apartment.updatedAt && (
                    <div className="pl-4 border-l-2 border-emerald-500/30 space-y-1">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{t('apartments.lastModification')}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{t('apartments.updatedOn', { date: formatDate(apartment.updatedAt) })}</p>
                      {apartment.updatedBy && (
                        <p className="text-[9px] text-gray-400 italic">{t('apartments.by', { email: apartment.updatedBy.email })}</p>
                      )}
                    </div>
                  )}
                  {!apartment.updatedAt && (
                    <div className="pl-4 border-l-2 border-transparent space-y-1">
                      <p className="text-xs font-bold text-gray-300">{t('apartments.operationalLog')}</p>
                      <p className="text-[10px] text-gray-200 font-medium italic">{t('apartments.originalState')}</p>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

