const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const CART_FILE = path.join(__dirname, 'cart.json');
const WISHLIST_FILE = path.join(__dirname, 'wishlist.json');

// Ensure database files exist
function initDB() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), 'utf8');
  }
  if (!fs.existsSync(CART_FILE)) {
    fs.writeFileSync(CART_FILE, JSON.stringify([]), 'utf8');
  }
  if (!fs.existsSync(WISHLIST_FILE)) {
    fs.writeFileSync(WISHLIST_FILE, JSON.stringify([]), 'utf8');
  }
}

function readJSON(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

initDB();

module.exports = {
  getProducts: () => readJSON(PRODUCTS_FILE),

  getProductById: (id) => {
    const products = readJSON(PRODUCTS_FILE);
    return products.find(p => p.id === id);
  },

  getCart: () => readJSON(CART_FILE),

  addToCart: (productId, quantity = 1) => {
    const products = readJSON(PRODUCTS_FILE);
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    const cart = readJSON(CART_FILE);
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    writeJSON(CART_FILE, cart);
    return cart;
  },

  updateCartQuantity: (productId, quantity) => {
    let cart = readJSON(CART_FILE);
    if (quantity <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
    }
    writeJSON(CART_FILE, cart);
    return cart;
  },

  removeFromCart: (productId) => {
    let cart = readJSON(CART_FILE);
    cart = cart.filter(item => item.productId !== productId);
    writeJSON(CART_FILE, cart);
    return cart;
  },

  clearCart: () => {
    writeJSON(CART_FILE, []);
    return [];
  },

  getWishlist: () => readJSON(WISHLIST_FILE),

  toggleWishlist: (productId) => {
    let wishlist = readJSON(WISHLIST_FILE);
    const exists = wishlist.includes(productId);
    if (exists) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    writeJSON(WISHLIST_FILE, wishlist);
    return wishlist;
  },

  createOrder: (orderData) => {
    const orders = readJSON(ORDERS_FILE);
    const products = readJSON(PRODUCTS_FILE);

    // Verify and adjust inventory
    orderData.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });

    writeJSON(PRODUCTS_FILE, products);

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'Credit Card (Simulated)',
      status: 'Processing'
    };

    orders.unshift(newOrder);
    writeJSON(ORDERS_FILE, orders);
    writeJSON(CART_FILE, []); // Clear cart after successful order

    return newOrder;
  },

  getOrders: () => readJSON(ORDERS_FILE),

  validateCoupon: (code) => {
    const coupons = {
      'AURA20': { code: 'AURA20', discountPercent: 20, description: '20% off total purchase' },
      'WELCOME10': { code: 'WELCOME10', discountPercent: 10, description: '10% off storewide' },
      'FREESHIP': { code: 'FREESHIP', freeShipping: true, description: 'Free Express Shipping' }
    };
    return coupons[code.toUpperCase()] || null;
  }
};
