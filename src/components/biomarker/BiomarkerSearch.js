'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Search as SearchIcon, X, Loader2, Upload, FileCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import * as XLSX from 'xlsx';
import axiosInstance from '@/utils/axiosSetup';
import NetworkGraph from './NetworkGraph';
import PublicHeader from '@/components/public/PublicHeader';
import { cn } from '@/utils/cn';

const dedupeByAntibody = (results) => {
  const seen = new Map();
  for (const item of results) {
    const name = item.name?.trim() || 'Unknown';
    if (!seen.has(name)) seen.set(name, item);
  }
  return Array.from(seen.values());
};

export default function BiomarkerSearch({ onViewModeChange, initialQuery = '', autoOpenAntibody = '', backToIndex = false }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useExcelResults, setUseExcelResults] = useState(false);
  const [excelFileName, setExcelFileName] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [viewMode, setViewMode] = useState('search');
  const [selectedAntibody, setSelectedAntibody] = useState('');
  const [graphData, setGraphData] = useState([]);
  const [isGraphLoading, setIsGraphLoading] = useState(false);

  const router = useRouter();
  const debouncedQuery = useDebounce(query, 250);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const initialQueryHandled = useRef(false);
  const autoOpenHandled = useRef(false);

  const displayedResults = dedupeByAntibody(results);
  const hasResults = displayedResults.length > 0;

  useEffect(() => {
    if (viewMode === 'graph') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialQuery && !initialQueryHandled.current) {
      setQuery(initialQuery);
      initialQueryHandled.current = true;
    }
  }, [initialQuery]);

  // Auto-open network graph when antibody param is provided (e.g. from index page)
  useEffect(() => {
    if (!autoOpenAntibody?.trim() || autoOpenHandled.current) return;
    autoOpenHandled.current = true;
    const openGraph = async () => {
      setSelectedAntibody(autoOpenAntibody.trim());
      setIsGraphLoading(true);
      try {
        const res = await axiosInstance.get(`/biomarkers?search=${encodeURIComponent(autoOpenAntibody.trim())}`);
        const data = res.data || [];
        const relevantData = data.filter(
          (item) => (item.name || '').trim().toLowerCase() === autoOpenAntibody.trim().toLowerCase()
        );
        setGraphData(relevantData.length > 0 ? relevantData : data);
        setViewMode('graph');
        onViewModeChange?.('graph');
      } catch (e) {
        console.error('Failed to open graph', e);
      } finally {
        setIsGraphLoading(false);
      }
    };
    openGraph();
  }, [autoOpenAntibody, onViewModeChange]);

  useEffect(() => {
    if (useExcelResults) return;
    if (!debouncedQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    axiosInstance
      .get(`/biomarkers?search=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        setResults(res.data);
        setShowDropdown(true);
        setHighlightIndex(-1);
      })
      .catch(() => {
        setResults([]);
        setShowDropdown(true);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, useExcelResults]);

  const handleSelect = async (biomarker) => {
    setSelectedAntibody(biomarker.name);
    setShowDropdown(false);
    setQuery('');
    setHighlightIndex(-1);

    setIsGraphLoading(true);
    try {
      const res = await axiosInstance.get(`/biomarkers?search=${encodeURIComponent(biomarker.name)}`);
      const data = res.data;
      const relevantData = data.filter(
        (item) => (item.name || '').trim() === (biomarker.name || '').trim()
      );
      setGraphData(relevantData.length > 0 ? relevantData : data);
      setViewMode('graph');
      onViewModeChange?.('graph');
    } catch (e) {
      console.error('Failed to load graph data', e);
    } finally {
      setIsGraphLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!hasResults || !showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < displayedResults.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : displayedResults.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0 && displayedResults[highlightIndex]) {
      e.preventDefault();
      handleSelect(displayedResults[highlightIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFileName(file.name);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
        const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        const names = [
          ...new Set(
            json
              .map((r) => r.Biomarker || r.Antibody || r.Name || Object.values(r)[0])
              .filter(Boolean)
          ),
        ];

        if (names.length === 0) throw new Error('No names found in Excel');

        const res = await axiosInstance.post('/biomarkers/bulk', { names });
        setResults(res.data);
        setUseExcelResults(true);
        setShowDropdown(true);
      } catch (err) {
        console.error('Excel upload failed', err);
        alert('Failed to process Excel. Ensure it has a Biomarker/Antibody column.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const clearExcel = () => {
    setUseExcelResults(false);
    setExcelFileName('');
    setResults([]);
    setQuery('');
    setHighlightIndex(-1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSelection = () => {
    if (backToIndex) {
      router.push('/');
      return;
    }
    setViewMode('search');
    setGraphData([]);
    setSelectedAntibody('');
    onViewModeChange?.('search');
  };

  if (viewMode === 'graph') {
    return (
      <div className="fixed inset-0 w-full h-screen flex flex-col z-[100] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="shrink-0">
          <PublicHeader />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden px-2 sm:px-4">
          {isGraphLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
              <p className="text-sm text-gray-300">Loading graph...</p>
            </div>
          ) : (
            <NetworkGraph
              antibodyName={selectedAntibody}
              data={graphData}
              onBack={clearSelection}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition" />
        <div className="relative bg-white/10 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/80 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (useExcelResults) setUseExcelResults(false);
                setShowDropdown(true);
              }}
              onFocus={() => hasResults && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              disabled={useExcelResults}
              placeholder={
                useExcelResults
                  ? `${displayedResults.length} results`
                  : 'Search autoantibody (e.g. Anti-Ro52)...'
              }
              className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base md:text-lg text-white placeholder-gray-400"
            />
            {isLoading && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-400 shrink-0" />}
            {(query || useExcelResults) && !isLoading && (
              <button
                onClick={useExcelResults ? clearExcel : () => setQuery('')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl flex items-center justify-center transition-all',
                useExcelResults
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-blue-500/30 hover:text-white'
              )}
              title="Upload Excel for bulk search"
            >
              {useExcelResults ? (
                <FileCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto"
          >
            {useExcelResults && (
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-500/20 border-b border-blue-500/30 flex justify-between items-center gap-2">
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider truncate min-w-0">
                  {displayedResults.length} autoantibodies
                </span>
                <button
                  onClick={clearExcel}
                  className="text-xs font-medium text-blue-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="py-1 sm:py-2">
              {displayedResults.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={cn(
                    'w-full px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 text-left transition-colors',
                    highlightIndex === i
                      ? 'bg-blue-500/30'
                      : 'hover:bg-white/10 active:bg-white/10'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base text-white truncate">{item.name}</h4>
                    {item.manifestation && (
                      <p className="text-xs sm:text-sm text-gray-400 truncate mt-0.5">
                        {item.manifestation}
                      </p>
                    )}
                  </div>
                  {item.raw?.Disease && (
                    <span className="shrink-0 text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-500/30 text-blue-200 max-w-[100px] sm:max-w-none truncate">
                      {item.raw.Disease}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
