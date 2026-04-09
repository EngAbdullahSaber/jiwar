import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Pagination } from './Pagination';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  
  // Generic Features
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  
  // Pagination Features
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  
  // Sorting Features
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  
  // Selection Features
  selectedRows?: number[];
  onRowSelect?: (index: number) => void;
  onSelectAll?: () => void;
  selectable?: boolean;
  
  // Styling
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export function DataTable<T extends Record<string, any>>({ 
  columns, 
  data, 
  onRowClick, 
  className,
  
  // Loading
  isLoading,
  loadingMessage,
  emptyMessage,
  
  // Pagination
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  
  // Sorting
  sortColumn,
  sortDirection,
  onSort,
  
  // Selection
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  selectable = false,
  
  // Styling
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false
}: DataTableProps<T>) {
  const { t } = useTranslation();

  const finalLoadingMessage = loadingMessage || t('common.loading');
  const finalEmptyMessage = emptyMessage || t('common.noData');
  const finalNoResultsFound = t('common.noResults');

  const handleSort = (column: Column<T>) => {
    if (column.sortable && onSort && column.accessorKey) {
      onSort(column.accessorKey as string);
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable || !column.accessorKey) return null;
    
    if (sortColumn === column.accessorKey) {
      return sortDirection === 'asc' ? 
        <ChevronUp className="w-3.5 h-3.5 ml-1" /> : 
        <ChevronDown className="w-3.5 h-3.5 ml-1" />;
    }
    
    return <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-30" />;
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm",
          className
        )}
      >
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#B39371]/20 border-t-[#B39371] rounded-md animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#B39371] animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{finalLoadingMessage}</p>
      </motion.div>
    );
  }

  if (!data.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm",
          className
        )}
      >
        <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{finalNoResultsFound}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{finalEmptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-md border overflow-hidden shadow-sm flex flex-col",
      bordered ? "border-gray-300 dark:border-gray-700" : "border-gray-200 dark:border-gray-800",
      className
    )}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn(
              "border-b transition-colors",
              bordered 
                ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" 
                : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
            )}>
              {/* Select All Checkbox */}
              {selectable && (
                <th className="w-10 pl-6 pr-2 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-[#B39371] focus:ring-[#B39371]/20"
                  />
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(column)}
                  className={cn(
                    "py-4 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-4 first:pl-6 last:pr-6 whitespace-nowrap group",
                    column.sortable && "cursor-pointer hover:text-[#4A1B1B] dark:hover:text-[#B39371]",
                    column.headerClassName
                  )}
                >
                  <div className="flex items-center">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
            <AnimatePresence>
              {data.map((item, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors",
                    hoverable && "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer",
                    striped && rowIndex % 2 === 1 && "bg-gray-50/50 dark:bg-gray-800/20",
                    onRowClick && "cursor-pointer",
                    selectedRows.includes(rowIndex) && "bg-[#B39371]/5 dark:bg-[#B39371]/10"
                  )}
                >
                  {/* Select Checkbox */}
                  {selectable && (
                    <td className="w-10 pl-6 pr-2 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => onRowSelect?.(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-[#B39371] focus:ring-[#B39371]/20"
                      />
                    </td>
                  )}
                  
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "align-middle",
                        compact ? "py-2" : "py-4",
                        "px-4 first:pl-6 last:pr-6",
                        column.className
                      )}
                    >
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? (item[column.accessorKey] as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination Section */}
      {totalPages !== undefined && totalPages > 1 && onPageChange && currentPage !== undefined && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 border-t",
            bordered 
              ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" 
              : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {totalItems !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('legality.showing')}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(currentPage - 1) * pageSize + 1}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('legality.to')}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.min(currentPage * pageSize, totalItems)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('legality.of')}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {totalItems}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('legality.results')}
                </span>
              </div>
            )}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </motion.div>
      )}

      {/* Footer with Total Count */}
      {totalPages === 1 && totalItems !== undefined && (
        <div className={cn(
          "p-4 border-t text-xs text-gray-500 dark:text-gray-400",
          bordered 
            ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" 
            : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
        )}>
          {t('common.all')} <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> {t('common.items') || 'items'}
        </div>
      )}
    </div>
  );
}

// Example usage with default export
export default DataTable;

// Additional utility components for common cell types
export const TableCell = {
  Status: ({ status }: { status: string }) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      active: { color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", label: "Active" },
      inactive: { color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400", label: "Inactive" },
      pending: { color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", label: "Pending" },
    };
    
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    
    return (
      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium", config.color)}>
        {config.label}
      </span>
    );
  },
  
  Avatar: ({ src: _src, name }: { src?: string; name: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center text-white text-xs font-medium">
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
    </div>
  ),
  
  Date: ({ date }: { date: string }) => (
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}
    </span>
  ),
  
  Currency: ({ amount, currency = 'SAR' }: { amount: number; currency?: string }) => (
    <span className="text-sm font-semibold text-gray-900 dark:text-white">
      {currency} {amount.toLocaleString()}
    </span>
  ),
  
  Progress: ({ value }: { value: number }) => (
    <div className="flex items-center gap-3 min-w-[100px]">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#4A1B1B] to-[#B39371] rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}%</span>
    </div>
  ),
  
  Badge: ({ label, color = 'default' }: { label: string; color?: 'default' | 'success' | 'warning' | 'danger' }) => {
    const colors = {
      default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
      warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
      danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    };
    
    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", colors[color])}>
        {label}
      </span>
    );
  }
};

// Add this to your global CSS file
const style = document.createElement('style');
style.textContent = `
  /* Custom scrollbar for table */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  .dark .overflow-x-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  .dark .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  
  .dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;
document.head.appendChild(style);