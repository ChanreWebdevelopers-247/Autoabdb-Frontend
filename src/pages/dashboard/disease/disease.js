import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import Link from "next/link";
import DiseaseHeader from "@/components/disease/DiseaseHeader";
import DiseaseSearch from "@/components/disease/DiseaseSearch";
import DiseaseFilters from "@/components/disease/DiseaseFilters";
import DiseaseViewToggle from "@/components/disease/DiseaseViewToggle";
import DiseaseResults from "@/components/disease/DiseaseResults";
import DiseasePagination from "@/components/disease/DiseasePagination";
import {
  getAllEntries,
  getStatistics,
  getUniqueValues,
  getFilteredUniqueValues,
} from "@/redux/actions/diseaseActions";
import { searchEntries } from "@/redux/actions/diseaseActions";
import {
  clearError,
  setFilters,
  clearFilters,
  resetDependentFilters,
} from "@/redux/slices/diseaseSlice";


const DiseasePage = () => {
  const dispatch = useDispatch();
  const {
    entries,
    loading,
    error,
    pagination,
    statistics,
    uniqueValues,
    filteredUniqueValues,
    filters,
    appliedFilters,
    uniqueValuesLoading,
    searchResults,
    searchLoading,
  } = useSelector((state) => state.disease);
  const { user } = useSelector((state) => state.auth);

  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('hierarchical'); // 'cards', 'table', or 'hierarchical'
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    type: filters.type || "",
    uniprotId: filters.uniprotId || "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const searchContainerRef = useRef(null);

  // Sort entries by priority (high to low), then alphabetically by disease name
  const sortedEntries = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    return [...entries].sort((a, b) => {
      // Parse priority values robustly - handle string, number, null, undefined
      const parsePriority = (priority) => {
        if (priority == null || priority === '') return 0;
        const parsed = parseFloat(String(priority).trim());
        return isNaN(parsed) ? 0 : parsed;
      };
      
      const priorityA = parsePriority(a.priority);
      const priorityB = parsePriority(b.priority);
      
      // First sort by priority (descending - high to low priority numbers)
      if (priorityB !== priorityA) {
        return priorityB - priorityA; // Higher priority number first
      }
      
      // Then sort alphabetically by disease name
      const diseaseA = (a.disease || '').toLowerCase();
      const diseaseB = (b.disease || '').toLowerCase();
      return diseaseA.localeCompare(diseaseB);
    });
  }, [entries]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        dispatch(setFilters({ search: localFilters.search }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters.search, filters.search, dispatch]);

  // Sync local filters with Redux state when dependent filters are reset
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      search: filters.search,
      autoantibody: filters.autoantibody,
      autoantigen: filters.autoantigen,
      epitope: filters.epitope,
      type: filters.type,
      uniprotId: filters.uniprotId,
    }));
  }, [filters.search, filters.autoantibody, filters.autoantigen, filters.epitope, filters.type, filters.uniprotId]);

  // Load initial data
  useEffect(() => {
    dispatch(getStatistics());
    // Load initial entries
    dispatch(getAllEntries({ page: 1, limit: 20, sortBy: 'disease', sortOrder: 'asc' }));
    // Load unique values for all filterable fields
    dispatch(getUniqueValues("disease"));
    dispatch(getUniqueValues("autoantibody"));
    dispatch(getUniqueValues("autoantigen"));
    dispatch(getUniqueValues("epitope"));
    dispatch(getUniqueValues("type"));
    dispatch(getUniqueValues("uniprotId"));
  }, [dispatch]);

  // Handle search and filter changes
  const handleFiltersChange = useCallback(
    (newFilters, applyImmediately = false) => {
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));

      if (applyImmediately) {
        const combinedFilters = { ...localFilters, ...newFilters };
        dispatch(setFilters(combinedFilters));

        // Apply filters to get new entries
        dispatch(
          getAllEntries({
            page: 1,
            limit: 20,
            ...combinedFilters,
          })
        );
        setHasInteracted(true);
      }
    },
    [localFilters, dispatch]
  );

  // Helper function to build filter chain for dependent fields
  const buildFilterChain = useCallback((currentField) => {
    const filters = {};
    if (currentField !== 'disease' && localFilters.disease) {
      filters.disease = localFilters.disease;
    }
    if (currentField !== 'autoantibody' && localFilters.autoantibody) {
      filters.autoantibody = localFilters.autoantibody;
    }
    if (currentField !== 'autoantigen' && localFilters.autoantigen) {
      filters.autoantigen = localFilters.autoantigen;
    }
    if (currentField !== 'epitope' && localFilters.epitope) {
      filters.epitope = localFilters.epitope;
    }
    if (currentField !== 'type' && localFilters.type) {
      filters.type = localFilters.type;
    }
    if (currentField !== 'uniprotId' && localFilters.uniprotId) {
      filters.uniprotId = localFilters.uniprotId;
    }
    return filters;
  }, [localFilters]);

  // Handle disease filter change (base filter - affects all others)
  const handleDiseaseChange = useCallback(
    (disease) => {
      // Reset all dependent filters when disease changes
      dispatch(resetDependentFilters({ field: 'disease' }));
      
      // Clear all dependent filters and search when disease is selected
      const newFilters = { 
        disease, 
        search: '',
        autoantibody: '', // Clear autoantibody filter - will show filtered autoantibodies associated with this disease in dropdown
        autoantigen: '',
        epitope: '',
        type: '',
        uniprotId: ''
      };
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));
      dispatch(setFilters(newFilters));

      // Fetch ALL entries without pagination when disease is selected
      if (disease) {
        dispatch(
          getAllEntries({
            page: 1,
            limit: 10000, // Use high limit to fetch all entries on one page
            ...newFilters,
          })
        );
        setHasInteracted(true);
        
        const filters = { disease };
        // IMPORTANT: Filter autoantibodies by disease (reverse filtering)
        // This ensures the autoantibody dropdown shows ONLY autoantibodies associated with the selected disease
        dispatch(getFilteredUniqueValues({ field: 'autoantibody', filters }));
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters }));
        dispatch(getFilteredUniqueValues({ field: 'type', filters }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters }));
      } else {
        // If disease is cleared, reset to paginated view
        dispatch(
          getAllEntries({
            page: 1,
            limit: 20,
            sortBy: 'disease',
            sortOrder: 'asc',
          })
        );
        // Reset to all unique values
        dispatch(getUniqueValues("disease"));
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
    (autoantibody) => {
      // Reset dependent filters when autoantibody changes
      dispatch(resetDependentFilters({ field: 'autoantibody' }));
      
      // Clear disease and search filters when autoantibody is selected to show only data strictly associated with that autoantibody
      const newFilters = { 
        autoantibody,
        disease: '', // Clear disease filter - will show filtered diseases associated with this autoantibody in dropdown
        search: '', // Clear search filter
        autoantigen: '', // Clear autoantigen (will be filtered by autoantibody)
        epitope: '', // Clear epitope (will be filtered by autoantibody)
        type: '', // Clear type (will be filtered by autoantibody)
        uniprotId: '' // Clear uniprotId (will be filtered by autoantibody)
      };
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));
      dispatch(setFilters(newFilters));

      // Fetch ALL entries without pagination when autoantibody is selected
      if (autoantibody) {
        dispatch(
          getAllEntries({
            page: 1,
            limit: 10000, // Use high limit to fetch all entries on one page
            ...newFilters,
          })
        );
        setHasInteracted(true);
        
        // IMPORTANT: Filter diseases by autoantibody (reverse filtering) 
        // This ensures the disease dropdown shows ONLY diseases associated with the selected autoantibody
        dispatch(getFilteredUniqueValues({ field: 'disease', filters: { autoantibody } }));
        
        // For autoantigen and epitope, use autoantibody as the primary filter
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters: { autoantibody } }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantibody } }));
        
        // For type and uniprotId, filter strictly by autoantibody only
        dispatch(getFilteredUniqueValues({ field: 'type', filters: { autoantibody } }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: { autoantibody } }));
      } else {
        // If autoantibody is cleared, reset to paginated view
        dispatch(
          getAllEntries({
            page: 1,
            limit: 20,
            sortBy: 'disease',
            sortOrder: 'asc',
          })
        );
        // Reset to all unique values
        dispatch(getUniqueValues("disease"));
        dispatch(getUniqueValues("autoantibody"));
        dispatch(getUniqueValues("autoantigen"));
        dispatch(getUniqueValues("epitope"));
        dispatch(getUniqueValues("type"));
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [dispatch]
  );

  // Handle autoantigen filter change (dependent on autoantibody primarily, but also supports reverse filtering)
  const handleAntigenChange = useCallback(
    (autoantigen) => {
      // Reset dependent filters when autoantigen changes
      dispatch(resetDependentFilters({ field: 'autoantigen' }));
      
      // Clear disease and autoantibody filters when autoantigen is selected to show only data strictly associated with that autoantigen (reverse filtering)
      const newFilters = { 
        autoantigen,
        disease: '', // Clear disease filter (will show filtered diseases via reverse filtering)
        autoantibody: '', // Clear autoantibody filter (will show filtered autoantibodies via reverse filtering)
        search: '', // Clear search filter
        epitope: '', // Clear epitope (will be filtered by autoantigen)
        type: '', // Clear type (will be filtered by autoantigen)
        uniprotId: '' // Clear uniprotId (will be filtered by autoantigen)
      };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields
      if (autoantigen) {
        // Reverse filtering: show diseases and autoantibodies associated with this autoantigen
        dispatch(getFilteredUniqueValues({ field: 'disease', filters: { autoantigen } }));
        dispatch(getFilteredUniqueValues({ field: 'autoantibody', filters: { autoantigen } }));
        
        // For epitope, use autoantigen as the filter
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters: { autoantigen } }));
        
        // For type and uniprotId, filter by autoantigen
        dispatch(getFilteredUniqueValues({ field: 'type', filters: { autoantigen } }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: { autoantigen } }));
      } else {
        // If autoantigen is cleared, reset to all unique values
        dispatch(getUniqueValues("disease"));
        dispatch(getUniqueValues("autoantibody"));
        dispatch(getUniqueValues("epitope"));
        dispatch(getUniqueValues("type"));
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [handleFiltersChange, dispatch]
  );

  // Handle epitope filter change (dependent on autoantibody primarily)
  const handleEpitopeChange = useCallback(
    (epitope) => {
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
        const parentFilters = buildFilterChain('epitope');
        if (Object.keys(parentFilters).length > 0) {
          dispatch(getFilteredUniqueValues({ field: 'type', filters: parentFilters }));
          dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
        } else {
          dispatch(getUniqueValues("type"));
          dispatch(getUniqueValues("uniprotId"));
        }
      }
    },
    [handleFiltersChange, dispatch, buildFilterChain, localFilters.autoantibody]
  );

  // Handle type filter change (dependent on all previous filters)
  const handleTypeChange = useCallback(
    (type) => {
      // Reset dependent filters when type changes
      dispatch(resetDependentFilters({ field: 'type' }));
      
      const newFilters = { type };
      handleFiltersChange(newFilters, true);
      
      // Fetch filtered unique values for dependent fields based on all parent filters
      const parentFilters = buildFilterChain('type');
      if (Object.keys(parentFilters).length > 0) {
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters: parentFilters }));
      } else {
        // If no parent filters, reset to all unique values
        dispatch(getUniqueValues("uniprotId"));
      }
    },
    [handleFiltersChange, dispatch, buildFilterChain]
  );

  // Handle UniProt ID filter change (dependent on all previous filters)
  const handleUniprotIdChange = useCallback(
    (uniprotId) => {
      handleFiltersChange({ uniprotId }, true);
    },
    [handleFiltersChange]
  );


  // Handle search
  const handleSearch = useCallback(() => {
    if (!localFilters.search?.trim()) return;
    dispatch(
      getAllEntries({
        page: 1,
        limit: 20,
        ...localFilters,
      })
    );
    setHasInteracted(true);
    setShowSuggestions(false);
  }, [dispatch, localFilters]);

  // Suggestion search (debounced)
  useEffect(() => {
    const q = localFilters.search?.trim();
    if (!q || q.length < 2) {
      setShowSuggestions(false);
      return;
    }
    const t = setTimeout(() => {
      dispatch(searchEntries({ searchTerm: q, field: localFilters.field || "all", limit: 50 }));
      setShowSuggestions(true);
    }, 250);
    return () => clearTimeout(t);
  }, [localFilters.search, localFilters.field, dispatch]);

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
    
    // Enhanced Anti-Ro52 handling: prioritize Anti-Ro52 related suggestions
    const antibodyArray = Array.from(antibodies);
    const ro52Related = antibodyArray.filter(ab => 
      ab.toLowerCase().includes('ro52') || 
      ab.toLowerCase().includes('anti-ro52') ||
      ab.toLowerCase().includes('ro/ssa') ||
      ab.toLowerCase().includes('ro (ssa)') ||
      ab.toLowerCase().includes('ssa')
    );
    const otherAntibodies = antibodyArray.filter(ab => 
      !ab.toLowerCase().includes('ro52') && 
      !ab.toLowerCase().includes('anti-ro52') &&
      !ab.toLowerCase().includes('ro/ssa') &&
      !ab.toLowerCase().includes('ro (ssa)') &&
      !ab.toLowerCase().includes('ssa')
    );
    
    return {
      disease: Array.from(diseases).slice(0, limitPerGroup),
      autoantibody: [...ro52Related, ...otherAntibodies].slice(0, limitPerGroup),
      autoantigen: Array.from(antigens).slice(0, limitPerGroup),
      epitope: Array.from(epitopes).slice(0, limitPerGroup),
      type: Array.from(types).slice(0, limitPerGroup),
      uniprotId: Array.from(uniprotIds).slice(0, limitPerGroup),
    };
  }, [searchResults]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (!searchContainerRef.current) return;
      if (!searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectSuggestion = useCallback(
    (section, value) => {
      // If selecting a disease from suggestions, clear all other filters
      if (section === 'disease') {
        dispatch(resetDependentFilters({ field: 'disease' }));
        const next = { 
          ...localFilters, 
          field: section, 
          search: value,
          disease: value,
          autoantibody: '',
          autoantigen: '',
          epitope: '',
          type: '',
          uniprotId: ''
        };
        setLocalFilters(next);
        dispatch(setFilters({ field: section, search: value, disease: value }));
        setShowSuggestions(false);
        // Fetch ALL entries without pagination when disease is selected
        dispatch(getAllEntries({ page: 1, limit: 10000, ...next }));
        setHasInteracted(true);
        
        // Fetch filtered unique values for all dependent fields
        const filters = { disease: value };
        dispatch(getFilteredUniqueValues({ field: 'autoantibody', filters }));
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters }));
        dispatch(getFilteredUniqueValues({ field: 'type', filters }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters }));
      } else if (section === 'autoantibody') {
        // For autoantibody selection, clear other filters and set autoantibody filter
        // This ensures only data strictly associated with the selected autoantibody is shown
        dispatch(resetDependentFilters({ field: 'autoantibody' }));
        
        // Enhanced Anti-Ro52 handling: normalize the value for better filtering
        let normalizedValue = value;
        if (value.toLowerCase().includes('ro52') || 
            value.toLowerCase().includes('anti-ro52') ||
            value.toLowerCase().includes('ro/ssa') ||
            value.toLowerCase().includes('ro (ssa)') ||
            value.toLowerCase().includes('ssa')) {
          // For Anti-Ro52 related selections, use the exact value but ensure backend handles variations
          normalizedValue = value;
        }
        
        // Clear disease and search to show only data strictly associated with this autoantibody
        const next = { 
          ...localFilters, 
          field: section, 
          search: '', // Clear search
          disease: '', // Clear disease filter
          autoantibody: normalizedValue,
          autoantigen: '',
          epitope: '',
          type: '',
          uniprotId: ''
        };
        setLocalFilters(next);
        dispatch(setFilters({ field: section, search: '', disease: '', autoantibody: normalizedValue }));
        setShowSuggestions(false);
        // Fetch ALL entries without pagination when autoantibody is selected
        dispatch(getAllEntries({ page: 1, limit: 10000, ...next }));
        setHasInteracted(true);
        
        // Fetch filtered unique values for dependent fields (reverse filtering)
        const filters = { autoantibody: normalizedValue };
        dispatch(getFilteredUniqueValues({ field: 'disease', filters }));
        dispatch(getFilteredUniqueValues({ field: 'autoantigen', filters }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters }));
        dispatch(getFilteredUniqueValues({ field: 'type', filters }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters }));
      } else if (section === 'autoantigen') {
        // For autoantigen selection, clear other filters and set autoantigen filter
        // This ensures only data strictly associated with the selected autoantigen is shown (reverse filtering)
        dispatch(resetDependentFilters({ field: 'autoantigen' }));
        
        // Clear disease, autoantibody, and search to show only data strictly associated with this autoantigen
        const next = { 
          ...localFilters, 
          field: section, 
          search: '', // Clear search
          disease: '', // Clear disease filter (will show filtered diseases via reverse filtering)
          autoantibody: '', // Clear autoantibody filter (will show filtered autoantibodies via reverse filtering)
          autoantigen: value,
          epitope: '',
          type: '',
          uniprotId: ''
        };
        setLocalFilters(next);
        dispatch(setFilters({ field: section, search: '', disease: '', autoantibody: '', autoantigen: value }));
        setShowSuggestions(false);
        dispatch(getAllEntries({ page: 1, limit: 20, ...next }));
        setHasInteracted(true);
        
        // Fetch filtered unique values for dependent fields (reverse filtering)
        const filters = { autoantigen: value };
        dispatch(getFilteredUniqueValues({ field: 'disease', filters }));
        dispatch(getFilteredUniqueValues({ field: 'autoantibody', filters }));
        dispatch(getFilteredUniqueValues({ field: 'epitope', filters }));
        dispatch(getFilteredUniqueValues({ field: 'type', filters }));
        dispatch(getFilteredUniqueValues({ field: 'uniprotId', filters }));
      } else {
        const next = { ...localFilters, field: section, search: value };
        setLocalFilters(next);
        dispatch(setFilters({ field: section, search: value }));
        setShowSuggestions(false);
        dispatch(getAllEntries({ page: 1, limit: 20, ...next }));
        setHasInteracted(true);
      }
    },
    [dispatch, localFilters]
  );

  // Handle sorting
  const handleSort = useCallback(
    (field) => {
      const newOrder =
        filters.sortBy === field && filters.sortOrder === "asc"
          ? "desc"
          : "asc";
      const newFilters = { sortBy: field, sortOrder: newOrder };

      // Use high limit if autoantibody or disease filter is active (no pagination)
      const limit = (localFilters.autoantibody || localFilters.disease) ? 10000 : 20;
      
      handleFiltersChange(newFilters);
      dispatch(
        getAllEntries({
          page: 1,
          limit,
          ...localFilters,
          ...newFilters,
        })
      );
    },
    [
      filters.sortBy,
      filters.sortOrder,
      handleFiltersChange,
      dispatch,
      localFilters,
    ]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setLocalFilters({
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
    });

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

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(
        getAllEntries({
          page: newPage,
          limit: 20,
          ...localFilters,
        })
      );
    },
    [dispatch, localFilters]
  );

  // Check if any filters are active
  const hasActiveFilters =
    localFilters.search ||
    localFilters.disease ||
    localFilters.autoantibody ||
    localFilters.autoantigen ||
    localFilters.epitope ||
    localFilters.type ||
    localFilters.uniprotId;

  return (
    <Layout>
      <DiseaseHeader user={user} />

      <DiseaseSearch
        localFilters={localFilters}
        handleFiltersChange={handleFiltersChange}
        handleSearch={handleSearch}
        showSuggestions={showSuggestions}
        searchResults={searchResults}
        searchLoading={searchLoading}
        groupedSuggestions={groupedSuggestions}
        selectSuggestion={selectSuggestion}
        searchContainerRef={searchContainerRef}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <DiseaseFilters
        showFilters={showFilters}
        localFilters={localFilters}
        uniqueValues={uniqueValues}
        filteredUniqueValues={filteredUniqueValues}
        uniqueValuesLoading={uniqueValuesLoading}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        handleDiseaseChange={handleDiseaseChange}
        handleAutoantibodyChange={handleAutoantibodyChange}
        handleAntigenChange={handleAntigenChange}
        handleEpitopeChange={handleEpitopeChange}
        handleTypeChange={handleTypeChange}
        handleUniprotIdChange={handleUniprotIdChange}
        appliedFilters={appliedFilters}
      />

      {/* Results Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
            </h3>
            {/* <span className="text-gray-500 text-sm">
              {loading
                ? "Loading..."
                : `${pagination.total || 0} Autoantibody found`}
            </span> */}
          </div>

          <DiseaseViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        <DiseaseResults
          loading={loading}
          error={error}
          hasInteracted={hasInteracted}
          entries={sortedEntries}
          pagination={pagination}
          viewMode={viewMode}
          setViewMode={setViewMode}
          user={user}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
          handlePageChange={handlePageChange}
          dispatch={dispatch}
          clearError={clearError}
        />

        {/* Hide pagination when autoantibody or disease filter is active - show all results on one page */}
        {!localFilters.autoantibody && !localFilters.disease && (
          <DiseasePagination pagination={pagination} handlePageChange={handlePageChange} />
        )}
      </div>
    </Layout>
  );
};

export default DiseasePage;
