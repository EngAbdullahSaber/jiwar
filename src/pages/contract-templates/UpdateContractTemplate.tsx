import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { Link, useRoute, useLocation } from "wouter";
import { FileText, ArrowLeft, Sparkles, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormActions } from "../../components/shared/FormActions";
import { FormField } from "../../components/shared/FormField";
import { Shell } from "../../components/shared/Shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface ContractTemplate {
  id: number;
  name: { arabic: string; english: string };
}

interface ContractTemplateResponse {
  code: number;
  data: ContractTemplate;
}

export default function UpdateContractTemplate() {
  const [, params] = useRoute("/contract-templates/:id/edit");
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const id = params?.id;

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: response, isLoading } = useQuery<ContractTemplateResponse>({
    queryKey: ["contract-template", id],
    queryFn: async () => {
      const res = await api.get(`/contract-template/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (response?.data) {
      setNameEn(response.data.name?.english ?? "");
      setNameAr(response.data.name?.arabic ?? "");
    }
  }, [response]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/contract-template/${id}`, {
        name: { arabic: nameAr, english: nameEn },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract-templates"] });
      queryClient.invalidateQueries({ queryKey: ["contract-template", id] });
      toast.success(t("contractTemplates.success.update"), {
        icon: "🎉",
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      setLocation(`/contract-templates/${id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("contractTemplates.errors.update"),
        {
          icon: "❌",
          style: { borderRadius: "1rem", background: "#ef4444", color: "#fff" },
        }
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!nameEn) newErrors.nameEn = t("common.fieldRequired");
    if (!nameAr) newErrors.nameAr = t("common.fieldRequired");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    updateMutation.mutate();
  };

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

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link
                href={`/contract-templates/${id}`}
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
                    {t("contractTemplates.edit")}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("contractTemplates.editTitle")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("contractTemplates.editDescription")}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                        setErrors((p) => { const { nameEn, ...r } = p; return r; });
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
                        setErrors((p) => { const { nameAr, ...r } = p; return r; });
                    }}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation(`/contract-templates/${id}`)}
              isSubmitting={updateMutation.isPending}
              submitText={t("contractTemplates.edit")}
              submittingText={t("common.saving")}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
