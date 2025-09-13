import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HTWSidebar } from './HTWSidebar';
import hawaiianHeroBg from '@/assets/hawaiian-hero-bg.jpg';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${hawaiianHeroBg})`,
            filter: 'brightness(0.7)'
          }}
        />
        
        {/* Background Overlay */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-ocean-primary/30 via-tropical-light/20 to-sunset-coral/30" />

        {/* Sidebar */}
        <HTWSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors" />
              <div>
                <h1 className="text-xl font-poppins font-bold text-white">
                  HTW Network Dashboard
                </h1>
                <p className="text-white/70 text-sm">
                  Expand Hawaii's Tech Community
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">Network Health</p>
                <p className="text-white/70 text-xs">Growing Strong</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-lg">🌺</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}