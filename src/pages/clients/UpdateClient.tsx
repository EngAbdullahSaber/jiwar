import { useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from "wouter";
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  Users as UsersIcon, 
  Mail, 
  Phone,
  MapPin,
  Building2,
  Loader2,
  ArrowLeft,
  Sparkles,
  User as UserIcon,
  CreditCard,
  Hash,
  Globe,
  Building,
  Save
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { PaginatedSelect } from '../../components/shared/PaginatedSelect';

export default function UpdateClient() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/clients/:id/edit');
  const clientId = params?.id;
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    type: 'individual',
    phoneNumber: '',
    email: '',
    vatNumber: '',
    iqama: '',
    iban: '',
    physicalAddress: '',
    countryId: '',
    cityId: '',
    bankId: '',
    password: ''
  });

  // Fetch Client Data
  const { data: clientResponse, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const response = await api.get(`/client/${clientId}`);
      return response.data;
    },
    enabled: !!clientId
  });

  useEffect(() => {
    if (clientResponse?.data) {
      const c = Array.isArray(clientResponse.data) ? clientResponse.data[0] : clientResponse.data;
      setFormData({
        fullName: c.fullName || '',
        type: c.type || 'individual',
        phoneNumber: c.phoneNumber || '',
        email: c.email || '',
        vatNumber: c.vatNumber || '',
        iqama: c.iqama || '',
        iban: c.iban || '',
        physicalAddress: c.physicalAddress || '',
        countryId: c.country?.id?.toString() || '',
        cityId: c.city?.id?.toString() || '',
        bankId: c.bank?.id?.toString() || '',
        password: ''
      });
    }
  }, [clientResponse]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await api.patch(`/client/${clientId}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('clients.success.update'));
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      setLocation('/clients');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.[isRtl ? 'arabic' : 'english'] || t('clients.errors.update'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      ...formData,
      countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
      cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
      bankId: formData.bankId ? parseInt(formData.bankId) : undefined,
    };

    if (!payload.password) {
      delete payload.password;
    }

    updateMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoadingClient) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#B39371] animate-spin" />
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
                href="/clients" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center text-white">
                  <PencilIcon className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t('clients.relationshipManagement')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('clients.edit')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('clients.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-20" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center text-[#B39371]">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('clients.personalInfo')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('clients.essentialDetails')}</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 lg:p-12 space-y-10">

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.fullName')}</Label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="fullName"
                        required
                        placeholder={t('clients.placeholders.fullName')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Client Type */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.type')}</Label>
                    <div className="relative group">
                      <select
                        name="type"
                        required
                        className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all appearance-none cursor-pointer"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="individual">{t('clients.individual')}</option>
                        <option value="corporate">{t('clients.company')}</option>
                      </select>
                      <ChevronRightIcon className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90" />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.phoneNumber')}</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="phoneNumber"
                        required
                        placeholder={t('clients.placeholders.phone')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.email')}</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        placeholder={t('clients.placeholders.email')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.password')}</Label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="password"
                        type="password"
                        placeholder={t('clients.placeholders.password')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* VAT Number */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.vatNumber')}</Label>
                    <div className="relative group">
                      <Hash className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="vatNumber"
                        placeholder={t('clients.placeholders.vat')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.vatNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Iqama / ID */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.iqama')}</Label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="iqama"
                        placeholder={t('clients.placeholders.iqama')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.iqama}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* IBAN */}
                  <div className="md:col-span-2 space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.iban')}</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="iban"
                        placeholder={t('clients.placeholders.iban')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.iban}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2.5">
                    <PaginatedSelect
                      label={t('clients.country')}
                      apiEndpoint="/country"
                      queryKey="countries"
                      value={formData.countryId}
                      onChange={(val) => setFormData(prev => ({ ...prev, countryId: val, cityId: '' }))}
                      placeholder={t('clients.placeholders.selectCountry')}
                      mapResponseToOptions={(data: any) => data.data.map((item: any) => ({
                        value: item.id,
                        label: item.name[isRtl ? 'arabic' : 'english'],
                        icon: <Globe className="w-4 h-4" />
                      }))}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2.5">
                    <PaginatedSelect
                      label={t('clients.city')}
                      apiEndpoint="/city"
                      queryKey={`cities-${formData.countryId}`}
                      value={formData.cityId}
                      onChange={(val) => setFormData(prev => ({ ...prev, cityId: val }))}
                      placeholder={t('clients.placeholders.selectCity')}
                      disabled={!formData.countryId}
                      mapResponseToOptions={(data: any) => data.data.map((item: any) => ({
                        value: item.id,
                        label: item.name[isRtl ? 'arabic' : 'english'],
                        icon: <MapPin className="w-4 h-4" />
                      }))}
                    />
                  </div>

                   {/* Bank */}
                   <div className="md:col-span-2 space-y-2.5">
                    <PaginatedSelect
                      label={t('clients.bank')}
                      apiEndpoint="/bank"
                      queryKey="banks"
                      value={formData.bankId}
                      onChange={(val) => setFormData(prev => ({ ...prev, bankId: val }))}
                      placeholder={t('clients.placeholders.selectBank')}
                      mapResponseToOptions={(data: any) => data.data.map((item: any) => ({
                        value: item.id,
                        label: item.name[isRtl ? 'arabic' : 'english'],
                        icon: <Building className="w-4 h-4" />
                      }))}
                    />
                  </div>

                  {/* Physical Address */}
                  <div className="md:col-span-2 space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('clients.address')}</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-6 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <textarea
                        name="physicalAddress"
                        rows={3}
                        placeholder={t('clients.placeholders.address')}
                        className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 pt-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all resize-none"
                        value={formData.physicalAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                </div>

                {/* Submit Actions */}
                <div className="pt-8 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800 mt-12">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation('/clients')}
                    className="h-12 px-8 rounded-md font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="h-12 px-10 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-lg shadow-[#4A1B1B]/20 flex items-center gap-2 transition-all min-w-[200px]"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('common.processing')}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t('common.save')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </Shell>
  );
}

const PencilIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
