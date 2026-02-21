import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, GraduationCap, Briefcase, Mail, Linkedin, Globe } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import renukaImg from '../assets/renuka.png';
import vineetaImg from '../assets/vineeta.jpeg';
import chandrashekaraImg from '../assets/chandrashekara.png';
import vinayImg from '../assets/vinay.png';
import KavanaImg from '../assets/Kavana.png';

export default function AdvisoryBoard() {
  const advisoryMembers = [
    {
      name: 'Dr Chandrashekara S',
      title: 'Advisory Board Member',
      credentials: 'MBBS, MD, DM',
      bio: 'Renowned expert in autoimmune diseases and clinical immunology with extensive research experience in autoantibody diagnostics and patient care.',
      expertise: ['Autoimmune Diseases', 'Clinical Immunology', 'Rheumatology'],
      image: chandrashekaraImg // Placeholder for future image
    },
    {
      name: 'Vineeta Shobha',
      title: 'Advisory Board Member',
      credentials: 'MD, DM',
      bio: 'Distinguished clinician and researcher specializing in autoimmune disorders, with a focus on advancing diagnostic methodologies and treatment protocols.',
      expertise: ['Autoimmune Disorders', 'Diagnostic Research', 'Clinical Practice'],
      image: vineetaImg // Placeholder for future image
    },
    {
      name: 'Dr Renuka P',
      title: 'Advisory Board Member',
      credentials: 'MBBS, DCP, DNB',
      bio: 'Leading researcher in immunology and autoantibody research, contributing to groundbreaking discoveries in biomarker identification and disease mechanisms.',
      expertise: ['Immunology Research', 'Biomarker Discovery', 'Molecular Mechanisms'],
      image: renukaImg // Placeholder for future image
    }
  ];
  const teams = [
    {
      name: 'Vinay R Hullabutti ',
      title: 'Team Member',
      credentials: 'M Tech, Research Associate',
      bio: '',
      expertise: [],
      image: vinayImg // Placeholder for future image
    },
    {
      name: 'Kavana B E ',
      title: 'Team Member',
      credentials: 'MSc Biotechnology, Research Associate',
      bio: '',
      expertise: [],
      image: KavanaImg // Placeholder for future image
    },
    // {
    //   name: 'Vinay R Hullabutti ',
    //   title: 'Advisory Board Member',
    //   credentials: 'M Tech, Research Associate',
    //   bio: 'Renowned expert in autoimmune diseases and clinical immunology with extensive research experience in autoantibody diagnostics and patient care.',
    //   expertise: ['Autoimmune Diseases', 'Clinical Immunology', 'Rheumatology'],
    //   image: chandrashekaraImg // Placeholder for future image
    // },
  ];

  // Animation variants (same as index page)
  const staggerContainer = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  const staggerItem = {
    initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Primary Meta Tags */}
        <title>Advisory Board | AutoAb Database</title>
        <meta name="title" content="Advisory Board | AutoAb Database" />
        <meta name="description" content="Meet our distinguished advisory board members who guide the AutoAb Database with their expertise in autoimmune diseases, clinical immunology, and research." />
        <meta name="keywords" content="advisory board, experts, autoimmune diseases, clinical immunology, research advisors, Dr Chandrashekara S, Vineeta Shobha, Dr Renuka P" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/advisory-board" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/advisory-board" />
        <meta property="og:title" content="Advisory Board | AutoAb Database" />
        <meta property="og:description" content="Meet our distinguished advisory board members who guide the AutoAb Database with their expertise in autoimmune diseases, clinical immunology, and research." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/advisory-board" />
        <meta name="twitter:title" content="Advisory Board | AutoAb Database" />
        <meta name="twitter:description" content="Meet our distinguished advisory board members who guide the AutoAb Database with their expertise in autoimmune diseases, clinical immunology, and research." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#51d0de]/30 via-[#d9d9d9] to-[#bf4aa8]/30">
        <PublicHeader />

        {/* Hero Section */}
        <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-violet-200/60"
            >
              <Users className="w-5 h-5 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">Our Expert Advisors</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Advisory <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Board</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Our distinguished advisory board brings together leading experts in autoimmune diseases,
              clinical immunology, and research to guide the development and curation of the AutoAb Database.
            </motion.p>
          </div>
        </div>

        {/* Advisory Board Members Section */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-40px' }}
          >
            {advisoryMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-violet-200/60 hover:border-purple-400/60 transition-all duration-500 group"
              >
                {/* Member Card Content */}
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Round Profile Image */}
                  <div className="relative mb-4">
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 288px, 320px"
                          quality={95}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <Users className="w-14 h-14 text-white/80" />
                        </div>
                      )}
                    </div>
                    {/* Award Badge */}
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ring-4 ring-white/80">
                      <Award className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1.5 group-hover:text-purple-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-violet-600 font-semibold text-xs mb-1.5">
                      {member.title}
                    </p>
                    {member.credentials && (
                      <p className="text-slate-500 text-xs font-medium">
                        {member.credentials}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-slate-600 text-xs mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-4 w-full">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                      <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Expertise</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {member.expertise.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-violet-100 text-slate-700 rounded-full text-xs font-medium border border-violet-200/60 hover:border-purple-400/60 hover:bg-violet-200/80 transition-all"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-slate-200/60 w-full justify-center">
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-blue-400/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-blue-500/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-purple-500/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

<div>

</div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex mx-auto justify-center max-w-md items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-violet-200/60"
        >
          <Users className="w-5 h-5 text-violet-600" />
          <span className="text-sm font-medium text-slate-700">Our Team</span>
        </motion.div>

        {/* Team Members Section */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-40px' }}
          >
            {teams.map((member, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-violet-200/60 hover:border-purple-400/60 transition-all duration-500 group"
              >
                {/* Member Card Content */}
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Round Profile Image */}
                  <div className="relative mb-4">
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 288px, 320px"
                          quality={95}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <Users className="w-14 h-14 text-white/80" />
                        </div>
                      )}
                    </div>
                    {/* Award Badge */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ring-4 ring-white/80">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1.5 group-hover:text-purple-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-violet-600 font-semibold text-xs mb-1.5">
                      {member.title}
                    </p>
                    {member.credentials && (
                      <p className="text-slate-500 text-xs font-medium">
                        {member.credentials}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-slate-600 text-xs mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-4 w-full">
                    {/* <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Expertise</span>
                    </div> */}
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {member.expertise.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-violet-100 text-slate-700 rounded-full text-xs font-medium border border-violet-200/60 hover:border-purple-400/60 hover:bg-violet-200/80 transition-all"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-slate-200/60 w-full justify-center">
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-blue-400/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-blue-500/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-violet-100 hover:bg-purple-500/40 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4 text-slate-600 group-hover/icon:text-slate-900 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* About Advisory Board Section */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20"
          initial={{ opacity: 0, y: 60, scale: 0.95, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 sm:p-12 border border-violet-200/60"
            whileHover={{ scale: 1.01, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Our Advisory Board&apos;s <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Role</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our advisory board plays a crucial role in ensuring the accuracy, relevance, and clinical utility
                of the AutoAb Database. They provide expert guidance on data curation, validation methodologies,
                and strategic direction to maintain the highest standards of scientific rigor and clinical relevance.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-40px' }}
            >
              <motion.div variants={staggerItem} className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-violet-200/60 hover:border-purple-400/60 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-slate-900 font-bold text-lg mb-3">Expert Validation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ensuring all data entries meet the highest standards of scientific accuracy
                </p>
              </motion.div>

              <motion.div variants={staggerItem} className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-violet-200/60 hover:border-purple-400/60 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-slate-900 font-bold text-lg mb-3">Strategic Guidance</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Providing insights on emerging research trends and clinical needs
                </p>
              </motion.div>

              <motion.div variants={staggerItem} className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-violet-200/60 hover:border-purple-400/60 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-slate-900 font-bold text-lg mb-3">Community Leadership</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Representing the interests of researchers and clinicians worldwide
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <PublicFooter />

        {/* Background Elements - Animated blur orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
              x: [0, -40, 0],
              y: [0, 25, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
      </div>
    </>
  );
}
