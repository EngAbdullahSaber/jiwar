import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function FormField({ label, required = false, error, description, children, id, className }: FormFieldProps) {
  return (
    <div
      id={id}
      className={cn('space-y-2', className)}
      {...(error ? { 'data-field-error': 'true' } : {})}
    >
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
        {label} {required && <span className="text-[#B39371]">*</span>}
      </label>
      {description && <span className="text-xs text-gray-400">{description}</span>}
      {children}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
