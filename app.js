// ==========================================
// CONFIGURACIÓN DE FIREBASE (powerpc-2fbdd)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCz0Fj-P8fiSsWuaX8JdkDI2OZbDfTiQ5A",
  authDomain: "powerpc-2fbdd.firebaseapp.com",
  projectId: "powerpc-2fbdd",
  storageBucket: "powerpc-2fbdd.firebasestorage.app",
  messagingSenderId: "255449627863",
  appId: "1:255449627863:web:851e46f97ccea370eb4492"
};

// Inicialización de Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Número de WhatsApp para pedidos
const WHATSAPP_NUMBER = "50370000000";

// Variables de Estado
let allProducts = [];
let cart = [];
let currentCategory = "Todos";
let currentSubcategory = "Todas";

// Elementos DOM
const productGrid = document.getElementById("product-grid");
const filterBar = document.getElementById("filter-bar");
const subfilterContainer = document.getElementById("subfilter-container");
const cartTrigger = document.getElementById("cart-trigger");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");
const btnCheckoutWs = document.getElementById("btn-checkout-ws");

// ==========================================
// LECTURA DE FIRESTORE (Busca en Productos y productos)
// ==========================================
function loadProducts() {
  // Intentar primero con la colección "Productos" (Mayúscula)
  db.collection("Productos").onSnapshot((snapshot) => {
    if (!snapshot.empty) {
      processDocs(snapshot.docs);
    } else {
      // Si está vacía, intentar con "productos" (Minúscula)
      db.collection("productos").onSnapshot((snapshotMin) => {
        processDocs(snapshotMin.docs);
      });
    }
  }, (error) => {
    console.error("Error al obtener los productos:", error);
  });
}

function processDocs(docs) {
  allProducts = docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      nombre: data.Nombre || data.nombre || data.Title || data.title || "Producto sin nombre",
      precio: parseFloat(data.Precio || data.precio || data.Price || data.price || 0),
      categoria: data.Categoria || data.categoria || data.Category || data.category || "Otros",
      subcategoria: data.Subcategoria || data.Subcategoría || data.subcategoria || data.subcategoría || "",
      descripcion: data.Descripcion || data.descripcion || data.description || "",
      imagen: data.Imagen || data.imagen || data.image || "https://via.placeholder.com/300x200?text=Power+PC"
    };
  });
  renderCatalog();
}

// ==========================================
// RENDERIZADO DEL CATÁLOGO
// ==========================================
function renderCatalog() {
  let filtered = allProducts;
  if (currentCategory !== "Todos") {
    filtered = filtered.filter(p => p.categoria.toLowerCase() === currentCategory.toLowerCase());
  }

  updateSubfilters(filtered);

  if (currentSubcategory !== "Todas" && currentSubcategory !== "") {
    filtered = filtered.filter(p => p.subcategoria.toLowerCase() === currentSubcategory.toLowerCase());
  }

  productGrid.innerHTML = "";
  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No hay productos disponibles en esta categoría.</p>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const badgeText = product.subcategoria 
      ? `${product.categoria} • ${product.subcategoria}` 
      : product.categoria;

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Power+PC'">
      </div>
      <div class="card-body">
        <span class="badge">${badgeText}</span>
        <h3 class="card-title">${product.nombre}</h3>
        <div class="price">$${product.precio.toFixed(2)}</div>
        <p class="card-desc">${product.descripcion}</p>
        <div class="card-actions">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">🛒 Agregar</button>
          <button class="btn-direct-ws" onclick="consultDirect('${product.id}')">💬 Consultar</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// ==========================================
// SUBFILTROS DINÁMICOS
// ==========================================
function updateSubfilters(productsList) {
  const subcats = [...new Set(productsList.map(p => p.subcategoria).filter(Boolean))];

  if (subcats.length === 0 || currentCategory === "Todos") {
    subfilterContainer.classList.add("hidden");
    subfilterContainer.innerHTML = "";
    currentSubcategory = "Todas";
    return;
  }

  subfilterContainer.classList.remove("hidden");
  let options = `<option value="Todas">Todas las subcategorías</option>`;
  subcats.forEach(sub => {
    options += `<option value="${sub}" ${sub === currentSubcategory ? "selected" : ""}>${sub}</option>`;
  });

  subfilterContainer.innerHTML = `
    <select class="subfilter-select" id="subfilter-select">
      ${options}
    </select>
  `;

  document.getElementById("subfilter-select").addEventListener("change", (e) => {
    currentSubcategory = e.target.value;
    renderCatalog();
  });
}

filterBar.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentCategory = e.target.getAttribute("data-category");
    currentSubcategory = "Todas";
    renderCatalog();
  }
});

// ==========================================
// CARRITO Y WHATSAPP
// ==========================================
function addToCart(productId) {
  const item = allProducts.find(p => p.id === productId);
  if (item) {
    cart.push(item);
    updateCartUI();
    openCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">El carrito está vacío.</p>`;
    cartTotalPrice.textContent = "$0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((product, idx) => {
    total += product.precio;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${product.nombre}</h4>
        <p>$${product.precio.toFixed(2)}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">&times;</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

function consultDirect(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const msg = `Hola Power PC, me interesa obtener información sobre el producto:\n*${product.nombre}* - $${product.precio.toFixed(2)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

btnCheckoutWs.addEventListener("click", () => {
  if (cart.length === 0) return;

  let msg = `Hola Power PC, me gustaría realizar el siguiente pedido:\n\n`;
  let total = 0;
  cart.forEach((p, i) => {
    msg += `${i + 1}. *${p.nombre}* - $${p.precio.toFixed(2)}\n`;
    total += p.precio;
  });
  msg += `\n*Total a pagar:* $${total.toFixed(2)}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

function openCart() {
  cartOverlay.classList.add("active");
  cartSidebar.classList.add("active");
}

function closeCart() {
  cartOverlay.classList.remove("active");
  cartSidebar.classList.remove("active");
}

cartTrigger.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("DOMContentLoaded", loadProducts);