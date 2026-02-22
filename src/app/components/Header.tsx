'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

const categories = [
    'Women Ethnic', 'Women Western', 'Men', 'Kids', 'Home & Kitchen', 'Beauty & Health', 'Jewellery & Accessories', 'Bags & Footwear', 'Electronics'
];

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className={styles.header}>
            <div className={styles.topRow}>
                <div className={`container ${styles.headerContainer}`}>
                    <div className={styles.logoCol}>
                        <a href="/" className={styles.logo}>Bitess</a>
                    </div>

                    <div className={styles.searchCol}>
                        <div className={styles.searchWrapper}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            <input
                                type="text"
                                placeholder="Try Saree, Kurti or Search by Product Code"
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.utilityCol}>
                        <div className={styles.utilityItem}>
                            <span className={styles.utilityIcon}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </span>
                            <span className={styles.utilityText}>Download App</span>
                        </div>
                        <div className={styles.utilityDivider}></div>
                        <div className={styles.utilityItem}>
                            <span className={styles.utilityText}>Become a Supplier</span>
                        </div>
                        <div className={styles.utilityDivider}></div>
                        <div className={styles.utilityItem}>
                            <span className={styles.utilityIcon}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <span className={styles.utilityText}>Profile</span>
                        </div>
                        <div className={styles.utilityItem} onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer' }}>
                            <div className={styles.cartBtn}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                            </div>
                            <span className={styles.utilityText}>Cart</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className={styles.navbar}>
                <div className={`container ${styles.navContainer}`}>
                    <ul className={styles.navList}>
                        {categories.map(cat => (
                            <li key={cat} className={styles.navItem}>{cat}</li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

