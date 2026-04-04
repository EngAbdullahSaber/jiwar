import { useState, useEffect } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation, useRoute } from "wouter";
import { 
  Building2, 
  MapPin, 
  Loader2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Hash,
  Navigation,
  Save
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shell } from '../../components/shared/Shell';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Form Section Component
const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#B39371]" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

// Form Field Component
const FormField = ({ label, required = false, children, error }: any) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label} {required && <span className="text-[#B39371]">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

// Label Component
const Label = ({ children, className, ...props }: any) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
    {children}
  </label>
);

export default function UpdateProject() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/projects/:id/edit');
  const projectId = params?.id;

  const [formData, setFormData] = useState({
    name: { arabic: "", english: "" },
    status: "",
    address: ""
  });

  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get(`/project/${projectId}`);
      return response.data;
    },
    enabled: !!projectId
  });

  useEffect(() => {
    if (projectData?.data) {
      const p = projectData.data;
      setFormData({
        name: {
          arabic: p.name?.arabic || "",
          english: p.name?.english || ""
        },
        status: p.lastStage?.toLowerCase() || "planning", // Maps appropriately to dropdown values
        address: p.address || ""
      });
    }
  }, [projectData]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        status: data.status,
        address: data.address
      };
      
      const response = await api.patch(`/project/${projectId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project updated successfully", {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      setLocation('/projects');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project", {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.english || !formData.name.arabic || !formData.address) {
      toast.error("Please fill all required fields", { 
        icon: '⚠️',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' } 
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoadingProject) {
    return (
      <Shell>
        <TopHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#B39371] animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/projects" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    Update Project
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Project Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Revise the basic information and real-world tracking status of the project
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Identity Section */}
            <FormSection 
              icon={Building2}
              title="Project Identity"
              description="Basic information and identification for the project"
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Project ID (Read-only reference) */}
                <FormField label="Project ID">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      value={projectData?.data?.projectIdentity || ""}
                      readOnly
                      disabled
                      className="pl-10 h-12 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl cursor-not-allowed opacity-70"
                    />
                  </div>
                </FormField>

                {/* Status */}
                <FormField label="Status" required>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning & Design</SelectItem>
                      <SelectItem value="evacuation">Evacuation</SelectItem>
                      <SelectItem value="demolition">Demolition</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="handover">Handover</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Project Name English */}
                <FormField label="Project Name (English)" required>
                  <Input 
                    placeholder="e.g. Updated Project" 
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                    value={formData.name.english}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, english: e.target.value } })}
                    required
                  />
                </FormField>

                {/* Project Name Arabic */}
                <FormField label="اسم المشروع (عربي)" required>
                  <Input 
                    dir="rtl"
                    placeholder="مثال: مشروع محدث" 
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-right"
                    value={formData.name.arabic}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, arabic: e.target.value } })}
                    required
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Location Section */}
            <FormSection 
              icon={MapPin}
              title="Location Details"
              description="Physical address of the property"
              delay={0.2}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Physical Address */}
                  <FormField label="Physical Address" required>
                    <Textarea 
                      placeholder="Enter the complete physical address of the project (e.g. 456 New St)" 
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl min-h-[120px] resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </FormField>
                  
                  {/* Read Only Coordinates reference */}
                  <div className="bg-[#F5F1ED] dark:bg-gray-800 rounded-xl p-4 border border-[#B39371]/20">
                    <div className="flex items-center gap-2 text-[#4A1B1B] dark:text-[#B39371] mb-2">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs font-medium">Original Coordinates</span>
                    </div>
                    <p className="text-sm font-mono text-gray-500">
                      Cannot be edited post-creation
                    </p>
                  </div>
                </div>

                {/* Decorative Map Preview */}
                <div className="relative group">
                  <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative shadow-inner">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <div className="w-16 h-16 bg-[#B39371]/20 rounded-full blur-xl absolute -inset-4" />
                        <div className="w-12 h-12 bg-[#4A1B1B] rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 shadow-lg">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B39371]" />
                        Locked Location
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Form Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50"
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setLocation('/projects')}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #B39371 1px, transparent 1px),
            linear-gradient(to bottom, #B39371 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </Shell>
  );
}
