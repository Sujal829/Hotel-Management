import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react';
import { toggleCart } from '../slices/cartSlice';
import { logoutUser } from '../slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="glass-effect hidden md:flex" style={{ 
      padding: '1.25rem 2rem', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.8)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1 className="title-lg" style={{ color: 'var(--primary)', margin: 0, letterSpacing: '-0.04em', fontWeight: 800 }}>Zestful</h1>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6 }}>Culinary Curator</span>
        </div>
        
        <div style={{ position: 'relative', width: '400px', display: 'none', md: 'block' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Search for artisanal flavors..." 
            className="input-field" 
            style={{ paddingLeft: '3.5rem', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer', background: 'var(--surface-container-high)', padding: '12px', borderRadius: '1.25rem' }} onClick={() => dispatch(toggleCart())}>
          <ShoppingCart size={22} color="var(--primary)" />
          {items.length > 0 && (
            <span style={{ 
              position: 'absolute', top: '10%', right: '10%', background: 'var(--primary)', color: 'white', 
              borderRadius: '50%', width: '18px', height: '18px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800
            }}>{items.length}</span>
          )}
        </div>
        
        <Link to="/profile" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '6px 16px 6px 8px', 
          background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', 
          textDecoration: 'none', color: 'inherit' 
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name?.split(' ')[0] || 'Guest'}</span>
        </Link>

        <button onClick={() => dispatch(logoutUser())} style={{ background: 'transparent', color: 'var(--on-surface-variant)', opacity: 0.5, marginLeft: '0.5rem' }}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
