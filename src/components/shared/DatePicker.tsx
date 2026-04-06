import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import Arabic localization for flatpickr
import { Arabic } from 'flatpickr/dist/l10n/ar.js';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className,
  name,
  required
}) => {
  const { i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const fp = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      fp.current = flatpickr(inputRef.current, {
        defaultDate: value,
        dateFormat: 'Y-m-d',
        locale: i18n.language === 'ar' ? Arabic : 'default',
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const date = selectedDates[0];
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
          } else {
            onChange('');
          }
        },
        // Premium customization
        disableMobile: true,
        static: true,
      });
    }

    return () => {
      if (fp.current) {
        fp.current.destroy();
      }
    };
  }, [i18n.language]);

  useEffect(() => {
    if (fp.current && value !== fp.current.input.value) {
      fp.current.setDate(value, false);
    }
  }, [value]);

  return (
    <div className="relative group">
      <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#B39371] transition-colors pointer-events-none z-10" />
      <input
        ref={inputRef}
        name={name}
        required={required}
        placeholder={placeholder}
        className={cn(
          "w-full h-12 pl-11 rtl:pl-4 rtl:pr-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 outline-none focus:ring-2 focus:ring-[#B39371]/10 transition-all font-medium text-sm text-gray-900 dark:text-white dark:placeholder-gray-500",
          className
        )}
      />
    </div>
  );
};

export default DatePicker;
