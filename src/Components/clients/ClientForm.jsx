
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";

export default function ClientForm({ client, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(client || {
    first_name: '',
    last_name: '',
    id_number: '',
    phone_main: '',
    phone_alt: '',
    email: '',
    address: '',
    apartment_type: '',
    budget: '',
    financing_approved: false,
    bank_name: '',
    needs_rooms: '',
    preferred_areas: [],
    status: 'חדש',
    owner_agent: '',
    notes: ''
  });

  const [newArea, setNewArea] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddArea = () => {
    if (newArea.trim()) {
      setFormData((prev) => ({
        ...prev,
        preferred_areas: [...(prev.preferred_areas || []), newArea.trim()]
      }));
      setNewArea('');
    }
  };

  const handleRemoveArea = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferred_areas: prev.preferred_areas.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {client ? 'עריכת קונה' : 'קונה חדש'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="neomorphic-button rounded-lg p-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">פרטים בסיסיים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם פרטי" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם משפחה" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
            <input
              type="text"
              value={formData.id_number}
              onChange={(e) => handleChange('id_number', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="123456789" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון ראשי *</label>
            <input
              type="tel"
              required
              value={formData.phone_main}
              onChange={(e) => handleChange('phone_main', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="05X-XXXXXXX" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון משני</label>
            <input
              type="tel"
              value={formData.phone_alt}
              onChange={(e) => handleChange('phone_alt', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="05X-XXXXXXX" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="רחוב 123, עיר" />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">סוג דירה</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Apartment Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג דירה</label>
            <select
              value={formData.apartment_type}
              onChange={(e) => handleChange('apartment_type', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800">
              <option value="">בחר סוג</option>
              <option value="3 חדרים">3 חדרים</option>
              <option value="4 חדרים">4 חדרים</option>
              <option value="5 חדרים">5 חדרים</option>
              <option value="+ יחידת דיור">+ יחידת דיור</option>
              <option value="טאבו משותף">טאבו משותף</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מספר חדרים נדרש</label>
            <input
              type="number"
              step="0.5"
              value={formData.needs_rooms}
              onChange={(e) => handleChange('needs_rooms', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="4" />
          </div>
        </div>
      </div>

      {/* Financial Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">מידע פיננסי</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תקציב (₪)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="2500000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">הון עצמי</label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={(e) => handleChange('bank_name', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="בנק לאומי" />
          </div>

          <div className="flex items-center pt-7">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.financing_approved}
                onChange={(e) => handleChange('financing_approved', e.target.checked)}
                className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">מימון מאושר</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preferred Areas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">אזורים מועדפים</h3>
        <div className="neomorphic-inset rounded-xl p-4">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
              className="flex-1 neomorphic-inset rounded-lg px-4 py-2 bg-transparent text-gray-800"
              placeholder="הוסף אזור..." />
            <button
              type="button"
              onClick={handleAddArea}
              className="neomorphic-button rounded-lg px-4 py-2 flex items-center gap-2 hover:text-[#4a9eff] transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">הוסף</span>
            </button>
          </div>

          {formData.preferred_areas && formData.preferred_areas.length > 0 &&
            <div className="flex flex-wrap gap-2">
              {formData.preferred_areas.map((area, index) =>
                <div key={index} className="neomorphic-card rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="text-sm text-gray-800">{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(index)}
                    className="hover:text-red-600 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">סטטוס</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס לקוח</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800">
              <option value="חדש">חדש</option>
              <option value="בתהליך">בתהליך</option>
              <option value="הקפאה">הקפאה</option>
              <option value="נסגר">נסגר</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוכן אחראי</label>
            <input
              type="text"
              value={formData.owner_agent}
              onChange={(e) => handleChange('owner_agent', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם הסוכן" />
          </div>
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
          placeholder="הערות נוספות על הקונה..." />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 neomorphic-button rounded-xl py-3 font-medium text-gray-700 hover:text-red-600 transition-colors">
          ביטול
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 neomorphic-button rounded-xl py-3 font-medium text-gray-700 hover:text-[#4a9eff] transition-colors flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          {isSubmitting ? 'שומר...' : 'שמור'}
        </button>
      </div>
    </form>
  );
}
