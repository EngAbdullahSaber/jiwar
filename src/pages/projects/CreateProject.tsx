import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  MapPin, 
  Maximize2, 
  Plus, 
  Minus, 
  Crosshair,
  Loader2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Hash,
  Globe,
  Navigation,
  Save,
  Clock,
  X,
  CheckCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginatedSelect } from '../../components/shared/PaginatedSelect';
import { FormActions } from '../../components/shared/FormActions';
import { Shell } from '../../components/shared/Shell';
import { LocationMap } from '../../components/shared/LocationMap';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Form Section Component
const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800  "
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
    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label} {required && <span className="text-[#B39371]">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

// Label Component (reuse from shadcn)
const Label = ({ children, className, ...props }: any) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
    {children}
  </label>
);

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: { arabic: "", english: "" },
    projectIdentity: `PROJ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "evacuation",
    legalityId: "",
    address: "",
    latitude: "24.7136",
    longitude: "46.6753"
  });



  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        projectIdentity: data.projectIdentity,
        status: data.status,
        legalityId: Number(data.legalityId),
        address: data.address,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude)
      };
      
      const response = await api.post('/project', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('projects.success.create'), {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      setLocation('/projects');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('projects.errors.create'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.english || !formData.name.arabic || !formData.projectIdentity || !formData.legalityId || !formData.address) {
      toast.error(t('projects.errors.fillRequired'), { 
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
                href="/projects" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('projects.create')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('projects.newProject')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('projects.formDescription')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Identity Section */}
            <FormSection 
              icon={Building2}
              title={t('projects.labels.identity')}
              description={t('projects.labels.identityDesc')}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project ID */}
                <FormField label={t('projects.labels.projectId')} required>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      value={formData.projectIdentity}
                      onChange={(e) => setFormData({ ...formData, projectIdentity: e.target.value })}
                      className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      required
                    />
                  </div>
                </FormField>

                {/* Status */}
                <FormField label={t('projects.labels.status')} required>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('projects.placeholders.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">{t('projects.statuses.planning')}</SelectItem>
                      <SelectItem value="evacuation">{t('projects.statuses.evacuation')}</SelectItem>
                      <SelectItem value="demolition">{t('projects.statuses.demolition')}</SelectItem>
                      <SelectItem value="construction">{t('projects.statuses.construction')}</SelectItem>
                      <SelectItem value="handover">{t('projects.statuses.handover')}</SelectItem>
                      <SelectItem value="onhold">{t('projects.statuses.onhold')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Project Name English */}
                <FormField label={t('projects.labels.projectNameEn')} required>
                  <Input 
                    placeholder={t('projects.placeholders.nameEn')} 
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    value={formData.name.english}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, english: e.target.value } })}
                    required
                  />
                </FormField>

                {/* Project Name Arabic */}
                <FormField label={t('projects.labels.projectNameAr')} required>
                  <Input 
                    dir="rtl"
                    placeholder={t('projects.placeholders.nameAr')} 
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                    value={formData.name.arabic}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, arabic: e.target.value } })}
                    required
                  />
                </FormField>

                {/* Linked Legality File */}
                <FormField label={t('projects.labels.linkedLegality')} required>
                  <PaginatedSelect
                    apiEndpoint="/legality"
                    queryKey="legalities-paginated"
                    value={formData.legalityId}
                    onChange={(val) => setFormData({ ...formData, legalityId: val })}
                    placeholder={t('projects.placeholders.selectLegality')}
                    searchPlaceholder={t('projects.placeholders.searchLegality')}
                    mapResponseToOptions={(pageData) => {
                      const items = pageData.data || [];
                      return items.map((legality: any) => ({
                        value: legality.id,
                        label: `LF-${legality.id.toString().padStart(4, '0')} - ${legality.name?.english || ''}`,
                        description: legality.name?.arabic || '',
                        badge: legality.legalitySteps?.length ? {
                          label: `${legality.legalitySteps.length} Steps`,
                          variant: 'default'
                        } : undefined
                      }));
                    }}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Location Section */}
            <FormSection 
              icon={MapPin}
              title={t('projects.labels.locationDetails')}
              description={t('projects.labels.locationDesc')}
              delay={0.2}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Physical Address */}
                  <FormField label={t('projects.labels.address')} required>
                    <Textarea 
                      placeholder={t('projects.placeholders.address')} 
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md min-h-[120px] resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </FormField>

                  {/* Coordinates */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label={t('projects.labels.latitude')} required>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder={t('projects.placeholders.latitude')} 
                          className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                          value={formData.latitude}
                          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                          required
                          type="number"
                          step="any"
                        />
                      </div>
                    </FormField>
                    <FormField label={t('projects.labels.longitude')} required>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder={t('projects.placeholders.longitude')} 
                          className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                          value={formData.longitude}
                          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                          required
                          type="number"
                          step="any"
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Coordinates Display */}
                  <div className="bg-[#F5F1ED] dark:bg-gray-800 rounded-md p-4 border border-[#B39371]/20">
                    <div className="flex items-center gap-2 text-[#4A1B1B] dark:text-[#B39371] mb-2">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs font-medium">{t('projects.labels.selectedCoordinates')}</span>
                    </div>
                    <p className="text-sm font-mono">
                      {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="relative group w-full aspect-video">
                  <LocationMap 
                    latitude={formData.latitude} 
                    longitude={formData.longitude} 
                    onChange={(lat, lng) => setFormData({ ...formData, latitude: lat.toString(), longitude: lng.toString() })}
                  />
                </div>
              </div>
            </FormSection>

          {/* Form Actions */}
          <FormActions
            onCancel={() => setLocation('/projects')}
            isSubmitting={createMutation.isPending}
            align="between"
          />
          </form>
        </div>
      </div>

      {/* Add this to your global CSS for the grid pattern */}
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #B39371 1px, transparent 1px),
            linear-gradient(to bottom, #B39371 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </Shell>
  );
}