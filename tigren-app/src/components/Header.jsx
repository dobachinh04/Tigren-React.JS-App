import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faRightToBracket, faUserGear } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const [blogCategories, setBlogCategories] = useState([]);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('customerToken'); // Xóa token khi logout
        localStorage.removeItem('userData'); // Xóa dữ liệu người dùng
        navigate('/login'); // Chuyển hướng về trang login
    };

    const token = localStorage.getItem('customerToken'); // Kiểm tra token trong localStorage

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                const response = await fetch('http://magento2.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `{
                            getBlogCategoryList {
                                items {
                                    entity_id
                                    name
                                    status
                                }
                            }
                        }`
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch blog categories');
                }

                const result = await response.json();
                setBlogCategories(result.data.getBlogCategoryList.items);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBlogCategories();
    }, []);

    return (
        <header className="header">
            <nav className="nav">
                <Link to="/" className="logo">
                    <img
                        src="https://cdn.brandfetch.io/idSfrRTEh8/w/170/h/39/theme/light/logo.png?k=bfHSJFAPEG"
                        alt="Logo"
                    />
                </Link>
                <ul className="menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li>
                        Blog
                        <ul>
                            {error && <li style={{ color: 'red' }}>{error}</li>}
                            {blogCategories.length === 0 ? (
                                <li>No categories available.</li>
                            ) : (
                                blogCategories.map((category) => (
                                    <li key={category.entity_id}>
                                        <Link to={`/blogs/${category.entity_id}`}>{category.name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </li>
                    <li><Link to="/about">About</Link></li>
                </ul>
                <div className="icons">
                    {!token ? (
                        <Link to="/login" className="icon">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="icon logout-button">
                                <FontAwesomeIcon icon={faRightToBracket} />
                            </button>
                            <Link to="/user-detail" className="icon">
                                <FontAwesomeIcon icon={faUserGear} />
                            </Link>

                        </>
                    )}
                    <Link to="/cart" className="icon">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
