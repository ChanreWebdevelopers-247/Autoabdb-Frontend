import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText, 
  TrendingUp,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MoreVertical
} from 'lucide-react';
import {
  getAllArticles,
  deleteArticle,
  toggleFeatured,
  publishArticle,
  getArticleStats
} from '../../../redux/actions/articleActions';
import { clearArticleError, clearDeleteSuccess } from '../../../redux/slices/articleSlice';

const ArticleDashboard = () => {
  const dispatch = useDispatch();
  const { 
    articles, 
    loading, 
    error, 
    pagination,
    stats,
    statsLoading,
    deleteLoading,
    deleteSuccess
  } = useSelector((state) => state.article);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    category: '',
    isPublished: undefined,
    isFeatured: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load articles and stats
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      console.warn('User not authenticated, cannot fetch articles');
      return;
    }

    // Build clean filters object (only include non-empty values)
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      // Include if it's a boolean (true/false), or if it's a non-empty string
      if (typeof value === 'boolean' || (value && value.toString().trim() !== '')) {
        cleanFilters[key] = value;
      }
    });

    dispatch(getAllArticles({
      page: currentPage,
      limit: 12,
      ...cleanFilters,
      sortBy,
      sortOrder
    })).catch(err => {
      console.error('Error fetching articles:', err);
    });
    
    // Only fetch stats if user is Admin or superAdmin
    if (user && (user.role === 'Admin' || user.role === 'superAdmin')) {
      dispatch(getArticleStats()).catch(err => {
        console.error('Error fetching article stats:', err);
      });
    }
  }, [dispatch, currentPage, filters, sortBy, sortOrder, user]);

  // Clear success messages
  useEffect(() => {
    if (deleteSuccess) {
      setTimeout(() => {
        dispatch(clearDeleteSuccess());
      }, 3000);
    }
  }, [deleteSuccess, dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await dispatch(deleteArticle({ id }));
      if (currentPage > 1 && articles.length === 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        dispatch(getAllArticles({
          page: currentPage,
          limit: 12,
          ...filters,
          sortBy,
          sortOrder
        }));
      }
    }
  }, [dispatch, articles.length, currentPage, filters, sortBy, sortOrder]);

  // Handle toggle featured
  const handleToggleFeatured = useCallback(async (id) => {
    await dispatch(toggleFeatured(id));
    dispatch(getAllArticles({
      page: currentPage,
      limit: 12,
      ...filters,
      sortBy,
      sortOrder
    }));
  }, [dispatch, currentPage, filters, sortBy, sortOrder]);

  // Handle publish
  const handlePublish = useCallback(async (id) => {
    await dispatch(publishArticle(id));
    dispatch(getAllArticles({
      page: currentPage,
      limit: 12,
      ...filters,
      sortBy,
      sortOrder
    }));
  }, [dispatch, currentPage, filters, sortBy, sortOrder]);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.draft;
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      article: 'bg-blue-100 text-blue-800',
      journal: 'bg-purple-100 text-purple-800',
      research: 'bg-indigo-100 text-indigo-800',
      review: 'bg-pink-100 text-pink-800',
      'case-study': 'bg-orange-100 text-orange-800'
    };
    return badges[type] || badges.article;
  };

  // Statistics cards
  const statsCards = useMemo(() => [
    {
      label: 'Total Articles',
      value: stats?.overview?.totalArticles || 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Published',
      value: stats?.overview?.publishedArticles || 0,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Drafts',
      value: stats?.overview?.draftArticles || 0,
      icon: Clock,
      color: 'bg-gray-50 text-gray-600'
    },
    {
      label: 'Featured',
      value: stats?.overview?.featuredArticles || 0,
      icon: Star,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      label: 'Total Views',
      value: stats?.overview?.totalViews || 0,
      icon: Eye,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'Total Likes',
      value: stats?.overview?.totalLikes || 0,
      icon: TrendingUp,
      color: 'bg-pink-50 text-pink-600'
    }
  ], [stats]);

  if (statsLoading && !stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your articles, journals, and research papers</p>
          </div>
          <Link
            href="/dashboard/article/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-4 bg-white border-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-2 rounded-lg p-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles by title, content, keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-4"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="under-review">Under Review</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="article">Article</option>
                  <option value="journal">Journal</option>
                  <option value="research">Research</option>
                  <option value="review">Review</option>
                  <option value="case-study">Case Study</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Published</label>
                <select
                  value={filters.isPublished === undefined ? '' : filters.isPublished.toString()}
                  onChange={(e) => handleFilterChange('isPublished', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Featured</label>
                <select
                  value={filters.isFeatured === undefined ? '' : filters.isFeatured.toString()}
                  onChange={(e) => handleFilterChange('isFeatured', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          )}

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-xs font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="publicationDate">Publication Date</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="likes">Likes</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border-2 rounded-lg text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="font-semibold mb-1">Error loading articles</div>
            <div className="text-sm">{error}</div>
            {error.includes('401') || error.includes('Unauthorized') || error.includes('token') ? (
              <div className="text-xs mt-2">
                Please make sure you are logged in and your session is valid.
              </div>
            ) : null}
          </div>
        )}

        {/* Success Message */}
        {deleteSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Article deleted successfully
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading articles...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white border-2 rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-sm text-gray-600 mb-4">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'Get started by creating your first article'}
            </p>
            {!Object.values(filters).some(f => f) && (
              <Link
                href="/dashboard/article/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Article</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white border-2 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${getStatusBadge(article.status)}`}>
                          {article.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${getTypeBadge(article.type)}`}>
                          {article.type}
                        </span>
                        {article.isFeatured && (
                          <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 inline mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {article.abstract && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {article.abstract}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {article.author && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                    )}
                    {article.publicationDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publicationDate)}</span>
                      </div>
                    )}
                    {article.category && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Tag className="w-3 h-3" />
                        <span>{article.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {article.likes || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <Link
                      href={`/dashboard/article/${article._id}`}
                      className="flex-1 text-center px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/article/${article._id}/edit`}
                      className="flex-1 text-center px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(article._id)}
                      className={`px-3 py-1.5 text-xs rounded transition-colors ${
                        article.isFeatured
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      title={article.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className={`w-3 h-3 ${article.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    {article.status !== 'published' && (
                      <button
                        onClick={() => handlePublish(article._id)}
                        className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                        title="Publish article"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                      disabled={deleteLoading}
                      title="Delete article"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border-2 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.totalArticles)} of {pagination.totalArticles} articles
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage || currentPage === 1}
                    className="px-3 py-1.5 text-sm border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage || currentPage === pagination.totalPages}
                    className="px-3 py-1.5 text-sm border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ArticleDashboard;
