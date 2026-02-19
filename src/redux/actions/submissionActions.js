import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosSetup';

export const createSubmission = createAsyncThunk(
  'submission/createSubmission',
  async (data, thunkAPI) => {
    try {
      const required = ['disease', 'autoantibody', 'autoantigen', 'epitope', 'uniprotId'];
      required.forEach((f) => {
        if (!data[f] || !data[f].toString().trim()) {
          throw new Error(`${f} is required`);
        }
      });
      const response = await axiosInstance.post('/submissions', data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to create submission');
    }
  }
);

export const listSubmissions = createAsyncThunk(
  'submission/listSubmissions',
  async (params = {}, thunkAPI) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status) qs.append('status', status);
      const response = await axiosInstance.get(`/submissions?${qs.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

export const approveSubmission = createAsyncThunk(
  'submission/approveSubmission',
  async ({ id, reviewNote }, thunkAPI) => {
    try {
      if (!id) throw new Error('Submission id is required');
      const response = await axiosInstance.post(`/submissions/${id}/approve`, { reviewNote });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to approve submission');
    }
  }
);

export const rejectSubmission = createAsyncThunk(
  'submission/rejectSubmission',
  async ({ id, reviewNote }, thunkAPI) => {
    try {
      if (!id) throw new Error('Submission id is required');
      const response = await axiosInstance.post(`/submissions/${id}/reject`, { reviewNote });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reject submission');
    }
  }
);


