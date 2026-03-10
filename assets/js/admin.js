/**
 * NelShop - Super Admin Dashboard Logic
 * Mall Manager: Statistics, Brand Approval, Products, Categories, Settings
 */

(function () {
  const BRAND_APPLICATIONS = [
    { id: 'b1', name: 'TechHub Nigeria', category: 'Electronics', dateJoined: '2025-03-05', status: 'pending' },
    { id: 'b2', name: 'Fashion Forward NG', category: 'Clothing', dateJoined: '2025-03-04', status: 'pending' },
    { id: 'b3', name: 'Delta Fresh Foods', category: 'Groceries', dateJoined: '2025-03-03', status: 'pending' },
    { id: 'b4', name: 'Ankara Express', category: 'Fashion', dateJoined: '2025-03-02', status: 'pending' },
    { id: 'b5', name: 'Gadget World', category: 'Electronics', dateJoined: '2025-03-01', status: 'pending' },
  ];

  const formatNaira = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const CATEGORY_BADGES = {
    Electronics: 'bg-violet-100 text-violet-700',
    Clothing: 'bg-rose-100 text-rose-700',
    Fashion: 'bg-rose-100 text-rose-700',
    Groceries: 'bg-emerald-100 text-emerald-700',
  };
  const getCategoryBadge = (cat) => CATEGORY_BADGES[cat] || 'bg-slate-100 text-slate-700';

  function renderBrandApplications(searchQuery = '') {
    const tbody = document.getElementById('brandApplicationsTable');
    const container = document.getElementById('brandTableContainer');
    const emptyEl = document.getElementById('brandTableEmpty');
    if (!tbody) return;

    const pending = BRAND_APPLICATIONS.filter((b) => b.status === 'pending');
    const filtered = searchQuery.trim()
      ? pending.filter((b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : pending;

    tbody.innerHTML = filtered
      .map(
        (b) => `
      <tr class="brand-row hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors" data-id="${b.id}">
        <td class="px-6 py-5 font-semibold text-slate-800 dark:text-slate-100">${b.name}</td>
        <td class="px-6 py-5">
          <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryBadge(b.category)}">${b.category}</span>
        </td>
        <td class="px-6 py-5 text-slate-500 dark:text-slate-400">${b.dateJoined}</td>
        <td class="px-6 py-5">
          <div class="flex flex-wrap gap-3">
            <button type="button" class="btn-approve rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 hover:scale-105 active:scale-100 px-4 py-2 text-sm font-semibold transition-all duration-200" data-id="${b.id}">Approve</button>
            <button type="button" class="btn-reject rounded-xl bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-100 px-4 py-2 text-sm font-semibold transition-all duration-200" data-id="${b.id}">Reject</button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');

    tbody.querySelectorAll('.btn-approve').forEach((btn) => {
      btn.addEventListener('click', () => handleBrandAction(btn.dataset.id, 'approved'));
    });
    tbody.querySelectorAll('.btn-reject').forEach((btn) => {
      btn.addEventListener('click', () => handleBrandAction(btn.dataset.id, 'rejected'));
    });

    if (container) container.classList.toggle('hidden', filtered.length === 0);
    if (emptyEl) emptyEl.classList.toggle('hidden', filtered.length > 0);
  }

  function handleBrandAction(id, action) {
    const brand = BRAND_APPLICATIONS.find((b) => b.id === id);
    if (!brand) return;
    const row = document.querySelector(`.brand-row[data-id="${id}"]`);
    if (row) {
      row.classList.add('row-fade-out');
      row.addEventListener('transitionend', () => {
        brand.status = action;
        const q = document.getElementById('brandSearchInput')?.value || '';
        renderBrandApplications(q);
        const msg = action === 'approved' ? `"${brand.name}" has been approved.` : `"${brand.name}" has been rejected.`;
        showToast(msg, action === 'approved' ? 'success' : 'error');
      }, { once: true });
    } else {
      brand.status = action;
      renderBrandApplications(document.getElementById('brandSearchInput')?.value || '');
      showToast(action === 'approved' ? `"${brand.name}" has been approved.` : `"${brand.name}" has been rejected.`, action === 'approved' ? 'success' : 'error');
    }
  }

  function showToast(message, type = 'info') {
    const existing = document.getElementById('admin-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'admin-toast';
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-slate-700';
    el.className = `fixed bottom-4 right-4 ${bg} text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.view-panel');

    function setActiveLink(activeLink) {
      links.forEach((l) => {
        l.classList.remove('border-indigo-400', 'bg-gradient-to-r', 'from-indigo-500/20', 'via-indigo-500/15', 'to-transparent', 'text-white');
        l.classList.add('border-transparent', 'text-slate-400');
        const dot = l.querySelector('.nav-indicator-dot');
        if (dot) dot.remove();
      });
      activeLink.classList.add('border-indigo-400', 'bg-gradient-to-r', 'from-indigo-500/20', 'via-indigo-500/15', 'to-transparent', 'text-white');
      activeLink.classList.remove('border-transparent', 'text-slate-400');
      if (!activeLink.querySelector('.nav-indicator-dot')) {
        const dot = document.createElement('span');
        dot.className = 'nav-indicator-dot absolute left-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-indicator animate-pulse';
        activeLink.insertBefore(dot, activeLink.firstChild);
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
      });
    });
  }

  function runCountUp() {
    const elements = [
      { el: document.getElementById('kpiRevenue'), isCurrency: true },
      { el: document.getElementById('kpiBrands'), isCurrency: false },
      { el: document.getElementById('kpiCustomers'), isCurrency: false },
      { el: document.getElementById('kpiOrders'), isCurrency: false },
    ];
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      elements.forEach(({ el, isCurrency }) => {
        if (!el) return;
        const target = Number(el.dataset.value) || 0;
        const current = Math.round(target * eased);
        el.textContent = isCurrency ? formatNaira(current) : current.toLocaleString();
      });

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderSkeletonRows() {
    const tbody = document.getElementById('brandApplicationsTable');
    if (!tbody) return;
    tbody.innerHTML = Array(4)
      .fill(0)
      .map(
        () => `
      <tr>
        <td class="px-6 py-5"><span class="skeleton inline-block h-5 w-32"></span></td>
        <td class="px-6 py-5"><span class="skeleton inline-block h-6 w-20 rounded-full"></span></td>
        <td class="px-6 py-5"><span class="skeleton inline-block h-5 w-24"></span></td>
        <td class="px-6 py-5"><span class="skeleton inline-block h-8 w-28 rounded-full"></span></td>
      </tr>
    `
      )
      .join('');
  }

  function initBrandSearch() {
    const input = document.getElementById('brandSearchInput');
    if (!input) return;
    input.addEventListener('input', () => {
      renderBrandApplications(input.value);
    });
  }

  function initThemeToggle() {
    const root = document.getElementById('theme-root');
    const toggle = document.getElementById('themeToggle');
    const iconLight = document.getElementById('themeIconLight');
    const iconDark = document.getElementById('themeIconDark');

    const STORAGE_KEY = 'nelshop-admin-theme';
    const getStored = () => localStorage.getItem(STORAGE_KEY);
    const setStored = (v) => { try { localStorage.setItem(STORAGE_KEY, v); } catch (_) {} };

    function applyTheme(isDark) {
      if (isDark) {
        root?.classList.add('dark');
        document.documentElement.classList.add('dark');
      } else {
        root?.classList.remove('dark');
        document.documentElement.classList.remove('dark');
      }
    }

    toggle?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const next = !isDark;
      applyTheme(next);
      setStored(next ? 'dark' : 'light');
    });

    const stored = getStored();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'dark' || (stored !== 'light' && prefersDark);
    applyTheme(initial);
  }

  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
      sidebar?.classList.remove('-translate-x-full');
      overlay?.classList.remove('opacity-0', 'pointer-events-none');
    }
    function closeSidebar() {
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('opacity-0', 'pointer-events-none');
    }

    toggle?.addEventListener('click', () => {
      if (sidebar?.classList.contains('-translate-x-full')) openSidebar();
      else closeSidebar();
    });
    overlay?.addEventListener('click', closeSidebar);
  }

  function renderPendingProducts() {
    const tbody = document.getElementById('pendingProductsTable');
    if (!tbody || typeof NelShopSync === 'undefined') return;

    const all = NelShopSync.getProducts();
    tbody.innerHTML = all
      .map(
        (p) => `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
            </div>
            <span class="font-semibold text-slate-800 dark:text-slate-100">${p.name}</span>
          </div>
        </td>
        <td class="px-6 py-5 text-slate-500 dark:text-slate-400">${p.brand}</td>
        <td class="px-6 py-5 text-slate-500 dark:text-slate-400">${formatNaira(p.price)}</td>
        <td class="px-6 py-5 text-slate-500 dark:text-slate-400 capitalize">${p.category}</td>
        <td class="px-6 py-5">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'}">${p.status}</span>
        </td>
        <td class="px-6 py-5">
          ${p.status === 'pending' ? `<button type="button" class="product-approve-btn px-4 py-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 hover:scale-105 active:scale-100 text-sm font-semibold transition-all duration-200" data-id="${p.id}">Approve</button>` : '<span class="text-slate-400 dark:text-slate-500 text-sm">—</span>'}
        </td>
      </tr>
    `
      )
      .join('');

    tbody.querySelectorAll('.product-approve-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        NelShopSync.approveProduct(btn.dataset.id);
        renderPendingProducts();
        showToast('Product approved. It will now appear on the store.');
      });
    });
  }

  function init() {
    initThemeToggle();
    renderSkeletonRows();
    initNavigation();
    initSidebar();
    initBrandSearch();

    setTimeout(() => {
      renderBrandApplications(document.getElementById('brandSearchInput')?.value || '');
      runCountUp();
      renderPendingProducts();
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
