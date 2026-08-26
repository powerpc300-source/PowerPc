import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Credenciales oficiales de tu proyecto PowerPC
const firebaseConfig = {
  apiKey: "AIzaSyCz0fJ-P8fiSsWuaX8JdkDI2OZbDfTiQ5A",
  authDomain: "powerpc-2fbdd.firebaseapp.com",
  projectId: "powerpc-2fbdd",
  storageBucket: "powerpc-2fbdd.firebasestorage.app",
  messagingSenderId: "255449627863",
  appId: "1:255449627863:web:851e46f97ccea370eb4492"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "productos");

let allProducts = [];
let cart = [];
let currentFilter = "Todos";
let currentSubfilter = "Todas";
const PHONE = "50372541249";

const productGrid = document.getElementById("product-grid");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");

// Escuchar Firestore en tiempo real
onSnapshot(productsRef, (snapshot) => {
  allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderProducts();
});

// Renderizar tarjetas de productos en pantalla
function renderProducts() {
  productGrid.innerHTML = "";
  
  let filtered = allProducts;

  if (currentFilter !== "Todos") {
    filtered = filtered.filter(p => p.categoria === currentFilter);
  }

  if (currentFilter === "Periféricos" && currentSubfilter !== "Todas") {
    filtered = filtered.filter(p => p.subcategoria === currentSubfilter);
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-sub);">No hay productos registrados en esta sección.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    
    const badgeText = p.subcategoria ? `${p.categoria} • ${p.subcategoria}` : p.categoria;

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Power+PC'">
      <div class="card-body">
        <span class="badge">${badgeText}</span>
        <h3 class="card-title">${p.nombre}</h3>
        <p class="price">$${parseFloat(p.precio).toFixed(2)}</p>
        <p class="card-desc">${p.descripcion || ''}</p>
        <div class="card-actions">
          <button class="btn-add-cart" onclick="addToCart('${p.id}')">🛒 Agregar</button>
          <button class="btn-direct-ws" onclick="directWhatsApp('${p.nombre}', ${p.precio})">💬 Consultar</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Lógica del Carrito
window.addToCart = (id) => {
  const item = allProducts.find(p => p.id === id);
  if (item) {
    cart.push(item);
    updateCartUI();
    openCart();
  }
};

window.removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCartUI();
};

function updateCartUI() {
  cartCount.innerText = cart.length;
  cartItemsContainer.innerHTML = "";
  
  let total = 0;
  cart.forEach((item, index) => {
    total += parseFloat(item.precio);
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <div class="cart-item-title">${item.nombre}</div>
        <div class="cart-item-price">$${parseFloat(item.precio).toFixed(2)}</div>
      </div>
      <button style="background:none; border:none; color:#ef4444; cursor:pointer;" onclick="removeFromCart(${index})">✕</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalPrice.innerText = `$${total.toFixed(2)}`;
}

// Enviar pedido completo a WhatsApp
document.getElementById("send-whatsapp").addEventListener("click", () => {
  if (cart.length === 0) return alert("Tu carrito está vacío.");
  
  let msg = "¡Hola Power PC! 👋 Deseo consultar/ordenar los siguientes productos:\n\n";
  let total = 0;
  
  cart.forEach(item => {
    msg += `• ${item.nombre} - $${parseFloat(item.precio).toFixed(2)}\n`;
    total += parseFloat(item.precio);
  });
  
  msg += `\n*Total estimado: $${total.toFixed(2)}*`;
  
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
});

// Consulta directa individual
window.directWhatsApp = (nombre, precio) => {
  const msg = `¡Hola Power PC! 👋 Me interesa obtener más información sobre: *${nombre}* ($${parseFloat(precio).toFixed(2)}).`;
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
};

// Control del Panel Lateral
function openCart() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

document.getElementById("cart-trigger").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Filtro por Categoría Principal
window.filterProducts = (cat) => {
  currentFilter = cat;
  currentSubfilter = "Todas";
  
  const subfilterContainer = document.getElementById("subfilter-perifericos");
  const subcatSelect = document.getElementById("subcat-select");
  
  if (cat === "Periféricos") {
    subfilterContainer.classList.remove("hidden");
    if (subcatSelect) subcatSelect.value = "Todas";
  } else {
    subfilterContainer.classList.add("hidden");
  }

  document.querySelectorAll(".filter-bar .filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText === cat);
  });

  renderProducts();
};

// Filtro por Subcategoría (Desplegable)
window.filterSubcategory = (subcat) => {
  currentSubfilter = subcat;
  renderProducts();
};