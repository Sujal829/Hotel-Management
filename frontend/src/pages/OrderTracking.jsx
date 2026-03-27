import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, CheckCircle2, Circle } from 'lucide-react';

const OrderTracking = () => {
    const navigate = useNavigate();

    const steps = [
        { label: 'Order Confirmed', sub: 'We have received your curation', status: 'completed' },
        { label: 'Chef Assigned', sub: 'Artisanal preparation in progress', status: 'active' },
        { label: 'Quality Check', sub: 'Ensuring specific zestful standards', status: 'pending' },
        { label: 'Ready to Serve', sub: 'Your flavors are arriving at the canvas', status: 'pending' }
    ];

    return (
        <div className="min-h-screen bg-surface p-6 flex flex-col gap-6">
            <header className="flex items-center justify-between py-4">
                <button onClick={() => navigate('/')} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                    <ArrowLeft size={24} color="var(--on-surface)" />
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="title-lg" style={{ margin: 0, fontWeight: 800 }}>Tracking Flavors</h1>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>Phase 03/03</span>
                </div>
                <div style={{ width: '48px' }}></div>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <section className="editorial-shadow" style={{ background: 'var(--primary)', borderRadius: '2.5rem', padding: '2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ zIndex: 1 }}>
                        <h2 className="headline-md" style={{ color: 'white', marginBottom: '0.5rem' }}>Arriving in 12 min</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
                            <Clock size={16} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Artisanal preparation is 65% complete</span>
                        </div>
                    </div>
                    <div style={{ 
                        width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '2rem', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 
                    }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                            <Clock size={40} color="white" />
                        </motion.div>
                    </div>
                </section>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div className="editorial-shadow" style={{ background: 'var(--surface-container-lowest)', borderRadius: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--surface-container-low)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={20} color="var(--secondary)" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', display: 'block' }}>YOUR CANVAS</span>
                            <span style={{ fontWeight: 800 }}>Table No. 04</span>
                        </div>
                    </div>
                    <div className="editorial-shadow" style={{ background: 'var(--surface-container-lowest)', borderRadius: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--surface-container-low)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', display: 'block' }}>ORDER REF</span>
                            <span style={{ fontWeight: 800 }}>#ZST-0842</span>
                        </div>
                    </div>
                </section>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 1rem' }}>
                    <h3 className="title-lg">Curator's Journey</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                        {/* Timeline Connector */}
                        <div style={{ position: 'absolute', left: '15px', top: '15px', bottom: '15px', width: '2px', background: 'var(--surface-container-highest)', zIndex: 0 }}></div>
                        
                        {steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', zIndex: 1 }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', 
                                    background: step.status === 'completed' ? 'var(--primary)' : 
                                               step.status === 'active' ? 'white' : 'var(--surface-container-highest)',
                                    border: step.status === 'active' ? '3px solid var(--primary)' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {step.status === 'completed' ? <CheckCircle2 size={18} color="white" /> : 
                                     step.status === 'active' ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div> : 
                                     <Circle size={18} color="var(--on-surface-variant)" opacity={0.3} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ 
                                        fontSize: '1rem', fontWeight: 800, margin: 0,
                                        color: step.status === 'pending' ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                                        opacity: step.status === 'pending' ? 0.5 : 1
                                    }}>{step.label}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', margin: '4px 0 0 0', opacity: 0.6 }}>{step.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <button 
                    onClick={() => navigate('/')}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '1.25rem', background: 'var(--surface-container-high)', color: 'var(--on-surface)', marginTop: '1rem' }}
                >
                    Add More to Experience
                </button>
            </main>
        </div>
    );
};

export default OrderTracking;
