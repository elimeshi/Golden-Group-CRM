
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";

export default function ClientForm({ client, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    idNumber: client?.idNumber || '',
    phoneNumbers: client?.phoneNumbers || [''],
    email: client?.email || '',
    address: client?.address || '',
    buyerRequests: [] // This will be handled in the parent or submitted separately
  });

  const [buyerRequests, setBuyerRequests] = useState([]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const addPhone = () => {
    setFormData((prev) => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
  };

  const removePhone = (index) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  const addBuyerRequest = (type) => {
    const newRequest = {
      type, // 'normal' or 'tabo'
      zones: [],
      minFloor: 0,
      maxFloor: 0,
      maxPrice: 0,
      minSize: 0,
      details: '',
      liquidity: 'Immediate',
      ...(type === 'tabo' ? {
        maxEquity: 0,
        community: 'Mixed',
        registrationType: 'Tabo',
        maxPartners: 0
      } : {})
    };
    setBuyerRequests([...buyerRequests, newRequest]);
  };

  const updateBuyerRequest = (index, field, value) => {
    const newRequests = [...buyerRequests];
    newRequests[index] = { ...newRequests[index], [field]: value };
    setBuyerRequests(newRequests);
  };

  const removeBuyerRequest = (index) => {
    setBuyerRequests(buyerRequests.filter((_, i) => i !== index));
  };

  const handleZoneChange = (requestIndex, zoneString) => {
    const zones = zoneString.split(',').map(z => z.trim()).filter(z => z);
    updateBuyerRequest(requestIndex, 'zones', zones);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, buyerRequests });
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

      {/* Client Basic Info */}
      <div className="neomorphic-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">פרטי לקוח</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי *</label>
            <input
              type="text"
              required
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם פרטי" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה *</label>
            <input
              type="text"
              required
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם משפחה" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="123456789" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
            <input
              type="text"
              autoComplete="street-address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="רחוב 123, עיר" />
          </div>
        </div>

        {/* Dynamic Phone Numbers */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">מספרי טלפון</label>
          <div className="space-y-2">
            {formData.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="tel"
                  required={index === 0}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  className="flex-1 neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                  placeholder="05X-XXXXXXX" />
                {formData.phoneNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="neomorphic-button rounded-xl p-3 text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhone}
              className="flex items-center gap-2 text-sm text-[#4a9eff] font-medium mt-2">
              <Plus className="w-4 h-4" />
              הוסף מספר טלפון
            </button>
          </div>
        </div>
      </div>

      {/* Buyer Requests Section */}
      <div className="neomorphic-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">בקשות קונה</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addBuyerRequest('normal')}
              className="neomorphic-button rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#4a9eff]">
              + בקשה רגילה
            </button>
            <button
              type="button"
              onClick={() => addBuyerRequest('tabo')}
              className="neomorphic-button rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#4a9eff]">
              + בקשת טאבו
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {buyerRequests.map((req, index) => (
            <div key={index} className="neomorphic-inset rounded-2xl p-6 relative">
              <button
                type="button"
                onClick={() => removeBuyerRequest(index)}
                className="absolute top-4 left-4 text-red-400 hover:text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>

              <h4 className="font-bold text-gray-800 mb-4">
                בקשה {index + 1} ({req.type === 'tabo' ? 'טאבו' : 'רגילה'})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אזורים (מופרדים בפסיק)</label>
                  <input
                    type="text"
                    value={req.zones.join(', ')}
                    onChange={(e) => handleZoneChange(index, e.target.value)}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                    placeholder="A1, A2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מחיר מקסימלי</label>
                  <input
                    type="number"
                    value={req.maxPrice}
                    onChange={(e) => updateBuyerRequest(index, 'maxPrice', parseFloat(e.target.value))}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">גודל מינימלי (מ"ר)</label>
                  <input
                    type="number"
                    value={req.minSize}
                    onChange={(e) => updateBuyerRequest(index, 'minSize', parseFloat(e.target.value))}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">קומה מינימלית</label>
                  <input
                    type="number"
                    value={req.minFloor}
                    onChange={(e) => updateBuyerRequest(index, 'minFloor', parseInt(e.target.value))}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">קומה מקסימלית</label>
                  <input
                    type="number"
                    value={req.maxFloor}
                    onChange={(e) => updateBuyerRequest(index, 'maxFloor', parseInt(e.target.value))}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">נזילות</label>
                  <select
                    value={req.liquidity}
                    onChange={(e) => updateBuyerRequest(index, 'liquidity', e.target.value)}
                    className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800">
                    <option value="Immediate">מיידית</option>
                    <option value="High">גבוהה</option>
                    <option value="Medium">בינונית</option>
                    <option value="Low">נמוכה</option>
                  </select>
                </div>

                {req.type === 'tabo' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">הון עצמי מקסימלי</label>
                      <input
                        type="number"
                        value={req.maxEquity}
                        onChange={(e) => updateBuyerRequest(index, 'maxEquity', parseFloat(e.target.value))}
                        className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">קהילה</label>
                      <select
                        value={req.community}
                        onChange={(e) => updateBuyerRequest(index, 'community', e.target.value)}
                        className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800">
                        <option value="Yerushalmi">ירושלמי</option>
                        <option value="Chasidi">חסידי</option>
                        <option value="Sefaradi">ספרדי</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">סוג רישום</label>
                      <select
                        value={req.registrationType}
                        onChange={(e) => updateBuyerRequest(index, 'registrationType', e.target.value)}
                        className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800">
                        <option value="Tabo">טאבו</option>
                        <option value="Name">שם</option>
                        <option value="None">לא משנה</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">פרטים נוספים</label>
                <textarea
                  value={req.details}
                  onChange={(e) => updateBuyerRequest(index, 'details', e.target.value)}
                  rows="2"
                  className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800 resize-none"
                  placeholder="פרטים נוספים לבקשה..." />
              </div>
            </div>
          ))}

          {buyerRequests.length === 0 && (
            <p className="text-center text-gray-500 py-4 italic">אין בקשות קונה. לחץ על הכפתורים למעלה כדי להוסיף.</p>
          )}
        </div>
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
