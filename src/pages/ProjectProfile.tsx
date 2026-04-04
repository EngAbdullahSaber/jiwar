import { TopHeader } from '../components/TopHeader';
import { Link } from "wouter";
import { 
  Building2, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  Download,
  Trash2,
  ArrowUpRight,
  Maximize2,
  Info,
  Wallet,
  Compass
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shell } from '../components/shared/Shell';

const projectStages = [
  {
    title: "Foundation & Structure",
    description: "Foundation work, piling, and reinforced concrete framework for all floors.",
    status: "Completed",
    date: "Jan 2024 - Apr 2024",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Exterior & Facade",
    description: "Installation of glass windows, external painting, and cladding works.",
    status: "In Progress - 75%",
    date: "May 2024 - Sep 2024",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    title: "Interior Fit-out",
    description: "Flooring, wall finishing, electrical fixtures, and plumbing installation.",
    status: "Upcoming",
    date: "Oct 2024 - Feb 2025",
    icon: Compass,
    color: "text-gray-400",
    bgColor: "bg-gray-100"
  },
  {
    title: "Final Inspection & Handover",
    description: "Final quality checks, safety certifications, and cleaning before unit delivery.",
    status: "Planned",
    date: "Mar 2025",
    icon: Building2,
    color: "text-gray-300",
    bgColor: "bg-gray-50"
  }
];

const unitTemplates = [
  { type: "Type A - Studio", rooms: "1 Bedroom • 1 Bath", area: "650 sq ft", price: "SAR 285K - 310K", count: 24, available: 18, sold: 6 },
  { type: "Type B - Deluxe", rooms: "2 Bedrooms • 2 Baths", area: "1,050 sq ft", price: "SAR 425K - 475K", count: 32, available: 22, sold: 10 },
  { type: "Type C - Premium", rooms: "3 Bedrooms • 2.5 Baths", area: "1,450 sq ft", price: "SAR 625K - 865K", count: 20, available: 14, sold: 6 },
  { type: "Type D - Penthouse", rooms: "4 Bedrooms • 3 Baths", area: "2,200 sq ft", price: "SAR 1.2M - $1.5M", count: 4, available: 3, sold: 1 },
];

