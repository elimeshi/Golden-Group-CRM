import React, { useState } from "react";
import { X, Save, Upload, Image as ImageIcon, Trash2, FileText, Download } from "lucide-react";
import { integrations } from "@/api/apiClient.js";

export default function ListingForm({ listing, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(listing || {
    listing_number: '',
    location: '',
    neighborhood: '',
    street: '',
    building_number: '',
    floor: '',
    apartment_number: '',
    property_type: '',
    rooms: '',
    sqm_built: '',
    balcony_sqm: '',
    storage_sqm: '',
    parking_spots: 0,
    view_direction: '',
    property_condition: '',
    price_ask: '',
    price_published: '',
    is_exclusive: false,
    exclusive_start: '',
    exclusive_end: '',
    seller_name: '',
    seller_phone: '',
    seller_email: '',
    renter_phone: '',
    images: [],
    files: [],
    notes: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {listing ? 'עריכת נכס' : 'נכס חדש'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="neomorphic-button rounded-lg p-2"
        >
          <X className="w-5 h-5" />
        </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">שכונה</label>
            <select
              value={formData.neighborhood}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="">בחר שכונה</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">רחוב *</label>
            <input
              type="text"
              required
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
              value={formData.building_number}
              onChange={(e) => handleChange('building_number', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">קומה</label>
            <input
              type="text"
              value={formData.floor}
              onChange={(e) => handleChange('floor', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מספר דירה</label>
            <input
              type="text"
              value={formData.apartment_number}
              onChange={(e) => handleChange('apartment_number', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג נכס *</label>
            <select
              required
              value={formData.property_type}
              onChange={(e) => handleChange('property_type', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="">בחר סוג</option>
              <option value="טאבו משותף">טאבו משותף</option>
              <option value="דירה רגילה">דירה רגילה</option>
              <option value="+יחידה">+יחידה</option>
              <option value="+ 2 יחידות">+ 2 יחידות</option>
              <option value="+3 יחידות">+3 יחידות</option>
              <option value="קוטג">קוטג</option>
            </select>
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">שטח בנוי (מ"ר)</label>
            <input
              type="number"
              value={formData.sqm_built}
              onChange={(e) => handleChange('sqm_built', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מרפסת (מ"ר)</label>
            <input
              type="number"
              value={formData.balcony_sqm}
              onChange={(e) => handleChange('balcony_sqm', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחסן (מ"ר)</label>
            <input
              type="number"
              value={formData.storage_sqm}
              onChange={(e) => handleChange('storage_sqm', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">חניות</label>
            <input
              type="number"
              value={formData.parking_spots}
              onChange={(e) => handleChange('parking_spots', parseInt(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">נוף וכיוון</label>
            <input
              type="text"
              value={formData.view_direction}
              onChange={(e) => handleChange('view_direction', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="מזרח, נוף להרים"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מצב הנכס</label>
            <select
              value={formData.property_condition}
              onChange={(e) => handleChange('property_condition', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="">בחר מצב</option>
              <option value="בנייה">בנייה</option>
              <option value="חדשה מקבלן">חדשה מקבלן</option>
              <option value="מושקעת">מושקעת</option>
              <option value="שמורה">שמורה</option>
              <option value="רגילה">רגילה</option>
              <option value="זקוקה לשיפוץ קוסמטי">זקוקה לשיפוץ קוסמטי</option>
              <option value="זקוקה לשיפוץ">זקוקה לשיפוץ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">תמחור</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחיר מבוקש (₪) *</label>
            <input
              type="number"
              required
              value={formData.price_ask}
              onChange={(e) => handleChange('price_ask', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="2500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחיר לפרסום (₪)</label>
            <input
              type="number"
              value={formData.price_published}
              onChange={(e) => handleChange('price_published', parseFloat(e.target.value))}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="2600000"
            />
          </div>
        </div>
      </div>

      {/* Status & Seller */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">סטטוס ומוכר</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מיקום</label>
            <select
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
            >
              <option value="">בחר מיקום</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C">C</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-7">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_exclusive}
                onChange={(e) => handleChange('is_exclusive', e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">בלעדיות</span>
            </label>
          </div>

          {formData.is_exclusive && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תחילת בלעדיות</label>
                <input
                  type="date"
                  value={formData.exclusive_start}
                  onChange={(e) => handleChange('exclusive_start', e.target.value)}
                  className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">סיום בלעדיות</label>
                <input
                  type="date"
                  value={formData.exclusive_end}
                  onChange={(e) => handleChange('exclusive_end', e.target.value)}
                  className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם המוכר</label>
            <input
              type="text"
              value={formData.seller_name}
              onChange={(e) => handleChange('seller_name', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="שם מלא"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון מוכר</label>
            <input
              type="tel"
              value={formData.seller_phone}
              onChange={(e) => handleChange('seller_phone', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="05X-XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">דוא"ל מוכר</label>
            <input
              type="email"
              value={formData.seller_email}
              onChange={(e) => handleChange('seller_email', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון שוכר</label>
            <input
              type="tel"
              value={formData.renter_phone}
              onChange={(e) => handleChange('renter_phone', e.target.value)}
              className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800"
              placeholder="05X-XXXXXXX"
            />
          </div>
        </div>

        {/* Files Upload */}
        <div className="mt-6">
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
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows="4"
          className="w-full neomorphic-inset rounded-xl px-4 py-3 bg-transparent text-gray-800 resize-none"
          placeholder="הערות נוספות על הנכס..."
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