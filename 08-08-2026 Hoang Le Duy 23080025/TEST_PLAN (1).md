# TEST PLAN

**Dự án:** ShopEase (E-commerce Web App)
**File được kiểm thử:** `js/products.js` (logic sản phẩm, giỏ hàng, render grid)
**Nhóm:** Group 2 — HSB
**Công cụ hỗ trợ:** Claude — phân tích code, sinh test case, viết test Jest, phân tích nguyên nhân lỗi

---

## 1. Mục tiêu kiểm thử

Kiểm thử toàn bộ logic nghiệp vụ trong `products.js`: định dạng giá, tra cứu sản phẩm theo id/category, xử lý giỏ hàng (thêm/đếm), và render lưới sản phẩm — vì đây là nơi chứa toàn bộ hàm xử lý dữ liệu thật của dự án (HTML/CSS chỉ là giao diện gọi các hàm này).

---

## 2. Kết quả phân tích code bằng AI

**Các chức năng chính được xác định:**
- `formatPrice`, `renderStars` — hàm định dạng hiển thị
- `getProductById`, `getProductsByCategory`, `getAllCategories` — hàm truy vấn dữ liệu sản phẩm (24 sản phẩm mock, 6 category)
- `getCart`, `saveCart`, `addToCart`, `getCartCount`, `updateCartBadge` — logic giỏ hàng dùng `localStorage`
- `createProductCardHTML`, `renderProductGrid` — render giao diện lưới sản phẩm

**Các phần được AI đề xuất ưu tiên kiểm thử (rủi ro cao):**
- `getProductById` khi id không hợp lệ / null (ảnh hưởng trực tiếp tới trang `product-detail.html` — quyết định hiện "Product not found")
- `getProductsByCategory` khi category rỗng hoặc không tồn tại (ảnh hưởng filter ở `products.html`)
- `getCart` khi dữ liệu `localStorage` bị hỏng (không có validate JSON chặt)
- `renderStars` ở giá trị rating lẻ (`4.5`) — không có nửa sao, dễ gây hiểu nhầm dữ liệu hiển thị
- `renderProductGrid` khi danh sách rỗng hoặc containerId sai

---

## 3. Danh sách Test Case (14 test case — vượt yêu cầu tối thiểu 10)

| STT | Loại Test | Tên Test Case | Input | Kết quả mong đợi (Expected) | Kết quả thực tế |
|-----|-----------|----------------|--------|-------------------------------|------------------|
| TC01 | Chức năng bình thường | formatPrice định dạng đúng | `formatPrice(999)` | `"$999"` | ✅ Pass |
| TC02 | Chức năng bình thường | getProductById trả đúng sản phẩm | `getProductById(1)` | Trả về object MacBook Air M2 | ✅ Pass |
| TC03 | Chức năng bình thường | getProductsByCategory lọc đúng | `getProductsByCategory("Laptop")` | Toàn bộ phần tử có `category === "Laptop"` | ✅ Pass |
| TC04 | Dữ liệu sai/rỗng | getProductById với id = null | `getProductById(null)` | `undefined` | ✅ Pass |
| TC05 | Dữ liệu sai/rỗng | getProductsByCategory với chuỗi rỗng | `getProductsByCategory("")` | Trả về toàn bộ 24 sản phẩm | ✅ Pass (sau khi sửa test) |
| TC06 | Dữ liệu sai/rỗng | getCart khi localStorage chứa JSON hỏng | `localStorage.cart = "{ hỏng"` | Không crash, trả về `[]` | ✅ Pass |
| TC07 | Boundary Case | renderStars biên dưới | `renderStars(0)` | `"☆☆☆☆☆"` | ✅ Pass |
| TC08 | Boundary Case | renderStars biên trên | `renderStars(5)` | `"★★★★★"` | ✅ Pass |
| TC09 | Edge Case | getProductsByCategory category không tồn tại | `getProductsByCategory("KhongTonTai123")` | Mảng rỗng `[]` | ✅ Pass |
| TC10 | Edge Case | renderStars với rating lẻ .5 | `renderStars(4.5)` | `"★★★★★"` (làm tròn lên, không có nửa sao) | ✅ Pass — **ghi nhận là điểm cần xác nhận với business**, không phải bug kỹ thuật |
| TC11 | Error Handling | renderProductGrid khi list rỗng | `renderProductGrid("grid", [])` | Hiện `"No products found."` | ✅ Pass |
| TC12 | Error Handling | renderProductGrid khi containerId sai | `renderProductGrid("khong-ton-tai", products)` | Không throw lỗi | ✅ Pass (sau khi sửa test) |
| TC13 | Chức năng bình thường | addToCart cộng dồn số lượng | Gọi `addToCart(1)` 2 lần | `getCartCount() === 2`, badge hiển thị `"2"` | ✅ Pass |
| TC14 | Chức năng bình thường | renderProductGrid render đúng số thẻ | `renderProductGrid("grid", 5 sản phẩm Mouse)` | Số `.product-card` trong DOM = 5 | ✅ Pass |

### Giải thích 5 loại Test Case
| Loại | Ý nghĩa |
|---|---|
| Chức năng bình thường | Input hợp lệ, luồng chính |
| Dữ liệu sai/rỗng | Input null, rỗng, JSON hỏng |
| Boundary Case | Giá trị biên (rating min/max) |
| Edge Case | Category không tồn tại, rating lẻ .5 |
| Error Handling | Container/DOM không tồn tại, danh sách rỗng |

---

## 4. Framework kiểm thử sử dụng

- **Framework:** Jest + `jest-environment-jsdom` (giả lập DOM thật để test code thao tác `document.getElementById`, `localStorage`)
- **Lý do chọn:** `products.js` là vanilla JavaScript thao tác trực tiếp DOM và `localStorage`, không dùng framework nào (React/Vue) → Jest + jsdom là lựa chọn nhẹ, phổ biến nhất để test loại code này.
- File test thật: `tests/products.test.js`
- Cách chạy: `npm test`

---

## 5. Skill/Quy trình AI sử dụng khi testing

Quy trình được lặp lại có cấu trúc: **Đọc code → Sinh Test Case theo 5 nhóm → Viết test Jest thật (nạp thẳng code gốc bằng `eval`, không copy lại logic) → Chạy test thật trong terminal → Nếu Fail: yêu cầu AI giải thích nguyên nhân → Sửa → Chạy lại**.

Lý do chọn cách "nạp thẳng code gốc" thay vì mock/copy logic: đảm bảo test đang kiểm tra đúng code thật của dự án, không phải một bản sao có thể lệch với code gốc theo thời gian.
