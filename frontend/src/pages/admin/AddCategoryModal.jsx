import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, PlusCircle } from 'lucide-react';

const AddCategoryModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/menu/categories`, formData);
            onClose();
            setName('');
            setDescription('');
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error("Add category error:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                ></motion.div>
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-surface w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar"
                >
                    <header className="sticky top-0 w-full z-10 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
                                <X className="text-red-700 w-6 h-6" />
                            </button>
                            <h2 className="font-bold tracking-tight text-xl">Add New Category</h2>
                        </div>
                    </header>

                    <div className="p-8">
                        <section className="mb-10 text-center md:text-left">
                            <h3 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Refine your <span className="text-primary">Vision</span>.</h3>
                            <p className="text-on-surface-variant text-lg">Define a new culinary pillar for your menu. Organize flavors with editorial precision.</p>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Image Upload */}
                            <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-8 rounded-[2rem]">
                                <div className="relative group cursor-pointer">
                                    <input 
                                        type="file" 
                                        id="catImage" 
                                        className="hidden" 
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <label htmlFor="catImage" className="cursor-pointer">
                                        <div className="w-48 h-48 rounded-[2.5rem] bg-surface-container-highest flex flex-col items-center justify-center overflow-hidden transition-all group-hover:ring-4 ring-primary-fixed-dim shadow-xl shadow-zinc-200/20 relative">
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Camera className="w-12 h-12 text-primary/40 mb-2" />
                                                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Upload Photo</span>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-primary shadow-sm">CHANGE</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-on-surface mb-1">Category Thumbnail</h4>
                                    <p className="text-sm text-on-surface-variant leading-snug">Choose a high-resolution visual representing these flavors. 1:1 Aspect ratio recommended.</p>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-1 gap-8 px-4">
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-3 ml-1">Category Name</label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-6 py-5 text-on-surface placeholder:text-zinc-400 focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-lg font-medium" 
                                        placeholder="e.g. Signature Starters"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Editorial Description</label>
                                    <textarea 
                                        className="w-full bg-surface-container-highest border-none rounded-2xl px-6 py-5 text-on-surface placeholder:text-zinc-400 focus:ring-0 focus:border-b-2 focus:border-primary transition-all leading-relaxed" 
                                        placeholder="Briefly describe the story behind these dishes..." 
                                        rows="4"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    <PlusCircle size={24} />
                                    <span>Create Category</span>
                                </motion.button>
                                <button type="button" onClick={onClose} className="w-full py-4 text-on-surface-variant font-semibold text-sm uppercase tracking-widest hover:text-primary transition-colors">
                                    Discard Draft
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddCategoryModal;
