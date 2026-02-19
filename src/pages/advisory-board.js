import React from 'react';
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
  ]

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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />

        {/* Hero Section */}
        <div className="relative pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/20">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">Our Expert Advisors</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Advisory <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Board</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Our distinguished advisory board brings together leading experts in autoimmune diseases,
              clinical immunology, and research to guide the development and curation of the AutoAb Database.
            </p>
          </div>
        </div>

        {/* Advisory Board Members Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisoryMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2"
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
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ring-4 ring-slate-900/50">
                      <Award className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-300 font-semibold text-xs mb-1.5">
                      {member.title}
                    </p>
                    {member.credentials && (
                      <p className="text-gray-400 text-xs font-medium">
                        {member.credentials}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-4 w-full">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Expertise</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {member.expertise.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-gray-200 rounded-full text-xs font-medium border border-white/20 hover:border-purple-400/50 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-white/10 w-full justify-center">
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-blue-600/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

<div>

</div>
        <div className="flex mx-auto justify-center max-w-md items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/20">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Our Team</span>
        </div>

        {/* Team Members Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2"
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
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ring-4 ring-slate-900/50">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-300 font-semibold text-xs mb-1.5">
                      {member.title}
                    </p>
                    {member.credentials && (
                      <p className="text-gray-400 text-xs font-medium">
                        {member.credentials}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-4 w-full">
                    {/* <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Expertise</span>
                    </div> */}
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {member.expertise.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-gray-200 rounded-full text-xs font-medium border border-white/20 hover:border-purple-400/50 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-white/10 w-full justify-center">
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-blue-600/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                    <button
                      className="w-9 h-9 bg-white/10 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-all duration-300 group/icon hover:scale-110"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4 text-gray-400 group-hover/icon:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Advisory Board Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-10 sm:p-12 border border-white/20">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Our Advisory Board&apos;s <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Role</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our advisory board plays a crucial role in ensuring the accuracy, relevance, and clinical utility
                of the AutoAb Database. They provide expert guidance on data curation, validation methodologies,
                and strategic direction to maintain the highest standards of scientific rigor and clinical relevance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Expert Validation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ensuring all data entries meet the highest standards of scientific accuracy
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Strategic Guidance</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Providing insights on emerging research trends and clinical needs
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Community Leadership</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Representing the interests of researchers and clinicians worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        <PublicFooter />

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </>
  );
}
