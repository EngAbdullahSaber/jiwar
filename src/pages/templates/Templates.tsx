import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TopHeader } from '../../components/TopHeader';
import { Pagination } from '../../components/shared/Pagination';
import { Shell } from '../../components/shared/Shell';
import { 
  Plus, 
  MoreVertical,
  Maximize2,
  BedDouble,
  Bath,
  Search,
  ChevronDown,
  MapPin,
  Home,
  ArrowRight,
  Trash2,
  Edit,
  Sparkles,
  FileText
} from 'lucide-react';
import { Link } from "wouter";
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Template {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  modelType: string;
  sku: string;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  balconyAccess: boolean;
  location: string;
  file: string;
  duelEntrances: boolean;
  familyLounge: boolean;
  guestMajlis: boolean;
  kitchen: boolean;
  rooftop: boolean;
}

interface TemplatesResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: Template[];
  totalItems: number;
  totalPages: number;
}

 

 

export default function Templates() {
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TemplatesResponse>({
    queryKey: ['templates', currentPage, searchValue, sortOrder],
    queryFn: async () => {
      const response = await api.get('/template', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: searchValue || undefined,
          sortOption: sortOrder
        }
      });
      return response.data;
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/template/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success(t('templates.successDelete'), {
        icon: '🗑️',
        style: {
          borderRadius: '1rem',
          background: '#10b981',
          color: '#fff',
        }
      });
      setTemplateToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('templates.errorDelete'), {
        icon: '❌',
        style: {
          borderRadius: '1rem',
          background: '#ef4444',
          color: '#fff',
        }
      });
    }
  });

  const handleDelete = () => {
    if (templateToDelete) {
      deleteMutation.mutate(templateToDelete);
    }
  };

  // Placeholder images for demonstration
  const getPlaceholderImage = (id: number) => {
    const images = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ];
    return images[id % images.length];
  };

  const sortOptions = [
    { value: 'newest', label: t('templates.sort.newest') },
    { value: 'oldest', label: t('templates.sort.oldest') },
 
 
  ];
 

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Home className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('templates.management')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('templates.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('templates.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 
                <Link href="/templates/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    {t('templates.create')}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

        

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('templates.placeholders.search')}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B39371]/20 focus:border-[#B39371] transition-all"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              
              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all min-w-[160px] justify-between"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {sortOptions.find(opt => opt.value === sortOrder)?.label || t('templates.sortBy')}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOrder(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                            sortOrder === option.value 
                              ? "text-[#B39371] bg-[#B39371]/5 font-medium" 
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Templates Grid/List */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {/* Create New Template Card */}
              <Link href="/templates/new">
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#B39371] transition-all cursor-pointer overflow-hidden h-[450px]"
                >
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-br group-hover:from-[#4A1B1B] group-hover:to-[#6B2727] transition-all duration-300 flex items-center justify-center mb-6">
                      <Plus className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('templates.create')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">
                      {t('templates.createSub')}
                    </p>
                    <ArrowRight className="absolute bottom-8 right-8 w-5 h-5 text-[#B39371] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                  </div>
                </motion.div>
              </Link>

              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 h-[450px] p-4 space-y-4">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-48 animate-pulse" />
                    <div className="space-y-3">
                      <div className="bg-gray-200 dark:bg-gray-800 h-5 w-2/3 rounded animate-pulse" />
                      <div className="bg-gray-200 dark:bg-gray-800 h-4 w-1/2 rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="bg-gray-200 dark:bg-gray-800 h-8 w-20 rounded animate-pulse" />
                        <div className="bg-gray-200 dark:bg-gray-800 h-8 w-20 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                data?.data.map((template, index) => (
                  <motion.div 
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-[#B39371]/5 transition-all overflow-hidden h-[450px]"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={template.file ? (template.file.startsWith('http') ? template.file : `${import.meta.env.VITE_API_BASE_URL}/${template.file}`) : getPlaceholderImage(template.id)} 
                        alt={template.name.english}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* SKU Badge */}
                      <Badge className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white border-0">
                        {t('templates.sku')}: {template.sku}
                      </Badge>
                      
                      {/* Location Badge */}
                      {template.location && (
                        <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 border-0 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {template.location}
                        </Badge>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-3 h-[55%] flex flex-col justify-between  ">
                      {/* Title and Type */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {i18n.language === 'ar' ? template.name.arabic : template.name.english}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.modelType}</p>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 dark:border-gray-800">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{template.size} m²</p>
                        </div>
                        <div className="text-center border-x border-gray-100 dark:border-gray-800">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{template.bedrooms}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <Bath className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{template.bathrooms}</p>
                        </div>
                      </div>

                      {/* Amenities Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {template.kitchen && (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {t('templates.amenities.kitchen')}
                          </Badge>
                        )}
                        {template.familyLounge && (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {t('templates.amenities.familyLounge')}
                          </Badge>
                        )}
                        {template.guestMajlis && (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {t('templates.amenities.guestMajlis')}
                          </Badge>
                        )}
                        {template.balconyAccess && (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {t('templates.amenities.balcony')}
                          </Badge>
                        )}
                        {template.rooftop && (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {t('templates.amenities.rooftop')}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <Link href={`/templates/${template.id}`} className="flex-1">
                          <button className="w-full py-2.5 cursor-pointer bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-xs font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                            {t('templates.viewDetails')}
                          </button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all outline-none">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <Link href={`/templates/${template.id}/edit`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg">
                                <Edit className="w-4 h-4" />
                                <span>{t('common.edit')}</span>
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer rounded-lg text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10"
                              onClick={() => setTemplateToDelete(template.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>{t('common.delete')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          

          {/* Pagination Section */}
          {data && data.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('common.showing')}{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  {t('common.to')}{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.min(currentPage * pageSize, data.totalItems)}
                  </span>{' '}
                  {t('common.of')}{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.totalItems}
                  </span>{' '}
                  {t('common.results')}
                </p>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && data?.data.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('templates.empty.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                {searchValue 
                  ? t('templates.empty.searchDesc')
                  : t('templates.empty.createDesc')}
              </p>
              {!searchValue && (
                <Link href="/templates/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t('templates.create')}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={templateToDelete !== null} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">{t('templates.deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              {t('templates.deleteConfirm.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-gray-200 hover:bg-gray-50">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg shadow-red-500/20"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.processing')}
                </div>
              ) : (
                t('templates.deleteConfirm.button')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}