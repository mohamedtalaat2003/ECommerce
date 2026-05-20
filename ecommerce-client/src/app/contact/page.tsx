'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import BasketDrawer from '../../components/BasketDrawer';
import AuthDrawer from '../../components/AuthDrawer';
import CheckoutModal from '../../components/CheckoutModal';
import OrdersModal from '../../components/OrdersModal';
import { Order } from '../../services/api';
import Link from 'next/link';

export default function ContactPage() {
  // Global drawers state support for secondary page
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Contact form local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleOrderSuccess = (order: Order) => {
    setCheckoutOpen(false);
    setCompletedOrder(order);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSending(true);
    
    // Simulate API transport handshake with 1.2s delay
    setTimeout(() => {
      setIsSending(false);
      setIsMessageSent(true);
      // Reset inputs after transmit
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }} className="animate-fade-in">

        {/* Storytelling Header Banner */}
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
            Connect With Us
          </span>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            background: 'linear-gradient(90deg, #ffffff, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: '700px'
          }}>
            Let's Shape the Future of Commerce
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '600px',
            marginTop: '0.5rem'
          }}>
            Have questions about our multi-tenant SaaS capabilities, custom integration points, or premium dark-mode storefront frameworks? Reach out directly to our concierge team.
          </p>
        </div>

        {/* Responsive Two-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          
          {/* Left Column: Glassmorphic Message Compose Form */}
          <form 
            onSubmit={handleSendMessage}
            className="glass-container"
            style={{
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid var(--glass-border)',
              background: 'rgba(17, 24, 39, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.4rem' }}>
                Send a Message
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Fill out the secure fields below. Your transmission is processed with high-priority transport envelopes.
              </p>
            </div>

            {/* Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Name</label>
              <div 
                className="input-wrap"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', fontSize: '0.9rem', color: 'var(--text)' }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
              <div 
                className="input-wrap"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', fontSize: '0.9rem', color: 'var(--text)' }}
                />
              </div>
            </div>

            {/* Subject Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Subject</label>
              <div 
                className="input-wrap"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <input 
                  type="text" 
                  placeholder="How can we assist you?" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{ width: '100%', fontSize: '0.9rem', color: 'var(--text)' }}
                />
              </div>
            </div>

            {/* Message Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Message</label>
              <div 
                className="input-wrap"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  transition: 'all 0.3s ease'
                }}
              >
                <textarea 
                  rows={4}
                  placeholder="Describe your inquiry in detail..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    fontSize: '0.9rem', 
                    color: 'var(--text)',
                    resize: 'none',
                    background: 'none',
                    border: 'none',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              style={{
                background: 'var(--primary)',
                color: 'var(--bg)',
                padding: '0.9rem',
                borderRadius: '10px',
                fontWeight: 750,
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
              className="hover-scale"
            >
              {isSending ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Transmit Message</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Premium Brand Coordinates */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* Coordinates Card */}
            <div 
              className="glass-container hover-glow-card"
              style={{
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid var(--glass-border)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                flexGrow: 1,
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
                  Aura Headquarters
                </h2>
                <div style={{ width: '40px', height: '3px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.5rem' }} />
              </div>

              {/* Coordinate Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Headquarters Address */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--border-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Office Address</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '0.2rem' }}>
                      Aura Labs, 742 Luxury Boulevard<br />
                      Suite 500, Geneva 1201<br />
                      Switzerland
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Concierge Desk</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <a href="mailto:concierge@aura-commerce.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                        concierge@aura-commerce.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a855f7',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Global Support</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      +41 22 789 2400
                    </p>
                  </div>
                </div>

              </div>

              {/* Animated Social Icon Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Connect Online
                </h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Twitter', 'GitHub', 'LinkedIn', 'Dribbble'].map((social) => (
                    <a 
                      key={social}
                      href={`https://${social.toLowerCase()}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-container hover-bg"
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid var(--glass-border)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.color = 'inherit';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Back to Catalog Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            href="/catalog"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.8rem 2.2rem',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
            className="hover-bg"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Back to Catalog
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

      {/* Message Sent Success Glassmorphic Modal */}
      {isMessageSent && (
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
        }} onClick={() => setIsMessageSent(false)}>
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
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Message Transmitted!</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Your request has been successfully queued. Our digital concierge desk will review your inquiry and connect with you within 24 business hours.
              </p>
            </div>

            <div style={{ display: 'flex', width: '100%', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setIsMessageSent(false)}
                style={{
                  flex: 1,
                  background: 'var(--primary)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: 750,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
