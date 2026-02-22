import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <div className={styles.bannerTable}>
                    <h1 className={styles.title}>Lowest Prices <br />Best Quality Shopping</h1>
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <span className={styles.statIcon}>🚚</span>
                            <span className={styles.statText}>Free Delivery</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statIcon}>💵</span>
                            <span className={styles.statText}>Cash on Delivery</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statIcon}>🔄</span>
                            <span className={styles.statText}>Easy Returns</span>
                        </div>
                    </div>
                    <div className={styles.cta}>
                        <a href="#products" className={styles.shopBtn}>
                            <svg className={styles.downloadIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                            Download the Meesho App
                        </a>
                    </div>
                </div>
                <div className={styles.imageCol}>
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" alt="Fashion" className={styles.heroImg} />
                </div>
            </div>
        </section>

    );
}
