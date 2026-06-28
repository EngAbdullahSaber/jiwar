import { useState } from "react";
import { buildImageUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { StatCard } from "../../components/shared/StatCard";
import { DataTable } from "../../components/shared/DataTable";
import type { Column } from "../../components/shared/DataTable";
import { FilterBar } from "../../components/shared/FilterBar";
import type { FilterField } from "../../components/shared/FilterBar";
import { DeleteDialog } from "../../components/shared/DeleteDialog";
import { toast } from "react-hot-toast";

import { Link, useSearch } from "wouter";
import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import {
  FileText,
  Plus,
  Sparkles,
  Download,
  Calendar,
  User,
  Building2,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Contract {
  id: number;
  type: string;
  hijriDate: string;
  contractDate: string;
  contractCity: string;
  district: string;
  nationalId: string;
  projectDistrict: string;
  plotNumber: string;
  deedNumber: string;
  delayPenaltyAmount: number;
  paymentType: string;
  paidAmount: number;
  referenceType: string;
  paymentReferenceNumber: string;
  maintenanceFee: number;
  pdfUrl: string;
  createdAt: string;
  updatedAt: string | null;
  client: {
    id: number;
    fullName: string;
  };
  apartment: {
    id: number;
    mainName: {
      arabic: string;
      english: string;
    };
  };
  createdBy: {
    id: number;
    email: string;
  };
  updatedBy: any;
  salesManagerApproval: boolean;
  contractManagerApproval: boolean;
  financeApproval: boolean;
}

interface ContractsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Contract[];
  totalItems: number;
  totalPages: number;
}

export default function Contracts() {
  const { t, i18n } = useTranslation();
  const search = useSearch();
  const salesmanId = new URLSearchParams(search).get("salesmanId") || "";
  const [filters, setFilters] = useState({ search: "", type: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null,
  );

  const { data: response, isLoading } = useQuery<ContractsResponse>({
    queryKey: [
      "contracts",
      currentPage,
      pageSize,
      filters.search,
      filters.type,
      salesmanId,
    ],
    queryFn: async () => {
      const res = await api.get("/contract?isApproved=true", {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
          type: filters.type !== "all" ? filters.type : undefined,
          salesManId: salesmanId || undefined,
        },
      });
      return res.data;
    },
  });

  const { mutate: deleteContract, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contract/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success(t("contracts.deleteSuccess"));
      setDeleteDialogOpen(false);
      setSelectedContractId(null);
    },
    onError: () => {
      toast.error(t("contracts.deleteError"));
    },
  });

  const filterFields: FilterField[] = [
    {
      type: "search",
      label: t("contracts.title"),
      placeholder: t("contracts.placeholders.search"),
      key: "search",
    },
    {
      type: "select",
      label: t("contracts.labels.type"),
      key: "type",
      options: [
        { value: "all", label: t("common.all") },
        { value: "apartment_sale", label: t("contracts.types.apartment_sale") },
        {
          value: "apartment_partial_sale",
          label: t("contracts.types.apartment_partial_sale"),
        },
        {
          value: "land_partnership",
          label: t("contracts.types.land_partnership"),
        },
      ],
    },
  ];

  const columns: Column<Contract>[] = [
    {
      header: t("common.id"),
      accessorKey: "id",
      className: "text-sm font-medium text-[#B39371] w-16",
    },
    {
      header: t("contracts.labels.client"),
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
            <User className="w-4 h-4 text-[#4A1B1B] dark:text-[#B39371]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {c.client?.fullName || t("common.noData")}
            </p>
            {c.nationalId && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {c.nationalId}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: t("contracts.labels.apartment"),
      cell: (c) => {
        const location = [c.district || c.projectDistrict, c.contractCity]
          .filter(Boolean)
          .join(", ");
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#4A1B1B] dark:text-[#B39371]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {c.apartment
                  ? i18n.language === "ar"
                    ? c.apartment?.mainName?.arabic
                    : c.apartment?.mainName?.english
                  : t("common.noData")}
              </p>
              {location && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {location}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: t("contracts.labels.contractDate"),
      cell: (c) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {c.contractDate
              ? format(new Date(c.contractDate), "dd/MM/yyyy")
              : t("common.noData")}
          </div>
          {c.hijriDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {c.hijriDate}
            </p>
          )}
        </div>
      ),
    },
    {
      header: t("contracts.labels.paidAmount"),
      cell: (c) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#4A1B1B] dark:text-[#B39371]">
            {(c.paidAmount ?? 0).toLocaleString()} {t("common.sar")}
          </span>
        </div>
      ),
    },
    {
      header: t("contracts.labels.type"),
      cell: (c) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F5F1ED] text-[#4A1B1B] dark:bg-gray-800 dark:text-[#B39371]">
          {t(`contracts.types.${c.type}`)}
        </span>
      ),
    },
    {
      header: t("contracts.steps.title"),
      cell: (c) => {
        let step = "";
        let color = "";

        if (!c.salesManagerApproval) {
          step = t("contracts.steps.salesApproval");
          color = "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
        } else if (!c.contractManagerApproval) {
          step = t("contracts.steps.contractManagerApproval");
          color = "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
        } else if (!c.financeApproval) {
          step = t("contracts.steps.financeApproval");
          color = "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
        } else {
          step = t("contracts.steps.completed");
          color = "text-green-600 bg-green-50 dark:bg-green-900/20";
        }

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${color}`}
          >
            {step}
          </span>
        );
      },
    },
    {
      header: t("common.actions"),
      headerClassName: "text-center",
      cell: (c) => (
        <div className="flex items-center justify-center gap-2">
          {c.pdfUrl && (
            <Can I="READ" a="contract">
              <a
                href={buildImageUrl(c.pdfUrl) ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors"
                title={t("common.download")}
              >
                <Download className="w-4 h-4" />
              </a>
            </Can>
          )}

          <Can I="DELETE" a="contract">
            <button
              onClick={() => {
                setSelectedContractId(c.id);
                setDeleteDialogOpen(true);
              }}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md text-gray-400 hover:text-red-600 transition-colors"
              title={t("common.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Can>
        </div>
      ),
    },
  ];

  const contracts = response?.data || [];

  return (
    <Shell>
      <TopHeader />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() =>
          selectedContractId && deleteContract(selectedContractId)
        }
        isDeleting={isDeleting}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
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
                      {t("contracts.management")}
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("contracts.title")}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("contracts.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Can I="CREATE" a="contract">
                  <Link href="/contracts/new">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      {t("contracts.add")}
                    </motion.button>
                  </Link>
                </Can>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={FileText}
              label={t("contracts.title")}
              value={(response?.totalItems || 0).toLocaleString()}
              subValue={t("contracts.description")}
              color="from-[#4A1B1B] to-[#6B2727]"
            />
            {/* Add more stats if needed based on data */}
          </div>

          {/* Salesman filter banner */}
          {salesmanId && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F5F1ED] dark:bg-[#4A1B1B]/20 border border-[#E8DDD3] dark:border-[#4A1B1B]/40 rounded-md text-sm text-[#4A1B1B] dark:text-[#B39371]">
              <span className="font-medium">
                {t("salesman.viewContracts")}: #{salesmanId}
              </span>
              <Link href="/contracts">
                <button className="p-1 hover:opacity-70 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </Link>
            </div>
          )}

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
            data={contracts}
            isLoading={isLoading}
            loadingMessage={t("common.loading")}
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && contracts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("contracts.empty.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search
                  ? t("contracts.empty.description")
                  : t("contracts.empty.createFirst")}
              </p>
              {!filters.search && (
                <Link href="/contracts/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    {t("contracts.add")}
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
