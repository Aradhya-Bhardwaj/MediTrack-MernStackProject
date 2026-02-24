import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Activity, Stethoscope, Heart, Brain, Bone, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const { login, loginWithEmail } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = (role) => {
        addToast(`Preparing ${role} authentication...`, 'info');
        login(role);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginWithEmail(formData.email, formData.password);
            addToast('Login successful!', 'success');
            navigate('/dashboard');
        } catch (err) {
            addToast(err.message || 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            title: "Advanced Cardiology",
            desc: "World-class heart care with state-of-the-art diagnostic facilities.",
            icon: <Heart size={48} color="#ed6c0d" />,
            bg: "#fff7ed"
        },
        {
            title: "Neurosciences",
            desc: "Expert treatment for complex neurological conditions and brain health.",
            icon: <Brain size={48} color="#ed6c0d" />,
            bg: "#f0fdf4"
        },
        {
            title: "Orthopaedics",
            desc: "Comprehensive bone and joint care for active living.",
            icon: <Bone size={48} color="#ed6c0d" />,
            bg: "#eff6ff"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 5rem)', overflow: 'hidden' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', padding: '5rem 1.5rem', alignItems: 'center' }}>

                {/* Left Side: Login Form */}
                <div className="animate-fade-in">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#fff7ed', padding: '0.625rem 1.25rem', borderRadius: '2rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid #ffedd5' }}>
                        <ShieldCheck size={18} />
                        SECURED HEALTH NETWORK
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        Welcome <span style={{ color: 'var(--primary)' }}>Back.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2.5rem', maxWidth: '540px' }}>
                        Log in to your MediTrack account to manage appointments and histories.
                    </p>

                    <div className="card glass animate-scale-up" style={{ padding: '2.5rem', borderRadius: '2rem', background: 'white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
                        <form onSubmit={handleEmailLogin} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #e5e7eb', outline: 'none', fontSize: '1rem' }}
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
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #e5e7eb', outline: 'none', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(237, 108, 13, 0.3)' }}
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleGoogleLogin('patient')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
                                <UserIcon size={18} /> Patient
                            </button>
                            <button onClick={() => handleGoogleLogin('doctor')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
                                <Stethoscope size={18} /> Doctor
                            </button>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create one here</Link>
                    </p>
                </div>

                {/* Right Side: Services Carousel */}
                <div style={{ position: 'relative' }} className="animate-slide-in-right">
                    <div style={{
                        height: '560px',
                        background: slides[currentSlide].bg,
                        borderRadius: '3rem',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div key={currentSlide} className="animate-fade-in" style={{ animationDuration: '0.8s' }}>
                            <div style={{ marginBottom: '2.5rem', transform: 'scale(1.2)', transformOrigin: 'left' }}>
                                {slides[currentSlide].icon}
                            </div>
                            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                                {slides[currentSlide].title}
                            </h2>
                            <p style={{ fontSize: '1.375rem', color: '#374151', lineHeight: 1.6, fontWeight: 500 }}>
                                {slides[currentSlide].desc}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '4rem' }}>
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: i === currentSlide ? '3rem' : '0.75rem',
                                        height: '0.75rem',
                                        borderRadius: '1rem',
                                        background: i === currentSlide ? 'var(--primary)' : 'var(--border)',
                                        transition: 'all 0.4s ease'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
