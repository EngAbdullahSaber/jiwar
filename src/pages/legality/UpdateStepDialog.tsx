import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  FileText, 
  Loader2, 
  Save,
  Paperclip,
  X,
  Plus
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FileUpload } from '../../components/shared/FileUpload';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '../../components/shared/DatePicker';

interface UpdateStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  legalityId: string | number;
  stepData: any;
}

export function UpdateStepDialog({ isOpen, onClose, legalityId, stepData }: UpdateStepDialogProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    details: '',
    fromDate: '',
    toDate: '',
    amount: ''
  });
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (stepData) {
      setFormData({
        nameEn: stepData.step.name.english || '',
        nameAr: stepData.step.name.arabic || '',
        details: stepData.step.details || '',
        fromDate: stepData.step.fromDate ? stepData.step.fromDate.split('T')[0] : '',
        toDate: stepData.step.toDate ? stepData.step.toDate.split('T')[0] : '',
        amount: stepData.step.amount?.toString() || ''
      });
      setFiles(stepData.step.files || []);
    }
  }, [stepData, isOpen]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await api.patch(`/legality/${legalityId}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success(t('common.successUpdate') || 'Step updated successfully', {
        icon: '✅',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['legality', legalityId.toString()] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || 'Failed to update step', {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      step: {
        id: stepData.step.id,
        name: {
          arabic: formData.nameAr,
          english: formData.nameEn
        },
        details: formData.details,
        fromDate: formData.fromDate || null,
        toDate: formData.toDate || null,
        amount: formData.amount ? Number(formData.amount) : null,
        files: files
      }
    };

    updateMutation.mutate(payload);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-[#B39371]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('legality.updateStep') || 'Update Step Details'}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {t('legality.updateStepDesc') || 'Modify step name, timing, and attachments.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Step Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Step Name (English)
                </Label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                  placeholder="Purchase & Title Transfer"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  اسم الخطوة (عربي)
                </Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  dir="rtl"
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl text-right"
                  placeholder="نقل الملكية والافراغ"
                  required
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Details / Description
              </Label>
              <Textarea
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl min-h-[100px] resize-none"
                placeholder="Provide additional details about this step..."
              />
            </div>

            {/* Dates and Amount Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Start Date</Label>
                </div>
                <DatePicker
                  value={formData.fromDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, fromDate: date }))}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">End Date</Label>
                </div>
                <DatePicker
                  value={formData.toDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, toDate: date }))}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Amount (SAR)</Label>
                </div>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-11 rounded-xl"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">Attachments</Label>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{files.length} Files</span>
              </div>
              
              {/* File List */}
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {files.map((file, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 transition-all hover:border-[#B39371]/30"
                    >
                      <div className="w-8 h-8 rounded bg-white dark:bg-gray-900 flex items-center justify-center text-[#B39371]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
                        {file.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="pt-2">
                  <FileUpload
                    multiple
                    label={t('legality.uploadLabel') || "Add New Files"}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    maxSizeMB={5}
                    onUploadSuccess={(url) => setFiles(prev => [...prev, url])}
                    onUploadMultipleSuccess={(urls) => setFiles(prev => [...prev, ...urls])}
                  />

                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl border-gray-200 dark:border-gray-700"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white shadow-lg shadow-[#4A1B1B]/20"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.saving') || 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('common.save') || 'Save Changes'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
