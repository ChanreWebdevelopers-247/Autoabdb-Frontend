import React from "react";

const DiseasePagination = ({ pagination, handlePageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
          of {pagination.total} results
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {/* Show page numbers */}
          {Array.from(
            { length: Math.min(5, pagination.pages) },
            (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    pagination.page === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}
        </div>

        <button
          disabled={pagination.page === pagination.pages}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DiseasePagination;

