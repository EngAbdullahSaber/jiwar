import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { StatCard } from "../../components/shared/StatCard";
import { DataTable } from "../../components/shared/DataTable";
import type { Column } from "../../components/shared/DataTable";
import { FilterBar } from "../../components/shared/FilterBar";
import type { FilterField } from "../../components/shared/FilterBar";
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
import { Link } from "wouter";
import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import {
  Building,
  Plus,
  Eye,
  Pencil,
  Sparkles,
  Home,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Apartment {
  id: number;
  mainName: {
    arabic: string;
    english: string;
  };
  secondaryName: {
    arabic: string;
    english: string;
  };
  floorNumber: number;
  size: string;
  templateName: {
    arabic: string;
    english: string;
  };
  templateTotalRooms: number;
  contracts?: { id: number }[];
}

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

interface ApartmentsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Apartment[];
  statics: {
    total: number;
    availableCount: number;
  };
  totalItems: number;
  totalPages: number;
}

export default function Apartments() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    search: "",
    projectId: "",
    status: "",
    streetCount: "",
    size: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const [apartmentToDelete, setApartmentToDelete] = useState<number | null>(null);
  const [impactData, setImpactData] = useState<DeleteImpactData | null>(null);

  const impactMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.get("/delete-impact", { params: { module: "apartment", id } });
      return res.data.data as DeleteImpactData;
    },
    onSuccess: (data) => {
      setImpactData(data);
    },
    onError: () => {
      toast.error(t("common.error"));
      setApartmentToDelete(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/apartment/${id}`);
    },
    onSuccess: () => {
      toast.success(t("apartments.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      setApartmentToDelete(null);
      setImpactData(null);
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  const handleDeleteClick = (id: number) => {
    setApartmentToDelete(id);
    impactMutation.mutate(id);
  };

  const lang = i18n.language === "ar" ? "arabic" : "english";

  const { data: response, isLoading } = useQuery<ApartmentsResponse>({
    queryKey: [
      "apartments",
      currentPage,
      pageSize,
      filters.search,
      filters.projectId,
      filters.status,
      filters.streetCount,
      filters.size,
    ],
    queryFn: async () => {
      const res = await api.get("/apartment", {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
          projectId: filters.projectId || undefined,
          status: filters.status || undefined,
          streetCount: filters.streetCount || undefined,
          size: filters.size || undefined,
        },
      });
      return res.data;
    },
  });

  const filterFields: FilterField[] = [
    {
      type: "search",
      label: t("apartments.title"),
      placeholder: t("apartments.placeholders.search"),
      key: "search",
    },
    {
      type: "paginated-select",
      label: t("apartments.labels.project"),
      key: "projectId",
      apiEndpoint: "/project",
      queryKey: "projects-filter-apartments",
      placeholder: t("apartments.placeholders.selectProject"),
      searchPlaceholder: t("apartments.placeholders.searchProject"),
      mapResponseToOptions: (data: any) =>
        data.data.map((project: any) => ({
          value: project.id,
          label: project.name.english,
          description: project.projectIdentity,
          icon: <Building className="w-4 h-4" />,
        })),
    },
    {
      type: "select",
      label: t("apartments.labels.status"),
      key: "status",
      placeholder: t("apartments.placeholders.selectStatus"),
      options: [
        { value: "available", label: t("apartments.statuses.available") },
        { value: "sold", label: t("apartments.statuses.sold") },
      ],
    },
    {
      type: "select",
      label: t("apartments.labels.streetCount"),
      key: "streetCount",
      placeholder: t("apartments.placeholders.selectType"),
      options: [
        { value: "ONE_STREET", label: t("apartments.streetCounts.ONE_STREET") },
        { value: "TWO_STREET", label: t("apartments.streetCounts.TWO_STREET") },
      ],
    },
    {
      type: "search",
      label: t("apartments.labels.size"),
      placeholder: t("apartments.placeholders.size"),
      key: "size",
    },
  ];

  const columns: Column<Apartment>[] = [
    {
      header: t("common.id"),
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371] w-16",
    },
    {
      header: t("apartments.labels.apartmentNo"),
      cell: (a) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {i18n.language === "ar" ? a.mainName?.arabic : a.mainName?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === "ar" ? a.mainName?.english : a.mainName?.arabic}
          </p>
        </div>
      ),
    },
    {
      header: t("apartments.labels.suite"),
      cell: (a) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">
            {i18n.language === "ar"
              ? a.secondaryName?.arabic
              : a.secondaryName?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === "ar"
              ? a.secondaryName?.english
              : a.secondaryName?.arabic}
          </p>
        </div>
      ),
    },
    {
      header: t("apartments.labels.floor"),
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {a.floorNumber}
        </span>
      ),
    },
    {
      header: t("apartments.labels.size"),
      cell: (a) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {a.size} {t("apartments.labels.sqmLabel")}
        </span>
      ),
    },
    {
      header: t("apartments.labels.template"),
      cell: (a) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-white">
            {i18n.language === "ar"
              ? a.templateName?.arabic
              : a.templateName?.english}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {a.templateTotalRooms} {t("apartments.labels.rooms")}
          </span>
        </div>
      ),
    },
    {
      header: t("apartments.labels.status"),
      cell: (a) => {
        const isSold = (a.contracts?.length ?? 0) > 0;
        return (
          <span
            className={
              isSold
                ? "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }
          >
            {isSold
              ? t("apartments.statuses.sold")
              : t("apartments.statuses.available")}
          </span>
        );
      },
    },
    {
      header: t("common.actions"),
      headerClassName: "text-center",
      cell: (a) => (
        <div className="flex items-center justify-center gap-2">
          <Can I="READ" a="apartment">
            <Link href={`/apartments/${a.id}`}>
              <button
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title={t("common.view")}
              >
                <Eye className="w-4 h-4" />
              </button>
            </Link>
          </Can>
          <Can I="UPDATE" a="apartment">
            <Link href={`/apartments/${a.id}/edit`}>
              <button
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title={t("common.edit")}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </Link>
          </Can>
          <Can I="DELETE" a="apartment">
            <button
              onClick={() => handleDeleteClick(a.id)}
              disabled={impactMutation.isPending && apartmentToDelete === a.id}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
              title={t("common.delete")}
            >
              {impactMutation.isPending && apartmentToDelete === a.id
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Trash2 className="w-4 h-4" />}
            </button>
          </Can>
        </div>
      ),
    },
  ];

  const apartments = response?.data || [];
  const statics = response?.statics;

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
                    <Building className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t("apartments.management")}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("apartments.title")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("apartments.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Can I="CREATE" a="apartment">
                  <Link href="/apartments/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t("apartments.add")}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              icon={Building}
              label={t("apartments.stats.total")}
              value={(statics?.total || 0).toLocaleString()}
              subValue={t("apartments.stats.acrossAll")}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={CheckCircle2}
              label={t("apartments.stats.available")}
              value={(statics?.availableCount || 0).toLocaleString()}
              subValue={t("apartments.stats.readyUnits")}
              color="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Filter Bar */}
          <FilterBar
            fields={filterFields}
            values={filters}
            rows={[2, 3]}
            onChange={(key, value) => {
              setFilters((prev) => ({ ...prev, [key]: value }));
              setCurrentPage(1);
            }}
          />

          <DataTable
            columns={columns}
            data={apartments}
            isLoading={isLoading}
            loadingMessage={t("common.loading")}
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && apartments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("apartments.empty.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search
                  ? t("apartments.empty.description")
                  : t("apartments.empty.createFirst")}
              </p>
              {!filters.search && (
                <Link href="/apartments/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t("apartments.add")}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Impact Dialog */}
      <AlertDialog
        open={apartmentToDelete !== null && impactData !== null}
        onOpenChange={(open) => {
          if (!open) {
            setApartmentToDelete(null);
            setImpactData(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[480px] rounded-md border border-red-100 dark:border-red-900/30 shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-900">
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

          <div className="p-6 space-y-4">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-md bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <AlertDialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("deleteDialog.confirmTitle")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("deleteDialog.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {impactData?.isAffected && impactData.deletedModules.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md p-4 space-y-3">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 leading-relaxed">
                  {t("deleteDialog.alsoWillDelete")}
                </p>
                <div className="space-y-2">
                  {impactData.deletedModules.map((m) => (
                    <div key={m.module} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {m.label?.[lang] || m.module}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md shrink-0">
                        {m.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter className="px-6 pb-6 flex-col-reverse sm:flex-row gap-3">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium"
            >
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (apartmentToDelete) deleteMutation.mutate(apartmentToDelete);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-500/30 transition-all border-none disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("deleteDialog.deleting")}
                </span>
              ) : t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
