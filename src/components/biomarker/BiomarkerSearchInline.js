'use client';

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { X, Loader2, FlaskConical, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/utils/axiosSetup';

const dedupeByAntibody = (results) => {
  const seen = new Map();
  for (const item of results) {
    const name = item.name?.trim() || 'Unknown';
    if (!seen.has(name)) seen.set(name, item);
  }
  return Array.from(seen.values());
};

const BiomarkerSearchInline = forwardRef(function BiomarkerSearchInline({ className, onResults, onClear, onSuggestions, inputRef, disabled }, ref) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const localInputRef = useRef(null);
  const searchRef = useRef(null);
  const effectiveInputRef = inputRef || localInputRef;

  const displayedResults = dedupeByAntibody(results);
  const hasResults = displayedResults.length > 0;


  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      onSuggestions?.([]);
      return;
    }
    setIsLoading(true);
    setShowDropdown(true);
    axiosInstance
      .get(`/biomarkers?search=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        const data = res.data || [];
        setResults(data);
        onSuggestions?.(dedupeByAntibody(data));
      })
      .catch(() => {
        setResults([]);
        onSuggestions?.([]);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, onSuggestions]);

  const runSearch = async (biomarkerName) => {
    if (!biomarkerName?.trim()) return;
    setIsSearching(true);
    try {
      const res = await axiosInstance.get(`/biomarkers?search=${encodeURIComponent(biomarkerName.trim())}`);
      const data = res.data || [];
      const matching = data.filter((item) => (item.name || '').trim().toLowerCase() === (biomarkerName || '').trim().toLowerCase());
      const items = matching.length > 0 ? matching : data;
      const associations = items.map((item) => ({
        disease: item.raw?.Disease || item.raw?.disease || '—',
        manifestation: item.manifestation || '—',
      }));
      const uniqueMap = new Map();
      associations.forEach((a) => {
        const key = `${a.disease}|||${a.manifestation}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, a);
      });
      onResults?.({
        query: biomarkerName.trim(),
        associations: Array.from(uniqueMap.values()),
        count: uniqueMap.size,
      });
    } catch {
      onResults?.({ query: biomarkerName.trim(), associations: [], count: 0, message: 'Failed to load biomarker data.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (biomarker) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onSuggestions?.([]);
    runSearch(biomarker.name || '');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (hasResults && displayedResults[0]) {
        handleSelect(displayedResults[0]);
      } else if (query.trim()) {
        runSearch(query.trim());
      }
    }
  };

  useImperativeHandle(ref, () => ({
    search: (term) => {
      if (term?.trim()) runSearch(String(term).trim());
    },
  }));

  return (
    <div ref={searchRef} className={`w-full relative ${className || ''}`}>
      <div className="relative">
        <input
          ref={effectiveInputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => query.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by biomarker or autoantibody name..."
          disabled={disabled}
          className="w-full px-4 py-3 pl-11 pr-12 text-sm sm:text-base bg-slate-800/60 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/30 transition-all disabled:opacity-60"
        />
        <FlaskConical className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80" />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); onSuggestions?.([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-purple-400" />
        )}
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && debouncedQuery.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-2xl border border-white/25 bg-slate-900 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
              <span className="text-gray-400 text-sm">Searching...</span>
            </div>
          ) : displayedResults.length > 0 ? (
            <div className="py-2">
              {displayedResults.slice(0, 12).map((item, i) => (
                <button
                  key={item._id || i}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-violet-500/20 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-medium truncate">{item.name}</div>
                    {item.manifestation && <div className="text-gray-400 text-xs truncate mt-0.5">{item.manifestation}</div>}
                  </div>
                  {item.raw?.Disease && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-violet-500/25 text-violet-200 shrink-0 truncate max-w-[80px]">{item.raw.Disease}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-violet-400/80 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-gray-400 text-sm">No biomarkers found for &quot;{debouncedQuery}&quot;</div>
          )}
        </div>
      )}
    </div>
  );
});

export default BiomarkerSearchInline;
