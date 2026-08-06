# Bộ prompt AI cho quy trình chia nhóm công bằng

Đây là các prompt dùng để copy-paste trực tiếp vào ChatGPT/Claude, tương ứng với từng bước trong luồng ở File 1. Nguyên tắc xuyên suốt: **AI xử lý ngôn ngữ, code xử lý số học** — không dùng AI để tự tính hay tự chia nhóm.

---

## 1. Thiết kế Google Form thu thập dữ liệu

```
Bạn là chuyên gia thiết kế khảo sát. Hãy thiết kế một Google Form để thu thập
dữ liệu chia nhóm đồ án cuối kỳ cho một lớp đại học.

Yêu cầu:
- Tối đa 6 câu hỏi, sinh viên điền xong trong dưới 2 phút.
- Phải thu thập được: họ tên đầy đủ, giới tính (có lựa chọn "không muốn tiết lộ"),
  điểm trung bình học tập hiện tại (ghi rõ đang dùng thang điểm 4 hay thang điểm 10),
  các kỹ năng/thế mạnh (chọn nhiều trong danh sách cố định: Phân tích, Viết,
  Thuyết trình, Thiết kế, Điều phối — cộng thêm ô "khác" tự điền), và tối đa
  MỘT nguyện vọng ghép đôi với 1 bạn cùng lớp (không quá 1).
- Đầu form phải có đoạn giải thích ngắn: dữ liệu chỉ dùng để chia nhóm công bằng,
  không dùng cho mục đích khác, và GPA cá nhân sẽ không được công bố công khai
  (chỉ công bố GPA trung bình theo nhóm).
- Đưa ra: (a) danh sách câu hỏi kèm loại câu trả lời (trắc nghiệm/tự luận/thang đo),
  (b) gợi ý validation cho từng câu (bắt buộc hay không, định dạng số),
  (c) đoạn giới thiệu đầu form.

Output bằng tiếng Việt.
```

---

## 2. Làm sạch và chuẩn hoá dữ liệu

```
Bạn sẽ nhận một bảng dữ liệu thô thu thập từ form lớp học (dán bên dưới dấu ---).
Nhiệm vụ của bạn CHỈ là làm sạch và chuẩn hoá văn bản — KHÔNG tính toán số liệu,
KHÔNG tự chia nhóm, và TUYỆT ĐỐI KHÔNG BỊA RA giá trị cho ô nào còn thiếu dữ liệu.

Việc cần làm:
1. Gộp các cách viết khác nhau của cùng một kỹ năng vào đúng 1 trong 5 nhãn cố định:
   Phân tích, Viết, Thuyết trình, Thiết kế, Điều phối (ví dụ: "present", "thuyết
   trình", "nói trước đám đông" đều gộp về "Thuyết trình").
2. Chuẩn hoá giới tính về đúng 1 trong: Nữ / Nam / Khác / (để trống nếu không rõ).
3. Giữ nguyên điểm số như trong dữ liệu gốc — không quy đổi thang điểm, việc đó
   thuộc về công cụ chia nhóm, không phải bạn.
4. Xuất lại bảng dữ liệu đã làm sạch theo đúng định dạng:
   Họ tên | Giới tính | Điểm | Kỹ năng | Nguyện vọng ghép đôi

Sau bảng, bắt buộc phải có một mục riêng tên "CẢNH BÁO" liệt kê:
- Các dòng thiếu dữ liệu (ghi rõ thiếu trường nào, KHÔNG tự điền giá trị thay thế).
- Các tên nghi trùng lặp (chính tả gần giống nhau, có thể là 1 người ghi 2 lần).
- Các nguyện vọng ghép đôi trỏ tới người không có trong danh sách.
- Các điểm số nằm ngoài khoảng hợp lý (âm, lớn hơn 10, hoặc lớn hơn 4 nhưng lại
  ghi là thang điểm 4).

Dữ liệu thô:
---
[dán dữ liệu vào đây]
---
```

---

## 3. Tái tạo lại code công cụ chia nhóm (khi cần dựng lại từ đầu)

