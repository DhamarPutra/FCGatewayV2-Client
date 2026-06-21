"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Pendaftaran Berhasil!");
        router.push('/dashboard');
      } else {
        alert(data.message || "Gagal daftar");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }} className="text-gradient">Join as Merchant</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Mulai terima pembayaran dalam hitungan menit.</p>
        
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name / Business Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
              placeholder="Fujiwara Creative"
            />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Business</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
              placeholder="merchant@example.com"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Confirm</label>
              <input 
                type="password" 
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                required
                style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: 'var(--accent-gradient)', color: 'white', padding: '1.2rem', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Processing...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Sudah punya akun? <Link href="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Masuk Portal</Link>
        </p>
      </div>
    </div>
  );
}
