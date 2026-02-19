import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEntries,
  getUniqueValues,
  getFilteredUniqueValues,
  searchEntries,
} from "@/redux/actions/diseaseActions";
import {
  setFilters,
  clearFilters,
  resetDependentFilters,
} from "@/redux/slices/diseaseSlice";

export const useDiseaseFilters = () => {
  const dispatch = useDispatch();
  const {
    uniqueValues,
    filteredUniqueValues,
    filters,
    uniqueValuesLoading,
    searchResults,
    searchLoading,
  } = useSelector((state) => state.disease);

  // Helper function to build filter chain for dependent fields
  const buildFilterChain = useCallback((currentField, localFilters) => {
    const filterObj = {};
    if (currentField !== 'disease' && localFilters.disease) {
      filterObj.disease = localFilters.disease;
    }
    if (currentField !== 'autoantibody' && localFilters.autoantibody) {
      filterObj.autoantibody = localFilters.autoantibody;
    }
    if (currentField !== 'autoantigen' && localFilters.autoantigen) {
      filterObj.autoantigen = localFilters.autoantigen;
    }
    if (currentField !== 'epitope' && localFilters.epitope) {
      filterObj.epitope = localFilters.epitope;
    }
    if (currentField !== 'type' && localFilters.type) {
      filterObj.type = localFilters.type;
    }
    if (currentField !== 'uniprotId' && localFilters.uniprotId) {
      filterObj.uniprotId = localFilters.uniprotId;
    }
    return filterObj;
  }, []);

  // Handle disease filter change (base filter - affects all others)
  const handleDiseaseChange = useCallback(
    (disease, localFilters, handleFiltersChange) => {
      // Reset all dependent filters when disease changes
      dispatch(resetDependentFilters({ field: 'disease' }));
      
      const newFilters = { disease };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for all dependent fields
      if (disease) {
        const filters = { disease };
        dispatch(getFilteredUniqueValues({ field: 'autoantibody', filters }));
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters }));
        dispatch(getFilteredUniqueValues({ field: 'type', filters }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters }));
      } else {
        // If disease is cleared, reset to all unique values
        dispatch(getUniqueValues("autoantibody"));
        dispatch(getUniqueValues("autoantigen"));
        dispatch(getUniqueValues("epitope"));
        dispatch(getUniqueValues("type"));
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [dispatch]
  );

  // Handle autoantibody filter change (primary filter for autoantigen and epitope)
  const handleAutoantibodyChange = useCallback(
    (autoantibody, localFilters, handleFiltersChange) => {
      // Reset dependent filters when autoantibody changes
      dispatch(resetDependentFilters({ field: 'autoantibody' }));
      
      const newFilters = { autoantibody };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields
      if (autoantibody) {
        // For autoantigen and epitope, use autoantibody as the primary filter
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters: { autoantibody } }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantibody } }));
        
        // For type and uniprotId, use all parent filters including disease if available
        const parentFilters = buildFilterChain('autoantibody', localFilters);
        if (Object.keys(parentFilters).length > 0) {
          dispatch(getFilteredUniqueValues({ field: 'type', filters: parentFilters }));
          dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
        } else {
          // For UniProt ID, always filter by autoantibody when autoantibody is selected
          dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: { autoantibody } }));
          dispatch(getUniqueValues("type"));
        }
      } else {
        // If autoantibody is cleared, reset to disease-filtered values or all unique values
        if (localFilters.disease) {
          dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters: { disease: localFilters.disease } }));
          dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { disease: localFilters.disease } }));
        } else {
          dispatch(getUniqueValues("autoantigen"));
          dispatch(getUniqueValues("epitope"));
        }
        dispatch(getUniqueValues("type"));
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [dispatch, buildFilterChain]
  );

  // Handle autoantigen filter change (dependent on autoantibody primarily)
  const handleAntigenChange = useCallback(
    (autoantigen, localFilters, handleFiltersChange) => {
      // Reset dependent filters when autoantigen changes
      dispatch(resetDependentFilters({ field: 'autoantigen' }));
      
      const newFilters = { autoantigen };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields
      if (autoantigen) {
        // For epitope, prioritize autoantibody if available, otherwise use autoantigen
        if (localFilters.autoantibody) {
          dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantibody: localFilters.autoantibody } }));
        } else {
          dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantigen } }));
        }
        
        // For type and uniprotId, use all parent filters
        const parentFilters = buildFilterChain('autoantigen', localFilters);
        if (Object.keys(parentFilters).length > 0) {
          dispatch(getFilteredUniqueValues({ field: 'type', filters: parentFilters }));
          dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
        } else {
          dispatch(getUniqueValues("type"));
          dispatch(getUniqueValues("uniprotId"));
        }
      } else {
        // If autoantigen is cleared, reset epitope based on autoantibody or disease
        if (localFilters.autoantibody) {
          dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantibody: localFilters.autoantibody } }));
        } else if (localFilters.disease) {
          dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { disease: localFilters.disease } }));
        } else {
          dispatch(getUniqueValues("epitope"));
        }
        dispatch(getUniqueValues("type"));
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [dispatch, buildFilterChain]
  );

  // Handle epitope filter change (dependent on autoantibody primarily)
  const handleEpitopeChange = useCallback(
    (epitope, localFilters, handleFiltersChange) => {
      // Reset dependent filters when epitope changes
      dispatch(resetDependentFilters({ field: 'epitope' }));
      
      const newFilters = { epitope };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields
      // For type and uniprotId, prioritize autoantibody if available
      if (localFilters.autoantibody) {
        dispatch(getFilteredUniqueValues({ field: 'type', filters: { autoantibody: localFilters.autoantibody } }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: { autoantibody: localFilters.autoantibody } }));
      } else {
        // Use all parent filters if no autoantibody
        const parentFilters = buildFilterChain('epitope', localFilters);
        if (Object.keys(parentFilters).length > 0) {
          dispatch(getFilteredUniqueValues({ field: 'type', filters: parentFilters }));
          dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
        } else {
          dispatch(getUniqueValues("type"));
          dispatch(getUniqueValues("uniprotId"));
        }
      }
    },
    [dispatch, buildFilterChain]
  );

  // Handle type filter change (dependent on all previous filters)
  const handleTypeChange = useCallback(
    (type, localFilters, handleFiltersChange) => {
      // Reset dependent filters when type changes
      dispatch(resetDependentFilters({ field: 'type' }));
      
      const newFilters = { type };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields based on all parent filters
      const parentFilters = buildFilterChain('type', localFilters);
      if (Object.keys(parentFilters).length > 0) {
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
      } else {
        // If no parent filters, reset to all unique values
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [dispatch, buildFilterChain]
  );

  // Handle UniProt ID filter change (dependent on all previous filters)
  const handleUniprotIdChange = useCallback(
    (uniprotId, localFilters, handleFiltersChange) => {
      handleFiltersChange({ uniprotId }, true);
    },
    []
  );

  // Clear all filters
  const clearAllFilters = useCallback((handleFiltersChange) => {
    const resetFilters = {
      search: "",
      field: "all",
      disease: "",
      autoantibody: "",
      autoantigen: "",
      epitope: "",
      type: "",
      uniprotId: "",
      sortBy: "disease",
      sortOrder: "asc",
    };

    handleFiltersChange(resetFilters, false);
    dispatch(clearFilters());
    
    // Reset all filtered unique values to all unique values
    dispatch(getUniqueValues("autoantibody"));
    dispatch(getUniqueValues("autoantigen"));
    dispatch(getUniqueValues("epitope"));
    dispatch(getUniqueValues("type"));
    dispatch(getUniqueValues("uniprotId"));
    
    dispatch(
      getAllEntries({
        page: 1,
        limit: 20,
        sortBy: "disease",
        sortOrder: "asc",
      })
    );
  }, [dispatch]);

  // Load initial unique values
  const loadInitialData = useCallback(() => {
    dispatch(getStatistics());
    // Load unique values for all filterable fields
    dispatch(getUniqueValues("disease"));
    dispatch(getUniqueValues("autoantibody"));
    dispatch(getUniqueValues("autoantigen"));
    dispatch(getUniqueValues("epitope"));
    dispatch(getUniqueValues("type"));
    dispatch(getUniqueValues("uniprotId"));
  }, [dispatch]);

  return {
    // State
    uniqueValues,
    filteredUniqueValues,
    filters,
    uniqueValuesLoading,
    searchResults,
    searchLoading,
    
    // Handlers
    handleDiseaseChange,
    handleAutoantibodyChange,
    handleAntigenChange,
    handleEpitopeChange,
    handleTypeChange,
    handleUniprotIdChange,
    clearAllFilters,
    loadInitialData,
    
    // Utilities
    buildFilterChain,
  };
};
