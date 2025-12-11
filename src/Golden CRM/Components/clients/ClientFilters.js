import React from "react";

export default function ClientFilters({ filters, setFilters }) {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="חדש">חדש</option>
            <option value="בתהליך">בתהליך</option>
            <option value="הקפאה">הקפאה</option>
            <option value="נסגר">נסגר</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">מימון מאושר</label>
          <select
            value={filters.financing_approved}
            onChange={(e) => handleFilterChange('financing_approved', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="כן">מאושר</option>
            <option value="לא">לא מאושר</option>
          </select>
        </div>
      </div>
    </div>
  );
}