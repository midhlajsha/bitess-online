import './globals.css';
import { Outfit } from 'next/font/google';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Cart from './components/Cart';
import Footer from './components/Footer';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Bitess - Online Shopping for Electronics, Fashion, Home & More',
  description: 'Bitess.online offers a wide selection of premium products with fast delivery and great deals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <CartProvider>
          <Header />
          <Cart />
          <main style={{ marginTop: '0', backgroundColor: '#eaeded' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

