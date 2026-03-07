/**
 * Product Details Page - Gallery, specs, add to cart, wishlist, related items
 */

(function () {
  const params = NelShop.getUrlParams();
  const id = params.get('id');
  const product = NelShop.getProductById(id);

  const productNotFound = document.getElementById('productNotFound');
  const productContent = document.getElementById('productContent');

  if (!product) {
    productNotFound.classList.remove('hidden');
    return;
  }

  productContent.classList.remove('hidden');

  // Breadcrumb
  const catLabel = NelShop.CATEGORIES.find((c) => c.id === product.category)?.label || product.category;
  document.getElementById('breadcrumbCategory').href = `category.html?category=${product.category}`;
  document.getElementById('breadcrumbCategory').textContent = catLabel;
  document.getElementById('breadcrumbName').textContent = product.name;

  // Gallery
  const images = product.images || [product.image];
  const mainImg = document.getElementById('mainImage');
  mainImg.src = images[0];
  mainImg.alt = product.name;

  const strip = document.getElementById('thumbnailStrip');
  strip.innerHTML = images
    .map(
      (src, i) =>
        `<button type="button" class="thumbnail-btn shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
          i === 0 ? 'border-accent' : 'border-slate-200 hover:border-slate-300'
        }" data-index="${i}"><img src="${src}" alt="" class="w-full h-full object-cover"></button>`
    )
    .join('');

  strip.querySelectorAll('.thumbnail-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      mainImg.src = images[idx];
      strip.querySelectorAll('.thumbnail-btn').forEach((b) => b.classList.replace('border-accent', 'border-slate-200'));
      btn.classList.replace('border-slate-200', 'border-accent');
    });
  });

  // Badges
  if (product.badge) {
    const badge = document.getElementById('productBadge');
    badge.textContent = product.badge;
    badge.classList.remove('hidden');
  }
  const discount = NelShop.getDiscountPercent(product);
  if (discount > 0) {
    const discEl = document.getElementById('productDiscount');
    discEl.textContent = `Save ${discount}%`;
    discEl.classList.remove('hidden');
  }
  if (product.asabaExpress) {
    document.getElementById('asabaExpressBadge').classList.remove('hidden');
  }

  // Price
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productBrand').textContent = product.brand || '';
  document.getElementById('productPrice').textContent = NelShop.formatNaira(product.price);
  if (product.originalPrice && product.originalPrice > product.price) {
    const orig = document.getElementById('productOriginalPrice');
    orig.textContent = NelShop.formatNaira(product.originalPrice);
    orig.classList.remove('hidden');
  }
  document.getElementById('productDesc').textContent = product.description || product.name;

  // Quantity
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  qtyMinus.addEventListener('click', () => {
    const v = Math.max(1, parseInt(qtyInput.value, 10) - 1);
    qtyInput.value = v;
  });
  qtyPlus.addEventListener('click', () => {
    const v = Math.min(product.stock, parseInt(qtyInput.value, 10) + 1);
    qtyInput.value = v;
  });
  qtyInput.max = product.stock;

  function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-count-badge');
    if (cartBadge) {
      const count = Object.values(NelShop.getCart()).reduce((s, q) => s + q, 0);
      cartBadge.textContent = count;
      cartBadge.classList.toggle('hidden', count === 0);
    }
  }

  // Add to Cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const qty = parseInt(qtyInput.value, 10) || 1;
    const cart = NelShop.getCart();
    cart[product.id] = (cart[product.id] || 0) + qty;
    NelShop.setCart(cart);
    updateCartBadge();
    const btn = document.getElementById('addToCartBtn');
    btn.textContent = 'Added!';
    setTimeout(() => (btn.textContent = 'Add to Cart'), 1500);
  });

  // Wishlist
  const wishlistBtn = document.getElementById('wishlistBtn');
  const wishlistIcon = document.getElementById('wishlistIcon');
  function updateWishlistUI() {
    const inList = NelShop.isInWishlist(product.id);
    wishlistIcon.setAttribute('fill', inList ? 'currentColor' : 'none');
  }
  updateWishlistUI();
  wishlistBtn.addEventListener('click', () => {
    NelShop.toggleWishlist(product.id);
    updateWishlistUI();
  });

  // Specs
  const specsList = document.getElementById('specsList');
  if (product.specs && Object.keys(product.specs).length) {
    specsList.innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `<div class="flex justify-between"><dt class="text-charcoal-500">${k}</dt><dd class="font-medium">${v}</dd></div>`)
      .join('');
  } else {
    specsList.innerHTML = '<p class="text-charcoal-500 text-sm">No specifications available.</p>';
  }

  // Related
  const related = NelShop.getRelatedProducts(product.id, 4);
  const relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = related
    .map(
      (p) => `
    <a href="product-details.html?id=${p.id}" class="group block rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
      <div class="aspect-[4/5] overflow-hidden bg-slate-100">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      <div class="p-4">
        <h3 class="font-medium text-charcoal-900 line-clamp-2">${p.name}</h3>
        <p class="text-accent font-semibold mt-1">${NelShop.formatNaira(p.price)}</p>
      </div>
    </a>
  `
    )
    .join('');

  updateCartBadge();
})();
