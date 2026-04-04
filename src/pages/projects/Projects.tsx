import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopHeader } from '../../components/TopHeader';
import { StatCard } from '../../components/shared/StatCard';
import { DataTable } from '../../components/shared/DataTable';
import type { Column } from '../../components/shared/DataTable';
import { FilterBar } from '../../components/shared/FilterBar';
import type { FilterField } from '../../components/shared/FilterBar';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Shell } from '../../components/shared/Shell';
import { 
  Building2, 
  MapPin, 
  Plus,
  Eye,
  Layers,
  Pencil,
  MoreVertical,
  Wallet,
  FileEdit,
  TrendingUp,
  Sparkles,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  FolderOpen,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  name: {
    arabic: string;
    english: string;
  };
  projectIdentity: string;
  address: string;
  budgetSum: number;
  lastStage: string | null;
}

interface ProjectsResponse {
  code: number;
  message: { arabic: string; english: string };
  data: Project[];
  statics: {
    totalBudget: number;
    evacuationCount: number;
    demolitionCount: number;
  };
  totalItems: number;
  totalPages: number;
}



// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    CONSTRUCTION: { 
      color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", 
      icon: Clock,
      label: "Construction"
    },
    PLANNING: { 
      color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20", 
      icon: FileText,
      label: "Planning"
    },
    HANDOVER: { 
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", 
      icon: CheckCircle2,
      label: "Handover"
    },
    "ON HOLD": { 
      color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", 
      icon: AlertCircle,
      label: "On Hold"
    }
  };

  const config = statusConfig[status] || statusConfig.PLANNING;
  const Icon = config.icon;

  return (
    <Badge className={cn("rounded-lg px-3 py-1 text-xs font-medium border", config.color)}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </Badge>
  );
};



export default function Projects() {
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ['projects', currentPage, pageSize, filters.search, filters.status],
    queryFn: async () => {
      const res = await api.get('/project', {
        params: {
          page: currentPage,
          pageSize,
          search: filters.search || undefined,
          status: filters.status !== 'all' ? filters.status : undefined
        }
      });
      return res.data;
    }
  });

  const filterFields: FilterField[] = [
    {
      type: 'search',
      label: 'Search Project',
      placeholder: 'Search by project name or ID...',
      key: 'search'
    },
    {
      type: 'select',
      label: 'Status',
      placeholder: 'All Statuses',
      key: 'status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'CONSTRUCTION', label: 'Construction' },
        { value: 'PLANNING', label: 'Planning' },
        { value: 'HANDOVER', label: 'Handover' },
        { value: 'ON HOLD', label: 'On Hold' }
      ]
    }
  ];

  const columns: Column<Project>[] = [
    {
      header: "Project ID",
      accessorKey: "projectIdentity",
      className: "text-sm font-medium text-[#B39371]"
    },
    {
      header: "Project Name",
      cell: (p) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name?.english || 'N/A'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="rtl">{p.name?.arabic || 'N/A'}</p>
        </div>
      )
    },
    {
      header: "Location",
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{p.address || 'N/A'}</span>
        </div>
      )
    },
    {
      header: "Status",
      cell: (p) => <StatusBadge status={p.lastStage || "PLANNING"} />
    },
    {
      header: "Budget",
      cell: (p) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          SAR {p.budgetSum?.toLocaleString() || 0}
        </span>
      )
    },
    {
      header: "Progress",
      cell: (p) => {
        const progress = Math.floor(Math.random() * 100); // Replace with actual progress
        return (
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="flex-1">
              <Progress value={progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
          </div>
        );
      }
    },
    {
      header: "Sold",
      cell: () => <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>,
      className: "text-center",
      headerClassName: "text-center"
    },
    {
      header: "Reserved",
      cell: () => <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>,
      className: "text-center",
      headerClassName: "text-center"
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      cell: (p) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/projects/${p.id}`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="View Profile">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/projects/${p.id}/stages`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="Manage Stages">
              <Layers className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/projects/${p.id}/media`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#B39371] transition-colors" title="Add Media">
              <FolderOpen className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/projects/${p.id}/edit`}>
            <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
          <button className="p-2 hover:bg-[#F5F1ED] dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#4A1B1B] dark:hover:text-[#B39371] transition-colors" title="More">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const projects = response?.data || [];
  const statics = response?.statics;
  const totalProjects = response?.totalItems || 0;
  const completedProjects = projects.filter(p => p.lastStage === 'HANDOVER').length;
  const inProgressProjects = projects.filter(p => p.lastStage === 'CONSTRUCTION').length;

  return (
    <Shell>
      <TopHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] rounded-xl blur-lg opacity-50" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A1B1B] to-[#6B2727] shadow-lg flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-[#B39371]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B39371]" />
                    <p className="text-xs font-medium text-[#B39371] uppercase tracking-wider">
                      Project Management
                    </p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Project Management List
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage and track your construction lifecycle through the central project ledger
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                
                <Link href="/projects/new">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-md text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Create Project
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={Building2}
              label="TOTAL PROJECTS"
              value={totalProjects.toLocaleString()}
              subValue="Active projects"
              trend="+12%"
              trendDirection="up"
              color="from-blue-500 to-blue-600"
            />
            <StatCard 
              icon={Wallet}
              label="TOTAL BUDGET"
              value={`${statics?.totalBudget?.toLocaleString() || "0"} SAR`}
              subValue="Across all phases"
              color="from-emerald-500 to-emerald-600"
            />
            <StatCard 
              icon={FileEdit}
              label="EVACUATION COUNT"
              value={statics?.evacuationCount?.toString() || "0"}
              subValue="Total evacuations"
              color="from-amber-500 to-amber-600"
              progress={45}
            />
            <StatCard 
              icon={TrendingUp}
              label="DEMOLITION COUNT"
              value={statics?.demolitionCount?.toString() || "0"}
              subValue="In progress"
              color="from-purple-500 to-purple-600"
              progress={30}
            />
          </div>

          {/* Filter Bar */}
             <FilterBar 
              fields={filterFields} 
              values={filters} 
              onChange={(key, value) => {
                setFilters(prev => ({ ...prev, [key]: value }));
                setCurrentPage(1);
              }} 
            />
 
          <DataTable 
            columns={columns} 
            data={projects}
            isLoading={isLoading}
            loadingMessage="Loading projects..."
            currentPage={currentPage}
            totalPages={response?.totalPages}
            totalItems={response?.totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {filters.search || filters.status !== 'all' 
                  ? 'Try adjusting your search or filters to find what you\'re looking for'
                  : 'Get started by creating your first project'}
              </p>
              {!filters.search && filters.status === 'all' && (
                <Link href="/projects/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A1B1B] to-[#6B2727] text-white rounded-xl text-sm font-medium shadow-lg shadow-[#4A1B1B]/20 hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5" />
                    Create Project
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Shell>
  );
}