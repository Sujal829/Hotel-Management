import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Camera, Save, User, Smartphone, Mail, ChevronRight, Package, Calendar } from 'lucide-react';
import { loadUser } from '../slices/authSlice';

const ProfilePage = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/user`);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch order history", err);
            }
        };
        fetchHistory();
    }, []);

    const handleUpdate = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profile/update`, formData);
            dispatch(loadUser());
            setEditMode(false);
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/profile/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            dispatch(loadUser());
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface p-6 flex flex-col gap-10">
            <header className="flex flex-col gap-2 mt-20" style={{ maxWidth: '1200px', margin: '80px auto 0 auto', width: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.2em' }}>EDITORIAL IDENTITY</span>
                <h1 className="display-sm">Personal <span style={{ color: 'var(--primary)' }}>Curatory</span></h1>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                
                {/* Profile Identity Card - Bento Item */}
                <div className="editorial-shadow" style={{ gridColumn: 'span 5', background: 'var(--surface-container-lowest)', borderRadius: '2.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '100px', height: '100px', borderRadius: '2rem', background: 'var(--surface-container-low)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' 
                            }}>
                                {user?.avatarUrl ? (
                                    <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${user.avatarUrl}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={40} color="var(--primary)" />
                                )}
                            </div>
                            <label style={{ 
                                position: 'absolute', bottom: '-8px', right: '-8px', 
                                background: 'var(--primary)', width: '36px', height: '36px', 
                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'white', border: '4px solid var(--surface-container-lowest)'
                            }}>
                                <Camera size={16} />
                                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                            </label>
                            {uploading && <div style={{ position: 'absolute', inset: 0, borderRadius: '2rem', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>...</div>}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{user?.name}</h2>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <Smartphone size={14} /> {user?.mobile}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {editMode ? (
                            <AnimatePresence>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                        <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                        <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" />
                                    </div>
                                    <button className="btn-primary" onClick={handleUpdate} style={{ marginTop: '0.5rem' }}>Save Changes</button>
                                    <button onClick={() => setEditMode(false)} style={{ background: 'transparent', fontWeight: 700, fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Cancel</button>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'var(--surface-container-low)', borderRadius: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Mail size={20} color="var(--primary)" />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>EMAIL</span>
                                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.email || 'Not set'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditMode(true)} style={{ color: 'var(--primary)', background: 'transparent' }}>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--surface-container-low)', borderRadius: '1.5rem', opacity: 0.5 }}>
                                    <Calendar size={20} color="var(--primary)" />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>JOINED</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>March 2026</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Editorial Archive - Bento Item */}
                <div className="editorial-shadow" style={{ gridColumn: 'span 7', background: 'var(--surface-container-lowest)', borderRadius: '2.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="title-lg" style={{ margin: 0 }}>Editorial Archive</h3>
                        <div style={{ padding: '8px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {orders.length} ENTRIES
                        </div>
                    </div>

                    <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, gap: '1rem', minHeight: '300px' }}>
                                <Package size={48} />
                                <p className="body-md">Archive is awaiting your first curation.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <motion.div 
                                    key={order._id} 
                                    whileHover={{ x: 8 }}
                                    style={{ 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        padding: '1.25rem', background: 'var(--surface-container-low)', borderRadius: '1.5rem',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Utensils size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>#{order._id.slice(-6).toUpperCase()}</h4>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>Table {order.tableNumber} • {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>₹{order.totalAmount}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '2px' }}>
                                                <div style={{ 
                                                    width: '6px', height: '6px', borderRadius: '50%', 
                                                    background: order.status === 'Completed' ? '#4CAF50' : 
                                                               order.status === 'Rejected' ? 'var(--primary)' : 'var(--secondary)'
                                                }}></div>
                                                <span style={{ 
                                                    fontSize: '0.65rem', fontWeight: 800, 
                                                    color: order.status === 'Completed' ? '#4CAF50' : 
                                                           order.status === 'Rejected' ? 'var(--primary)' : 'var(--secondary)'
                                                }}>{order.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} color="var(--on-surface-variant)" opacity={0.3} />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const Utensils = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

export default ProfilePage;
