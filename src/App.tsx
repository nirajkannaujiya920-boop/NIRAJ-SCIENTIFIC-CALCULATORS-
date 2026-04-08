/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator as CalcIcon, 
  RefreshCw, 
  Moon, 
  Sun, 
  Delete, 
  History as HistoryIcon,
  ArrowRightLeft,
  Home as HomeIcon,
  Scale,
  Clock,
  Maximize,
  Box,
  Zap,
  Thermometer,
  Database,
  Percent,
  Tag,
  User,
  ChevronLeft,
  Mic,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Divide,
  Minus,
  Plus,
  Equal,
  X,
  Settings,
  Trash2,
  WifiOff,
  Library,
  Navigation,
  LineChart,
  Play,
  Square,
  ChevronRight,
  Copy,
  Check,
  Footprints,
  Dices,
  StickyNote,
  Info,
  Search,
  Star,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as math from 'mathjs';

type Page = 'home' | 'calculator' | 'converter' | 'gst' | 'discount' | 'bmi' | 'age' | 'math' | 'history' | 'currency' | 'privacy' | 'formulas' | 'tracker' | 'graph' | 'symbols' | 'steps' | 'random' | 'notes' | 'about';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  date: string;
}

const UNIT_LABELS: Record<string, string> = {
  // Categories
  length: "लम्बाई (Length)",
  mass: "तौल (Mass/Weight)",
  time: "समय (Time)",
  area: "क्षेत्रफल (Area)",
  volume: "आयतन (Volume/Capacity)",
  speed: "गति (Speed)",
  data: "डेटा (Data)",
  temperature: "तापमान (Temperature)",
  energy: "ऊर्जा (Energy)",
  pressure: "दबाव (Pressure)",
  power: "शक्ति (Power)",
  angle: "कोण (Angle)",
  force: "बल (Force)",
  
  // Units - Length
  nm: "नैनोमीटर (nm)",
  um: "माइक्रोमीटर (µm)",
  mm: "मिलीमीटर (mm)",
  cm: "सेंटीमीटर (cm)",
  dm: "डेसीमीटर (dm)",
  m: "मीटर (m)",
  dam: "डेकामीटर (dam)",
  hm: "हेक्टोमीटर (hm)",
  km: "किलोमीटर (km)",
  mym: "मिरियामीटर (mym)",
  inch: "इंच (inch)",
  foot: "फुट (foot)",
  yard: "गज (yard)",
  chain: "चेन (chain)",
  furlong: "फर्लांग (furlong)",
  mile: "मील (mile)",
  nmi: "समुद्री मील (nmi)",
  au: "खगोलीय इकाई (AU)",
  ly: "प्रकाश वर्ष (ly)",
  pc: "पारसेक (pc)",
  
  // Units - Mass
  ug: "माइक्रोग्राम (µg)",
  mg: "मिलीग्राम (mg)",
  cg: "सेंटीग्राम (cg)",
  dg: "डेसीग्राम (dg)",
  g: "ग्राम (g)",
  dag: "डेकाग्राम (dag)",
  hg: "हेक्टोग्राम (hg)",
  kg: "किलोग्राम (kg)",
  myg: "मिरियाग्राम (myg)",
  quintal: "क्विंटल (quintal)",
  ton: "टन (ton)",
  oz: "औंस (oz)",
  lb: "पाउंड (lb)",
  st: "स्टोन (st)",
  ct: "कैरेट (ct)",
  
  // Units - Volume
  ml: "मिलीलीटर (ml)",
  cl: "सेंटीलीटर (cl)",
  dl: "डेसीलीटर (dl)",
  l: "लीटर (l)",
  dal: "डेकालीटर (dal)",
  hl: "हेक्टोलीटर (hl)",
  kl: "किलोलीटर (kl)",
  m3: "घन मीटर (m3)",
  in3: "घन इंच (in3)",
  ft3: "घन फुट (ft3)",
  cup: "कप (cup)",
  pt: "पिंट (pt)",
  qt: "क्वार्ट (qt)",
  gal: "गैलन (gal)",
  
  // Units - Area
  mm2: "वर्ग मिलीमीटर (mm2)",
  cm2: "वर्ग सेंटीमीटर (cm2)",
  dm2: "वर्ग डेसीमीटर (dm2)",
  m2: "वर्ग मीटर (m2)",
  are: "आर (are)",
  hectare: "हेक्टेयर (hectare)",
  km2: "वर्ग किलोमीटर (km2)",
  in2: "वर्ग इंच (in2)",
  ft2: "वर्ग फुट (ft2)",
  yd2: "वर्ग गज (yd2)",
  acre: "एकड़ (acre)",
  mile2: "वर्ग मील (mile2)",
  
  // Units - Time
  ms: "मिलीसेकंड (ms)",
  s: "सेकंड (s)",
  min: "मिनट (min)",
  hour: "घंटा (hour)",
  day: "दिन (day)",
  week: "सप्ताह (week)",
  month: "महीना (month)",
  year: "वर्ष (year)",
  
  // Units - Speed
  "m/s": "मीटर/सेकंड (m/s)",
  "km/h": "किमी/घंटा (km/h)",
  "mph": "मील/घंटा (mph)",
  knot: "नॉट (knot)",
  
  // Units - Data
  byte: "बाइट (byte)",
  KB: "किलोबाइट (KB)",
  MB: "मेगाबाइट (MB)",
  GB: "गीगाबाइट (GB)",
  TB: "टेराबाइट (TB)",
  PB: "पेटाबाइट (PB)",
  
  // Units - Temperature
  celsius: "सेल्सियस (Celsius)",
  fahrenheit: "फ़ारेनहाइट (Fahrenheit)",
  kelvin: "केल्विन (Kelvin)",

  // Units - Energy
  J: "जूल (J)",
  kJ: "किलोजूल (kJ)",
  cal: "कैलोरी (cal)",
  kcal: "किलोकैलोरी (kcal)",
  Wh: "वाट-घंटा (Wh)",
  kWh: "किलोवाट-घंटा (kWh)",
  eV: "इलेक्ट्रॉनवोल्ट (eV)",

  // Units - Pressure
  Pa: "पास्कल (Pa)",
  kPa: "किलोपास्कल (kPa)",
  bar: "बार (bar)",
  psi: "साई (psi)",
  atm: "वायुमंडल (atm)",
  torr: "टॉर (torr)",

  // Units - Power
  W: "वाट (W)",
  kW: "किलोवाट (kW)",
  hp: "अश्वशक्ति (hp)",

  // Units - Angle
  deg: "डिग्री (deg)",
  rad: "रेडियन (rad)",
  grad: "ग्रेडियन (grad)",

  // Units - Force
  N: "न्यूटन (N)",
  kN: "किलोन्यूटन (kN)",
  lbf: "पाउंड-बल (lbf)",
  dyn: "डाइन (dyn)"
};

const CONVERTER_DATA = {
  length: { 
    nm: 1e-9, um: 1e-6, mm: 0.001, cm: 0.01, dm: 0.1, m: 1, dam: 10, hm: 100, km: 1000, mym: 10000,
    inch: 0.0254, foot: 0.3048, yard: 0.9144, chain: 20.1168, furlong: 201.168, mile: 1609.34, nmi: 1852, au: 1.496e11, ly: 9.461e15, pc: 3.086e16
  },
  mass: { 
    ug: 1e-9, mg: 1e-6, cg: 1e-5, dg: 0.0001, g: 0.001, dag: 0.01, hg: 0.1, kg: 1, myg: 10, quintal: 100, ton: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029, ct: 0.0002
  },
  time: { 
    ms: 0.001, s: 1, min: 60, hour: 3600, day: 86400, week: 604800, month: 2592000, year: 31536000 
  },
  area: { 
    mm2: 1e-6, cm2: 0.0001, dm2: 0.01, m2: 1, are: 100, hectare: 10000, km2: 1e6, in2: 0.00064516, ft2: 0.092903, yd2: 0.836127, acre: 4046.86, mile2: 2.59e6
  },
  volume: { 
    ml: 0.001, cl: 0.01, dl: 0.1, l: 1, dal: 10, hl: 100, kl: 1000, m3: 1000, in3: 0.000016387, ft3: 0.0283168, cup: 0.000236588, pt: 0.000473176, qt: 0.000946353, gal: 0.00378541
  },
  speed: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, knot: 0.514444 },
  data: { byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 },
  temperature: { celsius: "t", fahrenheit: "t", kelvin: "t" },
  energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000, eV: 1.60218e-19 },
  pressure: { Pa: 1, kPa: 1000, bar: 100000, psi: 6894.76, atm: 101325, torr: 133.322 },
  power: { W: 1, kW: 1000, hp: 745.7 },
  angle: { deg: 1, rad: 57.2958, grad: 0.9 },
  force: { N: 1, kN: 1000, lbf: 4.44822, dyn: 1e-5 }
};

function AdBanner() {
  useEffect(() => {
    const container = document.getElementById('ad-banner-container');
    if (container && !container.hasChildNodes()) {
      const atScript = document.createElement('script');
      atScript.type = 'text/javascript';
      atScript.innerHTML = `
        atOptions = {
          'key' : '09f1d8809bf48bc17265db3f96916867',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      container.appendChild(atScript);

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = "//www.highperformanceformat.com/09f1d8809bf48bc17265db3f96916867/invoke.js";
      container.appendChild(invokeScript);
    }
  }, []);

  return <div id="ad-banner-container" className="flex justify-center items-center w-full h-full" />;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isDark, setIsDark] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [convCategory, setConvCategory] = useState<keyof typeof CONVERTER_DATA>('length');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('calc_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'privacy') {
      setPage('privacy');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const openConverter = (cat: keyof typeof CONVERTER_DATA) => {
    setConvCategory(cat);
    setPage('converter');
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-300`}>
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
              <motion.div
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255, 215, 0, 0.2)",
                    "0 0 20px rgba(255, 215, 0, 0.4)",
                    "0 0 10px rgba(255, 215, 0, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl font-black tracking-widest text-[#FFD700] relative z-10"
              >
                ✦ NIRAJ ✦
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
                Scientific Calculator
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm font-medium">
                <span>⚡ Smart</span>
                <span className="text-zinc-600">•</span>
                <span>Fast</span>
                <span className="text-zinc-600">•</span>
                <span>Online ⚡</span>
              </div>
            </motion.div>

            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"
                  />
                ))}
              </div>
              <span className="text-zinc-500 text-xs tracking-widest uppercase">Loading...</span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-16 w-full flex flex-col items-center space-y-4"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">👨‍💻 Developed by</span>
                <span className="text-2xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFFACD] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                  Niraj Kumar Kannaujiya
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800/50 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse shadow-[0_0_8px_#FFD700]" />
                  <span className="text-sm font-bold text-zinc-200 tracking-wide">
                    Queen’s College Student
                  </span>
                  <span className="text-zinc-600 mx-1 font-light">•</span>
                  <span className="text-[#FFD700] font-mono">© 2026</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full ${page === 'calculator' ? '' : 'max-w-md'} mx-auto min-h-screen flex flex-col relative`}>
        {/* Ad Placeholder */}
        <div className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 h-14 flex flex-col justify-center items-center overflow-hidden">
          <div className="text-[8px] text-slate-400 uppercase tracking-[0.2em] mb-1">Sponsored Advertisement</div>
          <AdBanner />
        </div>

        {/* Header */}
        {page !== 'calculator' && (
          <header className="sticky top-0 z-30 bg-orange-500 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              {page !== 'home' && (
                <button onClick={() => setPage('home')} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronLeft size={24} />
                </button>
              )}
              <h1 className="text-xl font-bold flex items-center gap-2">
                <CalcIcon size={24} className="bg-white/20 p-1 rounded-lg" />
                NIRAJ SCIENTIFIC CALCULATOR
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isOffline && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-[10px] font-bold uppercase animate-pulse">
                  <WifiOff size={12} /> Offline
                </div>
              )}
              <button 
                onClick={() => setPage('history')}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${page === 'history' ? 'bg-white/20' : ''}`}
                aria-label="View history"
              >
                <HistoryIcon size={20} />
              </button>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>
        )}

      <main className={`flex-1 ${page === 'calculator' ? 'p-0' : 'p-4'} w-full mx-auto`}>
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <HomeGrid onOpenConv={openConverter} onOpenCalc={() => setPage('calculator')} onOpenTool={(t) => setPage(t)} />
            </motion.div>
          )}
          {page === 'calculator' && (
            <motion.div key="calc" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Calculator history={history} setHistory={setHistory} page={page} setPage={setPage} isDark={isDark} setIsDark={setIsDark} />
            </motion.div>
          )}
          {page === 'math' && (
            <motion.div key="math" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <MathSection onOpenTool={(t) => setPage(t)} />
            </motion.div>
          )}
          {page === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <HistoryView history={history} setHistory={setHistory} />
            </motion.div>
          )}
          {page === 'currency' && (
            <motion.div key="currency" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <CurrencyConverter />
            </motion.div>
          )}
          {page === 'converter' && (
            <motion.div key="conv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Converter category={convCategory} setCategory={setConvCategory} page={page} setPage={setPage} isDark={isDark} setIsDark={setIsDark} />
            </motion.div>
          )}
          {page === 'gst' && (
            <motion.div key="gst" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <GSTCalculator />
            </motion.div>
          )}
          {page === 'discount' && (
            <motion.div key="discount" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <DiscountCalculator />
            </motion.div>
          )}
          {page === 'bmi' && (
            <motion.div key="bmi" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <BMICalculator />
            </motion.div>
          )}
          {page === 'age' && (
            <motion.div key="age" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <AgeCalculator />
            </motion.div>
          )}
          {page === 'formulas' && (
            <motion.div key="formulas" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <FormulaLibrary />
            </motion.div>
          )}
          {page === 'tracker' && (
            <motion.div key="tracker" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <LiveTracker />
            </motion.div>
          )}
          {page === 'graph' && (
            <motion.div key="graph" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <GraphPlotter />
            </motion.div>
          )}
          {page === 'symbols' && (
            <motion.div key="symbols" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <SymbolsLibrary />
            </motion.div>
          )}
          {page === 'steps' && (
            <motion.div key="steps" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <StepCounter />
            </motion.div>
          )}
          {page === 'random' && (
            <motion.div key="random" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <RandomTools />
            </motion.div>
          )}
          {page === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <NotesManager />
            </motion.div>
          )}
          {page === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <AboutPage />
            </motion.div>
          )}
          {page === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PrivacyPolicy />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Professional Footer */}
      <footer className="px-6 py-6 text-center bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 mb-16">
        <div className="max-w-xs mx-auto p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Developed by</p>
          <p className="text-base font-black text-slate-800 dark:text-zinc-100 mb-1 tracking-tight">Niraj Kumar Kannaujiya</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-full border border-orange-100 dark:border-orange-500/20">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Queen’s College Student</p>
          </div>
          <p className="text-[9px] text-slate-400 mt-3 font-mono">© 2026 • All Rights Reserved</p>
        </div>
      </footer>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex flex-col shadow-lg z-40">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setPage('calculator')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${page === 'calculator' ? 'text-orange-500' : 'text-slate-400'}`}
          >
            <CalcIcon size={22} />
            <span className="text-[10px] font-bold uppercase">Calc</span>
          </button>
          <button 
            onClick={() => setPage('home')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${page === 'home' ? 'text-orange-500' : 'text-slate-400'}`}
          >
            <HomeIcon size={22} />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button 
            onClick={() => setPage('math')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${page === 'math' ? 'text-orange-500' : 'text-slate-400'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold uppercase">Math</span>
          </button>
          <button 
            onClick={() => setPage('converter')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${page === 'converter' ? 'text-orange-500' : 'text-slate-400'}`}
          >
            <RefreshCw size={22} />
            <span className="text-[10px] font-bold uppercase">Conv</span>
          </button>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
          <button 
            onClick={() => setPage('privacy')}
            className="text-[9px] text-slate-400 hover:text-orange-500 transition-colors font-medium"
          >
            Privacy Policy (गोपनीयता नीति)
          </button>
        </div>
      </footer>
      </div>
    </div>
  );
}

