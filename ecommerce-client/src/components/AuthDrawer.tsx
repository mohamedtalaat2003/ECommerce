'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// ── Inline SVG Icons ──────────────────────────────────────
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const NameIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Input Field Component ─────────────────────────────────
function InputField({
  icon, label, type, placeholder, value, onChange, hint,
  rightElement,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: 'var(--surface-light)',
        border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: '10px',
        padding: '0.7rem 0.9rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focused ? '0 0 0 3px var(--primary-glow)' : 'none',
      }}>
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, fontSize: '0.9rem',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)',
          }}
        />
        {rightElement}
      </div>
      {hint && (
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.1rem' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function AuthDrawer() {
  const { isAuthOpen, toggleAuth, login, register, auth0Login } = useApp();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuth0Connecting, setIsAuth0Connecting] = useState(false);
  const [auth0Step, setAuth0Step] = useState<'idle' | 'connecting' | 'handshake' | 'success'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth0Click = async () => {
    setIsAuth0Connecting(true);
    setAuth0Step('connecting');
    setError(null);
    setTimeout(() => setAuth0Step('handshake'), 1000);
    setTimeout(() => setAuth0Step('success'), 2200);
    setTimeout(async () => {
      try {
        await auth0Login();
        setIsAuth0Connecting(false);
        setAuth0Step('idle');
      } catch (err: any) {
        setError(err.message || 'Auth0 Sign In failed');
        setIsAuth0Connecting(false);
        setAuth0Step('idle');
      }
    }, 3200);
  };

  if (!isAuthOpen) return null;

  const handleClose = () => { setError(null); toggleAuth(false); };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError(null);
    try { await login(email, password); }
    catch (err: any) { setError(err.message || 'Login failed. Please verify your credentials.'); }
    finally { setLoading(false); }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName || !confirmPassword) return;
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter.'); return; }
    if (!/[a-z]/.test(password)) { setError('Password must contain at least one lowercase letter.'); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setError('Password must contain at least one special character (e.g. !, @, #, $).'); return; }
    setLoading(true); setError(null);
    try { await register({ displayName, email, password, confirmPassword }); }
    catch (err: any) { setError(err.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const switchTab = (toLogin: boolean) => { setIsLoginTab(toLogin); setError(null); };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26, 41, 32, 0.6)',
        backdropFilter: 'blur(12px)',
        zIndex: 110,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={handleClose}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%', maxWidth: '440px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Auth0 Connecting Overlay ── */}
        {isAuth0Connecting && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(244,247,244,0.97)',
            backdropFilter: 'blur(12px)',
            zIndex: 120,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center',
          }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.5rem' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#eb5424', borderBottomColor: 'var(--primary)',
                animation: 'auth-spin 1.2s linear infinite',
              }} />
              <div style={{
                position: 'absolute', top: '15px', left: '15px',
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'var(--surface-light)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="#eb5424">
                  <path d="M16 0l8 4.706V14.12C24 21.18 16 32 16 32S8 21.18 8 14.118V4.706L16 0z" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
              {auth0Step === 'connecting' && 'Connecting to Auth0...'}
              {auth0Step === 'handshake' && 'Securing Handshake...'}
              {auth0Step === 'success' && 'Success!'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '260px', lineHeight: 1.5 }}>
              {auth0Step === 'connecting' && 'Establishing a secure connection tunnel...'}
              {auth0Step === 'handshake' && 'Exchanging OAuth authorization tokens...'}
              {auth0Step === 'success' && 'Welcome! Redirecting to your account...'}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.5rem' }}>
              {['connecting', 'handshake', 'success'].map((step, i) => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: ['connecting', 'handshake', 'success'].indexOf(auth0Step) >= i
                    ? (i === 2 ? 'var(--primary)' : '#eb5424')
                    : 'var(--border)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Top Avatar Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #4b9161 100%)',
          padding: '2rem 2rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              color: '#fff', cursor: 'pointer', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
          >
            ✕
          </button>

          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.8rem',
            color: 'var(--primary)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            <UserIcon />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
            {isLoginTab ? 'Sign in to your AURA account' : 'Join the AURA community today'}
          </p>
        </div>

        {/* ── Tab Switcher (floating card) ── */}
        <div style={{
          display: 'flex',
          margin: '-1.5rem 1.5rem 0',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          position: 'relative', zIndex: 2,
        }}>
          {[true, false].map(isLogin => (
            <button
              key={String(isLogin)}
              onClick={() => switchTab(isLogin)}
              style={{
                flex: 1, padding: '0.8rem',
                fontWeight: 700, fontSize: '0.88rem',
                color: isLoginTab === isLogin ? '#fff' : 'var(--text-muted)',
                background: isLoginTab === isLogin
                  ? 'linear-gradient(135deg, var(--primary), #4b9161)'
                  : 'transparent',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: isLogin ? '12px 0 0 12px' : '0 12px 12px 0',
              }}
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* ── Form Body ── */}
        <div style={{ padding: '2rem 1.75rem 1.5rem' }}>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#dc2626',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.83rem',
              fontWeight: 500,
              marginBottom: '1.2rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoginTab ? (
            /* ── LOGIN ── */
            <>
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <InputField
                  icon={<EmailIcon />}
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={setEmail}
                />
                <InputField
                  icon={<LockIcon />}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={setPassword}
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <EyeIcon show={showPassword} />
                    </button>
                  }
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: '100%', padding: '0.9rem', borderRadius: '12px',
                    fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'auth-spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      Sign In to AURA
                    </>
                  )}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1.4rem 0', gap: '0.8rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button
                type="button"
                onClick={handleAuth0Click}
                disabled={loading || isAuth0Connecting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #eb5424, #f07347)',
                  color: '#ffffff',
                  border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.9rem',
                  padding: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(235,84,36,0.25)',
                  transition: 'all 0.2s ease',
                }}
                className="hover-scale"
              >
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 0l8 4.706V14.12C24 21.18 16 32 16 32S8 21.18 8 14.118V4.706L16 0z" />
                </svg>
                Continue with Auth0
              </button>
            </>
          ) : (
            /* ── REGISTER ── */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InputField
                icon={<NameIcon />}
                label="Display Name"
                type="text"
                placeholder="Your full name"
                value={displayName}
                onChange={setDisplayName}
              />
              <InputField
                icon={<EmailIcon />}
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={setEmail}
              />
              <InputField
                icon={<LockIcon />}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={setPassword}
                hint="8+ chars, uppercase, lowercase, special character"
                rightElement={
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <EyeIcon show={showPassword} />
                  </button>
                }
              />
              <InputField
                icon={<LockIcon />}
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                rightElement={
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <EyeIcon show={showConfirm} />
                  </button>
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{
                  width: '100%', padding: '0.9rem', borderRadius: '12px',
                  fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation: 'auth-spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Create My Account
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          background: 'var(--surface-light)',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {isLoginTab ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => switchTab(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}>
                  Register here
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => switchTab(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}>
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
