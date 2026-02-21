import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, BookOpen, HelpCircle, ArrowRight, ChevronDown, ChevronUp, Target, FileText, BarChart3, Users, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function Documentation() {
  const [openSections, setOpenSections] = useState({
    gettingStarted: true,
    search: false,
    filters: false,
    results: false,
    dataStructure: false,
    faq: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'gettingStarted',
      title: 'Getting Started',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Accessing the Database</h3>
            <p className="text-slate-600 mb-3">
              The AutoAb Database is available for institutional use. To get started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 ml-4">
              <li>Register for an account using your institutional email</li>
              <li>Wait for account approval (typically within 24-48 hours)</li>
              <li>Sign in and navigate to the Search page</li>
              <li>Start exploring autoantibodies, diseases, and their associations</li>
            </ol>
          </div>
          <div className="bg-blue-500/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-slate-700 text-sm">
              <strong>Note:</strong> Account registration is restricted to institutional users. 
              Please use your official institutional email address when registering.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'search',
      title: 'Search Functionality',
      icon: Search,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic Search</h3>
            <p className="text-slate-600 mb-3">
              The search bar supports intelligent auto-complete with synonym recognition and fuzzy matching. 
              You can search across multiple fields:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li><strong>Disease names:</strong> e.g., &quot;Systemic Lupus Erythematosus&quot;, &quot;SLE&quot;, &quot;Lupus&quot;</li>
              <li><strong>Autoantibody names:</strong> e.g., &quot;Anti-dsDNA&quot;, &quot;Rheumatoid Factor&quot;, &quot;ANCA&quot;</li>
              <li><strong>Autoantigen names:</strong> e.g., &quot;Ro52&quot;, &quot;SSA&quot;, &quot;Jo-1&quot;</li>
              <li><strong>Epitopes:</strong> Specific epitope sequences or names</li>
              <li><strong>UniProt IDs:</strong> Protein accession numbers</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Search Suggestions</h3>
            <p className="text-slate-600 mb-3">
              As you type, the system provides grouped suggestions organized by category:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li>Diseases</li>
              <li>Autoantibodies</li>
              <li>Autoantigens</li>
              <li>Epitopes</li>
              <li>Types</li>
              <li>UniProt IDs</li>
            </ul>
            <p className="text-slate-600 mt-3">
              Click on any suggestion to automatically filter results and update dependent filter options.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'filters',
      title: 'Using Filters',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Filter Categories</h3>
            <p className="text-slate-600 mb-3">
              The database provides six primary filter categories:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-slate-900 font-semibold">Autoantibody</span>
                </div>
                <p className="text-slate-600 text-sm">Filter by autoantibody name or synonym</p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-slate-900 font-semibold">Disease</span>
                </div>
                <p className="text-slate-600 text-sm">Filter by disease name or condition</p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Database className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-slate-900 font-semibold">Autoantigen</span>
                </div>
                <p className="text-slate-600 text-sm">Filter by antigen name or target</p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-slate-900 font-semibold">Epitope</span>
                </div>
                <p className="text-slate-600 text-sm">Filter by epitope sequence or structure</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Dependent Filtering</h3>
            <p className="text-slate-600 mb-3">
              Filters are interconnected. When you select a filter, dependent filters automatically update 
              to show only relevant options:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li>Selecting a <strong>Disease</strong> filters available autoantibodies, autoantigens, and epitopes</li>
              <li>Selecting an <strong>Autoantibody</strong> filters associated diseases and autoantigens</li>
              <li>Selecting an <strong>Autoantigen</strong> filters associated diseases and autoantibodies</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Clearing Filters</h3>
            <p className="text-slate-600">
              Use the &quot;Clear All Filters&quot; button to reset all filters and return to viewing all entries.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'results',
      title: 'Understanding Results',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">View Modes</h3>
            <p className="text-slate-600 mb-3">
              Results can be displayed in three different view modes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li><strong>Hierarchical View:</strong> Organizes results in a tree structure showing relationships</li>
              <li><strong>Card View:</strong> Displays entries as individual cards with key information</li>
              <li><strong>Table View:</strong> Shows entries in a tabular format for easy comparison</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Result Information</h3>
            <p className="text-slate-600 mb-3">
              Each result entry includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li>Disease name and associations</li>
              <li>Autoantibody details and synonyms</li>
              <li>Autoantigen information</li>
              <li>Epitope data and prevalence</li>
              <li>UniProt ID and protein type</li>
              <li>Clinical applications (screening, confirmation, monitoring)</li>
              <li>Performance metrics (sensitivity, specificity, predictive values)</li>
              <li>References and citations</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pagination</h3>
            <p className="text-slate-600">
              Results are paginated with 20 entries per page. Use the pagination controls at the bottom 
              to navigate through multiple pages of results.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'dataStructure',
      title: 'Data Structure',
      icon: Database,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Core Entities</h3>
            <p className="text-slate-600 mb-3">
              The database organizes information around these core entities:
            </p>
            <div className="space-y-3">
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <h4 className="text-slate-900 font-semibold mb-2">Disease</h4>
                <p className="text-slate-600 text-sm">
                  Autoimmune and related conditions associated with autoantibodies. Includes ICD codes 
                  and clinical presentation information.
                </p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <h4 className="text-slate-900 font-semibold mb-2">Autoantibody</h4>
                <p className="text-slate-600 text-sm">
                  Antibodies that target self-antigens. Includes synonyms, isotypes, and molecular characteristics.
                </p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <h4 className="text-slate-900 font-semibold mb-2">Autoantigen</h4>
                <p className="text-slate-600 text-sm">
                  Self-antigens targeted by autoantibodies. Includes UniProt IDs, protein types, and structural information.
                </p>
              </div>
              <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
                <h4 className="text-slate-900 font-semibold mb-2">Epitope</h4>
                <p className="text-slate-600 text-sm">
                  Specific regions of autoantigens recognized by autoantibodies. Includes sequence data 
                  and binding characteristics.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Clinical Data</h3>
            <p className="text-slate-600 mb-3">
              Each entry includes comprehensive clinical and diagnostic information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li>Diagnostic applications (screening, confirmation, monitoring)</li>
              <li>Performance metrics (sensitivity, specificity, PPV, NPV)</li>
              <li>Reference ranges and cutoff values</li>
              <li>Association with disease activity</li>
              <li>Cross-reactivity patterns</li>
              <li>Pathogenesis involvement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: Who can access the database?</h4>
            <p className="text-slate-600 text-sm">
              A: The database is available for institutional use. Users must register with an 
              institutional email address and receive approval before accessing the database.
            </p>
          </div>
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: How do I search for a specific autoantibody?</h4>
            <p className="text-slate-600 text-sm">
              A: Use the search bar or select &quot;Autoantibody&quot; from the filters. The system supports 
              synonyms and fuzzy matching, so you can search using various names or spellings.
            </p>
          </div>
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: Can I export data from the database?</h4>
            <p className="text-slate-600 text-sm">
              A: Data export functionality is available for authenticated users. Please contact 
              support for more information about export formats and limitations.
            </p>
          </div>
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: How often is the database updated?</h4>
            <p className="text-slate-600 text-sm">
              A: The database is regularly updated with new entries and associations. Updates are 
              performed by the curation team based on published literature and verified sources.
            </p>
          </div>
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: What should I do if I find missing information?</h4>
            <p className="text-slate-600 text-sm">
              A: We welcome suggestions for missing information. Please contact support with details 
              about the missing data, and our team will review and consider adding it to the database.
            </p>
          </div>
          <div className="bg-[#d9d9d9]/30 p-4 rounded-lg">
            <h4 className="text-slate-900 font-semibold mb-2">Q: Is there an API available?</h4>
            <p className="text-slate-600 text-sm">
              A: API access is available for institutional users. Please contact support to request 
              API credentials and documentation.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Primary Meta Tags */}
        <title>Documentation & User Guide | AutoAb Database</title>
        <meta name="title" content="Documentation & User Guide | AutoAb Database" />
        <meta name="description" content="Complete documentation and user guide for the AutoAb Database. Learn how to search, filter, and explore autoantibody data for research and clinical needs." />
        <meta name="keywords" content="documentation, user guide, autoantibody database, how to use, search guide, filter guide, database tutorial, help documentation" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/documentation" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/documentation" />
        <meta property="og:title" content="Documentation & User Guide | AutoAb Database" />
        <meta property="og:description" content="Complete documentation and user guide for the AutoAb Database. Learn how to search, filter, and explore autoantibody data." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/documentation" />
        <meta name="twitter:title" content="Documentation & User Guide | AutoAb Database" />
        <meta name="twitter:description" content="Complete documentation and user guide for the AutoAb Database. Learn how to search, filter, and explore autoantibody data." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#51d0de]/30 via-[#d9d9d9] to-[#bf4aa8]/30">
        <PublicHeader />

        {/* Header Section */}
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center space-x-2 bg-[#d9d9d9]/50 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 mb-6 border border-slate-200/40">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-xs sm:text-sm text-slate-700">Complete Documentation</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
              Documentation & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">User Guide</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Learn how to effectively use the AutoAb Database to search, filter, and explore 
              autoantibody data for your research and clinical needs.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <motion.div className="relative z-10 px-4 sm:px-6 pb-12 sm:pb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="space-y-4" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.08 } } }} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {sections.map((section) => {
              const Icon = section.icon;
              const isOpen = openSections[section.id];
              return (
                <motion.div key={section.id} variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="bg-[#d9d9d9]/40 backdrop-blur-lg border border-slate-200/40 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#d9d9d9]/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 py-6 border-t border-slate-200/60">
                      {section.content}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Links */}
          <motion.div className="mt-12 bg-[#d9d9d9]/40 backdrop-blur-sm border border-slate-200/40 rounded-2xl p-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Quick Links</h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.1 } } }} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <motion.div variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }}>
              <Link href="/dashboard/disease/disease" className="bg-[#d9d9d9]/40 hover:bg-[#d9d9d9]/60 border border-slate-200/40 rounded-lg p-4 text-center transition-all group block">
                <Search className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-slate-900 font-semibold mb-1">Start Searching</h3>
                <p className="text-slate-600 text-sm">Explore the database</p>
              </Link>
              </motion.div>
              <motion.div variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }}>
              <Link href="/auth/register" className="bg-[#d9d9d9]/40 hover:bg-[#d9d9d9]/60 border border-slate-200/40 rounded-lg p-4 text-center transition-all group block">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-slate-900 font-semibold mb-1">Get Started</h3>
                <p className="text-slate-600 text-sm">Register for access</p>
              </Link>
              </motion.div>
              <motion.div variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }}>
              <Link href="/auth/login" className="bg-[#d9d9d9]/40 hover:bg-[#d9d9d9]/60 border border-slate-200/40 rounded-lg p-4 text-center transition-all group block">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-slate-900 font-semibold mb-1">Sign In</h3>
                <p className="text-slate-600 text-sm">Access your account</p>
              </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <PublicFooter variant="documentation" />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
        <motion.div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
        <motion.div className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
      </div>
      </div>
    </>
  );
}

