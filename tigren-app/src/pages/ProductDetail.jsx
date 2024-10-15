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

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Loading...</p>;

    const stockClass = product.stock_status === 'IN_STOCK' ? '' : 'out-of-stock';

    return (
        <div className="product-detail-container">
            <img
                src={product.small_image?.url || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="product-detail-image" // Cập nhật tên lớp ở đây
            />
            <div className="product-detail-info"> {/* Cập nhật tên lớp ở đây */}
                <h1>{product.name}</h1>
                <p className="product-detail-price"> {/* Cập nhật tên lớp ở đây */}
                    {product.price_range.minimum_price.regular_price.value}{' '}
                    {product.price_range.minimum_price.regular_price.currency}
                </p>
                <p className={`product-detail-stock-status ${stockClass}`}> {/* Cập nhật tên lớp ở đây */}
                    {product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="product-detail-actions"> {/* Cập nhật tên lớp ở đây */}
                    <button className="btn-buy-now">Buy Now</button>
                    <button className="btn-add-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
