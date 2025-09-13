import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Building2, 
  Map, 
  Users, 
  Home,
  LogOut,
  Calendar
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    color: "ocean-primary"
  },
  {
    title: "Geographic",
    url: "/geographic",
    icon: Map,
    color: "tropical-light"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    color: "volcanic-light"
  }
];

const entityItems = [
  {
    title: "Industries",
    url: "/industries",
    icon: Building2,
    color: "sunset-coral"
  },
  {
    title: "Companies",
    url: "/companies",
    icon: Building2,
    color: "tropical-primary"
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
    color: "plumeria-light"
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    color: "plumeria-primary"
  }
];

export function HTWSidebar() {
  const { signOut, user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (isActiveRoute: boolean, color: string) => {
    if (isActiveRoute) {
      return `bg-white/20 text-white shadow-lg`;
    }
    return `text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200`;
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} glass-sidebar border-0`} collapsible="icon">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-lg">🌺</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-poppins font-bold text-white text-lg">HTW</h2>
              <p className="text-white/60 text-xs">Network Dashboard</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs font-medium uppercase tracking-wider px-3 pb-2">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActiveRoute = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClasses(isActiveRoute, item.color)}
                      >
                        <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Entities Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-white/60 text-xs font-medium uppercase tracking-wider px-3 pb-2">
            {!isCollapsed && "Entities"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {entityItems.map((item) => {
                const isActiveRoute = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClasses(isActiveRoute, item.color)}
                      >
                        <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer with User Profile & Sign Out */}
        <div className="mt-auto p-4 border-t border-white/10">
          {!isCollapsed ? (
            <>
              <div className="glass-card p-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sunset-primary to-tropical-primary flex items-center justify-center text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-white/60">HTW Admin</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white/60 text-xs font-medium">
                Where Tech Meets Hawaii
              </p>
              <p className="text-white/40 text-xs mt-1">
                HTW Network © 2025
              </p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}