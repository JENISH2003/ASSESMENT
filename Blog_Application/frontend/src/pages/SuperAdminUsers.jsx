import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Users, Search, Shield, ShieldOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SuperAdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      await axiosInstance.patch(`/users/${userId}/block`);
      fetchUsers();
    } catch (error) {
      console.error("Error toggling block status:", error);
      alert("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading users...</div>;

  if (user?.role !== "superadmin") {
    return <div className="p-8 text-center text-destructive">Unauthorized Access. Super Admin role required.</div>;
  }

  const displayUsers = users.filter((u) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    }
    return true;
  });
  const limit = 5;
  const totalPages = Math.ceil(displayUsers.length / limit) || 1;
  const currentUsers = displayUsers.slice((currentPage - 1) * limit, currentPage * limit);

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleJumpToPage = (e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          User Management
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-secondary/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <div className="bg-secondary px-4 py-2 rounded-full text-sm font-medium shrink-0 w-full sm:w-auto text-center">
            Total Users: {displayUsers.length}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <ul className="divide-y divide-border/50">
          {currentUsers.map((u) => (
            <li 
              key={u._id} 
              onClick={() => navigate(`/superadmin/users/${u._id}`)}
              className="p-6 sm:px-8 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary/20">
                  {u.avatarThumbUrl ? (
                    <img src={u.avatarThumbUrl} alt={u.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 text-lg font-semibold text-foreground">
                    {u.name}
                    {u.role === "superadmin" && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        Super Admin
                      </span>
                    )}
                    {u.role === "admin" && (
                      <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        Admin
                      </span>
                    )}
                    {u.isBlocked && (
                      <span className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap sm:flex-nowrap justify-start sm:justify-end items-center w-full sm:w-auto mt-4 sm:mt-0">
                {u.role !== "superadmin" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBlock(u._id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        u.isBlocked 
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                          : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                      }`}
                    >
                      {u.isBlocked ? (
                        <><Shield className="w-4 h-4" /> Unblock</>
                      ) : (
                        <><ShieldOff className="w-4 h-4" /> Block</>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(u._id);
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-800 hover:text-white hover:shadow-lg transition-all dark:bg-red-900/30 dark:text-red-500 dark:hover:bg-red-700"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
        {displayUsers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border-t border-border/50">
            No users found.
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center pt-8 space-x-2 animate-fade-in relative z-20">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-3.5 rounded-full border border-border/80 bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center space-x-2 bg-secondary/30 rounded-full px-8 py-3 border border-border/50 mx-2 shadow-sm font-heading">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">
            Page
          </span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handleJumpToPage}
            className="w-12 p-1 text-center font-bold text-lg bg-transparent focus:outline-none focus:bg-background/50 focus:ring-1 focus:ring-border rounded-md transition-all text-foreground"
            aria-label="Jump to page"
          />
          <span className="text-sm font-medium text-muted-foreground">
            of {totalPages}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-3.5 rounded-full border border-border/80 bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
