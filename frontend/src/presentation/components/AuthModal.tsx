import React, { useState } from "react";
import { X, Lock, User, Loader2 } from "lucide-react";
import { authService } from "../../data/services/auth.service";
import { useAuthStore } from "../state/auth.store";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginAction = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const resp = await authService.login(username, password);
      // Simpan session
      loginAction(resp.access_token, resp.user);
      
      // Bersihkan dan Tutup
      setUsername("");
      setPassword("");
      onClose();

      // Pindahkan layar ke halaman Admin Panel
      navigate("/admin");

    } catch (err: any) {
      console.error("Login failed", err);
      setErrorMsg(err.response?.data?.message || "Otentikasi gagal. Periksa kembali kredensial Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-maritime-dark/80 p-4">
      <div className="bg-maritime-blue border border-maritime-light shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-maritime-light flex justify-end items-center bg-maritime-blue absolute top-0 w-full z-10">
          <button 
            onClick={onClose}
            className="text-maritime-gray hover:text-white transition-colors bg-maritime-dark p-1.5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Avatar / Logo Auth */}
        <div className="flex flex-col items-center justify-center pt-20 pb-4">
          <div className="w-24 h-24 rounded-full bg-maritime-dark border border-maritime-accent/50 flex items-center justify-center mb-4 relative">
             <User size={48} className="text-maritime-accent" />
             <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-maritime-blue border border-maritime-accent">
                <Lock size={14} className="text-maritime-accent" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Admin Auth
          </h2>
          <p className="text-sm text-maritime-gray mt-1">Sistem Pemantauan SBNP</p>
        </div>

        {/* Formulir */}
        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
          {errorMsg && (
            <div className="bg-status-off/10 border border-status-off text-status-off text-sm px-4 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-maritime-gray">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-maritime-gray">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-maritime-dark border border-maritime-light rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-maritime-gray/50 focus:outline-none focus:border-maritime-accent transition-colors"
                placeholder="Masukkan username admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-maritime-gray">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-maritime-gray">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-maritime-dark border border-maritime-light rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-maritime-gray/50 focus:outline-none focus:border-maritime-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-maritime-accent text-black font-bold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk Panel"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;
