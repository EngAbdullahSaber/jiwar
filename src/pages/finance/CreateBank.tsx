import { useState } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft,
  AlertCircle,
  Building,
  Sparkles,
  MapPin,
  Type,
  Globe
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { FormActions } from '../../components/shared/FormActions';
import { Shell } from '../../components/shared/Shell';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PaginatedSelect } from '../../components/shared/PaginatedSelect';

// Form Section Component
const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#B39371]" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

// Form Field Component
const FormField = ({ label, required = false, children, error }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
      {label} {required && <span className="text-[#B39371]">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

export default function CreateBank() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: {
      arabic: "",
      english: ""
    },
    countryId: ""
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.name,
        countryId: parseInt(data.countryId)
      };
      const response = await api.post('/bank', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('banks.createSuccess'), {
        icon: '🏦',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      setLocation('/banks');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.arabic || !formData.name.english || !formData.countryId) {
      toast.error(t('common.fillRequiredFields'), { 
        icon: '⚠️',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' } 
      });
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/banks" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('banks.financialSettings')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('banks.new')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('banks.description')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Country and Names Section */}
            <FormSection 
              icon={MapPin}
              title={t('banks.identityLocation')}
              description={t('banks.identityLocationDesc')}
              delay={0.1}
            >
              <div className="space-y-6">
                {/* Country Selection */}
                <PaginatedSelect
                  label={t('cities.country')}
                  apiEndpoint="/country"
                  queryKey="countries-paginated"
                  value={formData.countryId}
                  onChange={(value) => setFormData({ ...formData, countryId: value })}
                  placeholder={t('cities.selectCountry')}
                  searchPlaceholder={t('countries.searchPlaceholder')}
                  mapResponseToOptions={(data: any) => 
                    data.data.map((country: any) => ({
                      value: country.id,
                      label: country.name.english,
                      description: country.name.arabic,
                      icon: <Globe className="w-4 h-4" />
                    }))
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English Name */}
                  <FormField label={t('banks.nameEn')} required>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder={t('banks.nameEnPlaceholder')}
                        value={formData.name.english}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          name: { ...formData.name, english: e.target.value } 
                        })}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                        required
                      />
                    </div>
                  </FormField>

                  {/* Arabic Name */}
                  <FormField label={t('banks.nameAr')} required>
                    <div className="relative">
                      <Type className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder={t('banks.nameArPlaceholder')}
                        value={formData.name.arabic}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          name: { ...formData.name, arabic: e.target.value } 
                        })}
                        className="pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                        dir="rtl"
                        required
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/banks')}
              isSubmitting={createMutation.isPending}
              submitText={t('common.save')}
              submittingText={t('common.processing')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
