
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  Calendar,
  FileText,
  DollarSign,
  CheckSquare,
  Megaphone,
  ChevronRight,
  Menu,
  X,
  LogOut
} from "lucide-react";

const navigationItems = [
  {
    title: "לוח בקרה",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "לידים",
    url: createPageUrl("Leads"),
    icon: Users,
  },
  {
    title: "קונים",
    url: createPageUrl("Clients"),
    icon: Users,
  },
  {
    title: "נכסים",
    url: createPageUrl("Listings"),
    icon: Home,
  },
  {
    title: "סיורים",
    url: createPageUrl("Showings"),
    icon: Calendar,
  },
  {
    title: "הצעות",
    url: createPageUrl("Offers"),
    icon: FileText,
  },
  {
    title: "עסקאות",
    url: createPageUrl("Deals"),
    icon: Building2,
  },
  {
    title: "עמלות",
    url: createPageUrl("Commissions"),
    icon: DollarSign,
  },
  {
    title: "משימות",
    url: createPageUrl("Tasks"),
    icon: CheckSquare,
  },
  {
    title: "קמפיינים",
    url: createPageUrl("Campaigns"),
    icon: Megaphone,
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const { data: user } = useQuery({
  //   queryKey: ['current-user'],
  //   queryFn: () => base44.auth.me(),
  //   staleTime: Infinity,
  // });

  // const handleLogout = async () => {
  //   await base44.auth.logout();
  // };

  return (
    <div className="min-h-screen bg-[#e0e0e0] flex" dir="rtl" style={{
      fontFamily: "'Heebo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <style>{`
        .neomorphic-shadow {
          box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
        }
        .neomorphic-inset {
          box-shadow: inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff;
        }
        .neomorphic-button {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
          transition: all 0.2s ease;
        }
        .neomorphic-button:active {
          box-shadow: inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff;
        }
        .neomorphic-card {
          background: linear-gradient(145deg, #e6e6e6, #d5d5d5);
          box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-[#e0e0e0] transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="neomorphic-card rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl neomorphic-button flex items-center justify-center bg-gradient-to-br from-[#4a9eff] to-[#3b7ec9]">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Golden Group</h2>
                <p className="text-xs text-gray-500">מערכת CRM</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'neomorphic-inset text-[#4a9eff]'
                      : 'neomorphic-button text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                  {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          {false && (
            <div className="neomorphic-card rounded-2xl p-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full neomorphic-button flex items-center justify-center bg-gradient-to-br from-[#4a9eff] to-[#3b7ec9]">
                  <span className="text-white font-bold text-sm">
                    {user.full_name?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {user.full_name || 'משתמש'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full neomorphic-button rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">התנתק</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden neomorphic-card px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-gray-800">Golden Group CRM</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="neomorphic-button rounded-xl p-2"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
