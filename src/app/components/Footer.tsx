'use client';

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <button className={styles.backToTop} onClick={scrollToTop}>
                Back to top
            </button>

            <div className={styles.mainFooter}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.column}>
                            <h3 className={styles.colTitle}>Get to Know Us</h3>
                            <ul>
                                <li><a href="#">About Bitess</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press Releases</a></li>
                                <li><a href="#">Amazon Science</a></li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h3 className={styles.colTitle}>Make Money with Us</h3>
                            <ul>
                                <li><a href="#">Sell on Bitess</a></li>
                                <li><a href="#">Sell under Bitess Accelerator</a></li>
                                <li><a href="#">Protect & Build Your Brand</a></li>
                                <li><a href="#">Become an Affiliate</a></li>
                                <li><a href="#">Fulfillment by Bitess</a></li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h3 className={styles.colTitle}>Payment Products</h3>
                            <ul>
                                <li><a href="#">Bitess Business Card</a></li>
                                <li><a href="#">Shop with Points</a></li>
                                <li><a href="#">Reload Your Balance</a></li>
                                <li><a href="#">Bitess Currency Converter</a></li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h3 className={styles.colTitle}>Let Us Help You</h3>
                            <ul>
                                <li><a href="#">Your Account</a></li>
                                <li><a href="#">Your Orders</a></li>
                                <li><a href="#">Shipping Rates & Policies</a></li>
                                <li><a href="#">Returns & Replacements</a></li>
                                <li><a href="#">Help</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomFooter}>
                <div className="container">
                    <div className={styles.logoRow}>
                        <a href="/" className={styles.footerLogo}>Bitess</a>
                    </div>
                </div>
            </div>

            <div className={styles.copyRow}>
                <p>&copy; 1996-2026, Bitess.online, Inc. or its affiliates</p>
            </div>
        </footer>
    );
}
