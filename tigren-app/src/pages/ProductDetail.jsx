import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { sku } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.post('http://magento2.com/graphql', {
                    query: `
                    query GetProductDetail($sku: String!) {
                        products(filter: { sku: { eq: $sku } }) {
                            items {
                                name
                                sku
                                description {
                                    html
                                }
                                price_range {
                                    minimum_price {
                                        regular_price {
                                            value
                                            currency
                                        }
                                    }
                                }
                                small_image {
                                    url
                                }
                                stock_status
                            }
                        }
                    }
                    `,
                    variables: { sku }
                });

                const productData = response.data?.data?.products?.items[0];
                if (!productData) {
                    setError('Product not found.');
                    return;
                }
                setProduct(productData);
            } catch (err) {
                setError('Failed to fetch product details.');
            }
        };

        fetchProductDetail();
    }, [sku]);

    const createCart = async (token) => {
        try {
            const response = await axios.post(
                'http://magento2.com/graphql',
                {
                    query: `
                    mutation {
                        createEmptyCart
                    }
                    `
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data.data.createEmptyCart;
        } catch (error) {
            console.error('Failed to create cart:', error);
            setError('Unable to create cart.');
            throw error;
        }
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('customerToken');
        if (!token) {
            setError('You must be logged in to add products to the cart.');
            return;
        }

        let cartId = localStorage.getItem('cartId');

        try {
            if (!cartId) {
                cartId = await createCart(token);
                localStorage.setItem('cartId', cartId);
            }

            // Kiểm tra xem giỏ hàng có hoạt động hay không
            const response = await axios.post(
                'http://magento2.com/graphql',
                {
                    query: `
                    query {
                        cart(cart_id: "${cartId}") {
                            id
                        }
                    }
                `
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Nếu giỏ hàng không hợp lệ, tạo một giỏ hàng mới
            if (response.data.errors || !response.data.data.cart) {
                cartId = await createCart(token);
                localStorage.setItem('cartId', cartId);
            }

            const addToCartResponse = await axios.post(
                'http://magento2.com/graphql',
                {
                    query: `
                    mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
                        addSimpleProductsToCart(
                            input: {
                                cart_id: $cartId,
                                cart_items: [
                                    {
                                        data: {
                                            sku: $sku,
                                            quantity: $quantity
                                        }
                                    }
                                ]
                            }
                        ) {
                            cart {
                                items {
                                    id
                                    product {
                                        name
                                    }
                                    quantity
                                }
                            }
                        }
                    }
                `,
                    variables: {
                        cartId,
                        sku: product.sku,
                        quantity: 1
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (addToCartResponse.data.errors) {
                const errorMessage = addToCartResponse.data.errors[0].message;
                throw new Error(errorMessage);
            }

            alert(`${product.name} has been added to your cart!`);
            console.log('Cart response:', addToCartResponse.data.data);
        } catch (err) {
            console.error('Add to cart error:', err);
            setError('Failed to add product to cart.');
        }
    };

    if (!product) return <p>Loading...</p>;

    const stockClass = product.stock_status === 'IN_STOCK' ? '' : 'out-of-stock';

    return (
        <div className="product-detail-container">
            <img
                src={product.small_image?.url || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="product-detail-image"
            />
            <div className="product-detail-info">
                <h1>{product.name}</h1>
                <p className="product-detail-price">
                    {product.price_range.minimum_price.regular_price.value}{' '}
                    {product.price_range.minimum_price.regular_price.currency}
                </p>
                <p className={`product-detail-stock-status ${stockClass}`}>
                    {product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="product-detail-actions">
                    <button className="btn-buy-now">Buy Now</button>
                    <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị thông báo lỗi ở đây */}
            </div>
        </div>
    );
};

export default ProductDetail;
