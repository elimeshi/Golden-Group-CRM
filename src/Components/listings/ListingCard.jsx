import React from "react";
import { MapPin, Edit, Bed, Maximize, Car, Star, ImageIcon } from "lucide-react";

const propertyTypeIcons = {
  'טאבו משותף': '🏘️',
  'דירה רגילה': '🏢',
  '+יחידה': '🏠',
  '+ 2 יחידות': '🏘️',
  '+3 יחידות': '🏘️',
  'קוטג': '🏡'
};

export default function ListingCard({ listing, onEdit }) {
  const formatPrice = (price) => {
    if (!price) return 'לא צוין';
    if (price >= 1000000) {
      return `₪${(price / 1000000).toFixed(2)}M`;
    }
    return `₪${(price / 1000).toFixed(0)}K`;
  };

  const getAddress = () => {
    const parts = [listing.street, listing.buildingNumber, listing.zone].filter(Boolean);
    return parts.join(', ');
  };

  const mainImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <div className="neomorphic-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-200">
      {/* Listing Type / Image Header */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-[#4a9eff] to-[#3b7ec9]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={listing.city}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {listing.registrationType === 'Tabo' ? '🏘️' : '🏢'}
          </div>
        )}

        {/* Image Count Badge */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 right-3 neomorphic-button rounded-full px-3 py-1 flex items-center gap-1 bg-black bg-opacity-50 backdrop-blur-sm">
            <ImageIcon className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">{listing.images.length}</span>
          </div>
        )}

        {/* Tabo Badge */}
        {listing.registrationType === 'Tabo' && (
          <div className="absolute top-3 right-3 neomorphic-button rounded-full px-3 py-1 flex items-center gap-1 bg-[#ffd43b]">
            <Star className="w-4 h-4 text-gray-800" fill="currentColor" />
            <span className="text-xs font-bold text-gray-800">טאבו</span>
          </div>
        )}

        {/* Edit Button */}
        <button
          onClick={() => onEdit(listing)}
          className="absolute top-3 left-3 neomorphic-button rounded-lg p-2 hover:text-[#4a9eff] transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {/* Location & Address */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-lg mb-2">
            {listing.city} {listing.registrationType === 'Tabo' ? '(טאבו משותף)' : ''}
          </h3>
          <div className="neomorphic-inset rounded-xl p-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-800">{getAddress()}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {listing.rooms && (
            <div className="neomorphic-inset rounded-lg p-2 text-center">
              <Bed className="w-4 h-4 text-gray-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-800">{listing.rooms} חדרים</p>
            </div>
          )}
          {listing.squaredMeters && (
            <div className="neomorphic-inset rounded-lg p-2 text-center">
              <Maximize className="w-4 h-4 text-gray-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-800">{listing.squaredMeters} מ"ר</p>
            </div>
          )}
          {listing.floor !== undefined && (
            <div className="neomorphic-inset rounded-lg p-2 text-center">
              <div className="text-xs text-gray-600 mb-1">קומה</div>
              <p className="text-xs font-semibold text-gray-800">{listing.floor}</p>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="neomorphic-card rounded-xl p-4 text-center mb-4">
          <p className="text-xs text-gray-600 mb-1">מחיר מבוקש</p>
          <p className="text-2xl font-bold text-[#4a9eff]">
            {formatPrice(listing.price)}
          </p>
        </div>

        {/* Housing Units */}
        {listing.housingUnits && listing.housingUnits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">יחידות דיור ({listing.housingUnits.length})</h4>
            <div className="grid grid-cols-1 gap-2">
              {listing.housingUnits.map((unit, index) => (
                <div key={index} className="neomorphic-inset rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-gray-500" />
                      <span className="font-semibold">{unit.rooms || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
                      <Maximize className="w-3 h-3 text-gray-500" />
                      <span className="font-semibold">{unit.squaredMeters || 0} מ"ר</span>
                    </div>
                  </div>
                  <div className="text-gray-600 font-medium">
                    קומה {unit.floor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {listing.id && (
          <div className="mt-4 pt-4 border-t border-gray-300 text-center">
            <span className="text-xs text-gray-500">מזהה נכס: {listing.id}</span>
          </div>
        )}
      </div>
    </div>
  );
}