import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogOut, User as UserIcon, Activity } from 'lucide-react';

const Navbar = () => {
    const { user, logout, toggleRole } = useAuth();
    const { addToast } = useToast();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <a href="/" className="logo">
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', boxShadow: '0 4px 12px rgba(237, 108, 13, 0.2)' }}>
                        <Activity size={24} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', letterSpacing: '-0.02em' }}>
                        Medi<span style={{ color: 'var(--primary)' }}>Track</span>
                    </span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {user && (
                        <>
                            <div style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ background: '#fff7ed', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                                    <UserIcon size={16} color="var(--primary)" />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                                    {user.name} <span style={{ color: '#6b7280', marginLeft: '4px', fontWeight: 500, fontSize: '0.75rem' }}>• {user.role.toUpperCase()}</span>
                                </span>
                            </div>

                            <button className="btn btn-primary" onClick={logout} style={{ height: '2.75rem' }}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
