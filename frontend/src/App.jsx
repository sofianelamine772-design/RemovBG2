import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Download,
  X,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Scissors,
  MousePointer2,
  Lock,
  Plus,
  Sliders,
  Palette,
  Star,
  Users,
  CheckCircle2,
  Cpu,
  ZapOff
} from 'lucide-react';

import Pricing from './components/Pricing';
import TrustSection from './components/TrustSection';
import ClearBGLogo from './components/ClearBGLogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ComparisonSlider = ({ original, result, isLowQuality }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    if (!clientX) return;
    const x = clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(newPos);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[3/2] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl cursor-ew-resize group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className={`absolute inset-0 transparency-grid ${isLowQuality ? 'low-quality-preview' : ''}`}>
        <img src={result} alt="Result" className="w-full h-full object-contain p-4 md:p-8" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%`, transition: 'width 0.1s ease-out' }}
      >
        <div className="absolute inset-0 w-[1000%] h-full bg-slate-100">
          <div className="w-[10%] h-full">
            <img
              src={original}
              alt="Original"
              className="w-full h-full object-contain p-4 md:p-8"
            />
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white pointer-events-none"
        style={{ left: `${position}%`, transition: 'left 0.1s ease-out' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-600">
          <div className="flex gap-1">
            <div className="w-1 h-5 bg-violet-200 rounded-full" />
            <div className="w-1 h-5 bg-violet-200 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        AVANT
      </div>
      <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-violet-600/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        APRÈS IA
      </div>
    </div>
  );
};

function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [hdImage, setHdImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('studio');
  const [qualityMode, setQualityMode] = useState('preview'); // 'preview' or 'hd'
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  // Scroll to top when the view or task state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, originalFile]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));

    const img = new Image();
    img.onload = () => setImgDimensions({ width: img.width, height: img.height });
    img.src = URL.createObjectURL(file);

    setPreviewImage(null);
    setHdImage(null);
    setError(null);
    setQualityMode('preview');
    handleProcess(file, 'preview');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleProcess = async (file, quality) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const simulatedProgress = Math.min(95, Math.floor(elapsed / 30));
        setProgress(simulatedProgress);
      }, 50);

      const response = await fetch(`${API_URL}/remove-bg?quality=${quality}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Erreur de traitement');
      }

      setProgress(100);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      if (quality === 'preview') {
        setPreviewImage(imageUrl);
      } else {
        setHdImage(imageUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setPreviewImage(null);
    setHdImage(null);
    setError(null);
    setProgress(0);
    setCurrentView('studio');
    setShowDownloadMenu(false);
  };

  const handleUnlockHD = () => {
    if (!hdImage && !isProcessing) {
      setQualityMode('hd');
      handleProcess(originalFile, 'hd');
    } else {
      setQualityMode('hd');
    }
    setShowDownloadMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-violet-100 selection:text-violet-700 overflow-x-hidden" onClick={() => setShowDownloadMenu(false)}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb w-[800px] h-[800px] bg-violet-200/40 -top-1/4 -right-1/4" />
        <div className="orb w-[600px] h-[600px] bg-fuchsia-200/30 bottom-[-10%] -left-[10%]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 text-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <ClearBGLogo size={42} className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
            <span className="text-2xl font-black tracking-tighter bg-gradient-brand bg-clip-text text-transparent italic">ClearBG</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
            <button onClick={() => setCurrentView('studio')} className={`hover:text-violet-600 transition-colors ${currentView === 'studio' ? 'text-violet-600 font-black' : ''}`}>Studio</button>
            <button className="hover:text-violet-600 transition-colors">Nos Modèles</button>
            <button onClick={() => setCurrentView('pricing')} className={`hover:text-violet-600 transition-colors ${currentView === 'pricing' ? 'text-violet-600 font-black' : ''}`}>Tarifs</button>
          </div>

          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-lg active:scale-95">
            Connexion
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-44 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === 'pricing' ? (
              <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Pricing onBack={() => setCurrentView('studio')} />
              </motion.div>
            ) : !originalFile ? (
              /* High-Converting Landing View */
              <div className="flex flex-col gap-32">
                {/* 1. Hero Section */}
                <motion.div key="landing" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                  {/* Left Side: Conversion-focused copy */}
                  <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-5 py-2 rounded-full border border-violet-100 mb-8 animate-bounce-subtle">
                      <Sparkles size={16} className="fill-violet-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">IA de précision professionnelle</span>
                    </div>

                    <h1 className="text-[54px] md:text-[72px] font-[900] leading-[0.95] tracking-tight mb-8 text-slate-900">
                      Supprimez le <br />
                      <span className="text-violet-600">fond</span> d'une image
                    </h1>

                    <p className="text-slate-500 text-lg mb-10 max-w-xl font-medium leading-relaxed">
                      Plus besoin de détourer à la main. Notre IA de pointe isole vos sujets en <span className="text-slate-900 font-black">5 secondes</span> avec une précision chirurgicale.
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex flex-col items-center md:items-start gap-4 text-xl font-bold">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">100% automatique et</span>
                          <span className="bg-violet-600 text-white px-5 py-1.5 rounded-full text-lg shadow-xl shadow-violet-200">gratuit</span>
                        </div>
                      </div>
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                          <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-4 border-white shadow-lg" alt="User" />
                        ))}
                        <div className="w-10 h-10 rounded-full bg-slate-900 border-4 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black">+10k</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: New High-Impact Upload Box */}
                  <div className="flex-1 w-full max-w-[500px]">
                    <div className="bg-white p-14 rounded-[60px] shadow-[0_45px_120px_rgba(124,58,237,0.15)] border-4 border-violet-50 flex flex-col items-center text-center group transition-all hover:border-violet-100">
                      <div {...getRootProps()} className="w-full">
                        <input {...getInputProps()} />
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 rounded-[30px] text-2xl font-[900] tracking-tight shadow-2xl shadow-violet-200 transition-all hover:scale-105 active:scale-95 mb-8 w-full flex items-center justify-center gap-4">
                          <Upload size={32} strokeWidth={3} />
                          Télécharger
                        </button>
                      </div>
                      <div className="text-slate-800 text-xl font-black mb-2 opacity-80">ou glissez-déposez ici</div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Sans compte requis
                        <span className="mx-2 opacity-20">|</span>
                        <CheckCircle2 size={14} className="text-emerald-500" /> Haute Précision
                      </div>
                    </div>

                    {/* Quick Try Section */}
                    <div className="mt-12 bg-white/40 p-6 rounded-[35px] border border-white backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-6">
                        <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Pas d'image ? Essayez ClearBG :</span>
                        <div className="flex gap-4 justify-center">
                          {[
                            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=48&h=48&q=80",
                            "https://images.unsplash.com/photo-1511367461989-f85a21fda181?auto=format&fit=crop&w=48&h=48&q=80",
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=48&h=48&q=80",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=48&h=48&q=80"
                          ].map((src, i) => (
                            <img key={i} src={src} className="w-14 h-14 rounded-2xl object-cover cursor-pointer hover:scale-110 hover:border-violet-500 transition-all shadow-xl border-4 border-white" alt="example" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Features Grid - Why us? */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  {[
                    {
                      icon: <Cpu size={32} className="text-violet-600" />,
                      title: "IA de pointe",
                      text: "Notre algorithme détecte automatiquement les cheveux et les bords complexes."
                    },
                    {
                      icon: <Zap size={32} className="text-amber-500" />,
                      title: "Instantanné",
                      text: "Moins de 5 secondes par image. Ne perdez plus votre temps sur Photoshop."
                    },
                    {
                      icon: <Users size={32} className="text-blue-500" />,
                      title: "Multi-usage",
                      text: "Idéal pour l'E-commerce, les designers, les photographes et les créateurs."
                    }
                  ].map((feat, i) => (
                    <div key={i} className="flex flex-col items-center gap-6 p-10 bg-white rounded-[40px] shadow-xl border border-slate-50 hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">{feat.icon}</div>
                      <h3 className="text-xl font-black">{feat.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feat.text}</p>
                    </div>
                  ))}
                </div>

                <TrustSection />

                {/* 3. Final CTA */}
                <div className="bg-slate-900 rounded-[60px] p-20 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl group-hover:scale-150 transition-transform">
                    <Zap size={300} fill="white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10">Prêt à transformer vos visuels ?</h2>
                  <p className="text-slate-400 mb-12 text-lg relative z-10">Rejoignez plus de 10,000 professionnels qui utilisent ClearBG chaque jour.</p>
                  <button onClick={() => window.scrollTo(0, 0)} className="bg-violet-600 hover:bg-violet-500 text-white px-12 py-5 rounded-full text-xl font-black shadow-2xl transition-all hover:scale-105 relative z-10">
                    Commencer gratuitement
                  </button>
                </div>
              </div>
            ) : (
              /* New Editor View - Professional Toolbar Style (Canva Style) */
              <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">

                {/* 1. Editor Toolbar (Based on Screenshot) */}
                <div className="w-full glass rounded-full px-4 md:px-8 py-2 md:py-3.5 flex items-center justify-between shadow-xl border-white/40 sticky top-24 z-40 transition-all">
                  <div className="flex items-center gap-1 md:gap-6 overflow-x-auto no-scrollbar">
                    {[
                      { icon: <Scissors size={18} />, label: "Découper" },
                      { icon: <ImageIcon size={18} />, label: "Arrière-plan" },
                      { icon: <Sparkles size={18} />, label: "Effets" },
                      { icon: <Sliders size={18} />, label: "Ajuster" },
                      { icon: <Palette size={18} />, label: "Créer" }
                    ].map((tool, i) => (
                      <button key={i} className="flex items-center gap-2.5 px-3 md:px-5 py-2.5 hover:bg-slate-100 rounded-2xl transition-all group shrink-0">
                        <span className="text-slate-500 group-hover:text-violet-600 transition-colors">{tool.icon}</span>
                        <span className="text-[13px] font-[700] text-slate-700 tracking-tight hidden md:block">{tool.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-6 w-px bg-slate-200 mx-2 hidden lg:block" />

                    <div className="hidden lg:flex items-center gap-4 text-slate-400 mr-4">
                      <RefreshCw size={18} className={`hover:text-slate-900 cursor-pointer ${isProcessing ? 'animate-spin' : ''}`} onClick={() => handleProcess(originalFile, qualityMode)} />
                      <Download size={18} className="hover:text-slate-900 cursor-pointer rotate-180" />
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full flex items-center gap-4 shadow-lg shadow-violet-200 transition-all font-[900] text-sm tracking-tight"
                      >
                        Télécharger
                        <ChevronRight size={16} className={`transition-transform duration-300 ${showDownloadMenu ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                      </button>

                      <AnimatePresence>
                        {showDownloadMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-4 w-72 md:w-80 bg-white rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-slate-50 p-3 overflow-hidden z-50 origin-top-right backdrop-blur-3xl"
                          >
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => {
                                  setQualityMode('preview');
                                  const link = document.createElement('a');
                                  link.href = previewImage;
                                  link.download = `preview-${originalFile.name}`;
                                  link.click();
                                }}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 rounded-[28px] transition-all text-left group"
                              >
                                <div className="flex items-center gap-4">
                                  <MousePointer2 size={20} className="text-slate-400 group-hover:text-violet-600 transition-colors" />
                                  <div>
                                    <p className="text-sm font-black text-slate-800">
                                      Aperçu <span className="text-slate-400 font-bold ml-2">{Math.min(500, imgDimensions.width)} x {Math.min(500, imgDimensions.height)}</span>
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-widest">Gratuit</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (!hdImage) handleUnlockHD();
                                  else {
                                    const link = document.createElement('a');
                                    link.href = hdImage;
                                    link.download = `hd-${originalFile.name}`;
                                    link.click();
                                  }
                                }}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 rounded-[28px] transition-all text-left group"
                              >
                                <div className="flex items-center gap-4">
                                  <Zap size={20} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                                  <div>
                                    <p className="text-sm font-black text-slate-800">
                                      Max <span className="text-slate-400 font-bold ml-2">{imgDimensions.width} x {imgDimensions.height}</span>
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest transition-all ${hdImage ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {hdImage ? 'HD Prêt' : 'Déverrouiller'}
                                </span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* 2. Main Editor Canvas Area */}
                <div className="relative mt-8">
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 transition-all opacity-0 group-hover:opacity-100">
                    <button className="bg-white/95 backdrop-blur shadow-2xl px-8 py-4 rounded-[28px] flex items-center gap-4 border border-slate-100/50 hover:scale-105 active:scale-95 transition-all">
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white p-2">
                        <ClearBGLogo size={24} />
                      </div>
                      <span className="text-sm font-black text-slate-900 tracking-tight">Ouvrir dans ClearBG Studio</span>
                    </button>
                  </div>

                  <div className="relative group rounded-[60px] overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.12)] bg-white border border-slate-100">
                    {isProcessing ? (
                      <div className="w-full aspect-[16/10] flex flex-col items-center justify-center relative overflow-hidden bg-white">
                        <div className="w-20 h-20 border-8 border-violet-50 border-t-violet-600 rounded-full animate-spin mb-8" />
                        <p className="text-2xl font-black italic tracking-tighter text-slate-900 animate-pulse">L'IA de-pixelise le fond... {progress}%</p>
                        <div className="absolute inset-0 bg-gradient-brand opacity-5 animate-pulse" />
                      </div>
                    ) : (
                      <ComparisonSlider
                        original={originalPreview}
                        result={qualityMode === 'hd' && hdImage ? hdImage : previewImage}
                        isLowQuality={qualityMode === 'preview' && !hdImage}
                      />
                    )}

                    {qualityMode === 'preview' && !hdImage && !isProcessing && (
                      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-4 bg-red-600 px-6 py-3 rounded-2xl text-white shadow-2xl shadow-red-200 animate-bounce-subtle">
                        <Lock size={16} fill="white" />
                        <span className="text-[11px] font-[900] uppercase tracking-widest">Qualité réduite • Pass en HD</span>
                      </div>
                    )}
                  </div>
                </div>

                <TrustSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 pt-32 pb-16 px-6 bg-slate-900 text-white overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8">
            {/* Brand Column */}
            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={reset}>
                <ClearBGLogo size={40} />
                <span className="text-3xl font-black tracking-tighter italic">ClearBG</span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-loose max-w-[280px]">
                L'IA la plus précise du monde pour supprimer les arrière-plans instantanément. Créé pour les photographes, designers et e-commerçants.
              </p>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-all cursor-pointer group">
                    <Star size={18} className="text-slate-500 group-hover:text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Outils AI</span>
              <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
                <a href="#" className="hover:text-white transition-colors">Suppression du fond</a>
                <a href="#" className="hover:text-white transition-colors">Traitement par lots</a>
                <a href="#" className="hover:text-white transition-colors">API ClearBG</a>
                <a href="#" className="hover:text-white transition-colors">ClearBG Studio</a>
              </div>
            </div>

            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Compagnie</span>
              <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
                <a href="#" onClick={() => setCurrentView('pricing')} className="hover:text-white transition-colors">Tarifs & Crédits</a>
                <a href="#" className="hover:text-white transition-colors">À propos</a>
                <a href="#" className="hover:text-white transition-colors">Blog Design</a>
                <a href="#" className="hover:text-white transition-colors">Contactez-nous</a>
              </div>
            </div>

            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Confiance</span>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Lock size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Paiement SSL Sécurisé</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <ShieldCheck size={20} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Conformité RGPD</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 opacity-50 hover:opacity-100 transition-opacity">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" className="h-4 object-contain brightness-0 invert" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 object-contain" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" className="h-5 object-contain brightness-0 invert" alt="Amex" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6 object-contain brightness-0 invert" alt="Apple Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6 object-contain brightness-0 invert" alt="Stripe" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
              <p>© {new Date().getFullYear()} ClearBG PRO — Tous droits réservés.</p>
              <div className="flex gap-10">
                <a href="#" className="hover:text-white">Confidentialité</a>
                <a href="#" className="hover:text-white">CGU</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400 tracking-widest">Tous les systèmes sont opérationnels</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
