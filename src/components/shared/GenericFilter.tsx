import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  type: 'select' | 'date' | 'text';
  label: string;
  key: string;
  placeholder?: string;
  options?: FilterOption[];
}

interface GenericFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  fields?: FilterField[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  placeholder?: string;
}

export function GenericFilter({
  searchValue,
  onSearchChange,
  fields = [],
  filterValues,
  onFilterChange,
  placeholder = "Search..."
}: GenericFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Requirement: Filter button appears if there is search in the table (searchValue has content)
  const hasSearch = searchValue.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-12 bg-gray-50/50 border-gray-100 rounded-2xl h-12 focus:ring-[#B39371]/20 transition-all font-medium"
          />
        </div>

        {hasSearch && fields.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 px-6 h-12 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest whitespace-nowrap",
              isExpanded
                ? "bg-[#4A1B1B] text-white border-[#4A1B1B] shadow-lg shadow-[#4A1B1B]/20"
                : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-white border border-gray-100 rounded-[28px] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <Select
                      value={filterValues[field.key]}
                      onValueChange={(value) => onFilterChange(field.key, value)}
                    >
                      <SelectTrigger className="bg-gray-50/80 border-none rounded-xl h-12 px-5 focus:ring-[#B39371]/20 transition-all">
                        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-50 shadow-xl overflow-hidden">
                        {field.options?.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="focus:bg-[#F5F1ED] focus:text-[#4A1B1B] font-medium"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      value={filterValues[field.key] || ''}
                      onChange={(e) => onFilterChange(field.key, e.target.value)}
                      className="bg-gray-50/80 border-none rounded-xl h-12 px-5 focus-visible:ring-[#B39371]/20 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
