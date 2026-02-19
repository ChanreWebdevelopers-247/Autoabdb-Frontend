import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Sparkles, Loader2, AlertCircle, RefreshCw, Minus, PlusIcon } from "lucide-react";

// Simple markdown to HTML converter
const formatMarkdown = (text) => {
  if (!text) return "";

  // Split by lines for better processing
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let inTable = false;
  let tableRows = [];

  const processTable = (rows) => {
    if (rows.length === 0) return "";
    
    let tableHtml = "<div class='overflow-x-auto my-6 rounded-lg border border-gray-300 '><table class='min-w-full divide-y divide-gray-200'><thead class='bg-gradient-to-r from-purple-50 to-indigo-50'>";
    
    // First row is header
    if (rows.length > 0) {
      const headerCells = rows[0].split("|").filter(cell => cell.trim());
      tableHtml += "<tr>";
      headerCells.forEach(cell => {
        tableHtml += `<th class='px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300'>${cell.trim()}</th>`;
      });
      tableHtml += "</tr></thead><tbody class='bg-white divide-y divide-gray-200'>";
    }
    
    // Remaining rows are data
    for (let i = 2; i < rows.length; i++) {
      if (rows[i].trim().startsWith("|") && rows[i].includes("|")) {
        const cells = rows[i].split("|").filter(cell => cell.trim());
        tableHtml += "<tr class='hover:bg-purple-50 transition-colors duration-150'>";
        cells.forEach(cell => {
          tableHtml += `<td class='px-4 py-3 text-sm text-gray-700'>${cell.trim()}</td>`;
        });
        tableHtml += "</tr>";
      }
    }
    
    tableHtml += "</tbody></table></div>";
    return tableHtml;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for table
    if (trimmedLine.startsWith("|") && trimmedLine.includes("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      
      // Check if next line is not a table row or separator
      if (i + 1 >= lines.length || (!lines[i + 1].trim().startsWith("|") && !lines[i + 1].includes("---"))) {
        html += processTable(tableRows);
        inTable = false;
        tableRows = [];
      }
      continue;
    } else if (inTable && trimmedLine.includes("---")) {
      // Table separator row, skip it
      continue;
    } else {
      inTable = false;
    }

    // Headers
    if (trimmedLine.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3 class='text-lg font-bold text-gray-800 mt-6 mb-3'>${trimmedLine.substring(4)}</h3>`;
      continue;
    } else if (trimmedLine.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2 class='text-xl font-bold text-purple-700 mt-8 mb-4'>${trimmedLine.substring(3)}</h2>`;
      continue;
    } else if (trimmedLine.startsWith("# ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h1 class='text-2xl font-bold text-gray-900 mt-8 mb-4 pb-3 border-b border-gray-200'>${trimmedLine.substring(2)}</h1>`;
      continue;
    }

    // Lists
    if (trimmedLine.match(/^[\*\-\+] /) || trimmedLine.match(/^\d+\. /)) {
      if (!inList) {
        html += "<ul class='list-disc list-inside space-y-2 mb-4 text-gray-700'>";
        inList = true;
      }
      const listContent = trimmedLine.replace(/^[\*\-\+] |^\d+\. /, "");
      html += `<li class='leading-relaxed'>${formatInlineMarkdown(listContent)}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    // Empty lines
    if (trimmedLine === "") {
      if (!inList) {
        html += "<br />";
      }
      continue;
    }

    // Regular paragraphs
    html += `<p class='text-gray-700 mb-4 leading-relaxed'>${formatInlineMarkdown(trimmedLine)}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
};

// Format inline markdown (bold, italic, links, code)
const formatInlineMarkdown = (text) => {
  if (!text) return "";
  
  // First handle bold (double asterisks) - this must come before italic
  let html = text.replace(/\*\*(.*?)\*\*/gim, "<strong class='font-semibold text-gray-900'>$1</strong>");
  
  // Then handle italic (single asterisks that aren't part of bold)
  // Use a pattern that matches single asterisks not followed/preceded by asterisks
  html = html.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/gim, "$1<em class='italic text-gray-700'>$2</em>$3");
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-purple-600 font-medium border-b border-purple-300 hover:border-purple-600 transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Code
  html = html.replace(/`([^`]+)`/gim, "<code class='bg-gray-100 px-2 py-1 rounded text-sm font-mono text-purple-700 border border-gray-200'>$1</code>");
  
  return html;
};

// Cache key generator
const getCacheKey = (autoantibody, uniprot) => {
  return `ai_report_${autoantibody}_${uniprot}`;
};

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Get cached report
const getCachedReport = (autoantibody, uniprot) => {
  try {
    const cacheKey = getCacheKey(autoantibody, uniprot);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
    }
  } catch (err) {
    console.error("Error reading cache:", err);
  }
  return null;
};

// Save report to cache
const saveToCache = (autoantibody, uniprot, report) => {
  try {
    const cacheKey = getCacheKey(autoantibody, uniprot);
    const cacheData = {
      data: report,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (err) {
    console.error("Error saving to cache:", err);
    // If localStorage is full, try to clear old entries
    try {
      const keys = Object.keys(localStorage);
      const aiReportKeys = keys.filter(key => key.startsWith("ai_report_"));
      if (aiReportKeys.length > 50) {
        // Remove oldest 10 entries
        const entries = aiReportKeys.map(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, timestamp: data.timestamp };
          } catch {
            return { key, timestamp: 0 };
          }
        }).sort((a, b) => a.timestamp - b.timestamp);
        
        entries.slice(0, 10).forEach(({ key }) => {
          localStorage.removeItem(key);
        });
      }
      // Retry saving
      localStorage.setItem(getCacheKey(autoantibody, uniprot), JSON.stringify(cacheData));
    } catch (retryErr) {
      console.error("Error clearing cache:", retryErr);
    }
  }
};

const AIReport = ({ autoantibodyName, uniprotId }) => {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const abortControllerRef = useRef(null);

  const generatePrompt = (autoantibody, uniprot) => {
    return `You are a biomedical research assistant specializing in immunology and autoimmunity.  

Generate a comprehensive, research-level report about the autoantibody ${autoantibody} and its target autoantigen (UniProt ID: ${uniprot}).  

Your report should include:

1. **Basic Overview**

   - Disease association (e.g., SLE, RA, Sjögren's, etc.)

   - Antibody type and synonyms

   - Target antigen (name, gene, and molecular weight)

2. **Autoantigen Details (based on UniProt entry)**

   - Protein function, localization, and biological role

   - Structural domains and any known PDB structures

   - Gene details (gene name, chromosome location, transcript length)

   - Expression pattern (tissue distribution, stress response)

   - Known mutations and their effects

3. **Pathogenic Mechanism**

   - How the autoantibody arises (e.g., molecular mimicry, cell death, stress)

   - Role in disease pathogenesis (e.g., immune complex formation, complement activation)

   - Mechanistic pathway diagram (optional)

4. **Clinical Relevance**

   - Diagnostic, prognostic, or therapeutic implications

   - Research findings on prevalence or correlation with disease severity

   - Associated biomarkers or cofactors

5. **Immunological Role**

   - Immune signaling involvement (TLRs, cytokines, etc.)

   - Known epitopes or binding regions (if reported)

   - Effects on immune cell types (e.g., T cells, B cells, macrophages)

6. **Summary Table**

   - Condensed key facts (disease, antigen, molecular weight, localization, function, clinical relevance)

7. **References**

   - Include links to relevant UniProt, PubMed, or structural databases for credibility.

Output format:

- Use scientific tone

- Clear sections with headings

- Include markdown tables and bullet points for clarity

- Add illustrative pathway explanation (textual if image not possible)`;
  };

  const fetchAIReport = useCallback(async (forceRefresh = false) => {
    if (!autoantibodyName || !uniprotId) {
      setError("Autoantibody name and UniProt ID are required");
      return;
    }

    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cachedReport = getCachedReport(autoantibodyName, uniprotId);
      if (cachedReport) {
        setReport(cachedReport);
        setLoading(false);
        setError(null);
        setIsCached(true);
        return;
      }
    }
    
    setIsCached(false);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    if (forceRefresh) {
      setReport("");
    }

    try {
      const prompt = generatePrompt(autoantibodyName, uniprotId);
      
      const response = await axios.post(
        "https://api.chanrephysio.com/chat",
        {
          message: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000, // 60 seconds timeout
          signal: controller.signal,
        }
      );

      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }

      // Handle different response formats
      let reportText = "";
      if (typeof response.data === "string") {
        reportText = response.data;
      } else if (response.data?.message) {
        reportText = response.data.message;
      } else if (response.data?.response) {
        reportText = response.data.response;
      } else if (response.data?.text) {
        reportText = response.data.text;
      } else if (response.data?.content) {
        reportText = response.data.content;
      } else {
        reportText = JSON.stringify(response.data, null, 2);
      }

      setReport(reportText);
      // Save to cache
      saveToCache(autoantibodyName, uniprotId, reportText);
    } catch (err) {
      // Don't show error if request was aborted
      if (axios.isCancel(err) || err.name === 'AbortError') {
        return;
      }
      
      console.error("Error fetching AI report:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate AI report. Please try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [autoantibodyName, uniprotId]);

  useEffect(() => {
    // Check cache first on mount
    if (autoantibodyName && uniprotId) {
      const cachedReport = getCachedReport(autoantibodyName, uniprotId);
      if (cachedReport) {
      setReport(cachedReport);
      setLoading(false);
      setError(null);
      setIsCached(true);
    } else {
      setIsCached(false);
      fetchAIReport(false);
    }
    }

    // Cleanup: cancel request on unmount or when props change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoantibodyName, uniprotId, fetchAIReport]);


  if (!autoantibodyName || !uniprotId) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl  border border-gray-200 overflow-hidden transition-all duration-300 ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Research Report
              </h2>
              {/* {isCached && report && (
                <p className="text-xs text-purple-100 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-200 rounded-full"></span>
                  Loaded from cache
                </p>
              )} */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAIReport(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
              title="Regenerate report (bypasses cache)"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/30"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <Minus size={18} /> : <PlusIcon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {expanded && (
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-base font-medium text-gray-700 mt-6">
                Generating comprehensive research report...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 ">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-red-900 mb-2">
                    Error Generating Report
                  </p>
                  <p className="text-sm text-red-700 mb-4 leading-relaxed">{error}</p>
                  <button
                    onClick={() => fetchAIReport(true)}
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200   transform hover:-translate-y-0.5"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {report && !loading && (
            <div className="bg-white rounded-xl p-6 ">
              <div
                className="markdown-content text-gray-900"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(report),
                }}
              />
            </div>
          )}

          {!report && !loading && !error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-base font-medium text-gray-700 mb-1">
                No report generated yet
              </p>
              <p className="text-sm text-gray-500">
                Click &quot;Refresh&quot; to generate the AI report
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIReport;

