import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPostMethod } from './api/rest';
import { allApiUrl } from './api/apiRoute';

const Login = ({ isAdmin = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = isAdmin ? allApiUrl.ADMIN_LOGIN : allApiUrl.LOGIN;

        try {
            const response = await apiPostMethod(url, formData);
            if (response.status === 200 || response.status === 201) {
                // Prepare persistence data in the format expected by getHeaders
                const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";
                const loginData = {
                    loginUserToken: response.data?.accessToken, // Backend sends accessToken
                    user: response.data?.user || {}
                };

                const persistData = {
                    loginReducer: JSON.stringify(loginData)
                };

                localStorage.setItem(`persist:${storageKey}`, JSON.stringify(persistData));

                alert(`${isAdmin ? 'Admin' : 'User'} login successful!`);
                navigate('/dashboard');
                // Force a page refresh to update ProtectedRoute state if necessary
                window.location.reload();
            }
        } catch (err) {
            setError(err?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>{isAdmin ? 'Admin Login' : 'Welcome Back'}</h2>
            <p>{isAdmin ? 'Secure access for administrators' : 'Log in to your account'}</p>

            {error && <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="signup-button" disabled={loading}>
                    {loading ? (isAdmin ? 'Admin Logging In...' : 'Logging In...') : (isAdmin ? 'Admin Login' : 'Log In')}
                </button>
            </form>

            {!isAdmin && (
                <div className="login-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            )}
        </div>
    );
};

export default Login;

