import React from "react";
import { Phone, Mail, MessageCircle, MapPin, Edit, TrendingUp, Clock } from "lucide-react";

const statusColors = {
  'חדש': 'from-[#4a9eff] to-[#3b7ec9]',
  'יוצר קשר': 'from-[#60a5fa] to-[#3b82f6]',
  'מתעניין חם': 'from-[#ff6b6b] to-[#ee5a52]',
  'מתעניין פושר': 'from-[#ffd43b] to-[#fcc419]',
  'לא רלוונטי': 'from-[#94a3b8] to-[#64748b]',
  'נסגר - הומר ללקוח': 'from-[#51cf66] to-[#40c057]',
};

const leadTypeIcons = {
  'קונה': '🏠',
  'מוכר': '💼',
  'משקיע': '💰',
  'שוכר': '🔑'
};

export default function LeadCard({ lead, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  return (
    <div className="neomorphic-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[lead.status]} flex items-center justify-center text-2xl shadow-lg`}>
            {leadTypeIcons[lead.lead_type]}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {lead.first_name} {lead.last_name}
            </h3>
            <p className="text-sm text-gray-600">{lead.lead_type}</p>
          </div>
        </div>
        <button
          onClick={() => onEdit(lead)}
          className="neomorphic-button rounded-lg p-2 hover:text-[#4a9eff] transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${statusColors[lead.status]} text-white text-sm font-medium shadow-md`}>
          <TrendingUp className="w-3 h-3" />
          {lead.status}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-4">
        <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-800 font-medium">{lead.phone_main}</span>
          {lead.whatsapp_available && (
            <MessageCircle className="w-4 h-4 text-green-500 mr-auto" />
          )}
        </div>
        
        {lead.email && (
          <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800">{lead.email}</span>
          </div>
        )}

        {lead.area && (
          <div className="neomorphic-inset rounded-xl p-3 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800">{lead.area}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {lead.budget_min && lead.budget_max && (
          <div>
            <p className="text-xs text-gray-500 mb-1">תקציב</p>
            <p className="text-sm font-semibold text-gray-800">
              ₪{(lead.budget_min / 1000).toFixed(0)}K - ₪{(lead.budget_max / 1000).toFixed(0)}K
            </p>
          </div>
        )}
        {(lead.rooms_min || lead.rooms_max) && (
          <div>
            <p className="text-xs text-gray-500 mb-1">חדרים</p>
            <p className="text-sm font-semibold text-gray-800">
              {lead.rooms_min || 0} - {lead.rooms_max || 0}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatDate(lead.created_date)}
        </div>
        {lead.source && (
          <div className="neomorphic-inset rounded-lg px-3 py-1">
            <span className="text-xs font-medium text-gray-700">{lead.source}</span>
          </div>
        )}
      </div>

      {lead.priority === 'גבוהה' && (
        <div className="mt-3 neomorphic-button rounded-lg p-2 text-center">
          <span className="text-xs font-bold text-red-500">עדיפות גבוהה ⚡</span>
        </div>
      )}
    </div>
  );
}