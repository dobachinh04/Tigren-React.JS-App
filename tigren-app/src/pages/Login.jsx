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
        const token = localStorage.getItem('customerToken');
        if (token) {
            navigate('/user-detail'); // Chuyển hướng đến giỏ hàng nếu đã đăng nhập
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            // Gửi yêu cầu đăng nhập với GraphQL
            const response = await fetch('http://magento2.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                    mutation {
                      generateCustomerToken(
                        email: "${email}", 
                        password: "${password}"
                      ) {
                        token
                      }
                    }`
                })
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error('Login failed: ' + result.errors[0].message);
            }

            const token = result.data.generateCustomerToken.token;
            localStorage.setItem('customerToken', token); // Lưu token vào localStorage

            // Lấy thông tin người dùng
            const userResponse = await fetch('http://magento2.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `
                    query {
                      customer {
                        firstname
                        lastname
                        email
                      }
                    }`
                })
            });

            const userDataResult = await userResponse.json();

            if (userDataResult.errors) {
                throw new Error('Failed to fetch user data.');
            }

            setUserData(userDataResult.data.customer);
            localStorage.setItem('userData', JSON.stringify(userDataResult.data.customer));

            // Điều hướng đến trang giỏ hàng sau khi đăng nhập thành công
            navigate('/user-detail');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
