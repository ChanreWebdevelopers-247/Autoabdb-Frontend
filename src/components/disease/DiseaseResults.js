import React from "react";
import Link from "next/link";
import { Edit2Icon, Eye, Grid3X3, List } from "lucide-react";
import HierarchicalDiseaseView from "./HierarchicalDiseaseView";

const DiseaseResults = ({
  loading,
  error,
  hasInteracted,
  entries,
  pagination,
  viewMode,
  setViewMode,
  user,
  clearAllFilters,
  hasActiveFilters,
  handlePageChange,
  dispatch,
  clearError
}) => {
  // Loading State
  if (loading && hasInteracted) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  // Error State
  if (error && hasInteracted) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
        <span className="text-red-500">⚠️</span>
        <span>{error}</span>
        <button
          onClick={() => dispatch(clearError())}
          className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Initial Empty State
  if (!hasInteracted) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500">
        <div className="text-4xl mb-4">🔎</div>
        <h3 className="text-lg font-semibold mb-2">
          Start by searching or using filters
        </h3>
        <p className="text-center">
          Use the search bar or open Advanced Filters to refine your
          results.
        </p>
      </div>
    );
  }

  // No Results State after interaction
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-center mb-4">
          {hasActiveFilters
            ? "Try adjusting your search terms or filters to find more results."
            : "No entries match your current criteria."}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  // Results - Hierarchical View
  if (viewMode === 'hierarchical') {
    return (
      <HierarchicalDiseaseView 
        entries={entries} 
        user={user} 
        loading={loading}
      />
    );
  }

  // Results - Cards View
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="bg-white border border-gray-200 rounded-lg transition-shadow duration-200 p-6"
          >
            {/* Header with Disease Name and Actions */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {entry.disease}
              </h3>
              <div className="flex gap-2 ml-2">
                <Link
                  href={`/dashboard/disease/${entry._id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View Details"
                >
                  <Eye size={16} />
                </Link>
                {(user?.role === 'superAdmin' || user?.role === 'Admin') && (
                  <Link
                    href={`/dashboard/disease/edit/${entry._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Edit Entry"
                  >
                    <Edit2Icon size={16} />
                  </Link>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-3">
              {/* Autoantibody */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autoantibody
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {entry.autoantibody}
                </p>
              </div>

              {/* Autoantigen */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autoantigen
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {entry.autoantigen}
                </p>
              </div>

              {/* Epitope */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Epitope
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  {entry.epitope || (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </p>
              </div>

              {/* UniProt ID */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UniProt ID
                </label>
                <div className="mt-1">
                  {entry.uniprotId ? (
                    <Link
                      href={`https://www.uniprot.org/uniprot/${entry.uniprotId}/entry`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm font-bold"
                    >
                      {entry.uniprotId}
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic text-sm">N/A</span>
                  )}
                </div>
              </div>

              {/* Type */}
              {entry.type && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {entry.type}
                  </p>
                </div>
              )}


              {/* Bottom Row with Diagnostic Marker and Sensitivity */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                {/* Diagnostic Marker */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnostic Marker
                  </label>
                  <div className="mt-1">
                    {entry.diagnosticMarker ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entry.diagnosticMarker.toLowerCase() === 'yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.diagnosticMarker}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">N/A</span>
                    )}
                  </div>
                </div>

                {/* Sensitivity */}
                {entry.sensitivity && (
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sensitivity
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {entry.sensitivity}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Results - Table View
  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Disease
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Autoantibody
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Autoantigen
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Epitope
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                UniProt ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Diagnostic Marker
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sensitivity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr
                key={entry._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {entry.disease}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {entry.autoantibody}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {entry.autoantigen}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {entry.epitope || (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {entry.uniprotId ? (
                    <Link
                      href={`https://www.uniprot.org/uniprot/${entry.uniprotId}/entry`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-xs font-bold"
                    >
                      {entry.uniprotId}
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {entry.type || (
                    <span className="text-gray-400 italic"></span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {entry.diagnosticMarker ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      entry.diagnosticMarker.toLowerCase() === 'yes' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.diagnosticMarker}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {entry.sensitivity || (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/disease/${entry._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    {(user?.role === 'superAdmin' || user?.role === 'Admin') && (
                      <Link
                        href={`/dashboard/disease/edit/${entry._id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2Icon size={16} />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default DiseaseResults;

