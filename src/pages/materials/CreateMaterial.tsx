import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TopHeader } from "../../components/TopHeader";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Package,
  Layers,
  Sparkles,
  Building2,
  Hash,
  Tags,
  Phone,
  Mail,
  DollarSign,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginatedSelect } from "../../components/shared/PaginatedSelect";
import { FormActions } from "../../components/shared/FormActions";
import { Shell } from "../../components/shared/Shell";
import { FileUpload } from "../../components/shared/FileUpload";
import DatePicker from "../../components/shared/DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { scrollToFirstError } from "@/lib/utils";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../../components/shared/FormField";

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

export default function CreateMaterial() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: 0,
    requestStatus: "pending",
    approvalStatus: "draft",
    projectId: "",
    notes: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [supplierData, setSupplierData] = useState({
    name: "",
    phoneNumber: "",
    optionalPhoneNumber: "",
    email: "",
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [supplierDocuments, setSupplierDocuments] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        quantity: data.quantity,
        price: Number(data.price),
        projectId: Number(data.projectId),
        files: attachments,
        supplier: {
          ...supplierData,
          documents: supplierDocuments,
        },
        notes: [data.notes],
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const response = await api.post("/material", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("materials.successCreate"), {
        icon: "🎉",
        style: { borderRadius: "1rem", background: "#10b981", color: "#fff" },
      });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      setLocation("/materials");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("materials.errorCreate"), {
        icon: "❌",
        style: { borderRadius: "1rem", background: "#ef4444", color: "#fff" },
      });
    },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+\d][\d\s\-()]{6,19}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t("common.fieldRequired");
    if (!formData.quantity.trim()) newErrors.quantity = t("common.fieldRequired");
    if (!formData.price || formData.price <= 0) newErrors.price = t("common.fieldRequired");
    if (!formData.startDate) newErrors.startDate = t("common.fieldRequired");
    if (!formData.endDate) newErrors.endDate = t("common.fieldRequired");
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate))
      newErrors.endDate = t("materials.dateError");
    if (!supplierData.name.trim()) newErrors.supplierName = t("common.fieldRequired");
    if (supplierData.email && !emailRegex.test(supplierData.email))
      newErrors.supplierEmail = t("common.invalidEmail");
    if (supplierData.phoneNumber && !phoneRegex.test(supplierData.phoneNumber))
      newErrors.supplierPhone = t("common.invalidPhone");
    if (supplierData.optionalPhoneNumber && !phoneRegex.test(supplierData.optionalPhoneNumber))
      newErrors.supplierOptionalPhone = t("common.invalidPhone");
    if (!formData.projectId) newErrors.projectId = t("common.fieldRequired");

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Shell>
      <TopHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link
                href="/materials"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    {t("materials.create")}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("materials.newMaterial")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("materials.formDescription")}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Details Section */}
            <FormSection
              icon={Package}
              title={t("materials.details")}
              description={t("materials.detailsDesc")}
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Material Name */}
                <FormField
                  label={t("materials.name")}
                  required
                  error={errors.name}
                >
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      placeholder={
                        t("materials.namePlaceholder") || "e.g. Steel Beams"
                      }
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        if (errors.name)
                          setErrors((prev) => {
                            const { name, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Quantity */}
                <FormField
                  label={t("materials.quantity")}
                  required
                  error={errors.quantity}
                >
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }));
                        if (errors.quantity)
                          setErrors((prev) => {
                            const { quantity, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Start Date */}
                <FormField
                  label={t("materials.startDate")}
                  required
                  error={errors.startDate}
                >
                  <DatePicker
                    value={formData.startDate}
                    onChange={(date) => {
                      setFormData((prev) => ({ ...prev, startDate: date }));
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.startDate;
                        if (date && prev.endDate === t("materials.dateError") && formData.endDate && new Date(date) < new Date(formData.endDate))
                          delete next.endDate;
                        return next;
                      });
                    }}
                    placeholder={t("materials.startDate")}
                  />
                </FormField>

                {/* End Date */}
                <FormField
                  label={t("materials.endDate")}
                  required
                  error={errors.endDate}
                >
                  <DatePicker
                    value={formData.endDate}
                    onChange={(date) => {
                      setFormData((prev) => ({ ...prev, endDate: date }));
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.endDate;
                        if (date && formData.startDate && new Date(formData.startDate) >= new Date(date))
                          next.endDate = t("materials.dateError");
                        return next;
                      });
                    }}
                    placeholder={t("materials.endDate")}
                  />
                </FormField>

                {/* Notes */}
                <div className="md:col-span-2">
                  <FormField label={t("materials.notes")}>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                      <Textarea
                        placeholder={
                          t("materials.notes") ||
                          "Enter any additional notes..."
                        }
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        className="pl-10 rtl:pl-3 rtl:pr-10 min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md pt-2"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Price */}
                <FormField label={t("materials.price")} required error={errors.price}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, price: Number(e.target.value) }));
                        if (errors.price) setErrors((prev) => { const { price, ...rest } = prev; return rest; });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>
              </div>
            </FormSection>

            {/* Supplier Details Section */}
            <FormSection
              icon={Building2}
              title={t("materials.supplier")}
              description={t("materials.supplierDesc")}
              delay={0.15}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supplier Name */}
                <FormField
                  label={t("materials.supplierName")}
                  required
                  error={errors.supplierName}
                >
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      placeholder={
                        t("materials.supplierPlaceholder") ||
                        "e.g. Al-Rajhi Materials"
                      }
                      value={supplierData.name}
                      onChange={(e) => {
                        setSupplierData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        if (errors.supplierName)
                          setErrors((prev) => {
                            const { supplierName, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Email */}
                <FormField label={t("materials.supplierEmail")} error={errors.supplierEmail}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      type="email"
                      placeholder="supplier@example.com"
                      value={supplierData.email}
                      onChange={(e) => {
                        setSupplierData((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.supplierEmail) setErrors((prev) => { const { supplierEmail, ...rest } = prev; return rest; });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Phone Number */}
                <FormField label={t("materials.supplierPhone")} error={errors.supplierPhone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      placeholder="050XXXXXXXX"
                      value={supplierData.phoneNumber}
                      onChange={(e) => {
                        setSupplierData((prev) => ({ ...prev, phoneNumber: e.target.value }));
                        if (errors.supplierPhone) setErrors((prev) => { const { supplierPhone, ...rest } = prev; return rest; });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Optional Phone Number */}
                <FormField label={t("materials.supplierOptionalPhone")} error={errors.supplierOptionalPhone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                    <Input
                      placeholder="055XXXXXXXX"
                      value={supplierData.optionalPhoneNumber}
                      onChange={(e) => {
                        setSupplierData((prev) => ({ ...prev, optionalPhoneNumber: e.target.value }));
                        if (errors.supplierOptionalPhone) setErrors((prev) => { const { supplierOptionalPhone, ...rest } = prev; return rest; });
                      }}
                      className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </FormField>

                {/* Supplier Documents */}
                <div className="md:col-span-2">
                  <FormField label={t("materials.supplierDocuments")}>
                    <FileUpload
                      multiple
                      label={t("materials.uploadSupplierDocs")}
                      accept=".pdf"
                      maxSizeMB={10}
                      onUploadSuccess={(url) =>
                        setSupplierDocuments((prev) => [...prev, url])
                      }
                      onUploadMultipleSuccess={(urls) =>
                        setSupplierDocuments((prev) => [...prev, ...urls])
                      }
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>

            {/* Status & Association Section */}
            <FormSection
              icon={Tags}
              title={t("materials.statusSection")}
              description={t("materials.statusDesc")}
              delay={0.2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Status */}
                <FormField label={t("materials.requestStatus")} required>
                  <Select
                    value={formData.requestStatus}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, requestStatus: val }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder={t("materials.requestStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        {t("materials.statuses.pending")}
                      </SelectItem>
                      <SelectItem value="ordered">
                        {t("materials.statuses.ordered")}
                      </SelectItem>
                      <SelectItem value="received">
                        {t("materials.statuses.received")}
                      </SelectItem>
                      <SelectItem value="not_received">
                        {t("materials.statuses.not_received")}
                      </SelectItem>
                      <SelectItem value="pass_deadline">
                        {t("materials.statuses.pass_deadline")}
                      </SelectItem>
                      <SelectItem value="returned">
                        {t("materials.statuses.returned")}
                      </SelectItem>
                      <SelectItem value="cancelled">
                        {t("materials.statuses.cancelled")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Approval Status */}
                <FormField label={t("materials.approvalStatus")} required>
                  <Select
                    value={formData.approvalStatus}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, approvalStatus: val }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue
                        placeholder={t("materials.approvalStatus")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        {t("materials.statuses.draft")}
                      </SelectItem>
                      <SelectItem value="approved">
                        {t("materials.statuses.approved")}
                      </SelectItem>
                      <SelectItem value="finalized">
                        {t("materials.statuses.finalized")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Linked Project */}
                <FormField
                  label={t("materials.linkedProject")}
                  required
                  error={errors.projectId}
                >
                  <PaginatedSelect
                    apiEndpoint="/project"
                    queryKey="projects-paginated"
                    value={formData.projectId.toString()}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, projectId: val }));
                      if (errors.projectId)
                        setErrors((prev) => {
                          const { projectId, ...rest } = prev;
                          return rest;
                        });
                    }}
                    placeholder={t("materials.linkedProject")}
                    searchPlaceholder={t("common.search")}
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((project: any) => ({
                        value: project.id,
                        label:
                          project.name?.english ||
                          project.name?.arabic ||
                          `Project #${project.id}`,
                      }));
                    }}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Attachments Section */}
            <FormSection
              icon={Package}
              title={t("materials.attachments")}
              description={t("materials.attachmentsDesc")}
              delay={0.3}
            >
              <FileUpload
                multiple
                label={t("materials.uploadLabel")}
                accept=".pdf"
                maxSizeMB={20}
                helperText={t("materials.uploadHelper")}
                onUploadSuccess={(url) =>
                  setAttachments((prev) => [...prev, url])
                }
                onUploadMultipleSuccess={(urls) =>
                  setAttachments((prev) => [...prev, ...urls])
                }
              />
            </FormSection>

            <FormActions
              onCancel={() => setLocation("/materials")}
              isSubmitting={createMutation.isPending}
              submitText={t("materials.create")}
              submittingText={t("materials.creating")}
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
