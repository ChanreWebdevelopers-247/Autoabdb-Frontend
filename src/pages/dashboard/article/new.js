import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { createArticle } from '../../../redux/actions/articleActions';
import { clearArticleError, clearCreateSuccess } from '../../../redux/slices/articleSlice';
import RichTextEditor from '../../../components/RichTextEditor';

const NewArticlePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, createSuccess } = useSelector((state) => state.article);

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    author: '',
    type: 'article',
    status: 'draft',
    category: '',
    journalName: '',
    journalVolume: '',
    journalIssue: '',
    doi: '',
    metaDescription: '',
    featuredImage: '',
    publicationDate: '',
    keywords: [],
    tags: [],
    references: [],
    coAuthors: []
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showJournalFields, setShowJournalFields] = useState(false);

  // Redirect on success
  useEffect(() => {
    if (createSuccess) {
      router.push('/dashboard/article');
    }
  }, [createSuccess, router]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearArticleError());
      dispatch(clearCreateSuccess());
    };
  }, [dispatch]);

  // Show journal fields for journal type
  useEffect(() => {
    setShowJournalFields(formData.type === 'journal');
  }, [formData.type]);

  const validate = () => {
    const errors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.author?.trim()) {
      errors.author = 'Author is required';
    }
    
    // Strip HTML tags to check if content is empty
    const contentText = formData.content?.replace(/<[^>]*>/g, '').trim();
    if (!contentText) {
      errors.content = 'Content is required';
    }

    // Validate DOI format if provided
    if (formData.doi && !/^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/.test(formData.doi)) {
      errors.doi = 'Please enter a valid DOI format (e.g., 10.1234/example)';
    }

    // Validate meta description length
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      errors.metaDescription = 'Meta description should not exceed 160 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Prepare data for submission
    const articleData = {
      title: formData.title.trim(),
      content: formData.content, // Keep HTML content as-is
      author: formData.author.trim(),
      type: formData.type,
      status: formData.status,
    };

    // Add optional fields if they have values
    if (formData.abstract?.trim()) {
      articleData.abstract = formData.abstract.trim();
    }
    if (formData.category?.trim()) {
      articleData.category = formData.category.trim();
    }
    if (formData.doi?.trim()) {
      articleData.doi = formData.doi.trim();
    }
    if (formData.metaDescription?.trim()) {
      articleData.metaDescription = formData.metaDescription.trim();
    }
    if (formData.featuredImage?.trim()) {
      articleData.featuredImage = formData.featuredImage.trim();
    }
    if (formData.publicationDate) {
      articleData.publicationDate = formData.publicationDate;
    }

    // Journal fields
    if (formData.type === 'journal') {
      if (formData.journalName?.trim()) {
        articleData.journalName = formData.journalName.trim();
      }
      if (formData.journalVolume?.trim()) {
        articleData.journalVolume = formData.journalVolume.trim();
      }
      if (formData.journalIssue?.trim()) {
        articleData.journalIssue = formData.journalIssue.trim();
      }
    }

    // Arrays
    if (formData.keywords.length > 0) {
      articleData.keywords = formData.keywords.filter(k => k.trim());
    }
    if (formData.tags.length > 0) {
      articleData.tags = formData.tags.filter(t => t.trim());
    }
    if (formData.references.length > 0) {
      articleData.references = formData.references.filter(r => r.trim());
    }
    if (formData.coAuthors.length > 0) {
      articleData.coAuthors = formData.coAuthors;
    }

    await dispatch(createArticle(articleData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    // Clear validation error for content
    if (validationErrors.content) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addReference = () => {
    if (referenceInput.trim() && !formData.references.includes(referenceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, referenceInput.trim()]
      }));
      setReferenceInput('');
    }
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const addAuthor = () => {
    if (authorInput.trim() && !formData.coAuthors.includes(authorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        coAuthors: [...prev.coAuthors, authorInput.trim()]
      }));
      setAuthorInput('');
    }
  };

  const removeAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      coAuthors: prev.coAuthors.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-sm text-gray-600 mt-1">Fill in the details to create a new article</p>
          </div>
          <Link
            href="/dashboard/article"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-semibold mb-1">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter article title"
              />
              {validationErrors.title && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.author ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter author name"
              />
              {validationErrors.author && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.author}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 resize-vertical"
                placeholder="Enter article abstract or summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Enter article content"
                error={!!validationErrors.content}
              />
              {validationErrors.content && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.content}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.content ? formData.content.replace(/<[^>]*>/g, '').length : 0} characters
              </p>
            </div>
          </div>

          {/* Article Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Article Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  <option value="article">Article</option>
                  {/* <option value="journal">Journal</option> */}
                  <option value="research">Research</option>
                  <option value="reviews">Reviews</option>
                  <option value="case-study">Case Study</option>
                  <option value="scientific-excerpts">Scientific Excerpts</option>
                  <option value="quick-brief">Quick Brief</option>
                  <option value="expert-opinions">Expert Opinions</option>
                 


                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  <option value="draft">Draft</option>
                  <option value="under-review">Under Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  placeholder="e.g., Medicine, Research, Clinical"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>

            {/* Journal Fields */}
            {showJournalFields && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Journal Name</label>
                  <input
                    type="text"
                    name="journalName"
                    value={formData.journalName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Journal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                  <input
                    type="text"
                    name="journalVolume"
                    value={formData.journalVolume}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Volume number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                  <input
                    type="text"
                    name="journalIssue"
                    value={formData.journalIssue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Issue number"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.doi ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="10.1234/example"
              />
              {validationErrors.doi && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.doi}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: 10.1234/example</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                maxLength={160}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  validationErrors.metaDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description for SEO (max 160 characters)"
              />
              {validationErrors.metaDescription && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.metaDescription}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Co-Authors */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Co-Authors</h2>
            <p className="text-sm text-gray-600">Add additional authors for this article (optional).</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addAuthor)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Enter co-author name and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addAuthor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.coAuthors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.coAuthors.map((author, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Keywords</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addKeyword)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Enter keyword and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Tags</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Enter tag and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* References */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">References</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addReference)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Enter reference and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addReference}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.references.length > 0 && (
              <div className="space-y-2">
                {formData.references.map((reference, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{reference}</span>
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/dashboard/article"
              className="px-4 py-2 border-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewArticlePage;
