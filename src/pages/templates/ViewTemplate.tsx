import { useLocation, useRoute } from "wouter";
import { useQuery } from '@tanstack/react-query';
import { TopHeader } from '../../components/TopHeader';
import { Shell } from '../../components/shared/Shell';
import { 
  ChevronLeft, 
  MapPin,
  Ruler,
  Info,
  Check,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  BedDouble,
  Bath,
  Edit,
  Download,
  Home,
  DoorOpen,
  Maximize2,
  Users,
  Coffee,
  Utensils,
  Wind,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Image as ImageIcon,
  Building2,
  Hash,
  Tag,
  DollarSign,
  ArrowLeft,
  Share2,
  Printer,
  Star,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";

interface Template {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  modelType: string;
  sku: string;
  managementFees: string;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  balconyAccess: boolean;
  location: string;
  file: string;
  duelEntrances: boolean;
  familyLounge: boolean;
  guestMajlis: boolean;
  kitchen: boolean;
}

interface TemplateResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: Template;
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subValue, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B39371]/10 to-[#B39371]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-[#B39371]" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        {subValue && <p className="text-[10px] text-gray-400 dark:text-gray-500">{subValue}</p>}
      </div>
    </div>
  </motion.div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, label, active, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={cn(
      "relative overflow-hidden rounded-xl border p-4 transition-all",
      active 
        ? "border-[#B39371] bg-gradient-to-br from-[#B39371]/5 to-transparent dark:from-[#B39371]/10 dark:to-transparent" 
        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          active ? "bg-[#B39371]/10 text-[#B39371]" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {active ? 'Available' : 'Not available'}
          </p>
        </div>
      </div>
      {active ? (
        <CheckCircle className="w-5 h-5 text-[#B39371]" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
      )}
    </div>
    {active && (
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-[#B39371] rounded-full"
      />
    )}
  </motion.div>
);

// Detail Item Component
const DetailItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default function ViewTemplate() {
  const [, params] = useRoute("/templates/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;
  const [imageError, setImageError] = useState(false);

  const { data, isLoading, error } = useQuery<TemplateResponse>({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await api.get(`/template/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#B39371]/20 border-t-[#B39371] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#B39371] animate-pulse" />
                </div>
              </div>
              <div className="text-center mt-6 space-y-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Loading Template</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fetching template details...</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Shell>
        <TopHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Template Not Found</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                The template you're looking for doesn't exist or has been removed.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation('/templates')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Templates
              </motion.button>
            </motion.div>
          </div>
        </div>
      </Shell>
    );
  }

  const template = data.data;
  
  // Construct full image URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const imageUrl = template.file ? (template.file.startsWith('http') ? template.file : `${baseUrl}/${template.file}`) : null;

  const features = [
    { key: 'duelEntrances', label: 'Dual Entrances', icon: DoorOpen, active: template.duelEntrances },
    { key: 'familyLounge', label: 'Family Lounge', icon: Users, active: template.familyLounge },
    { key: 'guestMajlis', label: 'Guest Majlis', icon: Coffee, active: template.guestMajlis },
    { key: 'kitchen', label: 'Kitchen', icon: Utensils, active: template.kitchen },
    { key: 'balconyAccess', label: 'Balcony Access', icon: Wind, active: template.balconyAccess }
  ];

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLocation('/templates')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
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
                      Template Details
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {template.name.english}
                    </h1>
                    <Badge variant="outline" className="text-[#B39371] border-[#B39371]/20">
                      {template.sku}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <Printer className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocation(`/templates/${id}/edit`)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Template
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 group"
              >
                {imageUrl && !imageError ? (
                  <img 
                    src={imageUrl}
                    alt={template.name.english}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">No image available</p>
                  </div>
                )}
                
                {/* Location Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-lg px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B39371] mr-1" />
                    {template.location} VIEW
                  </Badge>
                </div>
              </motion.div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard 
                  icon={Maximize2} 
                  label="Total Area" 
                  value={`${template.size} m²`}
                  subValue="Built-up area"
                  delay={0.1}
                />
                <StatCard 
                  icon={Layers} 
                  label="Total Rooms" 
                  value={template.totalRooms.toString()}
                  subValue="Total spaces"
                  delay={0.15}
                />
                <StatCard 
                  icon={BedDouble} 
                  label="Bedrooms" 
                  value={template.bedrooms.toString()}
                  subValue="Sleeping quarters"
                  delay={0.2}
                />
                <StatCard 
                  icon={Bath} 
                  label="Bathrooms" 
                  value={template.bathrooms.toString()}
                  subValue="Washrooms"
                  delay={0.25}
                />
              </div>

              {/* Features & Amenities */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#B39371]" />
                    Features & Amenities
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <FeatureCard 
                        key={feature.key}
                        icon={feature.icon}
                        label={feature.label}
                        active={feature.active}
                        delay={0.4 + index * 0.05}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Details & Actions */}
            <div className="space-y-6">
              {/* Details Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden  "
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Template Details</h3>
                </div>
                <div className="p-6 space-y-4">
                  <DetailItem icon={Hash} label="SKU" value={template.sku} />
                  <DetailItem icon={Tag} label="Model Type" value={template.modelType} />
                  <DetailItem icon={DollarSign} label="Management Fees" value={template.managementFees} />
                  <DetailItem icon={MapPin} label="Location" value={template.location} />
                  
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Last Updated</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Document Card */}
              {imageUrl && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Template File</h4>
                  </div>
                  <div className="p-6">
                    <a 
                      href={imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-[#F5F1ED] dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                          <ImageIcon className="w-5 h-5 text-[#B39371]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Template Image</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Click to view full size</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#B39371] transition-colors" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#B39371]/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 group-hover:bg-[#B39371]/10 flex items-center justify-center mb-3 mx-auto">
                    <Users className="w-5 h-5 text-[#B39371]" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white text-center">Assign Project</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#B39371]/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F5F1ED] dark:bg-gray-800 group-hover:bg-[#B39371]/10 flex items-center justify-center mb-3 mx-auto">
                    <Copy className="w-5 h-5 text-[#B39371]" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white text-center">Duplicate</p>
                </motion.button>
              </motion.div>

              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">Ready to Use</h4>
                    <p className="text-sm text-white/80">This template is verified and ready for project allocation.</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}