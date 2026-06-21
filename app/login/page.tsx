"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Login Berhasil sebagai ${data.user.role}!`);
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        alert(data.message || "Gagal login");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }} className="text-gradient">Login Portal</h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
              placeholder="admin@example.com"
            />
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: 'var(--accent-gradient)', color: 'white', padding: '1.2rem', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Authenticating...' : 'Masuk Sekarang'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Belum punya akun? <Link href="/register" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Daftar Merchant</Link>
        </p>
      </div>
    </div>
  );
}
