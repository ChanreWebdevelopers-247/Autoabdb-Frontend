import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Calendar,
  User,
  Tag,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  GraduationCap,
  Briefcase,
  Sparkles,
  Clock,
  Eye
} from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import { getPublishedArticles } from '@/redux/actions/articleActions';

const articleTypeConfig = {
  'article': { label: 'Article', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  'research': { label: 'Research', icon: GraduationCap, color: 'bg-purple-100 text-purple-800' },
  'reviews': { label: 'Reviews', icon: BookOpen, color: 'bg-green-100 text-green-800' },
  'case-study': { label: 'Case Study', icon: Briefcase, color: 'bg-orange-100 text-orange-800' },
  'scientific-excerpts': { label: 'Scientific Excerpts', icon: Sparkles, color: 'bg-indigo-100 text-indigo-800' },
  'quick-brief': { label: 'Quick Brief', icon: Clock, color: 'bg-pink-100 text-pink-800' },
  'expert-opinions': { label: 'Expert Opinions', icon: User, color: 'bg-teal-100 text-teal-800' },
};

export default function ArticlePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { publishedArticles, publishedPagination, publishedArticlesLoading, publishedArticlesError } = useSelector((state) => state.article);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  // Extract categories from articles
  useEffect(() => {
    if (publishedArticles && publishedArticles.length > 0) {
      const uniqueCategories = [...new Set(
        publishedArticles
          .map(article => article.category)
          .filter(cat => cat && cat.trim())
      )];
      setCategories(uniqueCategories.sort());
    }
  }, [publishedArticles]);

  // Sync with URL query params
  useEffect(() => {
    const { type, category, search, page } = router.query;
    if (type) setSelectedType(type);
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
    if (page) setCurrentPage(parseInt(page));
  }, [router.query]);

  // Fetch articles
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      type: selectedType || undefined,
      category: selectedCategory || undefined,
      search: searchQuery.trim() || undefined,
    };

    dispatch(getPublishedArticles(params));
  }, [dispatch, currentPage, selectedType, selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    router.push({
      pathname: '/article',
      query: {
        ...router.query,
        search: searchQuery,
        page: 1
      }
    });
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type === selectedType ? '' : type);
    setCurrentPage(1);
    router.push({
      pathname: '/article',
      query: {
        ...router.query,
        type: type === selectedType ? '' : type,
        page: 1
      }
    });
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
    router.push({
      pathname: '/article',
      query: {
        ...router.query,
        category: category === selectedCategory ? '' : category,
        page: 1
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedCategory('');
    setCurrentPage(1);
    router.push('/article');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    const stripped = text.replace(/<[^>]*>/g, '');
    return stripped.length > maxLength
      ? stripped.substring(0, maxLength) + '...'
      : stripped;
  };

  const hasActiveFilters = selectedType || selectedCategory || searchQuery;

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Primary Meta Tags */}
        <title>Articles & Research | AutoAb Database</title>
        <meta name="title" content="Articles & Research | AutoAb Database" />
        <meta name="description" content="Browse our collection of published articles, research papers, reviews, and expert opinions on autoantibody research and clinical diagnostics." />
        <meta name="keywords" content="articles, research papers, autoantibody research, clinical diagnostics, scientific publications, medical research, immunology articles, autoimmune disease research" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/article" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/article" />
        <meta property="og:title" content="Articles & Research | AutoAb Database" />
        <meta property="og:description" content="Browse our collection of published articles, research papers, reviews, and expert opinions on autoantibody research and clinical diagnostics." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/article" />
        <meta name="twitter:title" content="Articles & Research | AutoAb Database" />
        <meta name="twitter:description" content="Browse our collection of published articles, research papers, reviews, and expert opinions on autoantibody research and clinical diagnostics." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#51d0de]/30 via-[#d9d9d9] to-[#bf4aa8]/30">
        <PublicHeader />

        {/* Content Container */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="relative pt-20 pb-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto text-center">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4">
                Articles & Research
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Explore our comprehensive collection of published articles, research papers, reviews, and expert insights
              </motion.p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title, keywords, or content..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#d9d9d9]/50 border border-slate-200/60 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <span className="text-slate-600 text-sm">Active filters:</span>
                  {selectedType && (
                    <button
                      onClick={() => handleTypeFilter(selectedType)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    >
                      Type: {articleTypeConfig[selectedType]?.label || selectedType}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryFilter(selectedCategory)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    >
                      Category: {selectedCategory}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    >
                      Search: {searchQuery}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-[#d9d9d9]/40 backdrop-blur-sm rounded-lg p-6 border border-slate-200/60 sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5 text-slate-700" />
                    <h2 className="text-slate-900 font-semibold text-lg">Filters</h2>
                  </div>

                  {/* Type Filter */}
                  <div className="mb-6">
                    <h3 className="text-slate-700 text-sm font-medium mb-3">Article Type</h3>
                    <div className="space-y-2">
                      {Object.entries(articleTypeConfig).map(([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => handleTypeFilter(type)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedType === type
                                ? 'bg-purple-500 text-white'
                                : 'bg-[#d9d9d9]/50 text-slate-700 hover:bg-[#d9d9d9]/70 border border-slate-200/60'
                              }`}
                          >
                            <Icon className="w-4 h-4" />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-slate-700 text-sm font-medium mb-3">Category</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                                ? 'bg-purple-500 text-white'
                                : 'bg-[#d9d9d9]/50 text-slate-700 hover:bg-[#d9d9d9]/70 border border-slate-200/60'
                              }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Articles List */}
              <main className="flex-1">
                {publishedArticlesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : publishedArticlesError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-700">{publishedArticlesError}</p>
                  </div>
                ) : publishedArticles && publishedArticles.length > 0 ? (
                  <>
                    <div className="mb-6 flex items-center justify-between">
                      <p className="text-slate-600">
                        {publishedPagination && publishedPagination.totalArticles > 0 ? (
                          <>
                            Showing {((publishedPagination.currentPage - 1) * 12) + 1} to{' '}
                            {Math.min(publishedPagination.currentPage * 12, publishedPagination.totalArticles)} of{' '}
                            {publishedPagination.totalArticles} articles
                          </>
                        ) : (
                          <>Showing {publishedArticles.length} articles</>
                        )}
                      </p>
                    </div>

                    <motion.div className="space-y-4" initial="initial" animate="animate" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}>
                      {publishedArticles.map((article, idx) => {
                        const typeConfig = articleTypeConfig[article.type] || articleTypeConfig['article'];
                        const TypeIcon = typeConfig.icon;

                        return (
                          <motion.div key={article._id} variants={{ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                          <Link
                            href={`/article/${article.slug || article._id}`}
                            className="group bg-[#d9d9d9]/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-200/60 hover:border-purple-500 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row block"
                          >
                            {/* Article Image */}
                            {/* {article.featuredImage ? (
                              <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                                <Image
                                  src={article.featuredImage}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                                    <TypeIcon className="w-3 h-3" />
                                    {typeConfig.label}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                <TypeIcon className="w-16 h-16 text-slate-400" />
                                <div className="absolute top-4 left-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                                    <TypeIcon className="w-3 h-3" />
                                    {typeConfig.label}
                                  </span>
                                </div>
                              </div>
                            )} */}

                            {/* Article Content */}
                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                {article.title}
                              </h3>

                              {article.abstract && (
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                  {truncateText(article.abstract, 200)}
                                </p>
                              )}

                              {/* Meta Information */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                                {article.author && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{article.author}</span>
                                  </div>
                                )}
                                {article.publicationDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(article.publicationDate)}</span>
                                  </div>
                                )}
                                {article.views !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{article.views} views</span>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {article.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#d9d9d9]/60 text-slate-700 rounded text-xs"
                                    >
                                      <Tag className="w-3 h-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Read More */}
                              <div className="mt-auto pt-4 border-t border-slate-200/60">
                                <span className="text-purple-600 text-sm font-medium group-hover:text-purple-700 transition-colors">
                                  Read More →
                                </span>
                              </div>
                            </div>
                          </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Pagination */}
                    {publishedPagination && publishedPagination.totalPages > 1 && (
                      <div className="mt-8">
                        {/* Pagination Info */}
                        <div className="mb-4 text-center text-sm text-slate-600">
                          Showing page {publishedPagination.currentPage} of {publishedPagination.totalPages} 
                          {' '}({publishedPagination.totalArticles} total articles)
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {/* First Page Button */}
                          <button
                            onClick={() => {
                              const newPage = 1;
                              setCurrentPage(newPage);
                              router.push({
                                pathname: '/article',
                                query: {
                                  ...router.query,
                                  page: newPage
                                }
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={!publishedPagination.hasPrevPage}
                            className="px-3 py-2 bg-[#d9d9d9]/50 border border-slate-200/60 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9d9d9]/70 transition-colors text-sm font-medium"
                            title="First page"
                          >
                            First
                          </button>

                          {/* Previous Page Button */}
                          <button
                            onClick={() => {
                              const newPage = Math.max(1, currentPage - 1);
                              setCurrentPage(newPage);
                              router.push({
                                pathname: '/article',
                                query: {
                                  ...router.query,
                                  page: newPage
                                }
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={!publishedPagination.hasPrevPage}
                            className="px-3 py-2 bg-[#d9d9d9]/50 border border-slate-200/60 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9d9d9]/70 transition-colors"
                            title="Previous page"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-1">
                            {(() => {
                              const totalPages = publishedPagination.totalPages;
                              const current = currentPage;
                              const pages = [];
                              
                              if (totalPages <= 7) {
                                // Show all pages if 7 or fewer
                                for (let i = 1; i <= totalPages; i++) {
                                  pages.push(i);
                                }
                              } else {
                                // Always show first page
                                pages.push(1);
                                
                                if (current <= 4) {
                                  // Near the beginning
                                  for (let i = 2; i <= 5; i++) {
                                    pages.push(i);
                                  }
                                  pages.push('ellipsis');
                                  pages.push(totalPages);
                                } else if (current >= totalPages - 3) {
                                  // Near the end
                                  pages.push('ellipsis');
                                  for (let i = totalPages - 4; i <= totalPages; i++) {
                                    pages.push(i);
                                  }
                                } else {
                                  // In the middle
                                  pages.push('ellipsis');
                                  for (let i = current - 1; i <= current + 1; i++) {
                                    pages.push(i);
                                  }
                                  pages.push('ellipsis');
                                  pages.push(totalPages);
                                }
                              }

                              return pages.map((pageNum, index) => {
                                if (pageNum === 'ellipsis') {
                                  return (
                                    <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                                      ...
                                    </span>
                                  );
                                }

                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => {
                                      setCurrentPage(pageNum);
                                      router.push({
                                        pathname: '/article',
                                        query: {
                                          ...router.query,
                                          page: pageNum
                                        }
                                      });
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[40px] ${
                                      currentPage === pageNum
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-[#d9d9d9]/50 text-slate-700 hover:bg-[#d9d9d9]/70 border border-slate-200/60'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              });
                            })()}
                          </div>

                          {/* Next Page Button */}
                          <button
                            onClick={() => {
                              const newPage = Math.min(publishedPagination.totalPages, currentPage + 1);
                              setCurrentPage(newPage);
                              router.push({
                                pathname: '/article',
                                query: {
                                  ...router.query,
                                  page: newPage
                                }
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={!publishedPagination.hasNextPage}
                            className="px-3 py-2 bg-[#d9d9d9]/50 border border-slate-200/60 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9d9d9]/70 transition-colors"
                            title="Next page"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Last Page Button */}
                          <button
                            onClick={() => {
                              const newPage = publishedPagination.totalPages;
                              setCurrentPage(newPage);
                              router.push({
                                pathname: '/article',
                                query: {
                                  ...router.query,
                                  page: newPage
                                }
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={!publishedPagination.hasNextPage}
                            className="px-3 py-2 bg-[#d9d9d9]/50 border border-slate-200/60 rounded-lg text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9d9d9]/70 transition-colors text-sm font-medium"
                            title="Last page"
                          >
                            Last
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[#d9d9d9]/40 backdrop-blur-sm rounded-lg p-12 text-center border border-slate-200/60">
                    <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No articles found</h3>
                    <p className="text-slate-600">
                      {hasActiveFilters
                        ? 'Try adjusting your filters or search query.'
                        : 'No published articles available at the moment.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>

        <PublicFooter />

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </>
  );
}
