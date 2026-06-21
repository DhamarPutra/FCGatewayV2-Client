"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // stats, validate, all_products, users, orders
  const [simulating, setSimulating] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
    // Load Midtrans Snap JS
    const script = document.createElement('script');
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsRes.ok) setData(statsData);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: string, status: 'active' | 'rejected') => {
    if (!confirm(`Ubah status produk ke ${status}?`)) return;
    try {
      const res = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) { alert("Berhasil!"); fetchAdminData(); }
    } catch (err) {}
  };

  const handleSimulate = async (product: any) => {
    setSimulating(product.id);
    setSimResult(null);
    try {
      const res = await fetch('/api/admin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: product.user.api_key,
          api_secret: product.user.api_secret,
          product_slug: product.slug
        })
      });
      const result = await res.json();
      setSimResult(result);

      // MUNCULIN POPUP MIDTRANS DISINI
      if (result.gateway_response?.snap_token) {
        (window as any).snap.pay(result.gateway_response.snap_token, {
          onSuccess: function(result: any){ alert("Simulasi Sukses: Pembayaran Diterima!"); console.log(result); },
          onPending: function(result: any){ alert("Simulasi Pending: Menunggu Pembayaran."); console.log(result); },
          onError: function(result: any){ alert("Simulasi Gagal!"); console.log(result); },
          onClose: function(){ alert('Simulasi Selesai: Popup ditutup.'); }
        });
      }
    } catch (err) {
      alert("Simulasi gagal terkoneksi");
    } finally {
      setSimulating(null);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Keluar?")) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="premium-container" style={{ textAlign: 'center', paddingTop: '5rem' }}><h2>Memasuki Command Center...</h2></div>;

  return (
    <div className="premium-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.2rem' }}>Admin Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Master Control & Integration Simulator</p>
        </div>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #f43f5e', color: '#f43f5e', padding: '0.8rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>LOGOUT</button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['stats', 'validate', 'all_products', 'users'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', border: 'none', background: activeTab === tab ? 'var(--accent-gradient)' : 'var(--glass-border)', color: 'white', cursor: 'pointer', fontWeight: '700', textTransform: 'capitalize' }}>
            {tab.replace('_', ' ')} {tab === 'validate' && data?.pending_products?.length > 0 && `(${data.pending_products.length})`}
          </button>
        ))}
      </div>

      <main>
        {activeTab === 'stats' && (
          <div className="animate-fade-in">
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Revenue</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>Rp {data?.stats?.total_revenue?.toLocaleString()}</div>
                </div>
                {/* ... stat lainnya ... */}
             </div>
             <div className="glass" style={{ padding: '2rem' }}>
                <h3>Transaksi Terbaru</h3>
                <table style={{ width: '100%', marginTop: '1rem' }}>
                  {/* ... table orders ... */}
                  <tbody>
                    {data?.recent_orders?.map((o: any) => (
                      <tr key={o.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem' }}>{o.client_order_id}</td>
                        <td style={{ padding: '1rem' }}>{o.user?.name}</td>
                        <td style={{ padding: '1rem', fontWeight: '800' }}>Rp {parseFloat(o.amount).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}><span style={{ color: o.status === 'paid' ? '#2dd4bf' : '#eab308' }}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'validate' && (
          <div className="animate-fade-in glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Persetujuan Produk</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {data?.pending_products?.map((p: any) => (
                <div key={p.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontWeight: '800' }}>{p.name}</div>
                  <div style={{ color: 'var(--accent-color)' }}>Rp {parseFloat(p.price).toLocaleString()}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Merchant: {p.user.name}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => handleValidate(p.id, 'active')} style={{ background: '#2dd4bf', border: 'none', padding: '0.6rem', borderRadius: '5px', fontWeight: '800', cursor: 'pointer' }}>APPROVE</button>
                    <button onClick={() => handleValidate(p.id, 'rejected')} style={{ background: 'transparent', color: '#f43f5e', border: '1px solid #f43f5e', padding: '0.6rem', borderRadius: '5px', fontWeight: '800', cursor: 'pointer' }}>REJECT</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'all_products' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Master Produk & Simulator</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <th style={{ padding: '1rem' }}>Produk / Slug</th>
                      <th style={{ padding: '1rem' }}>Merchant</th>
                      <th style={{ padding: '1rem' }}>Harga</th>
                      <th style={{ padding: '1rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.all_products?.map((p: any) => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700' }}>{p.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{p.slug}</div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.user.name}</td>
                        <td style={{ padding: '1rem', fontWeight: '700' }}>Rp {parseFloat(p.price).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            disabled={p.status !== 'active' || simulating === p.id}
                            onClick={() => handleSimulate(p)}
                            style={{ background: p.status === 'active' ? 'var(--accent-gradient)' : '#333', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', cursor: p.status === 'active' ? 'pointer' : 'not-allowed' }}>
                            {simulating === p.id ? 'Testing...' : '🚀 Test CO'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="glass" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                 <h3>Simulation Log</h3>
                 {!simResult ? (
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Klik "Test CO" untuk mensimulasikan transaksi merchant.</p>
                 ) : (
                   <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                         <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>X-SIGNATURE (Generated)</span>
                         <div style={{ fontSize: '0.65rem', wordBreak: 'break-all', background: '#000', padding: '0.5rem', borderRadius: '5px', marginTop: '0.3rem' }}>{simResult.signature_used}</div>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                         <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Response Status</span>
                         <div style={{ color: simResult.gateway_response?.snap_token ? '#2dd4bf' : '#f43f5e', fontWeight: '800' }}>
                            {simResult.gateway_response?.snap_token ? 'SUCCESS 200' : 'FAILED ' + (simResult.gateway_response?.message || 'ERROR')}
                         </div>
                      </div>
                      {simResult.gateway_response?.snap_token && (
                        <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid #2dd4bf33' }}>
                           <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Midtrans Snap Token Generated:</p>
                           <code style={{ fontSize: '0.9rem', color: '#2dd4bf' }}>{simResult.gateway_response.snap_token}</code>
                        </div>
                      )}
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in glass" style={{ padding: '2rem' }}>
             <h3>Daftar Merchant</h3>
             {/* ... table users ... */}
             <table style={{ width: '100%', marginTop: '1rem' }}>
               <tbody>
                  {data?.all_users?.map((u: any) => (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{u.name}</td>
                      <td style={{ padding: '1rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}><code style={{ fontSize: '0.7rem' }}>{u.api_key}</code></td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
}
