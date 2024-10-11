import React, { useEffect, useState } from 'react';

function BlogCategoryList() {
    const [blogCategories, setBlogCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                const response = await fetch('http://magento2.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer (token)'
                    },
                    body: JSON.stringify({
                        query: `{
                            getBlogCategoryList {
                                items {
                                    entity_id
                                    name
                                    description
                                    status
                                    created_at
                                    updated_at
                                }
                            }
                        }`
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch blog categories');
                }

                const result = await response.json();
                setBlogCategories(result.data.getBlogCategoryList.items); // Đảm bảo truy vấn trả về đúng trường
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBlogCategories();
    }, []);

    return (
        <div>
            <h2>Blog Categories</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {blogCategories.length === 0 ? (
                <p>No blog categories available.</p>
            ) : (
                <ul>
                    {blogCategories.map((category) => (
                        <li key={category.entity_id}>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <p>Status: {category.status === 1 ? 'Active' : 'Inactive'}</p>
                            <p>Created At: {new Date(category.created_at).toLocaleDateString()}</p>
                            <p>Updated At: {new Date(category.updated_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BlogCategoryList;
