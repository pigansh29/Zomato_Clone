import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // ... (existing logic)
    e.preventDefault();
    /* ... */
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`, {
        email,
        password
      }, { withCredentials: true });

      console.log(response.data);
      localStorage.setItem('foodPartner', JSON.stringify(response.data.foodPartner));
      navigate("/create-food");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={logo} alt="FlavorFeed" style={{ width: '80px', height: 'auto', marginBottom: '1rem', objectFit: 'contain' }} />
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        {error && <div style={{ color: 'red', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fecaca', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" disabled={loading} />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" disabled={loading} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
