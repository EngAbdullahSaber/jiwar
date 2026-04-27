
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import { type LucideIcon, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  processingText?: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'danger' | 'success';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isProcessing = false,
  processingText,
  icon: Icon = CheckCircle2,
  variant = 'primary'
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  const displayConfirmText = confirmText || t('common.confirm');
  const displayCancelText = cancelText || t('common.cancel');
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] hover:from-[#6B2727] hover:to-[#8B3333] shadow-[#4A1B1B]/20",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30"
  };

  const iconStyles = {
    primary: "bg-[#F5F1ED] dark:bg-gray-800 text-[#4A1B1B] dark:text-[#B39371]",
    danger: "bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400",
    success: "bg-green-50 dark:bg-green-950/50 text-green-500 dark:text-green-400"
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 bg-white dark:bg-gray-900">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0">
          <div className={`${iconStyles[variant]} p-2 rounded-md border-8 border-white dark:border-gray-900 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        
        <AlertDialogHeader className="mt-8 sm:mt-0 sm:pl-16">
          <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-3 mt-8">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            disabled={isProcessing}
          >
            {displayCancelText}
          </AlertDialogCancel>
          
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-white font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none border-none ${variantStyles[variant]}`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2 px-4">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{processingText || t('common.processing')}</span>
              </div>
            ) : (
              displayConfirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
