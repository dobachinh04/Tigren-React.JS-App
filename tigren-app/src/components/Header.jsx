import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faRightToBracket, faUserGear } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const [blogCategories, setBlogCategories] = useState([]);
    const [error, setError] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State để quản lý trạng thái của dropdown

    const handleLogout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const token = localStorage.getItem('customerToken');

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

    useEffect(() => {
        const fetchCartItemCount = async () => {
            const token = localStorage.getItem('customerToken');
            if (!token) return;

            try {
                const response = await axios.post('http://magento2.com/graphql', {
                    query: `
                    query {
                        customerCart {
                            items {
                                quantity
                            }
                        }
                    }`
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.errors) {
                    throw new Error(response.data.errors[0].message);
                }

                const items = response.data.data.customerCart.items;
                const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
                setCartItemCount(itemCount);
            } catch (err) {
                console.error('Error fetching cart item count:', err);
            }
        };

        fetchCartItemCount();
    }, [token]);

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
                            <div className="icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <FontAwesomeIcon icon={faUserGear} />
                            </div>
                            {dropdownOpen && ( // Hiển thị dropdown khi dropdownOpen là true
                                <div className="dropdown-menu">
                                    <Link to="/user-detail">User Detail</Link>
                                    <Link to="/my-orders">My Orders</Link>
                                </div>
                            )}
                        </>
                    )}
                    <Link to="/cart" className="icon">
                        <FontAwesomeIcon icon={faCartShopping} />
                        {cartItemCount > 0 && (
                            <span className="cart-item-count">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
