import { useState } from 'react';
import { TopHeader } from '../../components/TopHeader';
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
  Calendar,
  Layers,
  X,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from '../../components/shared/Shell';

interface SubStage {
  id: string;
  name: string;
  cost: string;
  timeline: string;
}

interface Phase {
  id: string;
  name: string;
  cost: string;
  timeline: string;
  subStages: SubStage[];
}

export default function AddProjectStage() {
  const [, setLocation] = useLocation();
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: '1',
      name: 'Excavation & Foundation',
      cost: '125,000.00',
      timeline: 'Nov 01 - Dec 15, 2023',
      subStages: [
        {
          id: '1-1',
          name: 'Site Clearing',
          cost: '15,000.00',
          timeline: 'Nov 01 - Nov 05, 2023'
        }
      ]
    }
  ]);

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: '',
      cost: '',
      timeline: '',
      subStages: []
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter(p => p.id !== id));
  };

  const addSubStage = (phaseId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          subStages: [
            ...p.subStages,
            { id: Date.now().toString(), name: '', cost: '', timeline: '' }
          ]
        };
      }
      return p;
    }));
  };

  const removeSubStage = (phaseId: string, subId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          subStages: p.subStages.filter(s => s.id !== subId)
        };
      }
      return p;
    }));
  };

  return (
    <Shell>
      <TopHeader />
      
      <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32">
        {/* Breadcrumb & Header */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5F1ED] rounded-xl flex items-center justify-center text-[#4A1B1B]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Link href="/projects" className="hover:text-[#B39371] transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-500">Stage</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Add Stage</h1>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Construction Phases</h2>
                <p className="text-sm text-gray-400 mt-1">Define the timeline, costs, and hierarchical structure of your construction process.</p>
              </div>
              <button 
                onClick={addPhase}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F5F1ED] text-[#4A1B1B] rounded-xl text-xs font-bold hover:bg-[#4A1B1B] hover:text-white transition-all group"
              >
                <Plus className="w-4 h-4" />
                Add New Stage
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {phases.map((phase) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={phase.id}
                    className="relative p-8 bg-white border border-gray-100 rounded-[24px] hover:border-[#B39371]/20 transition-all shadow-sm"
                  >
                    <div className="grid grid-cols-12 gap-6 items-end">
                      <div className="col-span-5 space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Stage Name</label>
                        <Input 
                          value={phase.name} 
                          placeholder="e.g. Excavation & Foundation" 
                          className="bg-gray-50/50 border-gray-100 h-12 rounded-xl focus:border-[#4A1B1B]/30 transition-all font-medium"
                          onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, name: e.target.value } : p))}
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Estimated Cost (SAR)</label>
                        <Input 
                          value={phase.cost} 
                          placeholder="0.00" 
                          className="bg-gray-50/50 border-gray-100 h-12 rounded-xl focus:border-[#4A1B1B]/30 transition-all font-bold"
                          onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, cost: e.target.value } : p))}
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Timeline (Range)</label>
                        <div className="relative">
                          <Input 
                            value={phase.timeline} 
                            placeholder="Nov 01 - Dec 15" 
                            className="bg-gray-50/50 border-gray-100 h-12 rounded-xl focus:border-[#4A1B1B]/30 transition-all pr-10 font-medium"
                            onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, timeline: e.target.value } : p))}
                          />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => removePhase(phase.id)}
                          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-stages */}
                    <div className="mt-6 ml-8 space-y-4">
                      <AnimatePresence mode="popLayout">
                        {phase.subStages.map((sub) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            key={sub.id} 
                            className="grid grid-cols-12 gap-6 items-center"
                          >
                            <div className="col-span-4">
                              <Input 
                                value={sub.name} 
                                placeholder="Sub-stage name" 
                                className="bg-white border-gray-100 h-10 rounded-lg focus:border-[#4A1B1B]/30 transition-all text-sm"
                                onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, subStages: p.subStages.map(s => s.id === sub.id ? { ...s, name: e.target.value } : s) } : p))}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input 
                                value={sub.cost} 
                                placeholder="Cost" 
                                className="bg-white border-gray-100 h-10 rounded-lg focus:border-[#4A1B1B]/30 transition-all text-sm font-medium"
                                onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, subStages: p.subStages.map(s => s.id === sub.id ? { ...s, cost: e.target.value } : s) } : p))}
                              />
                            </div>
                            <div className="col-span-4">
                              <Input 
                                value={sub.timeline} 
                                placeholder="Timeline" 
                                className="bg-white border-gray-100 h-10 rounded-lg focus:border-[#4A1B1B]/30 transition-all text-sm font-medium"
                                onChange={(e) => setPhases(phases.map(p => p.id === phase.id ? { ...p, subStages: p.subStages.map(s => s.id === sub.id ? { ...s, timeline: e.target.value } : s) } : p))}
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button 
                                onClick={() => removeSubStage(phase.id, sub.id)}
                                className="p-1.5 text-gray-200 hover:text-red-400 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button 
                        onClick={() => addSubStage(phase.id)}
                        className="flex items-center gap-2 text-[10px] font-bold text-[#B39371] hover:text-[#4A1B1B] transition-colors uppercase tracking-widest mt-2 group"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Sub-stage
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty State / Add Phase Large Button */}
              <button 
                onClick={addPhase}
                className="w-full py-10 bg-white border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-[#B39371]/30 hover:bg-gray-50/30 transition-all group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:scale-110 group-hover:bg-[#F5F1ED] group-hover:text-[#4A1B1B] transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Add Construction Phase</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50/50 p-8 flex items-center justify-end gap-4 border-t border-gray-100">
            <button 
              onClick={() => setLocation('/projects')}
              className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
            >
              Cancel
            </button>
            <button 
              className="px-10 py-3 bg-[#B39371] text-white rounded-xl text-sm font-bold shadow-xl shadow-[#B39371]/20 hover:bg-[#4A1B1B] transition-all flex items-center gap-2 group"
            >
              Add Stage
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
