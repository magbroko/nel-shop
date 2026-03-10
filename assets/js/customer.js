/**
 * NelShop - Customer Dashboard Logic
 * Shopper: My Orders, Wishlist, Track Shipment, Profile Settings
 */

(function () {
  const formatNaira = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const DEMO_ORDERS = [
    { id: 'ORD-1024', productId: 'p2', productName: "Men's Casual Shirt", brand: 'Delta Threads', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', status: 'Processing', total: 8500 },
    { id: 'ORD-1023', productId: 'p1', productName: 'Wireless Bluetooth Earbuds', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=200&h=200&fit=crop', status: 'Shipped', total: 25000 },
    { id: 'ORD-1022', productId: 'p3', productName: 'Fresh Farm Vegetables Pack', brand: 'Asaba Fresh', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop', status: 'Delivered', total: 3500 },
  ];

  function getStatusColor(status) {
    switch (status) {
      case 'Processing': return 'bg-amber-100 text-amber-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;

    container.innerHTML = DEMO_ORDERS.map(
      (o) => `
      <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
            <img src="${o.image}" alt="${o.productName}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-800">${o.productName}</h3>
            <p class="text-gray-500 text-sm mt-0.5">${o.brand}</p>
            <div class="flex flex-wrap items-center gap-3 mt-2">
              <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${getStatusColor(o.status)}">${o.status}</span>
              <span class="text-blue-600 font-semibold">${formatNaira(o.total)}</span>
            </div>
            <button type="button" class="mt-3 px-4 py-2 rounded-xl border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    `
    ).join('');
  }

  function renderWishlist() {
    const container = document.getElementById('wishlistContent');
    if (!container) return;

    const wishlist = typeof NelShop !== 'undefined' ? NelShop.getWishlist() : [];
    const products = wishlist
      .map((id) => {
        const p = NelShop?.getProductById(id);
        return p ? { ...p } : null;
      })
      .filter(Boolean);

    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <p class="text-gray-500 text-lg">Your wishlist is empty</p>
          <a href="../index.html" class="inline-block mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products
      .map(
        (p) => `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="aspect-square bg-gray-100">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-800 line-clamp-2">${p.name}</h3>
          <p class="text-blue-600 font-semibold mt-1">${formatNaira(p.price)}</p>
          <a href="../product-details.html?id=${p.id}" class="mt-2 inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">View Product</a>
        </div>
      </div>
    `
      )
      .join('');
  }

  function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.view-panel');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (!view) return;

        links.forEach((l) => {
          l.classList.remove('bg-blue-100', 'text-blue-700', 'font-medium');
          l.classList.add('text-gray-600');
        });
        link.classList.add('bg-blue-100', 'text-blue-700', 'font-medium');
        link.classList.remove('text-gray-600');

        panels.forEach((p) => {
          p.classList.add('hidden');
          if (p.id === `view-${view}`) p.classList.remove('hidden');
        });

        if (view === 'wishlist') renderWishlist();
      });
    });
  }

  function initSidebar() {
    const toggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('navOverlay');

    if (!toggle || !sidebar) return;

    function openNav() {
      sidebar.classList.remove('-translate-x-full');
      overlay?.classList.remove('opacity-0', 'pointer-events-none');
    }
    function closeNav() {
      sidebar.classList.add('-translate-x-full');
      overlay?.classList.add('opacity-0', 'pointer-events-none');
    }

    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('-translate-x-full')) openNav();
      else closeNav();
    });
    overlay?.addEventListener('click', closeNav);
  }

  function initTrack() {
    const btn = document.getElementById('trackBtn');
    const input = document.getElementById('trackingInput');
    const result = document.getElementById('trackResult');

    btn?.addEventListener('click', () => {
      const num = input?.value?.trim();
      if (!num) {
        result.innerHTML = '<p class="text-amber-600">Please enter a tracking number.</p>';
        result.classList.remove('hidden');
        return;
      }
      result.innerHTML = `
        <div class="border-l-4 border-blue-600 pl-4 py-2">
          <p class="font-medium text-gray-800">Order ${num}</p>
          <p class="text-gray-600 text-sm mt-1">Status: In transit to Asaba</p>
          <p class="text-gray-500 text-sm">Estimated delivery: Tomorrow</p>
        </div>
      `;
      result.classList.remove('hidden');
    });
  }

  function init() {
    renderOrders();
    renderWishlist();
    initNavigation();
    initSidebar();
    initTrack();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
