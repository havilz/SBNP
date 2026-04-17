import React, { useEffect } from "react";
import { 
  Radio, 
  AlertCircle, 
  CheckCircle2,
  Bell,
  User
} from "lucide-react";
import { useStationStore } from "../state/station.store";

import MapView from "../components/MapView";
import LiveFeed from "../components/LiveFeed";
import AuthModal from "../components/AuthModal";
import { useSocketSync } from "../hooks/useSocketSync";

const DashboardPage: React.FC = () => {
  const { stations = [], fetchStations, isLoading } = useStationStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  
  // Initialize Realtime Synchronization
  useSocketSync();

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Statistics Calculation
  const stats = {
    total: stations.length,
    normal: stations.filter(s => s.issueStatus === "NIHIL").length,
    off: stations.filter(s => s.issueStatus === "PADAM").length,
  };

  return (
    <>
    <div className="flex w-full h-screen max-h-screen bg-maritime-dark text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[320px] shrink-0 bg-maritime-blue flex flex-col border-r border-maritime-light min-h-0">
        <div className="p-5 border-b border-maritime-light bg-maritime-dark/50">
          <div className="flex items-center gap-3 text-maritime-accent">
            <Radio className="animate-pulse" size={28} />
            <h1 className="text-xl font-bold tracking-tight">SBNP MONITOR</h1>
          </div>
        </div>

        {/* Live Activity Stream (Data only) */}
        <LiveFeed />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-maritime-light px-8 flex items-center justify-between bg-maritime-blue z-10">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-maritime-gray">Total Unit:</span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-status-normal" />
              <span className="text-sm text-maritime-gray">Normal:</span>
              <span className="font-bold text-status-normal">{stats.normal}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-status-off" />
              <span className="text-sm text-maritime-gray">Off/Padam:</span>
              <span className="font-bold text-status-off">{stats.off}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full hover:bg-maritime-light text-maritime-gray relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-status-off rounded-full"></span>
             </button>
             <button 
                onClick={() => setIsAuthModalOpen(true)}
                title="Admin Authentication"
                className="w-9 h-9 rounded-full bg-maritime-accent/10 hover:bg-maritime-accent/20 flex items-center justify-center text-maritime-accent border border-maritime-accent/30 transition-all cursor-pointer"
             >
                <User size={18} />
             </button>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 bg-maritime-dark relative overflow-hidden">
          {/* Map Component */}
          <MapView />

          {/* Legend Overlay */}
          <div className="absolute bottom-8 right-8 z-10 bg-maritime-dark p-4 rounded-xl border border-maritime-light shadow-md">
            <h4 className="text-xs font-bold text-maritime-gray mb-3 uppercase tracking-wider">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-status-normal"></div>
                <span className="text-sm">Beroperasi Normal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-status-off animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                <span className="text-sm">Padam/Error</span>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center gap-3 bg-maritime-blue/90 border border-maritime-light shadow-[0_0_15px_rgba(30,41,59,0.8)] backdrop-blur-md px-6 py-3 rounded-full text-maritime-accent text-sm font-bold">
               <div className="w-4 h-4 border-2 border-maritime-accent border-t-transparent rounded-full animate-spin"></div>
               <span className="tracking-wide">Synchronizing Stream...</span>
            </div>
          )}
        </div>

      </main>
    </div>

    {/* Autentikasi Modal */}
    <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
    />
    </>

  );
};

export default DashboardPage;
