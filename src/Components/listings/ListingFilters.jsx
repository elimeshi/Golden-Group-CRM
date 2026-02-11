import React from "react";

export default function ListingFilters({ filters, setFilters }) {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">אזור (Zone)</label>
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C">C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">עיר</label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="חפש עיר..."
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג רישום</label>
          <select
            value={filters.registrationType}
            onChange={(e) => handleFilterChange('registrationType', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="Tabo">טאבו משותף</option>
            <option value="Normal">דירה רגילה</option>
          </select>
        </div>
      </div>
    </div>
  );
}