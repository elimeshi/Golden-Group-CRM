import React, { useState } from "react";
import { entities } from "@/api/apiClient.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Phone, Mail, MessageCircle } from "lucide-react";
import LeadForm from "../Components/leads/LeadForm";
import LeadCard from "../Components/leads/LeadCard";
import LeadFilters from "../Components/leads/LeadFilters";

export default function Leads() {
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'הכל',
    lead_type: 'הכל',
    source: 'הכל',
    priority: 'הכל'
  });

  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => entities.Lead.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Lead.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setShowForm(false);
      setEditingLead(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setShowForm(false);
      setEditingLead(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingLead) {
      updateMutation.mutate({ id: editingLead.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_main?.includes(searchTerm) ||
      lead.area?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'הכל' || lead.status === filters.status;
    const matchesType = filters.lead_type === 'הכל' || lead.lead_type === filters.lead_type;
    const matchesSource = filters.source === 'הכל' || lead.source === filters.source;
    const matchesPriority = filters.priority === 'הכל' || lead.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesType && matchesSource && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">לידים</h1>
            <p className="text-gray-600">ניהול כל הלידים שנכנסו למערכת</p>
          </div>
          <button
            onClick={() => {
              setEditingLead(null);
              setShowForm(true);
            }}
            className="neomorphic-button rounded-xl px-6 py-3 flex items-center gap-2 text-gray-700 hover:text-[#4a9eff] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">ליד חדש</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 neomorphic-inset rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון או אזור..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="neomorphic-button rounded-xl px-6 py-3 flex items-center gap-2 text-gray-700 hover:text-[#4a9eff] transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">סינון</span>
          </button>
        </div>

        {showFilters && (
          <LeadFilters filters={filters} setFilters={setFilters} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">סה"כ לידים</p>
          <p className="text-2xl font-bold text-gray-800">{leads.length}</p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">לידים חדשים</p>
          <p className="text-2xl font-bold text-[#4a9eff]">
            {leads.filter(l => l.status === 'חדש').length}
          </p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">מתעניינים חמים</p>
          <p className="text-2xl font-bold text-red-500">
            {leads.filter(l => l.status === 'מתעניין חם').length}
          </p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">יחס המרה</p>
          <p className="text-2xl font-bold text-green-500">
            {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'נסגר - הומר ללקוח').length / leads.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#e0e0e0] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto neomorphic-card">
            <LeadForm
              lead={editingLead}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingLead(null);
              }}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Leads Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neomorphic-card rounded-xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="neomorphic-card rounded-2xl p-12 text-center">
          <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">אין לידים להצגה</h3>
          <p className="text-gray-600">נסה לשנות את הפילטרים או להוסיף ליד חדש</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}