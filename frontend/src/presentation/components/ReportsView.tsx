import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Save } from "lucide-react";
import { reportService } from "../../data/services/report.service";
import { stationService } from "../../data/services/station.service";
import AdminTable from "./AdminTable";
import Modal from "./Modal";

const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    stationId: "",
    reportedAt: new Date().toISOString().split('T')[0],
    conditionPercent: "100",
    issueStatus: "NIHIL",
    issueDuration: "0",
    issueCause: "",
    note: ""
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [reportData, stationData] = await Promise.all([
        reportService.getLatestReports(),
        stationService.getLatestStations()
      ]);
      setReports(reportData);
      setStations(stationData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openModal = (report: any = null) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        stationId: report.stationId,
        reportedAt: new Date(report.reportedAt).toISOString().split('T')[0],
        conditionPercent: (report.conditionPercent || 100).toString(),
        issueStatus: report.issueStatus,
        issueDuration: (report.issueDuration || 0).toString(),
        issueCause: report.issueCause || "",
        note: report.note || ""
      });
    } else {
      setEditingReport(null);
      setFormData({
        stationId: "",
        reportedAt: new Date().toISOString().split('T')[0],
        conditionPercent: "100",
        issueStatus: "NIHIL",
        issueDuration: "0",
        issueCause: "",
        note: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        conditionPercent: parseInt(formData.conditionPercent),
        issueDuration: parseInt(formData.issueDuration),
        reportedAt: new Date(formData.reportedAt).toISOString()
      };

      if (editingReport) {
        await reportService.updateReport(editingReport.id, payload);
      } else {
        await reportService.createReport(payload);
      }
      
      closeModal();
      fetchReports();
    } catch (err) {
      alert("Failed to save report.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this condition report?")) {
      try {
        await reportService.deleteReport(id);
        fetchReports();
      } catch (err) {
        alert("Failed to delete report.");
      }
    }
  };

  const columns = [
    {
      header: "Station",
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="text-maritime-accent font-bold uppercase text-[10px] tracking-widest">{r.stationId}</span>
          <span className="text-white font-semibold">{r.stationName}</span>
        </div>
      )
    },
    {
      header: "Report Date",
      render: (r: any) => (
        <div className="flex items-center gap-2 text-xs text-maritime-gray">
          <Calendar size={12} />
          <span>{new Date(r.reportedAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: "Condition",
      render: (r: any) => (
        <div className="flex items-center gap-2">
           <div className={`w-8 h-1 rounded-full ${r.conditionPercent < 50 ? "bg-status-off" : r.conditionPercent < 90 ? "bg-status-warning" : "bg-status-normal"}`} />
           <span className="text-xs font-mono">{r.conditionPercent}%</span>
        </div>
      )
    },
    {
      header: "Status",
      render: (r: any) => {
        const isOff = r.issueStatus === "PADAM";
        const isWarning = r.issueStatus !== "NIHIL" && !isOff;
        return (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border 
            ${isOff ? "bg-status-off/10 text-status-off border-status-off/20" : 
              isWarning ? "bg-status-warning/10 text-status-warning border-status-warning/20" : 
              "bg-status-normal/10 text-status-normal border-status-normal/20"}`}>
            {r.issueStatus}
          </span>
        );
      }
    },
    {
      header: "Note",
      render: (r: any) => (
        <span className="text-[11px] text-maritime-gray italic max-w-xs block truncate" title={r.note}>
          {r.note || "-"}
        </span>
      )
    },
    {
      header: "Actions",
      render: (r: any) => (
        <div className="flex items-center gap-2">
           <button 
            onClick={() => openModal(r)}
            className="p-2 bg-maritime-light hover:bg-maritime-accent/20 hover:text-maritime-accent rounded-lg transition-all"
            title="Edit Report"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(r.id)}
            className="p-2 bg-status-off/10 text-status-off hover:bg-status-off/20 rounded-lg transition-all"
            title="Delete Report"
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
          <h2 className="text-2xl font-bold tracking-tight">History Reports</h2>
          <p className="text-maritime-gray text-sm">Manage and review operational status reports.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-maritime-accent text-maritime-dark font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-maritime-accent/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      <AdminTable 
        data={reports} 
        columns={columns} 
        isLoading={loading} 
        searchKey="stationName"
        searchPlaceholder="Search by station name..."
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingReport ? "Update Condition Report" : "New Condition Report"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Target Station</label>
              <select 
                name="stationId"
                value={formData.stationId}
                onChange={handleFormChange}
                disabled={!!editingReport}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white disabled:opacity-50"
                required
              >
                <option value="">Select SBNP Unit...</option>
                {stations.map(s => (
                  <option key={s.id || s.stationId} value={s.id || s.stationId}>
                    {s.id || s.stationId} - {s.name || s.stationName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Report Date</label>
              <input 
                name="reportedAt"
                type="date"
                value={formData.reportedAt}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Issue Status</label>
              <select 
                name="issueStatus"
                value={formData.issueStatus}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white font-bold"
                required
              >
                <option value="NIHIL">NIHIL (OPERATIONAL)</option>
                <option value="PADAM">PADAM (OFF)</option>
                <option value="RUSAK_RINGAN">RUSAK RINGAN</option>
                <option value="RUSAK_BERAT">RUSAK BERAT</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Condition (%)</label>
              <input 
                name="conditionPercent"
                type="number"
                min="0"
                max="100"
                value={formData.conditionPercent}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Issue Duration (Days)</label>
              <input 
                name="issueDuration"
                type="number"
                min="0"
                value={formData.issueDuration}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Issue Cause</label>
              <input 
                name="issueCause"
                value={formData.issueCause}
                onChange={handleFormChange}
                className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white" 
                placeholder="e.g. Battery Depletion"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-maritime-gray uppercase tracking-widest">Additional Note</label>
            <textarea 
              name="note"
              value={formData.note}
              onChange={handleFormChange}
              rows={3}
              className="w-full bg-maritime-dark/50 border border-maritime-light p-3 rounded-xl focus:border-maritime-accent outline-none text-white resize-none" 
              placeholder="Detailed description of the current status..."
            />
          </div>

          <div className="pt-2 flex gap-4">
            <button 
              type="button"
              onClick={closeModal}
              className="flex-1 py-3 bg-transparent hover:bg-white/5 text-maritime-gray font-bold rounded-xl transition-all border border-transparent hover:border-maritime-light"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={formLoading}
              className="flex-[2] py-3 bg-maritime-accent text-maritime-dark font-extrabold rounded-xl shadow-lg shadow-maritime-accent/10 hover:shadow-maritime-accent/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-maritime-dark/30 border-t-maritime-dark rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {editingReport ? "Update Report" : "Save Report"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsView;
