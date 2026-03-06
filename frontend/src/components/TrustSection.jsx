import React from 'react';
import { ShieldCheck, Lock, Zap } from 'lucide-react';

const TrustSection = () => {
    const paymentLogos = [
        { name: "Visa", url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" },
        { name: "Mastercard", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
        { name: "American Express", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
        { name: "Apple Pay", url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
        { name: "Google Pay", url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
        { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto glass p-8 md:p-14 rounded-[50px] border-emerald-100/50 bg-emerald-50/20 text-center relative overflow-hidden mt-20 mb-32 shadow-[0_40px_100px_rgba(16,185,129,0.08)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />

            <div className="flex flex-col items-center gap-4 mb-12">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">Confiance & Sécurité</span>
                <h2 className="text-3xl md:text-5xl font-[950] tracking-tight text-slate-900">
                    Souveraineté Française <br />
                    <span className="text-emerald-500">& Sécurité Militaire.</span>
                </h2>
                <div className="w-16 h-1 w- bg-emerald-100 rounded-full mt-4" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-2.5 rounded-full border border-emerald-100 shadow-lg shadow-emerald-100/20">
                    <Lock size={16} className="fill-emerald-100" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-full border border-blue-100 shadow-lg shadow-blue-100/20">
                    <span className="text-xl">🇫🇷</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-800">Entreprise Française</span>
                </div>
            </div>

            <p className="text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Optez pour un outil souverain qui respecte votre vie privée. Toutes les images sont traitées avec soin et supprimées de nos serveurs dès la fin du traitement.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 mb-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                {paymentLogos.map((logo, i) => (
                    <img key={i} src={logo.url} alt={logo.name} className="h-6 md:h-8 object-contain" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-500 border border-emerald-50">
                        <ShieldCheck size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Chiffrement AES-256</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-blue-500 border border-blue-50">
                        <span className="text-lg font-black">100%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Conformité RGPD</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-violet-500 border border-violet-50">
                        <Lock size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Hébergement France</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-amber-500 border border-amber-50">
                        <Zap size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">3D Secure v2</p>
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
