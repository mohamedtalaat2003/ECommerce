'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../services/api';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
  const { orders } = useApp();

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paymentreceived':
      case 'paid':
        return '#10b981'; // Emerald
      case 'paymentfailed':
      case 'failed':
        return '#ef4444'; // Red
      default:
        return '#f59e0b'; // Amber / Pending
    }
  };

  const formatStatus = (status: string) => {
    if (status === 'PaymentReceived') return 'Paid / Received';
    if (status === 'PaymentFailed') return 'Payment Failed';
    return status;
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
          maxWidth: '680px',
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Purchase History</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>List of orders placed against your account</p>
          </div>

          <button 
            onClick={onClose}
            style={{
              padding: '0.4rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Orders List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {orders.length === 0 ? (
            <div style={{
              padding: '4rem 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text)' }}>No orders found</p>
                <p style={{ fontSize: '0.85rem' }}>You haven&apos;t placed any orders on our platform yet.</p>
              </div>
            </div>
          ) : (
            [...orders].reverse().map((order) => (
              <div 
                key={order.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}
              >
                {/* Order Top Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '0.6rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>{' '}
                    <strong style={{ color: 'var(--text)' }}>#{order.id}</strong>
                    <span style={{ margin: '0 0.5rem', color: 'rgba(255,255,255,0.1)' }}>|</span>
                    <span style={{ color: 'var(--text-muted)' }}>Date:</span>{' '}
                    <strong style={{ color: 'var(--text)' }}>{new Date(order.orderDate).toLocaleDateString()}</strong>
                  </div>

                  <span style={{
                    color: getStatusColor(order.status),
                    background: `${getStatusColor(order.status)}10`,
                    border: `1px solid ${getStatusColor(order.status)}25`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.6rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}>
                    {formatStatus(order.status)}
                  </span>
                </div>

                {/* Bought Items summary list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName} <strong style={{ color: 'var(--text)' }}>× {item.quantity}</strong>
                      </span>
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Shipping, and Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px dashed rgba(255,255,255,0.05)',
                  paddingTop: '0.6rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <span>Subtotal: ${order.subtotal?.toFixed(2)}</span>
                    <span style={{ margin: '0 0.4rem' }}>•</span>
                    <span>Shipping: ${order.shippingPrice?.toFixed(2)}</span>
                  </div>

                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Total: <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>${order.total?.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
