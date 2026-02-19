// diseaseActions.js - Improved with better filtering support

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosSetup';

// Enhanced getAllEntries with better parameter handling
export const getAllEntries = createAsyncThunk(
  'disease/getAllEntries',
  async (params = {}, thunkAPI) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        field, 
        disease, 
        autoantibody,
        autoantigen,
        epitope,
        uniprotId,
        diseaseAssociation,
        affinity,
        sensitivity,
        diagnosticMarker,
        associationWithDiseaseActivity,
        pathogenesisInvolvement,
        reference,
        databaseAccessionNumbers,
        synonym,
        screening,
        confirmation,
        monitoring,
        positivePredictiveValues,
        negativePredictiveValues,
        crossReactivityPatterns,
        referenceRangesAndCutoffValues,
        sortBy = 'disease', 
        sortOrder = 'asc', 
        type
      } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      // Only add non-empty parameters
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
        if (field && field !== 'all') queryParams.append('field', field);
      }
      if (disease && disease.trim()) queryParams.append('disease', disease.trim());
      if (autoantibody && autoantibody.trim()) queryParams.append('autoantibody', autoantibody.trim());
      if (autoantigen && autoantigen.trim()) queryParams.append('autoantigen', autoantigen.trim());
      if (epitope && epitope.trim()) queryParams.append('epitope', epitope.trim());
      if (uniprotId && uniprotId.trim()) queryParams.append('uniprotId', uniprotId.trim());
      if (diseaseAssociation && diseaseAssociation.trim()) queryParams.append('diseaseAssociation', diseaseAssociation.trim());
      if (affinity && affinity.trim()) queryParams.append('affinity', affinity.trim());
      if (sensitivity && sensitivity.trim()) queryParams.append('sensitivity', sensitivity.trim());
      if (diagnosticMarker && diagnosticMarker.trim()) queryParams.append('diagnosticMarker', diagnosticMarker.trim());
      if (associationWithDiseaseActivity && associationWithDiseaseActivity.trim()) queryParams.append('associationWithDiseaseActivity', associationWithDiseaseActivity.trim());
      if (pathogenesisInvolvement && pathogenesisInvolvement.trim()) queryParams.append('pathogenesisInvolvement', pathogenesisInvolvement.trim());
      if (reference && reference.trim()) queryParams.append('reference', reference.trim());
      if (databaseAccessionNumbers && databaseAccessionNumbers.trim()) queryParams.append('databaseAccessionNumbers', databaseAccessionNumbers.trim());
      if (synonym && synonym.trim()) queryParams.append('synonym', synonym.trim());
      if (screening && screening.trim()) queryParams.append('screening', screening.trim());
      if (confirmation && confirmation.trim()) queryParams.append('confirmation', confirmation.trim());
      if (monitoring && monitoring.trim()) queryParams.append('monitoring', monitoring.trim());
      if (positivePredictiveValues && positivePredictiveValues.trim()) queryParams.append('positivePredictiveValues', positivePredictiveValues.trim());
      if (negativePredictiveValues && negativePredictiveValues.trim()) queryParams.append('negativePredictiveValues', negativePredictiveValues.trim());
      if (crossReactivityPatterns && crossReactivityPatterns.trim()) queryParams.append('crossReactivityPatterns', crossReactivityPatterns.trim());
      if (referenceRangesAndCutoffValues && referenceRangesAndCutoffValues.trim()) queryParams.append('referenceRangesAndCutoffValues', referenceRangesAndCutoffValues.trim());
      if (type && type.trim()) queryParams.append('type', type.trim());
      
      const response = await axiosInstance.get(`/disease?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get all entries error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch entries');
    }
  }
);

// New action for getting filtered unique values
export const getFilteredUniqueValues = createAsyncThunk(
  'disease/getFilteredUniqueValues',
  async ({ field, filters = {} }, thunkAPI) => {
    try {
      const validFields = ['disease', 'autoantibody', 'autoantigen', 'epitope', 'uniprotId', 'diseaseAssociation', 'affinity', 'avidity', 'mechanism', 'isotypeSubclasses', 'sensitivity', 'diagnosticMarker', 'associationWithDiseaseActivity', 'pathogenesisInvolvement', 'reference', 'databaseAccessionNumbers', 'synonym', 'screening', 'confirmation', 'monitoring', 'positivePredictiveValues', 'negativePredictiveValues', 'crossReactivityPatterns', 'referenceRangesAndCutoffValues', 'type'];
      
      if (!field || !validFields.includes(field)) {
        throw new Error(`Valid field is required. Must be one of: ${validFields.join(', ')}`);
      }
      
      const queryParams = new URLSearchParams();
      
      // Add relevant filters based on field dependencies
      if (field === 'disease') {
        if (filters.autoantibody && filters.autoantibody.trim()) {
          queryParams.append('autoantibody', filters.autoantibody.trim());
        }
        if (filters.autoantigen && filters.autoantigen.trim()) {
          queryParams.append('autoantigen', filters.autoantigen.trim());
        }
        if (filters.epitope && filters.epitope.trim()) {
          queryParams.append('epitope', filters.epitope.trim());
        }
      }
      
      if (field === 'autoantibody') {
        // Filter autoantibody by disease or autoantigen (reverse filtering)
        if (filters.disease && filters.disease.trim()) {
          queryParams.append('disease', filters.disease.trim());
        }
        if (filters.autoantigen && filters.autoantigen.trim()) {
          queryParams.append('autoantigen', filters.autoantigen.trim());
        }
      }
      
      if (field === 'autoantigen' || field === 'epitope') {
        if (filters.disease && filters.disease.trim()) {
          queryParams.append('disease', filters.disease.trim());
        }
        if (filters.autoantibody && filters.autoantibody.trim()) {
          queryParams.append('autoantibody', filters.autoantibody.trim());
        }
      }

      if (field === 'epitope') {
        if (filters.autoantigen && filters.autoantigen.trim()) {
          queryParams.append('autoantigen', filters.autoantigen.trim());
        }
      }

      if (field === 'uniprotId') {
        // Filter UniProt IDs by autoantibody, autoantigen, disease, or epitope
        if (filters.autoantibody && filters.autoantibody.trim()) {
          queryParams.append('autoantibody', filters.autoantibody.trim());
        }
        if (filters.autoantigen && filters.autoantigen.trim()) {
          queryParams.append('autoantigen', filters.autoantigen.trim());
        }
        if (filters.disease && filters.disease.trim()) {
          queryParams.append('disease', filters.disease.trim());
        }
        if (filters.epitope && filters.epitope.trim()) {
          queryParams.append('epitope', filters.epitope.trim());
        }
      }
      
      if (field === 'type') {
        // Filter type by disease, autoantibody, autoantigen, or epitope
        if (filters.disease && filters.disease.trim()) {
          queryParams.append('disease', filters.disease.trim());
        }
        if (filters.autoantibody && filters.autoantibody.trim()) {
          queryParams.append('autoantibody', filters.autoantibody.trim());
        }
        if (filters.autoantigen && filters.autoantigen.trim()) {
          queryParams.append('autoantigen', filters.autoantigen.trim());
        }
        if (filters.epitope && filters.epitope.trim()) {
          queryParams.append('epitope', filters.epitope.trim());
        }
      }
      
      const response = await axiosInstance.get(`/disease/unique-filtered/${field}?${queryParams}`);
      return { field, ...response.data };
    } catch (error) {
      console.error('Get filtered unique values error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch filtered unique values');
    }
  }
);

// Enhanced advanced search
export const advancedSearch = createAsyncThunk(
  'disease/advancedSearch',
  async ({ searchTerm, limit = 50, includeStats = false }, thunkAPI) => {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Search term must be at least 2 characters long');
      }
      
      const queryParams = new URLSearchParams({
        q: searchTerm.trim(),
        limit: limit.toString(),
        includeStats: includeStats.toString()
      });
      
      const response = await axiosInstance.get(`/disease/search/advanced?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Advanced search error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to perform advanced search');
    }
  }
);