```
Hãy viết một file HTML DUY NHẤT (không CDN, không framework, không
localStorage/sessionStorage, chạy được khi mở trực tiếp bằng trình duyệt, không
cần server) để chia một lớp học thành các nhóm cân bằng.

Thuật toán bắt buộc gồm 2 giai đoạn, KHÔNG được dùng phân nhóm ngẫu nhiên thuần túy:

Giai đoạn A — Snake draft phân tầng:
- Trộn danh sách bằng RNG có seed (mulberry32 kết hợp hàm băm chuỗi thành số nguyên
  làm seed) để kết quả có thể lặp lại được với cùng một seed.
- Sắp xếp giảm dần theo điểm.
- Cắt thành các tầng (stratum), mỗi tầng có K người (K = số nhóm).
- Phân phối theo thứ tự rắn bò: tầng chẵn đi từ nhóm 0 đến K-1, tầng lẻ đi ngược
  từ K-1 về 0.

Giai đoạn B — Local search (hill climbing, swap 2 người ở 2 nhóm khác nhau):
Hàm chi phí (Cost) = 100×phương sai(GPA trung bình mỗi nhóm)
  + 40×phương sai(tỉ lệ giới tính thiểu số mỗi nhóm)
  + 3×số nhóm có ĐÚNG 1 người giới tính thiểu số (và sĩ số nhóm > 2)
  + 1.5×số cặp (nhóm, kỹ năng cốt lõi) còn thiếu kỹ năng đó
  + 2×số nguyện vọng ghép đôi chưa được thoả
  + 0.5×(tuỳ chọn) số họ trùng nhau tập trung vào 1 nhóm
Mỗi vòng lặp: chọn ngẫu nhiên 2 sinh viên ở 2 nhóm khác nhau, thử hoán đổi, chỉ
giữ lại nếu Cost giảm, ngược lại hoàn tác. Mặc định 20.000 vòng lặp, dừng sớm
nếu 2.000 vòng liên tiếp không cải thiện. Hoán đổi luôn giữ nguyên sĩ số từng nhóm.

Bộ phân tích dữ liệu đầu vào phải chịu được dữ liệu "bẩn": tự nhận diện dấu phân
tách (|, Tab, ; hoặc ,), bỏ qua dòng trống/dòng bắt đầu bằng # /dòng tiêu đề, tự
chuẩn hoá giới tính, tự nhận diện thang điểm 10 hay 4 (nếu có điểm nào > 4.5 thì
coi cả cột là thang 10 và nhân 0.4), và tự gán điểm trung bình lớp cho ô điểm
bị thiếu (đánh dấu là "đã suy diễn").

Giao diện: tối màu (dark theme), responsive, có ô dán danh sách lớp, nút tải dữ
liệu mẫu, nút tải CSV, các trường cấu hình (seed, số vòng lặp, chia theo sĩ số
hay số nhóm), 6 checkbox bật/tắt từng ràng buộc, bảng kiểm định công bằng, các
thẻ chỉ số PASS/CẦN XEM LẠI theo ngưỡng, lưới thẻ từng nhóm, và các nút xuất
CSV (có BOM UTF-8 để Excel hiển thị đúng tiếng Việt), copy văn bản thuần, copy
báo cáo công bằng.

Output toàn bộ bằng tiếng Việt có dấu.
```

---

## 4. Kiểm định độc lập (audit) — chạy trong cuộc trò chuyện MỚI

> **Quan trọng: chạy prompt này trong một cuộc trò chuyện mới hoàn toàn**, không
> phải cuộc trò chuyện đã dùng để tạo ra kết quả chia nhóm. Nếu dùng chung cuộc
> trò chuyện, AI đã "thấy" và có thể vô thức thiên vị bảo vệ kết quả nó vừa tạo ra.

