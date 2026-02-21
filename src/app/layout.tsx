import './globals.css';
import { Outfit } from 'next/font/google';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Cart from './components/Cart';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'ANTIX | Premium E-commerce',
  description: 'A stellar e-commerce experience',
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
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
