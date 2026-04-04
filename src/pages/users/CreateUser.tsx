import { useState } from 'react';
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  Users as UsersIcon, 
  ChevronRight, 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Link } from 'wouter';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface RoleResponse {
  code: number;
  data: Role[];
  totalItems: number;
}

export default function CreateUser() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: ''
  });

  // Fetch roles for the dropdown
  const { data: rolesData, isLoading: rolesLoading } = useQuery<RoleResponse>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get('/role-permission', {
        params: { page: 1, pageSize: 50 }
      });
      return response.data;
    }
  });

  const { t } = useTranslation();

  const createMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post('/user', userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('users.successCreate'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setLocation('/users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('users.errorCreate'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('users.passwordsDontMatch'));
      return;
    }

    if (!formData.roleId) {
      toast.error(t('users.pleaseSelectRole'));
      return;
    }

    createMutation.mutate({
      email: formData.email,
      password: formData.password,
      roleId: parseInt(formData.roleId)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                href="/users" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
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
                    {t('users.title')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('users.create')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('users.description')}
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('users.accountInfo')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.accountInfoDesc')}</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 lg:p-12 space-y-10">

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700">{t('users.fullName')}</Label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="fullName"
                        placeholder={t('users.placeholders.fullName')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700">{t('users.workEmail')}</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        required
                        placeholder={t('users.placeholders.email')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700">{t('users.password')}</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="password"
                        type="password"
                        required
                        placeholder={t('users.placeholders.password')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700">{t('users.confirmPassword')}</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder={t('users.placeholders.password')}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#B39371]/10 transition-all"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Role Assignment */}
                  <div className="md:col-span-2 space-y-2.5">
                    <Label className="text-sm font-semibold text-gray-700">{t('users.roleAssignment')}</Label>
                    <div className="relative group">
                      <select
                        name="roleId"
                        required
                        className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#B39371]/10 transition-all appearance-none cursor-pointer"
                        value={formData.roleId}
                        onChange={handleChange}
                      >
                        <option value="">{t('users.selectRole')}</option>
                        {rolesData?.data.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name} - {role.description}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] rotate-90" />
                    </div>
                    {rolesLoading && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 px-2 mt-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{t('users.fetchingRoles')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-8 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800 mt-12">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation('/users')}
                    className="h-12 px-8 rounded-md font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all underline decoration-gray-200"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="h-12 px-10 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-lg shadow-[#4A1B1B]/20 flex items-center gap-2 transition-all min-w-[180px]"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('users.creating')}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {t('users.create')}
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
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-widest">{t('users.guidelines.verification')}</p>
                  <p className="text-[12px] text-emerald-700 dark:text-emerald-500/80 leading-relaxed">{t('users.guidelines.verificationDesc')}</p>
                </div>
             </div>
             <div className="p-6 bg-amber-50 dark:bg-amber-500/5 rounded-md border border-amber-100 dark:border-amber-500/20 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">{t('users.guidelines.permissions')}</p>
                  <p className="text-[12px] text-amber-700 dark:text-amber-500/80 leading-relaxed">{t('users.guidelines.permissionsDesc')}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
