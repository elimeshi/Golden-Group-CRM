import React, { useState } from "react";
import { X, Save } from "lucide-react";

export default function LeadForm({ lead, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(lead || {
    source: '',
    lead_type: '',
    first_name: '',
    last_name: '',
    phone_main: '',
    phone_alt: '',
    whatsapp_available: false,
    email: '',
    area: '',
    budget_min: '',
    budget_max: '',
    rooms_min: '',
    rooms_max: '',
    floor_preference: '',
    elevator_required: false,
    parking_required: false,
    status: 'חדש',
    priority: 'בינונית',
    notes: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {lead ? 'עריכת ליד' : 'ליד חדש'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="neomorphic-button rounded-lg p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">מקור הליד *</label>
          <select
            required
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
          >
            <option value="">בחר מקור</option>
            <option value="עיתון">עיתון</option>
            <option value="סטטוס וואטסאפ">סטטוס וואטסאפ</option>
            <option value="הפניה">הפניה</option>
            <option value="אתר">אתר</option>
            <option value="מודעה ממומנת">מודעה ממומנת</option>
            <option value="פליירים">פליירים</option>
            <option value="שותף">שותף</option>
            <option value="קמפיין">קמפיין</option>
            <option value="יריד">יריד</option>
            <option value="אחר">אחר</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג הליד *</label>
          <select
            required
            value={formData.lead_type}
            onChange={(e) => handleChange('lead_type', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
          >
            <option value="">בחר סוג</option>
            <option value="קונה">קונה</option>
            <option value="מוכר">מוכר</option>
            <option value="משקיע">משקיע</option>
            <option value="שוכר">שוכר</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי *</label>
          <input
            type="text"
            required
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="שם פרטי"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="שם משפחה"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">טלפון ראשי *</label>
          <input
            type="tel"
            required
            value={formData.phone_main}
            onChange={(e) => handleChange('phone_main', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="05X-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">טלפון משני</label>
          <input
            type="tel"
            value={formData.phone_alt}
            onChange={(e) => handleChange('phone_alt', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="05X-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">אזור מועדף</label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="שכונה / אזור"
          />
        </div>
      </div>

      {/* Budget & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">תקציב מינימלי (₪)</label>
          <input
            type="number"
            value={formData.budget_min}
            onChange={(e) => handleChange('budget_min', parseFloat(e.target.value))}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">תקציב מקסימלי (₪)</label>
          <input
            type="number"
            value={formData.budget_max}
            onChange={(e) => handleChange('budget_max', parseFloat(e.target.value))}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">חדרים מינימום</label>
          <input
            type="number"
            value={formData.rooms_min}
            onChange={(e) => handleChange('rooms_min', parseFloat(e.target.value))}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">חדרים מקסימום</label>
          <input
            type="number"
            value={formData.rooms_max}
            onChange={(e) => handleChange('rooms_max', parseFloat(e.target.value))}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            placeholder="0"
          />
        </div>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
          >
            <option value="חדש">חדש</option>
            <option value="יוצר קשר">יוצר קשר</option>
            <option value="מתעניין חם">מתעניין חם</option>
            <option value="מתעניין פושר">מתעניין פושר</option>
            <option value="לא רלוונטי">לא רלוונטי</option>
            <option value="נסגר - הומר ללקוח">נסגר - הומר ללקוח</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
          >
            <option value="נמוכה">נמוכה</option>
            <option value="בינונית">בינונית</option>
            <option value="גבוהה">גבוהה</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-7">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.whatsapp_available}
              onChange={(e) => handleChange('whatsapp_available', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">זמין בוואטסאפ</span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows="4"
          className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800 resize-none"
          placeholder="הערות נוספות..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 neomorphic-button rounded-xl py-3 font-medium text-gray-700 hover:text-red-600 transition-colors"
        >
          ביטול
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 neomorphic-button rounded-xl py-3 font-medium text-gray-700 hover:text-[#4a9eff] transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'שומר...' : 'שמור'}
        </button>
      </div>
    </form>
  );
}