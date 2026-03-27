import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP } from '../slices/authSlice';
import { motion } from 'framer-motion';
import { ArrowLeft, Utensils, ArrowRight } from 'lucide-react';

const OTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile || '';
    const tempToken = location.state?.tempToken || null;
    const role = location.state?.role || 'user';

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        const res = await dispatch(verifyOTP({ mobile, otp: fullOtp, tempToken, role }));
        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/');
        } else {
            alert('Invalid verification code. Please use 0000 for testing.');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6" style={{ position: 'relative', overflow: 'hidden' }}>
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 h-16">
                <button onClick={() => navigate('/login')} className="p-2 hover:bg-surface-container-high rounded-full transition-all">
                    <ArrowLeft size={24} color="var(--on-surface)" />
                </button>
                <h1 className="title-lg" style={{ color: 'var(--primary)', fontWeight: 800 }}>Verification</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <main style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ 
                    width: '80px', height: '80px', background: 'var(--primary-container)', borderRadius: '2rem', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem',
                    boxShadow: '0 10px 20px rgba(184, 19, 14, 0.1)'
                }}>
                    <Utensils color="white" size={40} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 className="headline-md" style={{ marginBottom: '0.75rem' }}>Verify Your Number</h2>
                    <p className="body-md" style={{ padding: '0 1rem' }}>
                        Enter the 4-digit code sent to your mobile number <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>+91 {mobile || '—'}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2.5rem' }}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                maxLength="1"
                                className="input-field"
                                style={{ width: '3.5rem', height: '4.5rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, padding: 0 }}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                        document.getElementById(`otp-${i - 1}`).focus();
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>Verify & Continue</span>
                            <ArrowRight size={20} />
                        </button>
                        <button type="button" className="btn-secondary" style={{ width: '100%', background: 'var(--surface-container-low)', color: 'var(--on-surface-variant)', padding: '1rem' }}>
                            Try another method
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--outline-variant)', opacity: 0.3 }}></div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--outline-variant)', opacity: 0.6 }}></div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--outline-variant)', opacity: 0.3 }}></div>
                </div>
            </main>

            <div style={{ position: 'fixed', bottom: '-6rem', left: '-6rem', width: '16rem', height: '16rem', background: 'rgba(184, 19, 14, 0.05)', borderRadius: '50%', filter: 'blur(48px)', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', top: '6rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(140, 80, 0, 0.05)', borderRadius: '50%', filter: 'blur(32px)', zIndex: -1 }}></div>
        </div>
    );
};

export default OTPPage;
