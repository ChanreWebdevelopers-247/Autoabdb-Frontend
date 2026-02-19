import { createSlice } from '@reduxjs/toolkit';
import { createSubmission, listSubmissions, approveSubmission, rejectSubmission } from '../actions/submissionActions';

const initialState = {
  items: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  loading: false,
  error: null,
  createSuccess: false,
  reviewLoading: false,
  reviewError: null,
};

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    clearSubmissionError: (state) => { state.error = null; },
    clearCreateSubmissionSuccess: (state) => { state.createSuccess = false; },
    clearReviewError: (state) => { state.reviewError = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.items.unshift(action.payload.data);
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      .addCase(listSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(listSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      .addCase(approveSubmission.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
      })
      .addCase(approveSubmission.fulfilled, (state, action) => {
        state.reviewLoading = false;
        const updated = action.payload.data?.submission;
        if (updated) {
          const idx = state.items.findIndex((i) => i._id === updated._id);
          if (idx !== -1) state.items[idx] = updated;
        }
      })
      .addCase(approveSubmission.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      })

      .addCase(rejectSubmission.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
      })
      .addCase(rejectSubmission.fulfilled, (state, action) => {
        state.reviewLoading = false;
        const updated = action.payload.data;
        if (updated) {
          const idx = state.items.findIndex((i) => i._id === updated._id);
          if (idx !== -1) state.items[idx] = updated;
        }
      })
      .addCase(rejectSubmission.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      });
  }
});

export const { clearSubmissionError, clearCreateSubmissionSuccess, clearReviewError } = submissionSlice.actions;
export default submissionSlice.reducer;


