import React from 'react';
import Head from 'next/head';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

const register = () => {
  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Primary Meta Tags */}
        <title>Register | AutoAb Database</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Register for institutional access to the AutoAb Database platform." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />
        <div className="flex flex-col items-center justify-center p-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Register</h1>
              <p className="text-gray-300 text-sm">Register for institutional access to the AutoAb Database platform.</p>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    </>
  )
}

export default register