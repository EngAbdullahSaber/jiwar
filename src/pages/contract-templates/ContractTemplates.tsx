import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { DataTable } from "../../components/shared/DataTable";
import type { Column } from "../../components/shared/DataTable";
import { FilterBar } from "../../components/shared/FilterBar";
import type { FilterField } from "../../components/shared/FilterBar";
import { DeleteDialog } from "../../components/shared/DeleteDialog";
import { Link } from "wouter";
import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import { StatCard } from "../../components/shared/StatCard";
import { FileText, Plus, Eye, Pencil, Sparkles, Files, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface ContractTemplate {
  id: number;
  name: { arabic: string; english: string };
  templateId: string;
  url: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: { id: number; email: string } | null;
  updatedBy: { id: number; email: string } | null;
}

interface ContractTemplatesResponse {
  code: number;
  message: { arabic: string; english: string };
  data: ContractTemplate[];
  totalItems: number;
  totalPages: number;
}

export default function ContractTemplates() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ContractTemplate | null>(null);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery<ContractTemplatesResponse>({
    queryKey: ["contract-templates", currentPage, pageSize, filters.search],
    queryFn: async () => {
      const res = await api.get("/contract-template", {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
        },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contract-template/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract-templates"] });
      toast.success(t("contractTemplates.success.delete"), {
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      setDeleteTarget(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("contractTemplates.errors.delete"),
        {
          icon: "❌",
          style: { borderRadius: "1rem", background: "#ef4444", color: "#fff" },
        }
      );
    },
  });

  const filterFields: FilterField[] = [
    {
      type: "search",
      label: t("contractTemplates.title"),
      placeholder: t("contractTemplates.placeholders.search"),
      key: "search",
    },
  ];

  const columns: Column<ContractTemplate>[] = [
    {
      header: t("common.id"),
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371] w-16",
    },
    {
      header: t("contractTemplates.labels.name"),
      cell: (ct) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {i18n.language === "ar" ? ct.name?.arabic : ct.name?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === "ar" ? ct.name?.english : ct.name?.arabic}
          </p>
        </div>
      ),
    },
    {
      header: t("contractTemplates.labels.templateId"),
      cell: (ct) => (
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {ct.templateId?.slice(0, 8)}…
        </span>
      ),
    },
    {
      header: t("contractTemplates.labels.createdBy"),
      cell: (ct) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {ct.createdBy?.email ?? "—"}
        </span>
      ),
    },
    {
      header: t("contractTemplates.labels.createdAt"),
      cell: (ct) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {ct.createdAt ? format(new Date(ct.createdAt), "dd MMM yyyy") : "—"}
        </span>
      ),
    },
    {
      header: t("common.actions"),
      headerClassName: "text-center",
      cell: (ct) => (
        <div className="flex items-center justify-center gap-2">
          <Can I="READ" a="contract-template">
            <Link href={`/contract-templates/${ct.id}`}>
              <button
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title={t("common.view")}
              >
                <Eye className="w-4 h-4" />
              </button>
            </Link>
          </Can>
          <Can I="UPDATE" a="contract-template">
            <Link href={`/contract-templates/${ct.id}/edit`}>
              <button
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title={t("common.edit")}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </Link>
          </Can>
          <Can I="DELETE" a="contract-template">
            <button
              onClick={() => setDeleteTarget(ct)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-500 transition-colors"
              title={t("common.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Can>
        </div>
      ),
    },
  ];

  const templates = response?.data || [];

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <FileText className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t("contractTemplates.management")}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("contractTemplates.title")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("contractTemplates.description")}
                  </p>
                </div>
              </div>

              <Can I="CREATE" a="contract-template">
                <Link href="/contract-templates/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    {t("contractTemplates.add")}
                  </motion.button>
                </Link>
              </Can>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={Files}
              label={t("contractTemplates.stats.total")}
              value={(response?.totalItems || 0).toLocaleString()}
              subValue={t("contractTemplates.stats.available")}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={FileText}
              label={t("contractTemplates.stats.pages")}
              value={(response?.totalPages || 0).toLocaleString()}
              subValue={t("contractTemplates.stats.pagesDesc")}
              color="from-amber-500 to-amber-600"
            />
          </div>

          {/* Filter */}
          <FilterBar
            fields={filterFields}
            values={filters}
            onChange={(key, value) => {
              setFilters((prev) => ({ ...prev, [key]: value }));
              setCurrentPage(1);
            }}
          />

          <DataTable
            columns={columns}
            data={templates}
            isLoading={isLoading}
            loadingMessage={t("common.loading")}
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty state */}
          {!isLoading && templates.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("contractTemplates.empty.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search
                  ? t("contractTemplates.empty.description")
                  : t("contractTemplates.empty.createFirst")}
              </p>
              {!filters.search && (
                <Link href="/contract-templates/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t("contractTemplates.add")}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isDeleting={deleteMutation.isPending}
        title={t("contractTemplates.deleteTitle")}
        description={t("contractTemplates.deleteDescription", {
          name: deleteTarget
            ? i18n.language === "ar"
              ? deleteTarget.name?.arabic
              : deleteTarget.name?.english
            : "",
        })}
      />
    </Shell>
  );
}
