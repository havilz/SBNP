import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, UserCog, ShieldCheck, Save } from "lucide-react";
import { userService } from "../../data/services/user.service";
import { useAuthStore } from "../state/auth.store";
import AdminTable from "./AdminTable";
import Modal from "./Modal";

const UsersView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "OPERATOR"
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "", // Don't pre-fill password
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        role: "OPERATOR"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...formData };
      if (editingUser) {
        // Only send password if it was changed
        if (!payload.password) delete (payload as any).password;
        await userService.updateUser(editingUser.id, payload);
      } else {
        await userService.createUser(payload);
      }
      
      closeModal();
      fetchUsers();
    } catch (err) {
      alert("Failed to save user. Please ensure the username is unique and meets the requirements.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id.toString() === userId?.toString()) {
       alert("You cannot delete your own account.");
       return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user. Check if this is the last admin.");
      }
    }
  };

  const columns = [
    {
      header: "User ID",
      render: (u: any) => <span className="text-maritime-gray font-mono">{u.id}</span>
    },
    {
      header: "Username",
      render: (u: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-maritime-accent/10 border border-maritime-accent/20 flex items-center justify-center text-maritime-accent">
            <UserCog size={14} />
          </div>
          <span className="text-white font-bold">{u.username}</span>
        </div>
      )
    },
    {
      header: "Role",
      render: (u: any) => {
        const isAdmin = u.role === "ADMIN";
        return (
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className={isAdmin ? "text-maritime-accent" : "text-maritime-gray"} />
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isAdmin ? "bg-maritime-accent/20 text-maritime-accent" : "bg-white/10 text-white"}`}>
              {u.role}
            </span>
          </div>
        );
      }
    },
    {
      header: "Created At",
      render: (u: any) => (
        <span className="text-xs text-maritime-gray uppercase">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Actions",
      render: (u: any) => (
        <div className="flex items-center gap-2">
           <button 
            onClick={() => openModal(u)}
            className="p-2 bg-maritime-light hover:bg-maritime-accent/20 hover:text-maritime-accent rounded-lg transition-all"
            title="Update User"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(u.id)}
            className="p-2 bg-status-off/10 text-status-off hover:bg-status-off/20 rounded-lg transition-all"
            title="Delete User"
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
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-maritime-gray text-sm">Manage system administrators and their credentials.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-maritime-accent text-maritime-dark font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-maritime-accent/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      <AdminTable 
        data={users} 
        columns={columns} 
        isLoading={loading} 
        searchKey="username"
        searchPlaceholder="Search by username..."
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingUser ? "Update User Profile" : "Register New Admin/Operator"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Username</label>
            <input 
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="w-full bg-maritime-dark/50 border border-maritime-light p-4 rounded-2xl focus:border-maritime-accent outline-none text-white font-bold" 
              placeholder="Enter unique username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">Password</label>
            <input 
              name="password"
              type="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full bg-maritime-dark/50 border border-maritime-light p-4 rounded-2xl focus:border-maritime-accent outline-none text-white" 
              placeholder={editingUser ? "Leave blank to keep current" : "Enter secure password"}
              required={!editingUser}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-maritime-gray uppercase tracking-widest">User Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "ADMIN" })}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${formData.role === "ADMIN" ? "bg-maritime-accent/20 border-maritime-accent text-maritime-accent" : "bg-white/5 border-maritime-light text-maritime-gray hover:border-white/20"}`}
              >
                <ShieldCheck size={24} />
                <span className="font-bold text-sm">ADMIN</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "OPERATOR" })}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${formData.role === "OPERATOR" ? "bg-white/10 border-white/30 text-white" : "bg-white/5 border-maritime-light text-maritime-gray hover:border-white/20"}`}
              >
                <UserCog size={24} />
                <span className="font-bold text-sm">OPERATOR</span>
              </button>
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
                  {editingUser ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersView;
