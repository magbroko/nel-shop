/**
 * NelShop - Auth System
 * Login, Sign Up, role-based redirects, show/hide password
 */

(function () {
  const REDIRECTS = {
    customer: 'dashboard/customer.html',
    vendor: 'brand-dashboard.html',
    admin: 'admin-control.html',
  };

  const tabLogin = document.getElementById('tabLogin');
  const tabSignUp = document.getElementById('tabSignUp');
  const loginForm = document.getElementById('loginForm');
  const signUpForm = document.getElementById('signUpForm');
  const brandNameField = document.getElementById('brandNameField');
  const signupBrandName = document.getElementById('signupBrandName');
  const roleRadios = document.querySelectorAll('input[name="registerRole"]');

  // ========== TAB SWITCHING ==========

  function showLogin() {
    tabLogin?.classList.add('bg-white/20');
    tabSignUp?.classList.remove('bg-white/20');
    tabSignUp?.classList.add('text-white/70');
    tabLogin?.classList.remove('text-white/70');
    loginForm?.classList.remove('hidden');
    signUpForm?.classList.add('hidden');
    loginForm?.classList.add('animate-fade-in');
  }

  function showSignUp() {
    tabSignUp?.classList.add('bg-white/20');
    tabLogin?.classList.remove('bg-white/20');
    tabLogin?.classList.add('text-white/70');
    tabSignUp?.classList.remove('text-white/70');
    signUpForm?.classList.remove('hidden');
    loginForm?.classList.add('hidden');
    signUpForm?.classList.add('animate-fade-in');
    updateBrandNameVisibility();
  }

  tabLogin?.addEventListener('click', showLogin);
  tabSignUp?.addEventListener('click', showSignUp);

  // ========== CONDITIONAL BRAND NAME ==========

  function updateBrandNameVisibility() {
    const selected = document.querySelector('input[name="registerRole"]:checked');
    const isVendor = selected?.value === 'vendor';
    if (brandNameField) {
      brandNameField.style.gridTemplateRows = isVendor ? '1fr' : '0fr';
      signupBrandName?.toggleAttribute('required', isVendor);
      if (!isVendor) signupBrandName.value = '';
    }
  }

  roleRadios?.forEach((r) => r.addEventListener('change', updateBrandNameVisibility));

  // ========== SHOW/HIDE PASSWORD ==========

  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const type = input.getAttribute('type');
      const isPassword = type === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      const open = btn.querySelector('.eye-open');
      const closed = btn.querySelector('.eye-closed');
      if (open && closed) {
        open.classList.toggle('hidden', isPassword);
        closed.classList.toggle('hidden', !isPassword);
      }
    });
  });

  // ========== VALIDATION & TOAST ==========

  function showErrorToast(message) {
    const existing = document.getElementById('auth-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'auth-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-red-500/95 text-white text-sm font-medium shadow-lg shadow-red-500/30 z-50 animate-fade-in flex items-center gap-2';
    toast.innerHTML = `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  function setInputError(inputId, hasError) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.toggle('border-red-400', hasError);
    input.classList.toggle('ring-2', hasError);
    input.classList.toggle('ring-red-400/50', hasError);
    if (hasError) {
      input.addEventListener(
        'input',
        () => setInputError(inputId, false),
        { once: true }
      );
      setTimeout(() => setInputError(inputId, false), 2500);
    }
  }

  function emailToDisplayName(email) {
    if (!email || !email.includes('@')) return 'Valued Guest';
    const part = email.split('@')[0];
    return part.charAt(0).toUpperCase() + part.slice(1).replace(/[._]/g, ' ');
  }

  // ========== LOGIN ==========

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value?.trim();

    if (!email || !password) {
      if (!email) setInputError('loginEmail', true);
      if (!password) setInputError('loginPassword', true);
      showErrorToast('Please enter your email and password.');
      return;
    }

    const role = document.getElementById('loginRole')?.value || 'customer';
    const path = REDIRECTS[role] || REDIRECTS.customer;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing in...</span>';

    await new Promise((r) => setTimeout(r, 1000));

    const displayName = emailToDisplayName(email);
    localStorage.setItem('currentUser', displayName);
    localStorage.setItem('nelshop_role', role);
    localStorage.setItem('nelshop_user', JSON.stringify({ email, name: displayName }));

    window.location.href = path;
  });

  // ========== SIGN UP ==========

  signUpForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="registerRole"]:checked');
    const role = selected?.value || 'customer';
    const path = REDIRECTS[role] || REDIRECTS.customer;

    if (role === 'vendor') {
      const brandName = signupBrandName?.value?.trim();
      if (!brandName) {
        signupBrandName?.focus();
        signupBrandName?.classList.add('ring-2', 'ring-red-400');
        setTimeout(() => signupBrandName?.classList.remove('ring-2', 'ring-red-400'), 2000);
        return;
      }
      localStorage.setItem('nelshop_brand', brandName);
    }

    const userName = document.getElementById('signupName')?.value?.trim() || 'Valued Guest';
    const userEmail = document.getElementById('signupEmail')?.value;
    localStorage.setItem('currentUser', userName);
    localStorage.setItem('nelshop_role', role);
    localStorage.setItem('nelshop_user', JSON.stringify({ name: userName, email: userEmail }));
    window.location.href = path;
  });

  // ========== INIT ==========

  if (window.location.hash === '#signup') {
    showSignUp();
  } else {
    showLogin();
  }
})();
