import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Upload, FileText, AlertCircle, CheckCircle, Info, RefreshCw, Search, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosSetup';

const validTypes = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

// Format value as percentage: 0.5 → 50%, 0.4-0.5 → 40-50%, "50%" stays "50%", "~27" → "~27%"
const formatAsPercentage = (val) => {
  if (val == null || val === '') return '—';
  const s = String(val).trim();
  if (!s) return '—';
  if (s.includes('%')) return s; // Already has %
  // Handle range e.g. "0.4-0.5" or "40-50"
  if (s.includes('-') || s.includes('–')) {
    const parts = s.split(/[-–]/).map((p) => p.trim());
    const formatted = parts
      .map((p) => {
        const n = parseFloat(p.replace(/^[~\s]+/, ''));
        if (isNaN(n)) return p;
        if (n > 0 && n < 1) return Math.round(n * 100) + '%';
        if (n >= 1 && n <= 100) return n + '%';
        return p;
      })
      .join('-');
    return formatted || s;
  }
  const prefix = s.match(/^([~\s]+)/)?.[1] || '';
  const n = parseFloat(s.replace(/^[~\s]+/, ''));
  if (isNaN(n)) return s;
  if (n > 0 && n < 1) return prefix + Math.round(n * 100) + '%';
  if (n >= 1 && n <= 100) return prefix + n + '%';
  if (n > 100) return prefix + n + '%';
  return s;
};

