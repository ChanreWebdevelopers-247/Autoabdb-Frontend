import React from 'react';
import { Handshake, Building2, Flower2 } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import iaretLogo from '../assets/iaret.png';
import cricr from '../assets/cricr.png';
import ola from '../assets/ola.png';

export default function OurPartners() {
  const partners = [
    {
      name: 'The Immunology & Arthritis Research & Education Trust',
      acronym: 'IARET',
      logo: iaretLogo,
      description: 'The Immunology & Arthritis Research & Education Trust is a humanitarian, social, non-profit, registered organization. IARET is created with the clear idea of catering to the needs of non-affordable in getting specialist care in Immunological and Rheumatological diseases, to promote and conduct relevant research in the field of Immunology & Rheumatology, to undertake awareness programmes both for the primary physicians and general public and also to conduct free camps and clinics to identify new cases and help them to get proper therapy.',
      icon: Flower2,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
    },
    {
      name: 'ChanRe Rheumatology & Immunology Center & Research',
      acronym: 'CRICR',
      logo: cricr,
      description: 'A unique one of its kind hospital in India, dedicated for management of patients suffering from Rheumatic Diseases (Musculoskeletal) and other Immunological diseases. It provides under one roof, a complete care to the patients suffering from Arthritis and other Immunological Diseases such as Immune-Deficiency Disorders, Allergic Disorders and Immuno-haematological disorders including supporting departments of Paediatric Rheumatology and Reproductive Immunology. This center is a tertiary reference facility.',
      icon: Building2,
      color: 'from-blue-400 to-yellow-400',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-yellow-500/20'
    },
    {
      name: 'OLA Foundation',
      acronym: 'OLA',
      logo: ola,
      description: 'As a grant-giving organization, OLA Foundation supports and enables IARET Trust\'s independently led research efforts, facilitating the development of scientific knowledge and research infrastructure in the field of immunology. The funding is intended to assist IARET Trust in advancing its research objectives, building antibody datasets and contributing to broader scientific and public health outcomes.',
      icon: Handshake,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
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
        <title>Our Partners - Autoantibody Database</title>
        <meta name="title" content="Our Partners - Autoantibody Database" />
        <meta name="description" content="Learn about our institutional partners including IARET, CRICR, and OLA Foundation, and how they contribute to advancing autoimmune disease research." />
        <meta name="keywords" content="partners, IARET, CRICR, OLA Foundation, institutional partners, autoimmune research, collaboration, Immunology & Arthritis Research & Education Trust, ChanRe Rheumatology & Immunology Center" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/our-partners" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/our-partners" />
        <meta property="og:title" content="Our Partners - Autoantibody Database" />
        <meta property="og:description" content="Learn about our institutional partners and their contributions to autoimmune disease research." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/our-partners" />
        <meta name="twitter:title" content="Our Partners - Autoantibody Database" />
        <meta name="twitter:description" content="Learn about our institutional partners and their contributions to autoimmune disease research." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />

        {/* Hero Section */}
        <div className="relative z-10 px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 mb-6 sm:mb-8">
                <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-200 font-medium">Institutional Partners</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
                Our
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Partners</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                We are proud to collaborate with leading institutions and organizations dedicated to advancing 
                autoimmune disease research and improving patient care worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8 sm:space-y-10">
              {partners.map((partner, index) => {
                const Icon = partner.icon;
                return (
                  <div 
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                  >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 ${partner.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-center lg:items-start">
                      {/* Logo Section */}
                      <div className="flex-shrink-0 w-full sm:w-64 lg:w-72">
                        <div className={`w-full h-40 sm:h-48 lg:h-56 bg-gradient-to-br  rounded-full flex items-center justify-center p-4 sm:p-6 overflow-hidden`}>
                          {typeof partner.logo === 'string' ? (
                            partner.logo === 'flower' ? (
                              <Flower2 className="w-20 h-20 sm:w-24 sm:h-24 text-white" />
                            ) : partner.logo === 'blue-yellow' ? (
                              <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">CR</div>
                                <div className="text-xl sm:text-2xl font-bold text-yellow-400">ICR</div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-white">OLA</div>
                              </div>
                            )
                          ) : (
                            <div className="relative w-full h-full">
                              <Image 
                                src={partner.logo.src || partner.logo} 
                                alt={partner.name}
                                fill
                                className="object-contain rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center mb-4 sm:mb-5">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${partner.color} rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                              {partner.acronym}
                            </h2>
                          </div>
                        </div>
                        
                        <p className="text-sm sm:text-base lg:text-lg text-purple-200 font-semibold mb-3 sm:mb-4">
                          {partner.name}
                        </p>
                        
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          {partner.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <PublicFooter />

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>
    </>
  );
}
