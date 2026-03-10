/**
 * NelShop - Product Sync System
 * localStorage-driven product catalog with Brand Owner add & Admin approval
 */

const PRODUCT_SYNC_KEY = 'nelshop_products';

const DEFAULT_MOCK_PRODUCTS = [
  { id: 'mock-1', name: 'Wireless Bluetooth Earbuds', price: 25000, category: 'electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&h=600&fit=crop', status: 'approved', stock: 15, rating: 4.8, reviewsCount: 124 },
  { id: 'mock-2', name: "Men's Casual Shirt", price: 8500, category: 'fashion', brand: 'Delta Threads', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop', status: 'approved', stock: 8, rating: 4.6, reviewsCount: 89 },
  { id: 'mock-3', name: 'Fresh Farm Vegetables Pack', price: 3500, category: 'groceries', brand: 'Asaba Fresh', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop', status: 'approved', stock: 25, rating: 4.9, reviewsCount: 256 },
  { id: 'mock-4', name: 'Ofada Rice (5kg)', price: 4200, category: 'local', brand: 'Delta Gold', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', status: 'approved', stock: 12, rating: 4.7, reviewsCount: 312 },
];

function getProducts() {
  try {
    const raw = localStorage.getItem(PRODUCT_SYNC_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setProducts(DEFAULT_MOCK_PRODUCTS);
      return DEFAULT_MOCK_PRODUCTS;
    }
    return parsed;
  } catch {
    setProducts(DEFAULT_MOCK_PRODUCTS);
    return DEFAULT_MOCK_PRODUCTS;
  }
}

function setProducts(products) {
  localStorage.setItem(PRODUCT_SYNC_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  const id = 'p' + Date.now();
  const newProduct = {
    id,
    name: product.name,
    price: Number(product.price) || 0,
    category: product.category || 'electronics',
    brand: product.brand || 'NelShop',
    image: product.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop',
    status: 'pending',
    stock: product.stock ?? 10,
    rating: 4.5,
    reviewsCount: 0,
    description: product.description || product.name,
    condition: 'New',
    asabaExpress: true,
  };
  products.push(newProduct);
  setProducts(products);
  return newProduct;
}

function approveProduct(id) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products[idx].status = 'approved';
    setProducts(products);
    return true;
  }
  return false;
}

function getApprovedProducts() {
  return getProducts().filter((p) => p.status === 'approved');
}

function getPendingProducts() {
  return getProducts().filter((p) => p.status === 'pending');
}

function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

window.NelShopSync = {
  getProducts,
  setProducts,
  addProduct,
  approveProduct,
  getApprovedProducts,
  getPendingProducts,
  getProductById,
  DEFAULT_MOCK_PRODUCTS,
};
