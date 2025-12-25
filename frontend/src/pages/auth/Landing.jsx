import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';

const Landing = () => {
    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="landing-title">
                <header>
                    <h1 id="landing-title" className="auth-title">Welcome</h1>
                    <p className="auth-subtitle">Please select how you would like to login.</p>
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link to="/user/login" className="auth-submit" style={{ textDecoration: 'none' }}>
                        Login as User
                    </Link>
                    <Link to="/food-partner/login" className="auth-submit" style={{ textDecoration: 'none', background: 'var(--color-surface-alt)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                        Login as Food Partner
                    </Link>
                </div>
                <div className="auth-alt-action" style={{ marginTop: '16px' }}>
                    New here? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