function HomeGrid({ onOpenConv, onOpenCalc, onOpenTool }: { 
  onOpenConv: (cat: keyof typeof CONVERTER_DATA) => void, 
  onOpenCalc: () => void,
  onOpenTool: (t: Page) => void
}) {
  const items = [
    { id: 'calc', label: 'कैलकुलेटर', icon: <CalcIcon className="text-slate-600 dark:text-zinc-400" />, type: 'calc' },
    { id: 'math', label: 'गणित (Math)', icon: <BookOpen className="text-indigo-600" />, type: 'tool' },
    { id: 'currency', label: 'मुद्रा (Currency)', icon: <DollarSign className="text-green-600" />, type: 'tool' },
    { id: 'length', label: 'लम्बाई', icon: <ArrowRightLeft className="text-blue-500" />, type: 'conv' },
    { id: 'mass', label: 'तौल', icon: <Scale className="text-emerald-500" />, type: 'conv' },
    { id: 'time', label: 'समय', icon: <Clock className="text-purple-500" />, type: 'conv' },
    { id: 'area', label: 'क्षेत्रफल', icon: <Maximize className="text-orange-500" />, type: 'conv' },
    { id: 'volume', label: 'आयतन', icon: <Box className="text-cyan-500" />, type: 'conv' },
    { id: 'speed', label: 'गति', icon: <Zap className="text-yellow-500" />, type: 'conv' },
    { id: 'temperature', label: 'तापमान', icon: <Thermometer className="text-red-500" />, type: 'conv' },
    { id: 'formulas', label: 'सूत्र (Formulas)', icon: <Library className="text-amber-600" />, type: 'tool' },
    { id: 'tracker', label: 'ट्रैकर (Tracker)', icon: <Navigation className="text-blue-600" />, type: 'tool' },
    { id: 'graph', label: 'ग्राफ (Graph)', icon: <LineChart className="text-rose-600" />, type: 'tool' },
    { id: 'symbols', label: 'चिह्न (Symbols)', icon: <Zap className="text-yellow-500" />, type: 'tool' },
    { id: 'steps', label: 'स्टेप्स (Steps)', icon: <Footprints className="text-orange-600" />, type: 'tool' },
    { id: 'random', label: 'रैंडम (Random)', icon: <Dices className="text-purple-600" />, type: 'tool' },
    { id: 'notes', label: 'नोट्स (Notes)', icon: <StickyNote className="text-teal-600" />, type: 'tool' },
    { id: 'about', label: 'अबाउट (About)', icon: <Info className="text-slate-600" />, type: 'tool' },
    { id: 'gst', label: 'जीएसटी', icon: <Percent className="text-rose-500" />, type: 'tool' },
    { id: 'discount', label: 'छूट', icon: <Tag className="text-green-500" />, type: 'tool' },
    { id: 'bmi', label: 'बीएमआई', icon: <User className="text-teal-500" />, type: 'tool' },
    { id: 'age', label: 'आयु', icon: <Clock className="text-blue-400" />, type: 'tool' },
    { id: 'energy', label: 'ऊर्जा', icon: <Zap className="text-amber-500" />, type: 'conv' },
    { id: 'data', label: 'डेटा', icon: <Database className="text-indigo-500" />, type: 'conv' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 pb-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.type === 'conv') onOpenConv(item.id as any);
            else if (item.type === 'calc') onOpenCalc();
            else onOpenTool(item.id as any);
          }}
          className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-orange-200 dark:hover:border-orange-900/50"
        >
          <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg">
            {item.icon}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-zinc-300 text-center">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function Calculator({ history, setHistory, page, setPage, isDark, setIsDark }: { 
  history: HistoryItem[], 
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
  page: Page,
  setPage: (p: Page) => void,
  isDark: boolean,
  setIsDark: (d: boolean) => void
}) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [realTimeResult, setRealTimeResult] = useState('');
  const [lastExpression, setLastExpression] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!expression) {
      setRealTimeResult('');
      return;
    }
    try {
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(')
        .replace(/√\(/g, 'sqrt(')
        .replace(/\^/g, '^')
        .replace(/π/g, 'PI')
        .replace(/e/g, 'e');
      
      const r = math.evaluate(sanitized);
      if (typeof r === 'number' || typeof r === 'object') {
        const res = String(typeof r === 'number' ? Number(r.toFixed(8)) : r);
        setRealTimeResult(res);
      }
    } catch (e) {
      setRealTimeResult('');
    }
  }, [expression]);

  const handlePress = (val: string) => {
    const isOperator = ['+', '−', '×', '÷', '%', '^'].includes(val);
    
    if (lastExpression && !expression) {
      if (isOperator && result !== 'Error' && result !== '0') {
        setExpression(result + val);
        setLastExpression('');
        setResult('0');
        return;
      }
      setLastExpression('');
      setResult('0');
    }
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setLastExpression('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression) return;
    try {
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(')
        .replace(/√\(/g, 'sqrt(')
        .replace(/\^/g, '^')
        .replace(/π/g, 'PI')
        .replace(/e/g, 'e');

      const r = math.evaluate(sanitized);
      const formattedResult = String(typeof r === 'number' ? Number(r.toFixed(8)) : r);
      
      setLastExpression(expression);
      setResult(formattedResult);
      setExpression('');
      
      const newItem: HistoryItem = { 
        id: Date.now(),
        expression, 
        result: formattedResult,
        date: new Date().toLocaleString()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      console.error(err);
      setResult('Error');
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Default to Hindi
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      let processed = transcript
        .toLowerCase()
        .replace(/प्लस|जोड़|plus|add/g, '+')
        .replace(/माइनस|घटाव|minus|subtract/g, '−')
        .replace(/गुणा|इनटू|गुना|times|multiplied by|multiply|multiple|into|x|multiplication/g, '×')
        .replace(/भाग|डिवाइड|divided by|divide|division/g, '÷')
        .replace(/पॉइंट|बिंदु|point|decimal/g, '.')
        .replace(/बराबर|इक्वल|equal|equals/g, '=')
        .replace(/ब्रैकेट|कोष्ठक|bracket|open bracket/g, '(')
        .replace(/ब्रैकेट बंद|कोष्ठक बंद|bracket close|close bracket/g, ')')
        .replace(/स्क्वायर|वर्ग|square/g, '^2')
        .replace(/क्यूब|घन|cube/g, '^3')
        .replace(/पावर|घात|power/g, '^')
        .replace(/रूट|वर्गमूल|root|square root/g, '√(')
        .replace(/पाई|pi/g, 'π')
        .replace(/साइन|sin/g, 'sin(')
        .replace(/कॉस|cos/g, 'cos(')
        .replace(/टैन|tan/g, 'tan(')
        .replace(/लॉग|log/g, 'log(')
        .replace(/प्रतिशत|परसेंट|percent|percentage/g, '%')
        .replace(/एक|one/g, '1')
        .replace(/दो|two/g, '2')
        .replace(/तीन|three/g, '3')
        .replace(/चार|four/g, '4')
        .replace(/पांच|five/g, '5')
        .replace(/छह|six/g, '6')
        .replace(/सात|seven/g, '7')
        .replace(/आठ|eight/g, '8')
        .replace(/नौ|nine/g, '9')
        .replace(/जीरो|शून्य|शुन्य|zero|null|nought/g, '0')
        .replace(/दस|ten/g, '10')
        .replace(/\s+/g, '') // Remove spaces
        .replace(/[^0-9+\-−×÷.()^π%√sincoatlg!e]/g, ''); // Keep valid chars

      if (processed.includes('=')) {
        const parts = processed.split('=');
        setExpression(parts[0].trim());
        setTimeout(handleCalculate, 100);
      } else {
        setExpression(prev => prev + processed);
      }
    };
    recognition.start();
  };

  const mainButtons = [
    { label: 'AC', type: 'clear' }, { label: 'DEL', type: 'del' }, { label: '%', type: 'op' }, { label: '÷', type: 'op' },
    { label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '×', type: 'op' },
    { label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: '−', type: 'op' },
    { label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '+', type: 'op' },
    { label: 'SCI', type: 'sci_toggle' }, { label: '0', type: 'num' }, { label: '.', type: 'num' }, { label: '=', type: 'calc' },
  ];

  const sciButtons = [
    { label: 'sin(', type: 'sci' }, { label: 'cos(', type: 'sci' }, { label: 'tan(', type: 'sci' }, { label: '^', type: 'sci' },
    { label: 'log(', type: 'sci' }, { label: 'ln(', type: 'sci' }, { label: '√(', type: 'sci' }, { label: '!', type: 'sci' },
    { label: '(', type: 'sci' }, { label: ')', type: 'sci' }, { label: 'π', type: 'sci' }, { label: 'e', type: 'sci' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white shadow-2xl overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <button onClick={() => setPage('home')} className="p-1 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setPage('calculator')}
              className={`text-sm font-bold tracking-wider uppercase transition-colors ${page === 'calculator' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setPage('converter')}
              className={`text-sm font-bold tracking-wider uppercase transition-colors ${page === 'converter' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}
            >
              Converter
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 relative">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-90"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setPage('history')}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-90"
            title="History"
          >
            <HistoryIcon size={20} />
          </button>
          <button 
            onClick={() => setShowMore(!showMore)}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-90"
            title="More Options"
          >
            <MoreVertical size={20} />
          </button>

          {showMore && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
              <div className="absolute top-14 right-0 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 mb-1">
                  Options (विकल्प)
                </div>
                <button 
                  onClick={() => { setIsScientific(!isScientific); setShowMore(false); }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                >
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                    <Layers size={16} className="text-orange-500" />
                  </div>
                  {isScientific ? 'Hide Scientific' : 'Show Scientific'}
                </button>
                <button 
                  onClick={() => { setHistory([]); setShowMore(false); }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                >
                  <div className="p-1.5 bg-red-100 dark:bg-red-500/20 rounded-lg">
                    <Trash2 size={16} className="text-red-500" />
                  </div>
                  Clear History
                </button>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800 px-4 pb-2">
                  <div className="text-[10px] text-slate-400 text-center">NIRAJ Calculator v2.0</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end p-6 text-right min-h-[25vh]">
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <button 
              onClick={startVoice}
              className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse scale-110 shadow-lg shadow-red-500/50' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'}`}
            >
              <Mic size={28} />
            </button>
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-50"
              >
                बोलें (Speak Now...)
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-end max-w-[80%]">
            <div className="text-slate-400 dark:text-zinc-500 text-2xl font-medium overflow-hidden whitespace-nowrap mb-2 opacity-70">
              {lastExpression ? lastExpression + ' =' : ' '}
            </div>
            {realTimeResult && expression && (
              <div className="text-orange-500/60 text-xl font-medium animate-in fade-in slide-in-from-right-2">
                = {realTimeResult}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex items-center justify-end overflow-hidden">
          <div className={`font-light text-slate-900 dark:text-white overflow-hidden whitespace-nowrap tracking-tighter transition-all duration-200 ${
            (expression || result || '0').length > 10 ? 'text-4xl' : 
            (expression || result || '0').length > 7 ? 'text-5xl' : 'text-7xl'
          }`}>
            {expression || result || '0'}
          </div>
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-1 h-14 bg-orange-500 ml-1 rounded-full flex-shrink-0"
          />
        </div>
      </div>

      {/* Keyboard Area */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-t-[2.5rem] border-t border-slate-200 dark:border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 gap-3 pb-6 pt-2">
          {isScientific && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="col-span-4 grid grid-cols-4 gap-2 mb-4 overflow-hidden"
            >
              {sciButtons.map(btn => (
                <button
                  key={btn.label}
                  onClick={() => handlePress(btn.label)}
                  className="h-10 rounded-xl text-xs font-bold bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 active:scale-95 transition-all border border-slate-200/50 dark:border-zinc-700/50 hover:bg-slate-100 dark:hover:bg-zinc-700"
                >
                  {btn.label}
                </button>
              ))}
            </motion.div>
          )}

          {mainButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                if (btn.type === 'del') handleDelete();
                else if (btn.type === 'clear') handleClear();
                else if (btn.type === 'calc') handleCalculate();
                else if (btn.type === 'sci_toggle') setIsScientific(!isScientific);
                else handlePress(btn.label);
              }}
              className={`h-16 sm:h-20 rounded-2xl text-2xl font-medium transition-all active:scale-90 flex items-center justify-center
                ${btn.type === 'op' || btn.type === 'clear' || btn.type === 'del' || btn.type === 'sci_toggle' ? 'bg-slate-100 dark:bg-zinc-800 text-orange-500' : 
                  btn.type === 'calc' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 
                  'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-100 dark:border-zinc-700 shadow-sm'}`}
            >
              {btn.label === 'DEL' ? <Delete size={28} /> : 
               btn.label === 'SCI' ? <Layers size={28} /> : 
               btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function Converter({ category, setCategory, page, setPage, isDark, setIsDark }: { 
  category: keyof typeof CONVERTER_DATA, 
  setCategory: (c: any) => void,
  page: Page,
  setPage: (p: Page) => void,
  isDark: boolean,
  setIsDark: (d: boolean) => void
}) {
  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const units = useMemo(() => Object.keys(CONVERTER_DATA[category]), [category]);

  useEffect(() => {
    setUnit1(units[0]);
    setUnit2(units[1] || units[0]);
    setVal1('');
    setVal2('');
  }, [units, category]);

  const convert = (value: number, from: string, to: string, type: keyof typeof CONVERTER_DATA) => {
    if (type === 'temperature') {
      if (from === 'celsius' && to === 'fahrenheit') return (value * 9/5) + 32;
      if (from === 'fahrenheit' && to === 'celsius') return (value - 32) * 5/9;
      if (from === 'celsius' && to === 'kelvin') return value + 273.15;
      if (from === 'kelvin' && to === 'celsius') return value - 273.15;
      if (from === 'fahrenheit' && to === 'kelvin') return (value - 32) * 5/9 + 273.15;
      if (from === 'kelvin' && to === 'fahrenheit') return (value - 273.15) * 9/5 + 32;
      return value;
    }
    const data = CONVERTER_DATA[type] as Record<string, number>;
    const base = value * data[from];
    return base / data[to];
  };

  const handleVal1Change = (v: string) => {
    setVal1(v);
    const num = parseFloat(v);
    if (!isNaN(num)) {
      const res = convert(num, unit1, unit2, category);
      setVal2(res.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setVal2('');
    }
  };

  const handleVal2Change = (v: string) => {
    setVal2(v);
    const num = parseFloat(v);
    if (!isNaN(num)) {
      const res = convert(num, unit2, unit1, category);
      setVal1(res.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setVal1('');
    }
  };

  const swap = () => {
    const tempUnit = unit1;
    setUnit1(unit2);
    setUnit2(tempUnit);
    const tempVal = val1;
    setVal1(val2);
    setVal2(tempVal);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white shadow-2xl overflow-hidden min-h-[80vh]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <button onClick={() => setPage('home')} className="p-1 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setPage('calculator')}
              className={`text-sm font-bold tracking-wider uppercase transition-colors ${page === 'calculator' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setPage('converter')}
              className={`text-sm font-bold tracking-wider uppercase transition-colors ${page === 'converter' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}
            >
              Converter
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="p-2 bg-orange-500/20 text-orange-500 rounded-xl">
            <RefreshCw size={24} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Category (श्रेणी)</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer"
            >
              {Object.keys(CONVERTER_DATA).map(cat => (
                <option key={cat} value={cat} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">{UNIT_LABELS[cat] || cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">From</label>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{UNIT_LABELS[unit1] || unit1}</span>
            </div>
            <input 
              type="number"
              value={val1}
              onChange={(e) => handleVal1Change(e.target.value)}
              placeholder="0"
              className="w-full text-4xl font-light p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-zinc-800 shadow-sm"
            />
            <select 
              value={unit1}
              onChange={(e) => {
                setUnit1(e.target.value);
                const num = parseFloat(val1);
                if (!isNaN(num)) setVal2(convert(num, e.target.value, unit2, category).toFixed(6).replace(/\.?0+$/, ''));
              }}
              className="w-full p-4 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl text-slate-500 dark:text-zinc-400 font-medium outline-none appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              {units.map(u => <option key={u} value={u} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">{UNIT_LABELS[u] || u}</option>)}
            </select>
          </div>

          <div className="flex justify-center -my-4 relative z-10">
            <button 
              onClick={swap}
              className="p-4 bg-orange-500 text-white rounded-full shadow-2xl shadow-orange-500/40 active:scale-90 transition-all hover:scale-105"
            >
              <ArrowRightLeft size={24} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">To</label>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{UNIT_LABELS[unit2] || unit2}</span>
            </div>
            <input 
              type="number"
              value={val2}
              onChange={(e) => handleVal2Change(e.target.value)}
              placeholder="0"
              className="w-full text-4xl font-light p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-zinc-800 shadow-sm"
            />
            <select 
              value={unit2}
              onChange={(e) => {
                setUnit2(e.target.value);
                const num = parseFloat(val1);
                if (!isNaN(num)) setVal2(convert(num, unit1, e.target.value, category).toFixed(6).replace(/\.?0+$/, ''));
              }}
              className="w-full p-4 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl text-slate-500 dark:text-zinc-400 font-medium outline-none appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              {units.map(u => <option key={u} value={u} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">{UNIT_LABELS[u] || u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ history, setHistory }: { history: HistoryItem[], setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>> }) {
  const clearHistory = () => {
    setHistory([]);
  };

  const deleteItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <HistoryIcon className="text-orange-500" size={20} /> गणना इतिहास (History)
        </h3>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <Trash2 size={16} /> साफ़ करें
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center">
          <HistoryIcon size={48} className="mx-auto text-slate-200 dark:text-zinc-800 mb-4" />
          <p className="text-slate-400 dark:text-zinc-500 font-medium">कोई इतिहास नहीं मिला</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id} 
              className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm relative group"
            >
              <button 
                onClick={() => deleteItem(item.id)}
                className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">{item.date}</span>
              </div>
              <div className="text-slate-500 dark:text-zinc-400 font-mono text-sm mb-1 pr-6">{item.expression}</div>
              <div className="text-xl font-bold text-orange-500">= {item.result}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState<Record<string, number>>({
    "USD": 1, "INR": 83.35, "EUR": 0.92, "GBP": 0.79, "JPY": 151.6, "CAD": 1.35, "AUD": 1.53, "AED": 3.67, "SAR": 3.75, "CNY": 7.23
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.onLine) {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          if (data && data.rates) {
            setRates(data.rates);
            setError(null);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Currency fetch error:', err);
          setError("लाइव रेट लोड करने में विफल (Using fallback rates)");
          setLoading(false);
        });
    } else {
      setError("आप ऑफ़लाइन हैं (Using fallback rates)");
      setLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const result = !rates[from] || !rates[to] 
    ? '...' 
    : ((parseFloat(amount) || 0) * (rates[to] / rates[from])).toFixed(2);

  const currencies = Object.keys(rates).sort();

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <DollarSign className="text-green-600" size={20} /> मुद्रा परिवर्तक (Currency)
        </h3>
        {loading && <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>}
      </div>
      
      {error && <div className="text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-center font-bold uppercase">{error}</div>}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">राशि (Amount)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0"
            className="w-full p-4 text-2xl font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">से (From)</label>
            <select 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none"
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={swap}
              className="p-3 bg-green-600 text-white rounded-full shadow-lg shadow-green-600/30 active:scale-90 transition-transform"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">को (To)</label>
            <select 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none"
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 text-center">
          <div className="text-sm text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-widest mb-1">परिवर्तित राशि (Converted Amount)</div>
          <div className="text-4xl font-black text-green-600 dark:text-green-400">{result} {to}</div>
          <div className="text-[10px] text-slate-400 mt-2 italic">* {error ? 'Fallback rates used' : 'Rates are updated daily'}</div>
        </div>
      </div>
    </div>
  );
}

function MathSection({ onOpenTool }: { onOpenTool: (t: Page) => void }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { id: 'work', label: 'काम, समय और दूरी', icon: <Clock className="text-blue-500" />, desc: 'Work, Time & Distance' },
    { id: 'profit', label: 'लाभ और हानि', icon: <TrendingUp className="text-green-500" />, desc: 'Profit & Loss' },
    { id: 'percent', label: 'प्रतिशत', icon: <Percent className="text-rose-500" />, desc: 'Percentage' },
    { id: 'interest', label: 'ब्याज (SI & CI)', icon: <DollarSign className="text-amber-500" />, desc: 'Simple & Compound Interest' },
    { id: 'stock', label: 'स्टॉक, शेयर और छूट', icon: <Activity className="text-purple-500" />, desc: 'Stock, Share & Discount' },
    { id: 'arithmetic', label: 'अंकगणित (Arithmetic)', icon: <Layers className="text-indigo-500" />, desc: 'LCM, HCF, Average' },
    { id: 'ratio', label: 'अनुपात (Ratio)', icon: <ArrowRightLeft className="text-orange-600" />, desc: 'Ratio & Proportion' },
    { id: 'geometry', label: 'क्षेत्रमिति (Geometry)', icon: <Maximize className="text-blue-500" />, desc: 'Area, Perimeter, Volume' },
    { id: 'numbers', label: 'संख्या पद्धति (Numbers)', icon: <Database className="text-purple-600" />, desc: 'Binary, Hex, Octal' },
    { id: 'roman', label: 'रोमन संख्या (Roman)', icon: <Zap className="text-yellow-600" />, desc: 'Roman Numerals Converter' },
    { id: 'converter', label: 'इकाई परिवर्तक (Units)', icon: <RefreshCw className="text-cyan-600" />, desc: 'Length, Mass, Time, etc.' },
  ];

  if (selectedTopic) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-sm mb-2 hover:text-orange-500 transition-colors"
        >
          <ChevronLeft size={18} /> वापस (Back)
        </button>
        <MathCalculator topic={selectedTopic} setTopic={setSelectedTopic} topics={topics} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-200 dark:border-orange-900/30">
        <h2 className="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-1">
          <BookOpen size={20} /> गणित अनुभाग (Math Section)
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500">विभिन्न गणितीय गणनाओं के लिए श्रेणी चुनें</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => {
              if (topic.id === 'converter') onOpenTool('converter');
              else setSelectedTopic(topic.id);
            }}
            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 flex items-center gap-4 active:scale-[0.98] transition-all hover:border-orange-300 dark:hover:border-orange-900"
          >
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
              {topic.icon}
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-800 dark:text-zinc-100">{topic.label}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider">{topic.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MathCalculator({ topic, setTopic, topics }: { topic: string, setTopic: (t: string) => void, topics: any[] }) {
  const [inputs, setInputs] = useState<Record<string, string>>({
    val1: '',
    type1: '',
    val2: '',
    type2: '',
    // Fallbacks for multi-input tools like interest
    p: '', r: '', t: '',
    nums: '',
    val: '',
    fromBase: '10',
    toBase: '2',
    mode: 'decToRom'
  });
  const [result, setResult] = useState<string | null>(null);

  // Define variable sets for each topic
  const topicConfig: Record<string, { label: string, units: { id: string, label: string }[] }> = {
    work: {
      label: 'काम, समय और दूरी',
      units: [
        { id: 'speed', label: 'गति (Speed)' },
        { id: 'time', label: 'समय (Time)' },
        { id: 'distance', label: 'दूरी (Distance)' }
      ]
    },
    profit: {
      label: 'लाभ और हानि',
      units: [
        { id: 'cp', label: 'क्रय मूल्य (CP)' },
        { id: 'sp', label: 'विक्रय मूल्य (SP)' },
        { id: 'profit', label: 'लाभ (Profit)' },
        { id: 'loss', label: 'हानि (Loss)' }
      ]
    },
    percent: {
      label: 'प्रतिशत',
      units: [
        { id: 'total', label: 'कुल (Total)' },
        { id: 'part', label: 'हिस्सा (Part)' },
        { id: 'percent', label: 'प्रतिशत (%)' }
      ]
    },
    stock: {
      label: 'स्टॉक और छूट',
      units: [
        { id: 'price', label: 'मूल्य (Price)' },
        { id: 'discount', label: 'छूट (Discount %)' },
        { id: 'savings', label: 'बचत (Savings)' }
      ]
    },
    numbers: {
      label: 'संख्या पद्धति',
      units: [
        { id: '10', label: 'Decimal (10)' },
        { id: '2', label: 'Binary (2)' },
        { id: '8', label: 'Octal (8)' },
        { id: '16', label: 'Hexadecimal (16)' }
      ]
    },
    roman: {
      label: 'रोमन संख्या',
      units: [
        { id: 'dec', label: 'Decimal' },
        { id: 'rom', label: 'Roman' }
      ]
    }
  };

  useEffect(() => {
    const config = topicConfig[topic];
    if (config) {
      setInputs(prev => ({
        ...prev,
        type1: config.units[0].id,
        type2: config.units[1].id,
        val1: '',
        val2: ''
      }));
    }
    setResult(null);
  }, [topic]);

  const calculate = () => {
    try {
      if (topic === 'work') {
        const v1 = parseFloat(inputs.val1);
        const v2 = parseFloat(inputs.val2);
        const t1 = inputs.type1;
        const t2 = inputs.type2;

        if (!v1 || !v2 || t1 === t2) return;

        let res = '';
        const types = [t1, t2];
        
        if (types.includes('speed') && types.includes('time')) {
          res = `दूरी (Distance) = ${(v1 * v2).toFixed(2)}`;
        } else if (types.includes('distance') && types.includes('speed')) {
          const dist = t1 === 'distance' ? v1 : v2;
          const speed = t1 === 'speed' ? v1 : v2;
          res = `समय (Time) = ${(dist / speed).toFixed(2)}`;
        } else if (types.includes('distance') && types.includes('time')) {
          const dist = t1 === 'distance' ? v1 : v2;
          const time = t1 === 'time' ? v1 : v2;
          res = `गति (Speed) = ${(dist / time).toFixed(2)}`;
        }
        setResult(res);
      } else if (topic === 'profit') {
        const v1 = parseFloat(inputs.val1);
        const v2 = parseFloat(inputs.val2);
        const t1 = inputs.type1;
        const t2 = inputs.type2;

        if (!v1 || !v2 || t1 === t2) return;

        if (t1 === 'cp' && t2 === 'sp') {
          if (v2 > v1) setResult(`लाभ (Profit) = ${(v2 - v1).toFixed(2)} (${((v2 - v1) / v1 * 100).toFixed(2)}%)`);
          else setResult(`हानि (Loss) = ${(v1 - v2).toFixed(2)} (${((v1 - v2) / v1 * 100).toFixed(2)}%)`);
        } else if ((t1 === 'cp' && t2 === 'profit') || (t1 === 'profit' && t2 === 'cp')) {
          const cp = t1 === 'cp' ? v1 : v2;
          const profit = t1 === 'profit' ? v1 : v2;
          setResult(`विक्रय मूल्य (SP) = ${(cp + profit).toFixed(2)}`);
        } else if ((t1 === 'cp' && t2 === 'loss') || (t1 === 'loss' && t2 === 'cp')) {
          const cp = t1 === 'cp' ? v1 : v2;
          const loss = t1 === 'loss' ? v1 : v2;
          setResult(`विक्रय मूल्य (SP) = ${(cp - loss).toFixed(2)}`);
        }
      } else if (topic === 'percent') {
        const v1 = parseFloat(inputs.val1);
        const v2 = parseFloat(inputs.val2);
        const t1 = inputs.type1;
        const t2 = inputs.type2;

        if (!v1 || !v2 || t1 === t2) return;

        if (t1 === 'total' && t2 === 'part') {
          setResult(`प्रतिशत (%) = ${(v2 / v1 * 100).toFixed(2)}%`);
        } else if ((t1 === 'total' && t2 === 'percent') || (t1 === 'percent' && t2 === 'total')) {
          const total = t1 === 'total' ? v1 : v2;
          const percent = t1 === 'percent' ? v1 : v2;
          setResult(`हिस्सा (Part) = ${(total * percent / 100).toFixed(2)}`);
        }
      } else if (topic === 'stock') {
        const v1 = parseFloat(inputs.val1);
        const v2 = parseFloat(inputs.val2);
        const t1 = inputs.type1;
        const t2 = inputs.type2;

        if (!v1 || !v2 || t1 === t2) return;

        if (t1 === 'price' && t2 === 'discount') {
          const savings = (v1 * v2) / 100;
          setResult(`बचत (Savings) = ${savings.toFixed(2)}\nअंतिम मूल्य (Final) = ${(v1 - savings).toFixed(2)}`);
        } else if ((t1 === 'price' && t2 === 'savings') || (t1 === 'savings' && t2 === 'price')) {
          const price = t1 === 'price' ? v1 : v2;
          const savings = t1 === 'savings' ? v1 : v2;
          setResult(`छूट (Discount) = ${(savings / price * 100).toFixed(2)}%`);
        }
      } else if (topic === 'numbers') {
        const val = inputs.val1;
        const fromBase = parseInt(inputs.type1);
        const toBase = parseInt(inputs.type2);
        if (val) {
          try {
            const decimal = parseInt(val, fromBase);
            if (isNaN(decimal)) throw new Error();
            setResult(`Decimal: ${decimal}\nBinary: ${decimal.toString(2)}\nOctal: ${decimal.toString(8)}\nHex: ${decimal.toString(16).toUpperCase()}\n\nSelected Result (${toBase}): ${decimal.toString(toBase).toUpperCase()}`);
          } catch {
            setResult("Invalid input for selected base");
          }
        }
      } else if (topic === 'roman') {
        const val = inputs.val1.toUpperCase();
        const t1 = inputs.type1;
        const t2 = inputs.type2;

        if (!val) return;

        const romanToDecimal = (str: string) => {
          const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
          let res = 0;
          for (let i = 0; i < str.length; i++) {
            const curr = map[str[i]];
            const next = map[str[i + 1]];
            if (next > curr) {
              res += next - curr;
              i++;
            } else {
              res += curr;
            }
          }
          return res;
        };

        const decimalToRoman = (num: number) => {
          const map: [number, string][] = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
          ];
          let res = '';
          for (const [val, char] of map) {
            while (num >= val) {
              res += char;
              num -= val;
            }
          }
          return res;
        };

        if (t1 === 'dec' && t2 === 'rom') {
          const num = parseInt(val);
          if (num > 0 && num < 4000) setResult(`Roman: ${decimalToRoman(num)}`);
          else setResult("Please enter 1-3999");
        } else if (t1 === 'rom' && t2 === 'dec') {
          if (/^[IVXLCDM]+$/.test(val)) setResult(`Decimal: ${romanToDecimal(val)}`);
          else setResult("Invalid Roman Numeral");
        } else {
          setResult(val);
        }
      } else if (topic === 'interest') {
        const p = parseFloat(inputs.p);
        const r = parseFloat(inputs.r);
        const t = parseFloat(inputs.t);
        if (p && r && t) {
          const si = (p * r * t) / 100;
          const ci = p * (Math.pow((1 + r / 100), t)) - p;
          setResult(`साधारण ब्याज (SI): ${si.toFixed(2)}\nचक्रवृद्धि ब्याज (CI): ${ci.toFixed(2)}`);
        }
      } else if (topic === 'stock') {
        const price = parseFloat(inputs.price);
        const discount = parseFloat(inputs.discount);
        if (price && discount) {
          const savings = (price * discount) / 100;
          setResult(`बचत (Savings): ${savings.toFixed(2)}\nअंतिम मूल्य (Final): ${(price - savings).toFixed(2)}`);
        }
      } else if (topic === 'arithmetic') {
        const nums = inputs.nums.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (nums.length > 0) {
          const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
          const lcmValue = nums.length > 1 ? (math as any).lcm(nums) : nums[0];
          const hcfValue = nums.length > 1 ? (math as any).gcd(nums) : nums[0];
          setResult(`औसत (Average) = ${avg.toFixed(2)}\nलघुत्तम समापवर्त्य (LCM) = ${lcmValue}\nमहत्तम समापवर्तक (HCF) = ${hcfValue}`);
        }
      } else if (topic === 'ratio') {
        const a = parseFloat(inputs.a);
        const b = parseFloat(inputs.b);
        const c = parseFloat(inputs.c);
        const d = parseFloat(inputs.d);
        if (a && b && c) setResult(`चौथा अनुपात (d) = ${(b * c) / a}`);
        else if (a && b && d) setResult(`तीसरा अनुपात (c) = ${(a * d) / b}`);
      } else if (topic === 'geometry') {
        const shape = inputs.shape || 'square';
        const side = parseFloat(inputs.side);
        const l = parseFloat(inputs.l);
        const w = parseFloat(inputs.w);
        const r = parseFloat(inputs.r);
        const h = parseFloat(inputs.h);

        if (shape === 'square' && side) {
          setResult(`क्षेत्रफल (Area) = ${side * side}\nपरिमाप (Perimeter) = ${4 * side}`);
        } else if (shape === 'rectangle' && l && w) {
          setResult(`क्षेत्रफल (Area) = ${l * w}\nपरिमाप (Perimeter) = ${2 * (l + w)}`);
        } else if (shape === 'circle' && r) {
          setResult(`क्षेत्रफल (Area) = ${(Math.PI * r * r).toFixed(2)}\nपरिधि (Circumference) = ${(2 * Math.PI * r).toFixed(2)}`);
        } else if (shape === 'cube' && side) {
          setResult(`आयतन (Volume) = ${Math.pow(side, 3)}\nपृष्ठीय क्षेत्रफल (Surface Area) = ${6 * side * side}`);
        } else if (shape === 'cylinder' && r && h) {
          setResult(`आयतन (Volume) = ${(Math.PI * r * r * h).toFixed(2)}\nवक्र पृष्ठीय क्षेत्रफल (CSA) = ${(2 * Math.PI * r * h).toFixed(2)}`);
        }
      } else if (topic === 'numbers') {
        const val = inputs.val;
        const fromBase = parseInt(inputs.fromBase || '10');
        const toBase = parseInt(inputs.toBase || '2');
        if (val) {
          try {
            const decimal = parseInt(val, fromBase);
            if (isNaN(decimal)) throw new Error();
            setResult(`Decimal: ${decimal}\nBinary: ${decimal.toString(2)}\nOctal: ${decimal.toString(8)}\nHex: ${decimal.toString(16).toUpperCase()}\n\nSelected Result (${toBase}): ${decimal.toString(toBase).toUpperCase()}`);
          } catch {
            setResult("Invalid input for selected base");
          }
        }
      } else if (topic === 'roman') {
        const val = inputs.val?.toUpperCase();
        const mode = inputs.mode || 'decToRom';
        if (!val) return;

        const romanToDecimal = (str: string) => {
          const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
          let res = 0;
          for (let i = 0; i < str.length; i++) {
            const curr = map[str[i]];
            const next = map[str[i + 1]];
            if (next > curr) {
              res += next - curr;
              i++;
            } else {
              res += curr;
            }
          }
          return res;
        };

        const decimalToRoman = (num: number) => {
          const map: [number, string][] = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
          ];
          let res = '';
          for (const [val, char] of map) {
            while (num >= val) {
              res += char;
              num -= val;
            }
          }
          return res;
        };

        if (mode === 'decToRom') {
          const num = parseInt(val);
          if (num > 0 && num < 4000) setResult(`Roman: ${decimalToRoman(num)}`);
          else setResult("Please enter 1-3999");
        } else {
          if (/^[IVXLCDM]+$/.test(val)) setResult(`Decimal: ${romanToDecimal(val)}`);
          else setResult("Invalid Roman Numeral");
        }
      }
    } catch (err) {
      setResult("Error in calculation");
    }
  };

  const clearInputs = () => {
    setInputs({
      val1: '', type1: inputs.type1, val2: '', type2: inputs.type2,
      p: '', r: '', t: '', nums: '', val: '', fromBase: '10', toBase: '2', mode: 'decToRom'
    });
    setResult(null);
  };

  const swap = () => {
    setInputs(prev => ({
      ...prev,
      type1: prev.type2,
      type2: prev.type1,
      val1: prev.val2,
      val2: prev.val1
    }));
  };

  const renderInputs = () => {
    const config = topicConfig[topic];
    if (config) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <input 
              type={(topic === 'roman' && inputs.type1 === 'rom') || (topic === 'numbers' && inputs.type1 !== '10') ? "text" : "number"}
              value={inputs.val1}
              onChange={(e) => setInputs({...inputs, val1: e.target.value})}
              placeholder="0"
              className="w-full text-2xl font-bold p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <select 
              value={inputs.type1}
              onChange={(e) => setInputs({...inputs, type1: e.target.value})}
              className="w-full p-2 text-sm bg-transparent text-slate-500 dark:text-zinc-400 font-medium outline-none"
            >
              {config.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={swap}
              className="p-3 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/30 active:scale-90 transition-transform"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <input 
              type={(topic === 'roman' && inputs.type2 === 'rom') || (topic === 'numbers' && inputs.type2 !== '10') ? "text" : "number"}
              value={inputs.val2}
              onChange={(e) => setInputs({...inputs, val2: e.target.value})}
              placeholder="0"
              className="w-full text-2xl font-bold p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <select 
              value={inputs.type2}
              onChange={(e) => setInputs({...inputs, type2: e.target.value})}
              className="w-full p-2 text-sm bg-transparent text-slate-500 dark:text-zinc-400 font-medium outline-none"
            >
              {config.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>
      );
    }

    switch (topic) {
      case 'interest':
        return (
          <div className="space-y-4">
            <MathInput label="मूलधन (Principal)" name="p" value={inputs.p} onChange={(v) => setInputs({...inputs, p: v})} />
            <MathInput label="दर (Rate %)" name="r" value={inputs.r} onChange={(v) => setInputs({...inputs, r: v})} />
            <MathInput label="समय (Time - Years)" name="t" value={inputs.t} onChange={(v) => setInputs({...inputs, t: v})} />
          </div>
        );
      case 'stock':
        return (
          <div className="space-y-4">
            <MathInput label="मूल्य (Price)" name="price" value={inputs.price} onChange={(v) => setInputs({...inputs, price: v})} />
            <MathInput label="छूट (Discount %)" name="discount" value={inputs.discount} onChange={(v) => setInputs({...inputs, discount: v})} />
          </div>
        );
      case 'arithmetic':
        return (
          <MathInput label="संख्याएं (Numbers separated by comma)" name="nums" value={inputs.nums} onChange={(v) => setInputs({...inputs, nums: v})} placeholder="10, 20, 30" />
        );
      case 'ratio':
        return (
          <div className="space-y-4">
            <p className="text-[10px] text-slate-400 italic">Format: a : b = c : d (किसी भी 3 को भरें)</p>
            <div className="grid grid-cols-2 gap-2">
              <MathInput label="a" name="a" value={inputs.a} onChange={(v) => setInputs({...inputs, a: v})} />
              <MathInput label="b" name="b" value={inputs.b} onChange={(v) => setInputs({...inputs, b: v})} />
              <MathInput label="c" name="c" value={inputs.c} onChange={(v) => setInputs({...inputs, c: v})} />
              <MathInput label="d" name="d" value={inputs.d} onChange={(v) => setInputs({...inputs, d: v})} />
            </div>
          </div>
        );
      case 'geometry':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">आकार (Shape)</label>
              <select 
                value={inputs.shape || 'square'} 
                onChange={(e) => setInputs({...inputs, shape: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none"
              >
                <option value="square">वर्ग (Square)</option>
                <option value="rectangle">आयत (Rectangle)</option>
                <option value="circle">वृत्त (Circle)</option>
                <option value="cube">घन (Cube)</option>
                <option value="cylinder">बेलन (Cylinder)</option>
              </select>
            </div>
            {(inputs.shape === 'square' || inputs.shape === 'cube' || !inputs.shape) && (
              <MathInput label="भुजा (Side)" name="side" value={inputs.side} onChange={(v) => setInputs({...inputs, side: v})} />
            )}
            {inputs.shape === 'rectangle' && (
              <>
                <MathInput label="लंबाई (Length)" name="l" value={inputs.l} onChange={(v) => setInputs({...inputs, l: v})} />
                <MathInput label="चौड़ाई (Width)" name="w" value={inputs.w} onChange={(v) => setInputs({...inputs, w: v})} />
              </>
            )}
            {(inputs.shape === 'circle' || inputs.shape === 'cylinder') && (
              <MathInput label="त्रिज्या (Radius)" name="r" value={inputs.r} onChange={(v) => setInputs({...inputs, r: v})} />
            )}
            {inputs.shape === 'cylinder' && (
              <MathInput label="ऊंचाई (Height)" name="h" value={inputs.h} onChange={(v) => setInputs({...inputs, h: v})} />
            )}
          </div>
        );
      case 'numbers':
      case 'roman':
        return null; // Handled by config
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Topic (विषय)</label>
        <select 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        >
          {topics.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {renderInputs()}
        <div className="flex gap-3">
          <button 
            onClick={calculate}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            गणना करें (Calculate)
          </button>
          <button 
            onClick={clearInputs}
            className="px-6 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-bold rounded-xl active:scale-95 transition-all"
          >
            साफ (Clear)
          </button>
        </div>
        {result && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30 whitespace-pre-line">
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">परिणाम (Result)</div>
            <div className="text-lg font-bold text-slate-800 dark:text-zinc-100">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MathInput({ label, name, value, onChange, placeholder }: { label: string, name: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
      <input 
        type={name === 'nums' ? 'text' : 'number'}
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder || "दर्ज करें"}
        className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

function GSTCalculator() {
  const [price, setPrice] = useState('');
  const [rate, setRate] = useState('18');
  
  const gst = (parseFloat(price) || 0) * (parseFloat(rate) || 0) / 100;
  const total = (parseFloat(price) || 0) + gst;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
        <Percent className="text-rose-500" size={20} /> जीएसटी कैलकुलेटर (GST)
      </h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">मूल मूल्य (Base Price)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="राशि दर्ज करें"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">जीएसटी दर (%) (GST Rate)</label>
          <input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(e.target.value)} 
            placeholder="दर"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="pt-4 space-y-3">
          <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">जीएसटी राशि (GST Amount)</span>
            <span className="text-lg font-bold text-rose-700 dark:text-rose-300">+{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">कुल मूल्य (Total Price)</span>
            <span className="text-xl font-bold text-slate-900 dark:text-zinc-100">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const savings = (parseFloat(price) || 0) * (parseFloat(discount) || 0) / 100;
  const final = (parseFloat(price) || 0) - savings;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
        <Tag className="text-green-500" size={20} /> छूट कैलकुलेटर (Discount)
      </h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">असली कीमत (Original Price)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="कीमत दर्ज करें"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">छूट (%) (Discount)</label>
          <input 
            type="number" 
            value={discount} 
            onChange={(e) => setDiscount(e.target.value)} 
            placeholder="छूट प्रतिशत"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="pt-4 space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">आपकी बचत (You Save)</span>
            <span className="text-lg font-bold text-green-700 dark:text-green-300">-{savings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">अंतिम कीमत (Final Price)</span>
            <span className="text-xl font-bold text-slate-900 dark:text-zinc-100">{final.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const bmi = (parseFloat(weight) || 0) / ((parseFloat(height) || 1) ** 2);
  
  const getCategory = (val: number) => {
    if (val < 18.5) return { label: 'कम वजन (Underweight)', color: 'text-blue-500' };
    if (val < 25) return { label: 'सामान्य (Normal)', color: 'text-green-500' };
    if (val < 30) return { label: 'अधिक वजन (Overweight)', color: 'text-orange-500' };
    return { label: 'मोटापा (Obese)', color: 'text-red-500' };
  };

  const category = getCategory(bmi);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
        <User className="text-teal-500" size={20} /> बीएमआई कैलकुलेटर (BMI)
      </h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">वजन (Weight - kg)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            placeholder="वजन किलोग्राम में"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">ऊंचाई (Height - meters)</label>
          <input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            placeholder="ऊंचाई मीटर में (उदा. 1.75)"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {parseFloat(weight) > 0 && parseFloat(height) > 0 && (
          <div className="pt-4 text-center space-y-2">
            <div className="text-sm text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-widest">आपका बीएमआई (Your BMI)</div>
            <div className="text-5xl font-black text-slate-900 dark:text-zinc-100">{bmi.toFixed(1)}</div>
            <div className={`text-lg font-bold ${category.color}`}>{category.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6 text-slate-700 dark:text-zinc-300">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Privacy Policy</h2>
      <p className="text-sm italic">Last Updated: April 02, 2026</p>
      
      <section className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">1. Introduction</h3>
        <p className="text-sm leading-relaxed">
          Welcome to <strong>NIRAJ SCIENTIFIC CALCULATOR</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we handle information when you use our application.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">2. Data Collection</h3>
        <p className="text-sm leading-relaxed">
          Our application is designed to be a utility tool. We <strong>do not collect</strong> any personally identifiable information (PII) such as your name, email address, or location. 
          All calculations and data processing happen locally on your device.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">3. Local Storage</h3>
        <p className="text-sm leading-relaxed">
          The application may use your device's local storage to save your calculation history and theme preferences. This data remains on your device and is not transmitted to our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">4. Advertisements</h3>
        <p className="text-sm leading-relaxed">
          We may display advertisements from third-party networks. These networks may use cookies or similar technologies to serve personalized ads. Please refer to their respective privacy policies for more information.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">5. Contact Us</h3>
        <p className="text-sm leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at: <strong>mahaveerprasad9125425127@gmail.com</strong>
        </p>
      </section>

      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <p className="text-[10px] text-center text-slate-400">© 2026 NIRAJ SCIENTIFIC CALCULATOR. All rights reserved.</p>
      </div>
    </div>
  );
}

function FormulaLibrary() {
  const [activeTab, setActiveTab] = useState<'math' | 'physics'>('math');
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const data = {
    math: [
      {
        category: { en: "Algebra", hi: "बीजगणित" },
        topics: [
          { 
            name: { en: "Basic Identities", hi: "मूल सर्वसमिकाएँ" }, 
            formulas: [
              "(a + b)² = a² + 2ab + b²",
              "(a - b)² = a² - 2ab + b²",
              "(a + b)² = (a - b)² + 4ab",
              "(a - b)² = (a + b)² - 4ab",
              "(a + b)² + (a - b)² = 2(a² + b²)",
              "(a + b)² - (a - b)² = 4ab",
              "a² + b² = (a + b)² - 2ab",
              "a² + b² = (a - b)² + 2ab",
              "ab = ((a + b)/2)² - ((a - b)/2)²"
            ] 
          },
          {
            name: { en: "Extended Identities", hi: "विस्तारित सर्वसमिकाएँ" },
            formulas: [
              "(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)",
              "a² - b² = (a + b)(a - b)",
              "(a² + ab + b²)(a² - ab + b²) = a⁴ + a²b² + b⁴",
              "a² + b² + c² - ab - bc - ca = 1/2[(a - b)² + (b - c)² + (c - a)²]",
              "(x + a)(x + b) = x² + (a + b)x + ab",
              "(x + a)(x - b) = x² + (a - b)x - ab",
              "(x - a)(x + b) = x² + (b - a)x - ab",
              "(x - a)(x - b) = x² - (a + b)x + ab"
            ]
          },
          {
            name: { en: "Cubic Identities", hi: "त्रिघातीय सर्वसमिकाएँ" },
            formulas: [
              "(a + b)³ = a³ + 3a²b + 3ab² + b³",
              "(a - b)³ = a³ - 3a²b + 3ab² - b³",
              "a³ + b³ = (a + b)(a² - ab + b²)",
              "a³ - b³ = (a - b)(a² + ab + b²)",
              "a³ + b³ + c³ - 3abc = (a + b + c)(a² + b² + c² - ab - bc - ca)",
              "a³ + b³ + c³ - 3abc = 1/2 (a + b + c)[(a - b)² + (b - c)² + (c - a)²]"
            ]
          },
          {
            name: { en: "Quadratic Equation", hi: "द्विघात समीकरण" },
            formulas: [
              "ax² + bx + c = 0",
              "x = [-b ± √(b² - 4ac)] / 2a",
              "D = b² - 4ac",
              "Sum of roots (α + β) = -b/a",
              "Product of roots (αβ) = c/a"
            ]
          },
          {
            name: { en: "Straight Line", hi: "सरल रेखा" },
            formulas: [
              "Distance Formula: d = √[(x₁-x₂)² + (y₁-y₂)²]",
              "Section Formula: x = (mx₂ ± nx₁) / (m ± n)",
              "Slope (m) = (y₂ - y₁) / (x₂ - x₁)",
              "Equation: y - y₁ = m(x - x₁)",
              "General Form: ax + by + c = 0",
              "Angle: tan θ = |(m₁ - m₂) / (1 + m₁m₂)|"
            ]
          }
        ]
      },
      {
        category: { en: "Geometry", hi: "ज्यामिति" },
        topics: [
          {
            name: { en: "2D Shapes", hi: "2D आकृतियाँ" },
            formulas: [
              lang === 'hi' ? "वर्ग का क्षेत्रफल = a²" : "Square Area = a²",
              lang === 'hi' ? "वर्ग का परिमाप = 4a" : "Square Perimeter = 4a",
              lang === 'hi' ? "आयत का क्षेत्रफल = l × b" : "Rectangle Area = l × b",
              lang === 'hi' ? "आयत का परिमाप = 2(l + b)" : "Rectangle Perimeter = 2(l + b)",
              lang === 'hi' ? "त्रिभुज का क्षेत्रफल = 1/2 × आधार × ऊँचाई" : "Triangle Area = 1/2 × base × height",
              lang === 'hi' ? "वृत्त का क्षेत्रफल = πr²" : "Circle Area = πr²",
              lang === 'hi' ? "वृत्त की परिधि = 2πr" : "Circle Circumference = 2πr"
            ]
          },
          {
            name: { en: "3D Shapes", hi: "3D आकृतियाँ" },
            formulas: [
              lang === 'hi' ? "घन का आयतन = a³" : "Cube Volume = a³",
              lang === 'hi' ? "घन का पृष्ठ क्षेत्रफल = 6a²" : "Cube Surface Area = 6a²",
              lang === 'hi' ? "घनाभ का आयतन = l × b × h" : "Cuboid Volume = l × b × h",
              lang === 'hi' ? "बेलन का आयतन = πr²h" : "Cylinder Volume = πr²h",
              lang === 'hi' ? "गोले का आयतन = 4/3 πr³" : "Sphere Volume = 4/3 πr³",
              lang === 'hi' ? "शंकु का आयतन = 1/3 πr²h" : "Cone Volume = 1/3 πr²h"
            ]
          }
        ]
      },
      {
        category: { en: "Trigonometry", hi: "त्रिकोणमिति" },
        topics: [
          {
            name: { en: "Basic Ratios", hi: "मूल अनुपात" },
            formulas: [
              "sinθ = P / H",
              "cosθ = B / H",
              "tanθ = P / B",
              "cosecθ = 1/sinθ",
              "secθ = 1/cosθ",
              "cotθ = 1/tanθ"
            ]
          },
          {
            name: { en: "Identities", hi: "सर्वसमिकाएँ" },
            formulas: [
              "sin²θ + cos²θ = 1",
              "1 + tan²θ = sec²θ",
              "1 + cot²θ = cosec²θ",
              "sin(90-θ) = cosθ",
              "cos(90-θ) = sinθ",
              "sin(A±B) = sinAcosB ± cosAsinB",
              "cos(A±B) = cosAcosB ∓ sinAsinB",
              "tan(A±B) = (tanA±tanB) / (1∓tanAtanB)"
            ]
          }
        ]
      },
      {
        category: { en: "Sequence & Series", hi: "अनुक्रम और श्रेणी" },
        topics: [
          {
            name: { en: "Arithmetic Progression (AP)", hi: "समान्तर श्रेणी (AP)" },
            formulas: [
              "n-th term: aₙ = a + (n-1)d",
              "Sum of n terms: Sₙ = n/2 [2a + (n-1)d]",
              "Arithmetic Mean: A = (a+b)/2"
            ]
          },
          {
            name: { en: "Geometric Progression (GP)", hi: "गुणोत्तर श्रेणी (GP)" },
            formulas: [
              "n-th term: aₙ = arⁿ⁻¹",
              "Sum of n terms: Sₙ = a(rⁿ-1)/(r-1)",
              "Infinite Sum: S∞ = a/(1-r) [|r|<1]",
              "Geometric Mean: G = √(ab)"
            ]
          }
        ]
      },
      {
        category: { en: "Permutation & Combination", hi: "क्रमचय और संचय" },
        topics: [
          {
            name: { en: "Basic Formulas", hi: "मूल सूत्र" },
            formulas: [
              "nPr = n! / (n-r)!",
              "nCr = n! / [r!(n-r)!]",
              "nCr = nPr / r!",
              "nC₀ = nCₙ = 1",
              "nCr = nCₙ₋ᵣ"
            ]
          }
        ]
      },
      {
        category: { en: "Probability", hi: "प्रायिकता" },
        topics: [
          {
            name: { en: "Basic Probability", hi: "मूल प्रायिकता" },
            formulas: [
              "P(A) = n(A) / n(S)",
              "0 ≤ P(A) ≤ 1",
              "P(A) + P(A') = 1",
              "P(A∪B) = P(A) + P(B) - P(A∩B)"
            ]
          }
        ]
      },
      {
        category: { en: "Complex Number", hi: "सम्मिश्र संख्या" },
        topics: [
          {
            name: { en: "Representation", hi: "निरूपण" },
            formulas: [
              "z = a + ib",
              "i = √(-1), i² = -1",
              "Modulus: |z| = √(a² + b²)",
              "Conjugate: z̄ = a - ib"
            ]
          }
        ]
      },
      {
        category: { en: "Calculus", hi: "कलन" },
        topics: [
          {
            name: { en: "Limits", hi: "सीमा" },
            formulas: [
              "lim (x→0) sinx/x = 1",
              "lim (x→0) tanx/x = 1",
              "lim (x→0) (eˣ-1)/x = 1",
              "lim (x→a) (xⁿ-aⁿ)/(x-a) = naⁿ⁻¹"
            ]
          },
          {
            name: { en: "Derivatives", hi: "अवकलन" },
            formulas: [
              "d/dx (xⁿ) = n xⁿ⁻¹",
              "d/dx (sinx) = cosx",
              "d/dx (cosx) = -sinx",
              "d/dx (tanx) = sec²x",
              "d/dx (cotx) = -cosec²x",
              "d/dx (secx) = secxtanx",
              "d/dx (log x) = 1/x",
              "d/dx (eˣ) = eˣ"
            ]
          },
          {
            name: { en: "Integrals", hi: "समाकलन" },
            formulas: [
              "∫ xⁿ dx = xⁿ⁺¹ / (n+1)",
              "∫ sinx dx = -cosx",
              "∫ cosx dx = sinx",
              "∫ sec²x dx = tanx",
              "∫ 1/x dx = log|x|",
              "∫ eˣ dx = eˣ"
            ]
          }
        ]
      },
      {
        category: { en: "Conic Sections", hi: "शंकु परिच्छेद" },
        topics: [
          {
            name: { en: "Circle", hi: "वृत्त" },
            formulas: [
              "Standard: x² + y² = r²",
              "General: x² + y² + 2gx + 2fy + c = 0",
              "Center: (-g, -f)",
              "Radius: √(g² + f² - c)"
            ]
          },
          {
            name: { en: "Parabola", hi: "परवलय" },
            formulas: [
              "y² = 4ax",
              "Focus: (a, 0)",
              "Directrix: x = -a",
              "Latus Rectum = 4a"
            ]
          },
          {
            name: { en: "Ellipse", hi: "दीर्घवृत्त" },
            formulas: [
              "x²/a² + y²/b² = 1",
              "Eccentricity: e = √(1 - b²/a²)",
              "Foci: (±ae, 0)",
              "Latus Rectum = 2b²/a"
            ]
          },
          {
            name: { en: "Hyperbola", hi: "अतिपरवलय" },
            formulas: [
              "x²/a² - y²/b² = 1",
              "Eccentricity: e = √(1 + b²/a²)",
              "Foci: (±ae, 0)"
            ]
          }
        ]
      },
      {
        category: { en: "Binomial Theorem", hi: "द्विपद प्रमेय" },
        topics: [
          {
            name: { en: "Expansion", hi: "प्रसार" },
            formulas: [
              "(a+b)ⁿ = ΣⁿCᵣ aⁿ⁻ʳ bʳ",
              "General Term: Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳ bʳ",
              "Total terms = n + 1"
            ]
          }
        ]
      },
      {
        category: { en: "Statistics", hi: "सांख्यिकी" },
        topics: [
          {
            name: { en: "Central Tendency", hi: "केंद्रीय प्रवृत्ति" },
            formulas: [
              "Mean (x̄) = Σx / n",
              "Median: Middle value",
              "Mode: Most frequent value",
              "Relationship: Mode = 3 Median - 2 Mean"
            ]
          }
        ]
      },
      {
        category: { en: "Sets & Relations", hi: "समुच्चय और संबंध" },
        topics: [
          {
            name: { en: "Set Theory", hi: "समुच्चय सिद्धांत" },
            formulas: [
              "n(A∪B) = n(A) + n(B) - n(A∩B)",
              "De Morgan: (A∪B)' = A'∩B'",
              "De Morgan: (A∩B)' = A'∪B'"
            ]
          }
        ]
      },
      {
        category: { en: "Vectors", hi: "सदिश" },
        topics: [
          {
            name: { en: "Product", hi: "गुणनफल" },
            formulas: [
              "Dot Product: a·b = |a||b|cosθ",
              "Cross Product: |a×b| = |a||b|sinθ",
              "Unit Vector: â = a / |a|"
            ]
          }
        ]
      }
    ],
    physics: [
      {
        category: { en: "Mechanics", hi: "यांत्रिकी" },
        topics: [
          {
            name: { en: "Motion", hi: "गति" },
            formulas: [
              lang === 'hi' ? "चाल = दूरी / समय" : "Speed = Distance / Time",
              lang === 'hi' ? "वेग = विस्थापन / समय" : "Velocity = Displacement / Time",
              "v = u + at",
              "s = ut + 1/2 at²",
              "v² = u² + 2as"
            ]
          },
          {
            name: { en: "Newton's Laws", hi: "न्यूटन के नियम" },
            formulas: [
              "F = ma [Second Law]",
              "Impulse: J = FΔt = Δp",
              "Friction: f = μN"
            ]
          },
          {
            name: { en: "Circular Motion", hi: "वृत्तीय गति" },
            formulas: [
              "Centripetal Force: F = mv²/r",
              "Centripetal Accel: a = v²/r = ω²r",
              "Angular Velocity: ω = v/r = 2π/T",
              "Banking of Road: tanθ = v²/rg",
              "Time Period (Conical Pendulum): T = 2π√(Lcosθ/g)"
            ]
          },
          {
            name: { en: "Force & Energy", hi: "बल और ऊर्जा" },
            formulas: [
              lang === 'hi' ? "बल (F) = m × a" : "Force (F) = m × a",
              lang === 'hi' ? "संवेग (p) = m × v" : "Momentum (p) = m × v",
              lang === 'hi' ? "कार्य (W) = F × d cos θ" : "Work (W) = F × d cos θ",
              lang === 'hi' ? "शक्ति (P) = W / t" : "Power (P) = W / t",
              lang === 'hi' ? "गतिज ऊर्जा = 1/2 mv²" : "Kinetic Energy = 1/2 mv²",
              lang === 'hi' ? "स्थितिज ऊर्जा = mgh" : "Potential Energy = mgh",
              "Coefficient of Restitution: e = v₂-v₁ / u₁-u₂"
            ]
          },
          {
            name: { en: "Gravitation", hi: "गुरुत्वाकर्षण" },
            formulas: [
              "F = G m₁m₂ / r²",
              "g = GM / R²",
              "Variation of g with height: g' = g(1 - 2h/R)",
              "Variation of g with depth: g' = g(1 - d/R)",
              "vₑ = √(2gR) [Escape Velocity]",
              "vₒ = √(gR) [Orbital Velocity]"
            ]
          }
        ]
      },
      {
        category: { en: "Waves & Sound", hi: "तरंग और ध्वनि" },
        topics: [
          {
            name: { en: "Basic Properties", hi: "मूल गुण" },
            formulas: [
              "v = fλ",
              "T = 1/f",
              "Wave Equation: y = Asin(ωt ± kx)",
              "Wave Number: k = 2π/λ",
              "Speed of Sound in Air: v ≈ 330 + 0.6T m/s"
            ]
          },
          {
            name: { en: "Doppler Effect", hi: "डॉप्लर प्रभाव" },
            formulas: [
              "f' = f [v ± vₒ] / [v ∓ vₛ]",
              "Apparent λ: λ' = λ [v ∓ vₛ] / v"
            ]
          }
        ]
      },
      {
        category: { en: "Electricity & Magnetism", hi: "विद्युत और चुंबकत्व" },
        topics: [
          {
            name: { en: "Electrostatics", hi: "स्थिरवैद्युतिकी" },
            formulas: [
              "Coulomb's Law: F = k q₁q₂ / r²",
              "Electric Field: E = F / q",
              "Potential: V = k q / r",
              "Capacitance: C = Q / V",
              "Energy in Capacitor: U = 1/2 CV²"
            ]
          },
          {
            name: { en: "Ohm's Law", hi: "ओम का नियम" },
            formulas: [
              "V = I × R",
              lang === 'hi' ? "शक्ति (P) = V × I" : "Power (P) = V × I",
              "P = I²R = V²/R",
              lang === 'hi' ? "श्रेणीक्रम प्रतिरोध = R₁ + R₂" : "Series Resistance = R₁ + R₂",
              lang === 'hi' ? "समांतर क्रम प्रतिरोध = 1/R = 1/R₁ + 1/R₂" : "Parallel Resistance = 1/R = 1/R₁ + 1/R₂"
            ]
          },
          {
            name: { en: "Magnetism", hi: "चुंबकत्व" },
            formulas: [
              "Magnetic Force: F = q(v×B)",
              "Force on Wire: F = ILBsinθ",
              "Biot-Savart Law: dB = (μ₀/4π) I dL sinθ / r²",
              "Magnetic Moment: M = NIA"
            ]
          }
        ]
      },
      {
        category: { en: "Heat & Thermodynamics", hi: "ऊष्मा और ऊष्मागतिकी" },
        topics: [
          {
            name: { en: "Laws of Thermodynamics", hi: "ऊष्मागतिकी के नियम" },
            formulas: [
              "ΔQ = ΔU + ΔW [First Law]",
              "Efficiency (η) = 1 - T₂/T₁",
              "Ideal Gas Law: PV = nRT"
            ]
          }
        ]
      },
      {
        category: { en: "Optics", hi: "प्रकाशिकी" },
        topics: [
          {
            name: { en: "Reflection & Refraction", hi: "परावर्तन और अपवर्तन" },
            formulas: [
              "Mirror Formula: 1/f = 1/v + 1/u",
              "Lens Formula: 1/f = 1/v - 1/u",
              "Snell's Law: n₁sinθ₁ = n₂sinθ₂",
              "Power of Lens: P = 1/f"
            ]
          }
        ]
      },
      {
        category: { en: "Modern Physics", hi: "आधुनिक भौतिकी" },
        topics: [
          {
            name: { en: "Photoelectric Effect", hi: "प्रकाश विद्युत प्रभाव" },
            formulas: [
              "E = hf = hc/λ",
              "Kₘₐₓ = hf - Φ",
              "de Broglie: λ = h/p = h/mv"
            ]
          },
          {
            name: { en: "Radioactivity", hi: "रेдиоधर्मिता" },
            formulas: [
              "N = N₀ e⁻λᵗ",
              "Half Life: T₁/₂ = 0.693 / λ"
            ]
          }
        ]
      },
      {
        category: { en: "Fluid Mechanics", hi: "तरल यांत्रिकी" },
        topics: [
          {
            name: { en: "Pressure & Flow", hi: "दाब और प्रवाह" },
            formulas: [
              "Pressure: P = F/A = ρgh",
              "Bernoulli's: P + 1/2 ρv² + ρgh = constant",
              "Continuity: A₁v₁ = A₂v₂"
            ]
          }
        ]
      },
      {
        category: { en: "Units & Dimensions", hi: "मात्रक और विमा" },
        topics: [
          {
            name: { en: "SI Units", hi: "SI मात्रक" },
            formulas: [
              lang === 'hi' ? "लंबाई: मीटर (m)" : "Length: Metre (m)",
              lang === 'hi' ? "द्रव्यमान: किलोग्राम (kg)" : "Mass: Kilogram (kg)",
              lang === 'hi' ? "समय: सेकंड (s)" : "Time: Second (s)",
              lang === 'hi' ? "विद्युत धारा: एम्पियर (A)" : "Electric Current: Ampere (A)",
              lang === 'hi' ? "तापमान: केल्विन (K)" : "Temperature: Kelvin (K)"
            ]
          }
        ]
      }
    ]
  };

  const currentData = activeTab === 'math' ? data.math : data.physics;

  const filteredData = currentData.map(cat => ({
    ...cat,
    topics: cat.topics.map(topic => ({
      ...topic,
      formulas: topic.formulas.filter(f => 
        f.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.name[lang].toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(topic => topic.formulas.length > 0)
  })).filter(cat => cat.topics.length > 0);

  return (
    <div className="space-y-4">
      <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Library size={24} /> {lang === 'hi' ? 'सूत्र संग्रह' : 'Formula Library'}
          </h2>
          <div className="flex bg-white/20 p-1 rounded-lg">
            <button 
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${lang === 'hi' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/10'}`}
            >
              हिन्दी
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${lang === 'en' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/10'}`}
            >
              English
            </button>
          </div>
        </div>
        
        <div className="flex bg-white/20 p-1 rounded-lg self-start">
          <button 
            onClick={() => { setActiveTab('math'); setActiveCategory(0); }}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'math' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/10'}`}
          >
            {lang === 'hi' ? 'गणित' : 'Math'}
          </button>
          <button 
            onClick={() => { setActiveTab('physics'); setActiveCategory(0); }}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'physics' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/10'}`}
          >
            {lang === 'hi' ? 'भौतिकी' : 'Physics'}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'hi' ? "सूत्र खोजें..." : "Search formulas..."}
          className="w-full p-4 pl-12 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {currentData.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeCategory === idx ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
            >
              {item.category[lang]}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {(searchQuery ? filteredData : [currentData[activeCategory]]).map((cat, cIdx) => (
          cat?.topics.map((topic, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`${cIdx}-${idx}`} 
              className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm"
            >
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                <ChevronRight size={16} /> {topic.name[lang]}
              </h3>
              <div className="space-y-2">
                {topic.formulas.map((formula, fIdx) => {
                  const id = `formula-${cIdx}-${idx}-${fIdx}`;
                  return (
                    <div key={fIdx} className="group relative p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl font-mono text-sm text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                      <span dangerouslySetInnerHTML={{ 
                        __html: formula
                          .replace(/\^2/g, '<sup>2</sup>')
                          .replace(/\^3/g, '<sup>3</sup>')
                          .replace(/\^4/g, '<sup>4</sup>')
                          .replace(/\^n/g, '<sup>n</sup>')
                          .replace(/\^n-1/g, '<sup>n-1</sup>')
                          .replace(/\^n\+1/g, '<sup>n+1</sup>')
                          .replace(/₁/g, '<sub>1</sub>')
                          .replace(/₂/g, '<sub>2</sub>')
                      }} />
                      <button 
                        onClick={() => copyToClipboard(formula, id)}
                        className="p-2 text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1"
                      >
                        {copiedIdx === id ? (
                          <>
                            <Check size={14} className="text-green-500" />
                            <span className="text-[8px] text-green-500 font-bold uppercase">
                              {lang === 'hi' ? 'कॉपी' : 'Copied'}
                            </span>
                          </>
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        ))}
      </div>
    </div>
  );
}

function SymbolsLibrary() {
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const symbolGroups = [
    {
      name: "Basic Operations",
      symbols: [
        { char: "+", desc: "Addition" },
        { char: "−", desc: "Subtraction" },
        { char: "×", desc: "Multiplication" },
        { char: "÷", desc: "Division" },
        { char: "=", desc: "Equal" },
        { char: "≠", desc: "Not Equal" },
        { char: "≈", desc: "Approx" },
        { char: ">", desc: "Greater than" },
        { char: "<", desc: "Less than" },
        { char: "≥", desc: "Greater Equal" },
        { char: "≤", desc: "Less Equal" }
      ]
    },
    {
      name: "Roots & Powers",
      symbols: [
        { char: "√", desc: "Square Root" },
        { char: "∛", desc: "Cube Root" },
        { char: "^", desc: "Power" },
        { char: "π", desc: "Pi" },
        { char: "∞", desc: "Infinity" },
        { char: "%", desc: "Percentage" }
      ]
    },
    {
      name: "Advanced Math",
      symbols: [
        { char: "∑", desc: "Summation" },
        { char: "∏", desc: "Product" },
        { char: "Δ", desc: "Delta / Change" },
        { char: "∫", desc: "Integration" },
        { char: "d/dx", desc: "Derivative" }
      ]
    },
    {
      name: "Geometry & Angles",
      symbols: [
        { char: "θ", desc: "Theta" },
        { char: "α", desc: "Alpha" },
        { char: "β", desc: "Beta" },
        { char: "γ", desc: "Gamma" },
        { char: "⊥", desc: "Perpendicular" },
        { char: "∥", desc: "Parallel" },
        { char: "°", desc: "Degree" },
        { char: "′", desc: "Minute" },
        { char: "″", desc: "Second" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-500 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Zap size={24} /> गणितीय चिह्न (Math Symbols)
          </h2>
          <p className="text-xs text-yellow-100 opacity-80">कॉपी करने के लिए किसी भी चिह्न पर क्लिक करें</p>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-6">
        {symbolGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{group.name}</h3>
            <div className="grid grid-cols-4 gap-2">
              {group.symbols.map((s, sIdx) => {
                const id = `sym-${gIdx}-${sIdx}`;
                return (
                  <button
                    key={sIdx}
                    onClick={() => copyToClipboard(s.char, id)}
                    className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-1 active:scale-90 transition-all hover:border-yellow-200 dark:hover:border-yellow-900/50"
                  >
                    <span className="text-xl font-bold text-slate-800 dark:text-zinc-100">{s.char}</span>
                    <span className="text-[8px] text-slate-400 truncate w-full text-center">{copiedIdx === id ? 'Copied!' : s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [stats, setStats] = useState({
    distance: 0,
    time: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    currentSpeed: 0,
    startTime: 0
  });
  const lastPosRef = React.useRef<GeolocationCoordinates | null>(null);
  const statsRef = React.useRef(stats);
  const watchId = React.useRef<number | null>(null);
  const timerId = React.useRef<any>(null);

  // Keep statsRef in sync
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Request permission explicitly if needed (some browsers)
    navigator.geolocation.getCurrentPosition(() => {}, () => {});

    setIsTracking(true);
    const now = Date.now();
    setStats({ distance: 0, time: 0, avgSpeed: 0, maxSpeed: 0, currentSpeed: 0, startTime: now });
    lastPosRef.current = null;
    
    timerId.current = setInterval(() => {
      setStats(prev => ({ ...prev, time: Math.floor((Date.now() - prev.startTime) / 1000) }));
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = position.coords;
        const now = Date.now();
        
        // Calculate manual speed if coords.speed is null
        let currentSpeed = coords.speed ? coords.speed * 3.6 : 0; // km/h
        
        if (lastPosRef.current) {
          const d = calculateDistance(lastPosRef.current.latitude, lastPosRef.current.longitude, coords.latitude, coords.longitude);
          const timeDiff = (now - (lastPosRef.current as any).timestamp) / 1000; // seconds
          
          if (currentSpeed === 0 && d > 0 && timeDiff > 0) {
            currentSpeed = (d / (timeDiff / 3600)); // manual km/h
          }

          // Relaxed filtering for better real-time response
          // 1. Accuracy check (up to 150m is okay for general tracking)
          // 2. Movement threshold (0.2 meter = 0.0002 km)
          const isMoving = d > 0.0002 && coords.accuracy < 150;

          setStats(prev => {
            const newDist = isMoving ? prev.distance + d : prev.distance;
            const timeInHours = (now - prev.startTime) / 3600000;
            const newMaxSpeed = Math.max(prev.maxSpeed, currentSpeed);
            const newAvgSpeed = timeInHours > 0 ? (newDist / timeInHours) : 0;
            
            return {
              ...prev,
              distance: newDist,
              currentSpeed: currentSpeed > 0.3 ? currentSpeed : 0,
              maxSpeed: newMaxSpeed,
              avgSpeed: newAvgSpeed
            };
          });
        } else {
          setStats(prev => ({ ...prev, currentSpeed: currentSpeed > 0.3 ? currentSpeed : 0 }));
        }
        
        // Store timestamp and coords in a new object to avoid read-only issues
        lastPosRef.current = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          timestamp: now
        } as any;
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.code === 1) alert("Please allow location access to use the tracker.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (timerId.current) clearInterval(timerId.current);
    lastPosRef.current = null;
    watchId.current = null;
  };

  const formatDistance = (km: number) => {
    if (km < 0.001) { // Less than 1 meter
      const cm = km * 100000;
      return `${cm.toFixed(1)} cm`;
    }
    if (km < 1) { // Less than 1 km
      const m = km * 1000;
      return `${m.toFixed(1)} m`;
    }
    return `${km.toFixed(3)} km`;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Navigation size={24} /> लाइव ट्रैकर (Live Tracker)
          </h2>
          <p className="text-xs text-blue-100 opacity-80">दूरी, गति और समय की वास्तविक ट्रैकिंग</p>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center col-span-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center justify-center gap-2">
            वर्तमान गति (Current Speed)
            {isTracking && <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />}
          </div>
          <div className={`text-4xl font-black transition-colors ${isTracking ? 'text-blue-600' : 'text-slate-300'}`}>
            {isTracking && !lastPosRef.current ? (
              <span className="text-sm animate-pulse text-orange-500">GPS सिग्नल खोज रहे हैं... (Searching...)</span>
            ) : (
              <>
                {stats.currentSpeed.toFixed(1)} <span className="text-xs">km/h</span>
              </>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">कुल दूरी (Distance)</div>
          <div className="text-2xl font-black text-blue-600">{formatDistance(stats.distance)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">कुल समय (Time)</div>
          <div className="text-2xl font-black text-blue-600">{formatTime(stats.time)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">औसत गति (Avg Speed)</div>
          <div className="text-2xl font-black text-blue-600">{stats.avgSpeed.toFixed(1)} <span className="text-xs">km/h</span></div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">अधिकतम गति (Max Speed)</div>
          <div className="text-2xl font-black text-blue-600">{stats.maxSpeed.toFixed(1)} <span className="text-xs">km/h</span></div>
        </div>
      </div>

      <div className="flex justify-center pt-4 flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700">
            <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              {isTracking ? 'GPS सक्रिय है (Active)' : 'GPS बंद है (Inactive)'}
            </span>
            {isTracking && lastPosRef.current && (
              <div className="flex items-center gap-1 ml-2 border-l border-slate-300 dark:border-zinc-700 pl-2">
                <span className="text-[8px] font-bold text-slate-400">सिग्नल:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`w-1 rounded-t-sm ${
                        (lastPosRef.current as any).accuracy < (200 / i) 
                          ? 'bg-green-500' 
                          : 'bg-slate-200 dark:bg-zinc-700'
                      }`} 
                      style={{ height: `${i * 3}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        {!isTracking ? (
          <button 
            onClick={startTracking}
            className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <Play size={20} fill="currentColor" /> ट्रैकिंग शुरू करें (Start)
          </button>
        ) : (
          <button 
            onClick={stopTracking}
            className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-500/30 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <Square size={20} fill="currentColor" /> ट्रैकिंग रोकें (Stop)
          </button>
        )}
      </div>

      {isTracking && (
        <div className="flex items-center justify-center gap-2 text-blue-500 font-bold text-xs animate-pulse">
          <div className="w-2 h-2 bg-blue-500 rounded-full" /> GPS सक्रिय है...
        </div>
      )}
    </div>
  );
}

function GraphPlotter() {
  const [equation, setEquation] = useState('x^2');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 40; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    if (document.documentElement.classList.contains('dark')) ctx.strokeStyle = '#27272a';

    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke();

    // Plot equation
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      try {
        const y = math.evaluate(equation, { x });
        const py = centerY - (y * scale);
        
        if (py >= 0 && py <= height) {
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        } else {
          first = true;
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [equation]);

  return (
    <div className="space-y-4">
      <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LineChart size={24} /> ग्राफ विश्लेषण (Graph Plotter)
        </h2>
        <p className="text-xs opacity-80 mt-1">समीकरणों का दृश्य विश्लेषण</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase">समीकरण (Equation) y =</label>
        <input 
          type="text" 
          value={equation} 
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g. x^2, sin(x), 2*x + 1"
          className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none font-mono text-lg focus:ring-2 focus:ring-rose-500"
        />
        <div className="flex flex-wrap gap-2">
          {['x^2', 'sin(x)', 'cos(x)', 'log(x)', 'abs(x)'].map(ex => (
            <button 
              key={ex} 
              onClick={() => setEquation(ex)}
              className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={350} 
          height={350} 
          className="max-w-full h-auto rounded-xl"
        />
      </div>
      <p className="text-[10px] text-center text-slate-400 italic">पिंच ज़ूम या स्क्रॉल से ग्राफ देखें (Canvas based)</p>
    </div>
  );
}

function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const lastAccelRef = React.useRef(0);
  const lastStepTimeRef = React.useRef(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    if (isCounting) {
      const handleMotion = (event: DeviceMotionEvent) => {
        const accel = event.accelerationIncludingGravity || event.acceleration;
        if (!accel) return;
        
        const magnitude = Math.sqrt(
          (accel.x || 0) ** 2 + 
          (accel.y || 0) ** 2 + 
          (accel.z || 0) ** 2
        );

        if (lastAccelRef.current === 0) {
          lastAccelRef.current = magnitude;
          return;
        }

        const delta = Math.abs(magnitude - lastAccelRef.current);
        const now = Date.now();

        // Lower threshold for better sensitivity (9.0 instead of 11)
        // Debounce to 250ms for faster steps
        if (delta > 9.0 && (now - lastStepTimeRef.current) > 250) { 
          setSteps(prev => prev + 1);
          lastStepTimeRef.current = now;
        }
        lastAccelRef.current = magnitude;
      };

      const startListening = () => {
        window.addEventListener('devicemotion', handleMotion);
        setPermissionGranted(true);
      };

      // Request permission for iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              startListening();
            } else {
              setPermissionGranted(false);
              alert("Motion permission denied. Step counter won't work.");
            }
          })
          .catch((err: any) => {
            console.error(err);
            setPermissionGranted(false);
          });
      } else {
        startListening();
      }

      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [isCounting]);

  return (
    <div className="space-y-6">
      <div className="bg-orange-500 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Footprints size={24} /> स्टेप काउंटर (Step Counter)
          </h2>
          <p className="text-xs text-orange-100 opacity-80">आपके कदमों की वास्तविक गणना</p>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="relative flex justify-center">
        {isCounting && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 z-10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
              Live Activity
            </span>
          </div>
        )}
        <div className={`bg-white dark:bg-zinc-900 p-12 rounded-full border-8 shadow-inner flex flex-col items-center justify-center w-64 h-64 transition-all duration-500 ${isCounting ? 'border-orange-500 shadow-orange-500/20 scale-105' : 'border-orange-500/20 shadow-none scale-100'}`}>
        <div className={`text-5xl font-black transition-colors ${isCounting ? 'text-orange-500' : 'text-slate-300'}`}>{steps}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">कदम (Steps)</div>
        {isCounting && (
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="mt-2 text-orange-500"
          >
            <Footprints size={16} />
          </motion.div>
        )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">सेमी (cm)</div>
          <div className="text-sm font-black text-orange-500">{(steps * 76.2).toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">मीटर (m)</div>
          <div className="text-sm font-black text-orange-500">{(steps * 0.762).toFixed(1)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">किमी (km)</div>
          <div className="text-sm font-black text-orange-500">{(steps * 0.000762).toFixed(3)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm text-center">
        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">कैलोरी (Calories)</div>
        <div className="text-xl font-black text-orange-500">{(steps * 0.04).toFixed(1)} <span className="text-xs">kcal</span></div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button 
          onClick={() => setIsCounting(!isCounting)}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all ${isCounting ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-orange-500 text-white shadow-orange-500/30'}`}
        >
          {isCounting ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isCounting ? 'रोकें (Stop)' : 'शुरू करें (Start)'}
        </button>
        <button 
          onClick={() => setSteps(0)}
          className="p-4 bg-slate-100 dark:bg-zinc-800 text-slate-500 rounded-2xl active:scale-95 transition-all"
        >
          <Trash2 size={24} />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 italic">नोट: यह फीचर फोन के मोशन सेंसर का उपयोग करता है।</p>
    </div>
  );
}

function RandomTools() {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [randomNum, setRandomNum] = useState<number | null>(null);
  const [range, setRange] = useState({ min: 1, max: 100 });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const rollDice = () => {
    setDiceResult(null);
    setTimeout(() => {
      let newResult;
      do {
        newResult = Math.floor(Math.random() * 6) + 1;
      } while (newResult === diceResult); // Smart randomness: avoid same number twice
      setDiceResult(newResult);
    }, 300);
  };

  const generateRandom = () => {
    setRandomNum(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-600 text-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Dices size={24} /> रैंडम टूल्स (Random Tools)
        </h2>
      </div>

      {/* Dice Roller */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">पासा (Dice Roller)</h3>
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={diceResult === null ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
            transition={{ repeat: diceResult === null ? Infinity : 0, duration: 0.5 }}
            className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-4xl font-black text-purple-600"
          >
            {diceResult || '?'}
          </motion.div>
          <button onClick={rollDice} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold active:scale-95 transition-all">रोल करें (Roll)</button>
        </div>
      </div>

      {/* Random Number */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">रैंडम नंबर (Random Number)</h3>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="number" 
            value={range.min} 
            onChange={(e) => setRange({ ...range, min: parseInt(e.target.value) })}
            className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none text-center"
            placeholder="Min"
          />
          <input 
            type="number" 
            value={range.max} 
            onChange={(e) => setRange({ ...range, max: parseInt(e.target.value) })}
            className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none text-center"
            placeholder="Max"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-black text-purple-600">{randomNum !== null ? randomNum : '---'}</div>
          <button onClick={generateRandom} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold active:scale-95 transition-all">जनरेट करें (Generate)</button>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">टाइमर (Timer)</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-mono font-black text-purple-600">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <input 
                type="number" 
                id="customTimerInput"
                placeholder="मिनट (Min)"
                className="flex-1 p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none text-center text-sm font-bold focus:ring-2 focus:ring-purple-500"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('customTimerInput') as HTMLInputElement;
                  const val = parseInt(input.value);
                  if (!isNaN(val) && val > 0) {
                    setTimer(val * 60);
                    setIsTimerRunning(false);
                  }
                }}
                className="px-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-bold text-xs active:scale-95 transition-all"
              >
                सेट (Set)
              </button>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 5, 10, 15, 30].map(m => (
                <button key={m} onClick={() => { setTimer(m * 60); setIsTimerRunning(false); }} className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">{m}m</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all text-white ${isTimerRunning ? 'bg-red-500' : 'bg-purple-600'}`}
            >
              {isTimerRunning ? 'रोकें (Stop)' : 'शुरू करें (Start)'}
            </button>
            <button 
              onClick={() => { setTimer(0); setIsTimerRunning(false); }}
              className="px-4 bg-slate-100 dark:bg-zinc-800 text-slate-500 rounded-xl font-bold"
            >
              रीसेट
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesManager() {
  const [notes, setNotes] = useState<{ id: number, text: string, date: string }[]>(() => {
    const saved = localStorage.getItem('calc_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('calc_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleString()
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal-600 text-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <StickyNote size={24} /> नोट्स (Notes)
        </h2>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3">
        <textarea 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="महत्वपूर्ण गणना या सूत्र यहाँ लिखें..."
          className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none min-h-[100px] text-sm focus:ring-2 focus:ring-teal-500"
        />
        <button 
          onClick={addNote}
          className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all"
        >
          नोट जोड़ें (Add Note)
        </button>
      </div>

      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{note.date}</span>
              <button onClick={() => deleteNote(note.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <CalcIcon size={40} />
          </div>
          <h2 className="text-2xl font-black mb-1">NIRAJ Scientific Calculator</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Version 2.0.0 (Pro)</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Developer (विकासकर्ता)</h3>
          <div className="p-5 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-800 flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/20">NK</div>
            <div>
              <div className="font-black text-slate-800 dark:text-zinc-100 text-xl tracking-tight">Niraj Kumar Kannaujiya</div>
              <div className="inline-flex items-center gap-2 mt-1 px-3 py-0.5 bg-orange-100 dark:bg-orange-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">Queen’s College Student</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About App</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            यह एप्लिकेशन विशेष रूप से विद्यार्थियों और शिक्षकों के लिए विकसित किया गया है। इसमें शक्तिशाली वैज्ञानिक कैलकुलेटर के साथ-साथ 1000+ सूत्र, लाइव ट्रैकिंग, ग्राफ प्लॉटिंग और कई महत्वपूर्ण टूल्स शामिल हैं।
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-black text-slate-800 dark:text-zinc-100">100%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Online Ready</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-800 dark:text-zinc-100">Free</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ad Supported</div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-slate-400">Made with ❤️ in India</p>
        <div className="flex justify-center gap-4">
          <Star className="text-yellow-500" size={16} />
          <Star className="text-yellow-500" size={16} />
          <Star className="text-yellow-500" size={16} />
          <Star className="text-yellow-500" size={16} />
          <Star className="text-yellow-500" size={16} />
        </div>
      </div>
    </div>
  );
}

function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ y: number, m: number, d: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const d1 = new Date(dob);
    const d2 = new Date(today);
    
    let y = d2.getFullYear() - d1.getFullYear();
    let m = d2.getMonth() - d1.getMonth();
    let d = d2.getDate() - d1.getDate();

    if (d < 0) {
      m--;
      const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      d += lastMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    setResult({ y, m, d });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
        <Clock className="text-blue-400" size={20} /> आयु कैलकुलेटर (Age)
      </h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">जन्म तिथि (Date of Birth)</label>
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">आज की तिथि (Today's Date)</label>
          <input 
            type="date" 
            value={today} 
            onChange={(e) => setToday(e.target.value)} 
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={calculate}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          आयु निकालें (Calculate)
        </button>
        {result && (
          <div className="pt-4 grid grid-cols-3 gap-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-center">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result.y}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">वर्ष (Years)</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-center">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result.m}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">महीने (Months)</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-center">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result.d}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">दिन (Days)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

