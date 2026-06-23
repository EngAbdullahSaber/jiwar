import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { useSearch } from "wouter";
import { FileText, ArrowLeft, Sparkles, LayoutList, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PaginatedSelect } from "../../components/shared/PaginatedSelect";
import { FormActions } from "../../components/shared/FormActions";
import { Shell } from "../../components/shared/Shell";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { scrollToFirstError } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "../../components/shared/DatePicker";
import { FormField } from "../../components/shared/FormField";

// ── Types ────────────────────────────────────────────────────────────────────

type FieldKind = "client_picker" | "date" | "text" | "number";

interface TemplateField {
  name: string;
  kind: FieldKind;
  required: boolean;
}

interface ContractTemplate {
  id: number;
  name: { arabic: string; english: string };
  templateId: string;
  fields: TemplateField[];
}

interface TemplateResponse {
  code: number;
  data: ContractTemplate;
}

// ── Field label map (name → bilingual label) ─────────────────────────────────
const FIELD_LABELS: Record<string, { arabic: string; english: string }> = {
  clientId: { arabic: "العميل", english: "Client" },
  contractDate: { arabic: "تاريخ العقد", english: "Contract Date" },
  notes: { arabic: "ملاحظات", english: "Notes" },
  paidAmount: { arabic: "المبلغ المدفوع", english: "Paid Amount" },
  serviceName: { arabic: "اسم الخدمة", english: "Service Name" },
  totalValue: { arabic: "القيمة الإجمالية", english: "Total Value" },
  totalContractValue: {
    arabic: "إجمالي قيمة العقد",
    english: "Total Contract Value",
  },
  district: { arabic: "الحي", english: "District" },
  plotNumber: { arabic: "رقم القطعة", english: "Plot Number" },
  deedNumber: { arabic: "رقم الصك", english: "Deed Number" },
  type: { arabic: "نوع العقد", english: "Contract Type" },
  apartmentId: { arabic: "الوحدة", english: "Apartment" },
  projectId: { arabic: "المشروع", english: "Project" },
  description: { arabic: "الوصف", english: "Description" },
  price: { arabic: "السعر", english: "Price" },
  area: { arabic: "المساحة", english: "Area" },
};

