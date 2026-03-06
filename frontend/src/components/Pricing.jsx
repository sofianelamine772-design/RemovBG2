import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Zap,
    ShieldCheck,
    CreditCard,
    Star,
    Users,
    Lock,
    MessageSquare
} from 'lucide-react';

const Pricing = ({ onBack }) => {
    const [loading, setLoading] = useState(null); // 'pro' or 'credit'
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleCheckout = async (type) => {
        setLoading(type);
        try {
            const response = await fetch(`${API_URL}/create-checkout-session?plan_type=${type}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erreur Stripe: Clé API non configurée ou serveur injoignable.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Erreur lors de l'accès au paiement. Vérifiez que le backend est lancé.");
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: "credit",
            name: "Pack Crédit",
            price: "0,99€",
            period: "par crédit",
            description: "Idéal pour une utilisation occasionnelle et flexible.",
            features: [
                "2 détourages par crédit",
                "Qualité Ultra-HD",
                "Validité illimitée",
                "Support prioritaire",
                "Accès à l'API"
            ],
            cta: "Acheter des crédits",
            popular: false,
            color: "slate"
        },
        {
            id: "pro",
            name: "Abonnement PRO",
            price: "19,99€",
            period: "par mois",
            description: "Pour les professionnels qui ont besoin de volume.",
            features: [
                "Détourages illimités",
                "Qualité Ultra-HD max",
                "Traitement par lots",
                "API Illimitée",
                "Équipe support dédiée"
            ],
            cta: "Passer en PRO",
            popular: true,
            color: "violet"
        }
    ];

    const paymentLogos = [
        { name: "Visa", url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" },
        { name: "Mastercard", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
        { name: "American Express", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
        { name: "Apple Pay", url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
        { name: "Google Pay", url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
        { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" }
    ];

    const professionals = [
        { name: "Studio Photo Paris", role: "Photographe de mode", text: "ClearBG a divisé notre temps de post-production par 4. C'est bluffant." },
        { name: "AutoVente 360", role: "Concessionnaire automobile", text: "La précision sur les reflets des carrosseries est imbattable." },
        { name: "LuxeDesign", role: "Agence de communication", text: "L'API est ultra-stable pour nos outils internes. Indispensable." }
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-16">

                <h2 className="text-5xl md:text-7xl font-[950] tracking-tight mb-6">
                    Choisissez votre <br />
                    <span className="bg-gradient-brand bg-clip-text text-transparent">plan de bataille.</span>
                </h2>

                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    Que vous soyez un créatif indépendant ou une multinationale,
                    nous avons le tarif adapté à vos besoins de détourage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative group glass p-10 rounded-[40px] border-2 transition-all hover:scale-[1.02] ${plan.popular ? 'border-violet-500 shadow-2xl' : 'border-white/50 hover:border-slate-300'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                Le plus prisé
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                            <p className="text-slate-400 font-bold text-sm tracking-wide">{plan.description}</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-black">{plan.price}</span>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{plan.period}</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={loading !== null}
                            onClick={() => handleCheckout(plan.id)}
                            className={`w-full py-5 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${plan.popular ? 'bg-slate-900 text-white hover:bg-violet-600' : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {loading === plan.id ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CreditCard size={16} />
                            )}
                            {loading === plan.id ? 'Connexion Stripe...' : plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Trust & Professionals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                <div className="lg:col-span-1">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 mb-6">
                        <Users size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Utilisé par les pros</span>
                    </div>
                    <h3 className="text-3xl font-black mb-4 leading-tight">Ils nous font confiance.</h3>
                    <p className="text-slate-500 font-medium mb-8">Plus de 10,000 agences et photographes utilisent ClearBG quotidiennement pour automatiser leurs workflows.</p>

                    <div className="flex -space-x-3 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?u=pro${i}`} className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] shadow-lg" alt="pro avatar" />
                        ))}
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">+12,482 professionnels inscrits</p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {professionals.map((pro, i) => (
                        <div key={i} className="glass p-8 rounded-[32px] border-white/50 relative">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-violet-500">
                                <MessageSquare size={24} />
                            </div>
                            <p className="text-slate-600 font-medium italic mb-6 leading-relaxed">"{pro.text}"</p>
                            <div>
                                <p className="font-black text-slate-900">{pro.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">{pro.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Security */}
            <div className="glass p-12 rounded-[40px] border-emerald-100/50 bg-emerald-50/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />

                <div className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-2.5 rounded-full border border-emerald-100 shadow-lg shadow-emerald-100/20 mb-10">
                    <Lock size={16} className="fill-emerald-100" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Paiement 100% sécurisé via Stripe</span>
                </div>

                <h3 className="text-3xl font-black mb-8">Payez en toute sérénité.</h3>

                <div className="flex flex-wrap items-center justify-center gap-10 mb-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                    {paymentLogos.map((logo, i) => (
                        <img key={i} src={logo.url} alt={logo.name} className="h-8 md:h-10 object-contain" />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-500">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Données Chiffrées (AES-256)</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-500">
                            <Lock size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Conformité RGPD</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-500">
                            <Zap size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Validation 3D Secure</p>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center">
                <button
                    onClick={onBack}
                    className="text-slate-400 hover:text-violet-600 text-xs font-black uppercase tracking-[0.2em] transition-colors"
                >
                    Retourner au studio
                </button>
            </div>
        </div>
    );
};

export default Pricing;
