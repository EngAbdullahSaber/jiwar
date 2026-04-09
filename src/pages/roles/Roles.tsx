import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import {
  Shield,
  Search,
  Plus,
  MoreVertical,
  ShieldCheck,
  PlusCircle,
  Briefcase,
  Settings,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Users,
  Lock,
  Trash2,
  Edit,
  Key,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { StatCard } from '../../components/shared/StatCard';
import { DeleteDialog } from '../../components/shared/DeleteDialog';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Permission {
  id: number;
  resource: string;
  actions: string[];
}

interface RolePermission {
  id: number;
  permission: Permission;
}

interface Role {
  id: number;
  name: string;
  description: string;
  rolePermissions: RolePermission[];
  _count?: {
    users: number;
  };
}

interface RoleResponse {
  code: number;
  data: Role[];
  totalItems: number;
  totalPages: number;
}

export default function Roles() {
  const [searchValue, setSearchValue] = useState('');
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const { t } = useTranslation();
   const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<RoleResponse>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get('/role-permission', {
        params: { page: 1, pageSize: 50 },
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/role-permission/${id}`);
    },
    onSuccess: () => {
      toast.success(t('roles.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setRoleToDelete(null);
    },
    onError: () => {
      toast.error(t('roles.deleteError'));
    },
  });

  const getRoleIcon = (name: string) => {
    const lowName = name.toLowerCase();
    if (lowName.includes('admin')) return ShieldCheck;
    if (lowName.includes('finance') || lowName.includes('audit')) return CreditCard;
    if (lowName.includes('site') || lowName.includes('supervisor')) return Building2;
    if (lowName.includes('project')) return Calendar;
    if (lowName.includes('procurement')) return Briefcase;
    if (lowName.includes('manager')) return Settings;
    return Shield;
  };

  const filteredRoles = data?.data.filter(
    (role) =>
      role.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (role.description?.toLowerCase().includes(searchValue.toLowerCase()) ?? false)
  );

  const totalUsers = data?.data.reduce((sum, r) => sum + (r._count?.users || 0), 0) || 0;
  const totalPermissions = data?.data.reduce((sum, r) => sum + (r.rolePermissions?.length || 0), 0) || 0;

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Shield className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t('roles.title')}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {t('roles.title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('roles.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-10 px-4 rounded-md border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('common.refresh')}
                </Button>

                <Link href="/roles/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    {t('roles.create')}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Shield}
              label={t('roles.title')}
              value={data?.totalItems || 0}
              subValue={t('roles.totalRoles')}
              color="from-[#4A1B1B] to-[#6B2727]"
            />
            <StatCard
              icon={Users}
              label={t('sidebar.users')}
              value={totalUsers}
              subValue={t('roles.usersAssigned')}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Key}
              label={t('roles.permissions')}
              value={totalPermissions}
              subValue={t('roles.totalPermissions')}
              color="from-amber-500 to-amber-600"
            />
            <StatCard
              icon={Lock}
              label={t('roles.accessControl')}
              value={data?.data.filter(r => (r._count?.users || 0) > 0).length || 0}
              subValue={t('roles.activeRoles')}
              color="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('roles.searchPlaceholder')}
                className="pl-11 rtl:pl-4 rtl:pr-11 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-lg focus-visible:ring-2 focus-visible:ring-[#B39371]/20 transition-all"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[240px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse"
                />
              ))
            ) : (
              <AnimatePresence>
                {filteredRoles?.map((role, index) => {
                  const RoleIcon = getRoleIcon(role.name);
                  const permCount = role.rolePermissions?.length || 0;
                  const userCount = role._count?.users || 0;

                  return (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg hover:border-[#B39371]/30 transition-all flex flex-col gap-5 overflow-hidden"
                    >
                      {/* Glow */}
                      <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto w-40 h-40 bg-[#B39371]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Top row */}
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4A1B1B]/8 to-[#6B2727]/12 dark:from-[#B39371]/10 dark:to-[#D4A574]/15 flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371] border border-[#4A1B1B]/10 dark:border-[#B39371]/20 group-hover:scale-110 transition-transform">
                            <RoleIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#B39371] transition-colors">
                              {role.name.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              #{role.id}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuLabel className="text-xs font-medium text-gray-400">
                              {t('common.actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/roles/${role.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer rounded-lg gap-2">
                                <Edit className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs">{t('common.edit')}</span>
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer rounded-lg gap-2 text-red-600 focus:text-red-700"
                              onClick={() => setRoleToDelete(role.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-xs">{t('common.delete')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 relative z-10">
                        {role.description || t('roles.noDescription')}
                      </p>

                      {/* Divider */}
                      <div className="border-t border-gray-100 dark:border-gray-800 relative z-10" />

                      {/* Stats row */}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                          <Users className="w-3 h-3" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider">
                            {userCount} {t('sidebar.users')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                          <Key className="w-3 h-3" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider">
                            {permCount} {t('roles.perms')}
                          </span>
                        </div>
                        <Link href={`/roles/${role.id}/edit`} className="ms-auto">
                          <button className="text-[10px] font-semibold text-[#B39371] hover:text-[#9A7A5A] transition-colors flex items-center gap-1">
                            {t('roles.editPermissions')}
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Create New Role Card */}
                {!searchValue && (
                  <Link href="/roles/new">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (filteredRoles?.length || 0) * 0.04 + 0.1 }}
                      className="group h-full min-h-[240px] bg-[#B39371]/5 dark:bg-[#B39371]/5 rounded-2xl border-2 border-dashed border-[#B39371]/25 p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-[#B39371]/50 hover:bg-[#B39371]/10 transition-all cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 border border-[#B39371]/20 flex items-center justify-center text-[#B39371] shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <PlusCircle className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {t('roles.create')}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] mx-auto leading-relaxed">
                          {t('roles.createCardDesc')}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Empty State */}
          {!isLoading && filteredRoles?.length === 0 && searchValue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-9 h-9 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('roles.empty.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                {t('roles.empty.description')}
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchValue('')}
                className="rounded-lg px-6"
              >
                {t('roles.empty.clearSearch')}
              </Button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={roleToDelete !== null}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => roleToDelete !== null && deleteMutation.mutate(roleToDelete)}
        isDeleting={deleteMutation.isPending}
      />
    </Shell>
  );
}
