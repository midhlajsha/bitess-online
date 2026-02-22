'use client';

import React from 'react';
import styles from './ProductCard.module.css';
import { Product } from './ProductGrid';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const originalPrice = product.price * 1.5;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.pricing}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    <span className={styles.originalPrice}>${originalPrice.toFixed(2)}</span>
                    <span className={styles.onwards}>onwards</span>
                </div>
                <div className={styles.deliveryBadge}>
                    <span className={styles.freeDelivery}>Free Delivery</span>
                </div>
                <div className={styles.ratingRow}>
                    <div className={styles.ratingBadge}>
                        {product.rating} <span className={styles.starIcon}>★</span>
                    </div>
                    <span className={styles.reviews}>245 Reviews</span>
                </div>
                <button
                    className={styles.addToCart}
                    onClick={() => addToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

