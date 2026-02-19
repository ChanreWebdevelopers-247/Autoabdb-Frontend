// diseaseSlice.js - Updated with better filtering support

import { createSlice } from '@reduxjs/toolkit';
import {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  advancedSearch,
  getEntriesByDisease,
  getEntriesByUniprotId,
  getUniqueValues,
  getFilteredUniqueValues,
  getStatistics,
  getDistinctAdditionalKeys,
  bulkImport,
  exportEntries,
  importEntriesFromFile,
  getDiseasesSummary,
  findByDiseaseAndAutoantibody,
  findByAutoantibodyOrSynonym,
  findByDiagnosticMethod
} from '../actions/diseaseActions';

const initialState = {
  // Main data
  entries: [],
  currentEntry: null,
  relatedEntries: [],
  
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  
  // Applied filters (what's currently active on backend)
  appliedFilters: {
    search: null,
    field: null,
    disease: null,
    autoantibody: null,
    autoantigen: null,
    epitope: null,
    uniprotId: null,
    diseaseAssociation: null,
    affinity: null,
    sensitivity: null,
    diagnosticMarker: null,
    associationWithDiseaseActivity: null,
    pathogenesisInvolvement: null,
    reference: null,
    databaseAccessionNumbers: null,
    synonym: null,
    screening: null,
    confirmation: null,
    monitoring: null,
    positivePredictiveValues: null,
    negativePredictiveValues: null,
    crossReactivityPatterns: null,
    referenceRangesAndCutoffValues: null,
    type: null,
    sortBy: 'disease',
    sortOrder: 'asc'
  },
  
  // Loading states
  loading: false,
  entryLoading: false,
  searchLoading: false,
  advancedSearchLoading: false,
  statisticsLoading: false,
  additionalKeysLoading: false,
  exportLoading: false,
  bulkImportLoading: false,
  uniqueValuesLoading: false,
  diseasesSummaryLoading: false,
  diseaseAutoantibodySearchLoading: false,
  autoantibodySynonymSearchLoading: false,
  diagnosticMethodSearchLoading: false,
  
  // Error states
  error: null,
  entryError: null,
  searchError: null,
  advancedSearchError: null,
  statisticsError: null,
  additionalKeysError: null,
  exportError: null,
  bulkImportError: null,
  uniqueValuesError: null,
  diseasesSummaryError: null,
  diseaseAutoantibodySearchError: null,
  autoantibodySynonymSearchError: null,
  diagnosticMethodSearchError: null,
  
  // Search results
  searchResults: [],
  searchCount: 0,
  advancedSearchResults: [],
  advancedSearchStats: null,
  diseasesSummary: [],
  diseaseAutoantibodySearchResults: [],
  autoantibodySynonymSearchResults: [],
  diagnosticMethodSearchResults: [],
  
  // Filter data
  uniqueValues: {
    disease: [],
    autoantibody: [],
    autoantigen: [],
    epitope: [],
    uniprotId: [],
    diseaseAssociation: [],
    affinity: [],
    sensitivity: [],
    diagnosticMarker: [],
    associationWithDiseaseActivity: [],
    pathogenesisInvolvement: [],
    reference: [],
    databaseAccessionNumbers: [],
    synonym: [],
    screening: [],
    confirmation: [],
    monitoring: [],
    positivePredictiveValues: [],
    negativePredictiveValues: [],
    crossReactivityPatterns: [],
    referenceRangesAndCutoffValues: [],
    type: []
  },
  
  // Filtered unique values (based on current filter dependencies)
  filteredUniqueValues: {
    disease: [],
    autoantibody: [],
    autoantigen: [],
    epitope: [],
    uniprotId: [],
    diseaseAssociation: [],
    affinity: [],
    sensitivity: [],
    diagnosticMarker: [],
    associationWithDiseaseActivity: [],
    pathogenesisInvolvement: [],
    reference: [],
    databaseAccessionNumbers: [],
    synonym: [],
    screening: [],
    confirmation: [],
    monitoring: [],
    positivePredictiveValues: [],
    negativePredictiveValues: [],
    crossReactivityPatterns: [],
    referenceRangesAndCutoffValues: [],
    type: []
  },
  
  // Statistics
  statistics: {
    overview: {},
    diseaseBreakdown: [],
    topAntibodies: [],
    topAntigens: []
  },
  
  // Additional keys for dynamic fields
  additionalKeys: [],
  
  // UI states
  filters: {
    search: '',
    field: 'all',
    disease: '',
    autoantibody: '',
    autoantigen: '',
    epitope: '',
    uniprotId: '',
    diseaseAssociation: '',
    affinity: '',
    sensitivity: '',
    diagnosticMarker: '',
    associationWithDiseaseActivity: '',
    pathogenesisInvolvement: '',
    reference: '',
    databaseAccessionNumbers: '',
    synonym: '',
    screening: '',
    confirmation: '',
    monitoring: '',
    positivePredictiveValues: '',
    negativePredictiveValues: '',
    crossReactivityPatterns: '',
    referenceRangesAndCutoffValues: '',
    type: '',
    sortBy: 'disease',
    sortOrder: 'asc'
  },
  
  // Success states
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  bulkImportSuccess: false,
  exportSuccess: false
};

