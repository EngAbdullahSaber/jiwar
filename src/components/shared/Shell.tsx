import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Shell({ children }: LayoutProps) {
  const { isExpanded } = useSidebarStore();

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Sidebar />
      <main className={cn(
        "transition-all duration-500",
        isExpanded ? "ps-68" : "ps-20"
      )}>
        {children}
      </main>
    </div>
  );
}
