import React from "react";
import { entities } from "@/api/apiClient.js";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  Home,
  Calendar,
  FileText,
  Building2,
  DollarSign,
  CheckSquare,
  TrendingUp,
  Clock,
  AlertCircle,
  LayoutDashboard
} from "lucide-react";

export default function Dashboard() {
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => entities.Lead.list('-created_date'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => entities.Client.list('-created_date'),
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['listings'],
    queryFn: () => entities.Listing.list('-created_date'),
  });

  const { data: showings = [] } = useQuery({
    queryKey: ['showings'],
    queryFn: () => entities.Showing.list('-created_date'),
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers'],
    queryFn: () => entities.Offer.list('-created_date'),
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: () => entities.Deal.list('-created_date'),
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ['commissions'],
    queryFn: () => entities.Commission.list('-created_date'),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => entities.Task.list('-due_date'),
  });

  // Calculate stats
  const totalClients = clients.length;
  const hotLeads = leads.filter(l => l.status === 'מתעניין חם').length;
  const activeListings = listings.filter(l => l.location).length;
  const exclusiveListings = listings.filter(l => l.is_exclusive).length;
  const upcomingShowings = showings.filter(s => s.status === 'נקבע').length;
  const activeOffers = offers.filter(o => ['הוגשה', 'במו"מ'].includes(o.status)).length;
  const activeDeals = deals.filter(d => ['בחינת עו"ד', 'חתום', 'בביצוע'].includes(d.status)).length;
  const pendingCommissions = commissions.filter(c => c.payment_status === 'ממתין לתשלום').length;
  const todayTasks = tasks.filter(t => {
    if (t.status === 'הושלם') return false;
    const due = new Date(t.due_date);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  }).length;

  const urgentTasks = tasks.filter(t => {
    if (t.status === 'הושלם') return false;
    return t.priority === 'גבוהה';
  }).length;

  const stats = [
    { title: 'קונים', value: totalClients, icon: Users, color: 'from-[#4a9eff] to-[#3b7ec9]', link: createPageUrl('Clients') },
    { title: 'לידים חמים', value: hotLeads, icon: TrendingUp, color: 'from-[#ff6b6b] to-[#ee5a52]', link: createPageUrl('Leads') },
    { title: 'נכסים פעילים', value: activeListings, icon: Home, color: 'from-[#51cf66] to-[#40c057]', link: createPageUrl('Listings') },
    { title: 'בלעדיות', value: exclusiveListings, icon: Building2, color: 'from-[#ffd43b] to-[#fcc419]', link: createPageUrl('Listings') },
    { title: 'סיורים קרובים', value: upcomingShowings, icon: Calendar, color: 'from-[#a78bfa] to-[#8b5cf6]', link: createPageUrl('Showings') },
    { title: 'הצעות פעילות', value: activeOffers, icon: FileText, color: 'from-[#60a5fa] to-[#3b82f6]', link: createPageUrl('Offers') },
    { title: 'עסקאות בתהליך', value: activeDeals, icon: Building2, color: 'from-[#34d399] to-[#10b981]', link: createPageUrl('Deals') },
    { title: 'עמלות לגבייה', value: pendingCommissions, icon: DollarSign, color: 'from-[#f59e0b] to-[#d97706]', link: createPageUrl('Commissions') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">לוח בקרה</h1>
            <p className="text-gray-600">סקירה כללית של הפעילות</p>
          </div>
          <div className="neomorphic-button rounded-xl p-4">
            <LayoutDashboard className="w-8 h-8 text-[#4a9eff]" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="neomorphic-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="neomorphic-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-[#4a9eff]" />
            <h2 className="text-xl font-bold text-gray-800">משימות להיום</h2>
            <span className="neomorphic-inset rounded-full px-3 py-1 text-sm font-bold text-[#4a9eff]">
              {todayTasks}
            </span>
          </div>
          {tasks.filter(t => {
            if (t.status === 'הושלם') return false;
            const due = new Date(t.due_date);
            const today = new Date();
            return due.toDateString() === today.toDateString();
          }).slice(0, 5).map((task, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="neomorphic-inset rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">{task.title}</p>
                    {task.related_name && (
                      <p className="text-sm text-gray-600">{task.related_entity}: {task.related_name}</p>
                    )}
                  </div>
                  {task.priority === 'גבוהה' && (
                    <div className="neomorphic-button rounded-lg px-2 py-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {todayTasks === 0 && (
            <div className="neomorphic-inset rounded-xl p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">אין משימות מתוכננות להיום</p>
            </div>
          )}
          <Link
            to={createPageUrl('Tasks')}
            className="neomorphic-button rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-gray-700 hover:text-[#4a9eff] transition-colors mt-4"
          >
            <span className="font-medium">צפה בכל המשימות</span>
          </Link>
        </div>

        {/* Urgent Tasks */}
        <div className="neomorphic-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">משימות דחופות</h2>
            <span className="neomorphic-inset rounded-full px-3 py-1 text-sm font-bold text-red-500">
              {urgentTasks}
            </span>
          </div>
          {tasks.filter(t => t.status !== 'הושלם' && t.priority === 'גבוהה').slice(0, 5).map((task, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="neomorphic-inset rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  {task.related_name && (
                    <span className="text-gray-600">{task.related_entity}: {task.related_name}</span>
                  )}
                  <span className="text-gray-500">{task.due_date}</span>
                </div>
              </div>
            </div>
          ))}
          {urgentTasks === 0 && (
            <div className="neomorphic-inset rounded-xl p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">אין משימות דחופות</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="neomorphic-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Link to={createPageUrl('Leads')} className="neomorphic-button rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
            <Users className="w-8 h-8 text-[#4a9eff] mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">ליד חדש</p>
          </Link>
          <Link to={createPageUrl('Clients')} className="neomorphic-button rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
            <Users className="w-8 h-8 text-[#51cf66] mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">קונה חדש</p>
          </Link>
          <Link to={createPageUrl('Listings')} className="neomorphic-button rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
            <Home className="w-8 h-8 text-[#ffd43b] mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">נכס חדש</p>
          </Link>
          <Link to={createPageUrl('Showings')} className="neomorphic-button rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
            <Calendar className="w-8 h-8 text-[#a78bfa] mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">סיור חדש</p>
          </Link>
          <Link to={createPageUrl('Tasks')} className="neomorphic-button rounded-xl p-4 text-center hover:scale-[1.02] transition-transform">
            <CheckSquare className="w-8 h-8 text-[#60a5fa] mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">משימה חדשה</p>
          </Link>
        </div>
      </div>
    </div>
  );
}