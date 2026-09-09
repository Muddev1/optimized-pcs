// ===========================================================
// OPTIMIZED PCS — site behavior
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---------- Parts catalog ---------- */
  const parts = [
    { id: 'gpu',        icon: '🎮', cat: 'Graphics Card', name: 'ROG RTX 4070 Ti Triple Fan',       price: 799 },
    { id: 'cpu',        icon: '🧠', cat: 'Processor',     name: 'Ryzen 7 7800X3D',                  price: 379 },
    { id: 'ram',        icon: '📶', cat: 'Memory',        name: 'Kingston Fury Beast 32GB DDR5',    price: 109 },
    { id: 'ssd',        icon: '💾', cat: 'Storage',       name: 'Samsung 990 Pro 2TB NVMe',         price: 159 },
    { id: 'cooler',     icon: '❄️', cat: 'Cooling',       name: '360mm ARGB AIO Liquid Cooler',     price: 129 },
    { id: 'case',       icon: '🖥️', cat: 'Case & PSU',    name: 'Tempered Glass Mid-Tower + PSU',   price: 189 },
    { id: 'motherboard',icon: '🔌', cat: 'Motherboard',   name: 'B650 ATX Motherboard',              price: 189 },
    { id: 'psu',        icon: '⚡', cat: 'Power Supply',  name: '850W 80+ Gold Modular PSU',        price: 119 },
    { id: 'monitor',    icon: '🖼️', cat: 'Monitor',       name: '27" 165Hz QHD Gaming Monitor',      price: 249 },
    { id: 'keyboard',   icon: '⌨️', cat: 'Peripherals',   name: 'Mechanical RGB Keyboard',           price: 79  },
    { id: 'mouse',      icon: '🖱️', cat: 'Peripherals',   name: 'Wireless Gaming Mouse',             price: 59  },
    { id: 'headset',    icon: '🎧', cat: 'Audio',         name: '7.1 Surround Gaming Headset',       price: 69  },
  ];

  /* ---------- Prebuilt PCs catalog ($700–$2000) ---------- */
  const prebuilts = [
    {
      id: 'pre-starter', icon: '🎮', cat: 'Prebuilt PC', name: 'Optimized Starter', price: 749,
      specs: ['Ryzen 5 7600', 'RTX 4060 8GB', '16GB DDR5', '1TB NVMe SSD'],
      blurb: '1080p gaming, smooth and reliable.'
    },
    {
      id: 'pre-core', icon: '🕹️', cat: 'Prebuilt PC', name: 'Optimized Core', price: 1099,
      specs: ['Ryzen 7 7700', 'RTX 4070 12GB', '32GB DDR5', '1TB NVMe SSD'],
      blurb: '1440p high-refresh gaming rig.'
    },
    {
      id: 'pre-pro', icon: '🚀', cat: 'Prebuilt PC', name: 'Optimized Pro', price: 1499,
      specs: ['Ryzen 7 7800X3D', 'RTX 4070 Ti 12GB', '32GB DDR5', '2TB NVMe SSD'],
      blurb: 'Built for competitive 1440p esports.'
    },
    {
      id: 'pre-elite', icon: '👑', cat: 'Prebuilt PC', name: 'Optimized Elite', price: 1899,
      specs: ['Ryzen 9 7900X', 'RTX 4080 Super 16GB', '32GB DDR5', '2TB NVMe SSD'],
      blurb: '4K gaming and heavy creative workloads.'
    },
    {
      id: 'pre-ultra', icon: '🏆', cat: 'Prebuilt PC', name: 'Optimized Ultra', price: 1999,
      specs: ['Ryzen 9 9950X', 'RTX 4090 24GB', '64GB DDR5', '2TB NVMe SSD'],
      blurb: 'The no-compromise flagship build.'
    },
  ];

  const products = [...parts, ...prebuilts];

  const grid = document.getElementById('product-grid');
  if (grid) {
    grid.innerHTML = parts.map(p => `
      <div class="product-card">
        <div class="product-thumb">${p.icon}</div>
        <div class="product-body">
          <span class="product-cat">${p.cat}</span>
          <span class="product-name">${p.name}</span>
          <span class="product-price">$${p.price}</span>
          <button class="product-add" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `).join('');
  }

  const prebuiltGrid = document.getElementById('prebuilt-grid');
  if (prebuiltGrid) {
    prebuiltGrid.innerHTML = prebuilts.map(p => `
      <div class="product-card prebuilt-card">
        <div class="product-thumb">${p.icon}</div>
        <div class="product-body">
          <span class="product-cat">${p.cat}</span>
          <span class="product-name">${p.name}</span>
          <p class="prebuilt-blurb">${p.blurb}</p>
          <ul class="prebuilt-specs">
            ${p.specs.map(s => `<li>${s}</li>`).join('')}
          </ul>
          <span class="product-price">$${p.price}</span>
          <button class="product-add" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Cart state ---------- */
  const CART_KEY = 'optimizedpcs_cart';
  let cart = {}; // { id: qty }
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) { cart = {}; }

  const cartCountEl = document.querySelector('.cart-count');
  const cartItemsEl = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.getElementById('cart-btn');
  const cartClose = document.getElementById('cart-close');
  const cartCheckout = document.getElementById('cart-checkout');

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function cartTotalCount() {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  function renderCart() {
    const ids = Object.keys(cart).filter(id => cart[id] > 0);

    if (cartCountEl) cartCountEl.textContent = cartTotalCount();

    if (!cartItemsEl) return;

    if (ids.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0';
      return;
    }

    let subtotal = 0;
    cartItemsEl.innerHTML = ids.map(id => {
      const p = products.find(prod => prod.id === id);
      if (!p) return '';
      const qty = cart[id];
      subtotal += p.price * qty;
      return `
        <div class="cart-item" data-id="${id}">
          <div class="cart-item-thumb">${p.icon}</div>
          <div>
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">$${p.price} each</div>
            <div class="cart-item-qty">
              <button class="qty-btn qty-minus" data-id="${id}">−</button>
              <span>${qty}</span>
              <button class="qty-btn qty-plus" data-id="${id}">+</button>
            </div>
          </div>
          <div class="cart-item-total">$${p.price * qty}</div>
          <button class="cart-item-remove" data-id="${id}">Remove</button>
        </div>
      `;
    }).join('');

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal}`;
  }

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
  }

  function openCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function handleAddClick(e) {
    const btn = e.target.closest('.product-add');
    if (!btn) return;
    addToCart(btn.dataset.id);
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = original; }, 1000);
    openCart();
  }

  if (grid) grid.addEventListener('click', handleAddClick);
  if (prebuiltGrid) prebuiltGrid.addEventListener('click', handleAddClick);

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (e) => {
      const plus = e.target.closest('.qty-plus');
      const minus = e.target.closest('.qty-minus');
      const remove = e.target.closest('.cart-item-remove');
      if (plus) changeQty(plus.dataset.id, 1);
      if (minus) changeQty(minus.dataset.id, -1);
      if (remove) removeFromCart(remove.dataset.id);
    });
  }

  if (cartCheckout) {
    cartCheckout.addEventListener('click', () => {
      if (cartTotalCount() === 0) return;
      cartCheckout.textContent = 'Order placed ✓ (demo)';
      setTimeout(() => {
        cart = {};
        saveCart();
        renderCart();
        cartCheckout.textContent = 'Checkout';
        closeCart();
      }, 1400);
    });
  }

  renderCart();

  /* ---------- Contact form (placeholder submit) ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Sent ✓';
      contactForm.reset();
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  }

  /* ---------- Easter egg: brainrot jumpscare ---------- */
  const rightsTrigger = document.getElementById('rights-trigger');
  const brainrotOverlay = document.getElementById('brainrot-overlay');
  const brainrotClose = document.getElementById('brainrot-close');
  const brainrotField = document.getElementById('brainrot-emoji-field');

  const brainrotEmojis = ['🚽', '🗿', '💀', '🔥', '😭', '🫃', '🧏', '🐐', '📉', '🥶', '🤡', '👹', '💯'];
  let brainrotInterval = null;
  let brainrotAudioCtx = null;

  function spawnEmoji() {
    if (!brainrotField) return;
    const span = document.createElement('span');
    span.textContent = brainrotEmojis[Math.floor(Math.random() * brainrotEmojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (1.5 + Math.random() * 2.5) + 'rem';
    span.style.animationDuration = (1.2 + Math.random() * 1.6) + 's';
    brainrotField.appendChild(span);
    setTimeout(() => span.remove(), 3000);
  }

  function playSiren() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      brainrotAudioCtx = new Ctx();
      const osc = brainrotAudioCtx.createOscillator();
      const gain = brainrotAudioCtx.createGain();
      osc.type = 'square';
      gain.gain.value = 0.06;
      osc.connect(gain).connect(brainrotAudioCtx.destination);
      osc.start();
      const start = brainrotAudioCtx.currentTime;
      for (let i = 0; i < 40; i++) {
        osc.frequency.setValueAtTime(i % 2 === 0 ? 660 : 220, start + i * 0.15);
      }
      osc.stop(start + 6);
    } catch (e) { /* audio not available, ignore */ }
  }

  function triggerBrainrot() {
    if (!brainrotOverlay) return;
    brainrotOverlay.classList.add('active');
    brainrotOverlay.setAttribute('aria-hidden', 'false');
    brainrotInterval = setInterval(spawnEmoji, 90);
    playSiren();
  }

  function stopBrainrot() {
    if (!brainrotOverlay) return;
    brainrotOverlay.classList.remove('active');
    brainrotOverlay.setAttribute('aria-hidden', 'true');
    if (brainrotInterval) clearInterval(brainrotInterval);
    if (brainrotField) brainrotField.innerHTML = '';
    if (brainrotAudioCtx) {
      try { brainrotAudioCtx.close(); } catch (e) {}
      brainrotAudioCtx = null;
    }
  }

  if (rightsTrigger) rightsTrigger.addEventListener('click', triggerBrainrot);
  if (brainrotClose) brainrotClose.addEventListener('click', stopBrainrot);

});