// Keep all existing actions (getEntryById, createEntry, etc.) unchanged
export const getEntryById = createAsyncThunk(
  'disease/getEntryById',
  async (id, thunkAPI) => {
    try {
      if (!id) {
        throw new Error('Entry ID is required');
      }
      
      const response = await axiosInstance.get(`/disease/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get entry by ID error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch entry');
    }
  }
);

export const createEntry = createAsyncThunk(
  'disease/createEntry',
  async (entryData, thunkAPI) => {
    try {
      if (!entryData.disease || !entryData.autoantibody || !entryData.autoantigen) {
        throw new Error('Disease, autoantibody, and autoantigen are required');
      }
      
      const response = await axiosInstance.post('/disease', entryData);
      return response.data;
    } catch (error) {
      console.error('Create entry error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create entry');
    }
  }
);

export const updateEntry = createAsyncThunk(
  'disease/updateEntry',
  async ({ id, entryData }, thunkAPI) => {
    try {
      if (!id) {
        throw new Error('Entry ID is required');
      }
      
      const response = await axiosInstance.put(`/disease/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error('Update entry error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update entry');
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'disease/deleteEntry',
  async (id, thunkAPI) => {
    try {
      if (!id) {
        throw new Error('Entry ID is required');
      }
      
      const response = await axiosInstance.delete(`/disease/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      console.error('Delete entry error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete entry');
    }
  }
);

// Keep other existing actions (searchEntries, getEntriesByDisease, etc.) unchanged
export const searchEntries = createAsyncThunk(
  'disease/searchEntries',
  async ({ searchTerm, field = 'all', limit = 20 }, thunkAPI) => {
    try {
      if (!searchTerm) {
        throw new Error('Search term is required');
      }
      
      const queryParams = new URLSearchParams({
        q: searchTerm,
        field,
        limit: limit.toString()
      });
      
      const response = await axiosInstance.get(`/disease/search/entries?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Search entries error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search entries');
    }
  }
);

export const getEntriesByDisease = createAsyncThunk(
  'disease/getEntriesByDisease',
  async (disease, thunkAPI) => {
    try {
      if (!disease) {
        throw new Error('Disease name is required');
      }
      
      const response = await axiosInstance.get(`/disease/disease/${encodeURIComponent(disease)}`);
      return response.data;
    } catch (error) {
      console.error('Get entries by disease error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch entries by disease');
    }
  }
);

export const getEntriesByUniprotId = createAsyncThunk(
  'disease/getEntriesByUniprotId',
  async (uniprotId, thunkAPI) => {
    try {
      if (!uniprotId) {
        throw new Error('UniProt ID is required');
      }
      
      const response = await axiosInstance.get(`/disease/uniprot/${uniprotId}`);
      return response.data;
    } catch (error) {
      console.error('Get entries by UniProt ID error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch entries by UniProt ID');
    }
  }
);

export const getUniqueValues = createAsyncThunk(
  'disease/getUniqueValues',
  async (field, thunkAPI) => {
    try {
      const validFields = ['disease', 'autoantibody', 'autoantigen', 'epitope', 'uniprotId', 'diseaseAssociation', 'affinity', 'avidity', 'mechanism', 'isotypeSubclasses', 'sensitivity', 'diagnosticMarker', 'associationWithDiseaseActivity', 'pathogenesisInvolvement', 'reference', 'databaseAccessionNumbers', 'synonym', 'screening', 'confirmation', 'monitoring', 'positivePredictiveValues', 'negativePredictiveValues', 'crossReactivityPatterns', 'referenceRangesAndCutoffValues', 'type'];
      
      if (!field || !validFields.includes(field)) {
        throw new Error(`Valid field is required. Must be one of: ${validFields.join(', ')}`);
      }
      
      const response = await axiosInstance.get(`/disease/unique/${field}`);
      return { field, ...response.data };
    } catch (error) {
      console.error('Get unique values error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch unique values');
    }
  }
);

export const getStatistics = createAsyncThunk(
  'disease/getStatistics',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/disease/statistics/overview');
      return response.data;
    } catch (error) {
      console.error('Get statistics error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const getDistinctAdditionalKeys = createAsyncThunk(
  'disease/getDistinctAdditionalKeys',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/disease/additional/keys');
      return response.data;
    } catch (error) {
      console.error('Get distinct additional keys error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch distinct additional keys');
    }
  }
);

export const bulkImport = createAsyncThunk(
  'disease/bulkImport',
  async (entries, thunkAPI) => {
    try {
      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        throw new Error('Valid entries array is required');
      }
      
      const response = await axiosInstance.post('/disease/bulk/import', { entries });
      return response.data;
    } catch (error) {
      console.error('Bulk import error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to import entries');
    }
  }
);

export const exportEntries = createAsyncThunk(
  'disease/exportEntries',
  async (params = {}, thunkAPI) => {
    try {
      const { 
        format = 'json', 
        disease, 
        autoantibody, 
        autoantigen, 
        epitope,
        uniprotId,
        diseaseAssociation,
        affinity,
        sensitivity,
        diagnosticMarker,
        associationWithDiseaseActivity,
        pathogenesisInvolvement,
        reference,
        databaseAccessionNumbers,
        synonym,
        screening,
        confirmation,
        monitoring,
        positivePredictiveValues,
        negativePredictiveValues,
        crossReactivityPatterns,
        referenceRangesAndCutoffValues,
        type,
        limit
      } = params;
      
      const queryParams = new URLSearchParams({ format });
      if (disease) queryParams.append('disease', disease);
      if (autoantibody) queryParams.append('autoantibody', autoantibody);
      if (autoantigen) queryParams.append('autoantigen', autoantigen);
      if (epitope) queryParams.append('epitope', epitope);
      if (uniprotId) queryParams.append('uniprotId', uniprotId);
      if (diseaseAssociation) queryParams.append('diseaseAssociation', diseaseAssociation);
      if (affinity) queryParams.append('affinity', affinity);
      if (sensitivity) queryParams.append('sensitivity', sensitivity);
      if (diagnosticMarker) queryParams.append('diagnosticMarker', diagnosticMarker);
      if (associationWithDiseaseActivity) queryParams.append('associationWithDiseaseActivity', associationWithDiseaseActivity);
      if (pathogenesisInvolvement) queryParams.append('pathogenesisInvolvement', pathogenesisInvolvement);
      if (reference) queryParams.append('reference', reference);
      if (databaseAccessionNumbers) queryParams.append('databaseAccessionNumbers', databaseAccessionNumbers);
      if (synonym) queryParams.append('synonym', synonym);
      if (screening) queryParams.append('screening', screening);
      if (confirmation) queryParams.append('confirmation', confirmation);
      if (monitoring) queryParams.append('monitoring', monitoring);
      if (positivePredictiveValues) queryParams.append('positivePredictiveValues', positivePredictiveValues);
      if (negativePredictiveValues) queryParams.append('negativePredictiveValues', negativePredictiveValues);
      if (crossReactivityPatterns) queryParams.append('crossReactivityPatterns', crossReactivityPatterns);
      if (referenceRangesAndCutoffValues) queryParams.append('referenceRangesAndCutoffValues', referenceRangesAndCutoffValues);
      if (type) queryParams.append('type', type);
      if (limit) queryParams.append('limit', limit);
      
      const response = await axiosInstance.get(`/disease/export/data?${queryParams}`);
      
      if (format === 'csv') {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'disease_database.csv';
        link.click();
        window.URL.revokeObjectURL(url);
        return { success: true, message: 'CSV file downloaded successfully' };
      }
      
      return response.data;
    } catch (error) {
      console.error('Export entries error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to export entries');
    }
  }
);

export const importEntriesFromFile = createAsyncThunk(
  'disease/importEntriesFromFile',
  async (file, thunkAPI) => {
    try {
      if (!file) {
        throw new Error('File is required');
      }
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/disease/import/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Import from file error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to import from file');
    }
  }
);

// New actions for static methods from the model

export const getDiseasesSummary = createAsyncThunk(
  'disease/getDiseasesSummary',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/disease/summary/diseases');
      return response.data;
    } catch (error) {
      console.error('Get diseases summary error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch diseases summary');
    }
  }
);

