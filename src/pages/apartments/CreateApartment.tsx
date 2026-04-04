import { useState } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  Building,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  FileText,
  Ruler,
  Tags,
  Link as LinkIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaginatedSelect } from '../../components/shared/PaginatedSelect';
import { FormActions } from '../../components/shared/FormActions';
import { Shell } from '../../components/shared/Shell';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import DatePicker from '../../components/shared/DatePicker';

// Form Section Component
const FormSection = ({ icon: Icon, title, description, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
  >
    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-20" />
          <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
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
const FormField = ({ label, required = false, children, error, description }: any) => (
  <div className="space-y-2">
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label} {required && <span className="text-[#B39371]">*</span>}
      </Label>
      {description && <span className="text-xs text-gray-400">{description}</span>}
    </div>
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

export default function CreateApartment() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    mainName: { arabic: "", english: "" },
    secondaryName: { arabic: "", english: "" },
    floorNumber: 1,
    buildingOrBlock: "",
    basePrice: "",
    apartmentType: "residential",
    isAvailable: true,
    serialNumber: "",
    accountNumber: "",
    subscriptionNumber: "",
    size: "",
    ownerStatus: "owned",
    status: "available",
    requestDate: "",
    requestNumber: "",
    projectId: "",
    meterNumber: "",
    templateId: "",
    projectSakPdfUrl: "",
    apartmentSakPdfUrl: "",
    apartmentSubDivisionPdfUrl: ""
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        floorNumber: Number(data.floorNumber),
        projectId: Number(data.projectId),
        templateId: Number(data.templateId),
        meterNumber: Number(data.meterNumber) || 0
      };
      const response = await api.post('/apartment', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Apartment created successfully", {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#10b981', color: '#fff' }
      });
      setLocation('/apartments');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create apartment", {
        icon: '❌',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainName.english || !formData.mainName.arabic || !formData.projectId || !formData.templateId) {
      toast.error("Please fill all required fields", { 
        icon: '⚠️',
        style: { borderRadius: '1rem', background: '#ef4444', color: '#fff' } 
      });
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Link 
                href="/apartments" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-md blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-md bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-[#B39371]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#B39371]" />
                  <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                    Create Apartment
                  </p>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Apartment
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add an individual apartment unit explicitly mapped to a project
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Identification Section */}
            <FormSection 
              icon={FileText}
              title="Identification Details"
              description="Basic names, identifiers, and serial codes"
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label="Main Name (English)" required>
                  <Input 
                    placeholder="e.g. Apartment 101"
                    value={formData.mainName.english}
                    onChange={(e) => setFormData({ ...formData, mainName: { ...formData.mainName, english: e.target.value } })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                    required
                  />
                </FormField>
                <FormField label="الاسم الرئيسي (عربي)" required>
                  <Input 
                    dir="rtl"
                    placeholder="مثال: شقة 101"
                    value={formData.mainName.arabic}
                    onChange={(e) => setFormData({ ...formData, mainName: { ...formData.mainName, arabic: e.target.value } })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                    required
                  />
                </FormField>
                
                <FormField label="Secondary Name / Suite (English)">
                  <Input 
                    placeholder="e.g. Suite A"
                    value={formData.secondaryName.english}
                    onChange={(e) => setFormData({ ...formData, secondaryName: { ...formData.secondaryName, english: e.target.value } })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
                <FormField label="الاسم الثانوي (عربي)">
                  <Input 
                    dir="rtl"
                    placeholder="مثال: الجناح الأول"
                    value={formData.secondaryName.arabic}
                    onChange={(e) => setFormData({ ...formData, secondaryName: { ...formData.secondaryName, arabic: e.target.value } })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-right"
                  />
                </FormField>

                <FormField label="Serial Number">
                  <Input 
                    placeholder="e.g. SN-001"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                 <FormField label="Account Number">
                  <Input 
                    placeholder="e.g. ACC-001"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
                
                 <FormField label="Subscription Number">
                  <Input 
                    placeholder="e.g. SUB-001"
                    value={formData.subscriptionNumber}
                    onChange={(e) => setFormData({ ...formData, subscriptionNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Structure & Mapping Section */}
            <FormSection 
              icon={Ruler}
              title="Locational & Metrical Stats"
              description="Floor mapping, footprint sizing, and structural ties"
              delay={0.2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField label="Building Or Block">
                  <Input 
                    placeholder="e.g. Block A"
                    value={formData.buildingOrBlock}
                    onChange={(e) => setFormData({ ...formData, buildingOrBlock: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Floor Number">
                  <Input 
                    type="number"
                    placeholder="e.g. 1"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Size (Sqm)">
                  <Input 
                    placeholder="e.g. 120"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
                
                <FormField label="Meter Number">
                  <Input 
                    type="number"
                    step="any"
                    placeholder="e.g. 12345.67"
                    value={formData.meterNumber}
                    onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Linked Project" required>
                  <PaginatedSelect
                    apiEndpoint="/project"
                    queryKey="projects-paginated"
                    value={formData.projectId.toString()}
                    onChange={(val) => setFormData({ ...formData, projectId: val })}
                    placeholder="Select Linked Project"
                    searchPlaceholder="Search projects..."
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((project: any) => ({
                        value: project.id,
                        label: project.name?.english || project.name?.arabic || `Project #${project.id}`,
                      }));
                    }}
                  />
                </FormField>

                <FormField label="Linked Template" required>
                  <PaginatedSelect
                    apiEndpoint="/template"
                    queryKey="templates-paginated"
                    value={formData.templateId.toString()}
                    onChange={(val) => setFormData({ ...formData, templateId: val })}
                    placeholder="Select Blueprint Template"
                    searchPlaceholder="Search templates..."
                    mapResponseToOptions={(pageData) => {
                      const data = pageData.data || [];
                      return data.map((template: any) => ({
                        value: template.id,
                        label: template.name?.english || template.name?.arabic || `Template #${template.id}`,
                      }));
                    }}
                  />
                </FormField>

              </div>
            </FormSection>

            {/* Financial & Status Section */}
            <FormSection 
              icon={Tags}
              title="Economics & Status"
              description="Listing details, requests, and ownership"
              delay={0.3}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FormField label="Base Price (SAR)">
                  <Input 
                    placeholder="e.g. 250000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Apartment Type">
                  <Select 
                    value={formData.apartmentType} 
                    onValueChange={(val) => setFormData({ ...formData, apartmentType: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Owner Status">
                  <Select 
                    value={formData.ownerStatus} 
                    onValueChange={(val) => setFormData({ ...formData, ownerStatus: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="company_owned">Company Owned</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Status">
                   <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md">
                      <SelectValue placeholder="Select Overall Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Request Date">
                  <DatePicker 
                    value={formData.requestDate}
                    onChange={(date) => setFormData({ ...formData, requestDate: date })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
                
                <FormField label="Request Number">
                  <Input 
                    placeholder="e.g. REQ-001"
                    value={formData.requestNumber}
                    onChange={(e) => setFormData({ ...formData, requestNumber: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <div className="flex items-center gap-4 py-4 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800 md:col-span-2">
                  <div className="flex-1">
                    <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-1 block">
                      Currently Available?
                    </Label>
                    <span className="text-xs text-gray-500">Toggle if this unit is currently available for purchase or rental.</span>
                  </div>
                  <Switch 
                    checked={formData.isAvailable}
                    onCheckedChange={(val) => setFormData({ ...formData, isAvailable: val })}
                    className="data-[state=checked]:bg-[#B39371]"
                  />
                </div>

              </div>
            </FormSection>

            {/* Attachments */}
            <FormSection 
              icon={LinkIcon}
              title="Official Documents (URLs)"
              description="Provide paths or URLs to the official PDFs"
              delay={0.4}
            >
              <div className="grid grid-cols-1 gap-6">
                <FormField label="Project Sak PDF URL">
                  <Input 
                    placeholder="e.g. uploads/project-sak.pdf"
                    value={formData.projectSakPdfUrl}
                    onChange={(e) => setFormData({ ...formData, projectSakPdfUrl: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Apartment Sak PDF URL">
                  <Input 
                    placeholder="e.g. uploads/apartment-sak.pdf"
                    value={formData.apartmentSakPdfUrl}
                    onChange={(e) => setFormData({ ...formData, apartmentSakPdfUrl: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>

                <FormField label="Apartment Sub Division PDF URL">
                  <Input 
                    placeholder="e.g. uploads/subdivision.pdf"
                    value={formData.apartmentSubDivisionPdfUrl}
                    onChange={(e) => setFormData({ ...formData, apartmentSubDivisionPdfUrl: e.target.value })}
                    className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormActions
              onCancel={() => setLocation('/apartments')}
              isSubmitting={createMutation.isPending}
              submitText="Create Apartment"
              submittingText="Creating..."
              align="between"
            />
          </form>
        </div>
      </div>
    </Shell>
  );
}
