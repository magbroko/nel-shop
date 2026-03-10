/**
 * NelShop - Brand Admin Dashboard Logic
 * Vendor: Inventory, Sales, Recent Orders
 */

(function () {
  const formatNaira = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  // Demo brand - filter products by brand
  const BRAND_NAME = 'Delta Threads';
  const LOW_STOCK_THRESHOLD = 10;

  const RECENT_ORDERS = [
    { id: 'ORD-1024', amount: 8500, status: 'Shipped' },
    { id: 'ORD-1023', amount: 17000, status: 'Processing' },
    { id: 'ORD-1022', amount: 12000, status: 'Delivered' },
    { id: 'ORD-1021', amount: 4500, status: 'Shipped' },
    { id: 'ORD-1020', amount: 25000, status: 'Processing' },
  ];

  function getBrandProducts() {
    if (typeof NelShop === 'undefined' || !NelShop.PRODUCTS) return [];
    return NelShop.PRODUCTS.filter((p) => p.brand === BRAND_NAME);
  }

  function getStockBadgeClass(stock) {
    if (stock <= LOW_STOCK_THRESHOLD) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }

  function getStockLabel(stock) {
    if (stock <= LOW_STOCK_THRESHOLD) return 'Low Stock';
    return 'In Stock';
  }

  function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;

    const products = getBrandProducts();
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p class="text-slate-500">No products yet. <a href="add-product.html" class="text-emerald-600 font-medium hover:underline">Add your first product</a></p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products
      .map(
        (p) => `
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="aspect-square bg-slate-100 relative">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
          <span class="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-medium ${getStockBadgeClass(p.stock)}">${getStockLabel(p.stock)}</span>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-slate-800 line-clamp-2">${p.name}</h3>
          <p class="text-emerald-600 font-semibold mt-1">${formatNaira(p.price)}</p>
          <p class="text-slate-500 text-sm mt-0.5">Stock: ${p.stock} units</p>
        </div>
      </div>
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

  function init() {
    renderInventory();
    renderRecentOrders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
