/**
 * AURA Storefront ES6+ Application Client
 * Interacts with backend REST API on /api
 */

// Application State
const state = {
  products: [],
  filteredProducts: [],
  cart: [],
  wishlist: [],
  orders: [],
  activeCategory: 'All',
  searchQuery: '',
  maxPrice: 500,
  minRating: 0,
  featuredOnly: false,
  sortBy: 'featured',
  activeCoupon: null,
  checkoutStep: 1,
  modalProductQty: 1,
  currentModalProduct: null,
  theme: localStorage.getItem('aura_theme') || 'dark'
};

// API Base URL
const API_BASE = '/api';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchProducts();
  fetchCart();
  fetchWishlist();
  fetchOrdersCount();
  setupEventListeners();
});

// Theme Management
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('aura_theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
  showToast(`Switched to ${state.theme} mode`, 'info');
}

function updateThemeIcon() {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = state.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

// REST API Service Layer
async function fetchProducts() {
  try {
    const params = new URLSearchParams();
    if (state.activeCategory !== 'All') params.append('category', state.activeCategory);
    if (state.searchQuery) params.append('q', state.searchQuery);
    if (state.maxPrice < 500) params.append('maxPrice', state.maxPrice);
    if (state.sortBy) params.append('sortBy', state.sortBy);
    if (state.featuredOnly) params.append('featured', 'true');

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      state.products = data.data;
      applyClientFilters();
    }
  } catch (err) {
    showToast('Failed to load products from server', 'danger');
  }
}

function applyClientFilters() {
  let items = [...state.products];
  if (state.minRating > 0) {
    items = items.filter(p => p.rating >= state.minRating);
  }
  state.filteredProducts = items;
  renderProductsGrid();
}

