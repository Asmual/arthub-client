"use client";
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';

const Hero = () => {
    const images = [
        "/Images/HeroImage-1.PNG",
        "/Images/HeroImage-2.PNG", 
        "/Images/HeroImage-3.PNG" 
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 7000); 

        return () => clearInterval(timer);  
    }, [images.length]);

    return (
        <div 
            className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#2f3f48] overflow-hidden"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            {/* BACKGROUND IMAGES WITH REAL SLOW & SMOOTH FADE EFFECT*/}
            {images.map((image, index) => (
                <div
                    key={index}
              
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-3000 ease-in-out transform ${
                        index === currentImageIndex 
                            ? "opacity-100 scale-100 z-0" 
                            : "opacity-0 scale-105 z-[-1]"
                    }`}
                    style={{ backgroundImage: `url('${image}')` }}
                />
            ))}

            {/* BACKGROUND OVERLAY (Less Dark & Minimal Blur) */}
            <div className="absolute inset-0 bg-[#2f3f48]/50 backdrop-blur-[1px] z-10"></div>

            {/* HERO CONTENT SECTION */}
            <div className="relative max-w-4xl mx-auto px-4 text-center z-20 text-white space-y-6">
                
                {/* Tagline / Badge */}
                <div className="inline-flex items-center gap-2 bg-[#df6742]/20 border border-[#df6742]/40 px-4 py-1.5 rounded-full select-none">
                    <span className="w-2 h-2 rounded-full bg-[#df6742] animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#df6742]">
                        Welcome to ArtHub Gallery
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                    Discover & Collect <br />
                    <span className="text-[#df6742]">Extraordinary</span> Artworks
                </h1>

                {/* Subtitle / Description */}
                <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
                    Explore a curated world of finest paintings, digital arts, and hand-crafted masterpieces created by passionate artists worldwide. Bring life to your space today.
                </p>

                {/* CALL TO ACTION (CTA) BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    {/* Primary Button */}
                    <NextLink
                        href="/browse"
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#df6742] hover:bg-[#c55332] text-white font-bold rounded-xl shadow-lg shadow-[#df6742]/20 transition-all transform active:scale-95 text-center text-sm tracking-wide"
                    >
                        Explore Artworks
                    </NextLink>

                    {/* Secondary Glass Button */}
                    <NextLink
                        href="/register"
                        className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all transform active:scale-95 text-center text-sm tracking-wide"
                    >
                        Join as an Artist
                    </NextLink>
                </div>

                {/* SLIDER INDICATORS / DOTS */}
                <div className="flex items-center justify-center gap-2.5 pt-8">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? "w-8 bg-[#df6742]" : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default Hero;    