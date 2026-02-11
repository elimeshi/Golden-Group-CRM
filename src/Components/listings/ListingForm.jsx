import React, { useState, useEffect } from "react";
import { X, Save, Upload, Image as ImageIcon, Trash2, FileText, Download, Search, Check } from "lucide-react";
import { integrations, entities } from "@/api/apiClient.js";
import { useQuery } from "@tanstack/react-query";

export default function ListingForm({ listing, onSubmit, onCancel, isSubmitting }) {
  const [listingType, setListingType] = useState(listing?.registrationType ? 'tabo' : 'normal');
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showClientResults, setShowClientResults] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => entities.Client.list(),
  });

  const [formData, setFormData] = useState(listing || {
    city: 'ביתר עילית',
    street: '',
    buildingNumber: '',
    aptNumber: '',
    floor: '',
    rooms: '',
    squaredMeters: '',
    zone: 'A1',
    price: '',
    clientId: '',
    enteringDate: new Date().toISOString().split('T')[0],
    propertyState: 'GoodCondition',
    details: '',
    housingUnits: [],
    // Tabo specific
    registrationType: 'Tabo',
    numOfPartners: 0,
    requiredEquity: 0,
    // Legacy/Extra fields (might be stored in details? for now keeping them)
    images: [],
    files: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Sync client search term when editing
  useEffect(() => {
    if (listing?.clientId && clients.length > 0) {
      const client = clients.find(c => c.id === listing.clientId);
      if (client) {
        setClientSearchTerm(`${client.firstName} ${client.lastName} - ${client.phoneNumbers?.[0] || ''}`);
      }
    }
  }, [listing, clients]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredClients = clients.filter(client => {
    const fullSearch = `${client.firstName} ${client.lastName} ${client.phoneNumbers?.join(' ') || ''}`.toLowerCase();
    return fullSearch.includes(clientSearchTerm.toLowerCase());
  }).slice(0, 5);

  const handleSelectClient = (client) => {
    handleChange('clientId', client.id);
    setClientSearchTerm(`${client.firstName} ${client.lastName} - ${client.phoneNumbers?.[0] || ''}`);
    setShowClientResults(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await integrations.Core.UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), file_url]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה');
    }
    setUploadingImage(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await integrations.Core.UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        files: [...(prev.files || []), { url: file_url, name: file.name }]
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('שגיאה בהעלאת הקובץ');
    }
    setUploadingFile(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addHousingUnit = () => {
    setFormData(prev => ({
      ...prev,
      housingUnits: [
        ...(prev.housingUnits || []),
        { squaredMeters: '', rooms: '', floor: '', phoneNumber: '' }
      ]
    }));
  };

  const removeHousingUnit = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      housingUnits: prev.housingUnits.filter((_, index) => index !== indexToRemove)
    }));
  };

  const updateHousingUnit = (index, field, value) => {
    setFormData(prev => {
      const newUnits = [...prev.housingUnits];
      newUnits[index] = { ...newUnits[index], [field]: value };
      return { ...prev, housingUnits: newUnits };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert('יש לבחור לקוח');
      return;
    }
    // Deep copy to avoid side effects
    const submissionData = { ...formData, type: listingType };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {listing ? 'עריכת נכס' : 'נכס חדש'}
          </h2>
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => setListingType('normal')}
              className={`text-sm font-medium px-4 py-1 rounded-full transition-colors ${listingType === 'normal' ? 'bg-[#4a9eff] text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}
            >
              דירה רגילה
            </button>
            <button
              type="button"
              onClick={() => setListingType('tabo')}
              className={`text-sm font-medium px-4 py-1 rounded-full transition-colors ${listingType === 'tabo' ? 'bg-[#ffd43b] text-gray-800 shadow-lg' : 'bg-gray-200 text-gray-600'}`}
            >
              טאבו משותף
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="neomorphic-button rounded-lg p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Client Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">בחירת לקוח *</h3>
        <div className="relative">
          <div className="neomorphic-inset rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חפש לקוח לפי שם או טלפון..."
              value={clientSearchTerm}
              onChange={(e) => {
                setClientSearchTerm(e.target.value);
                setShowClientResults(true);
              }}
              onFocus={() => setShowClientResults(true)}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            />
            {formData.clientId && (
              <Check className="w-5 h-5 text-green-500" />
            )}
          </div>

          {showClientResults && clientSearchTerm && (
            <div className="absolute z-10 w-full mt-2 neomorphic-card rounded-xl overflow-hidden shadow-xl">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-4 py-3 text-right hover:bg-[#4a9eff] hover:text-white transition-colors flex flex-col border-b border-gray-200 last:border-none"
                  >
                    <span className="font-bold">{client.firstName} {client.lastName}</span>
                    <span className="text-xs opacity-80">{client.phoneNumbers?.join(', ')}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm italic">לא נמצאו לקוחות</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Images Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">תמונות הנכס</h3>
        <div className="neomorphic-inset rounded-xl p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`neomorphic-button rounded-xl px-6 py-4 flex items-center justify-center gap-3 cursor-pointer hover:text-[#4a9eff] transition-colors ${uploadingImage ? 'opacity-50' : ''}`}
          >
            {uploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4a9eff]"></div>
                <span className="font-medium">מעלה תמונה...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="font-medium">העלה תמונה</span>
              </>
            )}
          </label>

          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative neomorphic-card rounded-xl overflow-hidden group">
                  <img
                    src={imageUrl}
                    alt={`תמונה ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 left-2 neomorphic-button rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 right-2 neomorphic-button rounded-lg px-2 py-1">
                      <span className="text-xs font-bold text-[#4a9eff]">תמונה ראשית</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">כתובת הנכס</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אזור *</label>
            <select
              value={formData.zone}
              onChange={(e) => handleChange('zone', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">עיר *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="ביתר עילית"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">רחוב *</label>
            <input
              type="text"
              required
              autoComplete="street-address"
              value={formData.street}
              onChange={(e) => handleChange('street', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="הרב קוק"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מספר בית</label>
            <input
              type="text"
              value={formData.buildingNumber}
              onChange={(e) => handleChange('buildingNumber', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">קומה</label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) => handleChange('floor', parseInt(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מספר דירה</label>
            <input
              type="text"
              value={formData.aptNumber}
              onChange={(e) => handleChange('aptNumber', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="8"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">פרטי הנכס</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">חדרים *</label>
            <input
              type="number"
              required
              step="0.5"
              value={formData.rooms}
              onChange={(e) => handleChange('rooms', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שטח בנוי (מ"ר) *</label>
            <input
              type="number"
              required
              value={formData.squaredMeters}
              onChange={(e) => handleChange('squaredMeters', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחיר (₪) *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="2500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מצב הנכס</label>
            <select
              value={formData.propertyState}
              onChange={(e) => handleChange('propertyState', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="NewFromContractor">חדש מקבלן</option>
              <option value="New">חדש</option>
              <option value="Renovated">משופץ</option>
              <option value="GoodCondition">מצב טוב</option>
              <option value="NeedsRenovation">זקוק לשיפוץ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תאריך כניסה</label>
            <input
              type="date"
              value={formData.enteringDate}
              onChange={(e) => handleChange('enteringDate', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Tabo Specifics */}
      {listingType === 'tabo' && (
        <div className="neomorphic-card rounded-2xl p-6 bg-[#fff9db] border border-[#ffd43b]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">פרטי טאבו משותף</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">סוג רישום</label>
              <select
                value={formData.registrationType}
                onChange={(e) => handleChange('registrationType', e.target.value)}
                className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              >
                <option value="Tabo">טאבו</option>
                <option value="Name">שם</option>
                <option value="None">לא משנה</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מספר שותפים</label>
              <input
                type="number"
                value={formData.numOfPartners}
                onChange={(e) => handleChange('numOfPartners', parseInt(e.target.value))}
                className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">הון עצמי נדרש (₪)</label>
              <input
                type="number"
                value={formData.requiredEquity}
                onChange={(e) => handleChange('requiredEquity', parseFloat(e.target.value))}
                className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                placeholder="500000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Housing Units Management */}
      <div className="neomorphic-card rounded-2xl p-6 bg-white bg-opacity-40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">יחידות דיור</h3>
          <button
            type="button"
            onClick={addHousingUnit}
            className="neomorphic-button rounded-xl px-4 py-2 text-sm font-medium text-[#4a9eff] hover:bg-[#4a9eff] hover:text-white transition-colors flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" /> {/* Using ImageIcon since it's already imported and looks like a generic 'add' icon in some contexts, or Search */}
            <span>הוסף יחידה</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.housingUnits && formData.housingUnits.length > 0 ? (
            formData.housingUnits.map((unit, index) => (
              <div key={index} className="neomorphic-inset rounded-2xl p-4 relative group animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={() => removeHousingUnit(index)}
                  className="absolute top-2 left-2 neomorphic-button rounded-lg p-2 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">שטח (מ"ר)</label>
                    <input
                      type="number"
                      value={unit.squaredMeters}
                      onChange={(e) => updateHousingUnit(index, 'squaredMeters', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4a9eff] outline-none text-sm py-1"
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">חדרים</label>
                    <input
                      type="number"
                      step="0.5"
                      value={unit.rooms}
                      onChange={(e) => updateHousingUnit(index, 'rooms', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4a9eff] outline-none text-sm py-1"
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">קומה</label>
                    <input
                      type="number"
                      value={unit.floor}
                      onChange={(e) => updateHousingUnit(index, 'floor', parseInt(e.target.value))}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4a9eff] outline-none text-sm py-1"
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">טלפון</label>
                    <input
                      type="tel"
                      value={unit.phoneNumber}
                      onChange={(e) => updateHousingUnit(index, 'phoneNumber', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4a9eff] outline-none text-sm py-1"
                      placeholder='05XXXXXXXX'
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 italic text-sm">
              לא נוספו יחידות דיור
            </div>
          )}
        </div>
      </div>

      {/* Files Upload */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">קבצים מצורפים</h4>
        <div className="neomorphic-inset rounded-xl p-4">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploadingFile}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`neomorphic-button rounded-xl px-6 py-3 flex items-center justify-center gap-3 cursor-pointer hover:text-[#4a9eff] transition-colors ${uploadingFile ? 'opacity-50' : ''}`}
          >
            {uploadingFile ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4a9eff]"></div>
                <span className="font-medium">מעלה קובץ...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="font-medium">העלה קובץ</span>
              </>
            )}
          </label>

          {formData.files && formData.files.length > 0 && (
            <div className="space-y-2 mt-4">
              {formData.files.map((file, index) => (
                <div key={index} className="neomorphic-card rounded-xl p-3 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neomorphic-button rounded-lg p-2 hover:text-[#4a9eff] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="neomorphic-button rounded-lg p-2 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">פרטים נוספים</label>
        <textarea
          value={formData.details}
          onChange={(e) => handleChange('details', e.target.value)}
          rows="4"
          className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800 resize-none"
          placeholder="הערות ופרטים נוספים..."
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