'use client';

import React, { useState } from 'react';
import { Product } from '../services/api';
import { useApp } from '../context/AppContext';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItemToBasket } = useApp();
  const [adding, setAdding] = useState(false);

  // High-aesthetic dynamic gradient matching Emerald theme as a fallback for picture URLs
  const getFallbackImage = (id: number) => {
    const angles = [135, 45, 90, 180, 225];
    const angle = angles[id % angles.length];
    const colors = [
      ['#10b981', '#3b82f6'], // Emerald & Blue
      ['#6366f1', '#a855f7'], // Indigo & Purple
      ['#06b6d4', '#0ea5e9'], // Cyan & Sky
      ['#f43f5e', '#ec4899'], // Rose & Pink
      ['#10b981', '#059669']  // Light Emerald & Dark Emerald
    ];
    const [c1, c2] = colors[id % colors.length];
    return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    await addItemToBasket(product, 1);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div 
      className="glass-container animate-fade-in"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'var(--border-active)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <Link href={`/product/${product.id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
        {/* Product Image Area */}
      <div style={{
        height: '200px',
        width: '100%',
        position: 'relative',
        background: '#111827',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {product.pictureUrl && product.pictureUrl !== 'url1' && product.pictureUrl !== 'url2' ? (
          <img 
            src={product.pictureUrl} 
            alt={product.name} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onError={(e) => {
              // If image fails to load, replace with gradient
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.background = getFallbackImage(product.id);
                const placeholder = document.createElement('div');
                placeholder.innerText = product.name[0];
                placeholder.style.fontSize = '3.5rem';
                placeholder.style.fontWeight = 'bold';
                placeholder.style.color = 'white';
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: getFallbackImage(product.id),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            {product.name ? product.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'P'}
          </div>
        )}

        {/* Brand Tag */}
        {product.brandName && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(10, 15, 29, 0.85)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--border)',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}>
            {product.brandName}
          </span>
        )}

        {/* Category Tag */}
        {product.categoryName && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--primary-glow)',
            border: '1px solid var(--border-active)',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--primary)'
          }}>
            {product.categoryName}
          </span>
        )}
      </div>

        {/* Product Details */}
        <div style={{
          padding: '1.2rem 1.2rem 0.5rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '0.5rem'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h3>
          
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.4rem',
            lineHeight: '1.2rem'
          }}>
            {product.description || 'No description provided for this premium catalog item.'}
          </p>
        </div>
      </Link>

      {/* Pricing and Action */}
      <div style={{
        padding: '0 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</span>
            <span style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button 
            onClick={handleAdd}
            disabled={adding}
            style={{
              background: adding ? 'var(--primary-hover)' : 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--border-active)',
              color: 'var(--primary)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: adding ? 'var(--shadow-glow)' : 'none'
            }}
            className="add-btn"
          >
            {adding ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                <span>Added!</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
  );
}
