import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  UploadCloud, 
  Gavel,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shell } from '../../components/shared/Shell';
import { useTranslation } from 'react-i18next';

export default function UpdateLegality() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
        {/* Breadcrumb & Header */}
        <div className="bg-light/80 dark:bg-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-white/5 flex items-center gap-6 shadow-xl shadow-black/[0.02]">
          <div className="w-14 h-14 bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] rounded-2xl flex items-center justify-center text-[#B39371] shadow-lg shadow-[#4A1B1B]/20">
            <Gavel className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              <Link href="/legality" className="hover:text-[#B39371] transition-colors">{t('legality.title')}</Link>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span className="text-[#B39371]">{t('legality.updateLegality')}</span>
            </div>
            <h1 className="text-3xl font-black text-[#4A1B1B] dark:text-white mt-1 font-outfit tracking-tight">
              {t('legality.updateLegality')}
            </h1>
          </div>
        </div>

        <div className="bg-light/80 dark:bg-dark/40 backdrop-blur-3xl rounded-[3rem] border border-zinc-200/50 dark:border-white/5 shadow-2xl shadow-black/[0.03] overflow-hidden">
          <div className="p-10 space-y-10">
            
            <div>
              <h2 className="text-2xl font-black text-[#4A1B1B] dark:text-white font-outfit uppercase tracking-tight">{t('legality.stepDetails')}</h2>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">{t('legality.stepDetailsDesc')}</p>
            </div>

            <div className="space-y-8">
              {/* Step Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('legality.profile.step')}</label>
                <Select>
                  <SelectTrigger className="w-full bg-light dark:bg-dark/50 border-2 border-zinc-200 dark:border-white/5 h-16 rounded-2xl focus:ring-4 focus:ring-[#B39371]/10 focus:border-[#B39371]/50 transition-all text-[#4A1B1B] dark:text-white font-black px-6">
                    <SelectValue placeholder={t('legality.selectStep')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-[1.5rem] border-zinc-200 dark:border-white/10 shadow-2xl bg-white dark:bg-gray-900">
                    <SelectItem value="step1" className="focus:bg-[#B39371]/10 focus:text-[#4A1B1B] dark:focus:text-white font-black">Purchase & Title Transfer</SelectItem>
                    <SelectItem value="step2" className="focus:bg-[#B39371]/10 focus:text-[#4A1B1B] dark:focus:text-white font-black">Title Deed Issuance</SelectItem>
                    <SelectItem value="step3" className="focus:bg-[#B39371]/10 focus:text-[#4A1B1B] dark:focus:text-white font-black">Electricity Meter Transfer</SelectItem>
                    <SelectItem value="step4" className="focus:bg-[#B39371]/10 focus:text-[#4A1B1B] dark:focus:text-white font-black">Water Meter Ownership Transfer</SelectItem>
                    <SelectItem value="step5" className="focus:bg-[#B39371]/10 focus:text-[#4A1B1B] dark:focus:text-white font-black">Architectural Plans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Details Textarea */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('common.details')}</label>
                <Textarea 
                  placeholder={t('legality.enterDetails')}
                  className="min-h-[220px] bg-light dark:bg-dark/50 border-2 border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 focus-visible:ring-4 focus-visible:ring-[#B39371]/10 focus-visible:border-[#B39371]/50 transition-all resize-none text-[#4A1B1B] dark:text-white font-bold text-lg placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('legality.uploadDocs')}</label>
                <div className="group relative w-full py-20 bg-light dark:bg-dark/20 border-3 border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-6 transition-all hover:border-[#B39371]/50 hover:bg-light/50 dark:hover:bg-dark/40 cursor-pointer overflow-hidden shadow-inner">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-zinc-50 dark:from-dark dark:to-zinc-900 rounded-[2rem] shadow-2xl flex items-center justify-center text-[#B39371] group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#4A1B1B] group-hover:to-[#6B2727] group-hover:text-white transition-all duration-500">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-[#4A1B1B] dark:text-white font-outfit uppercase tracking-tight">{t('legality.uploadDesc')}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.2em] font-black">{t('legality.uploadLimit')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="bg-light dark:bg-dark p-10 flex items-center justify-end gap-6 border-t border-zinc-200 dark:border-white/5">
            <button 
              onClick={() => setLocation('/legality')}
              className="px-10 py-4 rounded-2xl text-xs font-black text-[#4A1B1B] dark:text-muted-foreground hover:bg-muted dark:hover:bg-white/5 transition-all uppercase tracking-widest"
            >
              {t('common.cancel')}
            </button>
            <button 
              className="px-12 py-4 bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] text-white rounded-2xl text-xs font-black shadow-2xl shadow-[#4A1B1B]/30 hover:shadow-black/40 transition-all flex items-center gap-3 group uppercase tracking-widest"
            >
              {t('legality.updateLegality')}
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform text-[#B39371]" />
            </button>
          </div>
        </div>

        {/* Recently Uploaded (Aesthetic Addition) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-light/80 dark:bg-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-white/5 shadow-xl flex items-center justify-between group hover:border-[#B39371]/50 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] rounded-2xl flex items-center justify-center text-[#B39371] shadow-lg">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#4A1B1B] dark:text-white uppercase tracking-tight">{t('legality.labels.recordId')}_Report.pdf</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">2.1 MB • {t('common.justNow' as any) || 'Just now'}</p>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
