'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import Header from '../../components/Header';
import AuthDrawer from '../../components/AuthDrawer';

export default function AdminDashboard() {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brandId: '1',
    categoryId: '1',
  });

  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg('You must be logged in as an administrator.');
      return;
    }

    if (!file) {
      setErrorMsg('Please select a product image.');
      return;
    }

    if (!formData.name || !formData.description || !formData.price) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('Name', formData.name);
      data.append('Description', formData.description);
      data.append('Price', formData.price);
      data.append('ProductBrandId', formData.brandId);
      data.append('ProductCategoryId', formData.categoryId);
      data.append('Photo', file);

      await api.createProduct(data, user.token);

      setSuccessMsg('Product created successfully!');
      setFormData({ name: '', description: '', price: '', brandId: '1', categoryId: '1' });
      setFile(null);
      // reset file input visually
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{
        flexGrow: 1,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 2rem',
        boxSizing: 'border-box'
      }} className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Create a new product in the catalog. Requires administrator permissions.</p>

        {!user ? (
          <div className="glass-container" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Authentication Required</h2>
            <p style={{ color: 'var(--text-muted)' }}>You must be logged in to access the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="glass-container" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Create New Product</h2>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Leather Jacket"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product details and materials..."
                  rows={4}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Price ($) *</label>
                  <input 
                    type="number" 
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Brand ID</label>
                  <select 
                    name="brandId" 
                    value={formData.brandId} 
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="1">Brand 1</option>
                    <option value="2">Brand 2</option>
                    <option value="3">Brand 3</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Category ID</label>
                  <select 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="1">Category 1</option>
                    <option value="2">Category 2</option>
                    <option value="3">Category 3</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Product Image * (JPG/PNG)</label>
                <div style={{ 
                  border: '1px dashed var(--border-active)', 
                  padding: '2rem', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  background: 'var(--surface-light)'
                }}>
                  <input 
                    type="file" 
                    id="photo-upload"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    style={{ margin: '0 auto', border: 'none', background: 'transparent' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <span>Uploading to Cloudinary & Saving...</span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <AuthDrawer />
    </div>
  );
}
