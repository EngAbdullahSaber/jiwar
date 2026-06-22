import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { Link, useLocation } from "wouter";
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Type,
  Upload,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormActions } from "../../components/shared/FormActions";
import { FormField } from "../../components/shared/FormField";
import { Shell } from "../../components/shared/Shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { scrollToFirstError } from "@/lib/utils";
import { motion } from "framer-motion";

const FormSection = ({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#B39371]" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

export default function CreateContractTemplate() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("nameEnglish", nameEn);
      formData.append("nameArabic", nameAr);
      formData.append("file", selectedFile!);
      const response = await api.post("/contract-template", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract-templates"] });
      toast.success(t("contractTemplates.success.create"), {
        icon: "🎉",
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      setLocation("/contract-templates");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("contractTemplates.errors.create"),
        {
          icon: "❌",
          style: { borderRadius: "1rem", background: "#ef4444", color: "#fff" },
        },
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!nameEn) newErrors.nameEn = t("common.fieldRequired");
    if (!nameAr) newErrors.nameAr = t("common.fieldRequired");
    if (!selectedFile) newErrors.file = t("common.fieldRequired");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    createMutation.mutate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file && errors.file)
      setErrors((p) => {
        const { file, ...r } = p;
        return r;
      });
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
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
                    {t("contractTemplates.create")}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("contractTemplates.new")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("contractTemplates.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Required field names notice */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40 rounded-md p-5"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  {t("contractTemplates.fieldNamesHint.title")}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                  {t("contractTemplates.fieldNamesHint.description")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "contractDate",
                    "totalContractValue",
                    "paidAmount",
                    "clientPhone",
                    "clientIban",
                    "clientName",
                  ].map((name) => (
                    <code
                      key={name}
                      className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-800/30 text-amber-900 dark:text-amber-200 text-xs font-mono border border-amber-200 dark:border-amber-700/40"
                    >
                      {name}
                    </code>
                  ))}
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-3 italic">
                  {t("contractTemplates.fieldNamesHint.note")}
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <FormSection
              icon={Type}
              title={t("contractTemplates.sections.naming")}
              description={t("contractTemplates.sections.namingDesc")}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t("contractTemplates.labels.nameEn")}
                  required
                  error={errors.nameEn}
                >
                  <Input
                    placeholder={t("contractTemplates.placeholders.nameEn")}
                    value={nameEn}
                    onChange={(e) => {
                      setNameEn(e.target.value);
                      if (errors.nameEn)
                        setErrors((p) => {
                          const { nameEn, ...r } = p;
                          return r;
                        });
                    }}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField
                  label={t("contractTemplates.labels.nameAr")}
                  required
                  error={errors.nameAr}
                >
                  <Input
                    dir="rtl"
                    placeholder={t("contractTemplates.placeholders.nameAr")}
                    value={nameAr}
                    onChange={(e) => {
                      setNameAr(e.target.value);
                      if (errors.nameAr)
                        setErrors((p) => {
                          const { nameAr, ...r } = p;
                          return r;
                        });
                    }}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* PDF Upload Section */}
            <FormSection
              icon={FileText}
              title={t("contractTemplates.sections.document")}
              description={t("contractTemplates.sections.documentDesc")}
              delay={0.2}
            >
              <div className="space-y-3">
                {/* Drop / Click zone */}
                {!selectedFile ? (
                  <label
                    htmlFor="pdf-upload"
                    className={`flex flex-col items-center justify-center gap-3 w-full h-40 rounded-md border-2 border-dashed cursor-pointer transition-colors
                      ${
                        errors.file
                          ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-[#B39371] hover:bg-[#F5F1ED]/40 dark:hover:bg-gray-800"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B]/10 to-[#6B2727]/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#B39371]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("contractTemplates.placeholders.uploadPdf")}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        PDF — max 20 MB
                      </p>
                    </div>
                    <input
                      id="pdf-upload"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#B39371]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {errors.file && (
                  <p className="text-sm text-red-500">{errors.file}</p>
                )}
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation("/contract-templates")}
              isSubmitting={createMutation.isPending}
              submitText={t("contractTemplates.create")}
              submittingText={t("common.saving")}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
