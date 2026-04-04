import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopHeader } from '../../components/TopHeader';
import { Link, useRoute } from "wouter";
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Gavel,
  FileText,
  Download,
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Layers,
  Paperclip,
  File,
  Eye,
  BadgeCheck,
  Hourglass,
  TrendingUp,
  Edit
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UpdateStepDialog } from './UpdateStepDialog';

interface LegalityStep {
  id: number;
  step: {
    id: number;
    name: {
      arabic: string;
      english: string;
    };
    isDefault: boolean;
    details: string | null;
    fromDate: string | null;
    toDate: string | null;
    amount: number | null;
    files: string[];
  };
}

interface Legality {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  createdAt: string;
  createdBy: {
    id: number;
    email: string;
  };
  legalitySteps: LegalityStep[];
}

interface LegalityResponse {
  code: number;
  data: Legality;
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, gradient }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
      style={{ background: gradient }}
    />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg group-hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          color
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Step Timeline Component
const StepTimeline = ({ steps }: { steps: LegalityStep[] }) => {
  const completedCount = steps.filter(s => s.step.toDate).length;
  const totalSteps = steps.length;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Progress Timeline</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {completedCount}/{totalSteps} Steps Completed
        </span>
      </div>
      <div className="space-y-2">
        {steps.map((item, index) => {
          const isCompleted = !!item.step.toDate;
          const stepNumber = index + 1;
          
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                isCompleted 
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              )}>
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNumber}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Step {stepNumber}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      {new Date(item.step.toDate!).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isCompleted ? "w-full bg-emerald-500" : "w-0"
                  )} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ViewLegality() {
  const [, params] = useRoute("/legality/:id");
  const { t, i18n } = useTranslation();
  const id = params?.id;
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStepData, setSelectedStepData] = useState<any>(null);

  const { data: response, isLoading, error } = useQuery<LegalityResponse>({
    queryKey: ['legality', id],
    queryFn: async () => {
      const resp = await api.get(`/legality/${id}`);
      return resp.data;
    },
    enabled: !!id
  });

  const legality = response?.data;

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStepName = (name: string) => {
    if (!name) return "";
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const calculateProgress = (steps: LegalityStep[]) => {
    if (!steps || steps.length === 0) return 0;
    const completedCount = steps.filter(s => s.step.toDate).length;
    return Math.round((completedCount / steps.length) * 100);
  };

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="h-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !legality) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to load legality
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                The legality record you're looking for might not exist or there was a connection error.
              </p>
              <Link href="/legality">
                <button className="px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                  Back to List
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Shell>
    );
  }

  const progress = calculateProgress(legality.legalitySteps);
  const completedCount = legality.legalitySteps.filter(s => s.step.toDate).length;
  const pendingCount = legality.legalitySteps.length - completedCount;

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header with Back Button */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/legality" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    LF-{legality.id.toString().padStart(4, '0')}
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {i18n.language === 'ar' ? legality.name.arabic : legality.name.english}
                </h1>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={User}
              label="Created By"
              value={legality.createdBy.email.split('@')[0]}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            />
            <StatCard
              icon={Calendar}
              label="Date Created"
              value={formatDate(legality.createdAt)}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            />
            <StatCard
              icon={Layers}
              label="Total Steps"
              value={legality.legalitySteps.length}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            />
            <StatCard
              icon={TrendingUp}
              label="Progress"
              value={`${progress}%`}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            />
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {completedCount} Completed
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <Hourglass className="w-3.5 h-3.5" />
                    {pendingCount} Pending
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#4A1B1B] to-[#B39371] relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{progress}% Complete</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Standard Steps</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {legality.legalitySteps.filter(s => s.step.isDefault).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Custom Steps</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {legality.legalitySteps.filter(s => !s.step.isDefault).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">With Attachments</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {legality.legalitySteps.filter(s => s.step.files?.length > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Steps Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#B39371]" />
                Workflow Steps
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Click on any step to view details
              </span>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {legality.legalitySteps.map((item, index) => {
                const step = item.step;
                const isCompleted = !!step.toDate;
                const isExpanded = expandedStep === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                  >
                    {/* Step Header */}
                    <div 
                      onClick={() => toggleStep(item.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Step Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          isCompleted 
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        )}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-medium">{index + 1}</span>}
                        </div>

                        {/* Step Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {i18n.language === 'ar' ? step.name.arabic : formatStepName(step.name.english)}
                            </h3>
                            {step.isDefault && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                Default
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs">
                            {step.fromDate && (
                              <span className="text-gray-500 dark:text-gray-400">
                                Started: {formatDate(step.fromDate)}
                              </span>
                            )}
                            {step.toDate && (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Completed: {formatDate(step.toDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Badge */}
                        <Badge 
                          className={cn(
                            "text-[10px] px-2 py-0.5",
                            isCompleted 
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          )}
                        >
                          {isCompleted ? 'Completed' : 'Pending'}
                        </Badge>

                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStepData(item);
                            setIsUpdateDialogOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-[#B39371] hover:bg-[#B39371]/10 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Expand Icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-400"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-200 dark:border-gray-800"
                        >
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                            {/* Description */}
                            {step.details && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Description
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {step.details}
                                </p>
                              </div>
                            )}

                            {/* Dates and Amount */}
                            <div className="grid grid-cols-3 gap-4">
                              {step.fromDate && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(step.fromDate)}
                                  </p>
                                </div>
                              )}
                              {step.toDate && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(step.toDate)}
                                  </p>
                                </div>
                              )}
                              {step.amount && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                  <p className="text-sm font-medium text-[#B39371]">
                                    {step.amount.toLocaleString()} SAR
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Files */}
                            {step.files && step.files.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                  <Paperclip className="w-3.5 h-3.5" />
                                  Attachments ({step.files.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {step.files.map((file, idx) => (
                                    <a
                                      key={idx}
                                      href={`${import.meta.env.VITE_API_BASE_URL}/${file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#B39371] transition-colors group"
                                    >
                                      <File className="w-4 h-4 text-gray-400 group-hover:text-[#B39371]" />
                                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
                                        {file.split('/').pop()}
                                      </span>
                                      <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#B39371]" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Timeline View */}
          <StepTimeline steps={legality.legalitySteps} />
        </div>
      </div>

      {/* Update Step Dialog */}
      {selectedStepData && (
        <UpdateStepDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedStepData(null);
          }}
          legalityId={id!}
          stepData={selectedStepData}
        />
      )}
    </Shell>
  );
}