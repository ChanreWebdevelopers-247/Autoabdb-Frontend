import React from "react";
import { Grid3X3, List, Layers } from "lucide-react";

const DiseaseViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 text-sm">View:</span>
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <button
          onClick={() => setViewMode('hierarchical')}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'hierarchical'
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          title="Hierarchical View"
        >
          <Layers size={16} />
          Hierarchical
        </button>
        <button
          onClick={() => setViewMode('cards')}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'cards'
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          title="Card View"
        >
          <Grid3X3 size={16} />
          Cards
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'table'
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          title="Table View"
        >
          <List size={16} />
          Table
        </button>
      </div>
    </div>
  );
};

export default DiseaseViewToggle;

