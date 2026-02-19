import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  Eye,
  TrendingUp,
  Star,
  FileText,
  BookOpen,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Download,
  Share2,
  XCircle,
  AlertCircle,
  FileDown,
  ExternalLink
} from 'lucide-react';
import {
  getArticleById,
  deleteArticle,
  toggleFeatured,
  publishArticle
} from '../../../redux/actions/articleActions';
import {
  clearArticleError,
  clearDeleteSuccess,
  clearCurrentArticle
} from '../../../redux/slices/articleSlice';

const ViewArticlePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const {
    currentArticle,
    articleLoading,
    articleError,
    deleteLoading,
    deleteSuccess
  } = useSelector((state) => state.article);
  const { user } = useSelector((state) => state.auth);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load article data when ID is available
  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(getArticleById(id));
    }
  }, [id, dispatch]);

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      dispatch(clearDeleteSuccess());
      router.push('/dashboard/article');
    }
  }, [deleteSuccess, dispatch, router]);

  // Clear article and errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCurrentArticle());
      dispatch(clearArticleError());
    };
  }, [dispatch]);

  // Handle delete
  const handleDelete = async () => {
    if (currentArticle?._id) {
      await dispatch(deleteArticle({ id: currentArticle._id }));
      setShowDeleteConfirm(false);
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async () => {
    if (currentArticle?._id) {
      await dispatch(toggleFeatured(currentArticle._id));
      // Refresh article data
      dispatch(getArticleById(id));
    }
  };

  // Handle publish
  const handlePublish = async () => {
    if (currentArticle?._id) {
      await dispatch(publishArticle(currentArticle._id));
      // Refresh article data
      dispatch(getArticleById(id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800 border-green-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      'under-review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      archived: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || badges.draft;
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      article: 'bg-blue-100 text-blue-800 border-blue-300',
      journal: 'bg-purple-100 text-purple-800 border-purple-300',
      research: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      review: 'bg-pink-100 text-pink-800 border-pink-300',
      'case-study': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return badges[type] || badges.article;
  };

  // Share article
  const shareArticle = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentArticle?.title,
          text: currentArticle?.abstract || '',
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Loading state
  if (articleLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading article...</div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (articleError) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link
            href="/dashboard/article"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error loading article
            </div>
            <div className="text-sm">{articleError}</div>
          </div>
        </div>
      </Layout>
    );
  }

  // No article found
  if (!currentArticle) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link
            href="/dashboard/article"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
            Article not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/article"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={shareArticle}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentArticle.isFeatured
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title={currentArticle.isFeatured ? 'Remove from featured' : 'Mark as featured'}
            >
              <Star className={`w-4 h-4 ${currentArticle.isFeatured ? 'fill-current' : ''}`} />
              {currentArticle.isFeatured ? 'Featured' : 'Feature'}
            </button>
            {currentArticle.status !== 'published' && (
              <button
                onClick={handlePublish}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                title="Publish article"
              >
                <CheckCircle className="w-4 h-4" />
                Publish
              </button>
            )}
            <Link
              href={`/dashboard/article/${currentArticle._id}/edit`}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              disabled={deleteLoading}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Article</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete &quot;{currentArticle.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Article Header */}
        <div className="bg-white border-2 rounded-lg p-6">
          <div className="flex flex-wrap items-start gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded border ${getStatusBadge(currentArticle.status)}`}>
              {currentArticle.status}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded border ${getTypeBadge(currentArticle.type)}`}>
              {currentArticle.type}
            </span>
            {currentArticle.isFeatured && (
              <span className="px-3 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {currentArticle.isPublished && (
              <span className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Published
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentArticle.title}
          </h1>

          {currentArticle.abstract && (
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {currentArticle.abstract}
            </p>
          )}

          {/* Article Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {currentArticle.author && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Author:</span>
                <span>{currentArticle.author}</span>
              </div>
            )}
            
            {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Co-authors:</span>
                <span>
                  {currentArticle.coAuthors.join(', ')}
                </span>
              </div>
            )}

            {currentArticle.publicationDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Published:</span>
                <span>{formatDate(currentArticle.publicationDate)}</span>
              </div>
            )}

            {currentArticle.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(currentArticle.createdAt)}</span>
              </div>
            )}

            {currentArticle.updatedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Updated:</span>
                <span>{formatDate(currentArticle.updatedAt)}</span>
              </div>
            )}

            {currentArticle.category && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <span className="font-medium">Category:</span>
                <span>{currentArticle.category}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Views:</span>
              <span>{currentArticle.views || 0}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Likes:</span>
              <span>{currentArticle.likes || 0}</span>
            </div>

            {currentArticle.readingTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Reading Time:</span>
                <span>{currentArticle.readingTime} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {currentArticle.featuredImage && (
          <div className="bg-white border-2 rounded-lg p-4 relative h-96">
            <Image
              src={currentArticle.featuredImage}
              alt={currentArticle.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* Journal Information */}
        {(currentArticle.journalName || currentArticle.journalVolume || currentArticle.journalIssue || currentArticle.doi) && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Journal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentArticle.journalName && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Journal Name:</span>
                  <p className="text-gray-900">{currentArticle.journalName}</p>
                </div>
              )}
              {currentArticle.journalVolume && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Volume:</span>
                  <p className="text-gray-900">{currentArticle.journalVolume}</p>
                </div>
              )}
              {currentArticle.journalIssue && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Issue:</span>
                  <p className="text-gray-900">{currentArticle.journalIssue}</p>
                </div>
              )}
              {currentArticle.doi && (
                <div>
                  <span className="text-sm font-medium text-gray-700">DOI:</span>
                  <a
                    href={`https://doi.org/${currentArticle.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {currentArticle.doi}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white border-2 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: currentArticle.content }}
          />
        </div>

        {/* Keywords and Tags */}
        {(currentArticle.keywords?.length > 0 || currentArticle.tags?.length > 0) && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Keywords & Tags</h2>
            <div className="space-y-4">
              {currentArticle.keywords?.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Keywords:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentArticle.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {currentArticle.tags?.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentArticle.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attachments */}
        {currentArticle.attachments?.length > 0 && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Attachments
            </h2>
            <div className="space-y-2">
              {currentArticle.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                      {attachment.fileType && (
                        <p className="text-xs text-gray-500">{attachment.fileType}</p>
                      )}
                      {attachment.uploadedAt && (
                        <p className="text-xs text-gray-500">
                          Uploaded: {formatDate(attachment.uploadedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {currentArticle.references?.length > 0 && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">References</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {currentArticle.references.map((reference, index) => (
                <li key={index} className="pl-2">
                  {reference}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Related Articles */}
        {currentArticle.relatedArticles?.length > 0 && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentArticle.relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle._id}
                  href={`/dashboard/article/${relatedArticle._id}`}
                  className="p-4 border-2 rounded-lg hover:border-blue-400 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedArticle.title}</h3>
                  {relatedArticle.slug && (
                    <p className="text-sm text-gray-500">{relatedArticle.slug}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Meta Description */}
        {currentArticle.metaDescription && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meta Description</h2>
            <p className="text-gray-700">{currentArticle.metaDescription}</p>
          </div>
        )}

        {/* Published By Information */}
        {currentArticle.publishedBy && (
          <div className="bg-white border-2 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Publication Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Published by:</span>{' '}
                {currentArticle.publishedBy?.name || currentArticle.publishedBy?.username || 'Unknown'}
              </div>
              {currentArticle.publishedAt && (
                <div>
                  <span className="font-medium">Published at:</span> {formatDate(currentArticle.publishedAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewArticlePage;
