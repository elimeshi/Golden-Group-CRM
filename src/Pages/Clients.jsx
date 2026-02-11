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
    city: ''
  });

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => entities.Client.list(),
  });

  const handleSubmit = async (data) => {
    const { buyerRequests, ...clientData } = data;

    try {
      let savedClient;
      if (editingClient) {
        savedClient = await entities.Client.update(editingClient.id, clientData);
      } else {
        savedClient = await entities.Client.create(clientData);
      }

      const clientId = savedClient.id || editingClient?.id;

      if (clientId && buyerRequests && buyerRequests.length > 0) {
        // Create buyer requests
        for (const req of buyerRequests) {
          const { type, ...reqData } = req;
          reqData.clientId = clientId;
          if (type === 'tabo') {
            await entities.BuyerRequest.createTabo(reqData);
          } else {
            await entities.BuyerRequest.createNormal(reqData);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Submission failed", error);
      alert("הפעולה נכשלה. אנא נסה שוב.");
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumbers?.some(p => p.includes(searchTerm)) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !filters.city || client.address?.toLowerCase().includes(filters.city.toLowerCase());

    return matchesSearch && matchesCity;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">סה"כ קונים</p>
          <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">קונים נמצאו</p>
          <p className="text-2xl font-bold text-[#4a9eff]">{filteredClients.length}</p>
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
              isSubmitting={false} // Transition to custom loading if needed
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