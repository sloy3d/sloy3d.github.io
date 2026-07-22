// Supabase
let db = null;
try {
  const SUPABASE_URL = 'https://pgrhrlcnhyyclxeczfer.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_nTJlQvQkDRkj02rUQ1fyRA_b6rg82Gu';
  db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) { console.warn('Supabase init failed:', e); }

// Admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'sloy2026';

// Category labels
const categoryLabels = {
  decor: 'Декор',
  home: 'Для дома',
  gifts: 'Подарки',
  custom: 'Кастом'
};

const statusLabels = {
  new: 'Новая',
  processing: 'В обработке',
  done: 'Выполнена'
};

// Login
function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('sloy_admin', 'true');
    showAdminPanel();
  } else {
    document.getElementById('loginError').classList.add('show');
    setTimeout(() => {
      document.getElementById('loginError').classList.remove('show');
    }, 3000);
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('sloy_admin');
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadDashboard();
}

// Check auth on load
if (sessionStorage.getItem('sloy_admin') === 'true') {
  showAdminPanel();
}

// Tabs
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Load dashboard
async function loadDashboard() {
  const { data: products } = await db.from('products').select('*').order('id');
  const { data: orders } = await db.from('orders').select('*').order('created_at', { ascending: false });

  document.getElementById('statProducts').textContent = products ? products.length : 0;
  document.getElementById('statOrders').textContent = orders ? orders.length : 0;
  document.getElementById('statNewOrders').textContent = orders ? orders.filter(o => o.status === 'new').length : 0;

  renderProductsTable(products || []);
  renderOrdersTable(orders || []);
}

