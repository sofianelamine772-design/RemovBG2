import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShowcaseSection = () => {
    const [activeTab, setActiveTab] = useState('Produits');

    const tabs = ['Personnes', 'Produits', 'Animaux', 'Voitures', 'Graphiques'];

    // Image data for the showcased chair (Product example based on user screenshot)
    const categoryData = {
        'Produits': {
            original: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80', // Chair original
            removed: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80', // In a real app we'd have the transparent one
            newBg: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
            infinite: [
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=300&q=80',
            ]
        },
        // We can add other categories if needed
    };

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-[900] text-center mb-12 text-slate-900 tracking-tight">
                    Imaginez un peu !
                </h2>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-16">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full text-sm font-black transition-all ${activeTab === tab
                                    ? 'bg-slate-100 text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* 1. Original */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-xl border border-slate-100">
                            <img
                                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"
                                alt="Original"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-slate-500 font-bold text-sm">Original</span>
                    </div>

                    {/* 2. Removed Background */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden transparency-grid shadow-xl border border-slate-100 p-8 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"
                                alt="Removed Bg"
                                className="w-full h-full object-contain mix-blend-multiply brightness-110 drop-shadow-2xl translate-y-4"
                            />
                        </div>
                        <span className="text-slate-500 font-bold text-sm">Arrière-plan supprimé</span>
                    </div>

                    {/* 3. New Background */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100" />
                            <img
                                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"
                                alt="New BG"
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply brightness-110 p-8 translate-y-4"
                            />
                        </div>
                        <span className="text-slate-500 font-bold text-sm">Nouvel arrière-plan</span>
                    </div>

                    {/* 4. Infinite possibilities */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full aspect-[4/5] grid grid-cols-2 grid-rows-2 gap-2 rounded-[2.5rem] overflow-hidden">
                            <div className="bg-[#E5E2E0] flex items-center justify-center p-3">
                                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-contain mix-blend-multiply" alt="variant 1" />
                            </div>
                            <div className="bg-[#F4EBE2] flex items-center justify-center p-3">
                                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-contain mix-blend-multiply" alt="variant 2" />
                            </div>
                            <div className="bg-[#F8F8F8] flex items-center justify-center p-3">
                                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-contain mix-blend-multiply" alt="variant 3" />
                            </div>
                            <div className="bg-[#F0EBE9] flex items-center justify-center p-3">
                                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-contain mix-blend-multiply" alt="variant 4" />
                            </div>
                        </div>
                        <span className="text-slate-500 font-bold text-sm">Une infinité de possibilités</span>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
