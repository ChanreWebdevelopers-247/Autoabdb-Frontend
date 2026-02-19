import React from "react";
import { X } from "lucide-react";
import SearchableDropdown from "../SearchableDropdown";

const DiseaseFilters = ({
  showFilters,
  localFilters,
  uniqueValues,
  filteredUniqueValues,
  uniqueValuesLoading,
  hasActiveFilters,
  clearAllFilters,
  handleDiseaseChange,
  handleAutoantibodyChange,
  handleAntigenChange,
  handleEpitopeChange,
  handleTypeChange,
  handleUniprotIdChange,
  appliedFilters
}) => {
  if (!showFilters) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Advanced Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Disease Filter */}
        <SearchableDropdown
          label="Disease"
          value={localFilters.disease}
          onChange={handleDiseaseChange}
          options={
            localFilters.autoantibody
              ? (filteredUniqueValues.disease || [])
              : localFilters.autoantigen
              ? (filteredUniqueValues.disease || [])
              : (uniqueValues.disease || [])
          }
          placeholder="All Diseases"
          loading={uniqueValuesLoading}
        />

        {/* Autoantibody Filter */}
        <SearchableDropdown
          label="Autoantibody"
          value={localFilters.autoantibody}
          onChange={handleAutoantibodyChange}
          options={
            localFilters.disease
              ? (filteredUniqueValues.autoantibody || [])
              : localFilters.autoantigen
              ? (filteredUniqueValues.autoantibody || [])
              : (uniqueValues.autoantibody || [])
          }
          placeholder="All Autoantibodies"
          loading={uniqueValuesLoading}
        />

        {/* Autoantigen Filter */}
        <SearchableDropdown
          label="Autoantigen"
          value={localFilters.autoantigen}
          onChange={handleAntigenChange}
          options={
            localFilters.autoantibody
              ? (filteredUniqueValues.autoantigen || [])
              : localFilters.disease
              ? (filteredUniqueValues.autoantigen || [])
              : (uniqueValues.autoantigen || [])
          }
          placeholder="All Autoantigens"
          loading={uniqueValuesLoading}
        />

        {/* Epitope Filter */}
        <SearchableDropdown
          label="Epitope"
          value={localFilters.epitope}
          onChange={handleEpitopeChange}
          options={
            localFilters.autoantibody
              ? (filteredUniqueValues.epitope || [])
              : localFilters.autoantigen
              ? (filteredUniqueValues.epitope || [])
              : localFilters.disease
              ? (filteredUniqueValues.epitope || [])
              : (uniqueValues.epitope || [])
          }
          placeholder="All Epitopes"
          loading={uniqueValuesLoading}
        />

        {/* Type Filter */}
        {/* <SearchableDropdown
          label="Type"
          value={localFilters.type}
          onChange={handleTypeChange}
          options={
            localFilters.autoantibody
              ? (filteredUniqueValues.type || [])
              : localFilters.autoantigen || localFilters.epitope || localFilters.disease
              ? (filteredUniqueValues.type || [])
              : (uniqueValues.type || [])
          }
          placeholder="All Types"
          loading={uniqueValuesLoading}
        /> */}

        {/* UniProt ID Filter */}
        <SearchableDropdown
          label="UniProt ID"
          value={localFilters.uniprotId}
          onChange={handleUniprotIdChange}
          options={
            localFilters.autoantibody
              ? (filteredUniqueValues.uniprotId || [])
              : localFilters.autoantigen || localFilters.epitope || localFilters.type || localFilters.disease
              ? (filteredUniqueValues.uniprotId || [])
              : (uniqueValues.uniprotId || [])
          }
          placeholder="All UniProt IDs"
          loading={uniqueValuesLoading}
        />
      </div>

      {/* Applied Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>
            {appliedFilters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: &quot;{appliedFilters.search}&quot;
              </span>
            )}
            {appliedFilters.disease && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Disease: {appliedFilters.disease}
              </span>
            )}
            {appliedFilters.autoantibody && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Autoantibody: {appliedFilters.autoantibody}
              </span>
            )}
            {appliedFilters.autoantigen && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Autoantigen: {appliedFilters.autoantigen}
              </span>
            )}
            {appliedFilters.epitope && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                Epitope: {appliedFilters.epitope}
              </span>
            )}
            {appliedFilters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                Type: {appliedFilters.type}
              </span>
            )}
            {appliedFilters.uniprotId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                UniProt ID: {appliedFilters.uniprotId}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseFilters;

