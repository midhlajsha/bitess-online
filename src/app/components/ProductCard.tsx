'use client';

import React from 'react';
import styles from './ProductCard.module.css';
import { Product } from './ProductGrid';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
                <div className={styles.overlay}>
                    <button className={`btn btn-primary ${styles.quickAdd}`} onClick={() => addToCart(product)}>
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.footer}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