export const findByDiseaseAndAutoantibody = createAsyncThunk(
  'disease/findByDiseaseAndAutoantibody',
  async ({ disease, autoantibody }, thunkAPI) => {
    try {
      if (!disease || !autoantibody) {
        throw new Error('Both disease and autoantibody parameters are required');
      }
      
      const queryParams = new URLSearchParams({
        disease: disease.trim(),
        autoantibody: autoantibody.trim()
      });
      
      const response = await axiosInstance.get(`/disease/search/disease-autoantibody?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Find by disease and autoantibody error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search by disease and autoantibody');
    }
  }
);

export const findByAutoantibodyOrSynonym = createAsyncThunk(
  'disease/findByAutoantibodyOrSynonym',
  async ({ searchTerm }, thunkAPI) => {
    try {
      if (!searchTerm || searchTerm.trim().length < 1) {
        throw new Error('Search term is required');
      }
      
      const queryParams = new URLSearchParams({
        searchTerm: searchTerm.trim()
      });
      
      const response = await axiosInstance.get(`/disease/search/autoantibody-synonym?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Find by autoantibody or synonym error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search by autoantibody or synonym');
    }
  }
);

export const findByDiagnosticMethod = createAsyncThunk(
  'disease/findByDiagnosticMethod',
  async ({ method }, thunkAPI) => {
    try {
      if (!method || method.trim().length < 1) {
        throw new Error('Diagnostic method is required');
      }
      
      const queryParams = new URLSearchParams({
        method: method.trim()
      });
      
      const response = await axiosInstance.get(`/disease/search/diagnostic-method?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Find by diagnostic method error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search by diagnostic method');
    }
  }
);