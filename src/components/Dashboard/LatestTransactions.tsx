import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";

interface LatestTransactionsProps {
  transactions?: {
    id: number;
    paymentDate: string;
    amount: number;
    clientId: number;
    clientFullName: string;
    clientPhoneNumber: string;
    clientEmail: string;
    apartmentId: number;
    apartmentMainName: {
      arabic: string;
      english: string;
    };
  }[];
}

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="bg-card p-8 rounded-md shadow-sm border border-border mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-foreground">{t('dashboard.latestTransactions.title')}</h2>
   
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.latestTransactions.customer')}</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.latestTransactions.apartmentName')}</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.latestTransactions.amountSar')}</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.latestTransactions.status')}</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.latestTransactions.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions?.map((t_item) => {
              const avatar = t_item.clientFullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
                
              let formattedDate = t_item.paymentDate;
              try {
                formattedDate = format(parseISO(t_item.paymentDate), 'MMM d, yyyy');
              } catch (e) {
                // fallback to original string
              }

              return (
                <tr key={t_item.id} className="group hover:bg-muted/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border shadow-sm">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">{avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{t_item.clientFullName}</span>
                        <span className="text-[10px] text-muted-foreground">{t_item.clientPhoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="text-sm font-medium text-muted-foreground">
                      {isRtl ? t_item.apartmentMainName.arabic : t_item.apartmentMainName.english}
                    </span>
                  </td>
                  <td className="py-5">
                    <span className="text-sm font-bold text-foreground">{t_item.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-5">
                    <Badge variant="secondary" className={cn("rounded-md px-3 py-1 text-[10px] font-bold border-none shadow-none bg-green-50 text-green-500 bg-opacity-10")}>
                      {t('dashboard.latestTransactions.paid')}
                    </Badge>
                  </td>
                  <td className="py-5 text-sm text-muted-foreground">
                    {formattedDate}
                  </td>
                </tr>
              );
            })}
            {(!transactions || transactions.length === 0) && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  {t('dashboard.latestTransactions.noTransactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
