import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../slices/menuSlice';
import { addToCart } from '../slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Leaf, Flame, Sparkles, MapPin } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { dishes, categories } = useSelector(state => state.menu);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
    const resolveImage = (src) => {
        if (!src) return '';
        if (src.startsWith('http://') || src.startsWith('https://')) return src;
        return `${baseUrl}${src}`;
    };

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const filteredDishes = dishes.filter(dish => {
        const matchesCategory = selectedCategory === 'All' || dish.category?.name === selectedCategory;
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoriesList = ['All', ...categories.map(c => c.name)];

    return (
        <div className="page-container" style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Header Section */}
            <header style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-container-low)', padding: '6px 12px', borderRadius: 'var(--radius-full)', width: 'fit-content', marginBottom: '1rem' }}>
                            <MapPin size={14} color="var(--primary)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>Table 04 • Zestful Main Hall</span>
                        </div>
                        <h1 className="display-lg" style={{ maxWidth: '400px', marginBottom: '0.5rem' }}>What's your <span style={{ color: 'var(--primary)' }}>cravings</span> today?</h1>
                    </div>
                    <div className="editorial-shadow" style={{ width: '48px', height: '48px', borderRadius: '1.25rem', background: 'var(--surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} color="var(--primary)" />
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search size={22} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', opacity: 0.4 }} />
                    <input 
                        type="text" 
                        placeholder="Search artisanal dishes, ingredients..." 
                        style={{ width: '100%', padding: '1.5rem 1.5rem 1.5rem 4rem', background: 'var(--surface-container-lowest)', border: 'none', borderRadius: '2rem', fontSize: '1.125rem', outline: 'none' }}
                        className="editorial-shadow"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Category Discovery */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="title-lg">Discovery</h2>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>View All</span>
                </div>
                <div className="no-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '4px' }}>
                    {categoriesList.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '12px 24px', borderRadius: '1.5rem', whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.875rem',
                                background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface-container-low)',
                                color: selectedCategory === cat ? 'white' : 'var(--on-surface-variant)',
                                transition: 'all 0.3s ease'
                            }}
                        >{cat}</button>
                    ))}
                </div>
            </section>

            {/* Daily Specials / Staggered Grid */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="title-lg">Daily Specials</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--surface-container-highest)' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--surface-container-highest)' }}></div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {filteredDishes.map((dish, index) => {
                            // First item is large hero, others are smaller
                            const isHero = index === 0 && selectedCategory === 'All';
                            return (
                                <motion.div
                                    key={dish._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    style={{ 
                                        gridColumn: isHero ? 'span 2' : 'auto',
                                        position: 'relative',
                                        borderRadius: '2.5rem',
                                        overflow: 'hidden',
                                        background: 'var(--surface-container-lowest)',
                                    }}
                                    className="editorial-shadow"
                                >
                                    <div style={{ 
                                        aspectRatio: isHero ? '21/9' : '4/5', 
                                        width: '100%', 
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <img src={resolveImage(dish.image)} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '6px' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '1rem', backdropFilter: 'blur(8px)' }}>
                                                {dish.isVeg ? <Leaf size={18} color="#4CAF50" fill="#4CAF50" /> : <Flame size={18} color="#FF5722" fill="#FF5722" />}
                                            </div>
                                        </div>
                                        {isHero && (
                                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.75rem' }}>
                                                CHEF'S CHOICE
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{dish.name}</h3>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{dish.category?.name}</p>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                {dish.discountPercentage > 0 && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)', textDecoration: 'line-through', opacity: 0.6 }}>₹{dish.originalPrice}</span>
                                                )}
                                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{dish.finalPrice}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => dispatch(addToCart(dish))}
                                            className="btn-primary" 
                                            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: isHero ? 'var(--primary)' : 'var(--surface-container-high)', color: isHero ? 'white' : 'var(--on-surface)' }}
                                        >
                                            <Plus size={20} />
                                            <span>Add to Experience</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
