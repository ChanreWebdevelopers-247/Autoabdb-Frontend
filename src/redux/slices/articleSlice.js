// articleSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByAuthor,
  getPublishedArticles,
  searchArticles,
  toggleFeatured,
  publishArticle,
  getArticleStats,
  incrementViews,
  getPublicArticleById,
  incrementPublicViews
} from '../actions/articleActions';

const initialState = {
  // Main data
  articles: [],
  currentArticle: null,
  authorArticles: [],
  publishedArticles: [],
  searchResults: [],
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Author articles pagination
  authorPagination: {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Published articles pagination
  publishedPagination: {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Statistics
  stats: {
    overview: {
      totalArticles: 0,
      publishedArticles: 0,
      draftArticles: 0,
      featuredArticles: 0,
      totalViews: 0,
      totalLikes: 0
    },
    typeStats: []
  },
  
  // Loading states
  loading: false,
  articleLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  authorArticlesLoading: false,
  publishedArticlesLoading: false,
  searchLoading: false,
  publishLoading: false,
  featuredLoading: false,
  statsLoading: false,
  viewsLoading: false,
  
  // Error states
  error: null,
  articleError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  authorArticlesError: null,
  publishedArticlesError: null,
  searchError: null,
  publishError: null,
  featuredError: null,
  statsError: null,
  viewsError: null,
  
  // Success states
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  publishSuccess: false,
  featuredSuccess: false,
  
  // Search query
  searchQuery: null,
  searchCount: 0
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearArticleError: (state) => {
      state.error = null;
      state.articleError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.authorArticlesError = null;
      state.publishedArticlesError = null;
      state.searchError = null;
      state.publishError = null;
      state.featuredError = null;
      state.statsError = null;
      state.viewsError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    clearPublishSuccess: (state) => {
      state.publishSuccess = false;
    },
    clearFeaturedSuccess: (state) => {
      state.featuredSuccess = false;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = null;
      state.searchCount = 0;
    },
    setCurrentArticle: (state, action) => {
      state.currentArticle = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all articles
      .addCase(getAllArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getAllArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.articles = [];
      })

      // Get article by ID
      .addCase(getArticleById.pending, (state) => {
        state.articleLoading = true;
        state.articleError = null;
      })
      .addCase(getArticleById.fulfilled, (state, action) => {
        state.articleLoading = false;
        state.currentArticle = action.payload;
      })
      .addCase(getArticleById.rejected, (state, action) => {
        state.articleLoading = false;
        state.articleError = action.payload;
        state.currentArticle = null;
      })

      // Create article
      .addCase(createArticle.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.articles.unshift(action.payload);
        state.currentArticle = action.payload;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })

      // Update article
      .addCase(updateArticle.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const updatedArticle = action.payload;
        state.currentArticle = updatedArticle;
        // Update in articles list if present
        const index = state.articles.findIndex(a => a._id === updatedArticle._id);
        if (index !== -1) {
          state.articles[index] = updatedArticle;
        }
        // Update in author articles if present
        const authorIndex = state.authorArticles.findIndex(a => a._id === updatedArticle._id);
        if (authorIndex !== -1) {
          state.authorArticles[authorIndex] = updatedArticle;
        }
        // Update in published articles if present
        const publishedIndex = state.publishedArticles.findIndex(a => a._id === updatedArticle._id);
        if (publishedIndex !== -1) {
          state.publishedArticles[publishedIndex] = updatedArticle;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })

      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        const deletedId = action.payload.id;
        state.articles = state.articles.filter(a => a._id !== deletedId);
        state.authorArticles = state.authorArticles.filter(a => a._id !== deletedId);
        state.publishedArticles = state.publishedArticles.filter(a => a._id !== deletedId);
        if (state.currentArticle?._id === deletedId) {
          state.currentArticle = null;
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      })

      // Get articles by author
      .addCase(getArticlesByAuthor.pending, (state) => {
        state.authorArticlesLoading = true;
        state.authorArticlesError = null;
      })
      .addCase(getArticlesByAuthor.fulfilled, (state, action) => {
        state.authorArticlesLoading = false;
        state.authorArticles = action.payload.articles || [];
        state.authorPagination = action.payload.pagination || state.authorPagination;
      })
      .addCase(getArticlesByAuthor.rejected, (state, action) => {
        state.authorArticlesLoading = false;
        state.authorArticlesError = action.payload;
        state.authorArticles = [];
      })

      // Get published articles
      .addCase(getPublishedArticles.pending, (state) => {
        state.publishedArticlesLoading = true;
        state.publishedArticlesError = null;
      })
      .addCase(getPublishedArticles.fulfilled, (state, action) => {
        state.publishedArticlesLoading = false;
        state.publishedArticles = action.payload.articles || [];
        state.publishedPagination = action.payload.pagination || state.publishedPagination;
      })
      .addCase(getPublishedArticles.rejected, (state, action) => {
        state.publishedArticlesLoading = false;
        state.publishedArticlesError = action.payload;
        state.publishedArticles = [];
      })

      // Search articles
      .addCase(searchArticles.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.articles || [];
        state.searchCount = action.payload.count || 0;
        state.searchQuery = action.payload.query || null;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = [];
        state.searchCount = 0;
      })

      // Toggle featured
      .addCase(toggleFeatured.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
        state.featuredSuccess = false;
      })
      .addCase(toggleFeatured.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredSuccess = true;
        const updatedArticle = action.payload;
        // Update in articles list if present
        const index = state.articles.findIndex(a => a._id === updatedArticle._id);
        if (index !== -1) {
          state.articles[index] = updatedArticle;
        }
        // Update current article if it's the one being updated
        if (state.currentArticle?._id === updatedArticle._id) {
          state.currentArticle = updatedArticle;
        }
      })
      .addCase(toggleFeatured.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
        state.featuredSuccess = false;
      })

      // Publish article
      .addCase(publishArticle.pending, (state) => {
        state.publishLoading = true;
        state.publishError = null;
        state.publishSuccess = false;
      })
      .addCase(publishArticle.fulfilled, (state, action) => {
        state.publishLoading = false;
        state.publishSuccess = true;
        const publishedArticle = action.payload;
        state.currentArticle = publishedArticle;
        // Update in articles list if present
        const index = state.articles.findIndex(a => a._id === publishedArticle._id);
        if (index !== -1) {
          state.articles[index] = publishedArticle;
        }
        // Update in author articles if present
        const authorIndex = state.authorArticles.findIndex(a => a._id === publishedArticle._id);
        if (authorIndex !== -1) {
          state.authorArticles[authorIndex] = publishedArticle;
        }
      })
      .addCase(publishArticle.rejected, (state, action) => {
        state.publishLoading = false;
        state.publishError = action.payload;
        state.publishSuccess = false;
      })

      // Get article stats
      .addCase(getArticleStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(getArticleStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(getArticleStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })

      // Increment views
      .addCase(incrementViews.pending, (state) => {
        state.viewsLoading = true;
        state.viewsError = null;
      })
      .addCase(incrementViews.fulfilled, (state, action) => {
        state.viewsLoading = false;
        if (state.currentArticle) {
          state.currentArticle.views = action.payload;
        }
      })
      .addCase(incrementViews.rejected, (state, action) => {
        state.viewsLoading = false;
        state.viewsError = action.payload;
      })

      // Get public article by ID
      .addCase(getPublicArticleById.pending, (state) => {
        state.articleLoading = true;
        state.articleError = null;
      })
      .addCase(getPublicArticleById.fulfilled, (state, action) => {
        state.articleLoading = false;
        state.currentArticle = action.payload;
      })
      .addCase(getPublicArticleById.rejected, (state, action) => {
        state.articleLoading = false;
        state.articleError = action.payload;
        state.currentArticle = null;
      })

      // Increment public views
      .addCase(incrementPublicViews.pending, (state) => {
        state.viewsLoading = true;
        state.viewsError = null;
      })
      .addCase(incrementPublicViews.fulfilled, (state, action) => {
        state.viewsLoading = false;
        if (state.currentArticle) {
          state.currentArticle.views = action.payload;
        }
      })
      .addCase(incrementPublicViews.rejected, (state, action) => {
        state.viewsLoading = false;
        state.viewsError = action.payload;
      });
  }
});

export const {
  clearArticleError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  clearPublishSuccess,
  clearFeaturedSuccess,
  clearCurrentArticle,
  clearSearchResults,
  setCurrentArticle
} = articleSlice.actions;

export default articleSlice.reducer;
