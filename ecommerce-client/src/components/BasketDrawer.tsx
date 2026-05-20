'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

interface BasketDrawerProps {
  onCheckoutTrigger: () => void;
}

export default function BasketDrawer({ onCheckoutTrigger }: BasketDrawerProps) {
  const { 
    basket, 
    isBasketOpen, 
    toggleBasket, 
    addItemToBasket, 
    removeItemFromBasket, 
    clearBasket,
    user,
    toggleAuth
  } = useApp();

  if (!isBasketOpen) return null;

  const items = basket?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutClick = () => {
    toggleBasket(false);
    if (!user) {
      // User must be authenticated to check out
      toggleAuth(true);
    } else {
      onCheckoutTrigger();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 5, 10, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'opacity 0.3s ease'
    }} onClick={() => toggleBasket(false)}>
      
      {/* Drawer Body */}
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Basket</h2>
            <span style={{
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.1rem 0.5rem',
              borderRadius: '999px',
              border: '1px solid var(--border-active)'
            }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button 
            onClick={() => toggleBasket(false)}
            style={{
              padding: '0.4rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
            className="close-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Items List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          {items.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>Your basket is empty</p>
                <p style={{ fontSize: '0.85rem' }}>Add some products from the shop catalog to get started.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.2rem',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                {/* Product Thumbnail */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--surface-light)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.pictureUrl && item.pictureUrl !== 'url1' && item.pictureUrl !== 'url2' ? (
                    <img src={item.pictureUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, var(--primary), #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.4rem'
                    }}>
                      {item.productName[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                    {item.productName}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.brand} | {item.category}
                  </span>
                  
                  {/* Quantity adjustments */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.4rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--surface-light)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '0.15rem'
                    }}>
                      <button 
                        onClick={() => removeItemFromBasket(item.id, 1)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => addItemToBasket({ id: item.id, name: item.productName, price: item.price, pictureUrl: item.pictureUrl, brandName: item.brand, categoryName: item.category } as any, 1)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItemFromBasket(item.id, item.quantity)}
                      style={{
                        color: '#f87171',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price Subtotal */}
                <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {items.length > 0 && (
          <div style={{
            padding: '1.5rem',
            background: 'rgba(10, 15, 29, 0.4)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <strong style={{ color: 'var(--text)', fontSize: '1.1rem' }}>${subtotal.toFixed(2)}</strong>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Shipping and taxes calculated at checkout. Baskets are securely cached on Redis.
            </p>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                onClick={clearBasket}
                style={{
                  flex: '0 0 100px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                Clear
              </button>
              
              <button 
                onClick={handleCheckoutClick}
                style={{
                  flexGrow: 1,
                  background: 'var(--primary)',
                  color: 'var(--bg)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.8rem',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'background 0.2s ease'
                }}
                className="checkout-btn"
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .close-btn:hover {
          border-color: #f87171 !important;
          color: #f87171 !important;
        }
        .checkout-btn:hover {
          background: var(--primary-hover) !important;
        }
      `}</style>
    </div>
  );
}
