import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, PlusCircle, LaptopMinimalCheck } from 'lucide-react';

const AddDishModal = ({ isOpen, onClose, categoryId, categories, dish }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        originalPrice: '',
        discountPercentage: '',
        category: categoryId || '',
        dietary: 'Vegetarian'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (categoryId) setFormData(prev => ({ ...prev, category: categoryId }));
    }, [categoryId]);

    useEffect(() => {
        if (!dish) return;
        setFormData({
            name: dish.name || '',
            description: dish.description || '',
            originalPrice: dish.originalPrice ?? '',
            discountPercentage: dish.discountPercentage ?? '',
            category: dish.category?._id || dish.category || categoryId || '',
            dietary: dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian',
        });

        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
        if (dish.image) {
            setPreview(dish.image.startsWith('http') ? dish.image : `${baseUrl}${dish.image}`);
        }
    }, [dish, categoryId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('originalPrice', formData.originalPrice);
        data.append('discountPercentage', formData.discountPercentage || 0);
        data.append('category', formData.category);
        data.append('isVeg', formData.dietary === 'Vegetarian');
        if (image) data.append('image', image);

        try {
            if (dish?._id) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/menu/${dish._id}`, data);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/menu`, data);
            }
            onClose();
            setFormData({ name: '', description: '', originalPrice: '', discountPercentage: '', category: categoryId || '', dietary: 'Vegetarian' });
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error("Add dish error:", err);
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
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="relative bg-surface w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[95vh] hide-scrollbar"
                >
                    <header className="sticky top-0 w-full z-10 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
                                <X className="text-red-700 w-6 h-6" />
                            </button>
                            <h2 className="font-bold tracking-tight text-xl">Integrate New Dish</h2>
                        </div>
                    </header>

                    <div className="p-8">
                        <section className="mb-10">
                            <h3 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">The Next <span className="text-primary">Masterpiece</span>.</h3>
                            <p className="text-on-surface-variant text-lg">Introduce a new flavor profile to your digital lookbook. Excellence is in the details.</p>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Hero Image Area */}
                            <div className="relative group cursor-pointer bg-surface-container-high rounded-[2rem] h-64 overflow-hidden shadow-inner flex flex-col items-center justify-center">
                                <input type="file" id="dishImage" className="hidden" onChange={handleImageChange} accept="image/*" />
                                <label htmlFor="dishImage" className="absolute inset-0 z-10 cursor-pointer flex flex-col items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Dish" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Camera className="text-primary w-8 h-8" />
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Hero Image Upload</span>
                                        </>
                                    )}
                                </label>
                                {preview && (
                                    <div className="absolute bottom-4 right-4 z-20 bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-primary shadow-lg border border-primary/10">
                                        REPLACE PHOTO
                                    </div>
                                )}
                            </div>

                            {/* Core Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Dish Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full bg-surface-container-highest border-none rounded-2xl px-5 py-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all" 
                                        placeholder="e.g. Truffle Infused Risotto"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Price (₹)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full bg-surface-container-highest border-none rounded-2xl px-5 py-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all text-xl" 
                                        placeholder="00.00"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Discount (%)</label>
                                <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full bg-surface-container-highest border-none rounded-2xl px-5 py-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="0"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                                />
                            </div>

                            {/* Category & Diet Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Culinary Pillar</label>
                                    <select 
                                        required
                                        className="w-full bg-surface-container-highest border-none rounded-2xl px-5 py-4 font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23b8130e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.25rem_center] bg-no-repeat"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Dietary Preference</label>
                                    <div className="flex gap-2 p-1 bg-surface-container-highest rounded-2xl h-[56px]">
                                        {['Vegetarian', 'Non-Vegetarian'].map(type => (
                                            <button 
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, dietary: type})}
                                                className={`flex-1 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.dietary === type ? 'bg-white shadow-sm text-primary scale-100' : 'text-zinc-400 scale-95 hover:text-on-surface'}`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full border-2 ${type === 'Vegetarian' ? 'border-green-600 p-0.5' : 'border-red-600 p-0.5'}`}>
                                                        <div className={`w-full h-full rounded-full ${type === 'Vegetarian' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                    </div>
                                                    {type.split('-').pop()}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Culinary Story / Ingredients</label>
                                <textarea 
                                    className="w-full bg-surface-container-highest border-none rounded-2xl px-6 py-5 text-on-surface placeholder:text-zinc-400 focus:ring-0 focus:border-b-2 focus:border-primary transition-all leading-relaxed" 
                                    placeholder="Tell the story of this dish... mention key ingredients and allergens." 
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="pt-4 border-t border-surface-container-high">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-5 rounded-full bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:bg-primary-container"
                                >
                                    <PlusCircle size={24} />
                                    <span>{dish?._id ? 'Update Dish' : 'Curate Dish'}</span>
                                </motion.button>
                                <button type="button" onClick={onClose} className="w-full py-4 mt-2 text-on-surface-variant font-semibold text-sm uppercase tracking-widest hover:text-red-700 transition-colors">
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

export default AddDishModal;