```
Bạn là một người phản biện khó tính (hostile reviewer), KHÔNG phải người đã tạo
ra bảng chia nhóm dưới đây. Nhiệm vụ của bạn là cố tìm ra lỗi hoặc bất công trong
cách chia nhóm này, không phải khen ngợi.

Dữ liệu (danh sách từng nhóm kèm tên, giới tính, điểm, kỹ năng):
---
[dán bảng chia nhóm + bảng kiểm định công bằng vào đây]
---

Yêu cầu bắt buộc:
1. TỰ TÍNH LẠI từng chỉ số (không tin số liệu có sẵn): chênh lệch GPA giữa nhóm
   cao nhất/thấp nhất, số nhóm có đúng 1 người giới tính thiểu số, số nhóm thiếu
   kỹ năng cốt lõi nào, chênh lệch sĩ số. Trình bày phép tính, không chỉ kết luận.
2. Đưa ra 3 lý lẽ khiếu nại MẠNH NHẤT mà một sinh viên không hài lòng có thể nêu
   ra, và với mỗi lý lẽ, phán quyết rõ: lý lẽ đó có cơ sở hay không, dựa trên số
   liệu bạn vừa tự tính.
3. CẤM dùng các câu nhận xét mơ hồ kiểu "nhìn chung có vẻ khá cân bằng" — mọi
   nhận định phải đi kèm con số cụ thể.
4. Kết luận: bảng chia nhóm này có nên công bố ngay, hay cần chạy lại (đổi seed/
   tăng vòng lặp/đổi số nhóm) trước?

Output bằng tiếng Việt.
```

---

## 5. Viết thông báo cho lớp

```
Viết một thông báo gửi cho lớp về kết quả chia nhóm đồ án cuối kỳ, để dán thẳng
vào Zalo/Messenger.

Yêu cầu:
- Dưới 250 từ.
- Giọng văn ngang hàng (peer-to-peer), như một bạn cùng lớp thông báo, không phải
  giọng hành chính của phòng đào tạo.
- Phải nêu rõ: nhóm được chia bằng công cụ tự động cân bằng điểm/giới tính/kỹ
  năng, seed công khai đã dùng là gì, và câu: "bất kỳ ai chạy lại công cụ này
  với cùng seed sẽ ra kết quả giống hệt" (để khẳng định không ai can thiệp tay).
- Nêu rõ thời hạn khiếu nại (ví dụ 48 giờ) và cách gửi khiếu nại nếu phát hiện
  sai dữ liệu.
- Không liệt kê lại toàn bộ danh sách nhóm trong phần này (danh sách đính kèm
  riêng), thông báo chỉ giải thích ngắn gọn.

Output bằng tiếng Việt.
```

---

## 6. Xử lý khiếu nại

```
Bạn hỗ trợ phân loại khiếu nại về kết quả chia nhóm. Với mỗi khiếu nại sinh viên
gửi tới (dán bên dưới), hãy phân vào đúng 1 trong 4 nhóm sau và đề xuất hướng xử lý:

1. LỖI DỮ LIỆU — điểm/kỹ năng/giới tính ghi sai so với thực tế của sinh viên đó.
   → Sửa dữ liệu, chạy lại thuật toán với cùng seed, kiểm tra ngưỡng vẫn đạt.
2. ÁP DỤNG SAI TIÊU CHÍ — thuật toán có lỗi logic thật sự (ví dụ nhóm vẫn có
   đúng 1 người giới tính thiểu số dù ràng buộc đó đang bật).
   → Đây là lỗi công cụ, cần sửa code, không phải sửa dữ liệu.
3. KHÔNG THÍCH KẾT QUẢ NHƯNG QUY TRÌNH ĐÚNG — sinh viên không hài lòng vì lý do
   cá nhân (ví dụ không được vào nhóm bạn thân) nhưng dữ liệu và quy trình không
   có gì sai.
   → Giải thích lại quy trình, không thay đổi kết quả để giữ công bằng thủ tục
   cho những người khác.
4. HOÀN CẢNH ĐẶC BIỆT — có lý do chính đáng ngoài dữ liệu ban đầu (ví dụ vấn đề
   sức khoẻ, xung đột cá nhân đã biết từ trước, lịch học trùng nhóm).
   → Đề xuất một lần hoán đổi 1-đổi-1 (không phải chia lại từ đầu), sau đó BẮT
   BUỘC tính lại toàn bộ 4 chỉ số kiểm định (chênh GPA, solo-thiểu-số, kỹ năng
   thiếu, chênh sĩ số) để xác nhận vẫn đạt ngưỡng sau khi hoán đổi.

Khiếu nại:
---
[dán nội dung khiếu nại vào đây]
---

Output: phân loại + lý do + hướng xử lý cụ thể, bằng tiếng Việt.
```

---

## 7. Thiết lập nội bộ nhóm

