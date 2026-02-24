import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Mail, Lock, User, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        addToast('Creating your account...', 'info');

        try {
            await register(formData);
            addToast('Welcome to MediTrack!', 'success');
            navigate('/dashboard');
        } catch (err) {
            addToast(err.message || 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', alignItems: 'center' }}>

                {/* Left Side: Info */}
                <div className="animate-fade-in" style={{ paddingRight: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#fff7ed', padding: '0.625rem 1.25rem', borderRadius: '2rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid #ffedd5' }}>
                        <ShieldCheck size={18} />
                        SECURED REGISTRATION
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        Join the <span style={{ color: 'var(--primary)' }}>Network.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        Create an account to start managing your healthcare journey or clinical practice with state-of-the-art tools.
                    </p>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                <User size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, color: '#111827' }}>For Patients</h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Book appointments anytime, anywhere.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                <Stethoscope size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, color: '#111827' }}>For Doctors</h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Optimize your workspace and queue.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="card glass animate-scale-up" style={{ padding: '3rem', borderRadius: '2.5rem', background: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '2rem' }}>Let's get started</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #e5e7eb', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #e5e7eb', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #e5e7eb', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Register as</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                                    style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid', borderColor: formData.role === 'patient' ? 'var(--primary)' : '#e5e7eb', background: formData.role === 'patient' ? '#fff7ed' : 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700, color: formData.role === 'patient' ? 'var(--primary)' : '#4b5563' }}
                                >
                                    Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                                    style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid', borderColor: formData.role === 'doctor' ? 'var(--primary)' : '#e5e7eb', background: formData.role === 'doctor' ? '#fff7ed' : 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700, color: formData.role === 'doctor' ? 'var(--primary)' : '#4b5563' }}
                                >
                                    Doctor
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', marginTop: '1rem', borderRadius: '1rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(237, 108, 13, 0.3)' }}
                        >
                            {loading ? 'Processing...' : 'Create Account'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
