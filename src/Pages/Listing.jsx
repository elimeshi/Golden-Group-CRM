import React, { useState } from "react";
import { entities } from "@/api/apiClient.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Home } from "lucide-react";
import ListingCard from "../Components/listings/ListingCard";
import ListingForm from "../Components/listings/ListingForm";
import ListingFilters from "../Components/listings/ListingFilters";

export default function Listings() {
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    property_type: 'הכל',
    location: 'הכל',
    is_exclusive: 'הכל'
  });

  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => entities.Listing.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Listing.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      setShowForm(false);
      setEditingListing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Listing.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      setShowForm(false);
      setEditingListing(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingListing) {
      updateMutation.mutate({ id: editingListing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.listing_number?.includes(searchTerm) ||
      listing.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.property_type === 'הכל' || listing.property_type === filters.property_type;
    const matchesLocation = filters.location === 'הכל' || listing.location === filters.location;
    const matchesExclusive = filters.is_exclusive === 'הכל' || 
      (filters.is_exclusive === 'כן' && listing.is_exclusive) ||
      (filters.is_exclusive === 'לא' && !listing.is_exclusive);

    return matchesSearch && matchesType && matchesLocation && matchesExclusive;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">נכסים</h1>
            <p className="text-gray-600">ניהול כל הנכסים במערכת</p>
          </div>
          <button
            onClick={() => {
              setEditingListing(null);
              setShowForm(true);
            }}
            className="neomorphic-button rounded-xl px-6 py-3 flex items-center gap-2 text-gray-700 hover:text-[#4a9eff] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">נכס חדש</span>
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
              placeholder="חיפוש לפי שכונה, רחוב או מספר נכס..."
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
          <ListingFilters filters={filters} setFilters={setFilters} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">סה"כ נכסים</p>
          <p className="text-2xl font-bold text-gray-800">{listings.length}</p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">נכסים מסונפים</p>
          <p className="text-2xl font-bold text-[#4a9eff]">
            {filteredListings.length}
          </p>
        </div>
        <div className="neomorphic-card rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">בלעדיות</p>
          <p className="text-2xl font-bold text-[#ffd43b]">
            {listings.filter(l => l.is_exclusive).length}
          </p>
        </div>
      </div>

      {/* Listing Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#e0e0e0] rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto neomorphic-card">
            <ListingForm
              listing={editingListing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingListing(null);
              }}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neomorphic-card rounded-xl p-6 h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="neomorphic-card rounded-2xl p-12 text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">אין נכסים להצגה</h3>
          <p className="text-gray-600">נסה לשנות את הפילטרים או להוסיף נכס חדש</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}