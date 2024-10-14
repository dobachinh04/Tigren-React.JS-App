import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductList.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://magento2.com/graphql', {
                    query: `
                    query GetProducts($pageSize: Int!, $currentPage: Int!, $filter: ProductAttributeFilterInput) {
                        products(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
                            items {
                                id
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

    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const handleAddToCart = (product) => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const newCart = [
            ...savedCart, {
                id: product.id,
                name: product.name,
                price: product.price_range.minimum_price.regular_price.value,
                currency: product.price_range.minimum_price.regular_price.currency,
                image: product.small_image.url
            }
        ];
        localStorage.setItem('cart', JSON.stringify(newCart));
        alert('Product added to cart!');
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
                                src={product.small_image.url}
                                alt={product.name}
                                className="product-image"
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
