import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, Database, Target, BarChart3, FileText, Users, ArrowRight, CheckCircle, Zap, Shield, TrendingUp, X, Loader2, FlaskConical } from 'lucide-react';
import axiosInstance from '@/utils/axiosSetup';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { getDiseaseStatistics } from '@/services/statisticsService';
import { searchEntries, getAllEntries } from '@/redux/actions/diseaseActions';
import logo from '../assets/logo.png';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function AutoantibodyLanding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchType, setSearchType] = useState(null); // 'disease' or 'autoantibody'
  const [biomarkerQuery, setBiomarkerQuery] = useState('');
  const [biomarkerSuggestions, setBiomarkerSuggestions] = useState([]);
  const [biomarkerSearchData, setBiomarkerSearchData] = useState([]); // raw API response for selected biomarker
  const [selectedBiomarker, setSelectedBiomarker] = useState(null); // when user selects from dropdown, show associations
  const [showBiomarkerDropdown, setShowBiomarkerDropdown] = useState(false);
  const [isBiomarkerLoading, setIsBiomarkerLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const biomarkerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [statistics, setStatistics] = useState({
    totalEntries: 0,
    uniqueDiseasesCount: 0,
    uniqueAntibodiesCount: 0,
    uniqueAntigensCount: 0,
    verifiedEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics from backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await getDiseaseStatistics();
        if (response.success && response.data.overview) {
          setStatistics(response.data.overview);
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError('Failed to load statistics');
        setStatistics({
          totalEntries: 0,
          uniqueDiseasesCount: 0,
          uniqueAntibodiesCount: 0,
          uniqueAntigensCount: 0,
          verifiedEntries: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Debounced auto-suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      setShowSuggestions(true); // Ensure suggestions are shown while loading
      try {
        const searchResponse = await dispatch(searchEntries({ 
          searchTerm: searchQuery.trim(), 
          field: 'all', 
          limit: 200 // Increased limit to get more suggestions
        })).unwrap();

        // Debug logging (can be removed later)
        if (searchQuery.toLowerCase().includes('sjögren') || searchQuery.toLowerCase().includes('sjogren')) {
          console.log('Search query:', searchQuery);
          console.log('Search response:', searchResponse);
          console.log('Results count:', searchResponse.data?.length);
          console.log('Sample diseases:', searchResponse.data?.slice(0, 5).map(e => e.disease));
        }

        if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
          const searchTermLower = searchQuery.trim().toLowerCase();
          
          // Extract unique diseases and autoantibodies from backend results
          // Backend already filters based on search term, so we trust those results
          const diseaseMap = new Map();
          const autoantibodyMap = new Map();
          
          searchResponse.data.forEach(entry => {
            // Collect diseases with priority scoring
            if (entry.disease && entry.disease.trim()) {
              const disease = entry.disease.trim();
              // Parse priority more robustly - handle string, number, null, undefined
              let priority = 0;
              if (entry.priority != null && entry.priority !== '') {
                const parsed = parseFloat(String(entry.priority).trim());
                priority = isNaN(parsed) ? 0 : parsed;
              }
              if (!diseaseMap.has(disease)) {
                const diseaseLower = disease.toLowerCase();
                // Score: exact match = 3, starts with = 2, contains = 1
                let score = 0;
                if (diseaseLower === searchTermLower) {
                  score = 3;
                } else if (diseaseLower.startsWith(searchTermLower)) {
                  score = 2;
                } else if (diseaseLower.includes(searchTermLower)) {
                  score = 1;
                }
                diseaseMap.set(disease, { score, priority });
              } else {
                // Update priority if this entry has a higher priority
                const existing = diseaseMap.get(disease);
                const parsedPriority = entry.priority != null && entry.priority !== '' 
                  ? (isNaN(parseFloat(String(entry.priority).trim())) ? 0 : parseFloat(String(entry.priority).trim()))
                  : 0;
                if (parsedPriority > existing.priority) {
                  diseaseMap.set(disease, { score: existing.score, priority: parsedPriority });
                }
              }
            }
            
            // Collect autoantibodies with priority scoring
            if (entry.autoantibody && entry.autoantibody.trim()) {
              const autoantibody = entry.autoantibody.trim();
              // Parse priority more robustly - handle string, number, null, undefined
              let priority = 0;
              if (entry.priority != null && entry.priority !== '') {
                const parsed = parseFloat(String(entry.priority).trim());
                priority = isNaN(parsed) ? 0 : parsed;
              }
              if (!autoantibodyMap.has(autoantibody)) {
                const autoantibodyLower = autoantibody.toLowerCase();
                // Score: exact match = 3, starts with = 2, contains = 1
                let score = 0;
                if (autoantibodyLower === searchTermLower) {
                  score = 3;
                } else if (autoantibodyLower.startsWith(searchTermLower)) {
                  score = 2;
                } else if (autoantibodyLower.includes(searchTermLower)) {
                  score = 1;
                }
                autoantibodyMap.set(autoantibody, { score, priority });
              } else {
                // Update priority if this entry has a higher priority
                const existing = autoantibodyMap.get(autoantibody);
                const parsedPriority = entry.priority != null && entry.priority !== '' 
                  ? (isNaN(parseFloat(String(entry.priority).trim())) ? 0 : parseFloat(String(entry.priority).trim()))
                  : 0;
                if (parsedPriority > existing.priority) {
                  autoantibodyMap.set(autoantibody, { score: existing.score, priority: parsedPriority });
                }
              }
            }
          });
          
          // Filter: only include items that actually match the search term (disease/antibody name contains it)
          const matchesSearch = (name) => {
            if (!name || typeof name !== 'string') return false;
            return name.toLowerCase().includes(searchTermLower);
          };

          // Sort by score first (relevance to search term), then priority, and take top results
          const uniqueDiseases = Array.from(diseaseMap.entries())
            .filter(([disease]) => matchesSearch(disease))
            .sort((a, b) => {
              const priorityA = typeof a[1].priority === 'number' ? a[1].priority : (parseFloat(String(a[1].priority || 0)) || 0);
              const priorityB = typeof b[1].priority === 'number' ? b[1].priority : (parseFloat(String(b[1].priority || 0)) || 0);
              if (priorityB !== priorityA) return priorityB - priorityA;
              return b[1].score - a[1].score;
            })
            .map(([disease, data]) => ({ name: disease, priority: data.priority }))
            .slice(0, 50);

          const uniqueAutoantibodies = Array.from(autoantibodyMap.entries())
            .filter(([autoantibody]) => matchesSearch(autoantibody))
            .sort((a, b) => {
              const priorityA = typeof a[1].priority === 'number' ? a[1].priority : (parseFloat(String(a[1].priority || 0)) || 0);
              const priorityB = typeof b[1].priority === 'number' ? b[1].priority : (parseFloat(String(b[1].priority || 0)) || 0);
              if (priorityB !== priorityA) return priorityB - priorityA;
              return b[1].score - a[1].score;
            })
            .map(([autoantibody, data]) => ({ name: autoantibody, priority: data.priority }))
            .slice(0, 50);

          const combinedSuggestions = [
            ...uniqueAutoantibodies.map(ab => ({ type: 'autoantibody', value: ab.name, priority: ab.priority })),
            ...uniqueDiseases.map(d => ({ type: 'disease', value: d.name, priority: d.priority }))
          ];

          setSuggestions(combinedSuggestions);
          setShowSuggestions(true); // Always show dropdown when we have a query >= 2 chars
        } else {
          setSuggestions([]);
          // Keep showing dropdown if user is still typing (query >= 2 chars) to show "No suggestions found"
          setShowSuggestions(searchQuery.trim().length >= 2);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
        // Keep showing dropdown if user is still typing (query >= 2 chars)
        setShowSuggestions(searchQuery.trim().length >= 2);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    // Set loading state immediately when query is valid
    if (searchQuery.trim().length >= 2) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);
    }

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, dispatch]);

  // Debounced biomarker type-responsive search
  useEffect(() => {
    if (!biomarkerQuery.trim()) {
      setBiomarkerSuggestions([]);
      setBiomarkerSearchData([]);
      setSelectedBiomarker(null);
      setShowBiomarkerDropdown(false);
      setIsBiomarkerLoading(false);
      return;
    }
    setIsBiomarkerLoading(true);
    setShowBiomarkerDropdown(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/biomarkers?search=${encodeURIComponent(biomarkerQuery.trim())}`);
        const data = res.data || [];
        setBiomarkerSearchData(data);
        const seen = new Map();
        data.forEach((item) => {
          const name = (item.name || '').trim() || 'Unknown';
          if (!seen.has(name)) seen.set(name, item);
        });
        setBiomarkerSuggestions(Array.from(seen.values()));
      } catch {
        setBiomarkerSuggestions([]);
        setBiomarkerSearchData([]);
      } finally {
        setIsBiomarkerLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [biomarkerQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      if (
        biomarkerRef.current &&
        !biomarkerRef.current.contains(event.target)
      ) {
        setShowBiomarkerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search functionality - works exactly like advanced filter with exact matching
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearchType(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const query = searchQuery.trim();
      
      // First, try exact match as disease (using getAllEntries with disease filter - exact matching)
      const diseaseResponse = await dispatch(getAllEntries({ 
        page: 1,
        limit: 10000,
        disease: query
      })).unwrap();

      if (diseaseResponse.success && diseaseResponse.data && diseaseResponse.data.length > 0) {
        // Found exact disease match - extract unique autoantibodies with priority
        const autoantibodyMap = new Map();
        
        // Helper function to parse priority robustly
        const parsePriority = (priority) => {
          if (priority == null || priority === '') return 0;
          const parsed = parseFloat(String(priority).trim());
          return isNaN(parsed) ? 0 : parsed;
        };
        
        diseaseResponse.data.forEach(entry => {
          if (entry.autoantibody && entry.autoantibody.trim()) {
            const ab = entry.autoantibody.trim();
            // Get the original priority value from entry (preserve as-is for display)
            // Check if priority exists and is not empty string
            const hasPriority = entry.priority != null && entry.priority !== '' && String(entry.priority).trim() !== '';
            const originalPriority = hasPriority ? String(entry.priority).trim() : null;
            const parsedPriority = parsePriority(entry.priority);
            
            const existing = autoantibodyMap.get(ab);
            // Only update if this entry has a higher parsed priority, or if existing has no priority and this one does
            if (!existing) {
              autoantibodyMap.set(ab, { name: ab, priority: parsedPriority, originalPriority: originalPriority });
            } else {
              const existingParsedPriority = parsePriority(existing.priority);
              // Update if new priority is higher, or if existing has no priority (0) and new one has a real priority
              if (parsedPriority > existingParsedPriority || (existingParsedPriority === 0 && parsedPriority > 0 && originalPriority !== null)) {
                autoantibodyMap.set(ab, { name: ab, priority: parsedPriority, originalPriority: originalPriority });
              } else if (existing.originalPriority == null && originalPriority != null) {
                // If existing has no original priority but this one does, update it (even if parsed is same)
                autoantibodyMap.set(ab, { name: ab, priority: parsedPriority, originalPriority: originalPriority });
              }
            }
          }
        });
        
        // Sort by priority (high to low), then alphabetically if priorities are equal
        const uniqueAutoantibodies = Array.from(autoantibodyMap.values())
          .sort((a, b) => {
            // Ensure priority is a number for comparison
            const priorityA = parsePriority(a.priority);
            const priorityB = parsePriority(b.priority);
            // First sort by priority (descending - high to low)
            if (priorityB !== priorityA) {
              return priorityB - priorityA; // Higher priority number first
            }
            return a.name.localeCompare(b.name); // Alphabetical if same priority
          });
        
        setSearchType('disease');
        setSearchResults({
          type: 'disease',
          query: query,
          associatedItems: uniqueAutoantibodies, // Store objects with name and priority
          count: uniqueAutoantibodies.length
        });
        setIsSearching(false);
        return;
      }

      // If no disease match, try exact match as autoantibody (using getAllEntries with autoantibody filter - exact matching)
      const autoantibodyResponse = await dispatch(getAllEntries({ 
        page: 1,
        limit: 10000,
        autoantibody: query
      })).unwrap();

      if (autoantibodyResponse.success && autoantibodyResponse.data && autoantibodyResponse.data.length > 0) {
        // Found exact autoantibody match - extract unique diseases with priority
        const diseaseMap = new Map();
        
        // Helper function to parse priority robustly
        const parsePriority = (priority) => {
          if (priority == null || priority === '') return 0;
          const parsed = parseFloat(String(priority).trim());
          return isNaN(parsed) ? 0 : parsed;
        };
        
        autoantibodyResponse.data.forEach(entry => {
          if (entry.disease && entry.disease.trim()) {
            const disease = entry.disease.trim();
            // Get the original priority value from entry (preserve as-is for display)
            // Check if priority exists and is not empty string
            const hasPriority = entry.priority != null && entry.priority !== '' && String(entry.priority).trim() !== '';
            const originalPriority = hasPriority ? String(entry.priority).trim() : null;
            const parsedPriority = parsePriority(entry.priority);
            
            const existing = diseaseMap.get(disease);
            // Only update if this entry has a higher parsed priority, or if existing has no priority and this one does
            if (!existing) {
              diseaseMap.set(disease, { name: disease, priority: parsedPriority, originalPriority: originalPriority });
            } else {
              const existingParsedPriority = parsePriority(existing.priority);
              // Update if new priority is higher, or if existing has no priority (0) and new one has a real priority
              if (parsedPriority > existingParsedPriority || (existingParsedPriority === 0 && parsedPriority > 0 && originalPriority !== null)) {
                diseaseMap.set(disease, { name: disease, priority: parsedPriority, originalPriority: originalPriority });
              } else if (existing.originalPriority == null && originalPriority != null) {
                // If existing has no original priority but this one does, update it (even if parsed is same)
                diseaseMap.set(disease, { name: disease, priority: parsedPriority, originalPriority: originalPriority });
              }
            }
          }
        });
        
        // Sort by priority (high to low), then alphabetically if priorities are equal
        const uniqueDiseases = Array.from(diseaseMap.values())
          .sort((a, b) => {
            // Ensure priority is a number for comparison
            const priorityA = parsePriority(a.priority);
            const priorityB = parsePriority(b.priority);
            // First sort by priority (descending - high to low)
            if (priorityB !== priorityA) {
              return priorityB - priorityA; // Higher priority number first
            }
            return a.name.localeCompare(b.name); // Alphabetical if same priority
          });
        
        setSearchType('autoantibody');
        setSearchResults({
          type: 'autoantibody',
          query: query,
          associatedItems: uniqueDiseases, // Store objects with name and priority
          count: uniqueDiseases.length
        });
        setIsSearching(false);
        return;
      }

      // No exact matches found
      setSearchResults({
        type: null,
        query: query,
        associatedItems: [],
        count: 0,
        message: 'No exact match found. Please check the spelling or try a different search term.'
      });
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else if (searchQuery.trim()) {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      const firstSuggestion = suggestionsRef.current?.querySelector('.suggestion-item');
      if (firstSuggestion) firstSuggestion.focus();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    // Keep dropdown open - trigger search, results will show in dropdown
    setTimeout(() => handleSearch(), 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchType(null);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBiomarkerSelect = (biomarker) => {
    const name = (biomarker?.name || biomarker || '').trim();
    if (name) {
      router.push(`/biomarkers?antibody=${encodeURIComponent(name)}`);
    }
  };

  const clearBiomarkerSearch = () => {
    setBiomarkerQuery('');
    setBiomarkerSuggestions([]);
    setBiomarkerSearchData([]);
    setSelectedBiomarker(null);
    setShowBiomarkerDropdown(false);
  };

  // Get associations for selected biomarker from cached search data
  const selectedBiomarkerAssociations = selectedBiomarker && biomarkerSearchData.length > 0
    ? (() => {
        const items = biomarkerSearchData.filter(
          (item) => (item.name || '').trim().toLowerCase() === (selectedBiomarker || '').trim().toLowerCase()
        );
        const assoc = items.map((item) => ({
          disease: item.raw?.Disease || item.raw?.disease || '—',
          manifestation: item.manifestation || '—',
        }));
        const uniqueMap = new Map();
        assoc.forEach((a) => {
          const key = `${a.disease}|||${a.manifestation}`;
          if (!uniqueMap.has(key)) uniqueMap.set(key, a);
        });
        return Array.from(uniqueMap.values());
      })()
    : [];

  const searchCategories = [
    { icon: Target, title: "Autoantibody Search", desc: "By name, sequence, or molecular characteristics" },
    { icon: FileText, title: "Disease Association", desc: "By condition, ICD codes, or clinical presentation" },
    { icon: Database, title: "Epitope Search", desc: "By sequence, structure, or binding characteristics" },
    { icon: BarChart3, title: "Performance Metrics", desc: "By sensitivity/specificity ranges" },
    { icon: Users, title: "Clinical Context", desc: "By patient demographics, test applications" },
    { icon: Search, title: "Literature Search", desc: "By publication, author, or study type" }
  ];

  // Animation variants
  const staggerContainer = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };
  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  const features = [
    {
      icon: Zap,
      title: "Intelligent Search",
      description: "Auto-complete with synonym recognition and fuzzy matching for accurate results"
    },
    {
      icon: Shield,
      title: "Quality Validated",
      description: "Curated data with evidence level classifications and source credibility rankings"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Interactive ROC curves, sensitivity/specificity visualizations, and diagnostic metrics"
    }
  ];

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Primary Meta Tags */}
        <title>Autoantibody Database - Comprehensive Autoantibody Research Platform</title>
        <meta name="title" content="Autoantibody Database - Comprehensive Autoantibody Research Platform" />
        <meta name="description" content="Access the most comprehensive database of autoantibodies, disease associations, epitopes, and diagnostic performance metrics. Accelerate your research with intelligent search and validated clinical data." />
        <meta name="keywords" content="autoantibody, autoantibody database, autoimmune diseases, disease associations, epitopes, diagnostic biomarkers, clinical research, immunology, serology, autoantigens" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://autoabdb.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/" />
        <meta property="og:title" content="Autoantibody Database - Comprehensive Autoantibody Research Platform" />
        <meta property="og:description" content="Access the most comprehensive database of autoantibodies, disease associations, epitopes, and diagnostic performance metrics. Accelerate your research with intelligent search and validated clinical data." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/" />
        <meta name="twitter:title" content="Autoantibody Database - Comprehensive Autoantibody Research Platform" />
        <meta name="twitter:description" content="Access the most comprehensive database of autoantibodies, disease associations, epitopes, and diagnostic performance metrics. Accelerate your research with intelligent search and validated clinical data." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <PublicHeader />

      {/* Hero Section - pt-20 for fixed header clearance */}
      <div className="relative z-10 px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-32">
        <div className="w-[90%] mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <Image
                src={logo}
                alt="Autoantibody Database"
                width={208}
                height={208}
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 mx-auto block"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 sm:px-5 sm:py-2.5 mb-6 border border-white/20"
            >
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-sm text-gray-200 font-medium">Comprehensive Autoantibody Database</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
            >
              Discover{' '}
              <motion.span
                className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                {'  Autoantibody  '}
              </motion.span>
             {' '}Insights
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="max-w-2xl mx-auto mb-8 sm:mb-10 px-4 sm:px-6 text-sm sm:text-base text-gray-300/95 italic leading-relaxed text-center"
            >
              Type to search diseases and autoantibodies for associations below, or explore clinical manifestations with an interactive network graph.
            </motion.p>

            {/* Search sections - side by side (elevate when dropdown open to prevent collision) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`w-[90%] mx-auto mb-6 sm:mb-10 px-3 sm:px-4 md:px-6 transition-all ${(showSuggestions && searchQuery.trim().length >= 2) || (showBiomarkerDropdown && biomarkerQuery.trim()) ? 'relative z-[60]' : ''}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {/* Section 1: Disease & Autoantibody Search */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/40 to-violet-500/50 rounded-2xl sm:rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300"
                    animate={{ opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div ref={suggestionsRef} className="relative bg-white/5 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 min-h-[160px] sm:min-h-[180px] flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white/20 shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
                      </motion.div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Autoimmune Disease & Autoantibody</h3>
                        <p className="text-xs sm:text-sm text-blue-300/90 mt-0.5">Search by disease or autoantibody name</p>
                      </div>
                    </div>
                    <div className="relative flex-1 flex flex-col justify-end">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                          setSearchResults(null);
                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                        placeholder="e.g. Lupus, anti-dsDNA, Sjögren..."
                        className="w-full px-5 py-4 pl-12 sm:pl-14 pr-14 sm:pr-16 text-base sm:text-lg bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/60 focus:bg-white/10 transition-all duration-200 min-h-[54px] sm:min-h-[58px] touch-manipulation"
                      />
                      <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all z-20 touch-manipulation"
                          aria-label="Clear search"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                        </button>
                      )}
                    </div>
                  {/* Dropdown: suggestions or results (type-responsive) */}
                  {showSuggestions && searchQuery.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-slate-900/90 backdrop-blur-2xl backdrop-saturate-150 border border-white/25 rounded-xl sm:rounded-2xl z-[100] max-h-[35vh] sm:max-h-[40vh] overflow-y-auto shadow-2xl shadow-black/40 ring-1 ring-white/10">
                      {isSearching ? (
                        <div className="p-5 sm:p-6 text-center">
                          <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-blue-400 mx-auto" />
                          <p className="text-gray-400 text-sm sm:text-base mt-3">Loading...</p>
                        </div>
                      ) : searchResults && searchResults.query === searchQuery.trim() ? (
                        <div className="p-4 sm:p-5">
                          {searchResults.count > 0 ? (
                            <>
                              <h4 className="text-white font-medium mb-3 text-sm">
                                {searchResults.type === 'disease' 
                                  ? `Autoantibodies for "${searchResults.query}"`
                                  : `Diseases for "${searchResults.query}"`}
                              </h4>
                              <div className="max-h-44 overflow-y-auto space-y-1.5 mb-3">
                                {searchResults.associatedItems.map((item, index) => {
                                  const itemName = typeof item === 'string' ? item : item.name;
                                  const itemPriority = typeof item === 'object' && item?.originalPriority ? item.originalPriority : null;
                                  return (
                                    <div key={index} className="bg-white/5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-200 flex justify-between items-center gap-2 min-h-[44px]">
                                      <span className="truncate">{itemName}</span>
                                      {itemPriority && <span className="px-1.5 py-0.5 bg-blue-500/30 text-blue-200 rounded text-xs">{itemPriority}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                              <Link
                                href={`/dashboard/disease/disease?${searchResults.type === 'disease' ? `disease=${encodeURIComponent(searchResults.query)}` : `autoantibody=${encodeURIComponent(searchResults.query)}`}`}
                                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm"
                              >
                                View all details <ArrowRight className="w-4 h-4" />
                              </Link>
                            </>
                          ) : (
                            <p className="text-gray-400 text-sm text-center py-2">{searchResults.message || 'No matches found'}</p>
                          )}
                        </div>
                      ) : isLoadingSuggestions ? (
                        <div className="p-5 sm:p-6 text-center">
                          <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-blue-400 mx-auto" />
                          <p className="text-gray-400 text-sm sm:text-base mt-3">Searching...</p>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <div className="p-2 sm:p-3 space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <motion.button
                              key={`${suggestion.type}-${index}-${suggestion.value}`}
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                              className="suggestion-item w-full text-left px-4 py-3.5 sm:py-4 rounded-lg hover:bg-blue-500/20 active:bg-blue-500/30 transition-all flex items-center gap-3 focus:outline-none focus:bg-blue-500/20 min-h-[52px] touch-manipulation"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.02 }}
                              whileHover={{ x: 4 }}
                            >
                              {suggestion.type === 'disease' ? (
                                <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              ) : (
                                <Search className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm truncate block">{suggestion.value}</span>
                                <span className="text-gray-400 text-xs">{suggestion.type === 'disease' ? 'Disease' : 'Autoantibody'}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 sm:p-6 text-center">
                          <p className="text-gray-400 text-sm sm:text-base">No matches for &quot;{searchQuery}&quot;</p>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </motion.div>

                {/* Section 2: Biomarker Search */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-teal-500/40 to-cyan-600/50 rounded-2xl sm:rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300"
                    animate={{ opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  />
                  <div ref={biomarkerRef} className="relative bg-white/5 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 min-h-[160px] sm:min-h-[180px] flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-white/20 shrink-0"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <FlaskConical className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
                      </motion.div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Clinical Manifestation & Disease Association</h3>
                        <p className="text-xs sm:text-sm text-emerald-300/90 mt-0.5">Explore network graph & disease associations</p>
                      </div>
                    </div>
                    <div className="relative flex-1 flex flex-col justify-end">
                      <input
                        type="text"
                        value={biomarkerQuery}
                        onChange={(e) => {
                          setBiomarkerQuery(e.target.value);
                          setShowBiomarkerDropdown(true);
                          setSelectedBiomarker(null);
                        }}
                        onFocus={() => biomarkerQuery.trim() && setShowBiomarkerDropdown(true)}
                        placeholder="e.g. ANA, anti-SSA, rheumatoid factor..."
                        className="w-full px-5 py-4 pl-12 sm:pl-14 pr-14 sm:pr-16 text-base sm:text-lg bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 focus:bg-white/10 transition-all duration-200 min-h-[54px] sm:min-h-[58px] touch-manipulation"
                      />
                      <FlaskConical className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                      {biomarkerQuery && (
                        <button
                          onClick={clearBiomarkerSearch}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all z-20 touch-manipulation"
                          aria-label="Clear biomarker search"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                        </button>
                      )}
                    </div>
                  {/* Dropdown: biomarker suggestions or associations (type-responsive) */}
                  {showBiomarkerDropdown && biomarkerQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-slate-900/90 backdrop-blur-2xl backdrop-saturate-150 border border-white/25 rounded-xl sm:rounded-2xl z-[100] max-h-[35vh] sm:max-h-[40vh] overflow-y-auto shadow-2xl shadow-black/40 ring-1 ring-white/10">
                      {isBiomarkerLoading ? (
                        <div className="p-5 sm:p-6 text-center">
                          <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-emerald-400 mx-auto" />
                          <p className="text-gray-400 text-sm sm:text-base mt-3">Searching...</p>
                        </div>
                      ) : selectedBiomarker && selectedBiomarkerAssociations.length >= 0 ? (
                        <div className="p-4 sm:p-5">
                          {selectedBiomarkerAssociations.length > 0 ? (
                            <>
                              <h4 className="text-white font-medium mb-3 text-sm">Associations for &quot;{selectedBiomarker}&quot;</h4>
                              <div className="max-h-44 overflow-y-auto space-y-1.5 mb-3">
                                {selectedBiomarkerAssociations.map((item, index) => (
                                  <div key={index} className="bg-white/5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-200 flex justify-between items-center gap-2 min-h-[44px]">
                                    <span className="truncate">{item.disease}</span>
                                    {item.manifestation !== '—' && (
                                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-200 rounded text-xs shrink-0">{item.manifestation}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <Link href="/biomarkers" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm">
                                Explore biomarkers <ArrowRight className="w-4 h-4" />
                              </Link>
                            </>
                          ) : (
                            <div>
                              <p className="text-gray-400 text-sm mb-2">No associations for &quot;{selectedBiomarker}&quot;</p>
                              <Link href="/biomarkers" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm">Browse all biomarkers</Link>
                            </div>
                          )}
                        </div>
                      ) : biomarkerSuggestions.length > 0 ? (
                        <div className="p-2 sm:p-3">
                          {biomarkerSuggestions.slice(0, 15).map((item, i) => (
                            <button
                              key={item._id || i}
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); handleBiomarkerSelect(item); }}
                              className="w-full text-left px-4 py-3.5 sm:py-4 rounded-lg hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-all flex items-center justify-between gap-3 min-h-[52px] touch-manipulation"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-white text-sm font-medium truncate">{item.name}</div>
                                {item.manifestation && <div className="text-gray-400 text-xs truncate mt-0.5">{item.manifestation}</div>}
                              </div>
                              {item.raw?.Disease && (
                                <span className="text-xs px-2 py-0.5 bg-emerald-500/25 text-emerald-200 rounded shrink-0 truncate max-w-[100px]">{item.raw.Disease}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 sm:p-6 text-center">
                          <p className="text-gray-400 text-sm sm:text-base">No biomarkers for &quot;{biomarkerQuery}&quot;</p>
                          <Link href="/biomarkers" className="inline-block mt-3 text-emerald-400 hover:text-emerald-300 text-sm sm:text-base font-medium">Browse all</Link>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {error && (
              <div className="max-w-2xl mx-auto mt-4 px-4">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4">
                  <p className="text-red-300 text-sm sm:text-base text-center">{error}</p>
                </div>
              </div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link
                  href="/dashboard/disease/disease"
                  className="group/btn inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 border border-white/20"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link
                  href="/documentation"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <span>View Documentation</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

         {/* CTA Section */}
         <motion.div
          className="relative z-10 px-4 sm:px-6 pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="w-[90%] mx-auto text-center">
          <motion.div
            className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Accelerate Your Research?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Join thousands of researchers worldwide using our comprehensive autoantibody database
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/auth/register" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 sm:px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all inline-block">
                  Get Started(Only for Institutional Use)
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/auth/login" className="border border-white/30 text-white px-6 py-3 sm:px-8 rounded-xl hover:bg-white/10 transition-all text-center inline-block">
                  Request Demo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search Categories */}
      <motion.div
        className="relative z-10 px-4 sm:px-6 -mt-8 sm:-mt-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[90%] mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">Six Primary Search Categories</h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-40px' }}
            >
              {searchCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div key={index} className="group cursor-pointer" variants={staggerItem}>
                  <motion.div
                    className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 transition-all relative overflow-hidden hover:shadow-lg hover:shadow-indigo-500/20"
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4"
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                      <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{category.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{category.desc}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>


      {/* Features Section */}
      <motion.div
        className="relative z-10 px-4 sm:px-6 py-12 sm:py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[90%] mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Advanced Features for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Research Excellence</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Built with cutting-edge technology and scientific rigor to support your research workflow
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} className="text-center group px-4" variants={staggerItem}>
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { value: statistics.uniqueAntibodiesCount, label: 'Autoantibodies' },
                { value: statistics.uniqueDiseasesCount, label: 'Disease Associations' },
                { value: statistics.uniqueAntigensCount, label: 'Autoantigens' },
                { value: statistics.totalEntries, label: 'Total Entries' }
              ].map((stat, index) => (
                <motion.div key={index} variants={staggerItem} whileHover={{ scale: 1.05, y: -2 }} className="cursor-default">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {loading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-20 mx-auto rounded"></div>
                    ) : (
                      `${stat.value?.toLocaleString() || 0}`
                    )}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-400 text-sm">
                  {error} - Showing cached data
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* About Section - Utility, Purpose and Objectives */}
      <motion.div
        className="relative z-10 px-4 sm:px-6 py-12 sm:py-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-[90%] mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Main Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Autoantibody Database: <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Utility, Purpose and Objectives</span>
              </h2>
            </div>

            {/* Introduction */}
            <div className="mb-8 sm:mb-12">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-justify">
                Autoantibody databases are specialized bioinformatics platforms designed to collect, organize, and provide accessible information on autoantibodies, their antigenic targets, and associated diseases. These resources play a vital role in both clinical and research environments, supporting efficient data retrieval, biomarker discovery, disease classification, and translational investigations in autoimmune disorders. While some databases are openly accessible, others are available through restricted access depending on their scope and intended use.
              </p>
            </div>

            {/* Utility Section */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Utility</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                Autoantibody databases support a wide range of academic, clinical, and translational applications, including:
              </p>
              <ul className="space-y-3 sm:space-y-4 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Consolidating autoantibody–antigen relationships and disease associations from diverse scientific literature.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Helping researchers and clinicians identify, validate, and prioritize novel autoantibody biomarkers for diagnosis, prognosis, and therapeutic monitoring.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Providing curated panels of clinically relevant autoantibodies that improve disease differentiation, classification, and patient stratification.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Enabling machine learning and advanced analytics using multiplex autoantibody profiles for disease prediction and precision medicine.</span>
                </li>
              </ul>
            </div>

            {/* Purpose Section */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Purpose</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                The primary purpose of autoantibody databases is to advance the understanding, diagnosis, and management of autoimmune diseases by:
              </p>
              <ul className="space-y-3 sm:space-y-4 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Creating comprehensive knowledge bases through the collation of human autoantibody data for clinical and research use.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Supporting precision diagnostics by linking autoantibodies to disease phenotypes, subtypes, and clinical outcomes.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Guiding assay development by providing reference sets essential for validating multiplex autoantibody tests and identifying gaps in traditional serologic approaches.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Providing a foundation for research into molecular mechanisms of autoimmunity, with a focus on disease-relevant antigens, epitope mapping, and immunopathogenic pathways.</span>
                </li>
              </ul>
            </div>

            {/* Objective Section */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Objective</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                Key objectives of autoantibody databases include:
              </p>
              <ul className="space-y-3 sm:space-y-4 text-gray-300 mb-4 sm:mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Aggregating published autoantibody–antigen–disease associations into a structured, accessible format.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Providing detailed annotations of autoantigens and autoantibodies, including disease links, literature references, molecular features, and epitope information.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Offering intuitive tools for browsing, querying, downloading, and integrating data into both research and clinical workflows.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Supporting improved diagnostic accuracy, clinical decision-making, and the translation of basic immunology discoveries into patient benefit.</span>
                </li>
              </ul>
              <div className="bg-blue-500/20 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed italic">
                  Autoantibody databases form the backbone of modern translational immunology—driving innovation, enabling data-driven diagnostics, and accelerating precision research in autoimmune diseases.
                </p>
              </div>
            </div>

            {/* Contribution Section */}
            <div className="bg-white border border-white/10 rounded-xl p-6 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-black">Contribution</h3>
              </div>
              <p className="text-base sm:text-lg text-black leading-relaxed">
                The team has worked within its limitations and made every effort to include the most significant and relevant autoantibodies. As newer autoantibodies, associations, and epitopes continue to emerge, some may not yet be included, and we welcome any suggestions if you find missing information. Intellectual and constructive feedback to further improve the database is greatly appreciated.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

   

      <PublicFooter />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5],
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-white/20"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${5 + (i * 11) % 90}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      </div>
    </>
  );
}
