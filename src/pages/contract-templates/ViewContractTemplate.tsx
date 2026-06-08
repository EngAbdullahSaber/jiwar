import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { Link, useRoute, useLocation } from "wouter";
import {
  FileText,
  ArrowLeft,
  Download,
  User,
  Hash,
  Sparkles,
  ExternalLink,
  Trash2,
  Pencil,
} from "lucide-react";

import { Shell } from "../../components/shared/Shell";
import { Can } from "../../components/shared/Can";
import { DeleteDialog } from "../../components/shared/DeleteDialog";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
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

interface ContractTemplateResponse {
  code: number;
  data: ContractTemplate;
}

const InfoRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-1 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
      {label}
    </span>
    <span
      className={`text-sm text-gray-900 dark:text-white ${mono ? "font-mono break-all" : "font-medium"}`}
    >
      {value || "—"}
    </span>
  </div>
);

export default function ViewContractTemplate() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/contract-templates/:id");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const id = params?.id;
  const [showDelete, setShowDelete] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  const { data: response, isLoading } = useQuery<ContractTemplateResponse>({
    queryKey: ["contract-template", id],
    queryFn: async () => {
      const res = await api.get(`/contract-template/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/contract-template/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract-templates"] });
      toast.success(t("contractTemplates.success.delete"), {
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      setLocation("/contract-templates");
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

  const template = response?.data;

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#B39371]/30 border-t-[#B39371] rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("common.loading")}
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!template) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">{t("contractTemplates.notFound")}</p>
        </div>
      </Shell>
    );
  }

  const pdfFullUrl = template.url?.startsWith("http")
    ? template.url
    : `${baseUrl}${template.url}`;

  const templateName =
    i18n.language === "ar" ? template.name?.arabic : template.name?.english;

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Link
                  href="/contract-templates"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                  <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      {t("contractTemplates.management")}
                    </p>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {templateName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {i18n.language === "ar"
                      ? template.name?.english
                      : template.name?.arabic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {template.url && (
                  <a
                    href={pdfFullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {t("contractTemplates.downloadPdf")}
                  </a>
                )}
                <Can I="UPDATE" a="contract-template">
                  <Link href={`/contract-templates/${id}/edit`}>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
                      <Pencil className="w-4 h-4" />
                      {t("common.edit")}
                    </button>
                  </Link>
                </Can>
                <Can I="DELETE" a="contract-template">
                  <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("common.delete")}
                  </button>
                </Can>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Template Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center">
                  <Hash className="w-4 h-4 text-[#B39371]" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t("contractTemplates.sections.details")}
                </h2>
              </div>
              <div className="p-5">
                <InfoRow label={t("common.id")} value={String(template.id)} />
                <InfoRow
                  label={t("contractTemplates.labels.nameEn")}
                  value={template.name?.english}
                />
                <InfoRow
                  label={t("contractTemplates.labels.nameAr")}
                  value={template.name?.arabic}
                />
                <InfoRow
                  label={t("contractTemplates.labels.templateId")}
                  value={template.templateId}
                  mono
                />
              </div>
            </motion.div>

            {/* Audit Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#B39371]" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t("contractTemplates.sections.audit")}
                </h2>
              </div>
              <div className="p-5">
                <InfoRow
                  label={t("contractTemplates.labels.createdBy")}
                  value={template.createdBy?.email ?? "—"}
                />
                <InfoRow
                  label={t("contractTemplates.labels.createdAt")}
                  value={
                    template.createdAt
                      ? format(new Date(template.createdAt), "dd MMM yyyy, HH:mm")
                      : "—"
                  }
                />
                <InfoRow
                  label={t("contractTemplates.labels.updatedBy")}
                  value={template.updatedBy?.email ?? "—"}
                />
                <InfoRow
                  label={t("contractTemplates.labels.updatedAt")}
                  value={
                    template.updatedAt
                      ? format(new Date(template.updatedAt), "dd MMM yyyy, HH:mm")
                      : "—"
                  }
                />
              </div>
            </motion.div>
          </div>

          {/* PDF Preview */}
          {template.url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#B39371]" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {t("contractTemplates.sections.pdfPreview")}
                  </h2>
                </div>
                <a
                  href={pdfFullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#B39371] hover:text-[#4A1B1B] dark:hover:text-[#C9A47A] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("common.viewFile")}
                </a>
              </div>
              <div className="p-5">
                <iframe
                  src={pdfFullUrl}
                  className="w-full h-[600px] rounded-md border border-gray-200 dark:border-gray-700"
                  title={templateName}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <DeleteDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
        title={t("contractTemplates.deleteTitle")}
        description={t("contractTemplates.deleteDescription", {
          name: templateName,
        })}
      />
    </Shell>
  );
}
