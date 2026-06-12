import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { Shell } from "../../components/shared/Shell";
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
  Info,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { scrollToFirstError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
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

const ACTION_ORDER = ["READ", "CREATE", "UPDATE", "DELETE"];

const RESOURCE_GROUPS: Record<string, string[]> = {
  project: ["project-media"],
  apartment: ["apartment-media"],
  salesman: ["salesman-paid-log"],
  client: ["client-payment"],
};

const RESOURCE_ICONS: Record<string, any> = {
  user: Users,
  role: Shield,
  legality: LayoutGrid,
  template: ClipboardList,
  project: LayoutGrid,
  apartment: LayoutGrid,
  client: Users,
  "client-payment": Wallet,
  salesman: Users,
  contract: FileText,
  "contract-template": FileText,
  statics: ClipboardList,
  country: LayoutGrid,
  bank: Wallet,
  city: LayoutGrid,
  material: ClipboardList,
  "role-permission": Settings,
};

export default function UpdateRole() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: permissionsData, isLoading: permissionsLoading } =
    useQuery<PermissionResponse>({
      queryKey: ["permissions"],
      queryFn: async () => {
        const response = await api.get("/role-permission/permissions/all");
        return response.data;
      },
    });

  const { data: roleData, isLoading: roleLoading } = useQuery<RoleDataResponse>(
    {
      queryKey: ["role", id],
      queryFn: async () => {
        const response = await api.get(`/role-permission/${id}`);
        return response.data;
      },
      enabled: !!id,
    },
  );

  // Memoize groupedPermissions to prevent recalculation on every render
  const groupedPermissions = useMemo(() => {
    if (!permissionsData?.data) return null;

    return permissionsData.data
      .slice()
      .sort(
        (a, b) =>
          (a.resource.includes(":") ? 0 : 1) -
          (b.resource.includes(":") ? 0 : 1),
      )
      .reduce(
        (acc, p) => {
          let resource = p.resource;
          if (resource.includes(":")) resource = resource.split(":")[1];

          const parentResource = Object.keys(RESOURCE_GROUPS).find((parent) =>
            RESOURCE_GROUPS[parent].includes(resource),
          );
          const target = parentResource ?? resource;

          if (!acc[target]) {
            acc[target] = {
              resource: target,
              actions: {} as Record<string, number>,
              subPermissions: [] as Array<{
                resource: string;
                action: string;
                id: number;
              }>,
            };
          }

          if (parentResource) {
            p.actions.forEach((action) => {
              if (
                !acc[target].subPermissions.some(
                  (sp) => sp.resource === resource && sp.action === action,
                )
              ) {
                acc[target].subPermissions.push({ resource, action, id: p.id });
              }
            });
          } else {
            p.actions.forEach((action) => {
              if (!acc[target].actions[action])
                acc[target].actions[action] = p.id;
            });
          }
          return acc;
        },
        {} as Record<
          string,
          {
            resource: string;
            actions: Record<string, number>;
            subPermissions: Array<{
              resource: string;
              action: string;
              id: number;
            }>;
          }
        >,
      );
  }, [permissionsData?.data]);

  const modules = useMemo(() => {
    return groupedPermissions ? Object.values(groupedPermissions) : [];
  }, [groupedPermissions]);

  // Initialize form data only once when roleData loads
  useEffect(() => {
    if (roleData?.data && !isInitialized) {
      setFormData({
        name: roleData.data.name,
        description: roleData.data.description || "",
      });
      const newSelectedKeys = new Set<string>();
      roleData.data.rolePermissions.forEach((rp) => {
        rp.permission.actions.forEach((action) => {
          newSelectedKeys.add(`${rp.permission.id}|${action}`);
        });
      });
      setSelectedKeys(newSelectedKeys);
      setIsInitialized(true);
    }
  }, [roleData?.data, isInitialized]);

  const togglePermission = useCallback((id: number, action: string) => {
    const key = `${id}|${action}`;
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Memoize actionLabels to prevent recreation
  const actionLabels: Record<string, string> = useMemo(
    () => ({
      READ: t("roles.read"),
      CREATE: t("roles.createPerm"),
      UPDATE: t("roles.edit"),
      DELETE: t("roles.delete"),
    }),
    [t],
  );

  const updateMutation = useMutation({
    mutationFn: async (roleData: any) => {
      const response = await api.patch(`/role-permission/${id}`, roleData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("common.success"));
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", id] });
      setLocation("/roles");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t("common.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = t("common.fieldRequired");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }

    if (selectedKeys.size === 0) {
      toast.error(t("roles.onePermissionRequired"));
      return;
    }

    const permissionIds = [...new Set([...selectedKeys].map((key) => parseInt(key.split("|")[0])))];
    updateMutation.mutate({
      name: formData.name,
      description: formData.description,
      permissionIds,
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
                      {t("roles.protocolUpdate")}
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {t("roles.modifyRole")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg leading-relaxed">
                    {t("roles.updateDescription", {
                      name: roleData?.data?.name,
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation("/roles")}
                className="h-11 rounded-md px-6 border-gray-200 text-gray-500 hover:text-gray-900 dark:hover:text-white dark:border-gray-800 transition-all font-bold gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("roles.returnRegistry")}
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
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t("roles.roleIdentity")}
                      </h2>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {t("roles.coreIdentifier")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      label={t("roles.roleIdentifier")}
                      required
                      error={errors.name}
                    >
                      <Input
                        placeholder={t("roles.roleNamePlaceholder")}
                        className="h-12 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-[#B39371]/10 transition-all font-bold placeholder:font-normal"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          if (errors.name)
                            setErrors((p) => {
                              const { name, ...r } = p;
                              return r;
                            });
                        }}
                      />
                    </FormField>
                    <FormField label={t("roles.deploymentMemo")}>
                      <textarea
                        placeholder={t("roles.roleDescriptionPlaceholder")}
                        rows={4}
                        className="w-full p-4 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-[#B39371]/10 transition-all font-medium text-sm placeholder:font-normal resize-none"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </FormField>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-md border border-emerald-100 dark:border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                        {t("roles.securityChangesInstant")}
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-md border border-amber-100 dark:border-amber-500/10">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                        {t("roles.modifyingCoreStability")}
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
                          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                            {t("roles.accessMatrix")}
                          </h2>
                          <p className="text-xs text-gray-400 font-medium">
                            {t("roles.togglePermissions")}
                          </p>
                        </div>
                      </div>
                      <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={t("roles.searchModules")}
                          className="h-10 pl-9 rounded-md bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-medium"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="max-h-155 overflow-y-auto roles-scrollbar">
                    {permissionsLoading ? (
                      <div className="p-6 space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="animate-pulse border border-gray-100 dark:border-gray-800 rounded-md p-4"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-md shrink-0" />
                              <div className="space-y-1.5 flex-1">
                                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                                <div className="h-3 w-48 bg-gray-100 dark:bg-gray-800 rounded" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {Array.from({ length: 4 }).map((_, j) => (
                                <div
                                  key={j}
                                  className="h-16 bg-gray-100 dark:bg-gray-800 rounded-md"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 space-y-4">
                        <>
                          {modules
                            .filter(
                              (m) =>
                                m.resource
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase()) ||
                                (t(`roles.resources.${m.resource}`)
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase()) ??
                                  false),
                            )
                            .map((module, idx) => {
                              const Icon =
                                RESOURCE_ICONS[module.resource] || Shield;
                              const allActions = Object.keys(
                                module.actions,
                              ).sort((a, b) => {
                                const ai = ACTION_ORDER.indexOf(a);
                                const bi = ACTION_ORDER.indexOf(b);
                                return (
                                  (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
                                );
                              });
                              const totalCount =
                                allActions.length +
                                module.subPermissions.length;

                              return (
                                <motion.div
                                  key={module.resource}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  className="border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden"
                                >
                                  <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-9 h-9 rounded-md bg-linear-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center text-[#B39371] shadow-sm shrink-0">
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">
                                          {t(
                                            `roles.resources.${module.resource.toLowerCase()}`,
                                            { defaultValue: module.resource },
                                          )}
                                        </span>
                                        <span className="px-2 py-0.5 bg-[#B39371]/10 text-[#B39371] rounded-full text-[10px] font-bold shrink-0">
                                          {totalCount}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 font-medium truncate">
                                        {t(
                                          `roles.resourceDescriptions.${module.resource.toLowerCase()}`,
                                          {
                                            defaultValue:
                                              t("roles.moduleAccess"),
                                          },
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-4 grid grid-cols-2 gap-3">
                                    {allActions.map((action) => {
                                      const isChecked = selectedKeys.has(
                                        `${module.actions[action]}|${action}`,
                                      );
                                      return (
                                        <button
                                          key={action}
                                          type="button"
                                          onClick={() => togglePermission(module.actions[action], action)}
                                          className={`flex items-start gap-3 p-3 rounded-md border text-left transition-all cursor-pointer ${
                                            isChecked
                                              ? "border-[#B39371]/40 bg-[#B39371]/10 dark:bg-[#B39371]/15"
                                              : "border-gray-100 dark:border-gray-700 hover:border-[#B39371]/25 hover:bg-gray-50 dark:hover:bg-white/5"
                                          }`}
                                        >
                                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-[#B39371] border-[#B39371]" : "border-gray-200 dark:border-gray-700"}`}>
                                            {isChecked && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                          </div>
                                          <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                              {actionLabels[action] ?? action}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-medium">
                                              {t("roles.allowActionOn", {
                                                defaultValue: `Allow ${actionLabels[action] ?? action} on {{resource}}`,
                                                resource: t(
                                                  `roles.resources.${module.resource.toLowerCase()}`,
                                                  {
                                                    defaultValue:
                                                      module.resource,
                                                  },
                                                ),
                                              })}
                                            </p>
                                          </div>
                                        </button>
                                      );
                                    })}
                                    {module.subPermissions.map((sp) => {
                                      const isChecked = selectedKeys.has(
                                        `${sp.id}|${sp.action}`,
                                      );
                                      return (
                                        <button
                                          key={`${sp.resource}-${sp.action}`}
                                          type="button"
                                          onClick={() => togglePermission(sp.id, sp.action)}
                                          className={`flex items-start gap-3 p-3 rounded-md border text-left transition-all cursor-pointer ${
                                            isChecked
                                              ? "border-[#B39371]/40 bg-[#B39371]/10 dark:bg-[#B39371]/15"
                                              : "border-gray-100 dark:border-gray-700 hover:border-[#B39371]/25 hover:bg-gray-50 dark:hover:bg-white/5"
                                          }`}
                                        >
                                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-[#B39371] border-[#B39371]" : "border-gray-200 dark:border-gray-700"}`}>
                                            {isChecked && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                          </div>
                                          <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                              {t(
                                                `roles.resources.${sp.resource.toLowerCase()}`,
                                                { defaultValue: sp.resource },
                                              )}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-medium">
                                              {t("roles.allowActionOn", {
                                                defaultValue: `Allow ${actionLabels[sp.action] ?? sp.action} on {{resource}}`,
                                                resource: t(
                                                  `roles.resources.${sp.resource.toLowerCase()}`,
                                                  { defaultValue: sp.resource },
                                                ),
                                              })}
                                            </p>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              );
                            })}
                        </>
                      </div>
                    )}
                  </div>

                  {/* Submission Row */}
                  <div className="p-8 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Info className="w-4 h-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        {t("roles.protocolModificationAuth")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setLocation("/roles")}
                        className="h-12 px-8 rounded-md font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                      >
                        {t("roles.cancelUpdate")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="h-12 px-10 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#4A1B1B] text-white font-bold shadow-2xl shadow-[#4A1B1B]/30 flex items-center gap-3 transition-all active:scale-[0.98] min-w-[220px]"
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("roles.updatingRegistry")}
                          </>
                        ) : (
                          <>
                            <span>{t("roles.commitModifications")}</span>
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
