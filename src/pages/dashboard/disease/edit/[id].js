import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { getEntryById, updateEntry } from '@/redux/actions/diseaseActions';
import { clearUpdateSuccess, clearError, clearEntryError } from '@/redux/slices/diseaseSlice';
import { ArrowLeft, Save, X } from 'lucide-react';

const EditDisease = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { currentEntry, entryLoading, loading, error, entryError, updateSuccess } = useSelector((state) => state.disease);

  const [formData, setFormData] = useState({
    disease: '',
    databaseAccessionNumbers: '',
    autoantibody: '',
    synonym: '',
    autoantigen: '',
    epitope: '',
    uniprotId: '',
    type: '',
    diseaseAssociation: '',
    epitopePrevalence: '',
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
    reference: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [additionalFields, setAdditionalFields] = useState([]); // [{ key: '', value: '' }]

  // Load entry by ID
  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(getEntryById(id));
    }
  }, [id, dispatch]);

  // Populate form when entry loads
  useEffect(() => {
    if (currentEntry?._id) {
      setFormData({
        disease: currentEntry.disease || '',
        databaseAccessionNumbers: currentEntry.databaseAccessionNumbers || '',
        autoantibody: currentEntry.autoantibody || '',
        synonym: currentEntry.synonym || '',
        autoantigen: currentEntry.autoantigen || '',
        epitope: currentEntry.epitope || '',
        uniprotId: currentEntry.uniprotId || '',
        type: currentEntry.type || '',
        diseaseAssociation: currentEntry.diseaseAssociation || '',
        epitopePrevalence: currentEntry.epitopePrevalence || '',
        screening: currentEntry.screening || '',
        confirmation: currentEntry.confirmation || '',
        monitoring: currentEntry.monitoring || '',
        affinity: currentEntry.affinity || '',
        avidity: currentEntry.avidity || '',
        mechanism: currentEntry.mechanism || '',
        isotypeSubclasses: currentEntry.isotypeSubclasses || '',
        sensitivity: currentEntry.sensitivity || '',
        diagnosticMarker: currentEntry.diagnosticMarker || '',
        associationWithDiseaseActivity: currentEntry.associationWithDiseaseActivity || '',
        positivePredictiveValues: currentEntry.positivePredictiveValues || '',
        negativePredictiveValues: currentEntry.negativePredictiveValues || '',
        crossReactivityPatterns: currentEntry.crossReactivityPatterns || '',
        pathogenesisInvolvement: currentEntry.pathogenesisInvolvement || '',
        referenceRangesAndCutoffValues: currentEntry.referenceRangesAndCutoffValues || '',
        reference: currentEntry.reference || ''
      });
      // Support both plain object and Map serialized from Mongo/Mongoose
      let additionalObj = {};
      if (currentEntry.additional) {
        if (typeof currentEntry.additional.forEach === 'function' && typeof currentEntry.additional.get === 'function') {
          // Likely a Map
          currentEntry.additional.forEach((v, k) => {
            additionalObj[k] = v;
          });
        } else {
          additionalObj = currentEntry.additional;
        }
      }
      const entries = additionalObj && Object.keys(additionalObj).length > 0
        ? Object.entries(additionalObj).map(([k, v]) => ({ key: k, value: v }))
        : [];
      setAdditionalFields(entries);
    }
  }, [currentEntry]);

  // Redirect after successful update
  useEffect(() => {
    if (updateSuccess && id) {
      dispatch(clearUpdateSuccess());
      router.push(`/dashboard/disease/${id}`);
    }
  }, [updateSuccess, id, dispatch, router]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearEntryError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!formData.disease.trim()) errors.disease = 'Disease name is required';
    if (!formData.autoantibody.trim()) errors.autoantibody = 'Autoantibody is required';
    if (!formData.autoantigen.trim()) errors.autoantigen = 'Autoantigen is required';
    if (!formData.epitope.trim()) errors.epitope = 'Epitope is required';
    if (!formData.uniprotId.trim()) {
      errors.uniprotId = 'UniProt ID is required';
    } else if (!/^[A-Z0-9]{6,10}$/.test(formData.uniprotId.trim())) {
      errors.uniprotId = 'UniProt ID should be 6-10 alphanumeric characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const additionalObject = additionalFields.reduce((acc, { key, value }) => {
        const trimmedKey = (key || '').toString().trim();
        const trimmedValue = (value || '').toString();
        if (trimmedKey) {
          acc[trimmedKey] = trimmedValue;
        }
        return acc;
      }, {});
      await dispatch(updateEntry({ id, entryData: { ...formData, additional: additionalObject } }));
    } catch (err) {
      // Handled by redux
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
    dispatch(clearEntryError());
  };

  const handleAddAdditional = () => {
    setAdditionalFields((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveAdditional = (index) => {
    setAdditionalFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeAdditional = (index, field, value) => {
    setAdditionalFields((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  if (entryLoading || !id || (!currentEntry && !entryError)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading entry...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/disease/${id}`}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Edit Disease Entry</h1>
              <p className="text-gray-600 text-xs">Update the disease-autoantibody-autoantigen association</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(error || entryError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error || entryError}</span>
              <button onClick={handleClearError} className="text-red-500 hover:text-red-700 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Disease Name */}
            <div>
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

            {/* Database Accession Numbers */}
            <div>
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
                placeholder="e.g., OMIM:123456, HGNC:1234"
              />
              <p className="mt-1 text-sm text-gray-500">Optional: Database accession numbers for the disease or antigen</p>
            </div>

            {/* Autoantibody */}
            <div>
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

            {/* Synonym */}
            <div>
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
                placeholder="e.g., Alternative name for the autoantibody"
              />
              <p className="mt-1 text-sm text-gray-500">Optional: Alternative or synonym name for the autoantibody</p>
            </div>

            {/* Autoantigen */}
            <div>
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
            <div>
            <label htmlFor="epitope" className="block text-sm font-medium text-gray-700 mb-2">
                Epitope <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="epitope"
                name="epitope"
                value={formData.epitope}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Specific binding site on the antigen"
              />
            {validationErrors.epitope && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.epitope}</p>
            )}
            </div>

            {/* UniProt ID */}
            <div>
              <label htmlFor="uniprotId" className="block text-sm font-medium text-gray-700 mb-2">
                UniProt ID
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
              <p className="mt-1 text-sm text-gray-500">UniProt database identifier for the antigen protein</p>
            </div>

            {/* Type */}
            <div>
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

            {/* Extended Information Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Extended Information</h2>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ~63%, 0.22, High, Low"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Prevalence of the epitope in the population</p>
              </div>

              <div className="mb-4">
                <label htmlFor="screening" className="block text-sm font-medium text-gray-700 mb-2">
                  Screening
                </label>
                <input
                  type="text"
                  id="screening"
                  name="screening"
                  value={formData.screening}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ELISA, IFA, Multiplex"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Screening method for this autoantibody</p>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation
                </label>
                <input
                  type="text"
                  id="confirmation"
                  name="confirmation"
                  value={formData.confirmation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Western Blot, Immunoprecipitation"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Confirmation method for this autoantibody</p>
              </div>

              <div className="mb-4">
                <label htmlFor="monitoring" className="block text-sm font-medium text-gray-700 mb-2">
                  Monitoring
                </label>
                <input
                  type="text"
                  id="monitoring"
                  name="monitoring"
                  value={formData.monitoring}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Quantitative ELISA, Flow Cytometry"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Monitoring method for disease activity</p>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 85%, 0.85, High"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Positive predictive value for diagnosis</p>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 95%, 0.95, High"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Negative predictive value for diagnosis</p>
              </div>

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
                  placeholder="e.g., Cross-reacts with dsDNA, No cross-reactivity"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Cross-reactivity patterns with other antigens</p>
              </div>

              <div className="mb-4">
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
                <p className="mt-1 text-sm text-gray-500">Optional: Reference ranges and cutoff values for interpretation</p>
              </div>

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

            {/* Additional Fields */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Additional Fields</label>
                <button
                  type="button"
                  onClick={handleAddAdditional}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Add field
                </button>
              </div>
              {additionalFields.length === 0 && (
                <p className="text-xs text-gray-500">No additional fields. Click &quot;Add field&quot; to include custom metadata.</p>
              )}
              <div className="space-y-3">
                {additionalFields.map((pair, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      value={pair.key}
                      onChange={(e) => handleChangeAdditional(index, 'key', e.target.value)}
                      className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Key (e.g., species, assay, reference)"
                    />
                    <input
                      type="text"
                      value={pair.value}
                      onChange={(e) => handleChangeAdditional(index, 'value', e.target.value)}
                      className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditional(index)}
                      className="col-span-1 text-red-600 hover:text-red-800"
                      aria-label="Remove field"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/disease/${id}`}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditDisease;