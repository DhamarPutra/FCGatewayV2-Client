"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', price: '', discount: '' });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchMyOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.role === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(data);
      } else {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchMyOrders = async () => {
    try {
      const response = await fetch('/api/orders/my');
      const data = await response.json();
      if (response.ok) setOrders(data);
    } catch (err) {}
  };

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar?")) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {}
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Produk berhasil didaftarkan!");
        setFormData({ name: '', price: '', discount: '' });
        fetchUserData();
      } else {
        const data = await response.json();
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      alert("Error koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }} className="text-gradient">Merchant Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ background: activeTab === 'products' ? 'var(--accent-gradient)' : 'transparent', border: 'none', color: 'white', padding: '1rem', textAlign: 'left', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
            📦 Produk Anda
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ background: activeTab === 'orders' ? 'var(--accent-gradient)' : 'transparent', border: 'none', color: 'white', padding: '1rem', textAlign: 'left', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
            📜 Transaksi {orders.length > 0 && `(${orders.length})`}
          </button>
          <button 
             onClick={() => setActiveTab('api')}
             style={{ background: activeTab === 'api' ? 'var(--accent-gradient)' : 'transparent', border: 'none', color: 'white', padding: '1rem', textAlign: 'left', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
            🔑 API Credentials
          </button>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', padding: '1rem', textAlign: 'left', cursor: 'pointer', fontWeight: '600' }}>
            &larr; Keluar
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1 }}>
        {!user ? (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>Memuat...</div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="animate-fade-in">
                <header style={{ marginBottom: '2rem' }}>
                  <h1>Manajemen Produk</h1>
                  <p style={{ color: 'var(--text-secondary)' }}>Status Akun: <span style={{ color: '#2dd4bf' }}>TERVERIFIKASI</span></p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                  <form className="glass" style={{ padding: '2rem' }} onSubmit={handleCreateProduct}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Daftarkan Produk Baru</h3>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nama Produk</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '10px', color: 'white' }} placeholder="Contoh: Digital Asset v1" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Harga (IDR)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '10px', color: 'white' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Diskon (IDR)</label>
                        <input type="number" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} style={{ width: '100%', background: '#111', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '10px', color: 'white' }} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '1.1rem', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', width: '100%' }}>{loading ? 'Memproses...' : 'Daftarkan Produk'}</button>
                  </form>

                  <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Daftar Produk</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {user.products?.map((p: any) => (
                        <div key={p.id} className="glass" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div>
                               <div style={{ fontWeight: '700' }}>{p.name}</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>Slug: {p.slug}</div>
                             </div>
                             <div style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', background: p.status === 'active' ? '#2dd4bf22' : '#eab30822', color: p.status === 'active' ? '#2dd4bf' : '#eab308' }}>{p.status.toUpperCase()}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in glass" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Riwayat Transaksi</h1>
                {orders.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        <th style={{ padding: '1rem' }}>Order ID</th>
                        <th style={{ padding: '1rem' }}>Produk</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o: any) => (
                        <tr key={o.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{o.client_order_id}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{o.product?.name}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>Rp {parseFloat(o.amount).toLocaleString()}</td>
                          <td style={{ padding: '1rem' }}>
                             <span style={{ padding: '0.3rem 0.8rem', borderRadius: '10px', fontSize: '0.7rem', background: o.status === 'paid' ? '#2dd4bf22' : '#eab30822', color: o.status === 'paid' ? '#2dd4bf' : '#eab308' }}>{o.status.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(o.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Belum ada transaksi masuk.</p>
                )}
              </div>
            )}

            {activeTab === 'api' && (
              <div className="animate-fade-in">
                 <h1>API Credentials</h1>
                 <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Kredensial unik untuk integrasi backend Anda.</p>
                 <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>X-API-KEY</label>
                      <div className="glass" style={{ padding: '1rem', marginTop: '0.5rem', fontFamily: 'monospace', color: 'var(--accent-color)' }}>{user.api_key}</div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SECRET_KEY (HMAC)</label>
                      <div className="glass" style={{ padding: '1rem', marginTop: '0.5rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ letterSpacing: showSecret ? '0' : '4px' }}>{showSecret ? user.api_secret : '••••••••••••••••'}</span>
                        <span style={{ color: 'var(--accent-color)', cursor: 'pointer' }} onClick={() => setShowSecret(!showSecret)}>{showSecret ? 'HIDE' : 'SHOW'}</span>
                      </div>
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
