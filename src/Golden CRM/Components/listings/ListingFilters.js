import React from "react";

export default function ListingFilters({ filters, setFilters }) {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג נכס</label>
          <select
            value={filters.property_type}
            onChange={(e) => handleFilterChange('property_type', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="טאבו משותף">טאבו משותף</option>
            <option value="דירה רגילה">דירה רגילה</option>
            <option value="+יחידה">+יחידה</option>
            <option value="+ 2 יחידות">+ 2 יחידות</option>
            <option value="+3 יחידות">+3 יחידות</option>
            <option value="קוטג">קוטג</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">מיקום</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">בלעדיות</label>
          <select
            value={filters.is_exclusive}
            onChange={(e) => handleFilterChange('is_exclusive', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="כן">בלעדי</option>
            <option value="לא">לא בלעדי</option>
          </select>
        </div>
      </div>
    </div>
  );
}