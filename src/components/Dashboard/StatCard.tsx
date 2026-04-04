import type { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({ label, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-card p-6 rounded-[24px] shadow-sm border border-border flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 rounded-xl", iconBg || "bg-muted")}>
          <Icon className={cn("w-5 h-5", iconColor || "text-primary")} />
        </div>
        {change && (
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
