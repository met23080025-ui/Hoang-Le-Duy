# TEST REPORT

**Dự án:** ShopEase (E-commerce Web App)
**File kiểm thử:** `js/products.js`
**Nhóm:** Group 2 — HSB
**Ngày báo cáo:** 08/08/2026

---

## 1. Tổng số Test / Pass / Fail

| Chỉ số | Số lượng |
|---|---|
| Tổng số Test Case | 14 |
| Pass (lần chạy đầu) | 12 |
| Fail (lần chạy đầu) | 2 (TC05, TC12) |
| Pass (sau khi sửa) | 14/14 |
| Fail còn lại | 0 |

```
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Time:        0.846 s
```

---

## 2. Lỗi phát hiện và cách sửa

### Lỗi #1 (TC05 & TC12) — `ReferenceError: products is not defined`

- **Test Case liên quan:** TC05, TC12
- **Mô tả lỗi (Fail vì sao):**
  Khi chạy `npx jest`, cả 2 test đều throw `ReferenceError: products is not defined`, dù biến `products` **có tồn tại** và đang được các hàm khác (`getProductById`, `getProductsByCategory`...) sử dụng bình thường ngay trong cùng file.
- **AI phân tích nguyên nhân:**
  Nguyên nhân không nằm ở code sản phẩm (`products.js`), mà ở cách file test nạp code: dùng `eval(productsCode)` để chạy đúng code gốc. Trong JavaScript, khi gọi `eval()` trực tiếp (direct eval): các khai báo bằng từ khóa `function` sẽ "rò rỉ" (leak) ra ngoài phạm vi gọi eval, nhưng khai báo bằng `const`/`let` thì **không** — nó chỉ tồn tại trong phạm vi riêng của chính lệnh `eval` đó. `products.js` khai báo `const products = [...]`, nên biến này biến mất ngay sau khi `eval()` chạy xong, còn các hàm (khai báo bằng `function`) vẫn dùng được vì chúng đóng gói (closure) đúng biến `products` từ bên trong.
- **Cách sửa:**
  Sửa file test — thay vì gọi trực tiếp biến `products`, gọi hàm `getAllProducts()` mà `products.js` đã cung cấp sẵn đúng cho mục đích này:
  ```js
  // Trước (lỗi):
  expect(result.length).toBe(products.length);

  // Sau (đúng):
  expect(result.length).toBe(getAllProducts().length);
  ```
- **Vì sao cách sửa này phù hợp:**
  Đây là lỗi ở tầng test, không phải bug trong code sản phẩm — nên không sửa `products.js`. Việc dùng hàm `getAllProducts()` (một API công khai mà code gốc đã thiết kế sẵn) thay vì truy cập trực tiếp biến nội bộ là cách sửa đúng bản chất: tôn trọng ranh giới encapsulation của module, đồng thời né được hạn chế kỹ thuật của `eval()` với khai báo `const`/`let`.
- **Kết quả sau khi sửa:** ✅ Pass (TC05, TC12 pass, 12 test còn lại không bị ảnh hưởng)

---

## 3. AI đã hỗ trợ những gì

- [x] Đọc và phân tích code (`products.js`, `product-detail.js`, `navbar.js`, HTML) để xác định các hàm và điểm rủi ro cần test
- [x] Sinh 14 test case theo đúng 5 nhóm yêu cầu (vượt tối thiểu 10)
- [x] Cài đặt môi trường test (Jest + jsdom) và viết code test tự động
- [x] Chạy test thật, không mô phỏng kết quả
- [x] Khi có Fail, giải thích đúng nguyên nhân kỹ thuật gốc rễ (cơ chế scope của `eval()` với `const`/`let` vs `function`) trước khi đề xuất sửa

---

## 4. Sinh viên đã tự kiểm tra / quyết định gì

- **Đã tự xác nhận lại phạm vi lỗi:** khi thấy `ReferenceError: products is not defined`, đã yêu cầu AI phân tích kỹ trước khi sửa bất cứ đâu, để tránh sửa nhầm vào code sản phẩm (`products.js`) trong khi lỗi thực chất nằm ở file test — quyết định giữ nguyên `products.js`, chỉ sửa `tests/products.test.js`.
- **Đã đặt câu hỏi với 1 test case không phải lỗi kỹ thuật:** TC10 (`renderStars(4.5)` trả về 5 sao đầy) chạy Pass, nhưng thay vì coi đây là "đúng", đã ghi chú lại trong `TEST_PLAN.md` rằng đây là điểm **cần xác nhận lại với business** (rating 4.5 hiển thị y hệt rating 5.0 có thể gây hiểu nhầm cho người dùng) — không tự ý coi mọi Pass là "không có vấn đề".
- **Đã chọn cách nạp code (`eval` trực tiếp file gốc) thay vì copy lại logic vào test**, để đảm bảo test luôn phản ánh đúng code thật của dự án, tránh tình trạng test và code lệch nhau theo thời gian.

---

## 5. Kết luận

Sau khi chạy test thật và sửa lỗi, `products.js` đạt 14/14 test Pass, bao phủ đủ 5 nhóm test case theo yêu cầu. Rủi ro còn tồn đọng (không phải bug, mà là điểm cần xác nhận nghiệp vụ): cách hiển thị rating dạng số lẻ (`.5`) hiện chưa có nửa sao, cần trao đổi thêm với đội thiết kế/PO nếu muốn chính xác hơn về mặt UX.
