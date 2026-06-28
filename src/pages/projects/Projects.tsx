import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { StatCard } from "../../components/shared/StatCard";
import { DataTable } from "../../components/shared/DataTable";
import type { Column } from "../../components/shared/DataTable";
import { FilterBar } from "../../components/shared/FilterBar";
import type { FilterField } from "../../components/shared/FilterBar";

import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import {
  Building2,
  MapPin,
  Plus,
  Eye,
  Pencil,
  Wallet,
  Sparkles,
  Home,
  FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Project {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  projectIdentity: string;
  address: string;
  status: string;
  budgetSum: number;
  totalApartments: number;
  apartmentsWithContract: number;
  estimatedBudget?: number | null;
  sk?: string | null;
}

interface ProjectsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Project[];
  statics: {
    totalBudget: number;
    evacuationCount: number;
    demolitionCount: number;
  };
  totalItems: number;
  totalPages: number;
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ["projects", currentPage, pageSize, filters.search],
    queryFn: async () => {
      const res = await api.get("/project", {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
        },
      });
      return res.data;
    },
  });

  const filterFields: FilterField[] = [
    {
      type: "search",
      label: t("projects.labels.projectName"),
      placeholder: t("projects.placeholders.search"),
      key: "search",
    },
  ];

  const columns: Column<Project>[] = [
    {
      header: t("projects.labels.projectId"),
      accessorKey: "projectIdentity",
      className: "text-sm font-medium text-[#B39371]",
    },
    {
      header: t("projects.labels.projectName"),
      cell: (p) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {i18n.language === "ar" ? p.name?.arabic : p.name?.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {i18n.language === "ar" ? p.name?.english : p.name?.arabic}
          </p>
        </div>
      ),
    },
    {
      header: t("projects.labels.location"),
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{p.address || "N/A"}</span>
        </div>
      ),
    },

    {
      header: t("projects.labels.budget"),
      cell: (p) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          SAR {p.budgetSum?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: t("projects.labels.progress"),
      cell: (p) => {
        const progress =
          p.totalApartments > 0
            ? Math.floor((p.apartmentsWithContract / p.totalApartments) * 100)
            : 0;
        return (
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="flex-1">
              <Progress
                value={progress}
                className="h-2 bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
        );
      },
    },
    {
      header: t("projects.labels.sold"),
      cell: (p) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {p.apartmentsWithContract}
        </span>
      ),
      className: "text-center",
      headerClassName: "text-center",
    },
    {
      header: t("projects.labels.reserved"),
      cell: (p) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {p.totalApartments - p.apartmentsWithContract}
        </span>
      ),
      className: "text-center",
      headerClassName: "text-center",
    },
    {
      header: t("common.actions"),
      headerClassName: "text-center",
      cell: (p) => (
        <div className="flex items-center justify-center gap-2">
          <Can I="READ" a="project">
            <Link href={`/projects/${p.id}`}>
              <button
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title="View Profile"
              >
                <Eye className="w-4 h-4" />
              </button>
            </Link>
          </Can>
          <Can I="UPDATE" a="project">
            <>
              <Link href={`/projects/${p.id}/media`}>
                <button
                  className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#B39371] transition-colors"
                  title="Add Media"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
              </Link>
              <Link href={`/projects/${p.id}/edit`}>
                <button
                  className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </Link>
            </>
          </Can>
        </div>
      ),
    },
  ];

  const projects = response?.data || [];
  const statics = response?.statics;
  const totalProjects = response?.totalItems || 0;

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-30" />
                  <div className="relative w-16 h-16 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                      {t("projects.management")}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("projects.listTitle")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("projects.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Can I="CREATE" a="project">
                  <Link href="/projects/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-bold shadow-xl shadow-[#4A1B1B]/20 hover:shadow-2xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t("projects.create")}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              icon={Building2}
              label={t("projects.stats.totalProjects")}
              value={totalProjects.toLocaleString()}
              subValue={t("projects.stats.activeProjects")}
              trendDirection="up"
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Wallet}
              label={t("projects.stats.totalBudget")}
              value={`${statics?.totalBudget?.toLocaleString() || "0"} SAR`}
              subValue={t("projects.stats.allPhases")}
              color="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Filter Bar */}
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
            data={projects}
            isLoading={isLoading}
            loadingMessage="Loading projects..."
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("projects.empty.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search
                  ? t("projects.empty.description")
                  : t("projects.empty.createFirst")}
              </p>
              {!filters.search && (
                <Link href="/projects/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t("projects.create")}
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Shell>
  );
}
