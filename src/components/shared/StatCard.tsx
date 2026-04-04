import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  color?: string;
  progress?: number;
  className?: string;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend, 
  trendDirection = 'up',
  color = "from-[#4A1B1B] to-[#6B2727]", 
  progress = 0,
  className
}: StatCardProps) {
  const isPositive = trendDirection === 'up';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("relative group", className)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-md blur-xl`} />
      <div className="relative bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-lg group-hover:shadow-xl transition-all h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <Badge variant="secondary" className={cn(
                "border-0",
                isPositive 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {trend}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            {subValue && (
              <p className="text-xs text-gray-400 dark:text-gray-500">{subValue}</p>
            )}
          </div>
        </div>
        {progress > 0 && (
          <div className="mt-4">
            <Progress value={progress} className="h-1.5 bg-gray-100 dark:bg-gray-800" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