export default function ProjectProfile() {
  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-[1600px] mx-auto space-y-8 pb-32">
        {/* Breadcrumb & Header */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5F1ED] rounded-xl flex items-center justify-center text-[#4A1B1B]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Link href="/projects" className="hover:text-[#B39371] transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-500">Project Profile</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Project Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Gallery, Stages, Templates, Map */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Project Gallery - PREMIUM GRID */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#4A1B1B] pl-4">Project Gallery</h2>
              <div className="grid grid-cols-12 gap-4 aspect-[21/9]">
                <div className="col-span-4 grid grid-rows-3 gap-4">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl shadow-sm" alt="Gallery 1" />
                  <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl shadow-sm" alt="Gallery 2" />
                  <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl shadow-sm" alt="Gallery 3" />
                </div>
                <div className="col-span-8 relative">
                  <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover rounded-3xl shadow-md border-4 border-white" alt="Main Gallery" />
                  <button className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2">
                     <Maximize2 className="w-4 h-4" /> Expand Gallery
                  </button>
                </div>
              </div>
            </section>

            {/* Construction Stages */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#4A1B1B] pl-4">Construction Stages</h2>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gray-400">Overall Progress</span>
                    <span className="text-sm font-bold text-[#4A1B1B]">82%</span>
                  </div>
                  <Progress value={82} className="h-2 w-48 bg-gray-100" />
                </div>
              </div>

              <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {projectStages.map((stage, i) => (
                  <div key={i} className="relative pl-14 flex items-start gap-6 group">
                    <div className={cn("absolute left-0 p-3 rounded-full z-10 shadow-sm border-4 border-white transition-transform group-hover:scale-110", stage.bgColor)}>
                      <stage.icon className={cn("w-5 h-5", stage.color)} />
                    </div>
                    <div className="flex-1 pb-6 border-b border-gray-50 last:border-none">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{stage.title}</h3>
                        <span className="text-[10px] font-bold text-gray-400">{stage.date}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 leading-relaxed">{stage.description}</p>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", stage.color)}>
                        {stage.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Unit Templates */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#4A1B1B] pl-4">Unit Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unitTemplates.map((unit, i) => (
                  <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#B39371]/30 hover:shadow-xl hover:shadow-[#4A1B1B]/5 transition-all bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{unit.type}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{unit.rooms}</p>
                      </div>
                      <Badge variant="secondary" className="bg-[#F5F1ED] text-[#4A1B1B] text-[10px] font-bold rounded-lg px-2 py-0.5 border-none">
                        {unit.count} Apartment
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Area</p>
                        <p className="text-xs font-bold text-gray-700">{unit.area}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Price Range</p>
                        <p className="text-xs font-bold text-gray-900">{unit.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="text-[10px] font-bold">
                        <span className="text-gray-900">{unit.available} Available</span>
                        <span className="text-gray-300 mx-2">•</span>
                        <span className="text-gray-400">{unit.sold} Sold</span>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#B39371] uppercase tracking-widest group/btn hover:text-[#4A1B1B] transition-colors">
                        View Details
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Project Location - MAP */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#4A1B1B] pl-4">Project Location</h2>
              <div className="relative aspect-video rounded-[24px] overflow-hidden border border-gray-100 bg-[#E5E9EC]">
                {/* Simplified Map Visualization */}
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale" alt="Map" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#4A1B1B]/10 rounded-full animate-ping absolute -inset-0"></div>
                    <div className="w-12 h-12 bg-[#4A1B1B] rounded-2xl rounded-bl-none rotate-45 flex items-center justify-center text-white shadow-xl relative z-10 border-4 border-white">
                      <MapPin className="w-6 h-6 -rotate-45" />
                    </div>
                  </div>
                </div>

                <button className="absolute bottom-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg">
                  <Maximize2 className="w-4 h-4" /> Expand Map
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Info Cards & Sidebar Content */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Project Information */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Info className="w-5 h-5 text-[#4A1B1B]" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Project Information</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SAK Number</p>
                  <p className="text-sm font-bold text-gray-900">SAK-2024-00842</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Apartment</p>
                  <p className="text-sm font-bold text-gray-900">80 Apartments</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plot Area</p>
                  <p className="text-sm font-bold text-gray-900">12,500 m²</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Building Height</p>
                  <p className="text-sm font-bold text-gray-900">28 Floors</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion Date</p>
                  <p className="text-sm font-bold text-gray-900">March 2025</p>
                </div>
              </div>
            </section>

            {/* Pricing & Budget */}
            <section className="bg-[#4A1B1B] p-8 rounded-[32px] shadow-2xl shadow-[#4A1B1B]/10 space-y-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Pricing & Budget</h3>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Project Value</p>
                  <p className="text-2xl font-bold">SAR 42.8M</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    <span>Current Sales Revenue</span>
                    <span className="text-white">21.5%</span>
                  </div>
                  <p className="text-lg font-bold">SAR 9.2M</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[21.5%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Budget</p>
                    <p className="text-sm font-bold">SAR 28.5M</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Spent</p>
                    <p className="text-sm font-bold">SAR 17.6M</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Document Lists Cards */}
            <div className="space-y-6">
              {/* Project Licenses */}
              <section className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Licenses</h3>
                  <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors flex items-center gap-1.5">
                    <Download className="w-3 h-3" /> DOWNLOAD
                  </button>
                </div>

                <div className="space-y-3">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-[#B39371]/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-800">Building_Permit_2024.pdf</p>
                          <p className="text-[8px] text-gray-400 font-medium">2.4 MB • Oct 24</p>
                        </div>
                      </div>
                      <Trash2 className="w-3.5 h-3.5 text-gray-200 group-hover:text-red-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Blue Prints */}
              <section className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                 <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blue Prints</h3>
                  <button className="text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors flex items-center gap-1.5">
                    <Download className="w-3 h-3" /> DOWNLOAD
                  </button>
                </div>

                <div className="space-y-3">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-[#B39371]/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-800">Architectural_Plan_B.pdf</p>
                          <p className="text-[8px] text-gray-400 font-medium">10.2 MB • Oct 20</p>
                        </div>
                      </div>
                      <Trash2 className="w-3.5 h-3.5 text-gray-200 group-hover:text-red-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </Shell>
  );
}
