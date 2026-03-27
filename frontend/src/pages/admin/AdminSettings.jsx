import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    User, 
    Shield, 
    Bell, 
    Store, 
    Smartphone, 
    LogOut,
    ChevronRight,
    Camera,
    Users,
    Key
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('Profile');

    const tabs = [
        { name: 'Profile', icon: <User size={20} /> },
        { name: 'Restaurant', icon: <Store size={20} /> },
        { name: 'Security', icon: <Shield size={20} /> },
        { name: 'Staff', icon: <Users size={20} /> },
        { name: 'Notifications', icon: <Bell size={20} /> },
    ];

    return (
        <main className="flex-1 p-6 lg:p-10 max-w-full bg-surface">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">System Configuration</h1>
                <p className="text-on-surface-variant max-w-2xl">Manage your restaurant's digital identity, staff permissions, and security protocols from a central bento hub.</p>
            </header>

            <div className="grid grid-cols-12 gap-8 lg:gap-10">
                {/* Navigation Sidebar (3 columns) */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.name ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            <div className="flex items-center gap-4 font-bold tracking-tight">
                                {tab.icon}
                                {tab.name}
                            </div>
                            <ChevronRight size={16} className={activeTab === tab.name ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                    <div className="pt-8 px-2">
                        <button className="flex items-center gap-4 text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors w-full">
                            <LogOut size={20} />
                            Sign Out System
                        </button>
                    </div>
                </div>

                {/* Content Area (9 columns) */}
                <div className="col-span-12 lg:col-span-9">
                    {activeTab === 'Profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Personal Bento */}
                            <div className="col-span-1 md:col-span-2 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col md:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-full bg-surface-container-high overflow-hidden border-4 border-white shadow-xl">
                                        <img className="w-full h-full object-cover" src={user?.avatar || "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200"} alt="Profile" />
                                    </div>
                                    <button className="absolute bottom-1 right-1 bg-primary text-white p-3 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <div className="text-center md:text-left space-y-1">
                                    <h3 className="text-3xl font-black text-on-surface">{user?.name || 'Julian Escoffier'}</h3>
                                    <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Head Kitchen Curator</p>
                                    <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                        <span className="px-4 py-1.5 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full uppercase tracking-widest border border-tertiary/20">Authorized Staff</span>
                                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest border border-primary/20">Admin Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Tiles */}
                            <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Work Email</label>
                                <p className="text-xl font-bold text-on-surface mb-6">{user?.email || 'julian@culinarycurator.com'}</p>
                                <button className="text-primary font-bold text-sm hover:underline">Revoke and Update Email</button>
                            </div>
                            
                            <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Mobile Endpoint</label>
                                <p className="text-xl font-bold text-on-surface mb-6">+{user?.mobile || '91 98765 43210'}</p>
                                <button className="text-primary font-bold text-sm hover:underline">Update Verification Number</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">Two-Factor Authentication</h4>
                                    <p className="text-on-surface-variant mb-8 leading-relaxed">Ensure every login is verified via your registered mobile number using our 6-digit cryptographic OTP system.</p>
                                    <div className="flex items-center gap-3 text-tertiary-container font-black uppercase tracking-widest text-xs">
                                        <Shield size={16} />
                                        Statistically Secure (Active)
                                    </div>
                                </div>
                                <div className="bg-primary text-on-primary p-8 rounded-[2rem] flex flex-col justify-between shadow-xl shadow-primary/20">
                                    <Key size={32} className="opacity-40" />
                                    <div>
                                        <p className="text-sm font-bold opacity-80 mb-1">Session Identity</p>
                                        <p className="text-lg font-black tracking-tight">Active JWT v2.0</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10">
                                <h4 className="text-xl font-bold mb-6">Staff Access Logs</h4>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                                <div>
                                                    <p className="font-bold text-on-surface">Successful Staff Login</p>
                                                    <p className="text-xs text-on-surface-variant">Device: iPhone 15 Pro • IP: 192.168.1.{i}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-on-surface-variant font-medium">2 hours ago</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'Profile' && activeTab !== 'Security' && (
                        <div className="flex flex-col items-center justify-center p-20 bg-surface-container-low rounded-[2.5rem] border-2 border-dashed border-outline-variant/20 opacity-40">
                            <LayoutGrid size={48} className="mb-4" />
                            <h3 className="text-2xl font-bold mb-2 text-on-surface">{activeTab} Interface</h3>
                            <p className="text-on-surface-variant font-medium">This module is currently being finalized for the Zestful v3 update.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const LayoutGrid = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);

export default AdminSettings;