async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart`);
    const data = await res.json();
    if (data.success) {
      state.cart = data.cart;
      renderCartDrawer();
      updateCartHeaderPill();
    }
  } catch (err) {
    console.error('Cart fetch error', err);
  }
}

async function addToCartAPI(productId, quantity = 1) {
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    const data = await res.json();
    if (data.success) {
      state.cart = data.cart;
      renderCartDrawer();
      updateCartHeaderPill();
      showToast('Item added to shopping cart!', 'success');
    }
  } catch (err) {
    showToast('Could not add item to cart', 'danger');
  }
}

async function updateCartQtyAPI(productId, quantity) {
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    if (data.success) {
      state.cart = data.cart;
      renderCartDrawer();
      updateCartHeaderPill();
    }
  } catch (err) {
    showToast('Failed to update item quantity', 'danger');
  }
}

async function removeFromCartAPI(productId) {
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      state.cart = data.cart;
      renderCartDrawer();
      updateCartHeaderPill();
      showToast('Item removed from cart', 'info');
    }
  } catch (err) {
    showToast('Failed to remove item', 'danger');
  }
}

async function clearCartAPI() {
  try {
    const res = await fetch(`${API_BASE}/cart/clear`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      state.cart = [];
      renderCartDrawer();
      updateCartHeaderPill();
      showToast('Cart cleared', 'info');
    }
  } catch (err) {
    console.error('Clear cart error', err);
  }
}

async function fetchWishlist() {
  try {
    const res = await fetch(`${API_BASE}/wishlist`);
    const data = await res.json();
    if (data.success) {
      state.wishlist = data.ids;
      updateWishlistBadge();
    }
  } catch (err) {
    console.error('Wishlist error', err);
  }
}

async function toggleWishlistAPI(productId) {
  try {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      const added = data.ids.includes(productId);
      state.wishlist = data.ids;
      updateWishlistBadge();
      renderProductsGrid();
      showToast(added ? 'Added to your Wishlist!' : 'Removed from Wishlist', added ? 'success' : 'info');
    }
  } catch (err) {
    showToast('Wishlist operation failed', 'danger');
  }
}

async function fetchOrdersCount() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    if (data.success) {
      state.orders = data.data;
      const countBadge = document.getElementById('ordersCountBadge');
      if (countBadge) countBadge.textContent = state.orders.length;
    }
  } catch (err) {
    console.error('Orders fetch error', err);
  }
}

// UI Rendering Functions
function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('resultsCount');

  if (!grid) return;

  if (countEl) countEl.textContent = `Showing ${state.filteredProducts.length} Product${state.filteredProducts.length === 1 ? '' : 's'}`;

  if (state.filteredProducts.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  grid.innerHTML = state.filteredProducts.map(p => {
    const isWishlisted = state.wishlist.includes(p.id);
    const starHTML = generateStarRatingHTML(p.rating);

    return `
      <div class="product-card">
        <div class="card-media">
          <img src="${p.image}" alt="${p.title}" class="card-img" loading="lazy">
          <div class="card-tag-group">
            ${p.isNew ? '<span class="tag tag-new">New</span>' : ''}
            ${p.originalPrice ? '<span class="tag tag-discount">Sale</span>' : ''}
          </div>
          <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlistAPI('${p.id}')">
            <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="card-category">${p.category}</div>
          <h3 class="card-title">${p.title}</h3>
          <div class="card-rating">
            ${starHTML}
            <span>(${p.reviewCount})</span>
          </div>
          <div class="card-price-row">
            <span class="price-current">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="price-old">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openQuickView('${p.id}')"><i class="fa-solid fa-eye"></i> View</button>
            <button class="btn btn-primary btn-sm flex-1" onclick="addToCartAPI('${p.id}', 1)"><i class="fa-solid fa-cart-plus"></i> Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function generateStarRatingHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<i class="fa-solid fa-star text-warning"></i>';
    } else if (i - 0.5 <= rating) {
      html += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
    } else {
      html += '<i class="fa-regular fa-star text-muted"></i>';
    }
  }
  return html;
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsContainer');
  const countBadge = document.getElementById('cartDrawerCount');
  if (!container) return;

  const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  if (countBadge) countBadge.textContent = totalItems;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 3rem 1rem;">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h4>Your Cart is Empty</h4>
        <p class="text-muted" style="font-size: 0.9rem;">Explore our store catalog and discover premium gear.</p>
      </div>
    `;
    updateCartSummary(0);
    return;
  }

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQtyAPI('${item.productId}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQtyAPI('${item.productId}', ${item.quantity + 1})">+</button>
          <button class="btn-text" style="margin-left: auto;" onclick="removeFromCartAPI('${item.productId}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  updateCartSummary(subtotal);
}

function updateCartSummary(subtotal) {
  const subtotalEl = document.getElementById('summarySubtotal');
  const discountRow = document.getElementById('summaryDiscountRow');
  const discountEl = document.getElementById('summaryDiscount');
  const totalEl = document.getElementById('summaryTotal');

  let discount = 0;
  if (state.activeCoupon) {
    if (state.activeCoupon.discountPercent) {
      discount = (subtotal * state.activeCoupon.discountPercent) / 100;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountRow) {
    if (discount > 0) {
      discountRow.classList.remove('hidden');
      if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }
  if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

function updateCartHeaderPill() {
  const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const badge = document.getElementById('cartBadge');
  const totalPill = document.getElementById('cartHeaderTotal');

  if (badge) badge.textContent = totalItems;
  if (totalPill) totalPill.textContent = `$${subtotal.toFixed(2)}`;
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) badge.textContent = state.wishlist.length;
}

// Quick View Modal
function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.currentModalProduct = product;
  state.modalProductQty = 1;

  document.getElementById('modalProductImg').src = product.image;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalTitle').textContent = product.title;
  document.getElementById('modalRatingStars').innerHTML = generateStarRatingHTML(product.rating);
  document.getElementById('modalRatingText').textContent = `${product.rating} (${product.reviewCount} reviews)`;
  document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('modalOriginalPrice').textContent = product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : '';
  document.getElementById('modalDescription').textContent = product.description;
  document.getElementById('modalQtyInput').value = 1;

  const specsContainer = document.getElementById('modalSpecs');
  if (specsContainer && product.features) {
    specsContainer.innerHTML = product.features.map(f => `<span class="badge-tag" style="background: var(--bg-glass); margin-right: 4px;"><i class="fa-solid fa-check text-success"></i> ${f}</span>`).join('');
  }

  const addBtn = document.getElementById('modalAddToCartBtn');
  addBtn.onclick = () => {
    addToCartAPI(product.id, state.modalProductQty);
    closeQuickViewModal();
  };

  document.getElementById('quickViewModal').classList.remove('hidden');
}

function closeQuickViewModal() {
  document.getElementById('quickViewModal').classList.add('hidden');
}

function adjustModalQty(delta) {
  state.modalProductQty = Math.max(1, Math.min(10, state.modalProductQty + delta));
  document.getElementById('modalQtyInput').value = state.modalProductQty;
}

// Checkout Modal & Flow
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }
  toggleCartDrawer(false);
  goToStep(1);
  document.getElementById('checkoutModal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.add('hidden');
}

function goToStep(step) {
  state.checkoutStep = step;
  
  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`stepIndicator${i}`);
    if (el) {
      if (i <= step) el.classList.add('active');
      else el.classList.remove('active');
    }
  }

  // Toggle form steps
  document.getElementById('shippingForm').classList.toggle('hidden', step !== 1);
  document.getElementById('paymentForm').classList.toggle('hidden', step !== 2);
  document.getElementById('confirmationStep').classList.toggle('hidden', step !== 3);

  if (step === 2) {
    calculateCheckoutTotals();
  }
}

function calculateCheckoutTotals() {
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discount = 0;
  let freeShipping = false;

  if (state.activeCoupon) {
    if (state.activeCoupon.discountPercent) {
      discount = (subtotal * state.activeCoupon.discountPercent) / 100;
    }
    if (state.activeCoupon.freeShipping) freeShipping = true;
  }

  const shipping = (subtotal > 200 || freeShipping) ? 0 : 15.00;
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * 0.08;
  const total = taxable + shipping + tax;

  document.getElementById('chkSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('chkDiscount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('chkTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('chkShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('chkTotal').textContent = `$${total.toFixed(2)}`;
}

async function handleOrderSubmission(e) {
  e.preventDefault();

  const name = document.getElementById('shipName').value;
  const address = document.getElementById('shipAddress').value;
  const city = document.getElementById('shipCity').value;
  const zip = document.getElementById('shipZip').value;
  const email = document.getElementById('shipEmail').value;

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingAddress: { fullName: name, addressLine: address, city, zip, email },
        paymentMethod: 'Credit Card (Simulated)',
        couponCode: state.activeCoupon ? state.activeCoupon.code : null
      })
    });

    const data = await res.json();
    if (data.success) {
      const order = data.order;
      
      document.getElementById('recOrderId').textContent = `#${order.id}`;
      document.getElementById('recDate').textContent = new Date(order.createdAt).toLocaleDateString();
      document.getElementById('recAddress').textContent = `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}`;
      document.getElementById('recPayment').textContent = order.paymentMethod;
      document.getElementById('recTotal').textContent = `$${order.total.toFixed(2)}`;

      const itemsList = document.getElementById('recItemsList');
      if (itemsList) {
        itemsList.innerHTML = order.items.map(item => `
          <div class="receipt-row">
            <span>${item.quantity}x ${item.title}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('');
      }

      state.cart = [];
      updateCartHeaderPill();
      renderCartDrawer();
      fetchOrdersCount();
      goToStep(3);
      showToast('Order placed successfully!', 'success');
    } else {
      showToast(data.error || 'Order placement failed', 'danger');
    }
  } catch (err) {
    showToast('Network error during checkout', 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order & Pay';
  }
}

// Coupon Handling
async function applyPromoCode(code) {
  try {
    const res = await fetch(`${API_BASE}/coupons/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.success) {
      state.activeCoupon = data.coupon;
      const statusEl = document.getElementById('couponStatus');
      if (statusEl) {
        statusEl.className = 'coupon-status text-success';
        statusEl.textContent = `Coupon Applied: ${data.coupon.description}`;
        statusEl.classList.remove('hidden');
      }
      renderCartDrawer();
      showToast(`Promo ${data.coupon.code} applied!`, 'success');
    } else {
      showToast('Invalid coupon code', 'warning');
    }
  } catch (err) {
    showToast('Failed to apply coupon', 'danger');
  }
}

