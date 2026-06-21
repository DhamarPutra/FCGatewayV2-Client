"use client";

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="premium-container animate-fade-in">
      <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', marginBottom: '4rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
          FC<span className="text-gradient">GATEWAY</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Fitur</Link>
          <Link href="#docs" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dokumentasi</Link>
          <Link href="/login" className="glass" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>
            Merchant Login
          </Link>
        </div>
      </nav>

      <header style={{ textAlign: 'center', marginTop: '6rem', marginBottom: '8rem' }}>
        <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
          Terima Pembayaran <br /> 
          <span className="text-gradient">Tanpa Ribet Integrasi.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', marginBottom: '3rem' }}>
          Daftarkan produk Anda di FCGateway, dapatkan API Key, dan mulai terima pembayaran Midtrans secara instan. Kami yang urus teknisnya, Anda urus bisnisnya.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" style={{ background: 'var(--accent-gradient)', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', fontSize: '1.1rem' }}>
            Mulai Sekarang &rarr;
          </Link>
          <Link href="#docs" style={{ border: '1px solid var(--glass-border)', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', fontSize: '1.1rem' }}>
            Lihat Dokumentasi
          </Link>
        </div>
      </header>

      <section id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
          <h3>Integrasi Instan</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Tidak perlu lagi coding Midtrans Snap yang rumit. Cukup panggil API kami.</p>
        </div>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Keamanan HMAC</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Semua transaksi dilindungi dengan tanda tangan kriptografi SHA256.</p>
        </div>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <h3>Merchant Portal</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Kelola produk dan pantau status transaksi secara real-time dari dashboard.</p>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>&copy; 2026 Fujiwara Creative Gateway. Dirancang untuk efisiensi maksimal.</p>
      </footer>
    </div>
  );
}
