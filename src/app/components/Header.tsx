'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className={styles.header}>
            <div className={styles.topNav}>
                <div className={styles.container}>
                    {/* Logo & Location */}
                    <div className={styles.leftSection}>
                        <a href="/" className={styles.logo}>Bitess</a>
                        <div className={styles.location}>
                            <span className={styles.line1}>Deliver to</span>
                            <span className={styles.line2}>Your Country</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={styles.searchBar}>
                        <select className={styles.categorySelect}>
                            <option>All</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Home</option>
                        </select>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search Bitess"
                        />
                        <button className={styles.searchBtn}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                    </div>

                    {/* Account, Orders, Cart */}
                    <div className={styles.rightSection}>
                        <div className={styles.navLinkItem}>
                            <span className={styles.line1}>Hello, sign in</span>
                            <span className={styles.line2}>Account & Lists</span>
                        </div>
                        <div className={styles.navLinkItem}>
                            <span className={styles.line1}>Returns</span>
                            <span className={styles.line2}>& Orders</span>
                        </div>
                        <button
                            className={styles.cartBtn}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <div className={styles.cartIconWrapper}>
                                <span className={styles.cartCount}>{totalItems}</span>
                                <svg viewBox="0 0 24 24" width="38" height="38" fill="white">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </div>
                            <span className={styles.cartText}>Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-navigation bar */}
            <div className={styles.subHeader}>
                <div className={styles.container}>
                    <a href="#" className={styles.subLink}>All</a>
                    <a href="#" className={styles.subLink}>Today's Deals</a>
                    <a href="#" className={styles.subLink}>Customer Service</a>
                    <a href="#" className={styles.subLink}>Registry</a>
                    <a href="#" className={styles.subLink}>Gift Cards</a>
                    <a href="#" className={styles.subLink}>Sell</a>
                </div>
            </div>
        </header>
    );
}

