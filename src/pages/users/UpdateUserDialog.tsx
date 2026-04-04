import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from "react-hot-toast";
import { 
  Loader2, 
  Mail, 
  Shield, 
  User as UserIcon, 
  Sparkles,
  CheckCircle2,
  XCircle,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaginatedSelect } from '@/components/shared/PaginatedSelect';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  email: string;
  isVerified: boolean;
  roleId: number;
  role: Role;
}

interface UpdateUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateUserDialog({ user, open, onOpenChange }: UpdateUserDialogProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    roleId: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        roleId: user.roleId.toString()
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch(`/user/${user?.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('users.successUpdate'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('users.errorUpdate'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      email: formData.email,
      roleId: parseInt(formData.roleId)
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, roleId: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 border-none bg-white dark:bg-gray-950 shadow-2xl rounded-3xl overflow-hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Premium Header with Background Pattern */}
              <div className="relative h-32 bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] p-8 overflow-hidden">
                <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-64 h-64 bg-white/5 rounded-full -mr-20 rtl:-mr-0 rtl:-ml-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-32 h-32 bg-[#B39371]/10 rounded-full -ml-10 rtl:-ml-0 rtl:-mr-10 -mb-10 blur-2xl" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <UserIcon className="w-6 h-6 text-[#B39371]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {t('users.updateAccount')}
                      <Sparkles className="w-4 h-4 text-[#B39371]" />
                    </h2>
                    <p className="text-white/60 text-xs font-medium">{t('users.updateAccountDesc')}</p>
                  </div>
                </div>
              </div>

              {/* User Profile Summary */}
              <div className="px-8 -mt-6 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-4 border-white dark:border-gray-950 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-[#B39371] to-[#C4A484] text-white text-lg font-black">
                      {user?.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {user?.email.split('@')[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user?.isVerified 
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" 
                          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10"
                      )}>
                        {user?.isVerified ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user?.isVerified ? t('users.verifiedAccount') : t('users.pendingVerification')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{t('users.userId')}</p>
                    <p className="text-xs font-mono font-bold text-[#B39371]">#{user?.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('users.emailAddress')}</Label>
                      <Fingerprint className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center transition-transform group-focus-within:scale-110">
                        <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={t('users.placeholders.email')}
                        className="h-12 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-[#B39371]/10 focus:border-[#B39371]/50 transition-all font-semibold text-gray-700 dark:text-gray-200"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="roleId" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('users.role')}</Label>
                      <Shield className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                    <PaginatedSelect
                      apiEndpoint="/role-permission"
                      queryKey="roles"
                      value={formData.roleId}
                      onChange={handleRoleChange}
                      placeholder={t('users.assignRole')}
                      searchPlaceholder={t('users.searchRoles')}
                      mapResponseToOptions={(res) => res.data.map((role: any) => ({
                        value: role.id.toString(),
                        label: role.name,
                        description: role.description,
                        icon: <Shield className="w-4 h-4" />
                      }))}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="flex-1 h-12 rounded-xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all underline decoration-gray-200"
                  >
                    {t('users.discard')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-xl shadow-[#4A1B1B]/20 transition-all active:scale-[0.98]"
                  >
                    {updateMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('users.applyingChanges')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{t('users.saveChanges')}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
