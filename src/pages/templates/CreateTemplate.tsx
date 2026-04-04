import { useLocation, Link } from "wouter";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  ChevronRight, 
  Info, 
  Layout, 
  Image as ImageIcon,
  Check,
  Save,
  Home,
  Ruler,
  DoorOpen,
  Bath,
  MapPin,
  X,
  Sparkles,
  ArrowLeft,
  FileText,
  Hash,
  DollarSign,
  Layers,
  Grid3x3,
  BedDouble,
  Coffee,
  Users,
  Camera,
  Upload,
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
import { Badge } from "@/components/ui/badge";
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
  managementFees: z.string().min(1, "Management fees are required"),
  size: z.coerce.number().min(1, "Size is required"),
  totalRooms: z.coerce.number().min(1, "Total rooms is required"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  balconyAccess: z.boolean().default(false),
  location: z.enum(["FRONT", "BACK"]),
  file: z.string().default("uploads/template.pdf"),
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

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      location: 'FRONT',
      balconyAccess: true,
      duelEntrances: false,
      familyLounge: true,
      guestMajlis: true,
      kitchen: true,
      file: 'uploads/template.pdf'
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: TemplateFormValues) => {
      const response = await api.post('/template', values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Template created successfully!", {
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
      toast.error(error.response?.data?.message || "Failed to create template", {
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
                    Create Template
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Template
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Create and manage your apartment templates for easy property creation
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Section 1: General Information */}
            <FormSection 
              icon={Info}
              title="General Information"
              description="Basic identifiers and classification for this floor plan template"
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Template Name English */}
                <FormField 
                  label="Template Name (English)" 
                  required 
                  error={errors.name?.english?.message}
                >
                  <Input 
                    {...register('name.english')}
                    placeholder="e.g. Skyline Luxury Suite"
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
                  label="اسم النموذج (عربي)" 
                  required 
                  error={errors.name?.arabic?.message}
                >
                  <Input 
                    {...register('name.arabic')}
                    dir="rtl"
                    placeholder="مثال: جناح سكاي لاين الفاخر"
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-right",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.name?.arabic && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>

                {/* Model Type */}
                <FormField label="Model Type" required error={errors.modelType?.message}>
                  <Select onValueChange={(val) => setValue('modelType', val)}>
                    <SelectTrigger className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.modelType && "border-red-300 dark:border-red-700"
                    )}>
                      <SelectValue placeholder="Select model type" />
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
                <FormField label="SKU / ID Code" required error={errors.sku?.message}>
                  <Input 
                    {...register('sku')}
                    placeholder="APT-2024-X1"
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.sku && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>

                {/* Management Fees */}
                <FormField label="Management Fees" required error={errors.managementFees?.message}>
                  <Input 
                    {...register('managementFees')}
                    placeholder="e.g. Homeowners Association-1 Year Free"
                    className={cn(
                      "h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                      "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                      "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
                      errors.managementFees && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Section 2: Template Specifications */}
            <FormSection 
              icon={Layout}
              title="Template Specifications"
              description="Technical dimensions, room configuration, and structural features"
              delay={0.2}
            >
              <div className="space-y-6">
                {/* Measurements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField label="Size (m²)" required error={errors.size?.message}>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        step="0.01"
                        {...register('size')}
                        placeholder="1250"
                        className={cn(
                          "h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl",
                          "hover:bg-white dark:hover:bg-gray-700 hover:border-[#B39371]/30",
                          "focus:bg-white dark:focus:bg-gray-700 focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20"
                        )}
                      />
                    </div>
                  </FormField>

                  <FormField label="Total Rooms" required error={errors.totalRooms?.message}>
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

                  <FormField label="Bedrooms" required error={errors.bedrooms?.message}>
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

                  <FormField label="Bathrooms" required error={errors.bathrooms?.message}>
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
                  <FormField label="Balcony Access">
                    <RadioGroup 
                      defaultValue="true" 
                      onValueChange={(val) => setValue('balconyAccess', val === 'true')}
                      className="flex gap-3"
                    >
                      {['Yes', 'No'].map((option) => {
                        const value = option === 'Yes' ? 'true' : 'false';
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
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormField>

                  {/* Location */}
                  <FormField label="Location">
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
                            {loc.charAt(0) + loc.slice(1).toLowerCase()}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormField>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* Key Features */}
                <FormField label="Key Features">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'duelEntrances', label: 'Dual Entrances', icon: '🚪' },
                      { key: 'familyLounge', label: 'Family Lounge', icon: '🛋️' },
                      { key: 'guestMajlis', label: 'Guest Majlis', icon: '🕌' },
                      { key: 'kitchen', label: 'Kitchen', icon: '🍳' }
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
              title="Visual Assets"
              description="Upload floor plans and architectural visualization for this template"
              delay={0.3}
            >
              <div className="space-y-4">
              
                
                <FileUpload 
                  label="Template Asset"
                  onUploadSuccess={(url) => setValue('file', url)}
                  defaultValue={watch('file')}
                />
              </div>
            </FormSection>

            {/* Form Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="fixed bottom-0 left-0 right-0 bg-light/80 dark:bg-dark/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50"
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setLocation('/templates')}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Template
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </Shell>
  );
}