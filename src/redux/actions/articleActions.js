// articleActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosSetup';

// Get all articles with pagination and filtering
export const getAllArticles = createAsyncThunk(
  'article/getAllArticles',
  async (params = {}, thunkAPI) => {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        category,
        author,
        isPublished,
        isFeatured,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      // Only add non-empty parameters
      if (type) queryParams.append('type', type);
      if (status) queryParams.append('status', status);
      if (category) queryParams.append('category', category);
      if (author) queryParams.append('author', author);
      if (isPublished !== undefined) queryParams.append('isPublished', isPublished.toString());
      if (isFeatured !== undefined) queryParams.append('isFeatured', isFeatured.toString());
      if (search && search.trim()) queryParams.append('search', search.trim());

      const response = await axiosInstance.get(`/articles?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get all articles error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || (error.response?.status === 401 ? 'Unauthorized: Please log in again' 
        : error.response?.status === 403 ? 'Forbidden: You do not have permission' 
        : error.response?.status ? `Server error (${error.response.status})` 
        : error.message || 'Failed to fetch articles');
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Get article by ID or slug
export const getArticleById = createAsyncThunk(
  'article/getArticleById',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.get(`/articles/${id}`);
      return response.data.data.article;
    } catch (error) {
      console.error('Get article by ID error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
    }
  }
);

// Create new article
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (articleData, thunkAPI) => {
    try {
      const required = ['title', 'content'];
      required.forEach((field) => {
        if (!articleData[field] || !articleData[field].toString().trim()) {
          throw new Error(`${field} is required`);
        }
      });
      const response = await axiosInstance.post('/articles', articleData);
      return response.data.data.article;
    } catch (error) {
      console.error('Create article error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.response?.data?.errors || 'Failed to create article');
    }
  }
);

// Update article
export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ id, data }, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.put(`/articles/${id}`, data);
      return response.data.data.article;
    } catch (error) {
      console.error('Update article error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.response?.data?.errors || 'Failed to update article');
    }
  }
);

// Delete article
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async ({ id, permanent = false }, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const url = permanent 
        ? `/articles/${id}?permanent=true`
        : `/articles/${id}`;
      const response = await axiosInstance.delete(url);
      return { id, message: response.data.message };
    } catch (error) {
      console.error('Delete article error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete article');
    }
  }
);

// Get articles by author
export const getArticlesByAuthor = createAsyncThunk(
  'article/getArticlesByAuthor',
  async ({ authorId, params = {} }, thunkAPI) => {
    try {
      if (!authorId) throw new Error('Author ID is required');
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = queryParams.toString() 
        ? `/articles/author/${authorId}?${queryParams.toString()}`
        : `/articles/author/${authorId}`;
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Get articles by author error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch articles by author');
    }
  }
);

// Get published articles (public endpoint)
export const getPublishedArticles = createAsyncThunk(
  'article/getPublishedArticles',
  async (params = {}, thunkAPI) => {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        category,
        search,
        sortBy = 'publicationDate',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (type) queryParams.append('type', type);
      if (category) queryParams.append('category', category);
      if (search && search.trim()) queryParams.append('search', search.trim());

      const response = await axiosInstance.get(`/articles/public?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get published articles error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch published articles');
    }
  }
);

// Search articles
export const searchArticles = createAsyncThunk(
  'article/searchArticles',
  async ({ q, type, category, limit = 20 }, thunkAPI) => {
    try {
      if (!q || !q.trim()) {
        throw new Error('Search query is required');
      }
      const queryParams = new URLSearchParams({ q: q.trim() });
      if (type) queryParams.append('type', type);
      if (category) queryParams.append('category', category);
      if (limit) queryParams.append('limit', limit.toString());

      const response = await axiosInstance.get(`/articles/search?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Search articles error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search articles');
    }
  }
);

// Toggle featured status
export const toggleFeatured = createAsyncThunk(
  'article/toggleFeatured',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.put(`/articles/${id}/featured`);
      return response.data.data.article;
    } catch (error) {
      console.error('Toggle featured error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to toggle featured status');
    }
  }
);

// Publish article
export const publishArticle = createAsyncThunk(
  'article/publishArticle',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.put(`/articles/${id}/publish`);
      return response.data.data.article;
    } catch (error) {
      console.error('Publish article error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to publish article');
    }
  }
);

// Get article statistics
export const getArticleStats = createAsyncThunk(
  'article/getArticleStats',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/articles/stats');
      return response.data.data;
    } catch (error) {
      console.error('Get article stats error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch article statistics');
    }
  }
);

// Increment article views
export const incrementViews = createAsyncThunk(
  'article/incrementViews',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.put(`/articles/${id}/views`);
      return response.data.data.views;
    } catch (error) {
      console.error('Increment views error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to increment views');
    }
  }
);

// Public: Get article by ID or slug (no auth required)
export const getPublicArticleById = createAsyncThunk(
  'article/getPublicArticleById',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.get(`/articles/public/${id}`);
      return response.data.data.article;
    } catch (error) {
      console.error('Get public article error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
    }
  }
);

// Public: Increment views (no auth required)
export const incrementPublicViews = createAsyncThunk(
  'article/incrementPublicViews',
  async (id, thunkAPI) => {
    try {
      if (!id) throw new Error('Article ID is required');
      const response = await axiosInstance.put(`/articles/public/${id}/views`);
      return response.data.data.views;
    } catch (error) {
      console.error('Increment public views error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to increment views');
    }
  }
);
