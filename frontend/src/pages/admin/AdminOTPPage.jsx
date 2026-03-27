import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { verifyOTP } from '../../slices/authSlice';

const AdminOTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile || '';
    const tempToken = location.state?.tempToken || null;

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }

        const res = await dispatch(verifyOTP({
            mobile,
            otp: otpString,
            role: 'admin',
            tempToken
        }));

        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/admin');
        } else {
            setError('Verification failed. Please use 0000 for testing.');
        }
    };

    return (
        <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col">
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 h-16">
                <button 
                    onClick={() => navigate('/admin/login')}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 transition-colors active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-6 h-6 text-stone-900" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="font-semibold tracking-tight text-red-700">Verification</h1>
                </div>
            </header>

            <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col max-w-md mx-auto">
                <div className="mb-10 flex justify-center">
                    <div className="w-20 h-20 bg-primary-container rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary/10">
                        <UtensilsCrossed className="text-on-primary-container w-10 h-10" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">Verify Your Number</h2>
                    <p className="text-on-surface-variant leading-relaxed px-4">
                        Enter the 4-digit code sent to <span className="font-semibold text-on-surface">{mobile || 'your mobile'}</span>
                    </p>
                </div>

                <div className="flex justify-between gap-2 mb-10">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl font-bold bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                        />
                    ))}
                </div>

                {error && <p className="text-red-600 text-sm font-bold text-center mb-6">{error}</p>}

                <div className="text-center mb-12">
                    <p className="text-on-surface-variant text-sm tracking-wide">
                        Didn't receive the code? 
                        <span className="block mt-2 font-semibold text-primary/60 cursor-not-allowed">Resend in 0:30</span>
                    </p>
                </div>

                <div className="mt-auto space-y-4">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerify}
                        className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
                    >
                        Verify & Continue
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <button className="w-full h-14 bg-surface-container-low text-on-surface-variant font-semibold rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 transition-transform">
                        Try another method
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-outline-variant/30"></div>
                    <div className="w-1 h-1 rounded-full bg-outline-variant/60"></div>
                    <div className="w-1 h-1 rounded-full bg-outline-variant/30"></div>
                </div>
            </main>

            {/* Decorative Gradients */}
            <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="fixed top-24 -right-12 w-48 h-48 bg-secondary/5 rounded-full blur-2xl -z-10"></div>
        </div>
    );
};

export default AdminOTPPage;
