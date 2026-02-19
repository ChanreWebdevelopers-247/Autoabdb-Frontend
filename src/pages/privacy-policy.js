import React from 'react';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function PrivacyPolicy() {

  const sections = [
    {
      title: 'Introduction',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            The AutoAb Database (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our database platform and services.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using the AutoAb Database, you agree to the collection and use of information 
            in accordance with this Privacy Policy. If you do not agree with our policies and practices, 
            please do not use our services.
          </p>
        </div>
      )
    },
    {
      title: 'Information We Collect',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
            <p className="text-gray-300 mb-3">
              When you register for an account, we may collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Name and institutional affiliation</li>
              <li>Email address (institutional email required)</li>
              <li>Professional title and department</li>
              <li>Institution name and address</li>
              <li>Account credentials (password, encrypted)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Usage Information</h3>
            <p className="text-gray-300 mb-3">
              We automatically collect certain information when you use our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Search queries and filter preferences</li>
              <li>Pages visited and time spent on pages</li>
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Access times and dates</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Cookies and Tracking Technologies</h3>
            <p className="text-gray-300">
              We use cookies and similar tracking technologies to track activity on our platform and store 
              certain information. Cookies are files with a small amount of data that may include an 
              anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate 
              when a cookie is being sent.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            We use the collected information for various purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li><strong>Account Management:</strong> To create and manage your account, verify your identity, and process your registration</li>
            <li><strong>Service Delivery:</strong> To provide, maintain, and improve our database services</li>
            <li><strong>Communication:</strong> To send you important updates, notifications, and respond to your inquiries</li>
            <li><strong>Analytics:</strong> To analyze usage patterns and improve user experience</li>
            <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
            <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
            <li><strong>Research:</strong> To conduct anonymized research and statistical analysis</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Information Sharing and Disclosure',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your 
            information only in the following circumstances:
          </p>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Service Providers</h4>
              <p className="text-gray-300 text-sm">
                We may share information with third-party service providers who perform services on our 
                behalf, such as hosting, data analysis, and customer support. These providers are 
                contractually obligated to protect your information.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Legal Requirements</h4>
              <p className="text-gray-300 text-sm">
                We may disclose your information if required by law, court order, or governmental 
                authority, or to protect our rights, property, or safety.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Business Transfers</h4>
              <p className="text-gray-300 text-sm">
                In the event of a merger, acquisition, or sale of assets, your information may be 
                transferred as part of that transaction.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Anonymized Data</h4>
              <p className="text-gray-300 text-sm">
                We may share aggregated, anonymized data that cannot identify individual users for 
                research and statistical purposes.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Data Security',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information on a need-to-know basis</li>
            <li>Secure password storage using industry-standard hashing algorithms</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
          <div className="bg-blue-500/20 border-l-4 border-blue-400 p-4 rounded-r-lg mt-4">
            <p className="text-gray-200 text-sm">
              <strong>Important:</strong> While we strive to protect your personal information, no method 
              of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee 
              absolute security, but we are committed to maintaining the highest standards of data protection.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Your Rights and Choices',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed mb-4">
            You have certain rights regarding your personal information:
          </p>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Access and Correction</h4>
              <p className="text-gray-300 text-sm">
                You can access and update your account information at any time through your account settings.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Data Deletion</h4>
              <p className="text-gray-300 text-sm">
                You may request deletion of your account and associated data by contacting us. We will 
                process your request in accordance with applicable laws.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Opt-Out</h4>
              <p className="text-gray-300 text-sm">
                You can opt out of non-essential communications, such as newsletters and promotional emails, 
                by updating your preferences or contacting us.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Cookie Preferences</h4>
              <p className="text-gray-300 text-sm">
                You can control cookies through your browser settings. However, disabling cookies may 
                affect the functionality of our services.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Data Retention',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required or permitted by law. 
            When we no longer need your information, we will securely delete or anonymize it.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Account information is retained while your account is active and for a reasonable period 
            after account closure to comply with legal obligations and resolve disputes. Usage data 
            may be retained in anonymized form for analytical purposes.
          </p>
        </div>
      )
    },
    {
      title: 'Children\'s Privacy',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Our services are intended for use by researchers, clinicians, and professionals in 
            institutional settings. We do not knowingly collect personal information from children 
            under the age of 18. If we become aware that we have collected personal information from 
            a child without parental consent, we will take steps to delete that information.
          </p>
        </div>
      )
    },
    {
      title: 'International Data Transfers',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country 
            of residence. These countries may have data protection laws that differ from those in 
            your country. By using our services, you consent to the transfer of your information to 
            these countries.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We ensure that appropriate safeguards are in place to protect your information in accordance 
            with this Privacy Policy and applicable data protection laws.
          </p>
        </div>
      )
    },
    {
      title: 'Changes to This Privacy Policy',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors. We will notify you of any material changes 
            by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We encourage you to review this Privacy Policy periodically to stay informed about how we 
            protect your information. Your continued use of our services after changes are posted 
            constitutes acceptance of the updated Privacy Policy.
          </p>
        </div>
      )
    },
    {
      title: 'Contact Us',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
            practices, please contact us:
          </p>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-2">AutoAb Database Privacy Team</h4>
            <p className="text-gray-300 text-sm mb-2">
              Email: privacy@autoabdb.com
            </p>
            <p className="text-gray-300 text-sm">
              For account-related inquiries, please sign in to your account or contact support through 
              the platform.
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
        <title>Privacy Policy | AutoAb Database</title>
        <meta name="title" content="Privacy Policy | AutoAb Database" />
        <meta name="description" content="Read the AutoAb Database Privacy Policy to understand how we collect, use, disclose, and safeguard your personal information when using our platform." />
        <meta name="keywords" content="privacy policy, data protection, privacy, data security, user privacy, GDPR, data privacy, information security" />
        <meta name="author" content="Autoantibody Database" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://autoabdb.com/privacy-policy" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoabdb.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | AutoAb Database" />
        <meta property="og:description" content="Read the AutoAb Database Privacy Policy to understand how we collect, use, disclose, and safeguard your personal information." />
        <meta property="og:image" content="https://autoabdb.com/logo.png" />
        <meta property="og:site_name" content="Autoantibody Database" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://autoabdb.com/privacy-policy" />
        <meta name="twitter:title" content="Privacy Policy | AutoAb Database" />
        <meta name="twitter:description" content="Read the AutoAb Database Privacy Policy to understand how we collect, use, disclose, and safeguard your personal information." />
        <meta name="twitter:image" content="https://autoabdb.com/logo.png" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />

        {/* Header Section */}
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-200">Privacy & Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6">
              Last Updated: January 2025
            </p>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="relative z-10 px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-12">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-white/10 last:border-b-0 pb-8 last:pb-0">
                  <div className="flex items-start mb-4">
                    <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="ml-5 sm:ml-9">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Privacy Matters</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We are committed to protecting your privacy and ensuring the security of your personal 
                    information. This Privacy Policy outlines our practices and your rights. If you have 
                    any questions or concerns, please don&apos;t hesitate to contact us.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/documentation" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-6 py-3 text-center text-white transition-all"
            >
              View Documentation
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter variant="privacy" />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      </div>
    </>
  );
}

