import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReelFeed from '../../components/ReelFeed';
import logo from '../../assets/logo.png';
import '../../styles/animations.css';

const Saved = () => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedFoods();
    }, []);

    const fetchSavedFoods = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/food/save`, { withCredentials: true });
            const formattedVideos = response.data.savedFoods.map(item => ({
                ...item.food,
                isSaved: true,
                savesCount: item.food.savesCount
            }));
            setSavedVideos(formattedVideos);
        } catch (err) {
            console.error("Error fetching saved foods:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (item) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true });
            if (!response.data.save) {
                setSavedVideos(prev => prev.filter(v => v._id !== item._id));
            }
        } catch (err) {
            console.error("Error unsaving video:", err);
        }
    };

    return (
        <div className="saved-page animated-bg" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <header className="slide-up" style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                zIndex: 10,
                position: 'fixed',
                top: 0,
                width: '100%',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <img src={logo} alt="FlavorFeed" style={{ height: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <h1 className="text-xl font-bold" style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '0.5px' }}>Saved Collection</h1>
            </header>

            <div className="fade-in" style={{ flex: 1, paddingTop: '64px', height: '100%', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                        <div className="loader">Loading...</div>
                    </div>
                ) : (
                    <ReelFeed
                        items={savedVideos}
                        onSave={handleUnsave}
                        emptyMessage="No saved reels yet. Go explore!"
                        style={{ height: '100%' }}
                        className="fade-in"
                    />
                )}
            </div>
        </div>
    );
};

export default Saved;
