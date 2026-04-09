import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Badge } from '@/components/ui/badge';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PaginatedSelectOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
  };
}

interface PaginatedSelectProps {
  apiEndpoint: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  queryKey: string;
  mapResponseToOptions: (data: any) => PaginatedSelectOption[];
  disabled?: boolean;
  clearable?: boolean;
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  initialLabel?: string;
}

export function PaginatedSelect({
  apiEndpoint,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  queryKey,
  mapResponseToOptions,
  disabled = false,
  clearable = true,
  size = 'default',
  label,
  error,
  helperText,
  initialLabel,
}: PaginatedSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const observerTarget = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search input to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(apiEndpoint, {
        params: {
          page: pageParam,
          pageSize: 10,
          search: debouncedSearch || undefined,
        },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalPages = lastPage.totalPages || 1;
      const currentPage = allPages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: open,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  const options = data?.pages.flatMap((page) => mapResponseToOptions(page)) || [];
  
  // Find selected option for display
  const selectedOption = options.find((opt) => opt.value.toString() === value.toString());
  
  // Get size-based classes
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'h-9 text-xs';
      case 'lg': return 'h-14 text-base';
      default: return 'h-12 text-sm';
    }
  };

  const displayLabel = selectedOption?.label || initialLabel || '';

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
          {label}
        </label>
      )}
      
      <div className="relative w-full" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={cn(
            "w-full justify-between relative group transition-all",
            getSizeClasses(),
            "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md",
            "hover:border-[#B39371]/30 hover:bg-gray-50 dark:hover:bg-gray-800",
            "focus:border-[#B39371] focus:ring-2 focus:ring-[#B39371]/20",
            error && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20",
            !value && "text-gray-500 dark:text-gray-400",
            value && "border-[#B39371]/50 bg-[#B39371]/5"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span className="text-[#B39371]">{selectedOption.icon}</span>
              )}
              <span className="truncate">
                {value ? displayLabel : placeholder}
              </span>
              {selectedOption?.badge && (
                <Badge 
                  variant="secondary"
                  className={cn(
                    "ml-2 text-[10px] px-1.5 py-0.5",
                    selectedOption.badge.variant === 'success' && "bg-emerald-50 text-emerald-700",
                    selectedOption.badge.variant === 'warning' && "bg-amber-50 text-amber-700",
                    selectedOption.badge.variant === 'danger' && "bg-red-50 text-red-700"
                  )}
                >
                  {selectedOption.badge.label}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {clearable && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </div>
        </Button>
        
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-popover rounded-md border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
            <Command shouldFilter={false} className="max-h-[300px]">
              {/* Custom Search Input */}
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                <input
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                )}
              </div>
              
              <CommandList className="max-h-[300px] overflow-y-auto w-full">
                {status === 'pending' && options.length === 0 && (
                  <div className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-[#B39371]" />
                    <p className="text-sm text-gray-500">Loading options...</p>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-red-500 mb-3">Failed to load data</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="mx-auto"
                    >
                      Retry
                    </Button>
                  </div>
                )}
                
                {status === 'success' && options.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No options found</p>
                    {search && (
                      <p className="text-xs text-gray-400 mt-1">
                        Try different search terms
                      </p>
                    )}
                  </div>
                )}
                
                {options.length > 0 && (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value.toString()}
                        onSelect={(currentValue) => {
                          onChange(currentValue === value.toString() ? "" : currentValue);
                          setOpen(false);
                          setSearch('');
                        }}
                        className={cn(
                          "cursor-pointer py-3 px-4 rounded-md transition-colors",
                          "aria-selected:bg-[#F5F1ED] dark:aria-selected:bg-gray-800",
                          value.toString() === option.value.toString() && "bg-[#B39371]/5"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0 transition-opacity",
                              value.toString() === option.value.toString() 
                                ? "opacity-100 text-[#B39371]" 
                                : "opacity-0"
                            )}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {option.icon && (
                                <span className="text-[#B39371] shrink-0">{option.icon}</span>
                              )}
                              <span className="text-sm font-medium truncate">
                                {option.label}
                              </span>
                              {option.badge && (
                                <Badge 
                                  variant="secondary"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5 shrink-0",
                                    option.badge.variant === 'success' && "bg-emerald-50 text-emerald-700",
                                    option.badge.variant === 'warning' && "bg-amber-50 text-amber-700",
                                    option.badge.variant === 'danger' && "bg-red-50 text-red-700"
                                  )}
                                >
                                  {option.badge.label}
                                </Badge>
                              )}
                            </div>
                            
                            {option.description && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {/* Loading More Indicator */}
                {isFetchingNextPage && (
                  <div className="py-4 text-center border-t border-gray-100 dark:border-gray-800">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-[#B39371]" />
                  </div>
                )}
                
                {/* Observer Target */}
                {hasNextPage && !isFetchingNextPage && (
                  <div ref={observerTarget} className="h-4 w-full" />
                )}
                
                {/* End of Results */}
                {!hasNextPage && options.length > 0 && (
                  <div className="py-3 text-center border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400">No more results</p>
                  </div>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
      
      {/* Error & Helper Text */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-md" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Example usage with default export
export default PaginatedSelect;

// Helper function to create common option mappers
export const createOptionMapper = {
  fromLegalities: (data: any): PaginatedSelectOption[] => {
    return data.data.map((item: any) => ({
      value: item.id,
      label: `${item.name.english} (LF-${item.id.toString().padStart(4, '0')})`,
      description: item.name.arabic,
      badge: { 
        label: `Steps: ${item.legalitySteps?.length || 0}`,
        variant: 'default'
      }
    }));
  },
  
  fromProjects: (data: any): PaginatedSelectOption[] => {
    return data.data.map((item: any) => ({
      value: item.id,
      label: item.name.english,
      description: item.projectIdentity,
      badge: {
        label: item.status || 'Planning',
        variant: item.status === 'CONSTRUCTION' ? 'success' : 'warning'
      }
    }));
  },
  
  fromTemplates: (data: any): PaginatedSelectOption[] => {
    return data.data.map((item: any) => ({
      value: item.id,
      label: item.name.english,
      description: item.sku,
      badge: {
        label: `${item.size}m²`,
        variant: 'default'
      }
    }));
  }
};