/* =========================================================
   ShopEase - Product Detail Page Logic
   TASK 4: read ?id= from URL, load fake product, render it.
   Include AFTER js/products.js.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id);

  const container = document.getElementById("productDetailContainer");
  const notFound = document.getElementById("notFoundMessage");

  if (!product) {
    if (container) container.style.display = "none";
    if (notFound) notFound.style.display = "block";
    return;
  }

  document.title = `${product.name} - ShopEase`;

  document.getElementById("detailImage").src = product.image;
  document.getElementById("detailImage").alt = product.name;
  document.getElementById("detailCategory").textContent = product.category;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailBrandValue").textContent = product.brand;
  document.getElementById("detailStars").textContent = renderStars(product.rating);
  document.getElementById("detailRatingValue").textContent = product.rating.toFixed(1);
  document.getElementById("detailReviews").textContent = `(${product.reviews.toLocaleString()} reviews)`;
  document.getElementById("detailPrice").textContent = formatPrice(product.price);
  document.getElementById("detailDescription").textContent = product.description;

  const oldPriceEl = document.getElementById("detailOldPrice");
  const discountEl = document.getElementById("detailDiscountBadge");

  if (product.oldPrice && product.oldPrice > product.price) {
    oldPriceEl.textContent = formatPrice(product.oldPrice);
    oldPriceEl.style.display = "inline";
    const discount = Math.round((1 - product.price / product.oldPrice) * 100);
    discountEl.textContent = `-${discount}%`;
    discountEl.style.display = "inline-block";
  } else {
    oldPriceEl.style.display = "none";
    discountEl.style.display = "none";
  }

  const stockEl = document.getElementById("detailStock");
  const addBtn = document.getElementById("addToCartBtn");

  if (product.stock > 0) {
    stockEl.textContent = `In Stock (${product.stock} available)`;
    stockEl.classList.add("in-stock");
  } else {
    stockEl.textContent = "Out of Stock";
    stockEl.classList.add("out-of-stock");
    addBtn.disabled = true;
    addBtn.textContent = "Out of Stock";
  }

  addBtn.addEventListener("click", () => addToCart(product.id));
});