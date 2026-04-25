import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  Calendar,
  DollarSign,
  Building,
  Loader2,
  Sparkles,
  Wallet
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { FileUpload } from '../shared/FileUpload';
import { PaginatedSelect } from '../shared/PaginatedSelect';
import DatePicker from '../shared/DatePicker';

interface AddClientPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | null;
  clientName: string;
}

export function AddClientPaymentDialog({
  isOpen,
  onClose,
  clientId,
  clientName
}: AddClientPaymentDialogProps) {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    amount: '',
    receipt: [] as string[],
    contractId: ''
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        paymentDate: new Date().toISOString().split('T')[0],
        amount: '',
        receipt: [] as string[],
        contractId: ''
      });
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/client-payment', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t('payments.success'), {
        style: { borderRadius: '1rem', background: '#4A1B1B', color: '#fff' }
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message?.english || t('payments.error'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.contractId) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    if (!clientId) return;

    mutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      clientId: clientId,
      contractId: parseInt(formData.contractId),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border-none shadow-2xl p-0">
        <div className="relative overflow-hidden">
          {/* Decorative Header Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] opacity-10 dark:opacity-20" />
          
          <div className="relative p-6 sm:p-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center text-white shrink-0">
                  <CreditCard className="w-6 h-6 text-[#B39371]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B39371]" />
                    <p className="text-[10px] font-bold text-[#B39371] uppercase tracking-[0.2em]">
                      {t('payments.financialTransaction')}
                    </p>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('payments.addPayment')}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 mt-1 italic">
                    {t('payments.recordPaymentFor', { name: clientName })}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Fields */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Payment Date */}
                   <div className="space-y-2">
                     <Label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                       <Calendar className="w-3 h-3" />
                       {t('payments.paymentDate')}
                     </Label>
                     <DatePicker
                       value={formData.paymentDate}
                       onChange={(date) => setFormData(prev => ({ ...prev, paymentDate: date }))}
                       required
                       className="h-12 rounded-xl border-gray-100 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
                     />
                   </div>

                   {/* Amount */}
                   <div className="space-y-2">
                     <Label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                       <DollarSign className="w-3 h-3" />
                       {t('payments.amount')}
                     </Label>
                     <Input 
                       type="number"
                       required
                       placeholder="0.00"
                       className="h-12 rounded-xl border-gray-100 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 font-bold text-lg"
                       value={formData.amount}
                       onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                     />
                   </div>

                   {/* Contract */}
                   <div className="md:col-span-2 space-y-2">
                     <PaginatedSelect
                       label={t('contracts.labels.client')}
                       apiEndpoint="/contract"
                       queryKey="contracts"
                       extraParams={{ clientId, sortOption: 'newest' }}
                       value={formData.contractId}
                       onChange={(val) => setFormData(prev => ({ ...prev, contractId: val }))}
                       placeholder={t('contracts.placeholders.select')}
                       mapResponseToOptions={(data: any) => data.data.map((item: any) => ({
                         value: item.id,
                         label: `${t('contracts.title')} #${item.id} - ${item.apartment?.mainName?.[isRtl ? 'arabic' : 'english'] || ''}`,
                         description: `${t(`contracts.types.${item.type}`)} ${item.totalContractValue ? `· ${item.totalContractValue.toLocaleString()} ${t('common.sar')}` : ''}`,
                         icon: <Building className="w-4 h-4" />
                       }))}
                     />
                   </div>
                </div>

                {/* File Upload Section */}
                <div className="lg:col-span-12 space-y-6">
                   <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <Label className="text-xs font-bold text-gray-500 uppercase mb-4 block">
                        {t('payments.receipt')}
                      </Label>
                      <FileUpload 
                        onUploadMultipleSuccess={(urls) => setFormData(prev => ({ ...prev, receipt: [...prev.receipt, ...urls] }))}
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, receipt: [...prev.receipt, url] }))}
                        label=""
                        helperText={t('payments.receiptHelper')}
                        maxSizeMB={5}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple={true}
                      />
                   </div>
                </div>
              </div>

              <DialogFooter className="mt-8">
                <div className="flex items-center justify-end gap-3 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="h-12 px-6 rounded-xl font-bold text-gray-500 hover:text-gray-900"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white font-bold shadow-xl shadow-[#4A1B1B]/20 min-w-[180px]"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        {t('payments.addPayment')}
                      </span>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
