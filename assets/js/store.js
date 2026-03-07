/**
 * NelShop Store - Centralized State, Filtering & localStorage Sync
 * Shared across index.html, product-details.html, category.html, checkout.html
 * @version 2.0.0
 */

const STORAGE_KEYS = {
  cart: 'nelshop_cart',
  wishlist: 'nelshop_wishlist',
};

// ========== UTILITIES ==========

/** Naira formatter using Intl.NumberFormat */
const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

/** Parse URL params (works with ?id=101 or ?category=electronics) */
const getUrlParams = () => new URLSearchParams(window.location.search);

// ========== PRODUCT CATALOG ==========

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Earbuds',
    price: 25000,
    originalPrice: 29500,
    category: 'electronics',
    brand: 'SoundMax',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop',
    ],
    stock: 15,
    badge: 'Best Seller',
    specs: { 'Driver': '10mm', 'Battery': '24hrs', 'Connectivity': 'Bluetooth 5.2', 'Weight': '45g' },
    description: 'Premium wireless earbuds with active noise cancellation. Perfect for commuters in Asaba.',
  },
  {
    id: 'p2',
    name: "Men's Casual Shirt",
    price: 8500,
    originalPrice: 10000,
    category: 'fashion',
    brand: 'Delta Threads',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
    ],
    stock: 8,
    badge: null,
    specs: { 'Material': 'Cotton', 'Fit': 'Regular', 'Care': 'Machine washable' },
    description: 'Comfortable cotton shirt ideal for the Asaba climate.',
  },
  {
    id: 'p3',
    name: 'Fresh Farm Vegetables Pack',
    price: 3500,
    originalPrice: 3500,
    category: 'groceries',
    brand: 'Asaba Fresh',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=800&fit=crop'],
    stock: 25,
    badge: 'Same-Day',
    specs: { 'Contents': 'Tomatoes, Pepper, Onions', 'Origin': 'Local farms', 'Shelf Life': '5-7 days' },
    description: 'Farm-fresh vegetables sourced from Delta State farms.',
  },
  {
    id: 'p4',
    name: 'Ofada Rice (5kg)',
    price: 4200,
    originalPrice: 5000,
    category: 'local',
    brand: 'Delta Gold',
    condition: 'New',
    asabaExpress: false,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop'],
    stock: 12,
    badge: 'Local Favorite',
    specs: { 'Weight': '5kg', 'Type': 'Unpolished', 'Origin': 'South-West Nigeria' },
    description: 'Authentic Ofada rice, a local favorite across Asaba.',
  },
  {
    id: 'p5',
    name: 'Smartphone Power Bank 20000mAh',
    price: 18500,
    originalPrice: 22000,
    category: 'electronics',
    brand: 'PowerUp',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&h=800&fit=crop',
    ],
    stock: 6,
    badge: 'Flash Sale',
    specs: { 'Capacity': '20000mAh', 'Output': '18W Fast Charge', 'Ports': '2x USB-A, 1x USB-C' },
    description: 'High-capacity power bank for all-day charging.',
  },
  {
    id: 'p6',
    name: 'Ankara Fabric (6 yards)',
    price: 12000,
    originalPrice: 14000,
    category: 'fashion',
    brand: 'Vlisco',
    condition: 'New',
    asabaExpress: false,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=800&fit=crop'],
    stock: 20,
    badge: null,
    specs: { 'Length': '6 yards', 'Width': '44 inches', 'Material': 'Cotton blend' },
    description: 'Vibrant Ankara fabric for traditional and modern wear.',
  },
  {
    id: 'p7',
    name: 'Palm Wine (1.5L)',
    price: 2800,
    originalPrice: 2800,
    category: 'local',
    brand: 'Delta Palm',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=800&fit=crop'],
    stock: 10,
    badge: 'Local Specialty',
    specs: { 'Volume': '1.5L', 'Type': 'Fresh', 'Origin': 'Delta State' },
    description: 'Fresh palm wine from local tappers in Delta.',
  },
  {
    id: 'p8',
    name: 'Breakfast Cereal Pack',
    price: 4500,
    originalPrice: 5300,
    category: 'groceries',
    brand: 'Kellogg\'s',
    condition: 'New',
    asabaExpress: true,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=800&fit=crop'],
    stock: 18,
    badge: null,
    specs: { 'Net Weight': '500g', 'Flavor': 'Corn Flakes', 'Serving': '12 servings' },
    description: 'Classic breakfast cereal for the whole family.',
  },
];

// ========== STATE & PERSISTENCE ==========

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '{}');
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
}

function setWishlist(ids) {
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(ids));
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(productId);
  setWishlist(list);
  return list.includes(productId);
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

// ========== PRODUCT HELPERS ==========

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function getRelatedProducts(productId, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];
  return PRODUCTS.filter((p) => p.id !== productId && p.category === product.category).slice(0, limit);
}

function getDiscountPercent(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

// ========== FILTERING ==========

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', slug: 'electronics' },
  { id: 'fashion', label: 'Fashion', slug: 'fashion' },
  { id: 'groceries', label: 'Groceries', slug: 'groceries' },
  { id: 'local', label: 'Local Specialties', slug: 'local' },
];

const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
const CONDITIONS = ['New', 'Refurbished', 'Pre-owned'];

function filterProducts(options = {}) {
  const {
    category,
    minPrice = 0,
    maxPrice = Infinity,
    brands = [],
    conditions = [],
    asabaExpressOnly = false,
    searchQuery = '',
  } = options;

  return PRODUCTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (brands.length && !brands.includes(p.brand)) return false;
    if (conditions.length && !conditions.includes(p.condition)) return false;
    if (asabaExpressOnly && !p.asabaExpress) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.brand?.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function searchProducts(query, limit = 8) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, limit);
}

// ========== EXPORTS (global for vanilla JS) ==========

window.NelShop = {
  PRODUCTS,
  CATEGORIES,
  BRANDS,
  CONDITIONS,
  formatNaira,
  getUrlParams,
  getCart,
  setCart,
  getWishlist,
  setWishlist,
  toggleWishlist,
  isInWishlist,
  getProductById,
  getRelatedProducts,
  getDiscountPercent,
  filterProducts,
  searchProducts,
};
