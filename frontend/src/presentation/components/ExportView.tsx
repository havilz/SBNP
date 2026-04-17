import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { exportService } from "../../data/services/export.service";

const ExportView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleExport = async (type: 'csv' | 'excel') => {
    setLoading(true);
    setStatus(null);
    try {
      if (type === 'csv') {
        await exportService.downloadCsv();
      } else {
        await exportService.downloadExcel();
      }
      setStatus({ type: 'success', message: `Data exported successfully as ${type.toUpperCase()}` });
    } catch (err: any) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        message: err?.message || "Failed to export data. Please check your network or app permissions." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-maritime-accent/10 border border-maritime-accent/20 rounded-2xl flex items-center justify-center text-maritime-accent mx-auto">
          <Download size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Data Export Dashboard</h2>
        <p className="text-maritime-gray text-lg max-w-xl mx-auto">
          Arsip data stasiun dan laporan bulanan SBNP dapat diunduh di sini untuk keperluan pelaporan atau analisis offline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* CSV Export Card */}
        <div className="bg-maritime-dark/40 border border-maritime-light p-8 rounded-3xl hover:border-maritime-accent/30 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-status-warning/10 text-status-warning rounded-2xl">
              <FileText size={32} />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-maritime-gray uppercase bg-white/5 px-3 py-1 rounded-full italic">Format: .csv</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Plain Text Report</h3>
          <p className="text-maritime-gray text-sm mb-8 leading-relaxed">
            Export data dalam format teks standar (Comma Separated Values). Ukuran file kecil dan kompatibel dengan hampir semua software database.
          </p>
          <button 
            disabled={loading}
            onClick={() => handleExport('csv')}
            className="w-full py-4 bg-maritime-light hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 hover:border-maritime-accent/50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={20} />}
            Download CSV Archive
          </button>
        </div>

        {/* Excel Export Card */}
        <div className="bg-maritime-dark/40 border border-maritime-light p-8 rounded-3xl hover:border-maritime-accent/30 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-status-normal/10 text-status-normal rounded-2xl">
              <FileSpreadsheet size={32} />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-maritime-gray uppercase bg-white/5 px-3 py-1 rounded-full italic">Format: .xlsx</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Rich Data Spreadsheet</h3>
          <p className="text-maritime-gray text-sm mb-8 leading-relaxed">
            Format Microsoft Excel dengan struktur yang lebih rapi. Ideal untuk pembuatan visualisasi data, grafik, dan tabel pivot laporan manajemen.
          </p>
          <button 
            disabled={loading}
            onClick={() => handleExport('excel')}
            className="w-full py-4 bg-maritime-accent hover:shadow-lg hover:shadow-maritime-accent/20 text-maritime-dark font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-maritime-dark/30 border-t-maritime-dark rounded-full animate-spin" /> : <Download size={20} />}
            Download Excel Report
          </button>
        </div>
      </div>

      {status && (
        <div className={`flex items-center gap-3 p-5 rounded-2xl border ${status.type === 'success' ? 'bg-status-normal/10 border-status-normal/20 text-status-normal' : 'bg-status-off/10 border-status-off/20 text-status-off'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-semibold text-sm">{status.message}</p>
        </div>
      )}

      <div className="p-6 bg-maritime-blue/30 border border-dashed border-maritime-light rounded-2xl">
        <div className="flex gap-4">
          <AlertCircle className="text-maritime-accent shrink-0" size={24} />
          <div className="space-y-1">
             <h4 className="font-bold text-sm">Catatan Penting</h4>
             <p className="text-maritime-gray text-xs leading-relaxed">
               Data yang diekspor berisi seluruh histori laporan stasiun yang ada di database saat ini. Untuk mengamankan data, jangan bagikan file hasil ekspor ini kepada pihak yang tidak berkepentingan.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportView;
