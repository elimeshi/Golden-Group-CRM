
import React from "react";
import { Phone, Mail, MessageCircle, MapPin, Edit, TrendingUp, Clock, CheckCircle, DollarSign, Home } from "lucide-react";

const statusColors = {
  'חדש': 'from-[#4a9eff] to-[#3b7ec9]',
  'בתהליך': 'from-[#51cf66] to-[#40c057]',
  'הקפאה': 'from-[#ffd43b] to-[#fcc419]',
  'נסגר': 'from-[#94a3b8] to-[#64748b]',
};

export default function ClientCard({ client, onEdit }) {
  const formatPhoneNumbers = (phoneNumbers) => {
    if (!phoneNumbers || phoneNumbers.length === 0) return 'אין מספר טלפון';
    return phoneNumbers.join(', ');
  };

  return (
    <div className="neomorphic-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a9eff] to-[#3b7ec9] flex items-center justify-center text-2xl shadow-lg">
            👤
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {client.firstName} {client.lastName}
            </h3>
            {client.idNumber && (
              <p className="text-sm text-gray-600">ת.ז: {client.idNumber}</p>
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

      {/* Contact Info */}
      <div className="space-y-3 mb-4">
        <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-800 font-medium">
            {formatPhoneNumbers(client.phoneNumbers)}
          </span>
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
    </div>
  );
}
