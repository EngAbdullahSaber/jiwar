import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { Link, useLocation, useRoute } from "wouter";
import {
  Building2,
  MapPin,
  Sparkles,
  ArrowLeft,
  Hash,
  Navigation,
  Globe,
  Image,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Shell } from "../../components/shared/Shell";
import { FileUpload } from "../../components/shared/FileUpload";
import { PaginatedSelect } from "../../components/shared/PaginatedSelect";
import { FormActions } from "../../components/shared/FormActions";
import { LocationMap } from "../../components/shared/LocationMap";
import { FormField } from "../../components/shared/FormField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { scrollToFirstError } from "@/lib/utils";
import { motion } from "framer-motion";

// Form Section Component
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
    className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm    "
  >
    <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-[#4A1B1B] blur-lg opacity-20 rounded-md" />
          <div className="relative w-14 h-14 rounded-md bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
            <Icon className="w-7 h-7 text-[#4A1B1B] dark:text-[#B39371]" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
    <div className="p-8">{children}</div>
  </motion.div>
);

export default function UpdateProject() {
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/projects/:id/edit");
  const projectId = params?.id;

  const [formData, setFormData] = useState({
    name: { arabic: "", english: "" },
    projectIdentity: "",
    legalityId: "",
    address: "",
    latitude: "24.7136",
    longitude: "46.6753",
    estimatedBudget: "",
    sk: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api.get(`/project/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (projectData?.data) {
      const p = projectData.data;
      setFormData({
        name: {
          arabic: p.name?.arabic || "",
          english: p.name?.english || "",
        },
        projectIdentity: p.projectIdentity || "",
        legalityId: p.legality?.id?.toString() || "",
        address: p.address || "",
        latitude: p.latitude?.toString() || "24.7136",
        longitude: p.longitude?.toString() || "46.6753",
        estimatedBudget:
          p.estimatedBudget != null ? p.estimatedBudget.toString() : "",
        sk: p.sk || "",
      });
    }
  }, [projectData]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        legalityId: Number(data.legalityId),
        address: data.address,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        estimatedBudget: data.estimatedBudget
          ? Number(data.estimatedBudget)
          : undefined,
        sk: data.sk || undefined,
      };

      const response = await api.patch(`/project/${projectId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("projects.success.update"), {
        icon: "🎉",
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setLocation("/projects");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("projects.errors.update"),
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
    if (!formData.name.english)
      newErrors.nameEn = t("projects.errors.fieldRequired");
    if (!formData.name.arabic)
      newErrors.nameAr = t("projects.errors.fieldRequired");
    if (!formData.legalityId)
      newErrors.legalityId = t("projects.errors.fieldRequired");
    if (!formData.address)
      newErrors.address = t("projects.errors.fieldRequired");
    if (!formData.latitude)
      newErrors.latitude = t("projects.errors.fieldRequired");
    if (!formData.longitude)
      newErrors.longitude = t("projects.errors.fieldRequired");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoadingProject) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#B39371]/20 rounded-md" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-md animate-spin" />
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
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/projects"
                className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-[#F5F1ED] dark:hover:bg-[#B39371]/10 rounded-md transition-all shadow-sm group"
              >
                <ArrowLeft className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-[#4A1B1B] dark:group-hover:text-[#B39371]" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-30" />
                <div className="relative w-16 h-16 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#B39371]" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                    {t("projects.editProject")}
                  </p>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {i18n.language === "ar"
                    ? projectData?.data?.name?.arabic
                    : projectData?.data?.name?.english}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  {t("projects.editDescription")}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Identity Section */}
            <FormSection
              icon={Building2}
              title={t("projects.labels.identity")}
              description={t("projects.labels.identityDesc")}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project ID (Read-only) */}
                <FormField label={t("projects.labels.projectId")} required>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.projectIdentity}
                      readOnly
                      className="pl-10 h-12 bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-md cursor-not-allowed text-gray-500"
                    />
                  </div>
                </FormField>

                {/* Project Name English */}
                <FormField
                  label={t("projects.labels.projectNameEn")}
                  required
                  error={errors.nameEn}
                >
                  <Input
                    placeholder={t("projects.placeholders.nameEn")}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    value={formData.name.english}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: { ...formData.name, english: e.target.value },
                      });
                      if (errors.nameEn)
                        setErrors((p) => {
                          const { nameEn, ...r } = p;
                          return r;
                        });
                    }}
                  />
                </FormField>

                {/* Project Name Arabic */}
                <FormField
                  label={t("projects.labels.projectNameAr")}
                  required
                  error={errors.nameAr}
                >
                  <Input
                    dir="rtl"
                    placeholder={t("projects.placeholders.nameAr")}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                    value={formData.name.arabic}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: { ...formData.name, arabic: e.target.value },
                      });
                      if (errors.nameAr)
                        setErrors((p) => {
                          const { nameAr, ...r } = p;
                          return r;
                        });
                    }}
                  />
                </FormField>

                {/* Linked Legality File */}
                <FormField
                  label={t("projects.labels.linkedLegality")}
                  required
                  error={errors.legalityId}
                >
                  <PaginatedSelect
                    apiEndpoint="/legality"
                    queryKey="legalities-paginated"
                    value={formData.legalityId}
                    onChange={(val) => {
                      setFormData({ ...formData, legalityId: val });
                      if (errors.legalityId)
                        setErrors((p) => {
                          const { legalityId, ...r } = p;
                          return r;
                        });
                    }}
                    placeholder={t("projects.placeholders.selectLegality")}
                    searchPlaceholder={t(
                      "projects.placeholders.searchLegality",
                    )}
                    initialLabel={
                      projectData?.data?.legality
                        ? i18n.language === "ar"
                          ? projectData.data.legality.name.arabic
                          : projectData.data.legality.name.english
                        : ""
                    }
                    mapResponseToOptions={(pageData) => {
                      const items = pageData.data || [];
                      return items.map((legality: any) => ({
                        value: legality.id,
                        label: `LF-${legality.id.toString().padStart(4, "0")} - ${legality.name?.english || ""}`,
                        description: legality.name?.arabic || "",
                        badge: legality.legalitySteps?.length
                          ? {
                              label: `${legality.legalitySteps.length} Steps`,
                              variant: "default",
                            }
                          : undefined,
                      }));
                    }}
                  />
                </FormField>
                {/* Estimated Budget */}
                <FormField label={t("projects.labels.estimatedBudget")}>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    value={formData.estimatedBudget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedBudget: e.target.value,
                      })
                    }
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Location Section */}
            <FormSection
              icon={MapPin}
              title={t("projects.labels.locationDetails")}
              description={t("projects.labels.locationDesc")}
              delay={0.2}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Physical Address */}
                  <FormField
                    label={t("projects.labels.address")}
                    required
                    error={errors.address}
                  >
                    <Textarea
                      placeholder={t("projects.placeholders.address")}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md min-h-[120px] resize-none"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (errors.address)
                          setErrors((p) => {
                            const { address, ...r } = p;
                            return r;
                          });
                      }}
                    />
                  </FormField>

                  {/* Coordinates */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label={t("projects.labels.latitude")}
                      required
                      error={errors.latitude}
                    >
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={t("projects.placeholders.latitude")}
                          className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                          value={formData.latitude}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              latitude: e.target.value,
                            });
                            if (errors.latitude)
                              setErrors((p) => {
                                const { latitude, ...r } = p;
                                return r;
                              });
                          }}
                          type="number"
                          step="any"
                        />
                      </div>
                    </FormField>
                    <FormField
                      label={t("projects.labels.longitude")}
                      required
                      error={errors.longitude}
                    >
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={t("projects.placeholders.longitude")}
                          className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                          value={formData.longitude}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              longitude: e.target.value,
                            });
                            if (errors.longitude)
                              setErrors((p) => {
                                const { longitude, ...r } = p;
                                return r;
                              });
                          }}
                          type="number"
                          step="any"
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Coordinates Display */}
                  <div className="bg-[#F5F1ED] dark:bg-gray-800 rounded-md p-4 border border-[#B39371]/20">
                    <div className="flex items-center gap-2 text-[#4A1B1B] dark:text-[#B39371] mb-2">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {t("projects.labels.selectedCoordinates")}
                      </span>
                    </div>
                    <p className="text-sm font-mono">
                      {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="relative group w-full aspect-video">
                  <LocationMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onChange={(lat, lng) =>
                      setFormData({
                        ...formData,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                      })
                    }
                  />
                </div>
              </div>
            </FormSection>

            {/* SAK Images */}
            <FormSection
              icon={Image}
              title={t("apartments.sections.sakImages")}
              description={t("apartments.sections.sakImagesDesc")}
              delay={0.3}
            >
              <div className="flex flex-col rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B39371]" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t("apartments.labels.projectSak")}
                  </span>
                </div>
                <div className="p-4">
                  <FileUpload
                    onUploadSuccess={(url: string) =>
                      setFormData({ ...formData, sk: url })
                    }
                    defaultValue={formData.sk}
                    accept=".jpg,.jpeg,.png,.webp"
                    maxSizeMB={5}
                    className="w-full"
                    helperText={t("apartments.placeholders.uploadProjectSak")}
                  />
                </div>
              </div>
            </FormSection>

            {/* Form Actions */}
            <FormActions
              onCancel={() => setLocation("/projects")}
              isSubmitting={updateMutation.isPending}
              align="between"
            />
          </form>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #B39371 1px, transparent 1px),
            linear-gradient(to bottom, #B39371 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </Shell>
  );
}
