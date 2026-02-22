import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className={`container ${styles.content}`}>
                <div className={styles.bannerTable}>
                    <h1 className={styles.title}>Welcome to Bitess</h1>
                    <p className={styles.subtitle}>Discover premium electronics, fashion, and home essentials with fast delivery.</p>
                    <div className={styles.cta}>
                        <a href="#products" className="btn btn-primary">Shop all deals</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
