import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
  cancelText?: string;
  submitIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  disabled?: boolean;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
  delay?: number;
}

export function FormActions({
  onCancel,
  isSubmitting = false,
  submitText,
  submittingText,
  cancelText,
  submitIcon = <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />,
  cancelIcon = <X className="w-4 h-4" />,
  disabled = false,
  align = 'between',
  className,
  delay = 0.3,
}: FormActionsProps) {
  const { t } = useTranslation();

  const finalSubmitText = submitText || t('common.save');
  const finalSubmittingText = submittingText || t('common.processing');
  const finalCancelText = cancelText || t('common.cancel');
  const getAlignClass = () => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      case 'between': return 'justify-between';
      default: return 'justify-between';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden mt-8",
        className
      )}
    >
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#4A1B1B] via-[#B39371] to-[#4A1B1B]" />
      
      <div className="px-6 py-5 sm:px-8">
        <div className={cn("flex flex-row items-center gap-4", getAlignClass())}>
          
          {/* Cancel Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="relative px-6 py-2.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {cancelIcon}
              <span>{finalCancelText}</span>
            </span>
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 translate-y-full group-hover:translate-y-0 transition-transform" />
          </motion.button>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || disabled}
            className="relative px-8 py-2.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{finalSubmittingText}</span>
                </>
              ) : (
                <>
                  {submitIcon}
                  <span>{finalSubmitText}</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6B2727] to-[#4A1B1B] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
}
