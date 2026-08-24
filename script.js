// BASE DE DATOS DE PRODUCTOS Y SUS RUTAS
const productsData = {
  pc: [
    { id: 'pc1', name: 'PC Gaming Power 1', desc: 'Intel Core i5, 16GB RAM, SSD 500GB', price: 450, img: 'img/cpu/pc1.jpg' },
    { id: 'pc2', name: 'PC Gaming Power 2', desc: 'Ryzen 5, 16GB RAM, RTX 3060', price: 650, img: 'img/cpu/pc2.jpg' },
    { id: 'pc3', name: 'PC Oficina Pro 3', desc: 'Intel i3, 8GB RAM, SSD 256GB', price: 280, img: 'img/cpu/pc3.jpg' },
    { id: 'pc4', name: 'PC Workstation 4', desc: 'Ryzen 7, 32GB RAM, RTX 4070', price: 1100, img: 'img/cpu/pc4.jpg' },
    { id: 'pc5', name: 'PC Gamer Extreme 5', desc: 'Intel i7, 32GB RAM, RTX 4080', price: 1450, img: 'img/cpu/pc5.jpg' },
    { id: 'pc6', name: 'PC Básica Hogar 6', desc: 'AMD Athlon, 8GB RAM, SSD 240GB', price: 220, img: 'img/cpu/pc6.jpg' }
  ],
  laptop: [
    { id: 'lap1', name: 'Laptop Work 1', desc: 'Pantalla 15.6", Core i5, 8GB RAM', price: 420, img: 'img/laptop/lap1.jpg' },
    { id: 'lap2', name: 'Laptop Gamer 2', desc: 'Pantalla 144Hz, Ryzen 5, GTX 1650', price: 680, img: 'img/laptop/lap2.jpg' },
    { id: 'lap3', name: 'Ultrabook Slim 3', desc: 'Pantalla IPS, Core i7, 16GB RAM', price: 790, img: 'img/laptop/lap3.jpg' }
  ],
  repuestos_laptop: [
    { id: 'rep1', name: 'Teclado Laptop Generico', desc: 'Compatible con múltiples modelos HP/Dell', price: 20, img: 'img/repuestos_laptop/rep1.jpg' },
    { id: 'rep2', name: 'Pantalla LED 15.6 30 pines', desc: 'Resolución HD, conector inferior derecho', price: 75, img: 'img/repuestos_laptop/rep2.jpg' },
    { id: 'rep3', name: 'Batería Interna OEM', desc: 'Batería de reemplazo de alto rendimiento', price: 35, img: 'img/repuestos_laptop/rep3.jpg' }
  ],
  perifericos: [
    { id: 'per1', name: 'Teclado Mecánico RGB', desc: 'Switches Blue, anti-ghosting full', price: 45, img: 'img/perifericos/per1.jpg' },
    { id: 'per2', name: 'Mouse Óptico Gamer 7200 DPI', desc: 'Botones programables e iluminación LED', price: 18, img: 'img/perifericos/per2.jpg' },
    { id: 'per3', name: 'Combo Teclado y Mouse Inalámbrico', desc: 'Conexión 2.4GHz receptor USB único', price: 22, img: 'img/perifericos/per3.jpg' }
  ],
  cargadores: [
    { id: 'car1', name: 'Cargador Universal Laptop', desc: '65W con múltiples conectores', price: 25, img: 'img/cargadores/car1.jpg' },
    { id: 'car2', name: 'Cargador Carga Rápida USB-C', desc: '45W compatible con Laptops/Tablets', price: 30, img: 'img/cargadores/car2.jpg' }
  ],
  herramientas: [
    { id: 'her1', name: 'Kit de Destornilladores de Precisión', desc: 'Set de 24 puntas magnéticas para laptops y celulares', price: 15, img: 'img/herramientas/her1.jpg' },
    { id: 'her2', name: 'Pasta Térmica de Alto Rendimiento', desc: 'Jeringa de 4g con espátula incluida', price: 8, img: 'img/herramientas/her2.jpg' },
    { id: 'her3', name: 'Pulsera Antiestática', desc: 'Protección para ensamble de componentes', price: 6, img: 'img/herramientas/her3.jpg' }
  ],
  videojuegos: [
    { id: 'juego1', name: 'Mando Grip PC/Consola', desc: 'Control ergonómico inalámbrico', price: 35, img: 'img/videojuegos/juego1.jpg' },
    { id: 'juego2', name: 'Headset Gaming 7.1', desc: 'Audífonos con micrófono e iluminación RGB', price: 45, img: 'img/videojuegos/juego2.jpg' }
  ]
};

let cart = [];
let currentCategory = 'pc';

// REFERENCIAS DEL DOM
const catalogGrid = document.getElementById('catalogGrid');
const catButtons = document.querySelectorAll('.cat-btn');
const cartDrawer = document.getElementById('cartDrawer');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalSum = document.getElementById('cartTotalSum');
const sendWhatsappBtn = document.getElementById('sendWhatsapp');

// RENDERIZAR CATALOGO
function renderCatalog(category) {
  catalogGrid.innerHTML = '';
  const items = productsData[category] || [];

  if (items.length === 0) {
    catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos disponibles en esta categoría.</p>';
    return;
  }

  items.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Power+PC'">
      </div>
      <div class="product-info">
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-desc">${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${prod.price.toFixed(2)}</span>
          <button class="add-to-cart-btn" data-category="${category}" data-id="${prod.id}">+ Agregar</button>
        </div>
      </div>
    `;
    catalogGrid.appendChild(card);
  });

  // Asignar eventos a los botones de agregar
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.target.getAttribute('data-category');
      const id = e.target.getAttribute('data-id');
      addToCart(cat, id);
    });
  });
}

// CAMBIO DE CATEGORÍA
catButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    catButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    renderCatalog(currentCategory);
  });
});

// FUNCIONES DEL CARRITO
function addToCart(category, id) {
  const product = productsData[category].find(p => p.id === id);
  if (product) {
    cart.push(product);
    updateCartUI();
    cartDrawer.classList.add('open');
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartCount.innerText = cart.length;
  cartItemsContainer.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <button class="remove-item-btn" data-index="${index}">&times;</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Asignar eventos de eliminación
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      removeFromCart(idx);
    });
  });

  cartTotalSum.innerText = `$${total.toFixed(2)}`;
}

// ENVÍO DEL PEDIDO A WHATSAPP
sendWhatsappBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  let message = 'Hola Power PC, me interesa comprar los siguientes equipos/repuestos:\n\n';
  let total = 0;

  cart.forEach((item, idx) => {
    message += `${idx + 1}. *${item.name}* - $${item.price.toFixed(2)}\n`;
    total += item.price;
  });

  message += `\n*Total a Pagar:* $${total.toFixed(2)}`;

  const phone = '50372541249';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// ABRIR / CERRAR CARRITO
cartToggle.addEventListener('click', () => cartDrawer.classList.add('open'));
cartClose.addEventListener('click', () => cartDrawer.classList.remove('open'));

// CARGA INICIAL DEL CATÁLOGO
renderCatalog('pc');

/* ==========================================================
   ANIMACIÓN INTERACTIVA DE FONDO TECNOLÓGICO (PARTÍCULAS / CONEXIONES)
   ========================================================== */
const canvas = document.getElementById('tech-bg');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00d2ff';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Inicializar partículas
const particleCount = Math.floor(Math.min(width, height) / 10);
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateTechBg() {
  ctx.clearRect(0, 0, width, height);

  // Dibujar líneas de conexión entre nodos cercanos
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const opacity = (1 - dist / 130) * 0.25;
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateTechBg);
}

animateTechBg();