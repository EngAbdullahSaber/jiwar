import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import {
  MoreVertical,
  User as UserIcon,
  Shield,
  CreditCard,
  Building2,
  Users as UsersIcon,
  Edit,
  Trash2,
  RefreshCw,
  Sparkles,
  Plus,
  Mail,
  Phone,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UpdateUserDialog } from "./UpdateUserDialog";
import { DataTable } from "../../components/shared/DataTable";
import type { Column } from "../../components/shared/DataTable";
import { FilterBar } from "../../components/shared/FilterBar";
import type { FilterField } from "../../components/shared/FilterBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeletedModule {
  module: string;
  count: number;
  label: { arabic: string; english: string };
}

interface DeleteImpactData {
  isAffected: boolean;
  deletedModules: DeletedModule[];
  setNullModules: any[];
  deletedMessage: { arabic: string; english: string } | null;
  setNullMessage: { arabic: string; english: string } | null;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  email: string;
  fullName?: string;
  phoneNumber: string;
  isVerified: boolean;
  roleId: number;
  role: Role;
}

interface UserResponse {
  code: number;
  data: User[];
  totalItems: number;
  totalPages: number;
}

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "all",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [impactData, setImpactData] = useState<DeleteImpactData | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const lang = i18n.language === "ar" ? "arabic" : "english";

  const { data, isLoading, refetch } = useQuery<UserResponse>({
    queryKey: [
      "users",
      currentPage,
      filters.search,
      filters.role,
      filters.status,
    ],
    queryFn: async () => {
      const response = await api.get("/user", {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: filters.search || undefined,
          roleId:
            filters.role && filters.role !== "all" ? filters.role : undefined,
          isVerified:
            filters.status === "verified"
              ? true
              : filters.status === "unverified"
                ? false
                : undefined,
        },
      });
      return response.data;
    },
  });

  const impactMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.get("/delete-impact", { params: { module: "user", id } });
      return res.data.data as DeleteImpactData;
    },
    onSuccess: (data) => {
      setImpactData(data);
    },
    onError: () => {
      toast({ title: t("common.error"), variant: "destructive" });
      setUserToDelete(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/user/${id}`);
    },
    onSuccess: () => {
      toast({ title: t("common.success"), description: t("users.deleteSuccess") });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
      setImpactData(null);
    },
    onError: () => {
      toast({ title: t("common.error"), description: t("users.deleteError"), variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    setUserToDelete(id);
    impactMutation.mutate(id);
  };

  const filterFields: FilterField[] = [
    {
      type: "search",
      label: t("users.fullName"),
      placeholder: t("users.searchPlaceholder"),
      key: "search",
    },
    {
      type: "paginated-select",
      label: t("users.role"),
      placeholder: t("users.allRoles"),
      key: "role",
      apiEndpoint: "/role-permission",
      queryKey: "roles-filter",
      mapResponseToOptions: (res) =>
        res.data
          .filter((role: any) => role.id !== 5 && role.id !== 6)
          .map((role: any) => ({
            value: role.id.toString(),
            label: role.name,
            description: role.description,
          })),
    },
  ];

  const ROLE_CONFIG: Record<string, { color: string; icon: any }> = {
    admin: {
      color:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
      icon: Shield,
    },
    salesmanager: {
      color:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
      icon: UsersIcon,
    },
    "sales manager": {
      color:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
      icon: UsersIcon,
    },
    finance: {
      color:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      icon: CreditCard,
    },
    "construction manager": {
      color:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      icon: Building2,
    },
    default: {
      color:
        "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
      icon: UserIcon,
    },
  };

  const getRoleConfig = (role: string) => {
    const key = role?.toLowerCase() || "";
    return ROLE_CONFIG[key] || ROLE_CONFIG.default;
  };

  const columns: Column<User>[] = [
    {
      header: t("users.fullName"),
      cell: (user) => {
        const displayName = user.fullName || user.email.split("@")[0];
        const initials = displayName.substring(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-[#B39371] to-[#C4A484] text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {displayName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: t("users.phoneNumber"),
      cell: (user) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {user.phoneNumber || t("common.na")}
        </div>
      ),
    },
    {
      header: t("users.role"),
      cell: (user) => {
        const config = getRoleConfig(user.role.name);
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-inherit transition-colors" />
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md border shadow-sm transition-all",
                config.color,
              )}
            >
              {user.role.name}
            </Badge>
          </div>
        );
      },
    },

    {
      header: t("users.status"),
      cell: (user) => (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-md",
              user.isVerified ? "bg-emerald-500 animate-pulse" : "bg-gray-300",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              user.isVerified ? "text-emerald-600" : "text-gray-400",
            )}
          >
            {user.isVerified ? t("users.active") : t("users.inactive")}
          </span>
        </div>
      ),
    },
    {
      header: t("common.actions"),
      headerClassName: "text-right rtl:text-left",
      className: "text-right rtl:text-left",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-md">
            <DropdownMenuLabel className="text-xs font-medium text-gray-400">
              {t("users.actions")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Can I="UPDATE" a="user">
              <DropdownMenuItem
                className="rounded-md cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setIsUpdateDialogOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
                <span className="text-xs">{t("users.edit")}</span>
              </DropdownMenuItem>
            </Can>
            <Can I="DELETE" a="user">
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-md cursor-pointer text-red-600 focus:bg-rose-50 dark:focus:bg-rose-900/10"
                  onClick={() => handleDelete(user.id)}
                  disabled={impactMutation.isPending && userToDelete === user.id}
                >
                  {impactMutation.isPending && userToDelete === user.id ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2" />
                  )}
                  <span className="text-xs">{t("users.delete")}</span>
                </DropdownMenuItem>
              </>
            </Can>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <UsersIcon className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t("users.title")}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("users.title")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("users.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="h-10 px-4 rounded-md border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("users.refresh")}
                </Button>

                <Can I="CREATE" a="user">
                  <Link href="/users/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t("users.create")}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            fields={filterFields}
            values={filters}
            onChange={(key, value) => {
              setFilters((prev) => ({ ...prev, [key]: value }));
              setCurrentPage(1);
            }}
            onReset={() => setFilters({ search: "", role: "", status: "all" })}
          />

          <DataTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
            loadingMessage={t("users.loading")}
            currentPage={currentPage}
            totalPages={data?.totalPages}
            totalItems={data?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <UpdateUserDialog
        user={selectedUser}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      <AlertDialog open={!!impactData} onOpenChange={(open) => { if (!open) { setImpactData(null); setUserToDelete(null); } }}>
        <AlertDialogContent className="max-w-md rounded-md border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              {t("deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {impactData && impactData.deletedModules && impactData.deletedModules.length > 0 && (
            <div className="my-2 rounded-md bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 p-4">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-3">
                {t("deleteDialog.alsoWillDelete")}
              </p>
              <ul className="space-y-2">
                {impactData.deletedModules.map((mod, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                      {mod.label[lang]}
                    </span>
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {mod.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setImpactData(null); setUserToDelete(null); }}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (userToDelete) deleteMutation.mutate(userToDelete); }}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
