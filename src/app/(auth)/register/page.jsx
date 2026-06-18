"use client";
import React, { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { FaGoogle, FaRegEye, FaRegEyeSlash, FaUser, FaPalette, FaEnvelope, FaLock } from 'react-icons/fa';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        role: 'buyer'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (selectedRole) => {
        setFormData(prev => ({ ...prev, role: selectedRole }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
    };

    return (
        <div 
            className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#243239] px-4 py-12"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="w-full max-w-md bg-[#2f3f48] rounded-2xl shadow-2xl border border-white/10 p-8 space-y-6">
                
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <NextLink href="/" className="inline-flex items-center gap-2.5 justify-center group">
                        <Image 
                            src="/Images/ArtHubLogo.png" 
                            alt="ArtHub Logo" 
                            width={36} 
                            height={36} 
                            className="object-contain" 
                        />
                        <span className="text-2xl font-bold tracking-tight text-white">
                            Art<span className="text-[#df6742]">Hub</span>
                        </span>
                    </NextLink>
                    <h2 className="text-xl font-bold text-white pt-2">Create Account</h2>
                    <p className="text-xs text-white/60">Join the community to showcase or buy creative arts.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Role Selection Option */}
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text text-white/70 text-xs font-semibold">Join As A</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('buyer')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                                    formData.role === 'buyer'
                                        ? "bg-[#df6742] text-white border-[#df6742] shadow-lg shadow-[#df6742]/20"
                                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:bg-white/10"
                                }`}
                            >
                                <FaUser className="w-3.5 h-3.5" />
                                <span>User (Buyer)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRoleSelect('artist')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                                    formData.role === 'artist'
                                        ? "bg-[#df6742] text-white border-[#df6742] shadow-lg shadow-[#df6742]/20"
                                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:bg-white/10"
                                }`}
                            >
                                <FaPalette className="w-3.5 h-3.5" />
                                <span>Artist</span>
                            </button>
                        </div>
                    </div>

                    {/* Full Name Input Field */}
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text text-white/70 text-xs font-semibold">Full Name</span>
                        </label>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                <FaUser className="w-4 h-4" />
                            </span>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="John Doe" 
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#df6742] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Address Input Field */}
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text text-white/70 text-xs font-semibold">Email Address</span>
                        </label>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                <FaEnvelope className="w-4 h-4" />
                            </span>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="yourname@example.com" 
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#df6742] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input Field with Visibility Toggle */}
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text text-white/70 text-xs font-semibold">Password</span>
                        </label>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                <FaLock className="w-4 h-4" />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#df6742] transition-colors"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaRegEyeSlash className="w-4 h-4" /> : <FaRegEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Registration Button */}
                    <button 
                        type="submit"
                        className="w-full py-3 bg-[#df6742] hover:bg-[#c55332] text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#df6742]/10 mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Divider Line */}
                <div className="relative flex py-2 items-center">
                    <div className="grow border-t border-white/10"></div>
                    <span className="shrink mx-4 text-white/40 text-xs font-semibold uppercase tracking-wider">or</span>
                    <div className="grow border-t border-white/10"></div>
                </div>

                {/* OAuth Integration Button */}
                <button 
                    type="button"
                    onClick={() => console.log("Google registration triggered")}
                    className="w-full flex items-center justify-center gap-3 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                    <FaGoogle className="w-4 h-4 text-white" />
                    <span>Sign Up with Google</span>
                </button>

                {/* Account Navigation Link */}
                <p className="text-center text-xs text-white/60 pt-2">
                    Already have an account?{' '}
                    <NextLink href="/login" className="text-[#df6742] hover:underline font-bold">
                        Log In Here
                    </NextLink>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;