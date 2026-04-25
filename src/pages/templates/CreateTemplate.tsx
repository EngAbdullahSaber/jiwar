import { useLocation, Link } from "wouter";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FormActions } from '../../components/shared/FormActions';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
   Info, 
  Layout, 
  Image as ImageIcon,
  Check,
   Home,
  Ruler,
  DoorOpen,
  Bath,
 
  Sparkles,
  ArrowLeft,
 
  BedDouble,
 
  AlertCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
 import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from '../../components/shared/FileUpload';

const templateSchema = z.object({
  name: z.object({
    arabic: z.string().min(1, "Arabic name is required"),
    english: z.string().min(1, "English name is required"),
  }),
  modelType: z.string().min(1, "Model type is required"),
  sku: z.string().min(1, "SKU is required"),
  maidRoom: z.coerce.number().min(0).optional(),
  clothsRoom: z.coerce.number().min(0).optional(),
  driverRoom: z.coerce.number().min(0).optional(),
  rooftop: z.boolean().default(false),
  size: z.coerce.number().min(1, "Size is required"),
  totalRooms: z.coerce.number().min(1, "Total rooms is required"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  balconyAccess: z.boolean().default(false),
  location: z.enum(["FRONT", "BACK"]),
  file: z.string() ,
  duelEntrances: z.boolean().default(false),
  familyLounge: z.boolean().default(false),
  guestMajlis: z.boolean().default(false),
  kitchen: z.boolean().default(false),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// Form Section Component
const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-light dark:bg-dark rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
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
    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label} {required && <span className="text-[#B39371]">*</span>}
    </Label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default function CreateTemplate() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      location: 'FRONT',
      balconyAccess: true,
      duelEntrances: false,
      familyLounge: true,
      guestMajlis: true,
      kitchen: true,
      rooftop: false,
      file: ''
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: TemplateFormValues) => {
      const response = await api.post('/template', values);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('templates.successCreate'), {
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#10b981',
          color: '#fff',
        }
      });
      setLocation('/templates');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('templates.errorCreate'), {
        icon: '❌',
        style: {
          borderRadius: '16px',
          background: '#ef4444',
          color: '#fff',
        }
      });
    }
  });

  const onSubmit = (data: TemplateFormValues) => {
    mutation.mutate(data);
  };

  const watchedFeatures = {
    duelEntrances: watch('duelEntrances'),
    familyLounge: watch('familyLounge'),
    guestMajlis: watch('guestMajlis'),
    kitchen: watch('kitchen'),
    rooftop: watch('rooftop'),
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Header Section */}
          <div className="bg-light dark:bg-dark rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/templates" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('templates.create')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('templates.newTemplate')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('templates.formDescription')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Section 1: General Information */}
            <FormSection 
              icon={Info}
              title={t('templates.sections.generalInfo')}
              description={t('templates.sections.generalInfoDesc')}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Template Name English */}
                <FormField 
                  label={t('templates.labels.nameEn')} 
                  required 
                  error={errors.name?.english?.message}
                >
                  <Input 
                    {...register('name.english')}
                    placeholder={t('templates.placeholders.nameEn')}
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.name?.english && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>

                {/* Template Name Arabic */}
                <FormField 
                  label={t('templates.labels.nameAr')} 
                  required 
                  error={errors.name?.arabic?.message}
                >
                  <Input 
                    {...register('name.arabic')}
                    dir="rtl"
                    placeholder={t('templates.placeholders.nameAr')}
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-right",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.name?.arabic && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>

                {/* Model Type */}
                <FormField label={t('templates.modelType')} required error={errors.modelType?.message}>
                  <Select onValueChange={(val) => setValue('modelType', val)}>
                    <SelectTrigger className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.modelType && "border-red-300 dark:border-red-700"
                    )}>
                      <SelectValue placeholder={t('templates.placeholders.selectModel')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
                      {['Residential', 'Commercial', 'Mixed-use', 'Type A'].map((type) => (
                        <SelectItem 
                          key={type} 
                          value={type}
                          className="rounded-lg focus:bg-[#F5F1ED] dark:focus:bg-gray-800 cursor-pointer"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* SKU */}
                <FormField label={t('templates.sku')} required error={errors.sku?.message}>
                  <Input 
                    {...register('sku')}
                    placeholder={t('templates.placeholders.sku')}
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.sku && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Section 2: Template Specifications */}
            <FormSection 
              icon={Layout}
              title={t('templates.sections.specifications')}
              description={t('templates.sections.specificationsDesc')}
              delay={0.2}
            >
              <div className="space-y-6">
                {/* Rooms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label={t('templates.labels.maidRoom')} error={errors.maidRoom?.message}>
                    <Input 
                      type="number"
                      step="0.01"
                      {...register('maidRoom')}
                      placeholder="0.00"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl px-4"
                    />
                  </FormField>
                  <FormField label={t('templates.labels.clothsRoom')} error={errors.clothsRoom?.message}>
                    <Input 
                      type="number"
                      step="0.01"
                      {...register('clothsRoom')}
                      placeholder="0.00"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl px-4"
                    />
                  </FormField>
                  <FormField label={t('templates.labels.driverRoom')} error={errors.driverRoom?.message}>
                    <Input 
                      type="number"
                      step="0.01"
                      {...register('driverRoom')}
                      placeholder="0.00"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl px-4"
                    />
                  </FormField>
                </div>
                {/* Measurements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField label={`${t('templates.size')} (${t('templates.sqm')})`} required error={errors.size?.message}>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        step="0.01"
                        {...register('size')}
                        placeholder="125"
                        className={cn(
                          "h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                          "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                          "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20"
                        )}
                      />
                    </div>
                  </FormField>

                  <FormField label={t('templates.totalRooms')} required error={errors.totalRooms?.message}>
                    <div className="relative">
                      <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        {...register('totalRooms')}
                        placeholder="7"
                        className="h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white focus:border-[#B39371] transition-all"
                      />
                    </div>
                  </FormField>

                  <FormField label={t('templates.beds')} required error={errors.bedrooms?.message}>
                    <div className="relative">
                      <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        {...register('bedrooms')}
                        placeholder="5"
                        className="h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white focus:border-[#B39371] transition-all"
                      />
                    </div>
                  </FormField>

                  <FormField label={t('templates.baths')} required error={errors.bathrooms?.message}>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        {...register('bathrooms')}
                        placeholder="2"
                        className="h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white focus:border-[#B39371] transition-all"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* Radio Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Balcony Access */}
                  <FormField label={t('templates.amenities.balcony')}>
                    <RadioGroup 
                      defaultValue="true" 
                      onValueChange={(val) => setValue('balconyAccess', val === 'true')}
                      className="flex gap-3"
                    >
                      {['Yes', 'No'].map((option) => {
                        const value = option === 'Yes' ? 'true' : 'false';
                        const label = option === 'Yes' ? t('common.yes' as any) || 'Yes' : t('common.no' as any) || 'No';
                        return (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem 
                              value={value} 
                              id={`balcony-${option}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`balcony-${option}`}
                              className={cn(
                                "px-6 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all border-2",
                                !!watch('balconyAccess') === (value === 'true')
                                  ? "bg-[#B39371] text-white border-[#B39371] shadow-lg shadow-[#B39371]/20"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#B39371]/30"
                              )}
                            >
                              {label}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormField>

                  {/* Location */}
                  <FormField label={t('templates.location')}>
                    <RadioGroup 
                      defaultValue="FRONT" 
                      onValueChange={(val) => setValue('location', val as 'FRONT' | 'BACK')}
                      className="flex gap-3"
                    >
                      {['FRONT', 'BACK'].map((loc) => (
                        <div key={loc} className="flex items-center">
                          <RadioGroupItem 
                            value={loc} 
                            id={`loc-${loc}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`loc-${loc}`}
                            className={cn(
                              "px-6 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all border-2",
                              watch('location') === loc
                                ? "bg-[#B39371] text-white border-[#B39371] shadow-lg shadow-[#B39371]/20"
                                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#B39371]/30"
                            )}
                          >
                            {t(`templates.${loc.toLowerCase()}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormField>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* Key Features */}
                <FormField label={t('templates.sections.features')}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'duelEntrances', label: t('templates.amenities.dualEntrances'), icon: '🚪' },
                      { key: 'familyLounge', label: t('templates.amenities.familyLounge'), icon: '🛋️' },
                      { key: 'guestMajlis', label: t('templates.amenities.guestMajlis'), icon: '🕌' },
                      { key: 'kitchen', label: t('templates.amenities.kitchen'), icon: '🍳' },
                      { key: 'rooftop', label: t('templates.amenities.rooftop'), icon: '🏠' }
                    ].map((feature) => (
                      <motion.div
                        key={feature.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setValue(feature.key as any, !watch(feature.key as any))}
                        className={cn(
                          "relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all",
                          watchedFeatures[feature.key as keyof typeof watchedFeatures]
                            ? "border-[#B39371] bg-[#B39371]/5 dark:bg-[#B39371]/10 shadow-lg shadow-[#B39371]/10"
                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{feature.icon}</span>
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              watchedFeatures[feature.key as keyof typeof watchedFeatures]
                                ? "text-[#4A1B1B] dark:text-[#B39371]"
                                : "text-gray-600 dark:text-gray-400"
                            )}>
                              {feature.label}
                            </span>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            watchedFeatures[feature.key as keyof typeof watchedFeatures]
                              ? "bg-[#B39371] text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-transparent"
                          )}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </FormField>
              </div>
            </FormSection>

            {/* Section 3: Visual Assets */}
            <FormSection 
              icon={ImageIcon}
              title={t('templates.sections.visualAssets')}
              description={t('templates.sections.visualAssetsDesc')}
              delay={0.3}
            >
              <div className="space-y-4">
              
                
                <FileUpload
                  label={t('materials.uploadLabel')}
                  accept="image/*"
                  maxSizeMB={20}
                  helperText={t('materials.uploadHelper')}
                  onUploadSuccess={(url) => setValue('file', url)}
                  defaultValue={watch('file')}
                />
              </div>
            </FormSection>

            {/* Form Actions */}
            <FormActions
              onCancel={() => setLocation('/templates')}
              isSubmitting={mutation.isPending}
              submitText={t('templates.create')}
              submittingText={t('common.processing')}
              align="right"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}