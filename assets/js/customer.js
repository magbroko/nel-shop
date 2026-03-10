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

  function getStatusClass(status) {
    switch (status) {
      case 'Processing': return 'status-glow-amber';
      case 'Shipped': return 'status-glow-cyan';
      case 'Delivered': return 'status-glow-emerald';
      default: return 'status-glow-slate';
    }
  }

  function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;

    container.innerHTML = DEMO_ORDERS.map(
      (o) => `
      <div class="order-card order-card-glass rounded-xl border border-white/10 p-4 md:p-6 hover:border-white/15 transition-all duration-300">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="order-card-image w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
            <img src="${o.image}" alt="${o.productName}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-100">${o.productName}</h3>
            <p class="text-slate-400 text-sm mt-0.5">${o.brand}</p>
            <div class="flex flex-wrap items-center gap-3 mt-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusClass(o.status)}">${o.status}</span>
              <span class="text-lg font-bold font-mono text-slate-100">${formatNaira(o.total)}</span>
            </div>
            <button type="button" class="view-details-link mt-3 inline-block text-sm font-medium text-amber-400/90 hover:text-amber-300 transition-all duration-150">
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
        <div class="col-span-full bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
          <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <p class="text-slate-400 text-lg">Your wishlist is empty</p>
          <a href="../index.html" class="inline-block mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all duration-200 hover:scale-[1.02]">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products
      .map(
        (p) => `
      <div class="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
        <div class="aspect-square order-card-image">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
          <h3 class="font-medium text-slate-100 line-clamp-2">${p.name}</h3>
          <p class="text-indigo-400 font-bold font-mono mt-1">${formatNaira(p.price)}</p>
          <a href="../product-details.html?id=${p.id}" class="mt-2 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all duration-200 hover:scale-[1.02]">View Product</a>
        </div>
      </div>
    `
      )
      .join('');
  }

  function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.view-panel');

    function setActiveLink(activeLink) {
      links.forEach((l) => {
        l.classList.remove('nav-link-active', 'text-white');
        l.classList.add('text-slate-400');
        const indicator = l.querySelector('.nav-indicator');
        if (indicator) indicator.remove();
      });
      activeLink.classList.add('nav-link-active', 'text-white');
      activeLink.classList.remove('text-slate-400');
      if (!activeLink.querySelector('.nav-indicator')) {
        const bar = document.createElement('span');
        bar.className = 'nav-indicator absolute left-0 top-0 bottom-0 w-1 rounded-r';
        activeLink.insertBefore(bar, activeLink.firstChild);
      }
    }

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (!view) return;

        setActiveLink(link);

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
        result.innerHTML = '<p class="text-amber-400">Please enter a tracking number.</p>';
        result.classList.remove('hidden');
        return;
      }
      result.innerHTML = `
        <div class="border-l-4 border-indigo-500 pl-4 py-2">
          <p class="font-medium text-slate-100">Order ${num}</p>
          <p class="text-slate-400 text-sm mt-1">Status: In transit to Asaba</p>
          <p class="text-slate-500 text-sm">Estimated delivery: Tomorrow</p>
        </div>
      `;
      result.classList.remove('hidden');
    });
  }

  function initCursorSpotlight() {
    const container = document.getElementById('customerGlassContainer');
    const spotlight = document.getElementById('cursorSpotlight');
    if (!container || !spotlight) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, rgba(99, 102, 241, 0.12), transparent 70%)`;
    });
    container.addEventListener('mouseleave', () => {
      spotlight.style.background = 'transparent';
    });
  }

  function initThemeToggle() {
    const STORAGE_KEY = 'nelshop-customer-theme';
    const html = document.documentElement;
    const toggleBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');

    function setTheme(isLight) {
      html.classList.add('theme-transition');
      if (isLight) {
        html.classList.remove('dark');
        html.classList.add('light');
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
      }
      try {
        localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
      } catch (_) {}
      setTimeout(() => html.classList.remove('theme-transition'), 350);
    }

    function toggleTheme() {
      const isLight = html.classList.contains('light');
      setTheme(!isLight);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light') {
      setTheme(true);
    }

    toggleBtns.forEach((btn) => btn?.addEventListener('click', toggleTheme));
  }

  function init() {
    renderOrders();
    renderWishlist();
    initNavigation();
    initSidebar();
    initTrack();
    initCursorSpotlight();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
