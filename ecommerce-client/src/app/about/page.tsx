'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import BasketDrawer from '../../components/BasketDrawer';
import AuthDrawer from '../../components/AuthDrawer';
import CheckoutModal from '../../components/CheckoutModal';
import OrdersModal from '../../components/OrdersModal';
import { Order } from '../../services/api';
import Link from 'next/link';

export default function AboutPage() {
  // Global drawers state support for secondary page
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleOrderSuccess = (order: Order) => {
    setCheckoutOpen(false);
    setCompletedOrder(order);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '3rem 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }} className="animate-fade-in">
        
        {/* Storytelling Brand Intro */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--primary)',
            letterSpacing: '2px',
            background: 'var(--primary-glow)',
            border: '1px solid var(--border-active)',
            padding: '0.4rem 1.2rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            boxShadow: 'var(--shadow-glow)'
          }}>
            The Aura Story
          </span>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            background: 'linear-gradient(90deg, #ffffff, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: '650px'
          }}>
            Next Generation Storefront Architecture
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '600px',
            marginTop: '0.5rem'
          }}>
            Aura is a state-of-the-art multi-tenant SaaS storefront engineered to demonstrate high-performance transactions, beautiful glassmorphism aesthetics, and robust caching frameworks.
          </p>
        </div>

        {/* Story Block Section */}
        <div className="glass-container" style={{
          borderRadius: '20px',
          padding: '2.5rem',
          border: '1px solid var(--glass-border)',
          background: 'rgba(17, 24, 39, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)' }}>Our Vision</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            We believe that modern e-commerce should not only be blindingly fast but should also present a deeply satisfying interactive journey. By crafting an ultra-premium Dark Mode using fine HSL Hues, glass panels, and ambient fixed gradient backdrops, Aura stands out as a luxurious shopping platform.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Under the hood, the client communicates with an enterprise ASP.NET Core API hosted in Azure Cloud, leveraging PostgreSQL database endpoints, secure identity authorizations, and fully decoupled baskets backed by high-throughput Redis databases.
          </p>
        </div>

        {/* Three Column Glassmorphic Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>Architectural Pillars</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Pillar 1: Redis Caching */}
            <div 
              className="glass-container hover-glow-card"
              style={{
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid var(--glass-border)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                  <path d="M3 12A9 3 0 0 0 21 12"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>High Performance Redis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Decoupled multi-tenant caching ensures baskets persist with sub-millisecond lookups. If the Redis server experiences transient failures, our client recovers instantly utilizing optimistic local state managers.
              </p>
            </div>

            {/* Pillar 2: Premium Emerald Aesthetics */}
            <div 
              className="glass-container hover-glow-card"
              style={{
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid var(--glass-border)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--border-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                  <line x1="12" y1="22" x2="12" y2="15.5"></line>
                  <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                  <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
                  <line x1="12" y1="2" x2="12" y2="8.5"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Premium Emerald Aesthetics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Handcrafted HSL Emerald tokens paired with fluid keyframe-animated glow bubbles create an interactive experience. A dashboard feel designed to engage and keep shoppers visually immersed.
              </p>
            </div>

            {/* Pillar 3: Resilient SaaS API */}
            <div 
              className="glass-container hover-glow-card"
              style={{
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid var(--glass-border)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M2 12h20"></path>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Resilient SaaS APIs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Strict multi-tenant security layers protect JWT authorization exchanges, deliveries, and payment checkout methods. Complete separation of client states facilitates secure global deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            href="/catalog"
            style={{
              background: 'var(--primary)',
              color: 'var(--bg)',
              padding: '0.8rem 2.2rem',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-glow)',
              transition: 'transform 0.2s'
            }}
            className="hover-scale"
          >
            Start Exploring Catalog
          </Link>
        </div>
      </main>

      {/* Global Drawers & Modals */}
      <BasketDrawer onCheckoutTrigger={() => setCheckoutOpen(true)} />
      <AuthDrawer />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        onOrderSuccess={handleOrderSuccess} 
      />

      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setOrdersOpen(false)} 
      />

      {/* Checkout Success Confirmation Modal */}
      {completedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(5, 5, 10, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setCompletedOrder(null)}>
          <div 
            className="glass-container animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--surface)',
              border: '1px solid var(--border-active)',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-glow), var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'var(--primary-glow)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order Placed Successfully!</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Your order <strong style={{ color: 'var(--text)' }}>#{completedOrder.id}</strong> has been successfully placed. A cached Redis basket has been cleaned up.
              </p>
            </div>

            <div className="glass-container" style={{
              width: '100%',
              borderRadius: '8px',
              padding: '0.8rem 1.2rem',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <span>Total Paid:</span>
              <strong style={{ color: 'var(--primary)' }}>${completedOrder.total?.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', width: '100%', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => { setCompletedOrder(null); setOrdersOpen(true); }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                View History
              </button>
              
              <button 
                onClick={() => setCompletedOrder(null)}
                style={{
                  flex: 1,
                  background: 'var(--primary)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
