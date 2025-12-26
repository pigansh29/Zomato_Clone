import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import logo from '../../assets/logo.png'

const Home = () => {
    const [videos, setVideos] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/food`, { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true })

        if (response.data.like) {
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v))
        } else {
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v))
        }

    }

    async function saveVideo(item) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1, isSaved: true } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1, isSaved: false } : v))
        }
    }

    const [showDropdown, setShowDropdown] = useState(false);

    async function handleLogout() {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/user/logout`);
            localStorage.removeItem('token'); // Clear token if stored
            window.location.href = '/user/login';
        } catch (err) {
            console.error("Logout failed", err);
            window.location.href = '/user/login'; // Redirect anyway
        }
    }

    return (
        <>
            <header className="home-header" style={{ justifyContent: 'space-between' }}>
                <img src={logo} alt="FlavorFeed" style={{ height: '40px', objectFit: 'contain' }} />
                <div className="profile-container">
                    <button
                        className="profile-icon-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        aria-label="Profile menu"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                            alt="Profile"
                            className="profile-avatar"
                        />
                    </button>

                    {showDropdown && (
                        <div className="profile-dropdown">
                            <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="No videos available."
            />
        </>
    )
}

export default Home