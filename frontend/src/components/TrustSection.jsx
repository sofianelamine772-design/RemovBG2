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
        <div className="w-full max-w-4xl glass p-8 md:p-12 rounded-[40px] border-emerald-100/50 bg-emerald-50/20 text-center relative overflow-hidden mt-12 mb-20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />

            <div className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-2.5 rounded-full border border-emerald-100 shadow-lg shadow-emerald-100/20 mb-10">
                <Lock size={16} className="fill-emerald-100" />
                <span className="text-[11px] font-black uppercase tracking-widest">Paiement 100% sécurisé via Stripe</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black mb-8">Payez en toute sérénité.</h3>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 mb-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                {paymentLogos.map((logo, i) => (
                    <img key={i} src={logo.url} alt={logo.name} className="h-6 md:h-8 object-contain" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={20} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Données Chiffrées (AES-256)</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-emerald-500">
                        <Lock size={20} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Conformité RGPD</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-emerald-500">
                        <Zap size={20} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Validation 3D Secure</p>
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
