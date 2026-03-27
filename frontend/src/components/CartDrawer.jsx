import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toggleCart, removeFromCart, updateQuantity } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, isOpen } = useSelector((state) => state.cart);

    const total = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
    const resolveImage = (src) => {
        if (!src) return '';
        if (src.startsWith('http://') || src.startsWith('https://')) return src;
        return `${baseUrl}${src}`;
    };

    const handleCheckout = () => {
        dispatch(toggleCart());
        navigate('/select-table');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(toggleCart())}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(27, 27, 29, 0.4)', backdropFilter: 'blur(12px)', zIndex: 1000 }}
                    />
                    <motion.div 
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        style={{ 
                            position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '440px', 
                            zIndex: 1001, background: 'var(--background)', display: 'flex', flexDirection: 'column'
                        }}
                        className="editorial-shadow"
                    >
                        {/* Header */}
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingBag size={20} color="var(--primary)" />
                                </div>
                                <h2 className="title-lg" style={{ margin: 0 }}>Your Selection</h2>
                            </div>
                            <button onClick={() => dispatch(toggleCart())} style={{ padding: '8px', borderRadius: '50%', background: 'var(--surface-container-low)', border: 'none', cursor: 'pointer' }}>
                                <X size={20} color="var(--on-surface-variant)" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {items.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5, gap: '1rem' }}>
                                    <ShoppingBag size={48} />
                                    <p className="body-md">Your curation is awaiting flavors.</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item._id} style={{ display: 'flex', gap: '1rem', background: 'var(--surface-container-lowest)', padding: '1rem', borderRadius: '1.5rem' }} className="editorial-shadow">
                                        <div style={{ width: '80px', height: '80px', borderRadius: '1rem', overflow: 'hidden' }}>
                                            <img src={resolveImage(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h4 style={{ fontSize: '0.925rem', fontWeight: 800, margin: 0 }}>{item.name}</h4>
                                                <span style={{ fontSize: '0.925rem', fontWeight: 800, color: 'var(--primary)' }}>₹{item.finalPrice * item.quantity}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
                                                    <button 
                                                        onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
                                                    >
                                                        <Minus size={14} color="var(--primary)" />
                                                    </button>
                                                    <span style={{ padding: '0 12px', fontWeight: 800, fontSize: '0.875rem' }}>{item.quantity}</span>
                                                    <button 
                                                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
                                                    >
                                                        <Plus size={14} color="var(--primary)" />
                                                    </button>
                                                </div>
                                                <button onClick={() => dispatch(removeFromCart(item._id))} style={{ background: 'transparent', color: 'var(--on-surface-variant)', opacity: 0.4 }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div style={{ padding: '2rem', background: 'var(--surface-container-low)', borderRadius: '2.5rem 2.5rem 0 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Experience</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{total}</span>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} onClick={handleCheckout}>
                                    <span>Reserve Your Table</span>
                                    <Plus size={20} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
