import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';
import '../../styles/dashboard.css';

const CreateFood = () => {
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedPartner = localStorage.getItem('foodPartner');
        if (!storedPartner) {
            navigate('/food-partner/login');
            return;
        }
        setPartner(JSON.parse(storedPartner));
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`);
            localStorage.removeItem('foodPartner');
            localStorage.removeItem('token');
            navigate('/food-partner/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const form = e.target;
        const getName = form.name.value;
        const getDescription = form.description.value;
        const getFile = form.mama.files[0];

        if (!getFile) {
            setError("Please select a video file.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', getName);
        formData.append('description', getDescription);
        formData.append('mama', getFile);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/food`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setMessage('Food item created successfully!');
            form.reset();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to upload food item.");
        } finally {
            setLoading(false);
        }
    };

    if (!partner) return null;

    return (
        <div className="dashboard-page">
            {/* Header */}
            <header className="dashboard-header">
                <div className="logo-section">
                    <img src={logo} alt="FlavorFeed" className="logo-img" />
                    <span className="dashboard-title">Partner Dashboard</span>
                </div>
                <div className="user-section">
                    <span>Welcome, <strong>{partner.name}</strong></span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">

                {/* Actions Grid */}
                <div className="dashboard-grid">

                    {/* Upload Card */}
                    <div className="dashboard-card">
                        <h2 className="card-title">Upload New Dish</h2>
                        {message && <div className="feedback-msg feedback-success">{message}</div>}
                        {error && <div className="feedback-msg feedback-error">{error}</div>}

                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label className="form-label">Dish Name</label>
                                <input name="name" required placeholder="e.g. Signature Sushi Platter" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="description" required placeholder="Tell customers about this dish..." rows="3" className="form-textarea" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Video</label>
                                <input type="file" name="mama" accept="video/*" required className="file-input" />
                            </div>
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? 'Uploading...' : 'Publish to Feed'}
                            </button>
                        </form>
                    </div>

                    {/* Quick Stats / Profile Link */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="dashboard-card">
                            <h2 className="card-title" style={{ fontSize: '1.25rem' }}>Your Profile</h2>
                            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>View how your restaurant appears to customers.</p>
                            <button onClick={() => navigate(`/food-partner/${partner._id}`)} className="profile-btn">
                                View Public Profile
                            </button>
                        </div>

                        <div className="pro-tip-card">
                            <h3 className="pro-tip-title">⚡ Pro Tip</h3>
                            <p className="pro-tip-text">
                                High-quality videos of freshly prepared food get 3x more orders!
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default CreateFood;
