import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Eye,
  Clock,
  BookOpen,
  FileText,
  GraduationCap,
  Briefcase,
  Sparkles,
  Clock as ClockIcon,
  ExternalLink,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import { getPublicArticleById } from '@/redux/actions/articleActions';

const articleTypeConfig = {
  'article': { label: 'Article', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  'research': { label: 'Research', icon: GraduationCap, color: 'bg-purple-100 text-purple-800' },
  'reviews': { label: 'Reviews', icon: BookOpen, color: 'bg-green-100 text-green-800' },
  'case-study': { label: 'Case Study', icon: Briefcase, color: 'bg-orange-100 text-orange-800' },
  'scientific-excerpts': { label: 'Scientific Excerpts', icon: Sparkles, color: 'bg-indigo-100 text-indigo-800' },
  'quick-brief': { label: 'Quick Brief', icon: ClockIcon, color: 'bg-pink-100 text-pink-800' },
  'expert-opinions': { label: 'Expert Opinions', icon: User, color: 'bg-teal-100 text-teal-800' },
};

export default function ArticleDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const { currentArticle, articleLoading, articleError } = useSelector((state) => state.article);
  
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [abstractExpanded, setAbstractExpanded] = useState(false);

  // Fetch article when slug is available
  useEffect(() => {
    if (slug && slug !== 'undefined') {
      dispatch(getPublicArticleById(slug));
    }
  }, [slug, dispatch]);

  // Calculate reading time
  useEffect(() => {
    if (currentArticle?.content) {
      const text = currentArticle.content.replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const wordsPerMinute = 200;
      setReadingTime(Math.ceil(words.length / wordsPerMinute));
    }
  }, [currentArticle]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = currentArticle?.title || '';
    const text = currentArticle?.abstract || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (articleLoading) {
    return (
      <>
        <Head>
          <title>Loading... | AutoAb Database</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <PublicHeader />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
          <PublicFooter />
        </div>
      </>
    );
  }

  if (articleError || !currentArticle) {
    return (
      <>
        <Head>
          <title>Article Not Found | AutoAb Database</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <PublicHeader />
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
              <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                <p className="text-gray-600 mb-6">
                  {articleError || 'The article you are looking for does not exist or has been removed.'}
                </p>
                <Link
                  href="/article"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </Link>
              </div>
            </div>
          </div>
          <PublicFooter />
        </div>
      </>
    );
  }

  const typeConfig = articleTypeConfig[currentArticle.type] || articleTypeConfig['article'];
  const TypeIcon = typeConfig.icon;

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Primary Meta Tags */}
        <title>{currentArticle.title} | AutoAb Database</title>
        <meta name="title" content={`${currentArticle.title} | AutoAb Database`} />
        <meta name="description" content={currentArticle.metaDescription || currentArticle.abstract || currentArticle.title} />
        <meta name="keywords" content={currentArticle.tags?.join(', ') || currentArticle.keywords?.join(', ') || 'autoantibody, research, article'} />
        <meta name="author" content={currentArticle.author || 'Autoantibody Database'} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href={`https://autoabdb.com/article/${currentArticle.slug || currentArticle._id}`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://autoabdb.com/article/${currentArticle.slug || currentArticle._id}`} />
        <meta property="og:title" content={currentArticle.title} />
        <meta property="og:description" content={currentArticle.metaDescription || currentArticle.abstract || ''} />
        {currentArticle.featuredImage && (
          <meta property="og:image" content={currentArticle.featuredImage} />
        )}
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />
        {currentArticle.publicationDate && (
          <meta property="article:published_time" content={new Date(currentArticle.publicationDate).toISOString()} />
        )}
        {currentArticle.author && (
          <meta property="article:author" content={currentArticle.author} />
        )}
        {currentArticle.tags && currentArticle.tags.length > 0 && 
          currentArticle.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))
        }

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://autoabdb.com/article/${currentArticle.slug || currentArticle._id}`} />
        <meta name="twitter:title" content={currentArticle.title} />
        <meta name="twitter:description" content={currentArticle.metaDescription || currentArticle.abstract || ''} />
        {currentArticle.featuredImage && (
          <meta name="twitter:image" content={currentArticle.featuredImage} />
        )}

        {/* Article-specific meta tags */}
        {currentArticle.doi && <meta name="citation_doi" content={currentArticle.doi} />}
        {currentArticle.publicationDate && (
          <meta name="citation_publication_date" content={new Date(currentArticle.publicationDate).toISOString()} />
        )}
        {currentArticle.author && (
          <meta name="citation_author" content={currentArticle.author} />
        )}

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />

        {/* White Content Container */}
        <div className="bg-white">
          {/* Hero Section with Featured Image */}
          {currentArticle.featuredImage && (
            <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10" />
              <Image
                src={currentArticle.featuredImage}
                alt={currentArticle.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-20 flex items-end">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-12">
                  <Link
                    href="/article"
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Articles</span>
                  </Link>
                  
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md ${typeConfig.color}`}>
                      <TypeIcon className="w-4 h-4" />
                      {typeConfig.label}
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {currentArticle.title}
                  </h1>

                  {currentArticle.abstract && (
                    <div className="mb-6 max-w-3xl">
                      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between gap-4">
                          <p className={`text-lg sm:text-xl text-white/95 leading-relaxed transition-all ${
                            abstractExpanded ? '' : 'line-clamp-2'
                          }`}>
                            {abstractExpanded ? currentArticle.abstract : (
                              currentArticle.abstract.length > 150 
                                ? currentArticle.abstract.substring(0, 150) + '...' 
                                : currentArticle.abstract
                            )}
                          </p>
                          <button
                            onClick={() => setAbstractExpanded(!abstractExpanded)}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                            aria-label={abstractExpanded ? 'Collapse abstract' : 'Expand abstract'}
                          >
                            {abstractExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                    {currentArticle.author && (
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                        <User className="w-4 h-4" />
                        <span className="font-medium">
                          {currentArticle.author}
                          {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 && (
                            <span className="text-white/80 font-normal">
                              {', ' + currentArticle.coAuthors.join(', ')}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {currentArticle.publicationDate && (
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(currentArticle.publicationDate)}</span>
                      </div>
                    )}
                    {readingTime > 0 && (
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime} min read</span>
                      </div>
                    )}
                    {currentArticle.views !== undefined && (
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
                        <Eye className="w-4 h-4" />
                        <span>{currentArticle.views.toLocaleString()} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Header (when no featured image) */}
          {!currentArticle.featuredImage && (
            <div className="relative pt-24 pb-16 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto">
                <Link
                  href="/article"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back to Articles</span>
                </Link>

                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${typeConfig.color}`}>
                    <TypeIcon className="w-4 h-4" />
                    {typeConfig.label}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                  {currentArticle.title}
                </h1>

                {currentArticle.abstract && (
                  <div className="mb-10 max-w-3xl">
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-start justify-between gap-4">
                        <p className={`text-xl text-gray-700 leading-relaxed transition-all ${
                          abstractExpanded ? '' : 'line-clamp-2'
                        }`}>
                          {abstractExpanded ? currentArticle.abstract : (
                            currentArticle.abstract.length > 150 
                              ? currentArticle.abstract.substring(0, 150) + '...' 
                              : currentArticle.abstract
                          )}
                        </p>
                        <button
                          onClick={() => setAbstractExpanded(!abstractExpanded)}
                          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors border border-purple-300"
                          aria-label={abstractExpanded ? 'Collapse abstract' : 'Expand abstract'}
                        >
                          {abstractExpanded ? (
                            <ChevronUp className="w-5 h-5 text-purple-700" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-purple-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                  {currentArticle.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 ? 'Authors' : 'Author'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {currentArticle.author}
                          {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 && (
                            <span className="text-gray-700 font-normal">
                              {', ' + currentArticle.coAuthors.join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {currentArticle.publicationDate && (
                    <div className="flex items-center gap-2 pl-6 border-l border-gray-300">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Published</p>
                        <p className="font-medium text-gray-900">{formatDate(currentArticle.publicationDate)}</p>
                      </div>
                    </div>
                  )}
                  {readingTime > 0 && (
                    <div className="flex items-center gap-2 pl-6 border-l border-gray-300">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Reading Time</p>
                        <p className="font-medium text-gray-900">{readingTime} min</p>
                      </div>
                    </div>
                  )}
                  {currentArticle.views !== undefined && (
                    <div className="flex items-center gap-2 pl-6 border-l border-gray-300">
                      <Eye className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="font-medium text-gray-900">{currentArticle.views.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Article Content */}
            <article className="lg:col-span-8">
              {/* Tags */}
              {currentArticle.tags && currentArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {currentArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Content Card */}
              <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 border border-gray-200 shadow-sm">
                {/* Rich Text Content */}
                <div
                  className="article-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                />
                <style jsx global>{`
                  .article-content {
                    color: #374151;
                    font-size: 1.125rem;
                    line-height: 1.875rem;
                  }
                  .article-content h1,
                  .article-content h2,
                  .article-content h3,
                  .article-content h4,
                  .article-content h5,
                  .article-content h6 {
                    color: #111827;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.3;
                  }
                  .article-content h1 { 
                    font-size: 2.5rem; 
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    padding-bottom: 0.5rem;
                  }
                  .article-content h2 { 
                    font-size: 2rem; 
                    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
                    padding-bottom: 0.5rem;
                  }
                  .article-content h3 { 
                    font-size: 1.5rem; 
                  }
                  .article-content h4 { 
                    font-size: 1.25rem; 
                  }
                  .article-content p {
                    color: #4b5563;
                    margin-bottom: 1.5rem;
                    line-height: 1.875rem;
                    font-size: 1.125rem;
                  }
                  .article-content a {
                color: #7c3aed;
                text-decoration: none;
                font-weight: 500;
                border-bottom: 1px solid rgba(124, 58, 237, 0.3);
                transition: all 0.2s ease;
              }
              .article-content a:hover {
                color: #6d28d9;
                border-bottom-color: #6d28d9;
              }
              .article-content strong {
                color: #111827;
                font-weight: 600;
              }
              .article-content em {
                color: #4b5563;
                font-style: italic;
              }
              .article-content ul,
              .article-content ol {
                color: #4b5563;
                margin-left: 1.5rem;
                margin-bottom: 1.5rem;
                padding-left: 1rem;
              }
              .article-content ul {
                list-style-type: disc;
              }
              .article-content ol {
                list-style-type: decimal;
              }
              .article-content li {
                margin-bottom: 0.75rem;
                line-height: 1.75rem;
              }
              .article-content li::marker {
                color: #7c3aed;
              }
              .article-content blockquote {
                color: #4b5563;
                border-left: 4px solid #8b5cf6;
                padding-left: 1.5rem;
                padding-right: 1rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                margin: 2rem 0;
                font-style: italic;
                background: rgba(139, 92, 246, 0.05);
                border-radius: 0 0.5rem 0.5rem 0;
              }
              .article-content img {
                border-radius: 0.75rem;
                margin: 2.5rem auto;
                max-width: 100%;
                height: auto;
                display: block;
              }
              .article-content code {
                color: #b45309;
                background-color: #fef3c7;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-size: 0.9em;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                border: 1px solid #fde68a;
              }
              .article-content pre {
                background: #1f2937;
                color: #e5e7eb;
                padding: 1.5rem;
                border-radius: 0.75rem;
                overflow-x: auto;
                margin: 2rem 0;
                border: 1px solid rgba(139, 92, 246, 0.2);
              }
              .article-content pre code {
                background-color: transparent;
                padding: 0;
                border: none;
                color: inherit;
              }
              .article-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
                border-radius: 0.5rem;
                overflow: hidden;
              }
              .article-content table th,
              .article-content table td {
                border: 1px solid #e5e7eb;
                padding: 1rem;
                text-align: left;
              }
              .article-content table th {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
                color: #111827;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.875rem;
                letter-spacing: 0.05em;
              }
              .article-content table tr:nth-child(even) {
                background-color: #f9fafb;
              }
              .article-content table tr:hover {
                background-color: rgba(139, 92, 246, 0.05);
              }
              .article-content hr {
                border: none;
                border-top: 2px solid rgba(139, 92, 246, 0.3);
                margin: 3rem 0;
              }
            `}</style>

                {/* Journal Information */}
                {currentArticle.type === 'journal' && (
                  <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Journal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {currentArticle.journalName && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Journal</span>
                          <p className="text-gray-900 font-semibold mt-2">{currentArticle.journalName}</p>
                        </div>
                      )}
                      {currentArticle.journalVolume && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Volume</span>
                          <p className="text-gray-900 font-semibold mt-2">{currentArticle.journalVolume}</p>
                        </div>
                      )}
                      {currentArticle.journalIssue && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Issue</span>
                          <p className="text-gray-900 font-semibold mt-2">{currentArticle.journalIssue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DOI */}
                {currentArticle.doi && (
                  <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-wide block mb-1">Digital Object Identifier</span>
                        <a
                          href={`https://doi.org/${currentArticle.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-2 font-mono text-sm transition-colors"
                        >
                          {currentArticle.doi}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {currentArticle.keywords && currentArticle.keywords.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {currentArticle.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-300 hover:border-purple-400 transition-colors"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Co-Authors */}
                {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Co-Authors
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentArticle.coAuthors.map((coAuthor, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {coAuthor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {currentArticle.references && currentArticle.references.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      References
                    </h3>
                    <ol className="space-y-4 text-gray-700">
                      {currentArticle.references.map((reference, index) => (
                        <li key={index} className="pl-8 relative">
                          <span className="absolute left-0 top-0 text-purple-600 font-semibold">{index + 1}.</span>
                          <p className="leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{reference}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Share Section */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-purple-600" />
                    Share Article
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center justify-center gap-2 p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 rounded-lg text-[#1877F2] transition-all border border-[#1877F2]/30 hover:border-[#1877F2]/50 group"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 rounded-lg text-[#1DA1F2] transition-all border border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 group"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center justify-center gap-2 p-3 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 rounded-lg text-[#0077B5] transition-all border border-[#0077B5]/30 hover:border-[#0077B5]/50 group"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all border group ${
                        copied 
                          ? 'bg-green-100 border-green-300 hover:bg-green-200 text-green-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                      aria-label="Copy link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Details</h3>
                  <div className="space-y-4">
                    {currentArticle.publicationDate && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-500 text-sm">Published</span>
                        <span className="text-gray-900 font-medium">{formatDate(currentArticle.publicationDate)}</span>
                      </div>
                    )}
                    {readingTime > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-500 text-sm">Reading Time</span>
                        <span className="text-gray-900 font-medium">{readingTime} min</span>
                      </div>
                    )}
                    {currentArticle.views !== undefined && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-500 text-sm">Views</span>
                        <span className="text-gray-900 font-medium">{currentArticle.views.toLocaleString()}</span>
                      </div>
                    )}
                    {currentArticle.type && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-500 text-sm">Type</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeConfig.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Card */}
                {currentArticle.author && (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 ? 'Authors' : 'Author'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-lg">
                            {currentArticle.author}
                          </p>
                          <p className="text-gray-600 text-sm">Main Author</p>
                        </div>
                      </div>
                      {currentArticle.coAuthors && currentArticle.coAuthors.length > 0 && (
                        <div className="pt-3 border-t border-purple-200">
                          <p className="text-gray-700 font-medium text-sm mb-2">Co-Authors:</p>
                          <div className="space-y-2">
                            {currentArticle.coAuthors.map((coAuthor, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-gray-700 font-medium text-sm">
                                  {coAuthor}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {currentArticle.relatedArticles && currentArticle.relatedArticles.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                  Related Articles
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArticle.relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle._id}
                    href={`/article/${relatedArticle.slug || relatedArticle._id}`}
                    className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mt-4">
                      <span>Read More</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>

        <PublicFooter />
      </div>
    </>
  );
}
