/* =========================================================
   ShopEase - Fake Product Data + Shared Helpers
   TASK 2: 24 fake products, no API / no MySQL
   ========================================================= */

const products = [
  // ---------- Laptop ----------
  { id: 1, name: "Apple MacBook Air M2 13-inch", category: "Laptop", brand: "Apple", price: 999, oldPrice: 1199, rating: 4.8, reviews: 2341, stock: 15,
    description: "Ultra-thin laptop powered by the Apple M2 chip, up to 18 hours of battery life, a stunning Liquid Retina display, and a fanless silent design perfect for work and creativity on the go.",
    image: "https://picsum.photos/seed/prod1/500/400" },
  { id: 2, name: "Dell XPS 13 Plus", category: "Laptop", brand: "Dell", price: 1099, oldPrice: 1299, rating: 4.5, reviews: 864, stock: 9,
    description: "A stunningly compact laptop with an edge-to-edge InfinityEdge display, 12th Gen Intel Core processors, and a futuristic capacitive touch function row.",
    image: "https://picsum.photos/seed/prod2/500/400" },
  { id: 3, name: "ASUS ROG Zephyrus G14", category: "Laptop", brand: "ASUS", price: 1449, oldPrice: 1699, rating: 4.7, reviews: 1203, stock: 6,
    description: "A powerhouse gaming laptop with an AMD Ryzen 9 processor, NVIDIA RTX graphics, and the iconic AniMe Matrix LED display on the lid.",
    image: "https://picsum.photos/seed/prod3/500/400" },
  { id: 4, name: "Lenovo ThinkPad X1 Carbon Gen 11", category: "Laptop", brand: "Lenovo", price: 1379, oldPrice: 1599, rating: 4.6, reviews: 742, stock: 11,
    description: "Legendary business laptop with a durable carbon-fiber chassis, military-grade durability testing, and blazing-fast Intel vPro performance.",
    image: "https://picsum.photos/seed/prod4/500/400" },

  // ---------- Smartphone ----------
  { id: 5, name: "Apple iPhone 15 Pro", category: "Smartphone", brand: "Apple", price: 999, oldPrice: 1099, rating: 4.9, reviews: 5231, stock: 24,
    description: "Titanium design, A17 Pro chip, and a customizable Action button. The most powerful iPhone camera system ever.",
    image: "https://picsum.photos/seed/prod5/500/400" },
  { id: 6, name: "Samsung Galaxy S24 Ultra", category: "Smartphone", brand: "Samsung", price: 1199, oldPrice: 1299, rating: 4.8, reviews: 4310, stock: 18,
    description: "Featuring a built-in S Pen, a 200MP camera, and Galaxy AI features that redefine how you search, translate, and create.",
    image: "https://picsum.photos/seed/prod6/500/400" },
  { id: 7, name: "Sony Xperia 1 V", category: "Smartphone", brand: "Sony", price: 1399, oldPrice: 1599, rating: 4.3, reviews: 389, stock: 7,
    description: "A true creator's phone with a 4K OLED display, professional-grade camera controls, and studio-quality audio.",
    image: "https://picsum.photos/seed/prod7/500/400" },
  { id: 8, name: "ASUS ROG Phone 8", category: "Smartphone", brand: "ASUS", price: 1099, oldPrice: 1249, rating: 4.6, reviews: 612, stock: 13,
    description: "The ultimate gaming phone with AirTrigger ultrasonic controls, a 165Hz display, and a massive vapor-chamber cooling system.",
    image: "https://picsum.photos/seed/prod8/500/400" },

  // ---------- Headphones ----------
  { id: 9, name: "Sony WH-1000XM5", category: "Headphones", brand: "Sony", price: 349, oldPrice: 399, rating: 4.8, reviews: 6820, stock: 32,
    description: "Industry-leading noise cancellation with two processors, crystal-clear hands-free calling, and up to 30 hours of battery life.",
    image: "https://picsum.photos/seed/prod9/500/400" },
  { id: 10, name: "Apple AirPods Max", category: "Headphones", brand: "Apple", price: 479, oldPrice: 549, rating: 4.6, reviews: 2987, stock: 14,
    description: "High-fidelity audio with Adaptive EQ, Active Noise Cancellation, and a breathable knit mesh canopy for all-day comfort.",
    image: "https://picsum.photos/seed/prod10/500/400" },
  { id: 11, name: "Logitech Zone Vibe 100", category: "Headphones", brand: "Logitech", price: 79, oldPrice: 99, rating: 4.2, reviews: 531, stock: 47,
    description: "Wireless headset with an advanced noise-canceling microphone, perfect for calls and music on the move.",
    image: "https://picsum.photos/seed/prod11/500/400" },
  { id: 12, name: "Razer BlackShark V2 Pro", category: "Headphones", brand: "Razer", price: 179, oldPrice: 199, rating: 4.7, reviews: 1420, stock: 22,
    description: "Esports-grade wireless gaming headset with THX Spatial Audio and Razer's signature TriForce Titanium drivers.",
    image: "https://picsum.photos/seed/prod12/500/400" },

  // ---------- Keyboard ----------
  { id: 13, name: "Logitech MX Keys S", category: "Keyboard", brand: "Logitech", price: 109, oldPrice: 129, rating: 4.7, reviews: 1893, stock: 38,
    description: "Smart illumination and perfect stroke keys make this wireless keyboard a favorite among professionals and creators.",
    image: "https://picsum.photos/seed/prod13/500/400" },
  { id: 14, name: "Razer BlackWidow V4 Pro", category: "Keyboard", brand: "Razer", price: 229, oldPrice: 259, rating: 4.6, reviews: 876, stock: 16,
    description: "Full-size mechanical gaming keyboard with a command dial, dedicated media controls, and Razer Chroma RGB lighting.",
    image: "https://picsum.photos/seed/prod14/500/400" },
  { id: 15, name: "ASUS ROG Strix Scope II", category: "Keyboard", brand: "ASUS", price: 149, oldPrice: 179, rating: 4.4, reviews: 398, stock: 20,
    description: "96% form factor mechanical keyboard with hot-swappable switches and ROG NX mechanical switches for competitive gaming.",
    image: "https://picsum.photos/seed/prod15/500/400" },
  { id: 16, name: "HP Pavilion Wireless Keyboard 600", category: "Keyboard", brand: "HP", price: 39, oldPrice: 49, rating: 4.0, reviews: 245, stock: 60,
    description: "A comfortable full-size wireless keyboard with a numeric keypad, ideal for everyday home and office use.",
    image: "https://picsum.photos/seed/prod16/500/400" },

  // ---------- Mouse ----------
  { id: 17, name: "Logitech MX Master 3S", category: "Mouse", brand: "Logitech", price: 99, oldPrice: 119, rating: 4.9, reviews: 3456, stock: 41,
    description: "Ultra-fast 8K DPI sensor, quiet clicks, and MagSpeed scrolling for the most productive mouse ever made.",
    image: "https://picsum.photos/seed/prod17/500/400" },
  { id: 18, name: "Razer DeathAdder V3 Pro", category: "Mouse", brand: "Razer", price: 149, oldPrice: 169, rating: 4.8, reviews: 1987, stock: 29,
    description: "Esports-grade wireless mouse with a 30,000 DPI Focus Pro sensor and an ultra-lightweight 63g design.",
    image: "https://picsum.photos/seed/prod18/500/400" },
  { id: 19, name: "HP X220 Wireless Mouse", category: "Mouse", brand: "HP", price: 19, oldPrice: 29, rating: 4.1, reviews: 672, stock: 85,
    description: "Simple, reliable wireless mouse with a 1600 DPI optical sensor and up to 12 months of battery life.",
    image: "https://picsum.photos/seed/prod19/500/400" },
  { id: 20, name: "ASUS ROG Gladius III Wireless", category: "Mouse", brand: "ASUS", price: 139, oldPrice: 159, rating: 4.5, reviews: 534, stock: 24,
    description: "Hot-swappable switches, ROG SpeedNova wireless technology, and a 36,000 DPI sensor for pro-level precision.",
    image: "https://picsum.photos/seed/prod20/500/400" },

  // ---------- Monitor ----------
  { id: 21, name: "Dell UltraSharp U2723QE 27-inch 4K", category: "Monitor", brand: "Dell", price: 589, oldPrice: 679, rating: 4.7, reviews: 912, stock: 12,
    description: "A stunning 4K IPS Black monitor with a 2000:1 contrast ratio, built-in KVM switch, and USB-C hub for a single-cable setup.",
    image: "https://picsum.photos/seed/prod21/500/400" },
  { id: 22, name: "Samsung Odyssey G7 32-inch", category: "Monitor", brand: "Samsung", price: 649, oldPrice: 749, rating: 4.6, reviews: 1345, stock: 8,
    description: "1000R curved QHD gaming monitor with a 240Hz refresh rate and 1ms response time for ultra-smooth gameplay.",
    image: "https://picsum.photos/seed/prod22/500/400" },
  { id: 23, name: "MSI Optix MAG274QRF-QD 27-inch", category: "Monitor", brand: "MSI", price: 399, oldPrice: 459, rating: 4.4, reviews: 527, stock: 17,
    description: "Quantum Dot QHD gaming monitor with a 165Hz refresh rate, Rapid IPS panel, and vivid, true-to-life color accuracy.",
    image: "https://picsum.photos/seed/prod23/500/400" },
  { id: 24, name: "HP E27 G5 27-inch", category: "Monitor", brand: "HP", price: 229, oldPrice: 279, rating: 4.2, reviews: 318, stock: 26,
    description: "A sleek, eye-friendly IPS monitor for the modern office, featuring HP Eye Ease technology and an adjustable ergonomic stand.",
    image: "https://picsum.photos/seed/prod24/500/400" },
];

