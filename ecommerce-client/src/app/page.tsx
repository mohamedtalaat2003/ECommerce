'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api, Product, Order } from '../services/api';
import Header from '../components/Header';
import BasketDrawer from '../components/BasketDrawer';
import AuthDrawer from '../components/AuthDrawer';
import CheckoutModal from '../components/CheckoutModal';
import OrdersModal from '../components/OrdersModal';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

export default function Home() {
  const { toggleAuth } = useApp();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ pageIndex: 1, pageSize: 4 });
        setFeaturedProducts(data);
      } catch (e) {
        console.error('Failed to load featured products', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleOrderSuccess = (order: Order) => {
    setCheckoutOpen(false);
    setCompletedOrder(order);
  };

  const valueProps = [
    { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $100' },
    { icon: '↩️', title: 'Free Returns', desc: '30-day hassle-free returns' },
    { icon: '🔒', title: 'Secure Checkout', desc: '100% protected payments' },
    { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
  ];

  const categories = [
    {
      label: "Men's",
      href: '/catalog',
      img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'rgba(45,90,60,0.55)',
    },
    {
      label: "Women's",
      href: '/catalog',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'rgba(45,90,60,0.45)',
    },
    {
      label: 'Accessories',
      href: '/catalog',
      img: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'rgba(26,41,32,0.55)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '5rem',
      }} className="animate-fade-in">

        {/* ── 1. Hero ── */}
        <section style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
          background: `url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat`,
        }}>
          {/* gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, rgba(244,247,244,0.97) 0%, rgba(244,247,244,0.80) 45%, rgba(244,247,244,0.0) 100%)',
          }} />

          {/* Decorative leaf shape */}
          <div style={{
            position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)',
            width: '320px', height: '320px', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
            background: 'rgba(45,90,60,0.07)', zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1, padding: '3.5rem 4rem', maxWidth: '560px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'var(--primary)',
              display: 'inline-block', marginBottom: '1.2rem',
              background: 'var(--primary-glow)',
              padding: '0.35rem 0.9rem', borderRadius: '999px',
              border: '1px solid var(--border-active)',
            }}>
              New Collection — 2026
            </span>

            <h1 style={{
              fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.08,
              color: 'var(--text)', letterSpacing: '-1.5px', marginBottom: '1.2rem',
            }}>
              Elevate Your<br />
              <span style={{ color: 'var(--primary)' }}>Everyday</span> Style.
            </h1>

            <p style={{
              fontSize: '1.1rem', color: 'var(--text-muted)',
              lineHeight: 1.7, maxWidth: '400px', marginBottom: '2.2rem',
            }}>
              Curated pieces crafted for the modern individual. Premium materials, timeless designs.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/catalog"
                className="submit-btn hover-scale"
                style={{
                  padding: '0.95rem 2.4rem',
                  fontSize: '1rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <button
                onClick={() => toggleAuth(true)}
                style={{
                  padding: '0.95rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '999px',
                  border: '1.5px solid var(--border-active)',
                  background: 'rgba(45,90,60,0.06)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="secondary-btn"
              >
                Join for Free
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. Shop by Category ── */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Browse
            </p>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
              Shop by Category
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="category-card"
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '280px',
                  display: 'block',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
                }}
              >
                <div
                  className="cat-bg"
                  style={{
                    position: 'absolute', inset: 0,
                    background: `url("${cat.img}") center/cover`,
                    transition: 'transform 0.6s ease',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `${cat.color}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-start', justifyContent: 'flex-end',
                  padding: '2rem',
                }}>
                  <h3 style={{
                    color: '#fff', fontSize: '2rem', fontWeight: 800,
                    letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {cat.label}
                  </h3>
                  <span style={{
                    fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600, marginTop: '0.3rem',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                  }}>
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. New Arrivals ── */}
        <section>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                Just In
              </p>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                New Arrivals
              </h2>
            </div>
            <Link href="/catalog" style={{
              fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.2rem', borderRadius: '999px',
              border: '1.5px solid var(--border-active)',
              background: 'var(--primary-glow)',
              transition: 'all 0.2s ease',
            }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  borderRadius: '16px', height: '380px',
                  padding: '1rem', display: 'flex',
                  flexDirection: 'column', gap: '0.8rem',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ height: '210px', borderRadius: '10px', background: 'var(--surface-light)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '18px', width: '60%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                  <div style={{ height: '14px', width: '80%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ height: '24px', width: '28%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                    <div style={{ height: '32px', width: '32%', borderRadius: '8px', background: 'var(--surface-light)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div style={{
              padding: '3rem', borderRadius: '16px', textAlign: 'center',
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}>
              No products in catalog yet. Add some from the Admin page!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Value Props ── */}
        <section style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
        }}>
          {valueProps.map(vp => (
            <div key={vp.title} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '0.6rem',
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.3s ease',
            }} className="value-card">
              <div style={{
                width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                background: 'var(--primary-glow)',
                border: '1px solid var(--border-active)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>
                {vp.icon}
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{vp.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{vp.desc}</p>
            </div>
          ))}
        </section>

      </main>

      <BasketDrawer onCheckoutTrigger={() => setCheckoutOpen(true)} />
      <AuthDrawer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} onOrderSuccess={handleOrderSuccess} />
      <OrdersModal isOpen={isOrdersOpen} onClose={() => setOrdersOpen(false)} />

      {completedOrder && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,41,32,0.5)',
          backdropFilter: 'blur(12px)',
          zIndex: 150,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setCompletedOrder(null)}>
          <div
            className="animate-fade-in"
            style={{
              width: '100%', maxWidth: '460px',
              background: 'var(--surface)',
              border: '1px solid var(--border-active)',
              borderRadius: '20px', padding: '2.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '4.5rem', height: '4.5rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #4b9161)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>Order Confirmed!</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Order <strong style={{ color: 'var(--primary)' }}>#{completedOrder.id}</strong> has been placed successfully.
              </p>
            </div>
            <div style={{
              width: '100%', background: 'var(--surface-light)',
              borderRadius: '12px', padding: '1rem 1.2rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Paid</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800 }}>
                ${completedOrder.total?.toFixed(2)}
              </strong>
            </div>
            <div style={{ display: 'flex', width: '100%', gap: '0.8rem' }}>
              <button
                onClick={() => { setCompletedOrder(null); setOrdersOpen(true); }}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: '999px',
                  border: '1.5px solid var(--border-active)',
                  background: 'transparent', color: 'var(--primary)',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                View Orders
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="submit-btn"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '999px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Keep Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(45,90,60,0.15) !important;
        }
        .category-card:hover .cat-bg {
          transform: scale(1.06);
        }
        .value-card:hover {
          transform: translateY(-4px);
        }
        .secondary-btn:hover {
          background: var(--primary-glow) !important;
        }
      `}</style>
    </div>
  );
}
