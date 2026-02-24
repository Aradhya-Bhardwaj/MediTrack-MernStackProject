import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, User, Stethoscope, Calendar, Clock as ClockIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AppointmentForm = ({ onAppointmentBooked }) => {                      //This is a functional component that receives a prop called onAppointmentBooked, which is used to notify the parent component when a new appointment is successfully created so the appointment list can refresh.
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        department: '',
        doctorName: '',
        date: '',
        timeSlot: ''
    });

    const [doctors, setDoctors] = useState([]);

    const doctorData = {
        'Cardiology': ['Dr. Sarah Smith', 'Dr. James Wilson', 'Dr. Emily Brown'],
        'Neurology': ['Dr. Michael Chen', 'Dr. Robert Taylor', 'Dr. Lisa Wong'],
        'Dermatology': ['Dr. Anna Garcia', 'Dr. David Miller', 'Dr. Jessica Lee'],
        'General Medicine': ['Dr. Paul Adams', 'Dr. Karen White', 'Dr. Mark Johnson'],
        'Pediatrics': ['Dr. Thomas Clark', 'Dr. Nancy Davis', 'Dr. Steven Moore']
    };

    const departments = Object.keys(doctorData);

    useEffect(() => {// The useEffect hook runs whenever the department changes.
//It updates the doctors list according to the selected department and resets the previously selected doctor to avoid mismatched data.
        if (formData.department) {
            setDoctors(doctorData[formData.department]);
            setFormData(prev => ({ ...prev, doctorName: '' }));
        } else {
            setDoctors([]);
        }
    }, [formData.department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/appointments', formData, { withCredentials: true });
            addToast('Clinical visit scheduled successfully!', 'success');
            onAppointmentBooked();
            setFormData({ department: '', doctorName: '', date: '', timeSlot: '' });
        } catch (err) {
            addToast('Failed to schedule visit. Please try again.', 'error');
        }
    };

    return (
        <div className="card glass shadow-xl" style={{ border: '1px solid var(--border)' }}>
            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>
                <div style={{ background: 'var(--primary)', padding: '0.625rem', borderRadius: '0.875rem', display: 'flex' }}>
                    <Stethoscope size={24} color="white" />
                </div>
                Schedule Visit
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Medical Specialization</label>
                    <select
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        style={{ height: '3.5rem', fontWeight: 600 }}
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Assigned Specialist</label>
                    <select
                        required
                        disabled={!formData.department}
                        value={formData.doctorName}
                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                        style={{ height: '3.5rem', fontWeight: 600, background: !formData.department ? '#f1f5f9' : 'white' }}
                    >
                        <option value="">{formData.department ? 'Select a Doctor' : 'Choose department first'}</option>
                        {doctors.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label>Preferred Date</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            style={{ height: '3.5rem', fontWeight: 600 }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time Slot</label>
                        <select
                            required
                            value={formData.timeSlot}
                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                            style={{ height: '3.5rem', fontWeight: 600 }}
                        >
                            <option value="">Select Time</option>
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '3.75rem', fontSize: '1rem', borderRadius: '1rem' }}>
                    <Plus size={22} />
                    Confirm Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;
