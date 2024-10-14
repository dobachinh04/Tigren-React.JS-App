import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/user-detail'); // Chuyển hướng nếu đã đăng nhập
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://magento2.com/rest/V1/integration/customer/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const token = await response.text();
            const sanitizedToken = token.replace(/"/g, '');
            localStorage.setItem('token', sanitizedToken);

            const userResponse = await fetch('http://magento2.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sanitizedToken}`
                },
                body: JSON.stringify({
                    query: `{
                        customer {
                            firstname
                            lastname
                            email
                        }
                    }`
                })
            });

            const userData = await userResponse.json();

            if (userData.data.customer) {
                setUserData(userData.data.customer);
                localStorage.setItem('userData', JSON.stringify(userData.data.customer));
                navigate('/user-detail');
            } else {
                throw new Error('User data not found');
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
