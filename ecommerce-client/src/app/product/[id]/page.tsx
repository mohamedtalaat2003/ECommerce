'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Product, Order } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import Header from '../../../components/Header';
import BasketDrawer from '../../../components/BasketDrawer';
import AuthDrawer from '../../../components/AuthDrawer';
import CheckoutModal from '../../../components/CheckoutModal';
import OrdersModal from '../../../components/OrdersModal';
import Link from 'next/link';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { addItemToBasket } = useApp();
  
  const idStr = typeof params?.id === 'string' ? params.id : '';
  const productId = parseInt(idStr) || 0;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Global modals state for secondary page
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!productId) {
      router.push('/');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (e) {
        console.error('Failed to fetch product details', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToBasket = async () => {
    if (!product) return;
    setAdding(true);
    await addItemToBasket(product, quantity);
    setTimeout(() => setAdding(false), 800);
  };

  const handleOrderSuccess = (order: Order) => {
    setCheckoutOpen(false);
    setCompletedOrder(order);
  };

  // High-aesthetic fallback gradient
  const getFallbackImage = (id: number) => {
    const angles = [135, 45, 90, 180, 225];
    const angle = angles[id % angles.length];
    const colors = [
      ['#10b981', '#3b82f6'],
      ['#6366f1', '#a855f7'],
      ['#06b6d4', '#0ea5e9'],
      ['#f43f5e', '#ec4899'],
      ['#10b981', '#059669']
    ];
    const [c1, c2] = colors[id % colors.length];
    return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading premium catalog details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>The product you are trying to view does not exist in our system.</p>
          <Link 
            href="/catalog"
            style={{
              background: 'var(--primary)',
              color: 'var(--bg)',
              padding: '0.6rem 1.5rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        {/* Navigation Breadcrumbs & Back Link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link href="/catalog" style={{ color: 'var(--text-muted)' }}>Catalog</Link>
            <span>/</span>
            {product.categoryName && (
              <>
                <span>{product.categoryName}</span>
                <span>/</span>
              </>
            )}
            <span style={{ color: 'var(--text)' }}>{product.name}</span>
          </div>

          <Link href="/catalog" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--primary)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Product Details Split Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Image Card */}
          <div 
            className="glass-container"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)',
              background: 'var(--surface)',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {product.pictureUrl && product.pictureUrl !== 'url1' && product.pictureUrl !== 'url2' ? (
              <img 
                src={product.pictureUrl} 
                alt={product.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: getFallbackImage(product.id),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '6rem',
                fontWeight: 900,
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                {product.name ? product.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'P'}
              </div>
            )}

            {/* Floating Brand & Category Badge */}
            {product.brandName && (
              <span style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(10, 15, 29, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}>
                {product.brandName}
              </span>
            )}

            {product.categoryName && (
              <span style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--primary-glow)',
                border: '1px solid var(--border-active)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-glow)'
              }}>
                {product.categoryName}
              </span>
            )}
          </div>

          {/* Right Column: Information Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1.1,
                marginBottom: '0.5rem',
                background: 'linear-gradient(90deg, #ffffff, var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {product.name}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.9rem' }}>
                <span>★★★★★</span>
                <span style={{ color: 'var(--text-muted)' }}>(4.8 Rating based on VIP accounts)</span>
              </div>
            </div>

            {/* Glowing HSL Price badge */}
            <div className="glass-container" style={{
              alignSelf: 'start',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-active)',
              background: 'var(--primary-glow)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>PREMIUM OFFER</span>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Description Paragraph */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Description</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {product.description || 'Experience ultimate quality with this catalog asset, customized specifically for scaling enterprise multi-tenant storefront projects. Designed under the Aura Premium SaaS architecture.'}
              </p>
            </div>

            {/* Technical Specifications details sheet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Specifications</h3>
              <div className="glass-container" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '40%', color: 'var(--text-muted)', fontWeight: 500 }}>Infrastructure</span>
                  <span style={{ width: '60%', fontWeight: 600 }}>Aura Multi-Tenant Core</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '40%', color: 'var(--text-muted)', fontWeight: 500 }}>SKU Code</span>
                  <span style={{ width: '60%', fontFamily: 'monospace', fontWeight: 600 }}>AUR-PROD-{product.id.toString().padStart(4, '0')}</span>
                </div>
                <div style={{ display: 'flex', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '40%', color: 'var(--text-muted)', fontWeight: 500 }}>Fulfillment</span>
                  <span style={{ width: '60%', fontWeight: 600 }}>Redis Caching Optimized</span>
                </div>
              </div>
            </div>

            {/* Interactive Quantity Adjuster and Add to Basket Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              marginTop: '1rem',
              flexWrap: 'wrap'
            }}>
              {/* Quantity selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--surface-light)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  style={{
                    padding: '0.6rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-bg"
                >
                  -
                </button>
                <span style={{
                  padding: '0 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  minWidth: '2rem',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  style={{
                    padding: '0.6rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-bg"
                >
                  +
                </button>
              </div>

              {/* Add to Basket button */}
              <button 
                onClick={handleAddToBasket}
                disabled={adding}
                style={{
                  flexGrow: 1,
                  background: adding ? 'var(--primary-hover)' : 'var(--primary)',
                  color: 'var(--bg)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.8rem 1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-glow)'
                }}
                className="hover-scale"
              >
                {adding ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    <span>Adding to Basket...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Add to Basket</span>
                  </>
                )}
              </button>
            </div>
          </div>
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
