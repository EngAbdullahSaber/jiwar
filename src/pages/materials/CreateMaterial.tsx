import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  Building2,
  Hash,
  Tags
} from 'lucide-react';
import { Input } from "@/components/ui/input";
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
import { FileUpload } from '../../components/shared/FileUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

// Label Component
const Label = ({ children, className, ...props }: any) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
    {children}
  </label>
);

export default function CreateMaterial() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    supplier: "",
    quantity: 100,
    requestStatus: "pending",
    approvalStatus: "draft",
    projectId: ""
  });
  const [attachments, setAttachments] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        supplier: data.supplier,
        quantity: Number(data.quantity),
        requestStatus: data.requestStatus,
        approvalStatus: data.approvalStatus,
        projectId: Number(data.projectId),
        files: attachments,
      };

      
      const response = await api.post('/material', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('materials.successCreate'), {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setLocation('/materials');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('materials.errorCreate'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.supplier || !formData.quantity || !formData.projectId) {
      toast.error(t('materials.formError'), { 
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
                href="/materials" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    Create Material
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Material
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add a new material entry for the supply chain
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Primary Details Section */}
            <FormSection 
              icon={Package}
              title={t('materials.details')}
              description={t('materials.detailsDesc')}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Material Name */}
                <FormField label={t('materials.name')} required>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="e.g. Steel Beams"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      required
                    />
                  </div>
                </FormField>

                {/* Supplier */}
                <FormField label={t('materials.supplier')} required>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="e.g. Al-Rajhi Materials"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      required
                    />
                  </div>
                </FormField>

                {/* Quantity */}
                <FormField label={t('materials.quantity')} required>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      required
                    />
                  </div>
                </FormField>

              </div>
            </FormSection>

            {/* Status & Association Section */}
            <FormSection 
              icon={Tags}
              title={t('materials.statusSection')}
              description={t('materials.statusDesc')}
              delay={0.2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Request Status */}
                <FormField label={t('materials.requestStatus')} required>
                  <Select 
                    value={formData.requestStatus} 
                    onValueChange={(val) => setFormData({ ...formData, requestStatus: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('materials.requestStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('materials.statuses.pending')}</SelectItem>
                      <SelectItem value="ordered">{t('materials.statuses.ordered')}</SelectItem>
                      <SelectItem value="received">{t('materials.statuses.received')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Approval Status */}
                <FormField label={t('materials.approvalStatus')} required>
                  <Select 
                    value={formData.approvalStatus} 
                    onValueChange={(val) => setFormData({ ...formData, approvalStatus: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('materials.approvalStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('materials.statuses.draft')}</SelectItem>
                      <SelectItem value="approved">{t('materials.statuses.approved')}</SelectItem>
                      <SelectItem value="finalized">{t('materials.statuses.finalized')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Linked Project */}
                <FormField label={t('materials.linkedProject')} required>
                  <PaginatedSelect
                    apiEndpoint="/project"
                    queryKey="projects-paginated"
                    value={formData.projectId.toString()}
                    onChange={(val) => setFormData({ ...formData, projectId: val })}
                    placeholder={t('materials.linkedProject')}
                    searchPlaceholder={t('common.search')}
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((project: any) => ({
                        value: project.id,
                        label: project.name?.english || project.name?.arabic || `Project #${project.id}`,
                      }));
                    }}
                  />
                </FormField>
                
              </div>
            </FormSection>

            {/* Attachments Section */}
            <FormSection
              icon={Package}
              title={t('materials.attachments')}
              description={t('materials.attachmentsDesc')}
              delay={0.3}
            >
              <FileUpload
                multiple
                label={t('materials.uploadLabel')}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                maxSizeMB={20}
                helperText={t('materials.uploadHelper')}
                onUploadSuccess={(url) => setAttachments((prev) => [...prev, url])}
                onUploadMultipleSuccess={(urls) => setAttachments((prev) => [...prev, ...urls])}
              />
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/materials')}
              isSubmitting={createMutation.isPending}
              submitText={t('materials.create')}
              submittingText={t('materials.creating')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
