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

  function renderBrandApplications() {
    const tbody = document.getElementById('brandApplicationsTable');
    if (!tbody) return;

    tbody.innerHTML = BRAND_APPLICATIONS.filter((b) => b.status === 'pending')
      .map(
        (b) => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-6 py-4 font-medium text-slate-800">${b.name}</td>
        <td class="px-6 py-4 text-slate-600">${b.category}</td>
        <td class="px-6 py-4 text-slate-600">${b.dateJoined}</td>
        <td class="px-6 py-4">
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn-approve px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors" data-id="${b.id}">Approve</button>
            <button type="button" class="btn-reject px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors" data-id="${b.id}">Reject</button>
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
  }

  function handleBrandAction(id, action) {
    const brand = BRAND_APPLICATIONS.find((b) => b.id === id);
    if (!brand) return;
    brand.status = action;
    renderBrandApplications();
    const msg = action === 'approved' ? `"${brand.name}" has been approved.` : `"${brand.name}" has been rejected.`;
    showToast(msg, action === 'approved' ? 'success' : 'error');
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

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (!view) return;

        links.forEach((l) => {
          l.classList.remove('bg-indigo-600', 'text-white');
          l.classList.add('text-slate-300');
        });
        link.classList.add('bg-indigo-600', 'text-white');
        link.classList.remove('text-slate-300');

        panels.forEach((p) => {
          p.classList.add('hidden');
          if (p.id === `view-${view}`) p.classList.remove('hidden');
        });
      });
    });
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
      <tr class="hover:bg-slate-50">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
            </div>
            <span class="font-medium text-slate-800">${p.name}</span>
          </div>
        </td>
        <td class="px-6 py-4 text-slate-600">${p.brand}</td>
        <td class="px-6 py-4 text-slate-600">${formatNaira(p.price)}</td>
        <td class="px-6 py-4 text-slate-600 capitalize">${p.category}</td>
        <td class="px-6 py-4">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${p.status}</span>
        </td>
        <td class="px-6 py-4">
          ${p.status === 'pending' ? `<button type="button" class="product-approve-btn px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors" data-id="${p.id}">Approve</button>` : '<span class="text-slate-400 text-sm">—</span>'}
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
    renderBrandApplications();
    renderPendingProducts();
    initNavigation();
    initSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
