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
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.rating}>
                    <span className={styles.stars}>★★★★☆</span>
                    <span className={styles.count}>2,384</span>
                </div>
                <div className={styles.pricing}>
                    <span className={styles.currency}>$</span>
                    <span className={styles.priceWhole}>{Math.floor(product.price)}</span>
                    <span className={styles.priceFraction}>{(product.price % 1).toFixed(2).split('.')[1]}</span>
                </div>
                <div className={styles.prime}>
                    <span className={styles.primeCheck}>✓</span>
                    <span className={styles.primeText}>prime</span>
                    <span className={styles.deliveryText}>FREE delivery Tomorrow</span>
                </div>
                <button className={`btn btn-primary ${styles.addToCart}`} onClick={() => addToCart(product)}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