```
Nhóm đồ án của tôi gồm các thành viên sau kèm kỹ năng khai báo (dán bên dưới).
Hãy giúp thiết lập vận hành nội bộ nhóm:

1. Đề xuất phân vai trò dựa trên kỹ năng THỰC TẾ đã khai báo của từng người
   (không đoán, không gán đều một cách máy móc nếu kỹ năng lệch nhau rõ).
2. Soạn một bản "team charter" ngắn: mục tiêu chung, cách ra quyết định khi bất
   đồng, kênh liên lạc chính, tần suất họp.
3. Lập lịch trình ngược (backward schedule) từ hạn nộp đồ án, chia thành các
   mốc kiểm tra tiến độ.
4. Soạn một rubric đánh giá chéo giữa các thành viên (peer evaluation) — tiêu
   chí cụ thể, thang điểm rõ ràng, không chỉ "đóng góp tốt/chưa tốt".

Thành viên và kỹ năng:
---
[dán danh sách vào đây]
---

Hạn nộp đồ án: [điền ngày]

Output bằng tiếng Việt.
```

---

## 8. Gợi ý đề tài (chuẩn bị sẵn cho bước sau)

```
Đề xuất một danh sách đề tài đồ án cho các nhóm trong lớp, với yêu cầu quan
trọng nhất: MỌI đề tài phải có độ khó tương đương nhau. Không đề tài nào được
dễ hơn hoặc khó hơn rõ rệt so với các đề tài còn lại.

Bắt buộc phải có một "bảng so sánh độ khó" liệt kê từng đề tài kèm các tiêu chí
đánh giá độ khó (ví dụ: khối lượng dữ liệu cần xử lý, số kỹ năng khác nhau cần
dùng, mức độ mơ hồ của yêu cầu, khối lượng code/thiết kế ước tính) và điểm số
độ khó ước lượng cho từng tiêu chí, để có thể đối chiếu công khai nếu có nhóm
thắc mắc đề tài của mình khó hơn nhóm khác.

QUAN TRỌNG VỀ QUY TRÌNH: đề tài chỉ được gán SAU KHI danh sách nhóm đã được
khoá (không đổi nhóm được nữa), và việc gán đề tài cho từng nhóm phải được bốc
thăm công khai trước cả lớp — không gán tay, để không ai nghi ngờ nhóm nào đó
được "ưu ái" chọn trước.

Số lượng nhóm: [điền số]
Chủ đề môn học: [điền tên môn / lĩnh vực]

Output bằng tiếng Việt.
```

---

## AI làm kém ở đâu trong quy trình này

| Việc | Vì sao không thể tin tưởng hoàn toàn | Nên dùng gì thay thế |
|---|---|---|
| Tự chia 40–100 người thành các nhóm cân bằng | LLM không thực sự cộng/tính phương sai một cách đáng tin cậy trên danh sách dài; nó tạo ra kết quả *trông hợp lý* chứ không đảm bảo đúng số học | Thuật toán xác định (deterministic) trong File 2 — snake draft + local search với hàm chi phí rõ ràng |
| Tự xác nhận kết quả của chính nó vừa tạo ra là công bằng | Thiên vị xác nhận (confirmation bias) — mô hình có xu hướng bảo vệ output nó vừa sinh ra thay vì phản biện thật sự | Audit độc lập trong một cuộc trò chuyện MỚI, đóng vai phản biện, bắt buộc tự tính lại số liệu |
| Suy diễn/bịa giá trị cho ô dữ liệu bị thiếu (điểm, giới tính) | AI có xu hướng "điền cho đủ" để câu trả lời trông hoàn chỉnh, dẫn đến dữ liệu giả trông như dữ liệu thật | Yêu cầu rõ ràng "không bịa giá trị", để hệ thống suy diễn bằng quy tắc cố định (điểm trung bình lớp) và luôn đánh dấu là "đã suy diễn" |
| Đảm bảo tính lặp lại (reproducibility) của kết quả | Mỗi lần gọi AI có thể cho câu trả lời khác nhau ngay cả với cùng input, không có khái niệm "seed" đáng tin cậy | RNG có seed công khai (mulberry32 + hàm băm chuỗi) chạy trong code, không qua AI |
| Đánh giá độ khó đề tài một cách khách quan tuyệt đối | AI có thể đánh giá lệch nếu mô tả đề tài không đối xứng về độ chi tiết | Dùng AI để *gợi ý* bảng so sánh, nhưng giảng viên/điều phối viên là người duyệt cuối cùng trước khi công bố |
