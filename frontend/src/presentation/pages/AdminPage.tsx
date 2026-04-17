import React from "react";
import { LogOut, ShieldAlert, Home } from "lucide-react";
import { useAuthStore } from "../state/auth.store";
import { useNavigate } from "react-router-dom";
import AdminSidebar, { AdminTab } from "../components/AdminSidebar";
import StationsView from "../components/StationsView";
import UsersView from "../components/UsersView";
import ReportsView from "../components/ReportsView";
import ExportView from "../components/ExportView";

const AdminPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<AdminTab>("stations");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "stations":
        return <StationsView />;
      case "reports":
        return <ReportsView />;
      case "users":
        return <UsersView />;
      case "export":
        return <ExportView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-maritime-dark text-white p-6 gap-6">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-maritime-blue p-5 rounded-2xl border border-maritime-light shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-maritime-accent/10 p-2.5 rounded-xl border border-maritime-accent/20 text-maritime-accent">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SBNP Admin Panel</h1>
            <p className="text-maritime-gray text-xs mt-0.5">Logged in as: <span className="text-white font-semibold">{user?.username}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-black/30 hover:bg-maritime-light rounded-xl transition-all border border-transparent hover:border-maritime-gray"
          >
            <Home size={16} />
            Dashboard
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-status-off/10 text-status-off hover:bg-status-off/20 border border-status-off/20 rounded-xl transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 bg-maritime-blue border border-maritime-light rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
          {/* Content will be dynamic */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminPage;
