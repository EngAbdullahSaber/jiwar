import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, CreditCard, Inbox } from "lucide-react";

interface Transaction {
  id: number;
  paymentDate: string;
  amount: number;
  clientId: number;
  clientFullName: string;
  clientPhoneNumber: string;
  clientEmail: string;
  apartmentId: number;
  apartmentMainName: { arabic: string; english: string };
}

interface LatestTransactionsProps {
  transactions?: Transaction[];
}

const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
];

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const isEmpty = !transactions || transactions.length === 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B39371]" />
            <p className="text-[11px] font-semibold text-[#B39371] uppercase tracking-widest">
              {t('dashboard.latestTransactions.title')}
            </p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.latestTransactions.title')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-lg tabular-nums">
              {transactions.length}
            </span>
          )}
          <div className="w-9 h-9 rounded-xl bg-[#F5F1ED] dark:bg-gray-800 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#4A1B1B] dark:text-[#B39371]" />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {t('dashboard.latestTransactions.noTransactions', 'No transactions yet')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('dashboard.latestTransactions.noTransactionsDesc', 'Payments will appear here once contracts are signed')}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800/60">
                {[
                  t('dashboard.latestTransactions.customer'),
                  t('dashboard.latestTransactions.apartmentName'),
                  t('dashboard.latestTransactions.amountSar'),
                  t('dashboard.latestTransactions.status'),
                  t('dashboard.latestTransactions.date'),
                ].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>

            <tbody>
              {transactions.map((item, idx) => {
                const initials = item.clientFullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                let formattedDate = item.paymentDate;
                try { formattedDate = format(parseISO(item.paymentDate), 'MMM d, yyyy'); } catch {}

                const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const aptName = isRtl ? item.apartmentMainName.arabic : item.apartmentMainName.english;

                return (
                  <tr
                    key={item.id}
                    className="group border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className={`text-xs font-bold ${colorClass}`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                            {item.clientFullName}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {item.clientPhoneNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                        {aptName}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                        {item.amount.toLocaleString()}
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 ml-1">SAR</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        {t('dashboard.latestTransactions.paid')}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap tabular-nums">
                        {formattedDate}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
