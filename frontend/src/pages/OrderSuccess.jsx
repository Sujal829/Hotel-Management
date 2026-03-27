import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Utensils } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tableNumber, total } = location.state || { tableNumber: '00', total: 0 };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Polish */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'rgba(184, 19, 14, 0.05)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>
            
            <main style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1, gap: '2.5rem' }}>
                <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                        style={{ 
                            width: '96px', height: '96px', background: 'var(--primary)', borderRadius: '2.5rem', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 20px 40px rgba(184, 19, 14, 0.2)'
                        }}
                    >
                        <Check size={48} color="white" strokeWidth={3} />
                    </motion.div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h1 className="display-sm" style={{ color: 'var(--on-surface)', margin: 0 }}>Order Confirmed</h1>
                        <p className="body-md" style={{ padding: '0 1rem' }}>
                            We're curating your artisanal flavors. Your journey to a bespoke dining experience has begun.
                        </p>
                    </div>
                </header>

                <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="editorial-shadow" style={{ 
                        background: 'var(--surface-container-lowest)', borderRadius: '1.5rem', padding: '1.5rem', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--surface-container-low)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Utensils size={20} color="var(--primary)" />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', display: 'block' }}>RESERVED TABLE</span>
                                <span style={{ fontWeight: 800 }}>Table No. {tableNumber}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', display: 'block' }}>TOTAL AMOUNT</span>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{total}</span>
                        </div>
                    </div>

                    <div style={{ background: 'var(--surface-container-low)', borderRadius: '1.5rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Sparkles size={18} color="var(--primary)" />
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, textAlign: 'left' }}>
                            Your estimated preparation time is <span style={{ color: 'var(--primary)' }}>15-20 minutes</span>.
                        </p>
                    </div>
                </section>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate('/track-order')}
                        className="btn-primary" 
                        style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                        <span>Track Your Flavors</span>
                        <ArrowRight size={20} />
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', padding: '1rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--on-surface-variant)', opacity: 0.6 }}
                    >
                        Back to Library
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OrderSuccess;