// Orders History Modal
async function openOrdersModal() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    if (data.success) {
      state.orders = data.data;
      renderOrdersModal();
      document.getElementById('ordersModal').classList.remove('hidden');
    }
  } catch (err) {
    showToast('Could not fetch past orders', 'danger');
  }
}

function closeOrdersModal() {
  document.getElementById('ordersModal').classList.add('hidden');
}

function renderOrdersModal() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  if (state.orders.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 2rem;">
        <i class="fa-solid fa-box" style="font-size: 2.5rem; color: var(--text-muted);"></i>
        <p class="text-muted" style="margin-top: 0.5rem;">No past orders found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.orders.map(order => `
    <div style="background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <strong style="color: var(--accent-primary);">${order.id}</strong>
        <span class="badge badge-accent">${order.status}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
        Placed on ${new Date(order.createdAt).toLocaleString()}
      </div>
      <div style="border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem;">
        ${order.items.map(i => `<div style="font-size: 0.9rem;">${i.quantity}x ${i.title} - $${(i.price * i.quantity).toFixed(2)}</div>`).join('')}
      </div>
      <div style="margin-top: 0.5rem; font-weight: 700; text-align: right;">
        Total: $${order.total.toFixed(2)}
      </div>
    </div>
  `).join('');
}

// Drawer Toggle
function toggleCartDrawer(open) {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (open) {
    overlay.classList.remove('hidden');
    drawer.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
    drawer.classList.add('hidden');
  }
}

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-solid fa-circle-check text-success',
    danger: 'fa-solid fa-circle-exclamation text-danger',
    warning: 'fa-solid fa-triangle-exclamation text-warning',
    info: 'fa-solid fa-circle-info text-accent'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Reset Filters
