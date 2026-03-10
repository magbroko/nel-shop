/**
 * NelShop - Add Product Form Logic
 * Multi-vendor product upload with dynamic specifications
 */

(function () {
  const formatNaira = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  let mediaFiles = [];
  let specCounter = 0;

  function initMediaUpload() {
    const dropzone = document.getElementById('mediaDropzone');
    const input = document.getElementById('mediaInput');
    const preview = document.getElementById('mediaPreview');

    function handleFiles(files) {
      const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
      mediaFiles = [...mediaFiles, ...valid].slice(0, 6);
      renderPreviews();
    }

    function renderPreviews() {
      if (!preview) return;
      preview.innerHTML = mediaFiles
        .map(
          (file, i) => `
        <div class="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
          <img src="${URL.createObjectURL(file)}" alt="Preview" class="w-full h-full object-cover">
          <button type="button" class="media-remove absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-opacity" data-index="${i}">Remove</button>
        </div>
      `
        )
        .join('');

      preview.querySelectorAll('.media-remove').forEach((btn) => {
        btn.addEventListener('click', () => {
          mediaFiles.splice(parseInt(btn.dataset.index, 10), 1);
          renderPreviews();
        });
      });
    }

    dropzone?.addEventListener('click', () => input?.click());
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-indigo-400', 'bg-indigo-50/50');
    });
    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-indigo-400', 'bg-indigo-50/50');
    });
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-indigo-400', 'bg-indigo-50/50');
      handleFiles(e.dataTransfer.files);
    });
    input?.addEventListener('change', () => handleFiles(input.files || []));
  }

  function initSpecifications() {
    const container = document.getElementById('specsContainer');
    const addBtn = document.getElementById('addSpecBtn');

    const commonAttrs = ['Color', 'Size', 'Model', 'Material', 'Weight', 'Dimensions', 'Battery', 'Connectivity'];

    function addSpecRow(key = '', value = '') {
      specCounter++;
      const row = document.createElement('div');
      row.className = 'flex flex-col sm:flex-row gap-2';
      row.dataset.specId = specCounter;
      row.innerHTML = `
        <input type="text" list="spec-datalist" class="spec-key flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Color, Size, Model" value="${key}">
        <input type="text" class="spec-value flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Value" value="${value}">
        <button type="button" class="spec-remove px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors shrink-0">Remove</button>
      `;
      container?.appendChild(row);
      row.querySelector('.spec-remove')?.addEventListener('click', () => row.remove());
    }

    const datalist = document.createElement('datalist');
    datalist.id = 'spec-datalist';
    commonAttrs.forEach((a) => {
      const opt = document.createElement('option');
      opt.value = a;
      datalist.appendChild(opt);
    });
    container?.appendChild(datalist);

    addBtn?.addEventListener('click', () => addSpecRow());
    addSpecRow('Color', '');
    addSpecRow('Size', '');
  }

  function getSpecs() {
    const rows = document.querySelectorAll('#specsContainer > div');
    const specs = {};
    rows.forEach((row) => {
      const key = row.querySelector('.spec-key')?.value;
      const value = row.querySelector('.spec-value')?.value?.trim();
      if (key && value) specs[key] = value;
    });
    return specs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      productName: form.productName?.value?.trim(),
      brandName: form.brandName?.value?.trim(),
      category: form.category?.value,
      price: parseInt(form.price?.value || 0, 10),
      description: form.description?.value?.trim(),
      stock: parseInt(form.stock?.value || 1, 10),
      specs: getSpecs(),
      images: mediaFiles,
    };

    if (!data.productName || !data.brandName || !data.category || data.price <= 0) {
      alert('Please fill in Product Name, Brand, Category, and Price.');
      return;
    }

    console.log('Product data:', { ...data, images: data.images.length });
    alert(`Product "${data.productName}" saved successfully! (Demo - data not persisted)`);
    form.reset();
    mediaFiles = [];
    document.getElementById('mediaPreview').innerHTML = '';
  }

  function init() {
    initMediaUpload();
    initSpecifications();
    document.getElementById('addProductForm')?.addEventListener('submit', handleSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
