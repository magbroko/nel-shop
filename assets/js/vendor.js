/**
 * NelShop - Brand Admin Dashboard Logic
 * Vendor: Add Product, My Products table, Sales, Recent Orders
 */

(function () {
  const formatNaira = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const RECENT_ORDERS = [
    { id: 'ORD-1024', amount: 8500, status: 'Shipped' },
    { id: 'ORD-1023', amount: 17000, status: 'Processing' },
    { id: 'ORD-1022', amount: 12000, status: 'Delivered' },
    { id: 'ORD-1021', amount: 4500, status: 'Shipped' },
    { id: 'ORD-1020', amount: 25000, status: 'Processing' },
  ];

  function getBrandName() {
    return localStorage.getItem('nelshop_brand') || 'Delta Threads';
  }

  function getMyProducts() {
    if (typeof NelShopSync === 'undefined') return [];
    const all = NelShopSync.getProducts();
    const brand = getBrandName();
    return all.filter((p) => p.brand === brand);
  }

  function renderMyProductsTable() {
    const tbody = document.getElementById('myProductsTable');
    if (!tbody) return;

    const products = getMyProducts();
    if (products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-6 py-12 text-center text-slate-500">No products yet. Add your first product above.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = products
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
        <td class="px-6 py-4 text-slate-600">${formatNaira(p.price)}</td>
        <td class="px-6 py-4 text-slate-600 capitalize">${p.category}</td>
        <td class="px-6 py-4">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${p.status === 'approved' ? 'Approved' : 'Pending Admin Approval'}</span>
        </td>
      </tr>
    `
      )
      .join('');
  }

  function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;

    const statusColors = {
      Processing: 'bg-amber-100 text-amber-700',
      Shipped: 'bg-blue-100 text-blue-700',
      Delivered: 'bg-emerald-100 text-emerald-700',
    };

    tbody.innerHTML = RECENT_ORDERS.map(
      (o) => `
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-medium text-slate-800">${o.id}</td>
        <td class="px-4 py-3 text-slate-600">${formatNaira(o.amount)}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[o.status] || 'bg-slate-100 text-slate-700'}">${o.status}</span>
        </td>
      </tr>
    `
    ).join('');
  }

  function initAddProductForm() {
    const form = document.getElementById('addProductForm');
    const brandInput = document.getElementById('syncBrandName');
    if (brandInput) brandInput.value = getBrandName();

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('syncProductName')?.value?.trim();
      const price = document.getElementById('syncPrice')?.value;
      const category = document.getElementById('syncCategory')?.value;
      const imageUrl = document.getElementById('syncImageUrl')?.value?.trim();
      const brand = getBrandName();

      if (!name || !price) return;

      const product = NelShopSync.addProduct({
        name,
        price,
        category,
        brand,
        image: imageUrl || undefined,
      });

      renderMyProductsTable();
      form.reset();
      if (brandInput) brandInput.value = brand;
    });
  }

  function init() {
    initAddProductForm();
    renderMyProductsTable();
    renderRecentOrders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
