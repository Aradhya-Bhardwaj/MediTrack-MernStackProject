import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AppointmentForm from '../components/AppointmentForm';
import Loader from '../components/Loader';
import { Check, X, Calendar as CalendarIcon, User as UserIcon, Activity, Clock as ClockIcon } from 'lucide-react';

const Dashboard = () => { //This functional component manages appointments and displays dashboard data dynamically depending on the user's role.
    const { user } = useAuth();// We get the currently logged-in user from the global authentication context.
                               //The user object contains details like name and role (patient or doctor).
    const { addToast } = useToast();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0 });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/appointments', { withCredentials: true });
            setAppointments(res.data);
            calculateStats(res.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/appointments/${id}`, { status }, { withCredentials: true });
            addToast(`Appointment ${status} successfully`, 'success');
            fetchAppointments();
        } catch (err) {
            addToast('Error updating appointment status', 'error');
        }
    };

    const calculateStats = (data) => {
        setStats({
            total: data.length,
            pending: data.filter(a => a.status === 'pending').length,
            confirmed: data.filter(a => a.status === 'approved').length
        });
    };

    if (loading) return <Loader message="Accessing Medical Records..." />;

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header Section */}
            <div className="animate-fade-in" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                        {user?.role === 'doctor'
                            ? 'Manage your patient appointments and requests with ease.'
                            : 'Book and manage your medical consultations through your personalized portal.'}
                    </p>
                </div>
                <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem 1.25rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.625rem', border: '1px solid #d1fae5' }}>
                    <div className="animate-pulse" style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>
                    Secured System Connection
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card glass animate-scale-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,247,237,0.8) 100%)' }}>
                    <div style={{ background: 'var(--primary)', padding: '1.25rem', borderRadius: '1.25rem', boxShadow: '0 8px 16px rgba(237, 108, 13, 0.2)' }}><CalendarIcon color="white" size={28} /></div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{stats.total}</div>
                        <div style={{ fontSize: '0.875rem', color: '#7c2d12', fontWeight: 700, marginTop: '0.5rem', opacity: 0.7 }}>Total Appointments</div>
                    </div>
                </div>
                <div className="card glass animate-scale-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: '0.1s', background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,251,235,0.8) 100%)' }}>
                    <div style={{ background: '#f59e0b', padding: '1.25rem', borderRadius: '1.25rem', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)' }}><ClockIcon color="white" size={28} /></div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{stats.pending}</div>
                        <div style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: 700, marginTop: '0.5rem', opacity: 0.7 }}>Pending Approvals</div>
                    </div>
                </div>
                <div className="card glass animate-scale-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: '0.2s', background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,253,244,0.8) 100%)' }}>
                    <div style={{ background: '#10b981', padding: '1.25rem', borderRadius: '1.25rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><Check color="white" size={28} /></div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{stats.confirmed}</div>
                        <div style={{ fontSize: '0.875rem', color: '#064e3b', fontWeight: 700, marginTop: '0.5rem', opacity: 0.7 }}>Confirmed Visits</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'patient' ? '400px 1fr' : '1fr', gap: '3rem' }}>
                {user?.role === 'patient' && (
                    <div style={{ position: 'sticky', top: '7rem', height: 'fit-content' }} className="animate-fade-in">
                        <AppointmentForm onAppointmentBooked={fetchAppointments} />
                    </div>
                )}

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>
                            <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '1rem' }}><Activity color="var(--primary)" size={24} /></div>
                            {user?.role === 'doctor' ? 'Clinical Queue' : 'Consultation History'}
                        </h2>
                        {appointments.length > 0 && <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Showing {appointments.length} entries</span>}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Schedule</th>
                                    <th>{user?.role === 'doctor' ? 'Patient' : 'Specialist'}</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    {user?.role === 'doctor' && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app) => (
                                    <tr key={app._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid #f1f5f9' }}>
                                                    <CalendarIcon size={18} color="var(--primary)" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#111827' }}>{app.date}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{app.timeSlot}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <UserIcon size={16} color="#475569" />
                                                </div>
                                                {user?.role === 'doctor' ? app.patientName : app.doctorName}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                                                {app.department.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                background: app.status === 'approved' ? '#f0fdf4' : app.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                                                color: app.status === 'approved' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '2rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                border: `1px solid ${app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7'}`
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        {user?.role === 'doctor' && (
                                            <td style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                {app.status === 'pending' ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.5rem', background: '#10b981', minWidth: '32px', height: '32px' }}
                                                            onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '0.5rem', borderColor: '#ef4444', color: '#ef4444', minWidth: '32px', height: '32px' }}
                                                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Processed</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9ca3af' }}>
                                <div style={{ marginBottom: '1.5rem' }}><ClockIcon size={56} strokeWidth={1} /></div>
                                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Your schedule is clear</h3>
                                <p>No appointments found at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
