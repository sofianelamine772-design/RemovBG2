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
  MousePointer2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ComparisonSlider = ({ original, result }) => {
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
      className="relative w-full aspect-square md:aspect-video bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl cursor-ew-resize group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Result (Base) */}
      <div className="absolute inset-0 transparency-grid">
        <img src={result} alt="Result" className="w-full h-full object-contain p-4 md:p-8" />
      </div>

      {/* Original (Hidden Layer) */}
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

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white pointer-events-none"
        style={{ left: `${position}%`, transition: 'left 0.1s ease-out' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-500">
          <div className="flex gap-1">
            <div className="w-1 h-5 bg-violet-200 rounded-full" />
            <div className="w-1 h-5 bg-violet-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Floating Tooltips */}
      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        AVANT
      </div>
      <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-violet-600/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        APRÈS IA
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-100 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
        <MousePointer2 size={14} className="text-violet-600" />
        <span className="text-[10px] font-bold text-slate-600 uppercase">Glissez pour comparer</span>
      </div>
    </div>
  );
};

function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setResultImage(null);
    setError(null);
    handleProcess(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleProcess = async (file) => {
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

      const response = await fetch(`${API_URL}/remove-bg`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur GPU');
      }

      setProgress(100);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setResultImage(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-violet-100 selection:text-violet-700 overflow-x-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb w-[800px] h-[800px] bg-violet-200/40 -top-1/4 -right-1/4" />
        <div className="orb w-[600px] h-[600px] bg-fuchsia-200/30 bottom-[-10%] -left-[10%]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={reset}>
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
              <Scissors size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-brand bg-clip-text text-transparent">MagicCut</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
            <a href="#" className="hover:text-violet-600 transition-colors">Produit</a>
            <a href="#" className="hover:text-violet-600 transition-colors">IA Engine</a>
            <a href="#" className="hover:text-violet-600 transition-colors">Tarifs</a>
          </div>

          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-lg active:scale-95">
            Connexion
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-44 pb-32 px-6">
        <div className="max-w-6xl mx-auto">

          <AnimatePresence mode="wait">
            {!originalFile ? (
              /* Landing View */
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-10">
                  <Sparkles size={14} className="text-violet-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Édition Photo par IA de Pro</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-[950] tracking-[-0.04em] text-center leading-[0.85] mb-10">
                  Le détourage <br />
                  <span className="bg-gradient-brand bg-clip-text text-transparent">réinventé.</span>
                </h1>

                <p className="text-xl text-slate-500 text-center max-w-2xl mb-16 font-medium leading-relaxed">
                  Supprimez n'importe quel arrière-plan en un éclair.
                  Qualité studio, précision atomique, 100% gratuit.
                </p>

                {/* Main Upload Box */}
                <div
                  {...getRootProps()}
                  className={`relative group w-full max-w-3xl aspect-[16/7] glass rounded-[40px] p-2 transition-all cursor-pointer hover:scale-[1.01] ${isDragActive ? 'ring-4 ring-violet-500/20' : ''}`}
                >
                  <div className={`w-full h-full border-2 border-dashed rounded-[34px] flex flex-col items-center justify-center transition-colors ${isDragActive ? 'border-violet-500 bg-violet-50/50' : 'border-slate-200 bg-white/40 group-hover:bg-white/80 group-hover:border-violet-300'}`}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      <Upload size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Déposez votre image</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Ou cliquez pour explorer vos fichiers</p>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mt-16 flex flex-col items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] shadow-lg" alt="avatar" />
                    ))}
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Utilisé par <span className="text-slate-900">+12,482</span> créatifs
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Editor View */
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Side: Preview */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between glass p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <button onClick={reset} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 transition-colors">
                        <X size={18} strokeWidth={3} />
                      </button>
                      <div>
                        <p className="text-xs font-black truncate max-w-[200px]">{originalFile.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image chargée</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleProcess(originalFile)}
                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all"
                      >
                        <RefreshCw size={18} className={isProcessing ? 'animate-spin' : ''} />
                      </button>
                      {resultImage && (
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resultImage;
                            link.download = `magiccut-${originalFile.name.split('.')[0]}.png`;
                            link.click();
                          }}
                          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 scale-100 active:scale-95"
                        >
                          <Download size={16} strokeWidth={3} />
                          Télécharger
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    {isProcessing ? (
                      <div className="w-full aspect-square md:aspect-video bg-white rounded-[40px] border border-slate-100 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                        {/* Animated Processing Waves */}
                        <div className="absolute inset-0 opacity-10">
                          <motion.div
                            animate={{ x: [-1000, 1000] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                          />
                        </div>

                        <div className="w-32 h-32 relative mb-8">
                          <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <motion.circle
                              cx="50" cy="50" r="45" fill="none" stroke="url(#grad2)" strokeWidth="8" strokeLinecap="round"
                              animate={{ strokeDasharray: "283", strokeDashoffset: 283 - (283 * progress / 100) }}
                            />
                            <defs>
                              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#d946ef" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-3xl font-black italic">{progress}%</div>
                        </div>
                        <h3 className="text-2xl font-black italic bg-gradient-brand bg-clip-text text-transparent animate-pulse">L'IA de-pixelise le fond...</h3>
                      </div>
                    ) : resultImage ? (
                      <ComparisonSlider original={originalPreview} result={resultImage} />
                    ) : error ? (
                      <div className="w-full aspect-square md:aspect-video bg-red-50 rounded-[40px] border-2 border-dashed border-red-200 flex flex-col items-center justify-center p-8 text-center shadow-lg">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                          <X size={32} />
                        </div>
                        <h3 className="text-xl font-black text-red-900 mb-2">Une erreur est survenue</h3>
                        <p className="text-red-600 font-bold text-sm max-w-xs">{error}</p>
                        <button onClick={reset} className="mt-6 bg-red-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Réessayer</button>
                      </div>
                    ) : (
                      <div className="w-full aspect-square md:aspect-video bg-white/40 glass rounded-[40px] flex items-center justify-center shadow-inner italic text-slate-300 font-bold">
                        Préparation du rendu...
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Options & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="glass p-8 rounded-[40px] shadow-xl">
                    <h3 className="text-lg font-black mb-8 flex items-center gap-2">
                      <Zap size={20} className="text-amber-400 fill-amber-400" />
                      Analyse de l'IA
                    </h3>

                    <div className="space-y-4">
                      {[
                        { icon: <ImageIcon size={14} />, label: 'Détection objet', val: 'Précis' },
                        { icon: <RefreshCw size={14} />, label: 'Resolution', val: 'Originale' },
                        { icon: <ShieldCheck size={14} />, label: 'Qualité', val: 'HD' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white/80 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="text-violet-500">{item.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                          </div>
                          <span className="text-[11px] font-black text-slate-900">{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-slate-200">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 group-hover:scale-150 transition-transform">
                        <Scissors size={80} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300 mb-2">MagicCut PRO</p>
                      <h4 className="text-lg font-black leading-tight mb-6">Traitement par lots et API illimitée ?</h4>
                      <div className="flex items-center gap-2 text-xs font-black group-hover:gap-4 transition-all uppercase tracking-widest">
                        Rejoindre le club <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-[32px] border-emerald-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-900 mb-1">Protection des données</p>
                        <p className="text-[10px] font-bold text-emerald-700 leading-relaxed uppercase tracking-wide">Vos images sont supprimées de nos serveurs après 1h.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 py-24 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center text-white shadow-md">
                <Scissors size={18} />
              </div>
              <span className="text-xl font-black tracking-tight">MagicCut</span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-loose max-w-[250px]">Le futur de la création visuelle accessible à tous.</p>
          </div>

          <div className="flex gap-20">
            <div className="flex flex-col gap-4 items-center md:items-start text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="text-slate-900">Produit</span>
              <a href="#" className="hover:text-violet-600 transition-colors">Modèles AI</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Rendu Cloud</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Studio</a>
            </div>
            <div className="flex flex-col gap-4 items-center md:items-start text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="text-slate-900">Legal</span>
              <a href="#" className="hover:text-violet-600 transition-colors">Vie Privée</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Conditions</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
          <p>© {new Date().getFullYear()} MagicCut PRO</p>
          <p>Code by Antigravity</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