/* =========================================================
   HELPERS
   ========================================================= */

function formatPrice(price) {
  return "$" + Number(price).toLocaleString("en-US");
}

function renderStars(rating) {
  const full = Math.round(rating);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= full ? "★" : "☆";
  }
  return html;
}

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

function getProductsByCategory(category) {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

function getAllCategories() {
  return [...new Set(products.map((p) => p.category))];
}

/* =========================================================
   CART (lightweight localStorage demo cart)
   NOTE: if your project's cart.js already has cart logic,
   you can replace the 4 functions below with calls into it —
   the only requirement is that #cartBadge gets updated.
   ========================================================= */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast("Added to cart!");
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = getCartCount();
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* =========================================================
   TASK 3 — CARD RENDERING
   ========================================================= */

function createProductCardHTML(p) {
  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round((1 - p.price / p.oldPrice) * 100)
      : 0;

  return `
    <div class="product-card">
      ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ""}
      <a href="product-detail.html?id=${p.id}" class="product-image-link">
        <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
      </a>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name"><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span>${p.rating.toFixed(1)}</span>
          <span>(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ""}
        </div>
        <div class="card-actions">
          <button class="btn-add-cart" onclick="addToCart(${p.id})">Add to Cart</button>
          <a href="product-detail.html?id=${p.id}" class="btn-view-details">View Details</a>
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p class="no-products">No products found.</p>';
    return;
  }
  container.innerHTML = list.map(createProductCardHTML).join("");
}