import React from "react";
import { 
  BarChart3, 
  Map as MapIcon, 
  Users, 
  Download, 
  ChevronRight,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../state/auth.store";

export type AdminTab = "stations" | "reports" | "users" | "export";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { logout } = useAuthStore();
  
  const menuItems = [
    { id: "stations" as AdminTab, label: "Manage Stations", icon: MapIcon },
    { id: "reports" as AdminTab, label: "History Reports", icon: BarChart3 },
    { id: "users" as AdminTab, label: "User Management", icon: Users },
    { id: "export" as AdminTab, label: "Export Data", icon: Download },
  ];

  return (
    <aside className="w-72 bg-maritime-blue border border-maritime-light rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div className="p-6 border-b border-maritime-light bg-black/20">
        <div className="flex items-center gap-3 text-maritime-accent">
          <ShieldCheck size={24} />
          <h2 className="font-bold tracking-wide uppercase text-xs">Admin Control</h2>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-maritime-accent text-maritime-dark shadow-lg shadow-maritime-accent/10" 
                  : "text-maritime-gray hover:bg-maritime-light hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? "text-maritime-dark" : "text-maritime-gray group-hover:text-maritime-accent"} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <ChevronRight 
                size={16} 
                className={`transition-transform duration-300 ${isActive ? "rotate-90 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} 
              />
            </button>
          );
        })}
      </nav>

      <div className="p-6 bg-maritime-dark/30 mt-auto">
        <div className="text-[10px] text-maritime-gray uppercase tracking-widest font-bold opacity-30">
          SBNP Monitor v1.0.0
        </div>
      </div>
      <div className="p-4 border-t border-maritime-light">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-status-off hover:bg-status-off/10 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
