// Supabase
let db = null;
try {
  const SUPABASE_URL = 'https://pgrhrlcnhyyclxeczfer.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_nTJlQvQkDRkj02rUQ1fyRA_b6rg82Gu';
  db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) { console.warn('Supabase init failed:', e); }

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

// Parallax scrolling
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY) * speed - scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

// Mouse parallax on hero
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  if (!hero || !heroVisual) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 15}px))`;
  });

  hero.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'translate(-50%, -50%)';
  });
}

// Staggered animation for grid items
function initStaggeredAnimations() {
  const grids = document.querySelectorAll('.features-grid, .services-list, .process-grid, .spools-grid, .catalog-grid');
  grids.forEach(grid => {
    const items = grid.children;
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(items).forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.08}s`;
            item.classList.add('stagger-visible');
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    staggerObserver.observe(grid);
  });
}

// Scroll progress indicator
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

// Init all animations
initParallax();
initHeroParallax();
initStaggeredAnimations();
initScrollProgress();

// Spools toggle
function toggleSpools() {
  const grid = document.getElementById('spoolsGrid');
  const btn = document.getElementById('spoolsToggle');
  grid.classList.toggle('expanded');
  btn.textContent = grid.classList.contains('expanded') ? 'Свернуть' : 'Показать все цвета';
}

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

// Default products for seeding
const defaultProducts = [
  { id: 1, title: 'Архитектурный макет жилого комплекса', category: 'decor', category_label: 'Декор', description: 'Детализированный архитектурный макет для застройщиков и архитекторов. Точное воспроизведение этажности, фасадов и благоустройства территории.', price: '4 500', image: '', material: 'PLA', size: '200x150x180 мм', print_time: '12 часов' },
  { id: 2, title: 'Набор шестерёнок для прототипа', category: 'home', category_label: 'Для дома', description: 'Комплект из 6 точных шестерёнок с модульным зацеплением. Подходит для проверки кинематики механизмов перед серийным производством.', price: '2 800', image: '', material: 'PETG', size: '50x50x15 мм (x6)', print_time: '6 часов' },
  { id: 3, title: 'Декоративная ваза с геометрическим узором', category: 'decor', category_label: 'Декор', description: 'Стильная ваза с фактурной поверхностью. Печатается как единое целое без склейки. Возможна персонализация: нанесение текста, логотипа или уникального узора.', price: '3 200', image: '', material: 'PLA Silk', size: '120x120x250 мм', print_time: '8 часов' },
  { id: 4, title: 'Кронштейн настенного крепления', category: 'home', category_label: 'Для дома', description: 'Прочный функциональный кронштейн для крепления оборудования, камер видеонаблюдения, датчиков. Выдерживает нагрузку до 5 кг. Варианты цветов: чёрный, белый, серый.', price: '1 900', image: '', material: 'ABS', size: '100x80x60 мм', print_time: '4 часа' },
  { id: 5, title: 'Коллекционная фигурка дракона', category: 'gifts', category_label: 'Подарки', description: 'Высокодетализированная фигурка, напечатана на фотополимерном принтере. Чешуя, когти, крылья — всё проработано до мелочей. Идеальный подарок для коллекционера.', price: '5 600', image: '', material: 'Resin', size: '150x120x200 мм', print_time: '18 часов' },
  { id: 6, title: 'Модульный настольный органайзер', category: 'home', category_label: 'Для дома', description: 'Система из соединяемых модулей для хранения канцелярии, инструментов или мелких деталей. Можно комбинировать секции под свои нужды. Минималистичный дизайн.', price: '2 100', image: '', material: 'PLA', size: '200x150x100 мм', print_time: '7 часов' },
  { id: 7, title: 'Футляр для наушников', category: 'gifts', category_label: 'Подарки', description: 'Компактный защитный футляр с застёжкой-замком. Точная подгонка под конкретную модель наушников. Защита от ударов и царапин при транспортировке.', price: '1 400', image: '', material: 'TPU / PLA', size: '80x60x40 мм', print_time: '3 часа' },
  { id: 8, title: 'Корпус для электроники (Arduino / Raspberry Pi)', category: 'home', category_label: 'Для дома', description: 'Функциональный корпус с вентиляционными отверстиями и вырезами под разъёмы. Подходит для Raspberry Pi 4, Arduino Mega и других плат. Два варианта исполнения.', price: '1 600', image: '', material: 'PETG', size: '120x80x35 мм', print_time: '5 часов' }
];

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

// Fetch products: Supabase → localStorage cache → defaultProducts
async function getProducts() {
  // Try Supabase first
  if (db) {
    try {
      const { data, error } = await db.from('products').select('*').order('id');
      if (!error && data && data.length > 0) {
        const products = data.map(rowToProduct);
        localStorage.setItem('sloy_products_cache', JSON.stringify(products));
        localStorage.setItem('sloy_products_cache_time', Date.now().toString());
        return products;
      }
    } catch (e) { /* fall through */ }
  }
  // Try localStorage cache (valid for 7 days)
  try {
    const cached = localStorage.getItem('sloy_products_cache');
    const cacheTime = parseInt(localStorage.getItem('sloy_products_cache_time') || '0');
    if (cached && Date.now() - cacheTime < 7 * 24 * 60 * 60 * 1000) {
      return JSON.parse(cached);
    }
  } catch (e) { /* fall through */ }
  // Final fallback: built-in defaults
  return defaultProducts.map(rowToProduct);
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

  let success = false;
  if (db) {
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
    success = !error;
  }

  btn.disabled = false;
  btn.textContent = 'Отправить заявку';

  if (!success) {
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