function resetAllFilters() {
  state.activeCategory = 'All';
  state.searchQuery = '';
  state.maxPrice = 500;
  state.minRating = 0;
  state.featuredOnly = false;
  state.sortBy = 'featured';

  document.getElementById('searchInput').value = '';
  document.getElementById('priceRange').value = 500;
  document.getElementById('priceDisplay').textContent = '$500';
  document.getElementById('sortSelect').value = 'featured';
  document.getElementById('featuredOnlyCheck').checked = false;

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === 'All');
  });

  fetchProducts();
}

// Event Listeners Setup
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  // Cart Drawer
  document.getElementById('cartBtn')?.addEventListener('click', () => toggleCartDrawer(true));
  document.getElementById('closeCartBtn')?.addEventListener('click', () => toggleCartDrawer(false));
  document.getElementById('cartOverlay')?.addEventListener('click', () => toggleCartDrawer(false));
  document.getElementById('clearCartBtn')?.addEventListener('click', clearCartAPI);

  // Category Pills
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      fetchProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      fetchProducts();
    });
  }

  // Price slider
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      state.maxPrice = parseFloat(e.target.value);
      document.getElementById('priceDisplay').textContent = `$${state.maxPrice}`;
      fetchProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      fetchProducts();
    });
  }

  // Featured Checkbox
  document.getElementById('featuredOnlyCheck')?.addEventListener('change', (e) => {
    state.featuredOnly = e.target.checked;
    fetchProducts();
  });

  // Coupon application
  document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
    const code = document.getElementById('couponInput')?.value.trim();
    if (code) applyPromoCode(code);
  });

  // Checkout Modal
  document.getElementById('proceedCheckoutBtn')?.addEventListener('click', openCheckoutModal);
  
  // Shipping Form Submit
  document.getElementById('shippingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    goToStep(2);
  });

  // Payment Form Submit (Order Place)
  document.getElementById('paymentForm')?.addEventListener('submit', handleOrderSubmission);

  // Orders Modal
  document.getElementById('openOrdersBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openOrdersModal();
  });

  // Reset Filters button
  document.getElementById('resetFiltersBtn')?.addEventListener('click', resetAllFilters);
}
