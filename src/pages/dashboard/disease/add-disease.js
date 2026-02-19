import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createEntry } from '@/redux/actions/diseaseActions';
import { clearCreateSuccess, clearError } from '@/redux/slices/diseaseSlice';
import { Plus, ArrowLeft, Save, X, XCircleIcon, ArchiveRestoreIcon } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosSetup';

const AddDisease = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, createSuccess } = useSelector((state) => state.disease);
  const STORAGE_KEY = 'autoabdb_additional_keys';

  const [formData, setFormData] = useState({
    disease: '',
    databaseAccessionNumbers: '',
    autoantibody: '',
    synonym: '',
    diseaseAssociation: '',
    autoantigen: '',
    epitope: '',
    epitopePrevalence: '',
    uniprotId: '',
    screening: '',
    confirmation: '',
    monitoring: '',
    affinity: '',
    avidity: '',
    mechanism: '',
    isotypeSubclasses: '',
    sensitivity: '',
    diagnosticMarker: '',
    associationWithDiseaseActivity: '',
    positivePredictiveValues: '',
    negativePredictiveValues: '',
    crossReactivityPatterns: '',
    pathogenesisInvolvement: '',
    referenceRangesAndCutoffValues: '',
    reference: '',
    type: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [additionalFields, setAdditionalFields] = useState([]);

  // Prefill Additional Information with previously used keys from localStorage and API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let localKeys = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) localKeys = parsed.map((k) => String(k));
    } catch (_) {}

    const loadApiKeys = async () => {
      try {
        const resp = await axiosInstance.get('/disease/additional/keys');
        const apiKeys = Array.isArray(resp.data?.data) ? resp.data.data.map((k) => String(k)) : [];
        const merged = Array.from(new Set([...apiKeys, ...localKeys]));
        if (merged.length > 0) {
          setAdditionalFields(merged.map((k) => ({ key: k, value: '' })));
        }
      } catch (_err) {
        if (localKeys.length > 0) {
          setAdditionalFields(localKeys.map((k) => ({ key: k, value: '' })));
        }
      }
    };

    loadApiKeys();
  }, []);

  // Clear success message and redirect after successful creation
  useEffect(() => {
    if (createSuccess) {
      dispatch(clearCreateSuccess());
      router.push('/dashboard/superadmin');
    }
  }, [createSuccess, dispatch, router]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    
    // Required field validations
    if (!formData.disease.trim()) {
      errors.disease = 'Disease name is required';
    } else if (formData.disease.trim().length < 2) {
      errors.disease = 'Disease name must be at least 2 characters long';
    }
    
    if (!formData.autoantibody.trim()) {
      errors.autoantibody = 'Autoantibody is required';
    } else if (formData.autoantibody.trim().length < 2) {
      errors.autoantibody = 'Autoantibody must be at least 2 characters long';
    }
    
    if (!formData.autoantigen.trim()) {
      errors.autoantigen = 'Autoantigen is required';
    } else if (formData.autoantigen.trim().length < 2) {
      errors.autoantigen = 'Autoantigen must be at least 2 characters long';
    }

    if (!formData.epitope.trim()) {
      errors.epitope = 'Epitope is required';
    } else if (formData.epitope.trim().length < 2) {
      errors.epitope = 'Epitope must be at least 2 characters long';
    }

    if (!formData.uniprotId.trim()) {
      errors.uniprotId = 'UniProt ID is required';
    } else if (!/^[A-Z0-9]{6,10}$/.test(formData.uniprotId.trim())) {
      errors.uniprotId = 'UniProt ID should be 6-10 alphanumeric characters (uppercase)';
    }

    // Optional field validations with format checks
    if (formData.epitopePrevalence && formData.epitopePrevalence.trim()) {
      const prevalence = formData.epitopePrevalence.trim();
      if (!/^(\d+(\.\d+)?%?|\d+(\.\d+)?\s*%|high|medium|low)$/i.test(prevalence)) {
        errors.epitopePrevalence = 'Please enter a valid prevalence (e.g., 63%, 0.22, High, Low)';
      }
    }

    if (formData.positivePredictiveValues && formData.positivePredictiveValues.trim()) {
      const ppv = formData.positivePredictiveValues.trim();
      if (!/^(\d+(\.\d+)?%?|\d+(\.\d+)?\s*%)$/i.test(ppv)) {
        errors.positivePredictiveValues = 'Please enter a valid PPV (e.g., 85%, 0.85)';
      }
    }

    if (formData.negativePredictiveValues && formData.negativePredictiveValues.trim()) {
      const npv = formData.negativePredictiveValues.trim();
      if (!/^(\d+(\.\d+)?%?|\d+(\.\d+)?\s*%)$/i.test(npv)) {
        errors.negativePredictiveValues = 'Please enter a valid NPV (e.g., 95%, 0.95)';
      }
    }

    // Validate additional fields
    additionalFields.forEach((field, index) => {
      if (field.key && field.key.trim() && !field.value || !field.value.trim()) {
        errors[`additional_${index}`] = 'Value is required when key is provided';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const additional = additionalFields.reduce((acc, pair) => {
        const key = (pair.key || '').trim();
        const value = (pair.value || '').toString().trim();
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Persist used keys to localStorage for future prefill
      if (typeof window !== 'undefined') {
        try {
          const existingRaw = localStorage.getItem(STORAGE_KEY);
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const submittedKeys = additionalFields
            .map((p) => (p.key || '').trim())
            .filter((k) => k);
          const merged = Array.from(new Set([...(Array.isArray(existing) ? existing : []), ...submittedKeys]));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (_) {
          // ignore storage errors
        }
      }

      const payload = Object.keys(additional).length > 0
        ? { ...formData, additional }
        : formData;

      await dispatch(createEntry(payload));
    } catch (error) {
      console.error('Failed to create disease entry:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAdditionalFieldChange = (index, field, value) => {
    updateAdditionalField(index, field, value);
    
    // Clear validation error for this additional field
    const errorKey = `additional_${index}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const resetForm = () => {
    setFormData({
      disease: '',
      databaseAccessionNumbers: '',
      autoantibody: '',
      synonym: '',
      diseaseAssociation: '',
      autoantigen: '',
      epitope: '',
      epitopePrevalence: '',
      uniprotId: '',
      screening: '',
      confirmation: '',
      monitoring: '',
      affinity: '',
      avidity: '',
      mechanism: '',
      isotypeSubclasses: '',
      sensitivity: '',
      diagnosticMarker: '',
      associationWithDiseaseActivity: '',
      positivePredictiveValues: '',
      negativePredictiveValues: '',
      crossReactivityPatterns: '',
      pathogenesisInvolvement: '',
      referenceRangesAndCutoffValues: '',
      reference: '',
      type: ''
    });
    setValidationErrors({});
    setAdditionalFields([]);
  };

  const addAdditionalField = () => {
    setAdditionalFields((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeAdditionalField = (index) => {
    setAdditionalFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAdditionalField = (index, field, value) => {
    setAdditionalFields((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return (
    <Layout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/superadmin"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className=''>
              <h1 className="text-lg font-bold text-gray-900">Add New Disease Entry</h1>
              <p className="text-gray-600 text-xs">Create a new disease-autoantibody-autoantigen association</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={handleClearError} 
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              {/* Disease Name */}
              <div className="mb-4">
                <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-2">
                  Disease Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="disease"
                  name="disease"
                  value={formData.disease}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.disease ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Systemic Lupus Erythematosus"
                />
                {validationErrors.disease && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.disease}</p>
                )}
              </div>

              {/* Autoantibody */}
              <div className="mb-4">
                <label htmlFor="autoantibody" className="block text-sm font-medium text-gray-700 mb-2">
                  Autoantibody <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="autoantibody"
                  name="autoantibody"
                  value={formData.autoantibody}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.autoantibody ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Anti-dsDNA"
                />
                {validationErrors.autoantibody && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.autoantibody}</p>
                )}
              </div>

              {/* Autoantigen */}
              <div className="mb-4">
                <label htmlFor="autoantigen" className="block text-sm font-medium text-gray-700 mb-2">
                  Autoantigen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="autoantigen"
                  name="autoantigen"
                  value={formData.autoantigen}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.autoantigen ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Double-stranded DNA"
                />
                {validationErrors.autoantigen && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.autoantigen}</p>
                )}
              </div>

              {/* Epitope */}
              <div className="mb-4">
                <label htmlFor="epitope" className="block text-sm font-medium text-gray-700 mb-2">
                  Epitope <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="epitope"
                  name="epitope"
                  value={formData.epitope}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.epitope ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Specific binding site on the antigen"
                />
                {validationErrors.epitope && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.epitope}</p>
                )}
              </div>

              {/* UniProt ID */}
              <div className="mb-4">
                <label htmlFor="uniprotId" className="block text-sm font-medium text-gray-700 mb-2">
                  UniProt ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="uniprotId"
                  name="uniprotId"
                  value={formData.uniprotId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.uniprotId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., P12345"
                />
                {validationErrors.uniprotId && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.uniprotId}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  UniProt database identifier for the antigen protein
                </p>
              </div>

              {/* Type */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., IgG, IgM, subtype, etc."
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Entry classification or antibody type</p>
              </div>
            </div>

            {/* Extended Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Extended Information</h2>
              
              {/* Disease Association */}
              <div className="mb-4">
                <label htmlFor="diseaseAssociation" className="block text-sm font-medium text-gray-700 mb-2">
                  Disease Association
                </label>
                <input
                  type="text"
                  id="diseaseAssociation"
                  name="diseaseAssociation"
                  value={formData.diseaseAssociation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Primary, Secondary, Associated"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Association type with the disease</p>
              </div>

              {/* Epitope Prevalence */}
              <div className="mb-4">
                <label htmlFor="epitopePrevalence" className="block text-sm font-medium text-gray-700 mb-2">
                  Epitope Prevalence
                </label>
                <input
                  type="text"
                  id="epitopePrevalence"
                  name="epitopePrevalence"
                  value={formData.epitopePrevalence}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.epitopePrevalence ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ~63%, 0.22, High, Low"
                />
                {validationErrors.epitopePrevalence && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.epitopePrevalence}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Optional: Prevalence of the epitope in the population</p>
              </div>

              {/* Affinity */}
              <div className="mb-4">
                <label htmlFor="affinity" className="block text-sm font-medium text-gray-700 mb-2">
                  Affinity
                </label>
                <input
                  type="text"
                  id="affinity"
                  name="affinity"
                  value={formData.affinity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., High, Medium, Low, Kd value"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Binding affinity of the antibody</p>
              </div>

              {/* Avidity */}
              <div className="mb-4">
                <label htmlFor="avidity" className="block text-sm font-medium text-gray-700 mb-2">
                  Avidity
                </label>
                <input
                  type="text"
                  id="avidity"
                  name="avidity"
                  value={formData.avidity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., High, Medium, Low"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Overall binding strength</p>
              </div>

              {/* Mechanism */}
              <div className="mb-4">
                <label htmlFor="mechanism" className="block text-sm font-medium text-gray-700 mb-2">
                  Mechanism
                </label>
                <input
                  type="text"
                  id="mechanism"
                  name="mechanism"
                  value={formData.mechanism}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complement activation, Direct cytotoxicity"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Mechanism of action</p>
              </div>

              {/* Isotype Subclasses */}
              <div className="mb-4">
                <label htmlFor="isotypeSubclasses" className="block text-sm font-medium text-gray-700 mb-2">
                  Isotype Subclasses
                </label>
                <input
                  type="text"
                  id="isotypeSubclasses"
                  name="isotypeSubclasses"
                  value={formData.isotypeSubclasses}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., IgG1, IgG2, IgG3, IgG4"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Specific antibody isotype subclasses</p>
              </div>

              {/* Sensitivity */}
              <div className="mb-4">
                <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 mb-2">
                  Sensitivity
                </label>
                <input
                  type="text"
                  id="sensitivity"
                  name="sensitivity"
                  value={formData.sensitivity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., High, Medium, Low, 95%"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Diagnostic sensitivity</p>
              </div>

              {/* Diagnostic Marker */}
              <div className="mb-4">
                <label htmlFor="diagnosticMarker" className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnostic Marker
                </label>
                <input
                  type="text"
                  id="diagnosticMarker"
                  name="diagnosticMarker"
                  value={formData.diagnosticMarker}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Yes, No, Primary, Secondary"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Whether this is a diagnostic marker</p>
              </div>

              {/* Association with Disease Activity */}
              <div className="mb-4">
                <label htmlFor="associationWithDiseaseActivity" className="block text-sm font-medium text-gray-700 mb-2">
                  Association with Disease Activity
                </label>
                <input
                  type="text"
                  id="associationWithDiseaseActivity"
                  name="associationWithDiseaseActivity"
                  value={formData.associationWithDiseaseActivity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Positive, Negative, Correlated, Independent"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Relationship with disease activity</p>
              </div>

              {/* Pathogenesis Involvement */}
              <div className="mb-4">
                <label htmlFor="pathogenesisInvolvement" className="block text-sm font-medium text-gray-700 mb-2">
                  Pathogenesis Involvement
                </label>
                <input
                  type="text"
                  id="pathogenesisInvolvement"
                  name="pathogenesisInvolvement"
                  value={formData.pathogenesisInvolvement}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Direct, Indirect, Unknown, Protective"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Role in disease pathogenesis</p>
              </div>

              {/* Reference */}
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PMID: 12345678, DOI: 10.1000/xyz123"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Scientific reference or citation</p>
              </div>
            </div>

            {/* Diagnostic Methods Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnostic Methods</h2>
              
              {/* Database Accession Numbers */}
              <div className="mb-4">
                <label htmlFor="databaseAccessionNumbers" className="block text-sm font-medium text-gray-700 mb-2">
                  Database Accession Numbers
                </label>
                <input
                  type="text"
                  id="databaseAccessionNumbers"
                  name="databaseAccessionNumbers"
                  value={formData.databaseAccessionNumbers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., P12345, Q6P2Q9"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Database accession numbers</p>
              </div>

              {/* Synonym */}
              <div className="mb-4">
                <label htmlFor="synonym" className="block text-sm font-medium text-gray-700 mb-2">
                  Synonym
                </label>
                <input
                  type="text"
                  id="synonym"
                  name="synonym"
                  value={formData.synonym}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Alternative names for the autoantibody"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Alternative names or synonyms</p>
              </div>

              {/* Screening */}
              <div className="mb-4">
                <label htmlFor="screening" className="block text-sm font-medium text-gray-700 mb-2">
                  Screening Method
                </label>
                <input
                  type="text"
                  id="screening"
                  name="screening"
                  value={formData.screening}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ELISA, IFA, Western Blot"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Screening method used</p>
              </div>

              {/* Confirmation */}
              <div className="mb-4">
                <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Method
                </label>
                <input
                  type="text"
                  id="confirmation"
                  name="confirmation"
                  value={formData.confirmation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Immunoprecipitation, Line Blot"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Confirmation method used</p>
              </div>

              {/* Monitoring */}
              <div className="mb-4">
                <label htmlFor="monitoring" className="block text-sm font-medium text-gray-700 mb-2">
                  Monitoring Method
                </label>
                <input
                  type="text"
                  id="monitoring"
                  name="monitoring"
                  value={formData.monitoring}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Quantitative ELISA, Multiplex Assay"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Monitoring method used</p>
              </div>

              {/* Positive Predictive Values */}
              <div className="mb-4">
                <label htmlFor="positivePredictiveValues" className="block text-sm font-medium text-gray-700 mb-2">
                  Positive Predictive Values
                </label>
                <input
                  type="text"
                  id="positivePredictiveValues"
                  name="positivePredictiveValues"
                  value={formData.positivePredictiveValues}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.positivePredictiveValues ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 85%, 0.85"
                />
                {validationErrors.positivePredictiveValues && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.positivePredictiveValues}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Optional: Positive predictive values</p>
              </div>

              {/* Negative Predictive Values */}
              <div className="mb-4">
                <label htmlFor="negativePredictiveValues" className="block text-sm font-medium text-gray-700 mb-2">
                  Negative Predictive Values
                </label>
                <input
                  type="text"
                  id="negativePredictiveValues"
                  name="negativePredictiveValues"
                  value={formData.negativePredictiveValues}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.negativePredictiveValues ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 95%, 0.95"
                />
                {validationErrors.negativePredictiveValues && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.negativePredictiveValues}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Optional: Negative predictive values</p>
              </div>

              {/* Cross Reactivity Patterns */}
              <div className="mb-4">
                <label htmlFor="crossReactivityPatterns" className="block text-sm font-medium text-gray-700 mb-2">
                  Cross Reactivity Patterns
                </label>
                <input
                  type="text"
                  id="crossReactivityPatterns"
                  name="crossReactivityPatterns"
                  value={formData.crossReactivityPatterns}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cross-reacts with other antigens"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Cross-reactivity patterns observed</p>
              </div>

              {/* Reference Ranges and Cutoff Values */}
              <div>
                <label htmlFor="referenceRangesAndCutoffValues" className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Ranges and Cutoff Values
                </label>
                <input
                  type="text"
                  id="referenceRangesAndCutoffValues"
                  name="referenceRangesAndCutoffValues"
                  value={formData.referenceRangesAndCutoffValues}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Normal: <20 U/mL, Positive: >40 U/mL"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Reference ranges and cutoff values</p>
              </div>
            </div>

            {/* Additional Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
              
              {/* Additional Information (dynamic key-value pairs) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Fields
                  </label>
                  <button
                    type="button"
                    onClick={addAdditionalField}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                  >
                    <Plus size={14} /> Add Field
                  </button>
                </div>
                {additionalFields.length === 0 && (
                  <p className="text-xs text-gray-500 mb-2">Add custom key-value metadata (e.g., source, notes, PMID).</p>
                )}
                <div className="space-y-2">
                  {additionalFields.map((pair, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={pair.key}
                          onChange={(e) => handleAdditionalFieldChange(index, 'key', e.target.value)}
                          placeholder="Key (e.g., PMID)"
                          className="w-full capitalize px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={pair.value}
                          onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                          placeholder={`Write here ${pair.key}`}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors[`additional_${index}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors[`additional_${index}`] && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors[`additional_${index}`]}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdditionalField(index)}
                        className="col-span-1 flex items-center justify-center h-10 text-red-600 hover:text-red-700"
                        aria-label="Remove field"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-center pt-6 border-t border-gray-200">
              {/* <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <ArchiveRestoreIcon size={18} />
              </button> */}
              
              <div className="flex gap-3">
                <Link
                  href="/dashboard/superadmin"
                  className="px-4 py-2 text-red-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <XCircleIcon size={18} />
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2  text-black rounded-lg hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                     
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Tips for adding disease entries:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use standard medical terminology for disease names</li>
            <li>• Include the specific autoantibody type (e.g., IgG, IgM)</li>
            <li>• Provide the most specific antigen information available</li>
            <li>• Epitope and UniProt ID are required fields</li>
            <li>• UniProt ID should be in the format P12345 or A1B2C3</li>
            <li>• All required fields (marked with *) must be filled before submission</li>
            <li>• Additional fields help provide comprehensive information about the disease-autoantibody association</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AddDisease;
