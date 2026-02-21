'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../components/ProductGrid';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: Product) => {
        setItems((prevItems) => {
            const existing = prevItems.find((item) => item.id === product.id);
            if (existing) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Auto-open cart on add
    };

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
