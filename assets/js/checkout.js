/**
 * Checkout Page - Multi-step form, delivery zones, order summary
 */

(function () {
  const cart = NelShop.getCart();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  const emptyCart = document.getElementById('emptyCart');
  const checkoutContent = document.getElementById('checkoutContent');

  if (entries.length === 0) {
    emptyCart.classList.remove('hidden');
    checkoutContent.classList.add('hidden');
    return;
  }

  const DELIVERY_FEE = 1500;
  const ZONE_LABELS = {
    summit: 'Summit Road',
    nnebisi: 'Nnebisi Road',
    gra: 'GRA',
    ogbogonogo: 'Ogbogonogo',
    okpanam: 'Okpanam',
    koka: 'Koka',
    dbs: 'DBS Road',
    other: 'Other',
  };

  let currentStep = 1;

  function getCartItems() {
    return entries.map(([id, qty]) => {
      const p = NelShop.getProductById(id);
      return p ? { ...p, qty } : null;
    }).filter(Boolean);
  }

  function getSubtotal() {
    return getCartItems().reduce((s, i) => s + i.price * i.qty, 0);
  }

  function getTotal() {
    return getSubtotal() + DELIVERY_FEE;
  }

  function renderOrderSummary() {
    const items = getCartItems();
    const subtotal = getSubtotal();
    const total = getTotal();

    document.getElementById('orderItems').innerHTML = items
      .map(
        (i) => `
      <div class="flex gap-3">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <img src="${i.image}" alt="${i.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">${i.name}</p>
          <p class="text-xs text-charcoal-500">${i.qty} × ${NelShop.formatNaira(i.price)}</p>
        </div>
        <p class="text-sm font-semibold shrink-0">${NelShop.formatNaira(i.price * i.qty)}</p>
      </div>
    `
      )
      .join('');

    document.getElementById('summarySubtotal').textContent = NelShop.formatNaira(subtotal);
    document.getElementById('summaryDelivery').textContent = NelShop.formatNaira(DELIVERY_FEE);
    document.getElementById('summaryTotal').textContent = NelShop.formatNaira(total);
  }

  function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.step-panel').forEach((el) => el.classList.add('hidden'));
    document.getElementById(`step${step}`).classList.remove('hidden');

    document.querySelectorAll('.step-dot').forEach((dot) => {
      const n = parseInt(dot.dataset.step, 10);
      dot.classList.remove('bg-accent', 'text-white', 'bg-slate-200', 'text-charcoal-500');
      if (n < step) {
        dot.classList.add('bg-accent', 'text-white');
      } else if (n === step) {
        dot.classList.add('bg-accent', 'text-white');
      } else {
        dot.classList.add('bg-slate-200', 'text-charcoal-500');
      }
    });
  }

  document.getElementById('nextToPayment').addEventListener('click', () => {
    const fn = document.getElementById('firstName').value.trim();
    const ln = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const zone = document.getElementById('deliveryZone').value;
    const addr = document.getElementById('address').value.trim();
    if (!fn || !ln || !phone || !zone || !addr) {
      alert('Please fill all shipping fields.');
      return;
    }
    goToStep(2);
  });

  document.getElementById('backToShipping').addEventListener('click', () => goToStep(1));
  document.getElementById('nextToReview').addEventListener('click', () => {
    const fn = document.getElementById('firstName').value.trim();
    const ln = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const zone = document.getElementById('deliveryZone').value;
    const addr = document.getElementById('address').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'pod';

    document.getElementById('reviewShipping').innerHTML = `
      <p class="font-medium text-charcoal-900">${fn} ${ln}</p>
      <p>${phone}</p>
      <p>${ZONE_LABELS[zone] || zone}</p>
      <p class="text-charcoal-500">${addr}</p>
    `;
    document.getElementById('reviewPayment').innerHTML = `
      <p class="font-medium text-charcoal-900">${payment === 'pod' ? 'Pay on Delivery' : 'Bank Transfer'}</p>
    `;
    goToStep(3);
  });
  document.getElementById('backToPayment').addEventListener('click', () => goToStep(2));

  document.getElementById('placeOrder').addEventListener('click', () => {
    NelShop.setCart({});
    alert('Thank you! Your order has been placed. We\'ll deliver to your Asaba address soon.');
    window.location.href = 'index.html';
  });

  renderOrderSummary();
  goToStep(1);
})();
