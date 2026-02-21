'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
    const { items, setIsCartOpen } = useCart();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <a href="/" className={styles.logo}>Bitess</a>

                <div className={styles.navLinks}>
                    <a href="#products" className={styles.link}>Shop</a>
                    <a href="#about" className={styles.link}>About</a>
                </div>

                <button
                    className={styles.cartButton}
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Open Cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    {totalItems > 0 && (
                        <span className={styles.badge}>{totalItems}</span>
                    )}
                </button>
            </div>
        </header>
    );
}
