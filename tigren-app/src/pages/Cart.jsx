import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('customerToken');
            if (!token) {
                setError('You must be logged in to view the cart.');
                return;
            }

            try {
                const response = await axios.post(
                    'http://magento2.com/graphql',
                    {
                        query: `
                query {
                  customerCart {
                    id
                    items {
                      id
                      product {
                        name
                        image {
                          url
                        }
                        sku
                        price_range {
                          minimum_price {
                            regular_price {
                              value
                              currency
                            }
                          }
                        }
                      }
                      quantity
                    }
                  }
                }`
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.errors) {
                    throw new Error(response.data.errors[0].message);
                }

                setCartItems(response.data.data.customerCart.items);

                // Debug log để xem cấu trúc cartItems
                console.log('Cart items: ', response.data.data.customerCart.items);
            } catch (err) {
                setError('Unable to fetch cart items.');
                console.error(err);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem('customerToken');
        if (!token) {
            setError('You must be logged in to remove items from the cart.');
            return;
        }

        console.log('Item ID to remove: ', itemId);

        try {
            const cartId = cartItems.length > 0 ? cartItems[0].cart_id || cartItems[0].id : null;
            console.log('Cart ID: ', cartId);

            if (!cartId) {
                throw new Error('Cart ID is not defined');
            }

            const response = await axios.post(
                'http://magento2.com/graphql',
                {
                    query: `
                mutation {
                    removeItemFromCart(
                        input: {
                            cart_id: "${cartId}",
                            id: "${itemId}" // Nếu item_id không hợp lệ thì đổi thành id
                        }
                    ) {
                        cart {
                            id
                            items {
                                id
                                product {
                                    name
                                }
                            }
                        }
                    }
                }`
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Remove item response: ', response.data);

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            setCartItems(response.data.data.removeItemFromCart.cart.items);
        } catch (err) {
            if (err.response) {
                setError(`Unable to remove item from the cart. ${err.response.data.errors[0].message}`);
            } else {
                setError('Unable to remove item from the cart. Network error.');
            }
            console.error(err);
        }
    };

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={item.product.image.url}
                                alt={item.product.name}
                                className="cart-item-image"
                            />
                            <h3>{item.product.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>
                                Price: {item.product.price_range.minimum_price.regular_price.value}
                                {item.product.price_range.minimum_price.regular_price.currency}
                            </p>
                            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
