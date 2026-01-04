import React, { useState } from "react";
import { entities } from "@/api/apiClient.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Users } from "lucide-react";
import ClientCard from "../Components/clients/ClientCard";
import ClientForm from "../Components/clients/ClientForm";
import ClientFilters from "../Components/clients/ClientFilters";

export default function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'הכל',
    financing_approved: 'הכל'
  });

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => entities.Client.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone_main?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'הכל' || client.status === filters.status;
    const matchesFinancing = filters.financing_approved === 'הכל' || 
      (filters.financing_approved === 'כן' && client.financing_approved) ||
      (filters.financing_approved === 'לא' && !client.financing_approved);

    return matchesSearch && matchesStatus && matchesFinancing;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">קונים</h1>
            <p className="text-gray-600">ניהול כל הקונים במערכת</p>
          </div>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="neomorphic-button rounded-xl px-6 py-3 flex items-center gap-2 text-gray-700 hover:text-[#4a9eff] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">קונה חדש</span>
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
              placeholder="חיפוש לפי שם, טלפון או אימייל..."
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
          <ClientFilters filters={filters} setFilters={setFilters} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">סה"כ קונים</p>
          <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">קונים פעילים</p>
          <p className="text-2xl font-bold text-[#51cf66]">
            {clients.filter(c => c.status === 'בתהליך').length}
          </p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">מימון מאושר</p>
          <p className="text-2xl font-bold text-[#4a9eff]">
            {clients.filter(c => c.financing_approved).length}
          </p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">עסקאות נסגרו</p>
          <p className="text-2xl font-bold text-green-500">
            {clients.filter(c => c.status === 'נסגר').length}
          </p>
        </div>
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#e0e0e0] rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto neomorphic-card">
            <ClientForm
              client={editingClient}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neomorphic-card rounded-xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="neomorphic-card rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">אין קונים להצגה</h3>
          <p className="text-gray-600">נסה לשנות את הפילטרים או להוסיף קונה חדש</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}