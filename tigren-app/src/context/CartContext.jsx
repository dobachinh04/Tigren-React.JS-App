import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartId, setCartId] = useState('');

    useEffect(() => {
        const fetchCartId = async () => {
            let id = localStorage.getItem('cartId');
            if (!id) {
                const response = await axios.post('http://magento2.com/graphql', {
                    query: `
                    mutation {
                        createEmptyCart
                    }`,
                });
                id = response.data.data.createEmptyCart;
                localStorage.setItem('cartId', id);
            }
            setCartId(id);
        };

        fetchCartId();
    }, []);

    return (
        <CartContext.Provider value={{ cartId }}>
            {children}
        </CartContext.Provider>
    );
};
