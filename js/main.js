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

// Default products catalog
const defaultProducts = [
  {
    id: 1,
    title: 'Архитектурный макет жилого комплекса',
    category: 'decor',
    categoryLabel: 'Декор',
    description: 'Детализированный архитектурный макет для застройщиков и&nbsp;архитекторов. Точное воспроизведение этажности, фасадов и&nbsp;благоустройства территории.',
    price: '4 500',
    image: '',
    specs: { 'Материал': 'PLA', 'Размер': '200x150x180 мм', 'Время печати': '12 часов' }
  },
  {
    id: 2,
    title: 'Набор шестерёнок для прототипа',
    category: 'tech',
    categoryLabel: 'Техника',
    description: 'Комплект из&nbsp;6&nbsp;точных шестерёнок с&nbsp;модульным зацеплением. Подходит для проверки кинематики механизмов перед серийным производством.',
    price: '2 800',
    image: '',
    specs: { 'Материал': 'PETG', 'Размер': '50x50x15 мм (x6)', 'Время печати': '6 часов' }
  },
  {
    id: 3,
    title: 'Декоративная ваза с геометрическим узором',
    category: 'decor',
    categoryLabel: 'Декор',
    description: 'Стильная ваза с&nbsp;фактурной поверхностью. Печатается как единое целое без склейки. Возможна персонализация: нанесение текста, логотипа или уникального узора.',
    price: '3 200',
    image: '',
    specs: { 'Материал': 'PLA Silk', 'Размер': '120x120x250 мм', 'Время печати': '8 часов' }
  },
  {
    id: 4,
    title: 'Кронштейн настенного крепления',
    category: 'tech',
    categoryLabel: 'Техника',
    description: 'Прочный функциональный кронштейн для крепления оборудования, камер видеонаблюдения, датчиков. Выдерживает нагрузку до&nbsp;5&nbsp;кг. Варианты цветов: чёрный, белый, серый.',
    price: '1 900',
    image: '',
    specs: { 'Материал': 'ABS', 'Размер': '100x80x60 мм', 'Время печати': '4 часа' }
  },
  {
    id: 5,
    title: 'Коллекционная фигурка дракона',
    category: 'gifts',
    categoryLabel: 'Подарки',
    description: 'Высокодетализированная фигурка, напечатана на&nbsp;фотополимерном принтере. Чешуя, когти, крылья&nbsp;&mdash; всё проработано до&nbsp;мелочей. Идеальный подарок для коллекционера.',
    price: '5 600',
    image: '',
    specs: { 'Материал': 'Resin', 'Размер': '150x120x200 мм', 'Время печати': '18 часов' }
  },
  {
    id: 6,
    title: 'Модульный настольный органайзер',
    category: 'tech',
    categoryLabel: 'Техника',
    description: 'Система из&nbsp;соединяемых модулей для хранения канцелярии, инструментов или мелких деталей. Можно комбинировать секции под свои нужды. Минималистичный дизайн.',
    price: '2 100',
    image: '',
    specs: { 'Материал': 'PLA', 'Размер': '200x150x100 мм', 'Время печати': '7 часов' }
  },
  {
    id: 7,
    title: 'Футляр для наушников',
    category: 'gifts',
    categoryLabel: 'Подарки',
    description: 'Компактный защитный футляр с&nbsp;застёжкой-замком. Точная подгонка под конкретную модель наушников. Защита от&nbsp;ударов и&nbsp;царапин при транспортировке.',
    price: '1 400',
    image: '',
    specs: { 'Материал': 'TPU / PLA', 'Размер': '80x60x40 мм', 'Время печати': '3 часа' }
  },
  {
    id: 8,
    title: 'Корпус для электроники (Arduino / Raspberry Pi)',
    category: 'tech',
    categoryLabel: 'Техника',
    description: 'Функциональный корпус с&nbsp;вентиляционными отверстиями и&nbsp;вырезами под разъёмы. Подходит для Raspberry Pi 4, Arduino Mega и&nbsp;других плат. Два варианта исполнения.',
    price: '1 600',
    image: '',
    specs: { 'Материал': 'PETG', 'Размер': '120x80x35 мм', 'Время печати': '5 часов' }
  }
];

// Load products from localStorage or use defaults
function getProducts() {
  const stored = localStorage.getItem('sloy_products');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('sloy_products', JSON.stringify(defaultProducts));
  return defaultProducts;
}

// Render catalog
function renderCatalog(filter = 'all') {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const products = getProducts();
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
function openProductModal(productId) {
  const products = getProducts();
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
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());

  // Save to localStorage
  const submissions = JSON.parse(localStorage.getItem('sloy_submissions') || '[]');
  entries.id = Date.now();
  entries.date = new Date().toISOString();
  entries.status = 'new';
  submissions.push(entries);
  localStorage.setItem('sloy_submissions', JSON.stringify(submissions));

  // Show success
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
