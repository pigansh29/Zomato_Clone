import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReelFeed from '../../components/ReelFeed';
import '../../styles/profile.css'; // Assuming you might have or want specific styles

const Profile = () => {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);

    const [activeTab, setActiveTab] = useState('menu');

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`, { withCredentials: true });
                const data = response.data.foodPartner;
                setPartner(data);
                if (data.foodItems) {
                    setVideos(data.foodItems);
                }
            } catch (err) {
                console.error("Error fetching partner data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [id]);

    // Re-using logic from Home for consistency, though purely local state update here
    async function likeVideo(item) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true })
            if (response.data.like) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1, isLiked: true } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) - 1, isLiked: false } : v))
            }
        } catch (err) { console.error(err); }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            if (response.data.save) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1, isSaved: true } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) - 1, isSaved: false } : v))
            }
        } catch (err) { console.error(err); }
    }

    if (loading) return <div className="p-4 text-center">Loading restaurant...</div>;
    if (!partner) return <div className="p-4 text-center">Restaurant not found.</div>;

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="profile-avatar-container">
                        <img
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop"
                            alt={partner.name}
                            className="profile-avatar"
                        />
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-business">{partner.name}</h1>
                        <p className="profile-address">📍 {partner.address}</p>
                        <p className="profile-contact">� {partner.phone}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <a href={`tel:${partner.phone}`} className="action-btn primary">
                        <span style={{ fontSize: '1.2rem' }}>📞</span> Call
                    </a>
                    <a href={`https://maps.google.com/?q=${partner.address}`} target="_blank" rel="noreferrer" className="action-btn secondary">
                        <span style={{ fontSize: '1.2rem' }}>🗺️</span> Directions
                    </a>
                </div>
            </header>

            <nav className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => setActiveTab('menu')}
                >
                    Menu & Reels
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button
                    className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    About
                </button>
            </nav>

            <main className="profile-content">
                {activeTab === 'menu' && (
                    <div className="tab-section fade-in">
                        <ReelFeed
                            className="profile-feed-custom"
                            items={videos}
                            onLike={likeVideo}
                            onSave={saveVideo}
                            emptyMessage="No items uploaded by this partner yet."
                        />
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="tab-section fade-in">
                        <div className="placeholder-text">
                            <h3>⭐ 4.8 (120 Reviews)</h3>
                            <p>Reviews coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="tab-section fade-in">
                        <div className="profile-card">
                            <h3>About {partner.name}</h3>
                            <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
                                Serves delicious food made with love.
                                <br />
                                <strong>Timings:</strong> 10:00 AM - 11:00 PM
                                <br />
                                <strong>Cuisines:</strong> Multi-cuisine, Fast Food
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
