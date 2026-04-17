import React from "react";
import { LogOut, ShieldAlert, Home } from "lucide-react";
import { useAuthStore } from "../state/auth.store";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-maritime-dark text-white p-8">
      
      <header className="flex justify-between items-center bg-maritime-blue p-6 rounded-2xl border border-maritime-light mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-maritime-accent/20 p-3 rounded-xl border border-maritime-accent/30 text-maritime-accent">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SBNP Admin Panel</h1>
            <p className="text-maritime-gray text-sm mt-1">Logged in as: <span className="text-white font-semibold">{user?.username}</span> [{user?.role}]</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={goToDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-maritime-light rounded-lg transition-colors border border-transparent hover:border-maritime-gray"
          >
            <Home size={18} />
            Monitoring Dashboard
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-status-off/10 text-status-off hover:bg-status-off/20 border border-status-off/30 hover:border-status-off/50 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 bg-maritime-blue border border-maritime-light rounded-2xl p-8 flex items-center justify-center flex-col relative overflow-hidden">
        {/* Placeholder Content */}
        <div className="text-center space-y-4 relative z-10">
          <ShieldAlert size={64} className="mx-auto text-maritime-gray/30" />
          <h2 className="text-3xl font-bold text-maritime-gray/50">Maintenance Area</h2>
          <p className="text-maritime-gray/40 max-w-lg mx-auto">
            Halaman ini didedikasikan khusus untuk pengaturan alat SBNP, data mentah, dan konfigurasi sistem (akan dikembangkan pada fase berikutnya).
          </p>
        </div>


      </main>

    </div>
  );
};

export default AdminPage;
