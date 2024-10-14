import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token khi logout
        localStorage.removeItem('userData'); // Xóa dữ liệu người dùng
        navigate('/login'); // Chuyển hướng về trang login
    };

    const token = localStorage.getItem('token'); // Kiểm tra token trong localStorage

    return (
        <header className="header">
            <nav className="nav">
                <Link to="/" className="logo">Tigren</Link>
                <ul className="menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/testimonial">Testimonial</Link></li>
                    <li><Link to="/blogs">Blog</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
                <div className="icons">
                    {!token ? ( // Nếu không có token, hiển thị nút Login
                        <Link to="/login" className="icon">Login</Link>
                    ) : (
                        <button onClick={handleLogout} className="icon">Logout</button> // Nếu có token, hiển thị nút Logout
                    )}
                    <Link to="/cart" className="icon">🛒</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
