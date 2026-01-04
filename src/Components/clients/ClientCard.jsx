
import React from "react";
import { Phone, Mail, MessageCircle, MapPin, Edit, TrendingUp, Clock, CheckCircle, DollarSign, Home } from "lucide-react";

const statusColors = {
  'חדש': 'from-[#4a9eff] to-[#3b7ec9]',
  'בתהליך': 'from-[#51cf66] to-[#40c057]',
  'הקפאה': 'from-[#ffd43b] to-[#fcc419]',
  'נסגר': 'from-[#94a3b8] to-[#64748b]',
};

export default function ClientCard({ client, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const formatBudget = (budget) => {
    if (!budget) return null;
    if (budget >= 1000000) {
      return `₪${(budget / 1000000).toFixed(2)}M`;
    }
    return `₪${(budget / 1000).toFixed(0)}K`;
  };

  return (
    <div className="neomorphic-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[client.status]} flex items-center justify-center text-2xl shadow-lg`}>
            🏠
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {client.first_name} {client.last_name}
            </h3>
            {client.apartment_type && (
              <p className="text-sm text-gray-600">{client.apartment_type}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onEdit(client)}
          className="neomorphic-button rounded-lg p-2 hover:text-[#4a9eff] transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${statusColors[client.status]} text-white text-sm font-medium shadow-md`}>
          <TrendingUp className="w-3 h-3" />
          {client.status}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-4">
        <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-800 font-medium">{client.phone_main}</span>
        </div>
        
        {client.email && (
          <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800 truncate">{client.email}</span>
          </div>
        )}

        {client.address && (
          <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800 truncate">{client.address}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {client.budget && (
          <div>
            <p className="text-xs text-gray-500 mb-1">תקציב</p>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-gray-600" />
              <p className="text-sm font-semibold text-gray-800">
                {formatBudget(client.budget)}
              </p>
            </div>
          </div>
        )}
        {client.needs_rooms && (
          <div>
            <p className="text-xs text-gray-500 mb-1">חדרים</p>
            <div className="flex items-center gap-1">
              <Home className="w-3 h-3 text-gray-600" />
              <p className="text-sm font-semibold text-gray-800">
                {client.needs_rooms} חדרים
              </p>
            </div>
          </div>
        )}
        {client.financing_approved && (
          <div className="col-span-2">
            <div className="neomorphic-inset rounded-lg p-2 flex items-center gap-2 justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-semibold text-green-600">מימון מאושר</span>
              {client.bank_name && (
                <span className="text-xs text-gray-500">• {client.bank_name}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preferred Areas */}
      {client.preferred_areas && client.preferred_areas.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">אזורים מועדפים</p>
          <div className="flex flex-wrap gap-2">
            {client.preferred_areas.slice(0, 3).map((area, index) => (
              <span key={index} className="neomorphic-inset rounded-lg px-2 py-1 text-xs text-gray-700">
                {area}
              </span>
            ))}
            {client.preferred_areas.length > 3 && (
              <span className="neomorphic-inset rounded-lg px-2 py-1 text-xs text-gray-500">
                +{client.preferred_areas.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatDate(client.created_date)}
        </div>
      </div>
    </div>
  );
}
