/* =========================================================
   ShopEase - Navbar behaviour
   Include AFTER js/products.js on every page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navbarToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("active");
    });
  }

  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }
});