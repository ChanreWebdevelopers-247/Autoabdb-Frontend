import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const parsePercent = (val) => {
  if (val == null || val === '') return null;
  const toNum = (n) => (n > 0 && n <= 1 ? n * 100 : n);
  if (typeof val === 'number') return toNum(val);
  const s = String(val).trim();
  const rangeMatch = s.match(/^[~\s]*(\d+(?:\.\d+)?)\s*[-\u2013–]\s*(\d+(?:\.\d+)?)\s*%?\s*$/i);
  if (rangeMatch) return toNum((parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2);
  const numMatch = s.match(/[~\s]*(\d+(?:\.\d+)?)\s*%?/);
  return numMatch ? toNum(parseFloat(numMatch[1])) : null;
};

export default function NetworkGraph({ antibodyName, data, onBack }) {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setSelectedDisease(null);
  }, [antibodyName]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateScale = () => {
      const size = Math.min(el.offsetWidth || 840, el.offsetHeight || 840);
      setScale(Math.min(1, size / 840));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const diseaseGroups = useMemo(() => {
    const groups = {};
    data.forEach((item) => {
      const raw = item.raw ?? {};
      const disease = raw.Disease || raw.disease || 'Unknown';
      const assocRaw = raw['Disease Association (% percentage)'] ?? raw['Disease Association'];
      const assoc = parsePercent(assocRaw) ?? 5;

      if (!groups[disease]) {
        groups[disease] = { association: assoc, manifestations: [] };
      }
      groups[disease].association = Math.max(groups[disease].association, assoc);

      const maniName =
        item.manifestation ||
        raw['Clinical Manifestation'] ||
        raw['Disease related clinical manifestation'];
      if (maniName) {
        let prevRaw =
          raw['Prevelanse (% percentage)'] ?? raw.Prevelanse ?? raw.Prevalence ?? item.prevalence;
        if (prevRaw == null && typeof raw === 'object') {
          const key = Object.keys(raw).find((k) => /preval/i.test(k));
          if (key) prevRaw = raw[key];
        }
        const prevalence = parsePercent(prevRaw) ?? 50;
        const prevalenceDisplay = prevRaw != null ? String(prevRaw).trim() : `${prevalence}%`;

        const existing = groups[disease].manifestations.find((m) => m.name === maniName);
        if (existing) {
          if (prevalence >= existing.prevalence) {
            existing.prevalence = prevalence;
            existing.prevalenceDisplay = prevalenceDisplay;
          }
        } else {
          groups[disease].manifestations.push({
            name: maniName,
            prevalence,
            prevalenceDisplay,
          });
        }
      }
    });

    return Object.entries(groups).map(([name, v]) => ({
      name,
      association: v.association,
      manifestations: v.manifestations,
    }));
  }, [data]);

  const getColorByAssociation = (assoc) => {
    if (assoc >= 50) return { bg: 'from-purple-500 to-pink-600', border: 'border-purple-400', glow: 'bg-purple-500' };
    if (assoc >= 25) return { bg: 'from-blue-500 to-cyan-600', border: 'border-blue-400', glow: 'bg-blue-500' };
    if (assoc >= 10) return { bg: 'from-emerald-500 to-teal-600', border: 'border-emerald-400', glow: 'bg-emerald-500' };
    return { bg: 'from-slate-400 to-gray-500', border: 'border-slate-400', glow: 'bg-slate-500' };
  };

  const getColorByPrevalence = (prev) => {
    if (prev >= 75) return { bg: 'from-orange-500 to-rose-600', border: 'border-orange-400', glow: 'bg-orange-500' };
    if (prev >= 40) return { bg: 'from-teal-400 to-emerald-500', border: 'border-teal-300', glow: 'bg-teal-400' };
    if (prev >= 20) return { bg: 'from-cyan-400 to-blue-500', border: 'border-cyan-300', glow: 'bg-cyan-400' };
    return { bg: 'from-slate-400 to-slate-500', border: 'border-slate-300', glow: 'bg-slate-400' };
  };

  const diseaseDistance = (p) => {
    const minDist = 70;
    const maxDist = 340;
    const normalizedPercent = Math.min(Math.max(p, 0), 100) / 100;
    return maxDist - normalizedPercent * (maxDist - minDist);
  };

  const manifestationDistance = (p) => {
    const num = Number(p);
    if (Number.isNaN(num) || num < 0) return 200;
    const minDist = 55;
    const maxDist = 270;
    const normalizedPercent = Math.min(num, 100) / 100;
    return maxDist - normalizedPercent * (maxDist - minDist);
  };

  const diseaseNodes = useMemo(() => {
    return diseaseGroups.map((d, i) => {
      const angle = (2 * Math.PI * i) / diseaseGroups.length;
      const dist = diseaseDistance(d.association);
      return {
        ...d,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        angle,
        color: getColorByAssociation(d.association),
      };
    });
  }, [diseaseGroups]);

  const manifestationNodes = useMemo(() => {
    if (!selectedDisease) return [];
    const disease = diseaseGroups.find((d) => d.name === selectedDisease);
    const baseNode = diseaseNodes.find((n) => n.name === selectedDisease);
    if (!disease || !baseNode) return [];

    const maniCount = disease.manifestations.length;
    const outwardAngle = baseNode.angle;
    const arcSpread = (240 * Math.PI) / 180;

    return disease.manifestations.map((m, i) => {
      const angleOffset =
        maniCount > 1 ? (i * arcSpread) / (maniCount - 1) - arcSpread / 2 : 0;
      const angle = outwardAngle + angleOffset;
      const dist = manifestationDistance(m.prevalence);
      return {
        ...m,
        x: baseNode.x + Math.cos(angle) * dist,
        y: baseNode.y + Math.sin(angle) * dist,
        angle,
        color: getColorByPrevalence(m.prevalence),
      };
    });
  }, [selectedDisease, diseaseGroups, diseaseNodes]);

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.button
        onClick={() => (selectedDisease ? setSelectedDisease(null) : onBack?.())}
        className="fixed top-16 sm:top-20 md:top-24 left-3 sm:left-6 md:left-8 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 md:px-5 min-h-[44px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-xl hover:bg-white/20 active:bg-white/20 transition-all group text-white touch-manipulation"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 text-xs sm:text-sm group-hover:scale-110 transition-transform shrink-0">←</span>
        <span className="text-sm sm:text-base font-bold whitespace-nowrap">{selectedDisease ? 'Back to Overview' : 'Back to Results'}</span>
      </motion.button>

      <div
        ref={containerRef}
        className="relative w-full max-w-[840px] flex-1 min-h-0 flex items-center justify-center overflow-hidden self-center"
      >
        <div
          className="relative w-[840px] h-[840px] shrink-0 origin-center"
          style={{ transform: `scale(${scale})` }}
        >
        <motion.div
          className="absolute inset-0"
          animate={{
            x: selectedDisease ? -(diseaseNodes.find((n) => n.name === selectedDisease)?.x || 0) * 0.5 : 0,
            y: selectedDisease ? -(diseaseNodes.find((n) => n.name === selectedDisease)?.y || 0) * 0.5 : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <svg width="840" height="840" viewBox="0 0 840 840" className="absolute inset-0 z-0" style={{ pointerEvents: 'none', overflow: 'visible' }}>
            {diseaseNodes.map((n, i) => (
              <motion.line
                key={`line-${n.name}`}
                x1="420"
                y1="420"
                x2={420 + n.x}
                y2={420 + n.y}
                stroke="#0d9488"
                strokeWidth={selectedDisease === n.name ? '3' : '2'}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: selectedDisease ? (selectedDisease === n.name ? 1 : 0) : 0.8,
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                  delay: selectedDisease ? 0 : i * 0.05,
                }}
              />
            ))}
            {manifestationNodes.map((m, i) => {
              const baseNode = diseaseNodes.find((n) => n.name === selectedDisease);
              return (
                <motion.line
                  key={`mani-line-${m.name}`}
                  x1={420 + (baseNode?.x || 0)}
                  y1={420 + (baseNode?.y || 0)}
                  x2={420 + m.x}
                  y2={420 + m.y}
                  stroke="#14b8a6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{
                    pathLength: { duration: 0.6, delay: 0.2 + i * 0.05, ease: 'easeOut' },
                    opacity: { duration: 0.4 },
                  }}
                />
              );
            })}
          </svg>

          <motion.div
            className={`absolute left-1/2 top-1/2 z-40 ${selectedDisease ? 'cursor-pointer' : ''}`}
            style={{ x: -64, y: -64 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            whileHover={{ scale: selectedDisease ? 1.05 : 1 }}
            whileTap={{ scale: selectedDisease ? 0.95 : 1 }}
            onClick={() => selectedDisease && setSelectedDisease(null)}
          >
            {/* Outer pulse rings - network signal effect */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-full border-2 border-cyan-400/60 pointer-events-none"
                style={{ inset: `-${24 + i * 32}px` }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [0.6, 1.4, 1.4],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeOut',
                }}
              />
            ))}
            {/* Inner glow - breathing effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 rounded-full blur-2xl pointer-events-none"
              animate={{
                opacity: [0.35, 0.65, 0.35],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-black shadow-2xl border-4 border-white/30 overflow-visible"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
                  '0 0 30px rgba(20, 184, 166, 0.6), 0 0 60px rgba(6, 182, 212, 0.35)',
                  '0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="text-center z-10 px-3 flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wider text-white/95 font-bold">Auto</div>
                <div className="text-xs uppercase tracking-wider text-white/95 font-bold -mt-0.5">antibody</div>
                <div className="text-sm font-black leading-tight mt-1">{antibodyName}</div>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {diseaseNodes.map((n, i) => (
              <motion.div
                key={n.name}
                className="absolute left-1/2 top-1/2 cursor-pointer z-20"
                style={{ x: n.x - 56, y: n.y - 56 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: selectedDisease ? (selectedDisease === n.name ? 1 : 0) : 1,
                  opacity: selectedDisease ? (selectedDisease === n.name ? 1 : 0) : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                  delay: selectedDisease ? 0 : i * 0.05,
                }}
                whileHover={{ scale: selectedDisease === n.name || !selectedDisease ? 1.1 : 0, zIndex: 40 }}
                onClick={() => setSelectedDisease(n.name)}
              >
                <div className="relative group">
                  <motion.div
                    className={`absolute inset-0 ${n.color.glow} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}
                    animate={
                      selectedDisease === n.name
                        ? { opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: selectedDisease === n.name ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                  />
                  <div
                    className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${n.color.bg} text-white flex flex-col items-center justify-center shadow-2xl border-2 ${n.color.border} backdrop-blur-md p-3 text-center`}
                  >
                    <p className="text-xs font-bold leading-tight line-clamp-3">{n.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {manifestationNodes.map((m, i) => (
              <motion.div
                key={m.name}
                className="absolute left-1/2 top-1/2 z-30"
                style={{ x: m.x - 56, y: m.y - 56 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="relative group">
                  <div className={`absolute inset-0 ${m.color.glow} rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <div
                    className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${m.color.bg} text-white flex flex-col items-center justify-center shadow-xl border-2 ${m.color.border} p-3 text-center backdrop-blur-md`}
                  >
                    <p className="text-xs font-semibold leading-tight line-clamp-3">{m.name}</p>
                    <span className="text-[11px] font-bold opacity-80 mt-1">{m.prevalenceDisplay ?? `${m.prevalence}%`}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
