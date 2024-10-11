import React, { useEffect, useState } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://magento2.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer (token)'
                    },
                    body: JSON.stringify({
                        query: `{
                            products(search: "") {
                                items {
                                    id
                                    name
                                    sku
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
                            }
                        }`
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const result = await response.json();
                setProducts(result.data.products.items); // Lưu danh sách sản phẩm vào state
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>SKU: {product.sku}</p>
                            <p>Price: {product.price_range.minimum_price.regular_price.value} {product.price_range.minimum_price.regular_price.currency}</p>
                            <img src={product.small_image.url} alt={product.name} style={{ width: '150px', height: '150px' }} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductList;
