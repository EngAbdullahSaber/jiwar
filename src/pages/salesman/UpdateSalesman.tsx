import { useState, useEffect } from 'react';
import { useLocation, useRoute } from "wouter";
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  Users as UsersIcon, 
  ChevronRight, 
  Mail, 
  Phone,
  User as UserIcon,
  Loader2,
  ArrowLeft,
  Percent,
  Wallet,
  Target,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { Link } from 'wouter';
import DatePicker from '../../components/shared/DatePicker';

export default function UpdateSalesman() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/salesman/:id/edit');
  const salesmanId = params?.id;
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    paymentType: 'COMMISSION',
    agentType: 'INTERNAL',
    startDate: '',
    endDate: '',
    commissionBase: 'PERCENTAGE',
    commissionValue: '',
    apartmentTargetGoal: '',
    completeTarget: false
  });

  // Fetch salesman data
  const { data: salesmanData, isLoading: isLoadingSalesman } = useQuery({
    queryKey: ['salesman', salesmanId],
    queryFn: async () => {
      const response = await api.get(`/salesman/${salesmanId}`);
      return response.data;
    },
    enabled: !!salesmanId
  });

  useEffect(() => {
    if (salesmanData?.data) {
      const s = salesmanData.data;
      setFormData({
        fullName: s.fullName || '',
        phoneNumber: s.phoneNumber || '',
        email: s.email || '',
        paymentType: s.paymentType || 'COMMISSION',
        agentType: s.agentType || 'INTERNAL',
        startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : '',
        endDate: s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : '',
        commissionBase: s.commissionBase || 'PERCENTAGE',
        commissionValue: s.commissionValue?.toString() || '',
        apartmentTargetGoal: s.apartmentTargetGoal?.toString() || '',
        completeTarget: s.completeTarget || false
      });
    }
  }, [salesmanData]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await api.patch(`/salesman/${salesmanId}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('salesman.successUpdate') || 'Salesman updated successfully');
      queryClient.invalidateQueries({ queryKey: ['salesmen'] });
      queryClient.invalidateQueries({ queryKey: ['salesman', salesmanId] });
      setLocation('/salesman');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('common.error'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    const payload: any = {
      ...formData,
      commissionValue: parseFloat(formData.commissionValue) || 0
    };

    // Only send apartmentTargetGoal if toggle is on AND it's a positive number
    if (formData.completeTarget && parseInt(formData.apartmentTargetGoal) > 0) {
      payload.apartmentTargetGoal = parseInt(formData.apartmentTargetGoal);
    } else {
      delete payload.apartmentTargetGoal;
    }

    updateMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, completeTarget: checked }));
  };

  if (isLoadingSalesman) {
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="flex items-center gap-6 relative z-10">
              <Link 
                href="/salesman" 
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-xl opacity-20" />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center border border-white/10">
                  <UserIcon className="w-7 h-7 text-[#B39371]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                    {t('salesman.title')}
                  </p>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t('common.edit')} {salesmanData?.data?.fullName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {t('salesman.description')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('salesman.form.basicInfo')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('salesman.form.basicInfoDesc')}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.fullName')}</Label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="fullName"
                        placeholder={t('salesman.form.placeholders.fullName')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.email')}</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        placeholder={t('salesman.form.placeholders.email')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.phoneNumber')}</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="phoneNumber"
                        placeholder={t('salesman.form.placeholders.phone')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Agent Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.agentType')}</Label>
                    <div className="relative group">
                      <UsersIcon className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors pointer-events-none" />
                      <select
                        name="agentType"
                        className="w-full h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all appearance-none cursor-pointer"
                        value={formData.agentType}
                        onChange={handleChange}
                      >
                        <option value="INTERNAL">INTERNAL</option>
                        <option value="EXTERNAL">EXTERNAL</option>
                      </select>
                      <ChevronRight className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90 transition-colors pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Commission & Target */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('salesman.form.commissionInfo')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('salesman.form.commissionInfoDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Payment Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.paymentType')}</Label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors pointer-events-none" />
                        <select
                          name="paymentType"
                          className="w-full h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all appearance-none cursor-pointer"
                          value={formData.paymentType}
                          onChange={handleChange}
                        >
                          <option value="COMMISSION">COMMISSION</option>
                          <option value="CASH">CASH</option>
                          <option value="INSTALLMENT">INSTALLMENT</option>
                        </select>
                      <ChevronRight className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  {/* Commission Base */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.commissionBase')}</Label>
                    <div className="relative group">
                      <Percent className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors pointer-events-none" />
                      <select
                        name="commissionBase"
                        className="w-full h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#B39371]/10 transition-all appearance-none cursor-pointer"
                        value={formData.commissionBase}
                        onChange={handleChange}
                      >
                        <option value="PERCENTAGE">PERCENTAGE</option>
                        <option value="FIXED">FIXED</option>
                      </select>
                      <ChevronRight className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  {/* Commission Value */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.commissionValue')}</Label>
                    <div className="relative group">
                      <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors flex items-center justify-center font-bold text-[10px]">
                        {formData.commissionBase === 'PERCENTAGE' ? '%' : 'SAR'}
                      </div>
                      <Input
                        name="commissionValue"
                        type="number"
                        step="0.01"
                        placeholder={t('salesman.form.placeholders.commissionValue')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        value={formData.commissionValue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Target Completion Status */}
                  <div className="md:col-span-2 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Has Target?</h3>
                        <p className="text-[10px] text-gray-500 font-medium">Toggle if this salesman has a specific apartment target</p>
                      </div>
                    </div>
                    <Switch 
                      checked={formData.completeTarget}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>

                  {/* Apartment Target Goal - Conditional */}
                  {formData.completeTarget && (
                    <motion.div 
                      className="md:col-span-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.targetGoal')}</Label>
                      <div className="relative group">
                        <Target className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                        <Input
                          name="apartmentTargetGoal"
                          type="number"
                          placeholder={t('salesman.form.placeholders.targetGoal')}
                          className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                          value={formData.apartmentTargetGoal}
                          onChange={handleChange}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('salesman.form.scheduleInfo')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('salesman.form.scheduleInfoDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.startDate')}</Label>
                    <DatePicker
                      value={formData.startDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('salesman.endDate')}</Label>
                    <DatePicker
                      value={formData.endDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Bar */}
            <div className=" w-ful z-50">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocation('/salesman')}
                  className="h-12 px-8 rounded-xl font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
                >
                  {t('common.cancel')}
                </Button>
                
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-12 px-12 rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-extrabold shadow-xl shadow-[#4A1B1B]/20 flex items-center gap-3 transition-all min-w-[200px] border border-white/10"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {t('users.saveChanges')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
