import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { importEntriesFromFile } from '../../../redux/actions/diseaseActions';
import Layout from '@/components/Layout';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function ImportDiseaseData() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }
      
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!validTypes.includes(selectedFile.type) && 
          !selectedFile.name.toLowerCase().endsWith('.csv') &&
          !selectedFile.name.toLowerCase().endsWith('.xlsx') &&
          !selectedFile.name.toLowerCase().endsWith('.xls')) {
        setStatus({ type: 'error', message: 'Please select a valid CSV or XLSX file' });
        return;
      }
      
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size (10MB limit)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }
      
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (validTypes.includes(droppedFile.type) || 
          droppedFile.name.toLowerCase().endsWith('.csv') ||
          droppedFile.name.toLowerCase().endsWith('.xlsx') ||
          droppedFile.name.toLowerCase().endsWith('.xls')) {
        setFile(droppedFile);
        setStatus(null);
      } else {
        setStatus({ type: 'error', message: 'Please select a valid CSV or XLSX file' });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a CSV or XLSX file' });
      return;
    }
    setLoading(true);
    setStatus(null);
    setUploadProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);
    
    try {
      const resultAction = await dispatch(importEntriesFromFile(file));
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (importEntriesFromFile.fulfilled.match(resultAction)) {
        const { message, data } = resultAction.payload;
        let successMessage = message || 'Import completed successfully!';
        
        // Add detailed results if available
        if (data) {
          const { inserted, total, failed } = data;
          if (inserted !== undefined && total !== undefined) {
            successMessage += ` ${inserted} of ${total} entries imported successfully.`;
            if (failed > 0) {
              successMessage += ` ${failed} entries failed to import.`;
            }
          }
        }
        
        setStatus({ 
          type: 'success', 
          message: successMessage
        });
        setFile(null); // Clear file after successful import
      } else {
        const errorData = resultAction.payload;
        let errorMessage = 'Import failed. Please try again.';
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
          
          // Add detailed information if available
          if (errorData.details) {
            const details = errorData.details;
            if (details.foundColumns && details.foundColumns.length > 0) {
              errorMessage += `\n\nFound columns: ${details.foundColumns.join(', ')}`;
            }
            if (details.missingRequiredFields && details.missingRequiredFields.length > 0) {
              errorMessage += `\n\nMissing required fields: ${details.missingRequiredFields.join(', ')}`;
            }
            if (details.suggestions && details.suggestions.length > 0) {
              errorMessage += `\n\nSuggestions:\n${details.suggestions.map(s => `• ${s}`).join('\n')}`;
            }
          }
        }
        
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Upload error:', err);
      setStatus({ type: 'error', message: err.message || 'Import failed. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Import Disease Data
          </h1>
          <p className="text-gray-600 text-sm">
            Upload CSV or XLSX files to bulk import disease-related data into the database
          </p>
        </div>
        <Link
          href="/dashboard/disease"
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-500 rounded-lg hover:border-blue-500 hover:border-2 hover:font-bold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FileText size={18} />
          View Database
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
            
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload size={24} className="text-gray-600" />
                </div>
                
                {file ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Selected file: {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports CSV and XLSX files up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {loading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload & Import
                  </>
                )}
              </button>
              
              {file && !loading && (
                <button
                  onClick={() => {
                    setFile(null);
                    setStatus(null);
                    setUploadProgress(0);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear File
                </button>
              )}
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {status.type === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <div className="text-sm whitespace-pre-line">
                    {status.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Current Data</h2>
            <p className="text-gray-600 text-sm mb-4">
              Download the current database contents to use as a template or for backup purposes.
            </p>
            
            <a
              href="/disease/export/data?format=csv"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Download size={16} />
              Download as CSV
            </a>
          </div>
        </div>

        {/* Sidebar - Instructions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">File Requirements</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Supported Formats</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSV (.csv)</li>
                  <li>• Excel (.xlsx, .xls)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Columns</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <span className="font-medium">Disease</span> - Disease name</li>
                  <li>• <span className="font-medium">Autoantibody</span> - Autoantibody name</li>
                  <li>• <span className="font-medium">Autoantigen</span> - Autoantigen name</li>
                  <li>• <span className="font-medium">Epitope</span> - Epitope sequence</li>
                  <li>• <span className="font-medium">UniProt ID</span> - UniProt identifier (6-10 alphanumeric characters)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  These 5 fields are mandatory and must be present in your import file.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Optional Model Fields</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">Basic Information</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <span className="font-medium">Type</span> - Entry classification or antibody type</li>
                      <li>• <span className="font-medium">Disease Association</span> - Disease association details</li>
                      <li>• <span className="font-medium">Epitope Prevalence</span> - Prevalence percentage or frequency</li>
                      <li>• <span className="font-medium">Affinity</span> - Binding affinity (Low/Moderate/High)</li>
                      <li>• <span className="font-medium">Avidity</span> - Binding avidity</li>
                      <li>• <span className="font-medium">Mechanism</span> - Mechanism of action</li>
                      <li>• <span className="font-medium">Isotype Subclasses</span> - Antibody isotype classes</li>
                      <li>• <span className="font-medium">Sensitivity</span> - Assay sensitivity</li>
                      <li>• <span className="font-medium">Diagnostic Marker</span> - Diagnostic marker status</li>
                      <li>• <span className="font-medium">Association with Disease Activity</span> - Disease activity correlation</li>
                      <li>• <span className="font-medium">Pathogenesis Involvement</span> - Role in disease pathogenesis</li>
                      <li>• <span className="font-medium">Reference</span> - Source citation or DOI</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">Diagnostic Methods</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <span className="font-medium">Database Accession Numbers</span> - Database accession numbers</li>
                      <li>• <span className="font-medium">Synonym</span> - Alternative names or synonyms</li>
                      <li>• <span className="font-medium">Screening</span> - Screening method (e.g., ELISA, IFA)</li>
                      <li>• <span className="font-medium">Confirmation</span> - Confirmation method (e.g., Immunoprecipitation)</li>
                      <li>• <span className="font-medium">Monitoring</span> - Monitoring method (e.g., Quantitative ELISA)</li>
                      <li>• <span className="font-medium">Positive Predictive Values</span> - PPV (e.g., 85%, 0.85)</li>
                      <li>• <span className="font-medium">Negative Predictive Values</span> - NPV (e.g., 95%, 0.95)</li>
                      <li>• <span className="font-medium">Cross Reactivity Patterns</span> - Cross-reactivity information</li>
                      <li>• <span className="font-medium">Reference Ranges and Cutoff Values</span> - Normal ranges and cutoffs</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  These fields will be automatically mapped to the database model. Any other columns will be stored as additional fields and displayed in the &quot;Additional Information&quot; section.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Import Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <span className="font-medium">Column names:</span> Case-insensitive and flexible (e.g., &quot;Disease&quot;, &quot;disease&quot;, &quot;DISEASE&quot;)</li>
                  <li>• <span className="font-medium">Alternative names:</span> Supported (e.g., &quot;Antibody&quot; for &quot;Autoantibody&quot;)</li>
                  <li>• <span className="font-medium">Headers:</span> First row should contain column headers</li>
                  <li>• <span className="font-medium">Empty cells:</span> Allowed for optional fields</li>
                  <li>• <span className="font-medium">UniProt ID:</span> Must be 6-10 alphanumeric characters (uppercase)</li>
                  <li>• <span className="font-medium">Percentages:</span> Can be entered as &quot;85%&quot; or &quot;0.85&quot;</li>
                  <li>• <span className="font-medium">File size:</span> Maximum 10MB</li>
                  <li>• <span className="font-medium">Custom fields:</span> Any additional columns will be stored as additional fields and displayed in the &quot;Additional Information&quot; section</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Validation Rules</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <span className="font-medium">Required fields:</span> Disease, Autoantibody, Autoantigen, Epitope, UniProt ID</li>
                  <li>• <span className="font-medium">Minimum length:</span> Disease, Autoantibody, Autoantigen, Epitope must be at least 2 characters</li>
                  <li>• <span className="font-medium">UniProt ID format:</span> Only uppercase letters and numbers (A-Z, 0-9)</li>
                  <li>• <span className="font-medium">Duplicate handling:</span> Duplicate entries will be skipped with a warning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Data Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Data Format</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Disease</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Autoantibody</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Autoantigen</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Epitope</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">UniProt ID</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Screening</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Diagnostic Marker</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700">Sensitivity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-2 py-2 text-gray-600">Type 1 Diabetes</td>
                    <td className="px-2 py-2 text-gray-600">Anti-GAD</td>
                    <td className="px-2 py-2 text-gray-600">GAD65</td>
                    <td className="px-2 py-2 text-gray-600">MKLLLQKQK</td>
                    <td className="px-2 py-2 text-gray-600">Q05329</td>
                    <td className="px-2 py-2 text-gray-600">IgG</td>
                    <td className="px-2 py-2 text-gray-600">ELISA</td>
                    <td className="px-2 py-2 text-gray-600">Yes</td>
                    <td className="px-2 py-2 text-gray-600">95%</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-600">Celiac Disease</td>
                    <td className="px-2 py-2 text-gray-600">Anti-tTG</td>
                    <td className="px-2 py-2 text-gray-600">Transglutaminase 2</td>
                    <td className="px-2 py-2 text-gray-600">PFPQPELPY</td>
                    <td className="px-2 py-2 text-gray-600">P21980</td>
                    <td className="px-2 py-2 text-gray-600">IgA</td>
                    <td className="px-2 py-2 text-gray-600">IFA</td>
                    <td className="px-2 py-2 text-gray-600">Yes</td>
                    <td className="px-2 py-2 text-gray-600">98%</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-600">Systemic Lupus</td>
                    <td className="px-2 py-2 text-gray-600">Anti-dsDNA</td>
                    <td className="px-2 py-2 text-gray-600">Double-stranded DNA</td>
                    <td className="px-2 py-2 text-gray-600">ATCGATCG</td>
                    <td className="px-2 py-2 text-gray-600">P12345</td>
                    <td className="px-2 py-2 text-gray-600">IgG</td>
                    <td className="px-2 py-2 text-gray-600">Western Blot</td>
                    <td className="px-2 py-2 text-gray-600">Yes</td>
                    <td className="px-2 py-2 text-gray-600">85%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This shows the expected data structure. The first 5 columns (Disease, Autoantibody, Autoantigen, Epitope, UniProt ID) are required. 
              All other columns are optional and will be mapped to the appropriate model fields.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}