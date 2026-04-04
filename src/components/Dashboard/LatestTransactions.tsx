import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    customer: "Sami Al-Qahtani",
    avatar: "SA",
    apartment: "T2-A405",
    amount: "1,240,000",
    status: "SOLD",
    statusColor: "bg-red-50 text-red-500",
    date: "Oct 24, 2024"
  },
  {
    id: 2,
    customer: "Mohammed Hashim",
    avatar: "MH",
    apartment: "T1-B102",
    amount: "890,500",
    status: "RESERVED",
    statusColor: "bg-orange-50 text-orange-500",
    date: "Oct 23, 2024"
  },
  {
    id: 3,
    customer: "Laila Al-Saud",
    avatar: "LA",
    apartment: "P4-V012",
    amount: "3,450,000",
    status: "SOLD",
    statusColor: "bg-red-50 text-red-500",
    date: "Oct 23, 2024"
  },
  {
    id: 4,
    customer: "Khalid Hamad",
    avatar: "KH",
    apartment: "T3-C601",
    amount: "1,120,000",
    status: "PROCESSING",
    statusColor: "bg-blue-50 text-blue-500",
    date: "Oct 22, 2024"
  }
];

export function LatestTransactions() {
  return (
    <div className="bg-card p-8 rounded-[32px] shadow-sm border border-border mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-foreground">Latest Sales Transactions</h2>
        <button className="text-sm font-semibold text-[#B39371] hover:text-[#4A1B1B] dark:hover:text-[#C4A484] transition-colors">
          View All Records
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Apartment ID</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount (SAR)</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="pb-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr key={t.id} className="group hover:bg-muted/50 transition-colors">
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border shadow-sm">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">{t.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-foreground">{t.customer}</span>
                  </div>
                </td>
                <td className="py-5">
                  <span className="text-sm font-medium text-muted-foreground">{t.apartment}</span>
                </td>
                <td className="py-5">
                  <span className="text-sm font-bold text-foreground">{t.amount}</span>
                </td>
                <td className="py-5">
                  <Badge variant="secondary" className={cn("rounded-full px-3 py-1 text-[10px] font-bold border-none shadow-none", t.statusColor, "bg-opacity-10")}>
                    {t.status}
                  </Badge>
                </td>
                <td className="py-5 text-sm text-muted-foreground">
                  {t.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
