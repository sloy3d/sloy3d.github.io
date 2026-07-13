// Supabase
const SUPABASE_URL = 'https://pgrhrlcnhyyclxeczfer.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nTJlQvQkDRkj02rUQ1fyRA_b6rg82Gu';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('open');
    }
  });
});

// Fade in on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString('ru-RU');
  }, 16);
}

// Convert DB row to app format
function rowToProduct(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryLabel: row.category_label,
    description: row.description,
    price: row.price,
    image: row.image || '',
    specs: {
      'Материал': row.material || '',
      'Размер': row.size || '',
      'Время печати': row.print_time || ''
    }
  };
}

// Fetch products from Supabase
async function getProducts() {
  const { data } = await db.from('products').select('*').order('id');
  return (data || []).map(rowToProduct);
}

// Render catalog
async function renderCatalog(filter = 'all') {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const products = await getProducts();
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:48px 0;">В этой категории пока нет товаров.</p>';
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="catalog-card" onclick="openProductModal(${product.id})">
      <div class="catalog-card-img">
        ${product.image
          ? `<img src="${product.image}" alt="${product.title}">`
          : `<div class="placeholder-icon">SL</div>`
        }
      </div>
      <div class="catalog-card-body">
        <div class="catalog-card-cat">${product.categoryLabel}</div>
        <h3 class="catalog-card-title">${product.title}</h3>
        <p class="catalog-card-desc">${product.description}</p>
        <div class="catalog-card-footer">
          <span class="catalog-card-price">${product.price} ₽</span>
          <button class="catalog-card-btn">Подробнее</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCatalog(btn.dataset.filter);
  });
});

// Product modal
async function openProductModal(productId) {
  const products = await getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let modal = document.getElementById('productModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'modal-overlay product-modal';
    document.body.appendChild(modal);
  }

  const specsHtml = product.specs
    ? `<ul class="product-modal-features">
        ${Object.entries(product.specs).map(([key, val]) => `<li><span>${key}</span><span>${val}</span></li>`).join('')}
       </ul>`
    : '';

  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeProductModal()">&times;</button>
      <div class="product-modal-img">
        ${product.image
          ? `<img src="${product.image}" alt="${product.title}">`
          : `<div class="placeholder-icon" style="font-size:2rem;opacity:0.1;font-family:'Montserrat',sans-serif;font-weight:900;">SL</div>`
        }
      </div>
      <div class="product-modal-cat">${product.categoryLabel}</div>
      <h3 class="product-modal-title">${product.title}</h3>
      <p class="product-modal-desc">${product.description}</p>
      ${specsHtml}
      <div class="product-modal-price">${product.price} ₽</div>
      <a href="#contact" class="btn btn-primary" style="width:100%;text-align:center;justify-content:center;" onclick="closeProductModal()">Заказать это изделие</a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Отправка...';

  const { error } = await db.from('orders').insert({
    id: Date.now(),
    name: entries.name || '',
    phone: entries.phone || '',
    email: entries.email || '',
    service: entries.service || '',
    delivery: entries.delivery || '',
    message: entries.message || '',
    status: 'new'
  });

  btn.disabled = false;
  btn.textContent = 'Отправить заявку';

  if (error) {
    alert('Ошибка отправки. Попробуйте ещё раз.');
    return false;
  }

  form.reset();
  document.getElementById('formSuccess').classList.add('show');
  setTimeout(() => {
    document.getElementById('formSuccess').classList.remove('show');
  }, 5000);

  return false;
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeProductModal();
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProductModal();
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});
