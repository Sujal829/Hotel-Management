import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, Grid, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../slices/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        color: isActive ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
        background: isActive ? 'var(--primary-container)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontWeight: 500,
    });

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            background: 'var(--surface-container-low)',
            padding: '3rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h2 className="title-lg" style={{ color: 'var(--primary)', marginBottom: '3.5rem', textAlign: 'center', fontWeight: 800 }}>EDITORIAL HUB</h2>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <NavLink to="/admin" end style={linkStyle}>
                    <LayoutDashboard size={20} /> Overview
                </NavLink>
                <NavLink to="/admin/orders" style={linkStyle}>
                    <ShoppingBag size={20} /> Live Issues
                </NavLink>
                <NavLink to="/admin/menu" style={linkStyle}>
                    <Utensils size={20} /> Flavor Collection
                </NavLink>
                <NavLink to="/admin/tables" style={linkStyle}>
                    <Grid size={20} /> Space Mapping
                </NavLink>
            </div>

            <button
                onClick={() => dispatch(logoutUser())}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    color: 'var(--on-surface-variant)',
                    background: 'var(--surface-container-high)',
                    borderRadius: '12px',
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    );
};

export default Sidebar;
