import { useState } from 'react';
import { useLocation } from "wouter";
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  Users as UsersIcon, 
  ChevronRight, 
  UserPlus, 
  Mail, 
  Phone,
  MapPin,
  Building2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User as UserIcon,
  CreditCard,
  Hash,
  Globe,
  Building
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { PaginatedSelect } from '../../components/shared/PaginatedSelect';

export default function CreateClient() {
  const [, setLocation] = useLocation();
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
    bankId: ''
  });

  const createMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const response = await api.post('/client', clientData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('clients.success.create'));
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setLocation('/clients');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.[isRtl ? 'arabic' : 'english'] || t('clients.errors.create'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
      cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
      bankId: formData.bankId ? parseInt(formData.bankId) : undefined,
    };

    createMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
                href="/clients" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-[#B39371]" />
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
                  {t('clients.create')}
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
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-[#B39371]" />
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
                      <ChevronRight className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90" />
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
                    disabled={createMutation.isPending}
                    className="h-12 px-10 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-lg shadow-[#4A1B1B]/20 flex items-center gap-2 transition-all min-w-[200px]"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('common.processing')}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {t('clients.create')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-md border border-emerald-100 dark:border-emerald-500/20 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-widest">{t('clients.guidelines.financialSafety')}</p>
                  <p className="text-[12px] text-emerald-700 dark:text-emerald-500/80 leading-relaxed">{t('clients.guidelines.financialSafetyDesc')}</p>
                </div>
             </div>
             <div className="p-6 bg-amber-50 dark:bg-amber-500/5 rounded-md border border-amber-100 dark:border-amber-500/20 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">{t('clients.guidelines.legalIdentity')}</p>
                  <p className="text-[12px] text-amber-700 dark:text-amber-500/80 leading-relaxed">{t('clients.guidelines.legalIdentityDesc')}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
