'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BiomarkerSearch from '@/components/biomarker/BiomarkerSearch';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import { FlaskConical, Zap, Shield } from 'lucide-react';

export default function BiomarkersPage() {
  const router = useRouter();
  const initialSearch = router.query.search ?? '';
  const autoOpenAntibody = typeof router.query.antibody === 'string' ? router.query.antibody.trim() : '';
  const [isGraphView, setIsGraphView] = useState(false);
  return (
    <>
      <Head>
        <title>Clinical Manifestation Explorer | AutoAb Database</title>
        <meta
          name="description"
          content="Explore autoantibodies, diseases & clinical manifestations with interactive network visualization"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <PublicHeader />

        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-20 pb-16 sm:pb-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <FlaskConical className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Clinical Manifestation Explorer
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Explore autoantibodies,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                diseases & manifestations
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
              Search by autoantibody name, browse disease associations, and visualize clinical
              manifestations—all in one place.
            </p>

            <div className="w-full max-w-2xl mx-auto mb-6">
              <BiomarkerSearch onViewModeChange={setIsGraphView} initialQuery={typeof initialSearch === 'string' ? initialSearch : ''} autoOpenAntibody={autoOpenAntibody} backToIndex={!!autoOpenAntibody} />
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Try{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-gray-300">
                Anti-Ro52
              </kbd>{' '}
              or upload Excel for bulk search
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-4 pb-20 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Instant search',
                  desc: 'Type to find biomarkers in real time',
                },
                {
                  icon: Shield,
                  title: 'Association mapping',
                  desc: 'See disease links with strength indicators',
                },
                {
                  icon: FlaskConical,
                  title: 'Clinical data',
                  desc: 'Prevalence & manifestation details',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <item.icon className="h-6 w-6 text-blue-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isGraphView && <PublicFooter />}
      </div>
    </>
  );
}
