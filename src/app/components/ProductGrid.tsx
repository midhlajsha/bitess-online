import React from 'react';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
}

const mockProducts: Product[] = [
    { id: '1', name: 'Premium Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 40-hour battery life.', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', rating: 4.5 },
    { id: '2', name: 'Minimalist Smartwatch', description: 'Sleek design with health tracking and OLED display.', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', rating: 4.2 },
    { id: '3', name: 'Ergonomic Keyboard', description: 'Tactile switches and wrist rest for the ultimate typing experience.', price: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', rating: 4.8 },
    { id: '4', name: 'Ultralight Gaming Mouse', description: 'Precision 20K DPI sensor with customizable RGB lighting.', price: 89.99, image: 'https://images.unsplash.com/photo-1527814050087-379381547969?w=800&q=80', rating: 4.4 },
    { id: '5', name: '4K Creator Monitor', description: '27-inch color-accurate display with USB-C hub.', price: 499.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', rating: 4.6 },
    { id: '6', name: 'Acoustic Desk Speakers', description: 'Studio-quality sound in a compact bookshelf design.', price: 129.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', rating: 4.3 }
];

export default function ProductGrid() {
    return (
        <section id="products" className={styles.productSection}>
            <div className="container">
                <h2 className={styles.title}>Results</h2>
                <p className={styles.subtitle}>Check each product page for other buying options.</p>
                <div className={styles.grid}>
                    {mockProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
