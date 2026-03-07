/**
 * Category Page - Dynamic filtering, product grid
 */

(function () {
  const params = NelShop.getUrlParams();
  const category = params.get('category') || '';

  const catInfo = NelShop.CATEGORIES.find((c) => c.id === category || c.slug === category);
  const categoryTitle = document.getElementById('categoryTitle');
  categoryTitle.textContent = catInfo ? catInfo.label : 'All Products';

  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  // Filter inputs
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const priceMinDisplay = document.getElementById('priceMinDisplay');
  const priceMaxDisplay = document.getElementById('priceMaxDisplay');
  const brandFilters = document.getElementById('brandFilters');
  const conditionFilters = document.getElementById('conditionFilters');
  const asabaExpressFilter = document.getElementById('asabaExpressFilter');
  const clearFilters = document.getElementById('clearFilters');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Elite product card HTML
  function renderProductCard(p) {
    const discount = NelShop.getDiscountPercent(p);
    const inWishlist = NelShop.isInWishlist(p.id);
    const stockClass = p.stock <= 3 ? 'bg-red-100 text-red-700' : p.stock <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
    const stockText = p.stock <= 3 ? 'Low Stock' : p.stock <= 10 ? `${p.stock} left` : 'In Stock';
    return `
      <article class="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out">
        <a href="product-details.html?id=${p.id}" class="block shrink-0">
          <div class="relative aspect-[4/5] overflow-hidden bg-slate-100">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out">
            ${p.badge ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-accent text-white text-xs font-medium">${p.badge}</span>` : ''}
            <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              ${discount > 0 ? `<span class="px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-medium whitespace-nowrap">Save ${discount}%</span>` : ''}
              <span class="px-2 py-0.5 rounded-lg ${stockClass} text-[11px] font-medium whitespace-nowrap">${stockText}</span>
            </div>
            <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-charcoal-900/20">
              <a href="product-details.html?id=${p.id}" class="quick-view-btn w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors" title="Quick View" onclick="event.preventDefault(); window.location.href='product-details.html?id=${p.id}'">
                <svg class="w-5 h-5 text-charcoal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </a>
              <button type="button" class="wishlist-btn w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors" data-id="${p.id}" title="Wishlist">
                <svg class="w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal-700'}" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
            </div>
          </div>
        </a>
        <div class="flex-1 flex flex-col p-4">
          <div class="flex-1">
            <div class="relative">
              <p class="text-xl font-bold text-accent bg-white/80 backdrop-blur rounded-lg px-2 py-1 inline-block">${NelShop.formatNaira(p.price)}</p>
            </div>
            <h3 class="font-medium text-charcoal-900 line-clamp-2 min-h-[2.5rem] mt-2">${p.name}</h3>
          </div>
          <button type="button" class="add-to-cart w-full mt-3 py-2.5 rounded-xl bg-charcoal-900 text-white text-sm font-medium hover:bg-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0" data-id="${p.id}">Add to Cart</button>
        </div>
      </article>
    `;
  }

  function getFilterState() {
    const brands = [];
    brandFilters.querySelectorAll('input:checked').forEach((cb) => brands.push(cb.value));
    const conditions = [];
    conditionFilters.querySelectorAll('input:checked').forEach((cb) => conditions.push(cb.value));
    return {
      category: category || undefined,
      minPrice: parseInt(priceMin.value, 10),
      maxPrice: parseInt(priceMax.value, 10),
      brands,
      conditions,
      asabaExpressOnly: asabaExpressFilter.checked,
    };
  }

  function applyFilters() {
    const state = getFilterState();
    const products = NelShop.filterProducts(state);
    resultsCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
    noResults.classList.toggle('hidden', products.length > 0);
    productGrid.classList.toggle('hidden', products.length === 0);
    productGrid.innerHTML = products.map(renderProductCard).join('');

    // Attach handlers
    productGrid.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        const cart = NelShop.getCart();
        cart[id] = (cart[id] || 0) + 1;
        NelShop.setCart(cart);
        updateCartBadge();
      });
    });
    productGrid.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        NelShop.toggleWishlist(btn.dataset.id);
        render();
      });
    });
  }

  function render() {
    applyFilters();
  }

  function updatePriceDisplay() {
    priceMinDisplay.textContent = NelShop.formatNaira(parseInt(priceMin.value, 10));
    priceMaxDisplay.textContent = NelShop.formatNaira(parseInt(priceMax.value, 10));
  }

  function updateCartBadge() {
    const badge = document.querySelector('.cart-count-badge');
    if (badge) {
      const count = Object.values(NelShop.getCart()).reduce((s, q) => s + q, 0);
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }

  // Brand checkboxes
  const brandsInCategory = category
    ? [...new Set(NelShop.filterProducts({ category }).map((p) => p.brand))].filter(Boolean).sort()
    : NelShop.BRANDS;
  brandFilters.innerHTML = brandsInCategory
    .map((b) => `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" value="${b}" class="brand-cb rounded accent-accent"><span class="text-sm">${b}</span></label>`)
    .join('');

  // Condition checkboxes
  conditionFilters.innerHTML = NelShop.CONDITIONS.map(
    (c) => `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" value="${c}" class="condition-cb rounded accent-accent"><span class="text-sm">${c}</span></label>`
  ).join('');

  priceMin.addEventListener('input', () => {
    if (parseInt(priceMin.value, 10) > parseInt(priceMax.value, 10)) priceMax.value = priceMin.value;
    updatePriceDisplay();
    render();
  });
  priceMax.addEventListener('input', () => {
    if (parseInt(priceMax.value, 10) < parseInt(priceMin.value, 10)) priceMin.value = priceMax.value;
    updatePriceDisplay();
    render();
  });
  brandFilters.querySelectorAll('.brand-cb').forEach((cb) => cb.addEventListener('change', render));
  conditionFilters.querySelectorAll('.condition-cb').forEach((cb) => cb.addEventListener('change', render));
  asabaExpressFilter.addEventListener('change', render);

  clearFilters.addEventListener('click', () => {
    priceMin.value = 0;
    priceMax.value = 50000;
    updatePriceDisplay();
    brandFilters.querySelectorAll('input').forEach((i) => (i.checked = false));
    conditionFilters.querySelectorAll('input').forEach((i) => (i.checked = false));
    asabaExpressFilter.checked = false;
    render();
  });
  resetFiltersBtn?.addEventListener('click', () => clearFilters.click());

  updatePriceDisplay();
  render();
  updateCartBadge();
})();
