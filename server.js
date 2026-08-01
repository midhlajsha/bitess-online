const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'AURA E-Commerce Server' });
});

// Products endpoint with filtering, search, sorting
app.get('/api/products', (req, res) => {
  try {
    let products = db.getProducts();
    const { q, category, minPrice, maxPrice, sortBy, featured } = req.query;

    if (q) {
      const query = q.toLowerCase().trim();
      products = products.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          break;
      }
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single product endpoint
app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Categories summary endpoint
app.get('/api/categories', (req, res) => {
  const products = db.getProducts();
  const categoriesMap = {};
  products.forEach(p => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });

  const categories = Object.keys(categoriesMap).map(cat => ({
    name: cat,
    count: categoriesMap[cat]
  }));

  res.json({ success: true, data: categories });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  const cart = db.getCart();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  res.json({ success: true, cart, subtotal });
});

app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required' });
    }
    const cart = db.addToCart(productId, quantity || 1);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    res.json({ success: true, message: 'Added to cart', cart, subtotal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/cart/:productId', (req, res) => {
  const { quantity } = req.body;
  const cart = db.updateCartQuantity(req.params.productId, parseInt(quantity, 10));
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  res.json({ success: true, cart, subtotal });
});

app.delete('/api/cart/:productId', (req, res) => {
  const cart = db.removeFromCart(req.params.productId);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  res.json({ success: true, cart, subtotal });
});

app.post('/api/cart/clear', (req, res) => {
  const cart = db.clearCart();
  res.json({ success: true, cart, subtotal: 0 });
});

// Wishlist endpoints
app.get('/api/wishlist', (req, res) => {
  const wishlistIds = db.getWishlist();
  const allProducts = db.getProducts();
  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
  res.json({ success: true, ids: wishlistIds, products: wishlistProducts });
});

app.post('/api/wishlist/toggle', (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ success: false, error: 'productId required' });
  }
  const updatedWishlist = db.toggleWishlist(productId);
  res.json({ success: true, ids: updatedWishlist });
});

// Promo Coupon Endpoint
app.post('/api/coupons/apply', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'Coupon code required' });

  const coupon = db.validateCoupon(code);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
  }

  res.json({ success: true, coupon });
});

// Orders endpoints
app.get('/api/orders', (req, res) => {
  const orders = db.getOrders();
  res.json({ success: true, data: orders });
});

app.post('/api/orders', (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;
    const cart = db.getCart();

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, error: 'Cannot checkout with an empty cart' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city) {
      return res.status(400).json({ success: false, error: 'Please provide full shipping details' });
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let discount = 0;
    let freeShipping = false;
    if (couponCode) {
      const coupon = db.validateCoupon(couponCode);
      if (coupon) {
        if (coupon.discountPercent) {
          discount = (subtotal * coupon.discountPercent) / 100;
        }
        if (coupon.freeShipping) {
          freeShipping = true;
        }
      }
    }

    const shipping = (subtotal > 200 || freeShipping) ? 0 : 15.00;
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = taxableSubtotal * 0.08; // 8% estimated tax
    const total = taxableSubtotal + shipping + tax;

    const orderData = {
      items: cart,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod
    };

    const newOrder = db.createOrder(orderData);

    res.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to single page app index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 AURA E-Commerce Server running on port ${PORT}`);
  console.log(`🌐 Web App: http://localhost:${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api/products`);
  console.log(`=================================================`);
});