/** Convert camelCase / snake_case to readable words for unknown fields */
function toReadableLabel(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function getLabel(name: string, lang: string): string {
  const entry = FIELD_LABELS[name];
  if (entry) return lang === "ar" ? entry.arabic : entry.english;
  return toReadableLabel(name);
}

// ── FormSection ───────────────────────────────────────────────────────────────

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

const CONTRACT_TYPE_OPTIONS = [
  { value: "apartment", labelAr: "وحدة سكنية", labelEn: "Apartment" },

  { value: "land", labelAr: " أرض", labelEn: "Land" },
];

// ── Dynamic field renderer ────────────────────────────────────────────────────

function DynamicField({
  field,
  value,
  onChange,
  error,
  lang,
}: {
  field: TemplateField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
  lang: string;
}) {
  const label = getLabel(field.name, lang);

  if (field.name === "type") {
    return (
      <FormField label={label} required={field.required} error={error}>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A1B1B]"
        >
          <option value="" disabled>
            {lang === "ar" ? "اختر نوع العقد" : "Select contract type"}
          </option>
          {CONTRACT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {lang === "ar" ? opt.labelAr : opt.labelEn}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  if (field.kind === "client_picker") {
    return (
      <FormField label={label} required={field.required} error={error}>
        <PaginatedSelect
          apiEndpoint="/client"
          queryKey={`clients-paginated-${field.name}`}
          value={value?.toString() ?? ""}
          onChange={(val) => onChange(val)}
          placeholder={lang === "ar" ? "اختر العميل..." : "Select client..."}
          searchPlaceholder={
            lang === "ar" ? "البحث في العملاء..." : "Search clients..."
          }
          mapResponseToOptions={(pageData) =>
            (pageData.data || []).map((c: any) => ({
              value: c.id,
              label: c.fullName || `Client #${c.id}`,
            }))
          }
        />
      </FormField>
    );
  }

  if (field.kind === "date") {
    return (
      <FormField label={label} required={field.required} error={error}>
        <DatePicker
          value={value ?? ""}
          onChange={onChange}
          className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
        />
      </FormField>
    );
  }

  return (
    <FormField label={label} required={field.required} error={error}>
      <Input
        type={field.kind === "number" ? "number" : "text"}
        placeholder={label}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
      />
    </FormField>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────

export default function CreateContract() {

  const { t, i18n } = useTranslation();
  const search = useSearch();

  const searchParams = new URLSearchParams(search);
  const prefilledApartmentId = searchParams.get("apartmentId") || "";
  const prefilledApartmentName = searchParams.get("apartmentName") || "";

  const [contractTemplateId, setContractTemplateId] = useState("");
  const [contractType, setContractType] = useState(prefilledApartmentId ? "apartment" : "");
  const [apartmentId, setApartmentId] = useState(prefilledApartmentId);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Fetch template fields when a template is selected ──────────────────────
  const { data: templateResponse, isFetching: loadingFields } =
    useQuery<TemplateResponse>({
      queryKey: ["contract-template", contractTemplateId],
      queryFn: async () => {
        const res = await api.get(`/contract-template/${contractTemplateId}`);
        return res.data;
      },
      enabled: !!contractTemplateId,
      staleTime: Infinity,
    });

  const selectedTemplate = templateResponse?.data;
  const fields: TemplateField[] = selectedTemplate?.fields ?? [];

  const handleTemplateChange = (id: string) => {
    setContractTemplateId(id);
    setFieldValues({});
    setErrors({});
  };

  const setFieldValue = (name: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const c = { ...prev };
      delete c[name];
      return c;
    });
  };

  // Fields that belong at the top level of the request body
  const TOP_LEVEL_FIELDS = new Set([
    "type",
    "clientId",
    "salesManId",
    "apartmentId",
    "contractDate",
    "paidAmount",
    "totalContractValue",
    "commissionBase",
    "commissionValue",
  ]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {
        contractTemplateId: Number(contractTemplateId),
        type: contractType,
        ...(apartmentId ? { apartmentId: Number(apartmentId) } : {}),
      };
      const details: Record<string, any> = {};

      fields.forEach((f) => {
        if (f.name === "type" || f.name === "apartmentId") return; // already set above
        const raw = fieldValues[f.name];
        const value =
          f.kind === "number" || f.kind === "client_picker"
            ? raw !== undefined && raw !== "" ? Number(raw) : undefined
            : raw ?? "";

        if (TOP_LEVEL_FIELDS.has(f.name)) {
          payload[f.name] = value;
        } else {
          details[f.name] = value;
        }
      });

      if (Object.keys(details).length > 0) {
        payload.details = details;
      }

      const res = await api.post("/contract", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("contracts.successCreate"), {
        icon: "🎉",
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      window.history.back();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("contracts.errorCreate"), {
        icon: "❌",
        style: { borderRadius: "1rem", background: "#ef4444", color: "#fff" },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!contractTemplateId) {
      newErrors.contractTemplateId = t("common.fieldRequired");
    }

    if (!contractType) {
      newErrors.contractType = t("common.fieldRequired");
    }

    fields.forEach((f) => {
      if (f.name === "type" || f.name === "apartmentId") return;
      const val = fieldValues[f.name];
      if (f.required && (val === undefined || val === "" || val === null)) {
        newErrors[f.name] = t("common.fieldRequired");
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    createMutation.mutate();
  };

  const lang = i18n.language;

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
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
                    {t("contracts.management")}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("contracts.create")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("contracts.description")}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* ── Step 1: Template selector (always visible) ───────────────── */}
            <FormSection
              icon={FileText}
              title={t("contracts.labels.templateSection")}
              description={t("contracts.labels.templateSectionDesc")}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t("contracts.labels.contractTemplate")}
                  required
                  error={errors.contractTemplateId}
                >
                  <PaginatedSelect
                    apiEndpoint="/contract-template"
                    queryKey="contract-templates-paginated"
                    value={contractTemplateId}
                    onChange={handleTemplateChange}
                    placeholder={t("contracts.placeholders.selectTemplate")}
                    searchPlaceholder={t("contractTemplates.placeholders.search")}
                    mapResponseToOptions={(pageData) =>
                      (pageData.data || []).map((tpl: any) => ({
                        value: tpl.id,
                        label:
                          lang === "ar"
                            ? tpl.name?.arabic || tpl.name?.english
                            : tpl.name?.english ||
                              tpl.name?.arabic ||
                              `Template #${tpl.id}`,
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label={t("contracts.labels.type")}
                  required
                  error={errors.contractType}
                >
                  <select
                    value={contractType}
                    onChange={(e) => {
                      setContractType(e.target.value);
                      setErrors((prev) => { const c = { ...prev }; delete c.contractType; return c; });
                    }}
                    className="w-full h-12 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A1B1B]"
                  >
                    <option value="" disabled>
                      {lang === "ar" ? "اختر نوع العقد" : "Select contract type"}
                    </option>
                    {CONTRACT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {lang === "ar" ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label={t("contracts.labels.apartment")}
                  error={errors.apartmentId}
                >
                  {prefilledApartmentId && apartmentId === prefilledApartmentId ? (
                    <div className="h-12 flex items-center gap-3 px-3 bg-[#F5F1ED] dark:bg-gray-800 border border-[#E8DDD3] dark:border-gray-700 rounded-md">
                      <Building2 className="w-4 h-4 text-[#B39371] shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {prefilledApartmentName || `Apartment #${prefilledApartmentId}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setApartmentId("")}
                        className="ms-auto text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <PaginatedSelect
                      apiEndpoint="/apartment"
                      queryKey="apartments-paginated-contract"
                      value={apartmentId}
                      onChange={(val) => {
                        setApartmentId(val);
                        setErrors((prev) => { const c = { ...prev }; delete c.apartmentId; return c; });
                      }}
                      placeholder={t("contracts.placeholders.selectApartment")}
                      searchPlaceholder={lang === "ar" ? "البحث في الوحدات..." : "Search apartments..."}
                      mapResponseToOptions={(pageData) =>
                        (pageData.data || []).map((apt: any) => ({
                          value: apt.id,
                          label:
                            lang === "ar"
                              ? apt.mainName?.arabic || apt.mainName?.english
                              : apt.mainName?.english || apt.mainName?.arabic || `Apartment #${apt.id}`,
                        }))
                      }
                    />
                  )}
                </FormField>
              </div>
            </FormSection>

            {/* ── Step 2: Dynamic fields (appear after template is selected) ── */}
            <AnimatePresence mode="wait">
              {contractTemplateId && (
                <motion.div
                  key={contractTemplateId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormSection
                    icon={LayoutList}
                    title={
                      selectedTemplate
                        ? lang === "ar"
                          ? selectedTemplate.name.arabic
                          : selectedTemplate.name.english
                        : t("contracts.labels.detailsSection")
                    }
                    description={t("contracts.labels.detailsSectionDesc")}
                    delay={0}
                  >
                    {loadingFields ? (
                      /* Loading skeleton */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : fields.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
                        {t("contracts.labels.noFields")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.filter((f) => f.name !== "type" && f.name !== "apartmentId").map((field) => (
                          <DynamicField
                            key={field.name}
                            field={field}
                            value={fieldValues[field.name]}
                            onChange={(val) => setFieldValue(field.name, val)}
                            error={errors[field.name]}
                            lang={lang}
                          />
                        ))}
                      </div>
                    )}
                  </FormSection>
                </motion.div>
              )}
            </AnimatePresence>

            <FormActions
              onCancel={() => window.history.back()}
              isSubmitting={createMutation.isPending}
              submitText={t("contracts.create")}
              submittingText={t("common.saving")}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