// Products table
function renderProductsTable(products) {
  const tbody = document.getElementById('productsBody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${categoryLabels[p.category] || p.category}</td>
      <td>${p.price} ₽</td>
      <td>
        <div class="actions">
          <button class="btn-sm" onclick="editProduct(${p.id})">Изменить</button>
          <button class="btn-sm danger" onclick="deleteProduct(${p.id})">Удалить</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Orders table
function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersBody');
  tbody.innerHTML = orders.map(o => {
    const date = new Date(o.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const serviceLabels = {
      catalog: 'Из каталога',
      custom: 'Кастомное изделие',
      modeling: '3D-моделирование',
      serial: 'Серийное производство',
      other: 'Другое'
    };
    return `
      <tr>
        <td>${date}</td>
        <td>${o.name || '—'}</td>
        <td>${o.phone || '—'}</td>
        <td>${o.email || '—'}</td>
        <td>${serviceLabels[o.service] || o.service || '—'}</td>
        <td><span class="badge badge-${o.status || 'new'}">${statusLabels[o.status] || 'Новая'}</span></td>
        <td>
          <div class="actions">
            <button class="btn-sm" onclick="viewOrder(${o.id})">Просмотр</button>
            <button class="btn-sm" onclick="toggleOrderStatus(${o.id})">Статус</button>
            <button class="btn-sm danger" onclick="deleteOrder(${o.id})">Удалить</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Add product
function openAddProduct() {
  document.getElementById('editProductId').value = '';
  document.getElementById('productFormTitle').textContent = 'Добавить товар';
  document.getElementById('productForm').reset();
  resetImageUpload();
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Edit product
async function editProduct(id) {
  const { data: product } = await db.from('products').select('*').eq('id', id).single();
  if (!product) return;

  document.getElementById('editProductId').value = id;
  document.getElementById('productFormTitle').textContent = 'Редактировать товар';
  document.getElementById('prodTitle').value = product.title;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodDesc').value = product.description;
  document.getElementById('prodImage').value = product.image || '';
  document.getElementById('prodMaterial').value = product.material || '';
  document.getElementById('prodSize').value = product.size || '';
  document.getElementById('prodTime').value = product.print_time || '';

  if (product.image) {
    showImagePreview(product.image);
  } else {
    resetImageUpload();
  }

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Save product
async function handleProductSave(e) {
  e.preventDefault();
  const editId = document.getElementById('editProductId').value;

  const productData = {
    title: document.getElementById('prodTitle').value,
    category: document.getElementById('prodCategory').value,
    category_label: categoryLabels[document.getElementById('prodCategory').value],
    description: document.getElementById('prodDesc').value,
    price: document.getElementById('prodPrice').value,
    image: document.getElementById('prodImage').value,
    material: document.getElementById('prodMaterial').value,
    size: document.getElementById('prodSize').value,
    print_time: document.getElementById('prodTime').value
  };

  let result;
  if (editId) {
    result = await db.from('products').update(productData).eq('id', parseInt(editId));
  } else {
    productData.id = Date.now();
    result = await db.from('products').insert(productData);
  }

  if (result.error) {
    alert('Ошибка сохранения: ' + result.error.message);
    return false;
  }

  closeProductForm();
  loadDashboard();
  return false;
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Удалить этот товар?')) return;
  await db.from('products').delete().eq('id', id);
  loadDashboard();
}

function closeProductForm() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// View order
async function viewOrder(id) {
  const { data: order } = await db.from('orders').select('*').eq('id', id).single();
  if (!order) return;

  const date = new Date(order.created_at).toLocaleString('ru-RU');
  const serviceLabels = {
    catalog: 'Из каталога',
    custom: 'Кастомное изделие',
    modeling: '3D-моделирование',
    serial: 'Серийное производство',
    other: 'Другое'
  };
  const deliveryLabels = {
    cdek: 'СДЭК',
    ozon: 'Озон',
    pickup: 'Самовывоз'
  };

  document.getElementById('orderDetailContent').innerHTML = `
    <div class="order-detail-row">
      <span class="order-detail-label">Дата</span>
      <span class="order-detail-value">${date}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Имя</span>
      <span class="order-detail-value">${order.name || '—'}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Телефон</span>
      <span class="order-detail-value">${order.phone || '—'}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Email</span>
      <span class="order-detail-value">${order.email || '—'}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Услуга</span>
      <span class="order-detail-value">${serviceLabels[order.service] || '—'}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Доставка</span>
      <span class="order-detail-value">${deliveryLabels[order.delivery] || '—'}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Статус</span>
      <span class="order-detail-value"><span class="badge badge-${order.status}">${statusLabels[order.status]}</span></span>
    </div>
    <div class="order-detail-message">${order.message || 'Нет описания'}</div>
  `;

  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderDetail() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Toggle order status
async function toggleOrderStatus(id) {
  const { data: order } = await db.from('orders').select('status').eq('id', id).single();
  if (!order) return;

  const statusCycle = ['new', 'processing', 'done'];
  const currentIndex = statusCycle.indexOf(order.status || 'new');
  const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

  await db.from('orders').update({ status: newStatus }).eq('id', id);
  loadDashboard();
}

// Delete order
async function deleteOrder(id) {
  if (!confirm('Удалить эту заявку?')) return;
  await db.from('orders').delete().eq('id', id);
  loadDashboard();
}

// Clear all orders
async function clearOrders() {
  if (!confirm('Удалить все заявки? Это действие нельзя отменить.')) return;
  await db.from('orders').delete().neq('id', 0);
  loadDashboard();
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// Image upload handling
const imageUploadArea = document.getElementById('imageUploadArea');
const imageFileInput = document.getElementById('prodImageFile');
let dragCounter = 0;

imageUploadArea.addEventListener('click', (e) => {
  if (e.target.closest('.image-remove-btn')) return;
  imageFileInput.click();
});

imageUploadArea.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  imageUploadArea.classList.add('drag-over');
});

imageUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
});

imageUploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    imageUploadArea.classList.remove('drag-over');
  }
});

imageUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  imageUploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processImageFile(file);
  }
});

imageFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) processImageFile(file);
});

function processImageFile(file) {
  if (file.size > 2 * 1024 * 1024) {
    alert('Файл слишком большой. Максимум 2 МБ.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    document.getElementById('prodImage').value = dataUrl;
    showImagePreview(dataUrl);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(src) {
  document.getElementById('imagePlaceholder').style.display = 'none';
  document.getElementById('imagePreviewWrap').style.display = 'inline-block';
  document.getElementById('imagePreview').src = src;
}

function removeImage() {
  document.getElementById('prodImage').value = '';
  imageFileInput.value = '';
  resetImageUpload();
}

function resetImageUpload() {
  document.getElementById('prodImage').value = '';
  if (imageFileInput) imageFileInput.value = '';
  document.getElementById('imagePlaceholder').style.display = '';
  document.getElementById('imagePreviewWrap').style.display = 'none';
  document.getElementById('imagePreview').src = '';
}

// Export all data
async function exportData() {
  const { data: products } = await db.from('products').select('*').order('id');
  const { data: orders } = await db.from('orders').select('*').order('created_at', { ascending: false });

  const data = {
    products: products || [],
    orders: orders || [],
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sloy-data-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data
async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (data.products && Array.isArray(data.products)) {
        for (const p of data.products) {
          await db.from('products').upsert({
            id: p.id,
            title: p.title,
            category: p.category,
            category_label: p.category_label || p.categoryLabel || '',
            description: p.description,
            price: p.price,
            image: p.image || '',
            material: p.material || '',
            size: p.size || '',
            print_time: p.print_time || ''
          }, { onConflict: 'id' });
        }
      }

      if (data.orders && Array.isArray(data.orders)) {
        for (const o of data.orders) {
          await db.from('orders').upsert({
            id: o.id,
            name: o.name || '',
            phone: o.phone || '',
            email: o.email || '',
            service: o.service || '',
            delivery: o.delivery || '',
            message: o.message || '',
            status: o.status || 'new'
          }, { onConflict: 'id' });
        }
      }

      alert('Данные импортированы! Товаров: ' + (data.products?.length || 0) + ', заявок: ' + (data.orders?.length || 0));
      loadDashboard();
    } catch (err) {
      alert('Ошибка: файл повреждён или неверный формат');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}
