import React from 'react';
import { Activity } from 'lucide-react';

const Loader = ({ message = "Loading MediTrack..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--bg-main)',
            gap: '1.5rem'
        }}>
            <div style={{ position: 'relative' }}>
                <div className="animate-float" style={{
                    background: 'var(--primary)',
                    padding: '1.25rem',
                    borderRadius: '1.25rem',
                    display: 'flex',
                    boxShadow: '0 10px 25px rgba(237, 108, 13, 0.3)',
                    zIndex: 2
                }}>
                    <Activity size={32} color="white" />
                </div>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    border: '3px solid #ffedd5',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#111827', marginBottom: '0.25rem' }}>
                    {message}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Please wait while we secure your connection</div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
