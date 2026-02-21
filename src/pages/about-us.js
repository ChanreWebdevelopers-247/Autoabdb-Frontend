import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, Database, Shield, TrendingUp, Zap, CheckCircle, Mail, Globe, Building2 } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import logo from '../assets/logo.png';

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: "Scientific Rigor",
      description: "We maintain the highest standards of data curation and validation, ensuring all information is evidence-based and peer-reviewed."
    },
    {
      icon: Database,
      title: "Comprehensive Coverage",
      description: "Our database encompasses a wide range of autoantibodies, diseases, and associations to support diverse research needs."
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "We regularly update our database with the latest research findings and welcome contributions from the scientific community."
    },
    {
      icon: Heart,
      title: "Community Focus",
      description: "Built for researchers, clinicians, and institutions worldwide to advance autoimmune disease research and patient care."
    }
  ];

  const missionPoints = [
    "Advance autoimmune disease research through comprehensive data access",
    "Support precision diagnostics and personalized medicine approaches",
    "Facilitate biomarker discovery and validation",
    "Enable data-driven clinical decision-making",
    "Promote collaboration within the scientific community"
  ];

  const features = [
    {
      icon: Zap,
      title: "Intelligent Search",
      description: "Advanced search capabilities with auto-complete and fuzzy matching"
    },
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "Extensive collection of autoantibodies, diseases, and associations"
    },
    {
      icon: Target,
      title: "Clinical Relevance",
      description: "Curated data with diagnostic and prognostic information"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Validated entries with evidence levels and source credibility"
    }
  ];

  const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const staggerItem = { initial: { opacity: 0, y: 30, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Primary Meta Tags */}
        <title>About Us - Autoantibody Database</title>
        <meta name="title" content="About Us - Autoantibody Database" />
        <meta name="description" content="Learn about the Autoantibody Database mission, team, and commitment to advancing autoimmune disease research through comprehensive data curation and accessibility." />
        <meta name="keywords" content="about us, autoantibody database, autoimmune research, scientific database, research platform, mission, values, objectives" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/about-us" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/about-us" />
        <meta property="og:title" content="About Us - Autoantibody Database" />
        <meta property="og:description" content="Learn about the Autoantibody Database mission, team, and commitment to advancing autoimmune disease research." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/about-us" />
        <meta name="twitter:title" content="About Us - Autoantibody Database" />
        <meta name="twitter:description" content="Learn about the Autoantibody Database mission, team, and commitment to advancing autoimmune disease research." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#51d0de]/30 via-[#d9d9d9] to-[#bf4aa8]/30">
        <PublicHeader />

        {/* Hero Section */}
        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 mb-6 border border-slate-200/60">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm text-slate-700">About Our Mission</span>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Image src={logo} alt="Autoantibody Database" width={200} height={200} className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6" />
              </motion.div>
              
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                About
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AutoAb Database</span>
              </motion.h1>
              
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
                We are dedicated to advancing autoimmune disease research through comprehensive data curation, 
                intelligent search capabilities, and accessible knowledge sharing for the global scientific community.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-12" whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="text-center mb-8 sm:mb-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  To provide researchers, clinicians, and institutions worldwide with the most comprehensive, 
                  validated, and accessible database of autoantibodies and their disease associations, 
                  enabling breakthrough discoveries in autoimmune disease research and precision medicine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
                {missionPoints.map((point, index) => (
                  <div key={index} className="flex items-start bg-white/60 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-600">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* What We Do Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What We Do
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
                Our platform provides comprehensive tools and data to support your research and clinical needs
              </p>
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={index} variants={staggerItem} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-xl p-6 hover:bg-white/90 transition-all">
                    <motion.div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Our Values Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Our Values
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
                  The principles that guide our work and commitment to the scientific community
                </p>
              </div>

              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div key={index} variants={staggerItem} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white/60 rounded-xl p-6 hover:bg-white/80 transition-all">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Purpose & Objectives Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12" whileHover={{ scale: 1.005 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Purpose & Objectives
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
                  Understanding the critical role of autoantibody databases in modern immunology research
                </p>
              </div>

              <div className="space-y-8 sm:space-y-12">
                <div>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Purpose</h3>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                    The primary purpose of autoantibody databases is to advance the understanding, diagnosis, 
                    and management of autoimmune diseases by creating comprehensive knowledge bases through the 
                    collation of human autoantibody data for clinical and research use. We support precision 
                    diagnostics by linking autoantibodies to disease phenotypes, subtypes, and clinical outcomes, 
                    while guiding assay development and providing a foundation for research into molecular mechanisms of autoimmunity.
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Key Objectives</h3>
                  </div>
                  <ul className="space-y-3 sm:space-y-4 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base leading-relaxed">
                        Aggregating published autoantibody–antigen–disease associations into a structured, accessible format
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base leading-relaxed">
                        Providing detailed annotations of autoantigens and autoantibodies, including disease links, 
                        literature references, molecular features, and epitope information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base leading-relaxed">
                        Offering intuitive tools for browsing, querying, downloading, and integrating data into 
                        both research and clinical workflows
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base leading-relaxed">
                        Supporting improved diagnostic accuracy, clinical decision-making, and the translation 
                        of basic immunology discoveries into patient benefit
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contribution Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="bg-white/80 border border-slate-200/60 rounded-xl p-6 sm:p-8" whileHover={{ scale: 1.005 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-black">Our Commitment</h3>
              </div>
              <p className="text-base sm:text-lg text-black leading-relaxed mb-4">
                The team has worked within its limitations and made every effort to include the most significant 
                and relevant autoantibodies. As newer autoantibodies, associations, and epitopes continue to emerge, 
                some may not yet be included, and we welcome any suggestions if you find missing information.
              </p>
              <p className="text-base sm:text-lg text-black leading-relaxed">
                Intellectual and constructive feedback to further improve the database is greatly appreciated. 
                We are committed to continuous improvement and collaboration with the scientific community.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl sm:rounded-3xl p-8 sm:p-12" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                  Have questions, suggestions, or feedback? We&apos;d love to hear from you.
                </p>
              </div>

              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <motion.div variants={staggerItem} whileHover={{ y: -6 }} className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Email Us</h3>
                  <p className="text-slate-600 text-sm">
                    <Link href="/auth/login" className="hover:text-slate-900 transition-colors text-blue-600">
                      Contact Support
                    </Link>
                  </p>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={{ y: -6 }} className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Institutional Access</h3>
                  <p className="text-slate-600 text-sm">
                    <Link href="/auth/register" className="hover:text-slate-900 transition-colors text-blue-600">
                      Request Access
                    </Link>
                  </p>
                </motion.div>

                <motion.div variants={staggerItem} whileHover={{ y: -6 }} className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Documentation</h3>
                  <p className="text-slate-600 text-sm">
                    <Link href="/documentation" className="hover:text-slate-900 transition-colors text-blue-600">
                      View Docs
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl sm:rounded-3xl p-8 sm:p-12" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 px-4">
                Join the global research community using our comprehensive autoantibody database
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link 
                  href="/auth/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 sm:px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Register for Access
                </Link>
                <Link 
                  href="/dashboard/disease/disease" 
                  className="border border-slate-300 text-slate-800 px-6 py-3 sm:px-8 rounded-xl hover:bg-white/80 transition-all"
                >
                  Explore Database
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <PublicFooter />

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
