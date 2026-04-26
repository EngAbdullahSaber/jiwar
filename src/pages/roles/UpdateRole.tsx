import { useState, useEffect } from 'react';
import { useLocation, useParams } from "wouter";
import { useTranslation, Trans } from "react-i18next";
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  Shield, 
  ArrowLeft,
  Search,
  LayoutGrid,
  ClipboardList,
  Users,
  Wallet,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  Sparkles,
  Fingerprint,
  Info
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
 
interface Permission {
  id: number;
  resource: string;
  actions: string[];
}

interface PermissionResponse {
  code: number;
  data: Permission[];
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
}

interface RoleDataResponse {
  code: number;
  data: Role;
}

const RESOURCE_ICONS: Record<string, any> = {
  user: Users,
  role: Shield,
  legality: LayoutGrid,
  template: ClipboardList,
  project: LayoutGrid,
  apartment: LayoutGrid,
  client: Users,
  'client-payment': Wallet,
  salesman: Users,
  contract: FileText,
  statics: ClipboardList,
  country: LayoutGrid,
  bank: Wallet,
  city: LayoutGrid,
  material: ClipboardList,
  'role-permission': Settings
};

export default function UpdateRole() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [searchValue, setSearchValue] = useState("");
  
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery<PermissionResponse>({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await api.get('/role-permission/permissions/all');
      return response.data;
    }
  });

  const { data: roleData, isLoading: roleLoading } = useQuery<RoleDataResponse>({
    queryKey: ['role', id],
    queryFn: async () => {
      const response = await api.get(`/role-permission/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Group permissions by resource for display
  const groupedPermissions = permissionsData?.data.reduce((acc, p) => {
    let resource = p.resource;
    let action = p.actions[0]; // The backend sends one action per entry in this format

    if (resource.includes(':')) {
      const parts = resource.split(':');
      resource = parts[1];
    }

    if (!acc[resource]) {
      acc[resource] = {
        resource,
        actions: {} as Record<string, number>
      };
    }
    acc[resource].actions[action] = p.id;
    return acc;
  }, {} as Record<string, { resource: string, actions: Record<string, number> }>);

  const modules = groupedPermissions ? Object.values(groupedPermissions) : [];

  useEffect(() => {
    if (roleData?.data) {
      setFormData({
        name: roleData.data.name,
        description: roleData.data.description || ''
      });

      const initialSelectedIds = roleData.data.rolePermissions.map(rp => rp.permission.id);
      setSelectedIds(initialSelectedIds);
    }
  }, [roleData]);

  const togglePermission = (permissionId: number) => {
    setSelectedIds(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const updateMutation = useMutation({
    mutationFn: async (roleData: any) => {
      const response = await api.patch(`/role-permission/${id}`, roleData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('common.success'));
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      setLocation('/roles');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('common.error'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    if (selectedIds.length === 0) {
      toast.error(t('roles.onePermissionRequired'));
      return;
    }

    updateMutation.mutate({
      name: formData.name,
      description: formData.description,
      permissionIds: selectedIds
    });
  };

  if (roleLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-[#B39371]" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Detailed Hero Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B39371]/5 rounded-md -mr-48 -mt-48 blur-3xl opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-xl flex items-center justify-center border border-white/10 rotate-3">
                  <Shield className="w-8 h-8 text-[#B39371]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#B39371] uppercase tracking-widest">
                      <Settings className="w-3.5 h-3.5" />
                      {t('roles.protocolUpdate')}
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('roles.modifyRole')}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg leading-relaxed">
                    <Trans 
                      i18nKey="roles.updateDescription" 
                      values={{ name: roleData?.data.name }}
                      components={[<span className="text-[#B39371] font-bold" />]}
                    />
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/roles')}
                className="h-11 rounded-md px-6 border-gray-200 text-gray-500 hover:text-gray-900 dark:hover:text-white dark:border-gray-800 transition-all font-bold gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('roles.returnRegistry')}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Details */}
              <div className="lg:col-span-4 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-8 shadow-sm sticky top-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-md bg-[#4A1B1B]/5 dark:bg-white/5 flex items-center justify-center text-[#4A1B1B] dark:text-[#B39371]">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('roles.roleIdentity')}</h2>
                      <p className="text-[11px] text-gray-400 font-medium">{t('roles.coreIdentifier')}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">{t('roles.roleIdentifier')}</Label>
                      <Input 
                        placeholder={t('roles.roleNamePlaceholder')}
                        className="h-12 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-[#B39371]/10 transition-all font-bold placeholder:font-normal"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">{t('roles.deploymentMemo')}</Label>
                      <textarea 
                        placeholder={t('roles.roleDescriptionPlaceholder')}
                        rows={4}
                        className="w-full p-4 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-[#B39371]/10 transition-all font-medium text-sm placeholder:font-normal resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-md border border-emerald-100 dark:border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                        {t('roles.securityChangesInstant')}
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-md border border-amber-100 dark:border-amber-500/10">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                        {t('roles.modifyingCoreStability')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Permissions Matrix */}
              <div className="lg:col-span-8 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  <div className="p-8 pb-4 border-b border-gray-50 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center text-[#B39371] shadow-lg">
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('roles.accessMatrix')}</h2>
                          <p className="text-xs text-gray-400 font-medium">{t('roles.togglePermissions')}</p>
                        </div>
                      </div>
                      <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder={t('roles.searchModules')}
                          className="h-10 pl-9 rounded-md bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-medium"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                        <TableRow className="border-b border-gray-100 dark:border-gray-800">
                          <TableHead className="w-[350px] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] h-12 px-8">{t('roles.componentModule')}</TableHead>
                          <TableHead className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] h-12 w-24">{t('roles.read')}</TableHead>
                          <TableHead className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] h-12 w-24">{t('roles.createPerm')}</TableHead>
                          <TableHead className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] h-12 w-24">{t('roles.edit')}</TableHead>
                          <TableHead className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] h-12 w-24">{t('roles.delete')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissionsLoading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                             <TableRow key={i} className="animate-pulse h-20 border-b border-gray-50 dark:border-gray-800/50">
                                <TableCell className="px-8"><div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md w-64" /></TableCell>
                                <TableCell><div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" /></TableCell>
                                <TableCell><div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" /></TableCell>
                                <TableCell><div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" /></TableCell>
                                <TableCell><div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" /></TableCell>
                             </TableRow>
                          ))
                        ) : (
                          <AnimatePresence>
                            {modules.filter(m => 
                              m.resource.toLowerCase().includes(searchValue.toLowerCase()) ||
                              (t(`roles.resources.${m.resource}`).toLowerCase().includes(searchValue.toLowerCase()) ?? false)
                            ).map((module, idx) => {
                              const Icon = RESOURCE_ICONS[module.resource] || Shield;
                              
                              return (
                                <motion.tr 
                                  key={module.resource}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  className="group hover:bg-[#B39371]/5 dark:hover:bg-[#B39371]/10 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 h-20"
                                >
                                  <TableCell className="px-8">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#4A1B1B]/10 group-hover:text-[#4A1B1B] dark:group-hover:bg-[#B39371]/20 dark:group-hover:text-[#B39371] transition-all border border-transparent group-hover:border-[#4A1B1B]/10 dark:group-hover:border-[#B39371]/30">
                                        <Icon className="w-6 h-6" />
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                          {t(`roles.resources.${module.resource}`, { defaultValue: module.resource })}
                                        </p>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium line-clamp-1">
                                          {t(`roles.resourceDescriptions.${module.resource}`, { defaultValue: 'Module access' })}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center">
                                      {module.actions.READ ? (
                                        <Checkbox 
                                          checked={selectedIds.includes(module.actions.READ)}
                                          onCheckedChange={() => togglePermission(module.actions.READ)}
                                          className="w-6 h-6 rounded-md border-gray-200 dark:border-gray-700 data-[state=checked]:bg-[#B39371] data-[state=checked]:border-[#B39371] transition-all hover:scale-110 active:scale-90"
                                        />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-md bg-gray-200 dark:bg-gray-800" />
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center">
                                      {module.actions.CREATE ? (
                                        <Checkbox 
                                          checked={selectedIds.includes(module.actions.CREATE)}
                                          onCheckedChange={() => togglePermission(module.actions.CREATE)}
                                          className="w-6 h-6 rounded-md border-gray-200 dark:border-gray-700 data-[state=checked]:bg-[#B39371] data-[state=checked]:border-[#B39371] transition-all hover:scale-110 active:scale-90"
                                        />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-md bg-gray-200 dark:bg-gray-800" />
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center">
                                      {module.actions.UPDATE ? (
                                        <Checkbox 
                                          checked={selectedIds.includes(module.actions.UPDATE)}
                                          onCheckedChange={() => togglePermission(module.actions.UPDATE)}
                                          className="w-6 h-6 rounded-md border-gray-200 dark:border-gray-700 data-[state=checked]:bg-[#B39371] data-[state=checked]:border-[#B39371] transition-all hover:scale-110 active:scale-90"
                                        />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-md bg-gray-200 dark:bg-gray-800" />
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center">
                                      {module.actions.DELETE ? (
                                        <Checkbox 
                                          checked={selectedIds.includes(module.actions.DELETE)}
                                          onCheckedChange={() => togglePermission(module.actions.DELETE)}
                                          className="w-6 h-6 rounded-md border-gray-200 dark:border-gray-700 data-[state=checked]:bg-[#B39371] data-[state=checked]:border-[#B39371] transition-all hover:scale-110 active:scale-90"
                                        />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-md bg-gray-200 dark:bg-gray-800" />
                                      )}
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              );
                            })}
                          </AnimatePresence>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Submission Row */}
                  <div className="p-8 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Info className="w-4 h-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{t('roles.protocolModificationAuth')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setLocation('/roles')}
                        className="h-12 px-8 rounded-md font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                      >
                        {t('roles.cancelUpdate')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="h-12 px-10 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-2xl shadow-[#4A1B1B]/30 flex items-center gap-3 transition-all active:scale-[0.98] min-w-[220px]"
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('roles.updatingRegistry')}
                          </>
                        ) : (
                          <>
                            <span>{t('roles.commitModifications')}</span>
                            <Sparkles className="w-4 h-4 text-[#B39371]" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
