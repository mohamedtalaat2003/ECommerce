'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { 
    user, 
    basket, 
    toggleBasket, 
    toggleAuth, 
    logout,
    searchQuery,
    setSearchQuery,
    selectedSort,
    setSelectedSort
  } = useApp();

  const pathname = usePathname();

  const basketCount = basket?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="glass-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '2.2rem',
          height: '2.2rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          A
        </div>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(90deg, #ffffff, var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AURA
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="nav-links">
        <Link href="/" style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: pathname === '/' ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'color 0.2s ease',
          position: 'relative',
          paddingBottom: '4px'
        }}>
          Home
          {pathname === '/' && (
            <span style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', borderRadius: '2px'
            }} />
          )}
        </Link>

        <Link href="/catalog" style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: pathname === '/catalog' ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'color 0.2s ease',
          position: 'relative',
          paddingBottom: '4px'
        }}>
          Catalog
          {pathname === '/catalog' && (
            <span style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', borderRadius: '2px'
            }} />
          )}
        </Link>
        
        <Link href="/about" style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: pathname === '/about' ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'color 0.2s ease',
          position: 'relative',
          paddingBottom: '4px'
        }}>
          About Us
          {pathname === '/about' && (
            <span style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', borderRadius: '2px'
            }} />
          )}
        </Link>

        <Link href="/contact" style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: pathname === '/contact' ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'color 0.2s ease',
          position: 'relative',
          paddingBottom: '4px'
        }}>
          Contact
          {pathname === '/contact' && (
            <span style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', borderRadius: '2px'
            }} />
          )}
        </Link>
        
        {user && (
          <Link href="/admin" style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: pathname === '/admin' ? 'var(--primary)' : '#10b981', // green for visibility
            transition: 'color 0.2s ease',
            position: 'relative',
            paddingBottom: '4px'
          }}>
            Admin
            {pathname === '/admin' && (
              <span style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', borderRadius: '2px'
              }} />
            )}
          </Link>
        )}
      </nav>

      {/* Search Bar - Only on Catalog Page */}
      {pathname === '/catalog' ? (
        <div style={{
          flex: '0 1 350px',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '0.5rem 1.2rem',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }} className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.6rem' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      ) : (
        <div style={{ flexGrow: 1 }} />
      )}

      {/* Sorting & Filter Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {pathname === '/catalog' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by</span>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{
                background: 'var(--surface-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="name">Name</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        )}

        {/* Cart Trigger */}
        <button 
          onClick={() => toggleBasket(true)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.6rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          className="hover-glow"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {basketCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'var(--primary)',
              color: 'var(--bg)',
              fontSize: '0.75rem',
              fontWeight: 800,
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {basketCount}
            </span>
          )}
        </button>

        {/* Auth / Profile Trigger */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Avatar with initials */}
            <div style={{
              width: '2.2rem', height: '2.2rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #4b9161)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.85rem', color: '#fff',
              boxShadow: 'var(--shadow-glow)', flexShrink: 0,
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{user.displayName}</strong>
            </span>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => toggleAuth(true)}
            style={{
              background: 'var(--primary)',
              color: 'var(--bg)',
              border: 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-glow)',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            className="hover-scale"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
