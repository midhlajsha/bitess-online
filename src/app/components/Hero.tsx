import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`${styles.heroBlur} ${styles.heroBlur1}`}></div>
            <div className={`${styles.heroBlur} ${styles.heroBlur2}`}></div>
            <div className={`container relative ${styles.heroContainer}`}>
                <h1 className={`animate-fade-in-up ${styles.heroTitle}`}>
                    <span className={styles.textGradient}>Premium</span> E-commerce Experience
                </h1>
                <p className={`animate-fade-in-up delay-1 ${styles.heroSubtitle}`}>
                    Discover the latest trends in fashion and technology. Shop with
                    confidence and experience seamless checkout.
                </p>
                <div className={`animate-fade-in-up delay-2 ${styles.heroActions}`}>
                    <a href="#products" className="btn btn-primary">Shop Now</a>
                    <a href="#features" className={`btn btn-outline ${styles.btnOutlineHero}`}>Learn More</a>
                </div>
            </div>
        </section>
    );
}
