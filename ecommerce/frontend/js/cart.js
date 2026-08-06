function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  showToast('Added to cart!');
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = getCartCount();
}

updateCartBadge();