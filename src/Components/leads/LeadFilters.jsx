import React from "react";

export default function LeadFilters({ filters, setFilters }) {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="חדש">חדש</option>
            <option value="יוצר קשר">יוצר קשר</option>
            <option value="מתעניין חם">מתעניין חם</option>
            <option value="מתעניין פושר">מתעניין פושר</option>
            <option value="לא רלוונטי">לא רלוונטי</option>
            <option value="נסגר - הומר ללקוח">נסגר - הומר ללקוח</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג ליד</label>
          <select
            value={filters.lead_type}
            onChange={(e) => handleFilterChange('lead_type', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="קונה">קונה</option>
            <option value="מוכר">מוכר</option>
            <option value="משקיע">משקיע</option>
            <option value="שוכר">שוכר</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">מקור</label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full neomorphic-inset rounded-xl px-4 py-2 bg-transparent text-gray-800 text-sm"
          >
            <option value="הכל">הכל</option>
            <option value="נמוכה">נמוכה</option>
            <option value="בינונית">בינונית</option>
            <option value="גבוהה">גבוהה</option>
          </select>
        </div>
      </div>
    </div>
  );
}