'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api, Product, Order } from '../../services/api';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import BasketDrawer from '../../components/BasketDrawer';
import AuthDrawer from '../../components/AuthDrawer';
import CheckoutModal from '../../components/CheckoutModal';
import OrdersModal from '../../components/OrdersModal';

export default function CatalogPage() {
  const { 
    user,
    selectedSort, 
    searchQuery, 
    selectedBrand, 
    selectedCategory,
    setSelectedBrand,
    setSelectedCategory
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await api.getProducts({
          pageIndex: page,
          pageSize,
          brandId: selectedBrand || undefined,
          categoryId: selectedCategory || undefined,
          sort: selectedSort,
          search: searchQuery || undefined,
        });
        setProducts(data);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [page, selectedSort, searchQuery, selectedBrand, selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [selectedSort, searchQuery, selectedBrand, selectedCategory]);

  const handleOrderSuccess = (order: Order) => {
    setCheckoutOpen(false);
    setCompletedOrder(order);
  };

  const brands = [
    { id: 0, name: 'All Brands' },
    { id: 1, name: 'Brand 1' },
    { id: 2, name: 'Brand 2' },
    { id: 3, name: 'Brand 3' },
  ];

  const categories = [
    { id: 0, name: 'All Categories' },
    { id: 1, name: "Men's Wear" },
    { id: 2, name: "Women's Wear" },
    { id: 3, name: 'Accessories' },
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      {/* Page Wrapper */}
      <div style={{
        flexGrow: 1,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}>

        {/* ── Hero Banner ── */}
        <div
          className="animate-fade-in"
          style={{
            borderRadius: '20px',
            padding: '3rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, #4b9161 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Soft circle decorations */}
          <div style={{
            position: 'absolute', width: '280px', height: '280px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', top: '-80px', right: '15%',
          }} />
          <div style={{
            position: 'absolute', width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', bottom: '-40px', right: '5%',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
              display: 'block', marginBottom: '0.75rem',
            }}>
              Season Collection — 2026
            </span>
            <h1 style={{
              fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15,
              color: '#ffffff', letterSpacing: '-0.5px',
            }}>
              Curated for the<br />
              <span style={{ opacity: 0.85 }}>Modern Lifestyle.</span>
            </h1>
            <p style={{
              marginTop: '0.9rem', fontSize: '1rem',
              color: 'rgba(255,255,255,0.7)', maxWidth: '420px', lineHeight: 1.6,
            }}>
              Explore hand-picked pieces crafted from premium materials. Filter by brand, category, or search to find your perfect match.
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {user && (
                <button
                  onClick={() => setOrdersOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '999px',
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="view-orders-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  My Orders
                </button>
              )}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '0.6rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                {loadingProducts ? '...' : `${products.length}+ Items`}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '7rem', opacity: 0.12, userSelect: 'none',
            position: 'absolute', right: '3rem', bottom: '-1rem',
            fontWeight: 900, color: '#fff',
          }}>
            ✦
          </div>
        </div>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div style={{ display: 'flex', gap: '2rem' }} className="catalog-layout">

          {/* Sidebar */}
          <aside style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Brands */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>Brands</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.8rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: selectedBrand === b.id ? 700 : 400,
                      color: selectedBrand === b.id ? '#fff' : 'var(--text)',
                      background: selectedBrand === b.id
                        ? 'linear-gradient(135deg, var(--primary), #4b9161)'
                        : 'transparent',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: selectedBrand === b.id ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.8rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: selectedCategory === c.id ? 700 : 400,
                      color: selectedCategory === c.id ? '#fff' : 'var(--text)',
                      background: selectedCategory === c.id
                        ? 'linear-gradient(135deg, var(--primary), #4b9161)'
                        : 'transparent',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: selectedCategory === c.id ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedBrand !== 0 || selectedCategory !== 0) && (
              <button
                onClick={() => { setSelectedBrand(0); setSelectedCategory(0); }}
                style={{
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: '1px dashed var(--border-active)',
                  color: 'var(--primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: 'var(--primary-glow)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <section style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {loadingProducts ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    height: '360px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ height: '190px', borderRadius: '10px', background: 'var(--surface-light)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '20px', width: '65%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                    <div style={{ height: '14px', width: '85%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ height: '28px', width: '30%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                      <div style={{ height: '28px', width: '35%', borderRadius: '6px', background: 'var(--surface-light)' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{
                padding: '5rem 2rem',
                borderRadius: '20px',
                textAlign: 'center',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: '5rem', height: '5rem', borderRadius: '50%',
                  background: 'var(--surface-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>
                  🔍
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
                    No products found
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Try clearing your filters or adjusting your search query.
                  </p>
                </div>
                {(selectedBrand !== 0 || selectedCategory !== 0 || searchQuery !== '') && (
                  <button
                    onClick={() => { setSelectedBrand(0); setSelectedCategory(0); }}
                    className="submit-btn"
                    style={{ padding: '0.6rem 1.8rem', borderRadius: '999px', fontSize: '0.9rem' }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border)',
              }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  style={{
                    padding: '0.6rem 1.6rem',
                    borderRadius: '999px',
                    border: '1.5px solid var(--border-active)',
                    background: 'transparent',
                    color: page === 1 ? 'var(--text-muted)' : 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    opacity: page === 1 ? 0.4 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  className="page-btn"
                >
                  ← Previous
                </button>

                <div style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  width: '2.5rem', height: '2.5rem',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.95rem',
                  boxShadow: 'var(--shadow-glow)',
                }}>
                  {page}
                </div>

                <button
                  disabled={products.length < pageSize}
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: '0.6rem 1.6rem',
                    borderRadius: '999px',
                    border: '1.5px solid var(--border-active)',
                    background: 'transparent',
                    color: products.length < pageSize ? 'var(--text-muted)' : 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: products.length < pageSize ? 'not-allowed' : 'pointer',
                    opacity: products.length < pageSize ? 0.4 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  className="page-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

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

      {/* Order Success Modal */}
      {completedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(26, 41, 32, 0.6)',
          backdropFilter: 'blur(12px)',
          zIndex: 150,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={() => setCompletedOrder(null)}>
          <div
            className="animate-fade-in"
            style={{
              width: '100%', maxWidth: '460px',
              background: 'var(--surface)',
              border: '1px solid var(--border-active)',
              borderRadius: '20px',
              padding: '2.5rem',
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
              width: '100%',
              background: 'var(--surface-light)',
              borderRadius: '12px',
              padding: '1rem 1.2rem',
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
                  transition: 'all 0.2s ease',
                }}
              >
                View Orders
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="submit-btn"
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: '999px',
                  fontSize: '0.9rem', cursor: 'pointer',
                }}
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
          50% { opacity: 0.5; }
        }
        .view-orders-btn:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .page-btn:hover:not(:disabled) {
          background: var(--primary-glow) !important;
        }
        @media (max-width: 1023px) {
          .catalog-layout {
            flex-direction: column !important;
          }
        }
      `}</style>
    </main>
  );
}
