import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PaginatedSelect } from './PaginatedSelect';
import DatePicker from './DatePicker';
 
export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterField {
  type: 'search' | 'select' | 'date' | 'range' | 'paginated-select';
  label: string;
  placeholder?: string;
  key: string;
  options?: FilterOption[];
  icon?: React.ReactNode;
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg';
  
  // Props for paginated-select
  apiEndpoint?: string;
  queryKey?: string;
  mapResponseToOptions?: (data: any) => any[];
  searchPlaceholder?: string;
}

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showFilterChips?: boolean;
  activeFiltersCount?: number;
}

export function FilterBar({ 
  fields, 
  values, 
  onChange, 
  onReset,
  className,
  variant = 'default',
  showFilterChips = true,
  activeFiltersCount
}: FilterBarProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const getFilterWidth = (width?: string) => {
    switch(width) {
      case 'sm': return 'min-w-[150px] max-w-[200px]';
      case 'md': return 'min-w-[200px] max-w-[250px]';
      case 'lg': return 'min-w-[250px] max-w-[300px]';
      case 'full': return 'w-full';
      case 'auto':
      default: return 'flex-1 min-w-[200px]';
    }
  };

  const getActiveFilterCount = () => {
    if (activeFiltersCount !== undefined) return activeFiltersCount;
    return Object.values(values).filter(v => v && v !== '' && v !== 'all').length;
  };

  const clearFilter = (key: string) => {
    onChange(key, '');
  };

  const activeCount = getActiveFilterCount();

  const renderSearchField = (field: FilterField) => (
    <div className="relative group">
      <Search className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors rtl:left-auto rtl:right-3",
        values[field.key] 
          ? "text-[#B39371]" 
          : "text-gray-400 group-hover:text-gray-500"
      )} />
      <Input
        className={cn(
          "pl-9 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-all rtl:pl-3 rtl:pr-9",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "hover:border-gray-300 dark:hover:border-gray-600",
          "focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
          values[field.key] && "border-[#B39371]/50 bg-[#B39371]/5"
        )}
        placeholder={field.placeholder || t('common.searchBy', { label: field.label })}
        value={values[field.key] || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {values[field.key] && (
        <button
          onClick={() => clearFilter(field.key)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rtl:right-auto rtl:left-3"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}
    </div>
  );

  const renderSelectField = (field: FilterField) => (
    <Select
      value={values[field.key] || ''}
      onValueChange={(value) => onChange(field.key, value)}
    >
      <SelectTrigger className={cn(
        "h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-all",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
        values[field.key] && values[field.key] !== 'all' && "border-[#B39371]/50 bg-[#B39371]/5"
      )}>
        <SelectValue placeholder={field.placeholder || t('common.selectItem', { label: field.label })}>
          {field.options?.find(opt => opt.value === values[field.key])?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 dark:border-gray-700 shadow-lg">
        {field.options?.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer focus:bg-[#F5F1ED] dark:focus:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderDateField = (field: FilterField) => (
    <DatePicker
      value={values[field.key] || ''}
      onChange={(date) => onChange(field.key, date)}
      className="h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
    />
  );

  const renderRangeField = (field: FilterField) => {
    const [min, max] = (values[field.key] || '').split('-').map(Number);
    
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={t('common.min')}
          className="h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          value={min || ''}
          onChange={(e) => {
            const newMin = e.target.value;
            const newMax = max || '';
            onChange(field.key, newMin && newMax ? `${newMin}-${newMax}` : '');
          }}
        />
        <span className="text-gray-400">-</span>
        <Input
          type="number"
          placeholder={t('common.max')}
          className="h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          value={max || ''}
          onChange={(e) => {
            const newMax = e.target.value;
            const newMin = min || '';
            onChange(field.key, newMin && newMax ? `${newMin}-${newMax}` : '');
          }}
        />
      </div>
    );
  };

  const renderPaginatedSelectField = (field: FilterField) => (
    <PaginatedSelect
      apiEndpoint={field.apiEndpoint || ''}
      queryKey={field.queryKey || field.key}
      value={values[field.key] || ''}
      onChange={(value) => onChange(field.key, value)}
      placeholder={field.placeholder || t('common.selectItem', { label: field.label })}
      searchPlaceholder={field.searchPlaceholder || t('common.search')}
      mapResponseToOptions={field.mapResponseToOptions || ((data) => data.data.map((item: any) => ({ value: item.id, label: item.name })))}
      clearable={true}
    />
  );

  const renderField = (field: FilterField) => {
    switch(field.type) {
      case 'search':
        return renderSearchField(field);
      case 'select':
        return renderSelectField(field);
      case 'date':
        return renderDateField(field);
      case 'range':
        return renderRangeField(field);
      case 'paginated-select':
        return renderPaginatedSelectField(field);
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Filter Bar */}
      <div className={cn(
        "bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm   transition-all",
        variant === 'compact' && "p-4",
        variant === 'minimal' && "border-0 shadow-none bg-transparent"
      )}>
        <div className={cn(
          "flex flex-wrap items-center gap-4",
          variant === 'default' && "p-6"
        )}>
          {/* Filter Icon */}
          {variant !== 'minimal' && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{t('common.filters')}</span>
              {activeCount > 0 && (
                <Badge className="ml-1 bg-[#B39371] text-white border-0 rtl:ml-0 rtl:mr-1">
                  {activeCount}
                </Badge>
              )}
            </div>
          )}

          {/* Filter Fields */}
          <AnimatePresence>
            {fields.map((field) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "space-y-1",
                  getFilterWidth(field.width)
                )}
              >
                {variant !== 'minimal' && (
                  <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    {field.icon}
                    {field.label}
                  </label>
                )}
                {renderField(field)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Reset Button */}
          {onReset && activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onReset}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              {t('common.clearAll')}
            </motion.button>
          )}

          {/* Expand/Collapse Button (for compact mode) */}
          {variant === 'compact' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-auto p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
            </button>
          )}
        </div>

        {/* Expanded Content for Compact Mode */}
        {variant === 'compact' && isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex flex-wrap gap-4">
              {fields.map((field) => (
                <div key={field.key} className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Filter Chips */}
      {showFilterChips && activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('common.activeFilters')}:</span>
          {fields.map((field) => {
            const value = values[field.key];
            if (!value || value === '' || value === 'all') return null;

            const option = field.options?.find(opt => opt.value === value);
            const displayValue = option?.label || value;

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Badge 
                  variant="secondary"
                  className="pl-3 pr-2 py-1.5 bg-[#F5F1ED] dark:bg-gray-800 text-[#4A1B1B] dark:text-[#B39371] border-0 gap-1.5"
                >
                  <span className="text-xs font-medium">{field.label}:</span>
                  <span className="text-xs">{displayValue}</span>
                  <button
                    onClick={() => clearFilter(field.key)}
                    className="ml-1 p-0.5 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            );
          })}
          {onReset && (
            <button
              onClick={onReset}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline underline-offset-2"
            >
              {t('common.clearAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Example usage with default export
export default FilterBar;