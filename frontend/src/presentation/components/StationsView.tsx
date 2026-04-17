import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Save } from "lucide-react";
import { stationService } from "../../data/services/station.service";
import AdminTable from "./AdminTable";
import Modal from "./Modal";

const StationsView: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  // Hardcoded categories based on database seed
  const [categories] = useState([
    { id: 1, name: "Menara Suar" },
    { id: 2, name: "Rambu Suar" },
    { id: 3, name: "Suar Apung" },
    { id: 4, name: "Dolphin" },
    { id: 5, name: "Tiang SBNP" }
  ]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    categoryId: "",
    latitude: "",
    longitude: "",
    powerSource: "",
    yearBuilt: ""
  });

  const fetchStations = async () => {
    setLoading(true);
    try {
      const stationData = await stationService.getLatestStations();
      setStations(stationData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const openModal = (station: any = null) => {
    if (station) {
      setEditingStation(station);
      setFormData({
        id: station.id || station.stationId,
        name: station.name || station.stationName,
        categoryId: categories.find(c => c.name === station.type)?.id.toString() || "",
        latitude: (station.coordinate?.lat || station.latitude).toString(),
        longitude: (station.coordinate?.lng || station.longitude).toString(),
        powerSource: station.powerSource || "",
        yearBuilt: station.yearBuilt || ""
      });
    } else {
      setEditingStation(null);
      setFormData({
        id: "",
        name: "",
        categoryId: "",
        latitude: "",
        longitude: "",
        powerSource: "",
        yearBuilt: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStation(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (editingStation) {
        await stationService.updateStation(formData.id, payload);
      } else {
        await stationService.createStation(payload);
      }
      
      closeModal();
      fetchStations();
    } catch (err) {
      alert("Failed to save station. Check console for details.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete station ${id}?`)) {
      try {
        await stationService.deleteStation(id);
        fetchStations();
      } catch (err) {
        alert("Failed to delete station");
      }
    }
  };

  const columns = [
    {
      header: "DSI / ID",
      render: (s: any) => <span className="text-maritime-accent font-mono">{s.id || s.stationId}</span>
    },
    {
      header: "Station Name",
      render: (s: any) => (
        <div className="flex flex-col">
          <span className="text-white font-bold">{s.name || s.stationName}</span>
          <span className="text-[10px] text-maritime-gray uppercase">{s.type || "SBNP Unit"}</span>
        </div>
      )
    },
    {
      header: "Coordinates",
      render: (s: any) => (
        <div className="flex items-center gap-2 text-xs text-maritime-gray">
          <MapPin size={12} />
          <span>{s.coordinate?.lat || s.latitude}, {s.coordinate?.lng || s.longitude}</span>
        </div>
      )
    },
    {
      header: "Status",
      render: (s: any) => {
        const status = s.status?.label || s.issueStatus || "UNKNOWN";
        const isOff = status === "PADAM";
        return (
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${isOff ? "bg-status-off/20 text-status-off" : "bg-status-normal/20 text-status-normal"}`}>
            {status}
          </span>
        );
      }
    },
    {
      header: "Actions",
      render: (s: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openModal(s)}
            className="p-2 bg-maritime-light hover:bg-maritime-accent/20 hover:text-maritime-accent rounded-lg transition-all"
            title="Edit Station"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(s.id || s.stationId)}
            className="p-2 bg-status-off/10 text-status-off hover:bg-status-off/20 rounded-lg transition-all"
            title="Delete Station"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Stations</h2>
          <p className="text-maritime-gray text-sm">Register, edit, or remove SBNP monitoring units.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-maritime-accent text-maritime-dark font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-maritime-accent/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Station
        </button>
      </div>

      <AdminTable 
        data={stations} 
        columns={columns} 
        isLoading={loading} 
        searchKey="name" 
        searchPlaceholder="Search by station name..."
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingStation ? "Update SBNP Unit" : "Register New SBNP Unit"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">DSI / Station ID</label>
              <input 
                name="id"
                value={formData.id}
                onChange={handleFormChange}
                disabled={!!editingStation}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white disabled:opacity-50" 
                placeholder="e.g. 5901"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Station Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="e.g. Mensu Sorong"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Category</label>
            <select 
              name="categoryId"
              value={formData.categoryId}
              onChange={handleFormChange}
              className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white"
              required
            >
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Latitude</label>
              <input 
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="-0.1234"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Longitude</label>
              <input 
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="131.2345"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Power Source</label>
              <input 
                name="powerSource"
                value={formData.powerSource}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="e.g. Solar Cell"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Year Built</label>
              <input 
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="e.g. 2015"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={closeModal}
              className="flex-1 py-4 bg-transparent hover:bg-white/5 text-maritime-gray font-bold rounded-2xl transition-all border border-transparent hover:border-maritime-light"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={formLoading}
              className="flex-[2] py-4 bg-maritime-accent text-maritime-dark font-extrabold rounded-2xl shadow-lg shadow-maritime-accent/10 hover:shadow-maritime-accent/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-maritime-dark/30 border-t-maritime-dark rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  {editingStation ? "Update Unit" : "Register Unit"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StationsView;
