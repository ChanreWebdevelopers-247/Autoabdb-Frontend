'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen bg-gradient-to-br from-[#51d0de]/30 via-[#d9d9d9] to-[#bf4aa8]/30">
        <PublicHeader />

        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-20 pb-16 sm:pb-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 mb-8">
              <FlaskConical className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">
                Clinical Manifestation Explorer
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Explore autoantibodies,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                diseases & manifestations
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
              Search by autoantibody name, browse disease associations, and visualize clinical
              manifestations—all in one place.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-2xl mx-auto mb-6">
              <BiomarkerSearch onViewModeChange={setIsGraphView} initialQuery={typeof initialSearch === 'string' ? initialSearch : ''} autoOpenAntibody={autoOpenAntibody} backToIndex={!!autoOpenAntibody} />
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-sm text-slate-600">
              Try{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/80 font-mono text-xs text-slate-700 border border-slate-200">
                Anti-Ro52
              </kbd>{' '}
              or upload Excel for bulk search
            </motion.p>
          </div>

          <motion.div className="max-w-4xl mx-auto px-4 pb-20 mt-12" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }} initial="initial" whileInView="animate" viewport={{ once: true }}>
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
                <motion.div
                  key={i}
                  variants={{ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60"
                >
                  <item.icon className="h-6 w-6 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {!isGraphView && <PublicFooter />}

        {/* Animated background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </>
  );
}
