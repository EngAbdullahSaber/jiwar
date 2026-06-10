import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { Link, useRoute, useLocation } from "wouter";
import {
  User,
  ArrowLeft,
  CreditCard,
  Loader2,
  Sparkles,
  Wallet,
  CalendarDays,
  Building,
  Receipt,
} from "lucide-react";
import { Shell } from "../../components/shared/Shell";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "../../components/shared/FormField";
import DatePicker from "../../components/shared/DatePicker";
import { PaginatedSelect } from "../../components/shared/PaginatedSelect";
import { FileUpload } from "../../components/shared/FileUpload";
import { toast } from "react-hot-toast";

interface ClientDetail {
  id: number;
  fullName: string;
}

export default function AddClientPayment() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [, params] = useRoute("/clients/:id/pay");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const id = params?.id;

  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    amount: "",
    receipt: [] as string[],
    contractId: "",
  });

  const { data: clientResp, isLoading } = useQuery<{ data: ClientDetail }>({
    queryKey: ["client", id],
    queryFn: async () => (await api.get(`/client/${id}`)).data,
    enabled: !!id,
  });

  const client = clientResp?.data;

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/client-payment", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("payments.success"), {
        style: { borderRadius: "1rem", background: "#4A1B1B", color: "#fff" },
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["client-payments", id] });
      setLocation(`/clients/${id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.english || t("payments.error"),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.contractId) {
      toast.error(t("common.fillRequiredFields"));
      return;
    }
    if (!id) return;
    mutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      clientId: parseInt(id),
      contractId: parseInt(formData.contractId),
    });
  };

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#B39371]/10 rounded-md" />
            <div className="absolute inset-0 border-4 border-t-[#B39371] rounded-md animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-[#B39371]" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!client) return null;

  return (
    <Shell>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-32">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-md -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="flex items-center gap-6 relative z-10">
              <Link
                href={`/clients/${id}`}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-xl opacity-20" />
                <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center border border-white/10">
                  <CreditCard className="w-7 h-7 text-[#B39371]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                    {t("payments.financialTransaction")}
                  </p>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t("payments.addPayment")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {client.fullName}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {t("payments.addPayment")}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t("payments.recordPaymentFor", { name: client.fullName })}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Payment Date */}
                <FormField label={t("payments.paymentDate")} required>
                  <DatePicker
                    value={formData.paymentDate}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, paymentDate: date }))
                    }
                  />
                </FormField>

                {/* Amount */}
                <FormField label={t("payments.amount")} required>
                  <div className="relative group">
                    <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold pointer-events-none z-10">
                      {t("common.sar")}
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-12 pl-12 rtl:pl-4 rtl:pr-12 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-lg"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                </FormField>
              </div>

              {/* Contract */}
              <div className="space-y-2">
                <PaginatedSelect
                  label={t("contracts.title")}
                  apiEndpoint="/contract"
                  queryKey="contracts"
                  extraParams={{
                    clientId: id ? parseInt(id) : undefined,
                    sortOption: "newest",
                  }}
                  value={formData.contractId}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, contractId: val }))
                  }
                  placeholder={t("contracts.placeholders.select")}
                  mapResponseToOptions={(data: any) =>
                    data.data.map((item: any) => ({
                      value: item.id,
                      label: `${t("contracts.title")} #${item.id} - ${
                        item.apartment?.mainName?.[
                          isRtl ? "arabic" : "english"
                        ] || ""
                      }`,
                      description: `${t(`contracts.types.${item.type}`)} ${
                        item.totalContractValue
                          ? `· ${item.totalContractValue.toLocaleString()} ${t("common.sar")}`
                          : ""
                      }`,
                      icon: <Building className="w-4 h-4" />,
                    }))
                  }
                />
              </div>

              {/* Receipt Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {t("payments.receipt")}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {t("payments.receiptHelper")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <FileUpload
                    onUploadMultipleSuccess={(urls) =>
                      setFormData((prev) => ({
                        ...prev,
                        receipt: [...prev.receipt, ...urls],
                      }))
                    }
                    onUploadSuccess={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        receipt: [...prev.receipt, url],
                      }))
                    }
                    label=""
                    helperText={t("payments.receiptHelper")}
                    maxSizeMB={5}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={true}
                  />
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocation(`/clients/${id}`)}
                  disabled={mutation.isPending}
                  className="h-12 px-6 rounded-md font-bold text-gray-500 hover:text-gray-900"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-12 px-8 rounded-md bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white font-bold shadow-xl shadow-[#4A1B1B]/20 min-w-44"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      {t("payments.addPayment")}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}
