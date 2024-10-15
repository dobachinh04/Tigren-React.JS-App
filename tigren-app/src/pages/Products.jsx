import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductList.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://magento2.com/graphql', {
                    query: `
                    query GetProducts($pageSize: Int!, $currentPage: Int!, $filter: ProductAttributeFilterInput) {
                        products(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
                            items {
                                id
                                sku
                                name
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
                            }
                            total_count
                        }
                    }
                    `,
                    variables: {
                        pageSize,
                        currentPage,
                        filter: {}
                    }
                });

                if (response.data.errors) {
                    console.error('GraphQL errors:', response.data.errors);
                    setError('Failed to fetch products.');
                    return;
                }

                const productData = response.data?.data?.products?.items || [];
                setProducts(productData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const handleViewDetail = (sku) => {
        navigate(`/product/${sku}`);
    };
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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

    return (
        <div className="product-list-container">
            <h2>Products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.small_image?.url || 'https://via.placeholder.com/150'}
                                alt={product.name}
                                className="product-image"
                                onClick={() => handleViewDetail(product.sku)}
                                style={{ cursor: 'pointer' }}
                            />
                            <h3>{product.name}</h3>
                            <p>
                                Price: {product.price_range.minimum_price.regular_price.value}{' '}
                                {product.price_range.minimum_price.regular_price.currency}
                            </p>
                            <div className="product-actions">
                                <button className="btn-buy">Buy</button>
                                <button className="btn-cart" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default Products;
