import React from 'react';
import { Metadata } from 'next';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  // In a real app, fetch product data from Laravel here
  return {
    title: `Beli ${id} | Fujiwara Creative`,
    description: `Dapatkan akses ke ${id} dengan harga terbaik. Pembayaran aman dan instan via Fujiwara Creative Gateway.`,
  };
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="premium-container animate-fade-in">
      <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Produk: {params.id}</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
          Halaman ini dioptimasi secara otomatis untuk SEO.
        </p>
        <div style={{ marginTop: '3rem' }}>
          <a href="/" className="text-gradient" style={{ fontWeight: '600' }}>&larr; Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
}
