import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  FileText,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Calendar,
  User,
  Building2,
  CreditCard
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
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import DatePicker from '../../components/shared/DatePicker';

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
const FormField = ({ label, required = false, children, error, description }: any) => (
  <div className="space-y-2">
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label} {required && <span className="text-[#B39371]">*</span>}
      </Label>
      {description && <span className="text-xs text-gray-400">{description}</span>}
    </div>
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

export default function CreateContract() {
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    type: "apartment_sale",
    hijriDate: "",
    contractDate: "",
    contractCity: "",
    clientId: "",
    district: "",
    nationalId: "",
    apartmentId: "",
    projectDistrict: "",
    plotNumber: "",
    deedNumber: "",
    delayPenaltyAmount: "",
    paymentType: "",
    paidAmount: "",
    referenceType: "",
    paymentReferenceNumber: "",
    maintenanceFee: ""
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        clientId: Number(data.clientId),
        apartmentId: Number(data.apartmentId),
        delayPenaltyAmount: Number(data.delayPenaltyAmount),
        paidAmount: Number(data.paidAmount),
        maintenanceFee: Number(data.maintenanceFee)
      };
      const response = await api.post('/contract/apartment-sale', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('contracts.successCreate'), {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      setLocation('/contracts');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('contracts.errorCreate'), {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.clientId || !formData.apartmentId || !formData.contractDate || !formData.paidAmount) {
      toast.error(t('contracts.fillRequiredFields'), { 
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
                href="/contracts" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('contracts.management')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('contracts.create')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('contracts.description')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* General Information Section */}
            <FormSection 
              icon={Calendar}
              title={t('contracts.labels.basicInfo')}
              description={t('contracts.labels.basicInfoDesc')}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label={t('contracts.labels.type')} required>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('contracts.placeholders.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment_sale">{t('contracts.types.apartment_sale')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label={t('contracts.labels.contractDate')} required>
                  <DatePicker 
                    value={formData.contractDate}
                    onChange={(date) => setFormData({ ...formData, contractDate: date })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.hijriDate')}>
                  <Input 
                    placeholder="١٤٤٦/٠٩/٠١"
                    value={formData.hijriDate}
                    onChange={(e) => setFormData({ ...formData, hijriDate: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.contractCity')}>
                  <Input 
                    placeholder={t('contracts.labels.contractCity')}
                    value={formData.contractCity}
                    onChange={(e) => setFormData({ ...formData, contractCity: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Client & Identification Section */}
            <FormSection 
              icon={User}
              title={t('contracts.labels.clientSection')}
              description={t('contracts.labels.clientSectionDesc')}
              delay={0.2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label={t('contracts.labels.client')} required>
                  <PaginatedSelect
                    apiEndpoint="/client"
                    queryKey="clients-paginated"
                    value={formData.clientId.toString()}
                    onChange={(val) => setFormData({ ...formData, clientId: val })}
                    placeholder={t('contracts.placeholders.selectClient')}
                    searchPlaceholder={t('clients.placeholders.search')}
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((client: any) => ({
                        value: client.id,
                        label: client.fullName || `Client #${client.id}`,
                      }));
                    }}
                  />
                </FormField>

                <FormField label={t('contracts.labels.nationalId')}>
                  <Input 
                    placeholder="1234567890"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Apartment & Property Details Section */}
            <FormSection 
              icon={Building2}
              title={t('contracts.labels.propertySection')}
              description={t('contracts.labels.propertySectionDesc')}
              delay={0.3}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label={t('contracts.labels.apartment')} required>
                  <PaginatedSelect
                    apiEndpoint="/apartment"
                    queryKey="apartments-paginated"
                    value={formData.apartmentId.toString()}
                    onChange={(val) => setFormData({ ...formData, apartmentId: val })}
                    placeholder={t('contracts.placeholders.selectApartment')}
                    searchPlaceholder={t('apartments.placeholders.search')}
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((apt: any) => ({
                        value: apt.id,
                        label: i18n.language === 'ar' ? apt.mainName?.arabic : apt.mainName?.english || `Apartment #${apt.id}`,
                      }));
                    }}
                  />
                </FormField>

                <FormField label={t('contracts.labels.district')}>
                  <Input 
                    placeholder={t('contracts.labels.district')}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.projectDistrict')}>
                  <Input 
                    placeholder={t('contracts.labels.projectDistrict')}
                    value={formData.projectDistrict}
                    onChange={(e) => setFormData({ ...formData, projectDistrict: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.plotNumber')}>
                  <Input 
                    placeholder="١٢٣"
                    value={formData.plotNumber}
                    onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.deedNumber')}>
                  <Input 
                    placeholder="٤٥٦٧٨٩"
                    value={formData.deedNumber}
                    onChange={(e) => setFormData({ ...formData, deedNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Financial Details Section */}
            <FormSection 
              icon={CreditCard}
              title={t('contracts.labels.financialSection')}
              description={t('contracts.labels.financialSectionDesc')}
              delay={0.4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label={t('contracts.labels.paymentType')}>
                   <Select 
                    value={formData.paymentType} 
                    onValueChange={(val) => setFormData({ ...formData, paymentType: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('contracts.placeholders.selectPaymentType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عربون">عربون</SelectItem>
                      <SelectItem value="دفعة مقدمة">دفعة مقدمة</SelectItem>
                      <SelectItem value="كامل المبلغ">كامل المبلغ</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label={t('contracts.labels.paidAmount')} required>
                  <Input 
                    type="number"
                    placeholder="50000"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.referenceType')}>
                  <Select 
                    value={formData.referenceType} 
                    onValueChange={(val) => setFormData({ ...formData, referenceType: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t('contracts.placeholders.selectReferenceType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="حوالة بنكية">حوالة بنكية</SelectItem>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="شيك">شيك</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label={t('contracts.labels.referenceNumber')}>
                  <Input 
                    placeholder="TXN123456789"
                    value={formData.paymentReferenceNumber}
                    onChange={(e) => setFormData({ ...formData, paymentReferenceNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label={t('contracts.labels.delayPenalty')}>
                  <Input 
                    type="number"
                    placeholder="5000"
                    value={formData.delayPenaltyAmount}
                    onChange={(e) => setFormData({ ...formData, delayPenaltyAmount: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                 <FormField label={t('contracts.labels.maintenanceFee')}>
                  <Input 
                    type="number"
                    placeholder="2000"
                    value={formData.maintenanceFee}
                    onChange={(e) => setFormData({ ...formData, maintenanceFee: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/contracts')}
              isSubmitting={createMutation.isPending}
              submitText={t('contracts.create')}
              submittingText={t('common.saving')}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
