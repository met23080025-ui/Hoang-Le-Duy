/**
 * Test cho js/products.js — logic sản phẩm, giỏ hàng, render grid
 * Nạp file gốc bằng eval() để test đúng code thật của dự án (không copy lại logic).
 */
const fs = require("fs");
const path = require("path");

const productsCode = fs.readFileSync(
  path.join(__dirname, "../js/products.js"),
  "utf8"
);
// eslint-disable-next-line no-eval
eval(productsCode);

beforeEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

/* ===================== TC01–TC02: Chức năng bình thường ===================== */

test("TC01 - formatPrice định dạng đúng giá tiền USD", () => {
  expect(formatPrice(999)).toBe("$999");
});

test("TC02 - getProductById trả về đúng sản phẩm khi id hợp lệ", () => {
  const p = getProductById(1);
  expect(p).toBeDefined();
  expect(p.name).toBe("Apple MacBook Air M2 13-inch");
});

test("TC03 - getProductsByCategory trả về đúng danh sách theo category", () => {
  const laptops = getProductsByCategory("Laptop");
  expect(laptops.length).toBeGreaterThan(0);
  expect(laptops.every((p) => p.category === "Laptop")).toBe(true);
});

/* ===================== TC04–TC05: Dữ liệu sai / rỗng ===================== */

test("TC04 - getProductById trả về undefined khi id = null", () => {
  expect(getProductById(null)).toBeUndefined();
});

test("TC05 - getProductsByCategory('') trả về TOÀN BỘ sản phẩm (coi như không lọc)", () => {
  const result = getProductsByCategory("");
  // Dùng getAllProducts() thay vì biến `products` trực tiếp: biến const khai báo
  // trong eval() không "rò rỉ" ra scope ngoài, trong khi function thì có.
  expect(result.length).toBe(getAllProducts().length);
});

test("TC06 - getCart() không crash khi localStorage chứa JSON hỏng", () => {
  localStorage.setItem("cart", "{ dữ liệu không phải JSON hợp lệ");
  expect(() => getCart()).not.toThrow();
  expect(getCart()).toEqual([]);
});

/* ===================== TC07–TC08: Boundary Case ===================== */

test("TC07 - renderStars(0) trả về 5 sao rỗng (biên dưới)", () => {
  expect(renderStars(0)).toBe("☆☆☆☆☆");
});

test("TC08 - renderStars(5) trả về 5 sao đầy (biên trên)", () => {
  expect(renderStars(5)).toBe("★★★★★");
});

/* ===================== TC09–TC10: Edge Case ===================== */

test("TC09 - getProductsByCategory với category không tồn tại trả về mảng rỗng", () => {
  const result = getProductsByCategory("KhongTonTai123");
  expect(result).toEqual([]);
});

test("TC10 - renderStars(4.5) làm tròn thành 5 sao đầy (không có nửa sao)", () => {
  // Ghi chú: đây là hành vi hiện tại của code (Math.round làm tròn .5 lên).
  // Cần xác nhận với business: sản phẩm 4.5 sao hiển thị y hệt sản phẩm 5.0 sao có phải là điều mong muốn không.
  expect(renderStars(4.5)).toBe("★★★★★");
});

/* ===================== TC11–TC13: Error Handling ===================== */

test("TC11 - renderProductGrid hiển thị 'No products found.' khi danh sách rỗng", () => {
  document.body.innerHTML = '<div id="grid"></div>';
  renderProductGrid("grid", []);
  const el = document.querySelector("#grid .no-products");
  expect(el).not.toBeNull();
  expect(el.textContent).toBe("No products found.");
});

test("TC12 - renderProductGrid không lỗi khi containerId không tồn tại trong DOM", () => {
  expect(() => renderProductGrid("khong-ton-tai", getAllProducts())).not.toThrow();
});

test("TC13 - addToCart cộng dồn qty khi thêm cùng 1 sản phẩm 2 lần", () => {
  document.body.innerHTML = '<span id="cartBadge">0</span>';
  addToCart(1);
  addToCart(1);
  expect(getCartCount()).toBe(2);
  expect(document.getElementById("cartBadge").textContent).toBe("2");
});

/* ===================== Bổ sung: render đúng số lượng thẻ sản phẩm ===================== */

test("TC14 - renderProductGrid render đúng số lượng .product-card", () => {
  document.body.innerHTML = '<div id="grid"></div>';
  const sample = getProductsByCategory("Mouse");
  renderProductGrid("grid", sample);
  const cards = document.querySelectorAll("#grid .product-card");
  expect(cards.length).toBe(sample.length);
});
