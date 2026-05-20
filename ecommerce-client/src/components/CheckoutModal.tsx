'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Address, DeliveryMethod, Order } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }: CheckoutModalProps) {
  const { 
    basket, 
    deliveryMethods, 
    checkoutOrder, 
    getUserAddress, 
    updateUserAddress 
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  // Delivery fields
  const [selectedMethodId, setSelectedMethodId] = useState<number>(0);

  // Load user profile address & default delivery method
  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        setFetchingAddress(true);
        try {
          const addr = await getUserAddress();
          if (addr) {
            setFirstName(addr.firstName || '');
            setLastName(addr.lastName || '');
            setStreet(addr.street || '');
            setCity(addr.city || '');
            setZipCode(addr.zipCode || '');
          }
        } catch (e) {
          console.error('Failed to load profile address', e);
        } finally {
          setFetchingAddress(false);
        }
      };

      loadProfile();

      // Set default delivery method
      if (deliveryMethods.length > 0) {
        setSelectedMethodId(deliveryMethods[0].id);
      }
    }
  }, [isOpen, deliveryMethods]);

  if (!isOpen) return null;

  const items = basket?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
  const shippingCost = selectedMethod?.price || 0;
  const grandTotal = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !street || !city || !zipCode || !selectedMethodId) {
      setError('Please fill in all address fields and select a shipping method.');
      return;
    }

    setLoading(true);
    setError(null);

    const addressData: Address = {
      firstName,
      lastName,
      street,
      city,
      zipCode
    };

    try {
      // Save address if toggled
      if (saveAddress) {
        await updateUserAddress(addressData);
      }

      // Complete order checkout
      const order = await checkoutOrder(selectedMethodId, addressData);
      onOrderSuccess(order);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 5, 10, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 105,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      
      {/* Modal Container */}
      <div 
        className="glass-container animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '840px',
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'row',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Forms */}
        <form 
          onSubmit={handleSubmit}
          style={{
            flex: '1 1 55%',
            padding: '2.2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Complete Your Order</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Confirm your shipping details and delivery speed below.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '0.8rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'start',
              gap: '0.5rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Shipping Address Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
              Shipping Address {fetchingAddress && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 400 }}>(loading profile...)</span>}
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First Name</label>
                <div className="checkout-input">
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last Name</label>
                <div className="checkout-input">
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Street Address</label>
              <div className="checkout-input">
                <input type="text" required value={street} onChange={e => setStreet(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>City</label>
                <div className="checkout-input">
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zip Code</label>
                <div className="checkout-input">
                  <input type="text" required value={zipCode} onChange={e => setZipCode(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.2rem' }}>
              <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} style={{ width: '14px', height: '14px', accentColor: 'var(--primary)' }} />
              <span>Save this address to my profile</span>
            </label>
          </div>

          {/* Delivery Methods selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
              Delivery Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {deliveryMethods.map((method) => (
                <label 
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: selectedMethodId === method.id ? 'var(--primary-glow)' : 'var(--surface-light)',
                    border: '1px solid',
                    borderColor: selectedMethodId === method.id ? 'var(--border-active)' : 'var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input 
                      type="radio" 
                      name="delivery_method"
                      checked={selectedMethodId === method.id}
                      onChange={() => setSelectedMethodId(method.id)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{method.shortName} ({method.deliveryTime})</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{method.description}</span>
                    </div>
                  </div>
                  <strong style={{ color: method.price === 0 ? 'var(--primary)' : 'var(--text)' }}>
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </strong>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                padding: '0.8rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              Cancel
            </button>

            <button 
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                background: 'var(--primary)',
                color: 'var(--bg)',
                border: 'none',
                padding: '0.8rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              className="submit-checkout"
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="3"></circle>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay & Place Order</span>
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Order Summary */}
        <div 
          style={{
            flex: '1 1 45%',
            background: 'rgba(10, 15, 29, 0.4)',
            borderLeft: '1px solid var(--border)',
            padding: '2.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            overflowY: 'auto'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Order Summary
          </h3>

          {/* Items Mini List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '6px',
                  background: 'var(--surface-light)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.pictureUrl && item.pictureUrl !== 'url1' && item.pictureUrl !== 'url2' ? (
                    <img src={item.pictureUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{item.productName[0]}</span>
                  )}
                </div>

                <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.productName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>

                <strong style={{ fontSize: '0.9rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          {/* Pricing Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text)' }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Shipping ({selectedMethod?.shortName || 'None'})</span>
              <span style={{ color: 'var(--text)' }}>
                {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderTop: '1px dashed var(--border)', 
              paddingTop: '0.8rem',
              marginTop: '0.2rem'
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .checkout-input {
          background: var(--surface-light);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          display: flex;
          font-size: 0.9rem;
        }
        .checkout-input:focus-within {
          border-color: var(--border-active) !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
        }
        .submit-checkout:hover:not(:disabled) {
          background: var(--primary-hover) !important;
        }
      `}</style>
    </div>
  );
}
