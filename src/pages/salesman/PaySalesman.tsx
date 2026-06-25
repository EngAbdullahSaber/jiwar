import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopHeader } from "../../components/TopHeader";
import { Link, useRoute, useLocation } from "wouter";
import {
  Users as UsersIcon,
  ArrowLeft,
  Banknote,
  Loader2,
  Sparkles,
  Wallet,
  FileText,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Shell } from "../../components/shared/Shell";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "../../components/shared/FormField";
import DatePicker from "../../components/shared/DatePicker";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface SalesmanDetail {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  agentType: string;
  startDate: string;
  endDate: string;
  totalCommission: number;
  totalPaidToSalesman: number;
  role: { id: number; name: string } | null;
}

export default function PaySalesman() {
  const { t } = useTranslation();
  const [, params] = useRoute("/salesman/:id/pay");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const id = params?.id;

  const [form, setForm] = useState({ paidDate: "", amount: "", notes: "" });

  const { data: salesmanResp, isLoading } = useQuery<{ data: SalesmanDetail }>({
    queryKey: ["salesman", id],
    queryFn: async () => (await api.get(`/salesman/${id}`)).data,
    enabled: !!id,
  });

  const salesman = salesmanResp?.data;
  const balance = salesman
    ? salesman.totalCommission - salesman.totalPaidToSalesman
    : 0;

  const payMutation = useMutation({
    mutationFn: async (payload: {
      salesManId: number;
      paidDate: string;
      amount: number;
      notes: string;
    }) => {
      await api.post("/salesman-paid-log", payload);
    },
    onSuccess: () => {
      toast.success(t("salesman.payBalance.success"));
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
      queryClient.invalidateQueries({ queryKey: ["salesman", id] });
      setLocation("/salesman");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.english ||
          t("salesman.payBalance.error"),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.paidDate) {
      toast.error(t("salesman.payBalance.dateRequired"));
      return;
    }
    if (!form.amount || isNaN(amount) || amount <= 0) {
      toast.error(t("salesman.payBalance.amountRequired"));
      return;
    }
    if (amount > balance) {
      toast.error(t("salesman.payBalance.exceedsBalance"));
      return;
    }
    payMutation.mutate({
      salesManId: salesman!.id,
      paidDate: form.paidDate,
      amount,
      notes: form.notes,
    });
  };

  const formatDate = (d: string) => {
    try {
      return format(new Date(d), "MMM dd, yyyy");
    } catch {
      return d;
    }
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
              <UsersIcon className="w-6 h-6 text-[#B39371]" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!salesman) return null;

  const amountVal = parseFloat(form.amount);
  const exceedsBalance = !isNaN(amountVal) && amountVal > balance;

  return (
    <Shell>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-32">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#4A1B1B]/5 to-transparent rounded-md -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="flex items-center gap-6 relative z-10">
              <Link
                href="/salesman"
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-md blur-xl opacity-20" />
                <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center border border-white/10">
                  <Banknote className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                    {t("salesman.title")}
                  </p>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t("salesman.payBalance.title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {salesman.fullName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Salesman info + balance */}
            <div className="lg:col-span-1 space-y-6">
              {/* Salesman details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                      {t("salesman.viewDetails")}
                    </h2>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      icon: Mail,
                      label: t("salesman.email"),
                      value: salesman.email,
                    },
                    {
                      icon: Phone,
                      label: t("salesman.phoneNumber"),
                      value: salesman.phoneNumber,
                    },
                    {
                      icon: Briefcase,
                      label: t("salesman.agentType"),
                      value: t(
                        `salesman.types.${salesman.agentType.toLowerCase()}`,
                      ),
                    },
                    {
                      icon: Clock,
                      label: t("salesman.startDate"),
                      value: formatDate(salesman.startDate),
                    },
                    {
                      icon: Clock,
                      label: t("salesman.endDate"),
                      value: formatDate(salesman.endDate),
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#4A1B1B]/10 to-[#6B2727]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[#B39371]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                          {label}
                        </p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white break-all">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Balance summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                      {t("salesman.stats.balance")}
                    </h2>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      label: t("salesman.stats.totalCommission"),
                      value: salesman.totalCommission,
                      color: "text-gray-900 dark:text-white",
                      bg: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50",
                    },
                    {
                      label: t("salesman.stats.totalPaid"),
                      value: salesman.totalPaidToSalesman,
                      color: "text-emerald-600 dark:text-emerald-400",
                      bg: "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20",
                    },
                    {
                      label: t("salesman.stats.balance"),
                      value: balance,
                      color:
                        balance > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400",
                      bg:
                        balance > 0
                          ? "bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20"
                          : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-md border",
                        item.bg,
                      )}
                    >
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className={cn("text-sm font-black", item.color)}>
                        {item.value.toLocaleString()}
                        <span className="text-[9px] font-bold ml-1 uppercase">
                          {t("common.sar")}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {t("salesman.payBalance.title")}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {salesman.fullName}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Available balance banner */}
                  <div className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md border",
                    balance > 0
                      ? "bg-amber-50/60 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50"
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                        <Wallet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {t("salesman.stats.balance")}
                      </span>
                    </div>
                    <span className={cn(
                      "text-base font-black",
                      balance > 0 ? "text-amber-600 dark:text-amber-400" : "text-gray-400"
                    )}>
                      {balance.toLocaleString()}
                      <span className="text-[10px] font-bold ml-1 uppercase">{t("common.sar")}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Payment Date */}
                    <FormField label={t("salesman.payBalance.date")} required>
                      <DatePicker
                        value={form.paidDate}
                        onChange={(date) =>
                          setForm((prev) => ({ ...prev, paidDate: date }))
                        }
                      />
                    </FormField>

                    {/* Amount */}
                    <FormField
                      label={t("salesman.payBalance.amount")}
                      required
                      error={
                        exceedsBalance
                          ? t("salesman.payBalance.exceedsBalance")
                          : undefined
                      }
                    >
                      <div className="relative group">
                        <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold pointer-events-none z-10">
                          {t("common.sar")}
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max={balance}
                          placeholder="0.00"
                          className={cn(
                            "h-12 pl-12 rtl:pl-4 rtl:pr-12 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium",
                            exceedsBalance
                              ? "border-rose-400 dark:border-rose-500"
                              : "",
                          )}
                          value={form.amount}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Notes */}
                  <FormField
                    label={`${t("salesman.payBalance.notes")} (${t("common.optional")})`}
                  >
                    <div className="relative group">
                      <FileText className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors" />
                      <Input
                        type="text"
                        placeholder={t("salesman.payBalance.notesPlaceholder")}
                        className="h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        value={form.notes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </FormField>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setLocation("/salesman")}
                      disabled={payMutation.isPending}
                      className="h-11 px-6 rounded-md font-semibold"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={payMutation.isPending || exceedsBalance}
                      className="h-11 px-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 min-w-40"
                    >
                      {payMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("common.processing")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Banknote className="w-4 h-4" />
                          {t("salesman.payBalance.pay")}
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
