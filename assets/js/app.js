/**
 * NelShop - Home Page Logic
 * Elite product cards, Mega Menu, real-time search, cart drawer, Quick View
 * @version 2.0.0
 */

(function () {
  const PRODUCTS = NelShop.PRODUCTS;

  // ========== DOM ELEMENTS ==========

  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItems = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCount = document.getElementById('cartCount');
  const cartFooter = document.getElementById('cartFooter');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  const mobileSearch = document.getElementById('mobileSearch');
  const productGrid = document.getElementById('productGrid');
  const newsletterForm = document.getElementById('newsletterForm');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchResultsContent = document.getElementById('searchResultsContent');
  const searchResultsCount = document.getElementById('searchResultsCount');
  const megaMenuTrigger = document.getElementById('megaMenuTrigger');
  const megaMenu = document.getElementById('megaMenu');
  const quickViewOverlay = document.getElementById('quickViewOverlay');
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewContent = document.getElementById('quickViewContent');
  const quickViewClose = document.getElementById('quickViewClose');

  // ========== CART STATE ==========

  function getCart() {
    return NelShop.getCart();
  }

  function setCart(cart) {
    NelShop.setCart(cart);
  }

  function getCartItemCount() {
    return Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
  }

  function addToCart(productId, quantity = 1) {
    const product = NelShop.getProductById(productId);
    if (!product) return;
    const cart = getCart();
    const currentQty = cart[productId] || 0;
    const newQty = Math.min(currentQty + quantity, product.stock);
    cart[productId] = newQty;
    if (newQty === 0) delete cart[productId];
    setCart(cart);
    renderCart();
    updateCartBadge();
  }

  function removeFromCart(productId) {
    const cart = getCart();
    delete cart[productId];
    setCart(cart);
    renderCart();
    updateCartBadge();
  }

  function updateCartQuantity(productId, quantity) {
    const product = NelShop.getProductById(productId);
    if (!product) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const cart = getCart();
    cart[productId] = Math.min(quantity, product.stock);
    setCart(cart);
    renderCart();
    updateCartBadge();
  }

  function getCartSubtotal() {
    return Object.entries(getCart()).reduce((total, [productId, qty]) => {
      const product = NelShop.getProductById(productId);
      return total + (product ? product.price * qty : 0);
    }, 0);
  }

  const CART_EMPTY_HTML = `
    <div class="text-center py-12 text-charcoal-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-charcoal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="font-medium">Your cart is empty</p>
      <p class="text-sm mt-1">Add items from our Asaba collection</p>
    </div>
  `;

  function renderCart() {
    const cart = getCart();
    const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

    if (entries.length === 0) {
      cartItems.innerHTML = CART_EMPTY_HTML;
      cartFooter.classList.add('hidden');
      cartSubtotal.textContent = NelShop.formatNaira(0);
      return;
    }

    cartFooter.classList.remove('hidden');
    cartItems.innerHTML = entries
      .map(([productId, qty]) => {
        const product = NelShop.getProductById(productId);
        if (!product) return '';
        const lineTotal = product.price * qty;
        return `
          <div class="flex gap-4 py-4 border-b border-slate-100 last:border-0" data-product-id="${product.id}">
            <div class="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-charcoal-900 truncate">${product.name}</h3>
              <p class="text-accent font-semibold mt-0.5">${NelShop.formatNaira(product.price)}</p>
              <div class="flex items-center gap-2 mt-2">
                <button type="button" class="cart-qty-minus w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-medium transition-colors" data-product-id="${product.id}">−</button>
                <span class="w-8 text-center text-sm font-medium">${qty}</span>
                <button type="button" class="cart-qty-plus w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-medium transition-colors" data-product-id="${product.id}">+</button>
                <button type="button" class="cart-remove ml-2 text-charcoal-400 hover:text-red-500 text-sm transition-colors" data-product-id="${product.id}">Remove</button>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-semibold text-charcoal-900">${NelShop.formatNaira(lineTotal)}</p>
            </div>
          </div>
        `;
      })
      .join('');

    cartSubtotal.textContent = NelShop.formatNaira(getCartSubtotal());

    cartItems.querySelectorAll('.cart-qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => updateCartQuantity(btn.dataset.productId, (getCart()[btn.dataset.productId] || 1) - 1));
    });
    cartItems.querySelectorAll('.cart-qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => updateCartQuantity(btn.dataset.productId, (getCart()[btn.dataset.productId] || 0) + 1));
    });
    cartItems.querySelectorAll('.cart-remove').forEach((btn) => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.productId));
    });
  }

  function updateCartBadge(animate = false) {
    const count = getCartItemCount();
    cartCount.textContent = count;
    cartCount.classList.toggle('hidden', count === 0);
    if (animate && cartCount) {
      cartCount.classList.add('cart-badge-pulse');
      setTimeout(() => cartCount.classList.remove('cart-badge-pulse'), 500);
    }
  }

  // ========== CART DRAWER UI ==========

  function openCart() {
    cartDrawer.classList.remove('translate-x-full');
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    cartToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    cartToggle?.setAttribute('aria-expanded', 'false');
  }

  function toggleCart() {
    const isOpen = !cartDrawer.classList.contains('translate-x-full');
    isOpen ? closeCart() : openCart();
  }

  function setAddToCartAddedState(btn) {
    const id = btn.dataset.id;
    btn.classList.add('add-to-cart-added');
    btn.classList.remove('bg-charcoal-900', 'hover:bg-accent');
    btn.classList.add('bg-green-600');
    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Added';
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('add-to-cart-added', 'bg-green-600');
      btn.classList.add('bg-charcoal-900', 'hover:bg-accent');
      btn.innerHTML = 'Add to Cart';
      btn.disabled = false;
    }, 2000);
  }

  // ========== ELITE PRODUCT CARD ==========

  function getStockIndicator(stock) {
    if (stock <= 3) return { class: 'bg-red-100 text-red-700', text: 'Low Stock' };
    if (stock <= 10) return { class: 'bg-amber-100 text-amber-700', text: `${stock} left` };
    return { class: 'bg-green-100 text-green-700', text: 'In Stock' };
  }

  function renderRatingStars(rating) {
    const r = Math.min(5, Math.max(0, rating || 0));
    const full = Math.floor(r);
    const half = r % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const starSvg = (filled) =>
      `<svg class="w-4 h-4 ${filled ? 'text-yellow-400' : 'text-slate-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    let html = '';
    for (let i = 0; i < full; i++) html += starSvg(true);
    if (half) html += starSvg(true);
    for (let i = 0; i < empty; i++) html += starSvg(false);
    return html;
  }

  function renderProductCard(product) {
    const stockInfo = getStockIndicator(product.stock);
    const discount = NelShop.getDiscountPercent(product);
    const inWishlist = NelShop.isInWishlist(product.id);
    const rating = product.rating ?? 4.5;
    const reviewsCount = product.reviewsCount ?? 0;
    return `
      <article class="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out" data-product-id="${product.id}">
        <a href="product-details.html?id=${product.id}" class="block relative aspect-[4/5] overflow-hidden bg-slate-100 shrink-0">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out">
          ${product.badge ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-accent text-white text-xs font-medium">${product.badge}</span>` : ''}
          <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            ${discount > 0 ? `<span class="px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-medium whitespace-nowrap">Save ${discount}%</span>` : ''}
            <span class="px-2 py-0.5 rounded-lg ${stockInfo.class} text-[11px] font-medium whitespace-nowrap">${stockInfo.text}</span>
          </div>
          <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-charcoal-900/20">
            <button type="button" class="quick-view-btn w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors" data-id="${product.id}" title="Quick View" aria-label="Quick view">
              <svg class="w-5 h-5 text-charcoal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            <button type="button" class="wishlist-btn w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors" data-id="${product.id}" title="Wishlist" aria-label="Add to wishlist">
              <svg class="w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal-700'}" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
          </div>
        </a>
        <div class="flex-1 flex flex-col p-4">
          <div class="flex-1">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="flex">${renderRatingStars(rating)}</span>
              <span class="text-sm text-charcoal-500">${rating}</span>
              <span class="text-xs text-charcoal-400">(${reviewsCount})</span>
            </div>
            <div class="relative">
              <p class="text-xl font-bold text-accent bg-white/80 backdrop-blur rounded-lg px-2 py-1 inline-block">${NelShop.formatNaira(product.price)}</p>
            </div>
            <h3 class="font-medium text-charcoal-900 line-clamp-2 min-h-[2.5rem] mt-2">${product.name}</h3>
          </div>
          <button type="button" class="add-to-cart w-full mt-3 py-2.5 rounded-xl bg-charcoal-900 text-white text-sm font-medium transition-all duration-500 shrink-0 flex items-center justify-center gap-2" data-id="${product.id}">Add to Cart</button>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map(renderProductCard).join('');

    productGrid.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.classList.contains('add-to-cart-added')) return;
        addToCart(btn.dataset.id);
        updateCartBadge(true);
        setAddToCartAddedState(btn);
      });
    });

    productGrid.querySelectorAll('.quick-view-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(btn.dataset.id);
      });
    });

    productGrid.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        NelShop.toggleWishlist(btn.dataset.id);
        renderProducts();
      });
    });
  }

  // ========== QUICK VIEW MODAL ==========

  function openQuickView(productId) {
    const product = NelShop.getProductById(productId);
    if (!product) return;
    quickViewContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <div class="aspect-[4/5] w-full md:w-1/2 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-charcoal-900">${product.name}</h3>
          <p class="text-accent font-semibold text-lg mt-2">${NelShop.formatNaira(product.price)}</p>
          <p class="text-charcoal-600 text-sm mt-2">${product.description || product.name}</p>
          <a href="product-details.html?id=${product.id}" class="inline-block mt-4 px-6 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors">View Full Details</a>
          <button type="button" class="add-quick-cart ml-3 px-6 py-2.5 rounded-xl bg-charcoal-900 text-white font-medium hover:bg-accent transition-colors" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    quickViewContent.querySelector('.add-quick-cart').addEventListener('click', () => {
      addToCart(product.id);
      updateCartBadge(true);
      closeQuickView();
    });
    quickViewOverlay.classList.remove('opacity-0', 'pointer-events-none');
    quickViewModal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    quickViewModal.classList.add('pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    quickViewOverlay.classList.add('opacity-0', 'pointer-events-none');
    quickViewModal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    quickViewModal.classList.remove('pointer-events-auto');
    document.body.style.overflow = '';
  }

  quickViewClose?.addEventListener('click', closeQuickView);
  quickViewOverlay?.addEventListener('click', closeQuickView);

  // ========== MEGA MENU ==========

  megaMenuTrigger?.addEventListener('mouseenter', () => {
    megaMenu?.classList.remove('hidden');
  });
  megaMenuTrigger?.addEventListener('mouseleave', () => {
    megaMenu?.classList.add('hidden');
  });

  // ========== REAL-TIME SEARCH ==========

  let searchTimeout;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = searchInput.value.trim();
    if (q.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }
    searchTimeout = setTimeout(() => {
      const results = NelShop.searchProducts(q, 8);
      if (results.length === 0) {
        searchResultsContent.innerHTML = '<p class="p-4 text-charcoal-500 text-sm">No products found.</p>';
      } else {
        searchResultsContent.innerHTML = results
          .map(
            (p) => `
          <a href="product-details.html?id=${p.id}" class="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-charcoal-900 truncate">${p.name}</p>
              <p class="text-accent font-semibold text-sm">${NelShop.formatNaira(p.price)}</p>
            </div>
          </a>
        `
          )
          .join('');
      }
      searchResultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
      searchResultsCount.classList.remove('hidden');
      searchResults.classList.remove('hidden');
    }, 200);
  });

  searchInput?.addEventListener('blur', () => {
    setTimeout(() => searchResults?.classList.add('hidden'), 150);
  });
  searchInput?.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) searchResults?.classList.remove('hidden');
  });

  // ========== MOBILE MENU ==========

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !isOpen);
    menuIcon.classList.toggle('hidden', isOpen);
    closeIcon.classList.toggle('hidden', !isOpen);
    mobileMenuToggle?.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function toggleMobileSearch() {
    mobileSearch?.classList.toggle('hidden');
    if (!mobileSearch?.classList.contains('hidden')) {
      mobileSearch.querySelector('input')?.focus();
    }
  }

  // ========== HERO BACKGROUND SLIDESHOW ==========

  function initHeroSlideshow() {
    const slides = document.querySelectorAll('[data-hero-slide]');
    if (slides.length === 0) return;
    let currentIndex = 0;
    const INTERVAL_MS = 7000;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === index);
        slide.classList.toggle('opacity-0', i !== index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      showSlide((currentIndex + 1) % slides.length);
    }

    showSlide(0);
    setInterval(nextSlide, INTERVAL_MS);
  }

  // ========== INIT ==========

  function init() {
    initHeroSlideshow();
    renderProducts();
    renderCart();
    updateCartBadge();

    cartToggle?.addEventListener('click', toggleCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
    mobileSearchToggle?.addEventListener('click', toggleMobileSearch);

    newsletterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      alert(`Thanks for subscribing! We'll send Asaba-exclusive deals to ${email}`);
      e.target.reset();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeQuickView();
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) toggleMobileMenu();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
