import React, { useRef, useMemo } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  localFilters,
  handleFiltersChange,
  handleSearch,
  showSuggestions,
  searchResults,
  searchLoading,
  selectSuggestion,
  searchContainerRef
}) => {
  // Build grouped unique suggestions from search results
  const groupedSuggestions = useMemo(() => {
    const limitPerGroup = 6;
    const addUnique = (set, val) => {
      if (!val) return;
      const v = val.toString().trim();
      if (v && !set.has(v)) set.add(v);
    };
    const diseases = new Set();
    const antibodies = new Set();
    const antigens = new Set();
    const epitopes = new Set();
    const types = new Set();
    const uniprotIds = new Set();
    (searchResults || []).forEach((r) => {
      addUnique(diseases, r.disease);
      addUnique(antibodies, r.autoantibody);
      addUnique(antigens, r.autoantigen);
      addUnique(epitopes, r.epitope);
      addUnique(types, r.type);
      addUnique(uniprotIds, r.uniprotId);
    });
    return {
      disease: Array.from(diseases).slice(0, limitPerGroup),
      autoantibody: Array.from(antibodies).slice(0, limitPerGroup),
      autoantigen: Array.from(antigens).slice(0, limitPerGroup),
      epitope: Array.from(epitopes).slice(0, limitPerGroup),
      type: Array.from(types).slice(0, limitPerGroup),
      uniprotId: Array.from(uniprotIds).slice(0, limitPerGroup),
    };
  }, [searchResults]);

  return (
    <div className="flex flex-1 gap-2" ref={searchContainerRef}>
      <select
        value={localFilters.field}
        onChange={(e) => handleFiltersChange({ field: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Fields</option>
        <option value="disease">Disease Name</option>
        <option value="autoantibody">Autoantibody</option>
        <option value="autoantigen">Autoantigen</option>
        <option value="epitope">Epitope</option>
        <option value="type">Type</option>
        <option value="uniprotId">UniProt ID</option>
      </select>

      <input
        type="text"
        placeholder={`Search ${
          localFilters.field === "all" ? "all fields" : localFilters.field
        }...`}
        value={localFilters.search}
        onChange={(e) => handleFiltersChange({ search: e.target.value })}
        className="flex-1 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />

      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <Search size={16} />
      </button>
      
      {showSuggestions && (
        <div className="absolute z-20 mt-12 w-full max-w-4xl bg-white border border-gray-200 rounded-md p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["disease", "autoantibody", "autoantigen", "epitope", "type", "uniprotId"].map(
              (section) => (
                <div key={section}>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    {section === 'uniprotId' ? 'UniProt ID' : section}
                  </div>
                  {searchLoading && (
                    <div className="text-xs text-gray-400">Loading...</div>
                  )}
                  {!searchLoading &&
                    groupedSuggestions[section]?.length === 0 && (
                      <div className="text-xs text-gray-400">
                        No suggestions
                      </div>
                    )}
                  <ul className="space-y-1 max-h-40 overflow-auto">
                    {groupedSuggestions[section]?.map((val) => (
                      <li key={`${section}-${val}`}>
                        <button
                          onClick={() => selectSuggestion(section, val)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
                        >
                          {val}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
