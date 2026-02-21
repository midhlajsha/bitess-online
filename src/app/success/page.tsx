import Link from 'next/link';
import React from 'react';

export default function SuccessPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '80px' }}>
            <div className="container">
                <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Thank you for your purchase. Your premium order has been received and is being processed.
                    </p>
                    <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