const diseaseSlice = createSlice({
  name: 'disease',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    clearEntryError: (state) => {
      state.entryError = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    clearAdvancedSearchError: (state) => {
      state.advancedSearchError = null;
    },
    clearStatisticsError: (state) => {
      state.statisticsError = null;
    },
    clearAdditionalKeysError: (state) => {
      state.additionalKeysError = null;
    },
    clearExportError: (state) => {
      state.exportError = null;
    },
    clearBulkImportError: (state) => {
      state.bulkImportError = null;
    },
    clearUniqueValuesError: (state) => {
      state.uniqueValuesError = null;
    },
    clearDiseasesSummaryError: (state) => {
      state.diseasesSummaryError = null;
    },
    clearDiseaseAutoantibodySearchError: (state) => {
      state.diseaseAutoantibodySearchError = null;
    },
    clearAutoantibodySynonymSearchError: (state) => {
      state.autoantibodySynonymSearchError = null;
    },
    clearDiagnosticMethodSearchError: (state) => {
      state.diagnosticMethodSearchError = null;
    },
    
    // Clear success states
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    clearBulkImportSuccess: (state) => {
      state.bulkImportSuccess = false;
    },
    clearExportSuccess: (state) => {
      state.exportSuccess = false;
    },
    
    // Update filters (UI state only)
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        search: '',
        field: 'all',
        disease: '',
        autoantibody: '',
        autoantigen: '',
        epitope: '',
        uniprotId: '',
        diseaseAssociation: '',
        affinity: '',
        sensitivity: '',
        diagnosticMarker: '',
        associationWithDiseaseActivity: '',
        pathogenesisInvolvement: '',
        reference: '',
        databaseAccessionNumbers: '',
        synonym: '',
        screening: '',
        confirmation: '',
        monitoring: '',
        positivePredictiveValues: '',
        negativePredictiveValues: '',
        crossReactivityPatterns: '',
        referenceRangesAndCutoffValues: '',
        type: '',
        sortBy: 'disease',
        sortOrder: 'asc'
      };
      // Also reset filtered unique values when clearing filters
      state.filteredUniqueValues = {
        disease: [...state.uniqueValues.disease],
        autoantibody: [],
        autoantigen: [],
        epitope: [],
        uniprotId: [],
        diseaseAssociation: [],
        affinity: [],
        sensitivity: [],
        diagnosticMarker: [],
        associationWithDiseaseActivity: [],
        pathogenesisInvolvement: [],
        reference: [],
        databaseAccessionNumbers: [],
        synonym: [],
        screening: [],
        confirmation: [],
        monitoring: [],
        positivePredictiveValues: [],
        negativePredictiveValues: [],
        crossReactivityPatterns: [],
        referenceRangesAndCutoffValues: [],
        type: []
      };
    },
    
    // Reset dependent filters when parent filter changes
    resetDependentFilters: (state, action) => {
      const { field } = action.payload;
      
      if (field === 'disease') {
        // Disease is the base filter - reset all dependent filters and search
        state.filters.search = '';
        state.filters.autoantibody = '';
        state.filters.autoantigen = '';
        state.filters.epitope = '';
        state.filters.type = '';
        state.filters.uniprotId = '';
        state.filteredUniqueValues.autoantibody = [];
        state.filteredUniqueValues.autoantigen = [];
        state.filteredUniqueValues.epitope = [];
        state.filteredUniqueValues.type = [];
        state.filteredUniqueValues.uniprotId = [];
      } else if (field === 'autoantibody') {
        // Autoantibody change resets autoantigen, epitope, type, and uniprotId
        state.filters.autoantigen = '';
        state.filters.epitope = '';
        state.filters.type = '';
        state.filters.uniprotId = '';
        state.filteredUniqueValues.autoantigen = [];
        state.filteredUniqueValues.epitope = [];
        state.filteredUniqueValues.type = [];
        state.filteredUniqueValues.uniprotId = [];
      } else if (field === 'autoantigen') {
        // Autoantigen change resets epitope, type, and uniprotId
        state.filters.epitope = '';
        state.filters.type = '';
        state.filters.uniprotId = '';
        state.filteredUniqueValues.epitope = [];
        state.filteredUniqueValues.type = [];
        state.filteredUniqueValues.uniprotId = [];
      } else if (field === 'epitope') {
        // Epitope change resets type and uniprotId
        state.filters.type = '';
        state.filters.uniprotId = '';
        state.filteredUniqueValues.type = [];
        state.filteredUniqueValues.uniprotId = [];
      } else if (field === 'type') {
        // Type change resets uniprotId
        state.filters.uniprotId = '';
        state.filteredUniqueValues.uniprotId = [];
      }
      // uniprotId is the final filter - no dependent filters to reset
    },
    
    // Clear current entry
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
      state.relatedEntries = [];
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchCount = 0;
      state.advancedSearchResults = [];
      state.advancedSearchStats = null;
    },
    
    // Reset all states
    resetDiseaseState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all entries
      .addCase(getAllEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.appliedFilters = action.payload.appliedFilters || state.appliedFilters;
        state.error = null;
      })
      .addCase(getAllEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.entries = [];
      })
      
      // Get entry by ID
      .addCase(getEntryById.pending, (state) => {
        state.entryLoading = true;
        state.entryError = null;
      })
      .addCase(getEntryById.fulfilled, (state, action) => {
        state.entryLoading = false;
        state.currentEntry = action.payload.data;
        state.relatedEntries = action.payload.relatedEntries || [];
        state.entryError = null;
      })
      .addCase(getEntryById.rejected, (state, action) => {
        state.entryLoading = false;
        state.entryError = action.payload;
        state.currentEntry = null;
        state.relatedEntries = [];
      })
      
      // Create entry
      .addCase(createEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload.data);
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update entry
      .addCase(updateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEntry = action.payload.data;
        const index = state.entries.findIndex(entry => entry._id === updatedEntry._id);
        if (index !== -1) {
          state.entries[index] = updatedEntry;
        }
        if (state.currentEntry && state.currentEntry._id === updatedEntry._id) {
          state.currentEntry = updatedEntry;
        }
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete entry
      .addCase(deleteEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.deletedId;
        state.entries = state.entries.filter(entry => entry._id !== deletedId);
        if (state.currentEntry && state.currentEntry._id === deletedId) {
          state.currentEntry = null;
          state.relatedEntries = [];
        }
        state.deleteSuccess = true;
        state.error = null;
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // Search entries
      .addCase(searchEntries.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchEntries.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data || [];
        state.searchCount = action.payload.count || 0;
        state.searchError = null;
      })
      .addCase(searchEntries.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = [];
        state.searchCount = 0;
      })
      
      // Advanced search
      .addCase(advancedSearch.pending, (state) => {
        state.advancedSearchLoading = true;
        state.advancedSearchError = null;
      })
      .addCase(advancedSearch.fulfilled, (state, action) => {
        state.advancedSearchLoading = false;
        state.advancedSearchResults = action.payload.data || [];
        state.advancedSearchStats = action.payload.stats || null;
        state.advancedSearchError = null;
      })
      .addCase(advancedSearch.rejected, (state, action) => {
        state.advancedSearchLoading = false;
        state.advancedSearchError = action.payload;
        state.advancedSearchResults = [];
        state.advancedSearchStats = null;
      })
      
      // Get entries by disease
      .addCase(getEntriesByDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntriesByDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data || [];
        state.error = null;
      })
      .addCase(getEntriesByDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.entries = [];
      })
      
      // Get entries by UniProt ID
      .addCase(getEntriesByUniprotId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntriesByUniprotId.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data || [];
        state.error = null;
      })
      .addCase(getEntriesByUniprotId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.entries = [];
      })
      
      // Get unique values
      .addCase(getUniqueValues.pending, (state) => {
        state.uniqueValuesLoading = true;
        state.uniqueValuesError = null;
      })
      .addCase(getUniqueValues.fulfilled, (state, action) => {
        state.uniqueValuesLoading = false;
        const { field, data } = action.payload;
        if (field && state.uniqueValues.hasOwnProperty(field)) {
          state.uniqueValues[field] = data || [];
          // Initialize filtered values for disease field
          if (field === 'disease') {
            state.filteredUniqueValues[field] = data || [];
          }
        }
        state.uniqueValuesError = null;
      })
      .addCase(getUniqueValues.rejected, (state, action) => {
        state.uniqueValuesLoading = false;
        state.uniqueValuesError = action.payload;
      })
      
      // Get filtered unique values
      .addCase(getFilteredUniqueValues.pending, (state) => {
        state.uniqueValuesLoading = true;
        state.uniqueValuesError = null;
      })
      .addCase(getFilteredUniqueValues.fulfilled, (state, action) => {
        state.uniqueValuesLoading = false;
        const { field, data } = action.payload;
        if (field && state.filteredUniqueValues.hasOwnProperty(field)) {
          state.filteredUniqueValues[field] = data || [];
        }
        state.uniqueValuesError = null;
      })
      .addCase(getFilteredUniqueValues.rejected, (state, action) => {
        state.uniqueValuesLoading = false;
        state.uniqueValuesError = action.payload;
      })
      
      // Get statistics
      .addCase(getStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload.data || state.statistics;
        state.statisticsError = null;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statisticsError = action.payload;
      })
      
      // Get distinct additional keys
      .addCase(getDistinctAdditionalKeys.pending, (state) => {
        state.additionalKeysLoading = true;
        state.additionalKeysError = null;
      })
      .addCase(getDistinctAdditionalKeys.fulfilled, (state, action) => {
        state.additionalKeysLoading = false;
        state.additionalKeys = action.payload.data || [];
        state.additionalKeysError = null;
      })
      .addCase(getDistinctAdditionalKeys.rejected, (state, action) => {
        state.additionalKeysLoading = false;
        state.additionalKeysError = action.payload;
      })
      
      // Bulk import
      .addCase(bulkImport.pending, (state) => {
        state.bulkImportLoading = true;
        state.bulkImportError = null;
        state.bulkImportSuccess = false;
      })
      .addCase(bulkImport.fulfilled, (state, action) => {
        state.bulkImportLoading = false;
        state.bulkImportSuccess = true;
        state.bulkImportError = null;
      })
      .addCase(bulkImport.rejected, (state, action) => {
        state.bulkImportLoading = false;
        state.bulkImportError = action.payload;
        state.bulkImportSuccess = false;
      })
      
      // Export entries
      .addCase(exportEntries.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
        state.exportSuccess = false;
      })
      .addCase(exportEntries.fulfilled, (state, action) => {
        state.exportLoading = false;
        state.exportSuccess = true;
        state.exportError = null;
      })
      .addCase(exportEntries.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload;
        state.exportSuccess = false;
      })
      
      // Import entries from file
      .addCase(importEntriesFromFile.pending, (state) => {
        state.bulkImportLoading = true;
        state.bulkImportError = null;
        state.bulkImportSuccess = false;
      })
      .addCase(importEntriesFromFile.fulfilled, (state, action) => {
        state.bulkImportLoading = false;
        state.bulkImportSuccess = true;
        state.bulkImportError = null;
        // Optionally refresh the entries list after successful import
        // This could trigger a refetch of the current page
      })
      .addCase(importEntriesFromFile.rejected, (state, action) => {
        state.bulkImportLoading = false;
        state.bulkImportError = action.payload;
        state.bulkImportSuccess = false;
      })
      
      // Get diseases summary
      .addCase(getDiseasesSummary.pending, (state) => {
        state.diseasesSummaryLoading = true;
        state.diseasesSummaryError = null;
      })
      .addCase(getDiseasesSummary.fulfilled, (state, action) => {
        state.diseasesSummaryLoading = false;
        state.diseasesSummary = action.payload.data || [];
        state.diseasesSummaryError = null;
      })
      .addCase(getDiseasesSummary.rejected, (state, action) => {
        state.diseasesSummaryLoading = false;
        state.diseasesSummaryError = action.payload;
        state.diseasesSummary = [];
      })
      
      // Find by disease and autoantibody
      .addCase(findByDiseaseAndAutoantibody.pending, (state) => {
        state.diseaseAutoantibodySearchLoading = true;
        state.diseaseAutoantibodySearchError = null;
      })
      .addCase(findByDiseaseAndAutoantibody.fulfilled, (state, action) => {
        state.diseaseAutoantibodySearchLoading = false;
        state.diseaseAutoantibodySearchResults = action.payload.data || [];
        state.diseaseAutoantibodySearchError = null;
      })
      .addCase(findByDiseaseAndAutoantibody.rejected, (state, action) => {
        state.diseaseAutoantibodySearchLoading = false;
        state.diseaseAutoantibodySearchError = action.payload;
        state.diseaseAutoantibodySearchResults = [];
      })
      
      // Find by autoantibody or synonym
      .addCase(findByAutoantibodyOrSynonym.pending, (state) => {
        state.autoantibodySynonymSearchLoading = true;
        state.autoantibodySynonymSearchError = null;
      })
      .addCase(findByAutoantibodyOrSynonym.fulfilled, (state, action) => {
        state.autoantibodySynonymSearchLoading = false;
        state.autoantibodySynonymSearchResults = action.payload.data || [];
        state.autoantibodySynonymSearchError = null;
      })
      .addCase(findByAutoantibodyOrSynonym.rejected, (state, action) => {
        state.autoantibodySynonymSearchLoading = false;
        state.autoantibodySynonymSearchError = action.payload;
        state.autoantibodySynonymSearchResults = [];
      })
      
      // Find by diagnostic method
      .addCase(findByDiagnosticMethod.pending, (state) => {
        state.diagnosticMethodSearchLoading = true;
        state.diagnosticMethodSearchError = null;
      })
      .addCase(findByDiagnosticMethod.fulfilled, (state, action) => {
        state.diagnosticMethodSearchLoading = false;
        state.diagnosticMethodSearchResults = action.payload.data || [];
        state.diagnosticMethodSearchError = null;
      })
      .addCase(findByDiagnosticMethod.rejected, (state, action) => {
        state.diagnosticMethodSearchLoading = false;
        state.diagnosticMethodSearchError = action.payload;
        state.diagnosticMethodSearchResults = [];
      });
  },
});

export const {
  clearError,
  clearEntryError,
  clearSearchError,
  clearAdvancedSearchError,
  clearStatisticsError,
  clearAdditionalKeysError,
  clearExportError,
  clearBulkImportError,
  clearUniqueValuesError,
  clearDiseasesSummaryError,
  clearDiseaseAutoantibodySearchError,
  clearAutoantibodySynonymSearchError,
  clearDiagnosticMethodSearchError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  clearBulkImportSuccess,
  clearExportSuccess,
  setFilters,
  clearFilters,
  resetDependentFilters,
  clearCurrentEntry,
  clearSearchResults,
  resetDiseaseState
} = diseaseSlice.actions;

export default diseaseSlice.reducer;