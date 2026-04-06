import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from "wouter";
import { 
  ArrowLeft,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  Loader2,
  Building2,
  Hash,
  Tags,
  Phone,
  Mail,
  Scale,
  DollarSign,
  Calendar
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function UpdateMaterial() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [, params] = useRoute('/materials/:id/edit');
  const materialId = params?.id;

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    requestStatus: "",
    approvalStatus: "",
    projectId: ""
  });

  const [supplierData, setSupplierData] = useState({
    name: "",
    phoneNumber: "",
    optionalPhoneNumber: "",
    email: "",
    quantityText: "",
    price: 0,
    editPrice: 0,
    editPriceDate: "",
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [supplierDocuments, setSupplierDocuments] = useState<string[]>([]);

  const { data: materialData, isLoading: isLoadingMaterial } = useQuery({
    queryKey: ['material', materialId],
    queryFn: async () => {
      const response = await api.get(`/material/${materialId}`);
      return response.data;
    },
    enabled: !!materialId
  });

  useEffect(() => {
    if (materialData?.data) {
      const m = materialData.data;
      setFormData({
        name: m.name || "",
        quantity: m.quantity || 0,
        requestStatus: m.requestStatus || "pending",
        approvalStatus: m.approvalStatus || "draft",
        projectId: m.project?.id ? m.project.id.toString() : ""
      });
      
      if (m.supplier) {
        setSupplierData({
          name: m.supplier.name || "",
          phoneNumber: m.supplier.phoneNumber || "",
          optionalPhoneNumber: m.supplier.optionalPhoneNumber || "",
          email: m.supplier.email || "",
          quantityText: m.supplier.quantityText || "",
          price: m.supplier.price || 0,
          editPrice: m.supplier.editPrice || 0,
          editPriceDate: m.supplier.editPriceDate ? m.supplier.editPriceDate.split('T')[0] : "",
        });
        if (Array.isArray(m.supplier.documents)) {
          setSupplierDocuments(m.supplier.documents);
        }
      }

      if (Array.isArray(m.files) && m.files.length > 0) {
        setAttachments(m.files);
      }
    }
  }, [materialData]);


  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Create payload dynamically handling required transformations
      const payload: any = {
        ...data,
        quantity: Number(data.quantity),
        projectId: Number(data.projectId),
        files: attachments,
        supplier: {
          ...supplierData,
          price: Number(supplierData.price),
          editPrice: Number(supplierData.editPrice),
          documents: supplierDocuments,
        }
      };
      
      const response = await api.patch(`/material/${materialId}`, payload);
      return response.data;

    },
    onSuccess: () => {
      toast.success(t('materials.successUpdate'), {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
      setLocation('/materials');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('materials.errorUpdate'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !supplierData.name || !formData.quantity || !formData.projectId) {
      toast.error(t('materials.formError'), { 
        icon: '⚠️',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' } 
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoadingMaterial) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#B39371] animate-spin" />
            <p className="text-sm text-gray-500">{t('common.loading')}</p>
          </div>
        </div>
      </Shell>
    );
  }

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
                    {t('materials.title')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('materials.editDetails')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('materials.editDescription')}
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

            {/* Supplier Details Section */}
            <FormSection 
              icon={Building2}
              title={t('materials.supplier')}
              description={t('materials.supplierDesc') || "Enter supplier contact and financial details"}
              delay={0.15}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Supplier Name */}
                <FormField label={t('materials.supplierName')} required>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="e.g. Al-Rajhi Materials"
                      value={supplierData.name}
                      onChange={(e) => setSupplierData({ ...supplierData, name: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                      required
                    />
                  </div>
                </FormField>

                {/* Email */}
                <FormField label={t('materials.supplierEmail')}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      type="email"
                      placeholder="supplier@example.com"
                      value={supplierData.email}
                      onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Phone Number */}
                <FormField label={t('materials.supplierPhone')}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="050XXXXXXXX"
                      value={supplierData.phoneNumber}
                      onChange={(e) => setSupplierData({ ...supplierData, phoneNumber: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Optional Phone Number */}
                <FormField label={t('materials.supplierOptionalPhone')}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="055XXXXXXXX"
                      value={supplierData.optionalPhoneNumber}
                      onChange={(e) => setSupplierData({ ...supplierData, optionalPhoneNumber: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Quantity Text */}
                <FormField label={t('materials.quantityText')}>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder="e.g. 100 tons"
                      value={supplierData.quantityText}
                      onChange={(e) => setSupplierData({ ...supplierData, quantityText: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Price */}
                <FormField label={t('materials.price')}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={supplierData.price}
                      onChange={(e) => setSupplierData({ ...supplierData, price: Number(e.target.value) })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Edit Price */}
                <FormField label={t('materials.editPrice')}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={supplierData.editPrice}
                      onChange={(e) => setSupplierData({ ...supplierData, editPrice: Number(e.target.value) })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Edit Price Date */}
                <FormField label={t('materials.editPriceDate')}>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input 
                      type="date"
                      value={supplierData.editPriceDate}
                      onChange={(e) => setSupplierData({ ...supplierData, editPriceDate: e.target.value })}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Supplier Documents */}
                <div className="md:col-span-2 space-y-4">
                  <FormField label={t('materials.supplierDocuments')}>
                    {/* Existing document previews */}
                    {supplierDocuments.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {supplierDocuments.map((url, i) => {
                          const fileName = url.split('/').pop() || `doc-${i + 1}`;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300"
                            >
                              <span className="truncate max-w-[160px]">{fileName}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => setSupplierDocuments((prev) => prev.filter((_, idx) => idx !== i))}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <FileUpload
                      multiple
                      label={t('materials.addMoreDocs') || "Add More Supplier Documents"}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      maxSizeMB={10}
                      onUploadSuccess={(url) => setSupplierDocuments((prev) => [...prev, url])}
                      onUploadMultipleSuccess={(urls) => setSupplierDocuments((prev) => [...prev, ...urls])}
                    />
                  </FormField>
                </div>

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
              {/* Existing attachment previews */}
              {attachments.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {attachments.map((url, i) => {
                    const fileName = url.split('/').pop() || `file-${i + 1}`;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300"
                      >
                        <span className="truncate max-w-[160px]">{fileName}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <FileUpload
                multiple
                label={t('materials.addMore')}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                maxSizeMB={20}
                helperText={t('materials.uploadHelper')}
                onUploadSuccess={(url) => setAttachments((prev) => [...prev, url])}
                onUploadMultipleSuccess={(urls) => setAttachments((prev) => [...prev, ...urls])}
              />
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/materials')}
              isSubmitting={updateMutation.isPending}
              submitText={t('common.save')}
              submittingText={t('materials.saving')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