export default function ImportBiomarkerData() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 200, total: 0, totalPages: 0 });
  const PAGE_LIMITS = [50, 200, 300, 400, 500];
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const prevSearchRef = useRef('');

  // Page numbers to show in pagination (up to 5, centered on current)
  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    if (totalPages <= 0) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const PaginationControls = () => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setPagination((p) => ({ ...p, page: 1 }))}
        disabled={pagination.page <= 1}
        className="min-w-[36px] h-9 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 hover:enabled:bg-gray-50 transition-colors"
        aria-label="Go to first page"
      >
        «
      </button>
      <button
        onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
        disabled={pagination.page <= 1}
        className="min-w-[80px] h-9 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 hover:enabled:bg-gray-50 transition-colors"
      >
        Previous
      </button>
      {getPageNumbers().map((n) => (
        <button
          key={n}
          onClick={() => setPagination((p) => ({ ...p, page: n }))}
          className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-medium transition-colors ${
            pagination.page === n
              ? 'bg-indigo-600 text-white border border-indigo-600'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
        disabled={pagination.page >= pagination.totalPages}
        className="min-w-[80px] h-9 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 hover:enabled:bg-gray-50 transition-colors"
      >
        Next
      </button>
      <button
        onClick={() => setPagination((p) => ({ ...p, page: p.totalPages }))}
        disabled={pagination.page >= pagination.totalPages}
        className="min-w-[36px] h-9 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 hover:enabled:bg-gray-50 transition-colors"
        aria-label="Go to last page"
      >
        »
      </button>
    </div>
  );

  useEffect(() => {
    setDataLoading(true);
    const timer = setTimeout(() => {
      // When search changes, start from page 1 (search across full DB, not just current page)
      const searchChanged = prevSearchRef.current !== searchQuery;
      if (searchChanged) prevSearchRef.current = searchQuery;
      const pageToUse = searchChanged ? 1 : pagination.page;

      const params = new URLSearchParams({
        page: pageToUse.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      axiosInstance
        .get(`/biomarkers/list?${params}`)
        .then((res) => {
          if (res.data?.success) {
            setData(res.data.data || []);
            setPagination(res.data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
          }
        })
        .catch((err) => {
          setData([]);
          setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to load data' });
        })
        .finally(() => setDataLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [pagination.page, pagination.limit, searchQuery, refreshKey]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }
      if (
        !validTypes.includes(selected.type) &&
        !selected.name.toLowerCase().endsWith('.csv') &&
        !selected.name.toLowerCase().endsWith('.xlsx') &&
        !selected.name.toLowerCase().endsWith('.xls')
      ) {
        setStatus({ type: 'error', message: 'Please select CSV or XLSX file' });
        return;
      }
      setFile(selected);
      setStatus(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }
      if (
        validTypes.includes(dropped.type) ||
        dropped.name.toLowerCase().endsWith('.csv') ||
        dropped.name.toLowerCase().endsWith('.xlsx') ||
        dropped.name.toLowerCase().endsWith('.xls')
      ) {
        setFile(dropped);
        setStatus(null);
      } else {
        setStatus({ type: 'error', message: 'Please select CSV or XLSX file' });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a CSV or XLSX file' });
      return;
    }
    setLoading(true);
    setStatus(null);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/biomarkers/import/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (res.data?.success) {
        const { inserted, total, failed, filteredOut, sheetsRead } = res.data.data || {};
        let msg = res.data.message || 'Import completed successfully!';
        if (inserted !== undefined && total !== undefined) {
          msg += ` ${inserted} of ${total} rows imported.`;
          if (filteredOut > 0) msg += ` (${filteredOut} rows filtered out)`;
          if (failed > 0) msg += ` ${failed} failed.`;
          if (sheetsRead > 0) msg += ` [${sheetsRead} sheet(s) read]`;
        }
        setStatus({ type: 'success', message: msg });
        setFile(null);
        setRefreshKey((k) => k + 1);
      } else {
        setStatus({ type: 'error', message: res.data?.message || 'Import failed' });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setStatus({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Import failed',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  const handleLoadFromServerFile = async () => {
    if (!confirm('This will REPLACE all biomarker data with data from "Clinical manifestation disease related.xlsx" in backend/data/. Continue?')) return;
    setSyncLoading(true);
    setStatus(null);
    try {
      const res = await axiosInstance.post('/biomarkers/import/server-file');
      if (res.data?.success) {
        const { inserted, total } = res.data.data || {};
        setStatus({
          type: 'success',
          message: res.data.message + (inserted !== undefined ? ` ${inserted} of ${total} rows imported.` : ''),
        });
        setRefreshKey((k) => k + 1);
      } else {
        setStatus({ type: 'error', message: res.data?.message || 'Import failed' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Import failed',
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleRemoveAll = async () => {
    if (!confirm('Are you sure you want to remove ALL biomarker data? This cannot be undone.')) return;
    setRemoveLoading(true);
    setStatus(null);
    try {
      const res = await axiosInstance.delete('/biomarkers/all');
      if (res.data?.success) {
        const { deleted } = res.data.data || {};
        setStatus({
          type: 'success',
          message: res.data.message || `Removed ${deleted || 0} entries`,
        });
        setRefreshKey((k) => k + 1);
      } else {
        setStatus({ type: 'error', message: res.data?.message || 'Remove failed' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Remove failed',
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExportLoading(true);
    setStatus(null);
    try {
      const params = new URLSearchParams({ format });
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const res = await axiosInstance.get(`/biomarkers/export?${params}`, {
        responseType: 'blob',
      });
      if (res.data.type?.includes('application/json')) {
        const text = await res.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message || 'Export failed');
      }
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `biomarkers_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setStatus({ type: 'success', message: `Exported successfully as ${format.toUpperCase()}` });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || err.response?.data?.message || 'Export failed',
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Import Biomarker Data</h1>
          <p className="text-gray-600 text-sm">
            Manage biomarker data for Clinical Manifestation & Disease Association. Upload CSV/XLSX or remove all.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('xlsx')}
            disabled={exportLoading || dataLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {exportLoading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
            Export XLSX
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exportLoading || dataLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {exportLoading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
            Export CSV
          </button>
          <Link
            href="/biomarkers"
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-200"
          >
            <FileText size={18} />
            View Network Graph
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upload New File & File Format - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New File</h2>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload size={24} className="text-gray-600" />
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Selected: {file.name}</p>
                    <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Drop file here or click to browse</p>
                    <p className="text-xs text-gray-500">CSV or XLSX, max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {loading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Add New File
                  </>
                )}
              </button>
              {file && !loading && (
                <button
                  onClick={() => {
                    setFile(null);
                    setStatus(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleLoadFromServerFile}
                disabled={syncLoading || dataLoading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Load from backend/data/Clinical manifestation disease related.xlsx"
              >
                {syncLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Load from Server File
                  </>
                )}
              </button>
              <button
                onClick={handleRemoveAll}
                disabled={removeLoading || dataLoading}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {removeLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Remove All
                  </>
                )}
              </button>
            </div>

            {status && (
              <div
                className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
                  status.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 text-sm whitespace-pre-line">{status.message}</div>
              </div>
            )}
            </div>
          </div>
          {/* File Format */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">File Format</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Supported: CSV, XLSX. Column names are flexible. Expected columns:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Autoantibody</strong> / Name</li>
                <li>• <strong>Disease</strong></li>
                <li>• <strong>Disease Association</strong> (% percentage)</li>
                <li>• <strong>Clinical Manifestation</strong></li>
                <li>• <strong>Prevalence</strong> (% percentage)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                Data powers the Clinical Manifestation & Disease Association search and network graph on the homepage.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Data Table - Full Width */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Existing Data</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search across all data (autoantibody, disease, manifestation, prevalence…)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) =>
                      setPagination((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))
                    }
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAGE_LIMITS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </span>
                  <PaginationControls />
                </div>
              </div>
            </div>

            {dataLoading ? (
              <div className="py-12 text-center text-gray-500">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                Loading...
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p>No biomarker data yet.</p>
                <p className="text-sm mt-1">Upload a CSV or XLSX file to get started.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">S.No.</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Autoantibody</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Disease</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Disease Association (% percentage)</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Clinical Manifestation</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Prevalence (% percentage)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={row._id || i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3 text-gray-500">
                            {(pagination.page - 1) * pagination.limit + i + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-900">{row.name || row.raw?.Autoantibody || row.raw?.Name || '—'}</td>
                          <td className="py-3 px-3 text-gray-700">{row.raw?.Disease || row.raw?.disease || '—'}</td>
                          <td className="py-3 px-3 text-gray-700">{formatAsPercentage(row.raw?.['Disease Association (% percentage)'] || row.raw?.['Disease Association'] || row.raw?.DiseaseAssociation || row.raw?.diseaseAssociation)}</td>
                          <td className="py-3 px-3 text-gray-700">{row.manifestation || row.raw?.['Clinical Manifestation'] || row.raw?.Manifestation || '—'}</td>
                          <td className="py-3 px-3 text-gray-600">{formatAsPercentage(row.prevalence || row.raw?.['Prevalence (% percentage)'] || row.raw?.['Prevelanse (% percentage)'] || row.raw?.Prevalence || row.raw?.prevalence)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Showing {(pagination.page - 1) * pagination.limit + 1}–
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </p>
                    <PaginationControls />
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </Layout>
  );
}
