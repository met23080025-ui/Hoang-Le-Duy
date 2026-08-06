// Kiểm thử thuật toán chia nhóm.
// Không cài thêm package nào. Đọc thẳng file HTML, cắt lấy đúng đoạn JS lõi
// (từ comment "/* ---------- RNG" đến trước "/* ---------- UI") rồi eval trong
// một sandbox riêng bằng module vm — nhờ vậy test chạy đúng code đang chạy
// trong ứng dụng, không phải bản sao chép.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML_PATH = path.join(__dirname, '..', '02-CONG-CU-CHIA-NHOM.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Không tìm thấy thẻ <script> trong file HTML.');
const scriptContent = scriptMatch[1];

const startMarker = '/* ---------- RNG';
const endMarker = '/* ---------- UI';
const startIdx = scriptContent.indexOf(startMarker);
const endIdx = scriptContent.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1) throw new Error('Không tìm thấy các mốc comment RNG/UI trong script.');
const coreCode = scriptContent.slice(startIdx, endIdx);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(coreCode, sandbox, { filename: 'core-extracted.js' });

const {
  seededRng, shuffleArray, parseRoster, splitIntoTeams, auditTeams,
  detectMinorityGender, detectCoreSkills, defaultConstraints, SAMPLE_DATA,
} = sandbox;

let failures = 0;
function check(label, condition, detail) {
  const ok = !!condition;
  if (!ok) failures++;
  console.log((ok ? '  [OK] ' : '  [FAIL] ') + label + (detail ? ' — ' + detail : ''));
  return ok;
}
function section(title) {
  console.log('\n=== ' + title + ' ===');
}

// ---------------------------------------------------------------------------
// Roster tổng hợp dùng cho các test cần cỡ mẫu lớn hơn hoặc đặc thù hơn mẫu 40
// sinh viên có sẵn trong app.
const SKILLS_CYCLE = ['Phân tích', 'Viết', 'Thuyết trình', 'Thiết kế', 'Điều phối'];
function generateSyntheticRoster(n, opts) {
  opts = opts || {};
  const lines = [];
  for (let i = 0; i < n; i++) {
    const gender = opts.allMale ? 'Nam' : (opts.minorityEvery ? (i % opts.minorityEvery === 0 ? 'Nữ' : 'Nam') : (i % 2 === 0 ? 'Nam' : 'Nữ'));
    const score = opts.sameScore != null ? opts.sameScore : (2.4 + (i % 16) * 0.1).toFixed(2);
    const skill = SKILLS_CYCLE[i % SKILLS_CYCLE.length];
    const buddy = opts.buddyPairs && opts.buddyPairs[i] != null ? 'SV' + opts.buddyPairs[i] : '';
    lines.push('SV' + i + ' | ' + gender + ' | ' + score + ' | ' + skill + ' | ' + buddy);
  }
  return lines.join('\n');
}
function pureRandomAssignment(students, K, rng) {
  const shuffled = shuffleArray(students, rng);
  const n = shuffled.length;
  const base = Math.floor(n / K), rem = n % K;
  const teams = [];
  let idx = 0;
  for (let i = 0; i < K; i++) {
    const size = base + (i < rem ? 1 : 0);
    teams.push(shuffled.slice(idx, idx + size));
    idx += size;
  }
  return teams;
}

// ---------------------------------------------------------------------------
section('1. Mẫu 40 sinh viên qua 4 seed khác nhau (chia theo nhóm 5 người, K=8)');
const seeds = ['seed-1', 'seed-2', 'seed-3', 'seed-4'];
for (const seed of seeds) {
  const result = splitIntoTeams(SAMPLE_DATA, { teamSize: 5, seed, iterations: 20000 });
  const a = result.audit;
  console.log(
    '  seed=' + seed +
    ' | chênh GPA=' + a.gpaGap.toFixed(3) +
    ' | nhóm solo-thiểu-số=' + a.soloMinorityTeams +
    ' | cặp (nhóm,kỹ năng) thiếu=' + a.totalMissingSkillPairs +
    ' | tỉ lệ ghép đôi đạt=' + (a.buddySatisfaction * 100).toFixed(0) + '%'
  );
  check('seed ' + seed + ': chênh lệch GPA < 0.3', a.thresholds.gpaGapPass, 'gap=' + a.gpaGap.toFixed(3));
  check('seed ' + seed + ': không có nhóm solo-thiểu-số', a.thresholds.soloMinorityPass);
  check('seed ' + seed + ': đủ kỹ năng cốt lõi mỗi nhóm', a.thresholds.skillsPass);
  check('seed ' + seed + ': sĩ số các nhóm chênh lệch ≤ 1', a.thresholds.sizeGapPass);
}

// ---------------------------------------------------------------------------
section('2. Tối ưu (20.000 vòng) so với chưa tối ưu (0 vòng, chỉ snake draft)');
{
  const seed = 'compare-seed';
  const draftOnly = splitIntoTeams(SAMPLE_DATA, { teamSize: 5, seed, iterations: 0 });
  const optimized = splitIntoTeams(SAMPLE_DATA, { teamSize: 5, seed, iterations: 20000 });
  console.log('  chi phí chỉ-snake-draft = ' + draftOnly.finalCost.toFixed(3));
  console.log('  chi phí sau tối ưu      = ' + optimized.finalCost.toFixed(3));
  console.log('  chênh GPA chỉ-draft = ' + draftOnly.audit.gpaGap.toFixed(3) + ' | chênh GPA sau tối ưu = ' + optimized.audit.gpaGap.toFixed(3));
  check('Stage B (local search) làm giảm chi phí so với chỉ snake draft', optimized.finalCost <= draftOnly.finalCost);
}

// ---------------------------------------------------------------------------
section('3. So sánh với 100 lần chia hoàn toàn ngẫu nhiên (bốc thăm)');
{
  const parsed = parseRoster(SAMPLE_DATA);
  const students = parsed.students;
  const K = 8;
  const minorityGender = detectMinorityGender(students);
  const coreSkills = detectCoreSkills(students, K);
  const ctx = { minorityGender, coreSkills, constraints: defaultConstraints() };

  const gaps = [], solos = [];
  for (let i = 0; i < 100; i++) {
    const rng = seededRng('random-run-' + i);
    const teams = pureRandomAssignment(students, K, rng);
    const audit = auditTeams(teams, ctx);
    gaps.push(audit.gpaGap);
    solos.push(audit.soloMinorityTeams);
  }
  const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const worstGap = Math.max(...gaps);
  const meanSolo = solos.reduce((a, b) => a + b, 0) / solos.length;

  const toolResult = splitIntoTeams(SAMPLE_DATA, { teamSize: 5, seed: 'seed-1', iterations: 20000 });

  console.log('  Ngẫu nhiên (100 lần)  — chênh GPA trung bình = ' + meanGap.toFixed(3) + ', tệ nhất = ' + worstGap.toFixed(3) + ', số nhóm solo-thiểu-số trung bình = ' + meanSolo.toFixed(2));
  console.log('  Công cụ (snake+tối ưu) — chênh GPA           = ' + toolResult.audit.gpaGap.toFixed(3) + ', số nhóm solo-thiểu-số = ' + toolResult.audit.soloMinorityTeams);
  check('Công cụ cho chênh lệch GPA thấp hơn hẳn so với ngẫu nhiên', toolResult.audit.gpaGap < meanGap);
}

// ---------------------------------------------------------------------------
section('4. K = 5, 6, 7, 9, 10, 13 — sĩ số các nhóm không lệch quá 1');
{
  const roster = generateSyntheticRoster(131); // số nguyên tố -> hầu như không chia hết cho các K bên dưới
  for (const K of [5, 6, 7, 9, 10, 13]) {
    const result = splitIntoTeams(roster, { numTeams: K, seed: 'k-test', iterations: 5000 });
    const sizes = result.teams.map(t => t.length);
    console.log('  K=' + K + ' | sĩ số các nhóm: [' + sizes.join(', ') + ']');
    check('K=' + K + ': chênh lệch sĩ số ≤ 1', result.audit.sizeGap <= 1, 'sizeGap=' + result.audit.sizeGap);
  }
}

// ---------------------------------------------------------------------------
section('5. Các trường hợp biên (edge cases)');
{
  // Thang điểm 10
  const r10 = splitIntoTeams(
    'A|Nam|8.5|Viết|\nB|Nữ|7.0|Thiết kế|\nC|Nam|9.0|Phân tích|\nD|Nữ|6.5|Điều phối|',
    { numTeams: 2, seed: 's', iterations: 100 }
  );
  check('Tự nhận diện thang điểm 10 và quy đổi hệ số 0.4', Math.abs(r10.scaleFactor - 0.4) < 1e-9, 'scaleFactor=' + r10.scaleFactor);

  // Thiếu điểm
  const rMissing = parseRoster('A|Nam||Viết|\nB|Nữ|3.0|Thiết kế|\nC|Nam|3.5|Phân tích|');
  const aRec = rMissing.students.find(s => s.name === 'A');
  check('Thiếu điểm được gán điểm trung bình lớp và đánh dấu imputed', aRec.imputed === true);

  // Không có cột giới tính (rỗng)
  const rNoGender = splitIntoTeams('A||3.0|Viết|\nB||3.2|Thiết kế|\nC||2.9|Phân tích|\nD||3.5|Điều phối|', { numTeams: 2, seed: 's', iterations: 100 });
  check('Không có dữ liệu giới tính -> minorityGender = null, không lỗi', rNoGender.minorityGender === null);

  // Dấu phẩy làm delimiter
  const rComma = parseRoster('A,Nam,3.0,Viết,\nB,Nữ,3.2,Thiết kế,\nC,Nam,2.9,Phân tích,');
  check('Nhận diện dấu phẩy làm delimiter, đọc đủ 3 sinh viên', rComma.students.length === 3, 'đọc được ' + rComma.students.length);

  // Tab làm delimiter
  const rTab = parseRoster('A\tNam\t3.0\tViết\t\nB\tNữ\t3.2\tThiết kế\t\nC\tNam\t2.9\tPhân tích\t');
  check('Nhận diện Tab làm delimiter, đọc đủ 3 sinh viên', rTab.students.length === 3, 'đọc được ' + rTab.students.length);

  // Có dòng tiêu đề
  const rHeader = parseRoster('Họ tên | Giới tính | Điểm | Kỹ năng | Bạn muốn ghép\nA|Nam|3.0|Viết|\nB|Nữ|3.2|Thiết kế|');
  check('Bỏ qua dòng tiêu đề, chỉ đọc dữ liệu thật', rHeader.students.length === 2, 'đọc được ' + rHeader.students.length);

  // Nguyện vọng ghép đôi trỏ tới người không tồn tại
  const rGhostBuddy = parseRoster('A|Nam|3.0|Viết|Người Không Tồn Tại\nB|Nữ|3.2|Thiết kế|');
  const aGhost = rGhostBuddy.students.find(s => s.name === 'A');
  check('Nguyện vọng ghép đôi trỏ tới người không có trong danh sách bị bỏ qua êm, không lỗi', aGhost.buddyId === null);

  // Điểm giống hệt nhau
  const roster10 = generateSyntheticRoster(10, { sameScore: 3.0 });
  const rSame = splitIntoTeams(roster10, { numTeams: 2, seed: 's', iterations: 1000 });
  check('Điểm giống hệt nhau -> chênh lệch GPA = 0', rSame.audit.gpaGap === 0, 'gap=' + rSame.audit.gpaGap);

  // N không chia hết cho K
  const roster11 = generateSyntheticRoster(11);
  const rIndivisible = splitIntoTeams(roster11, { numTeams: 3, seed: 's', iterations: 500 });
  check('11 người chia 3 nhóm -> sĩ số chênh lệch ≤ 1', rIndivisible.audit.sizeGap <= 1, 'sizes=' + rIndivisible.teams.map(t => t.length));

  // Lớp lệch giới tính nặng (90% nam)
  const roster90 = generateSyntheticRoster(20, { minorityEvery: 10 }); // 90% Nam, 10% Nữ
  const r90 = splitIntoTeams(roster90, { numTeams: 4, seed: 's', iterations: 2000 });
  check('Lớp 90% nam vẫn nhận diện đúng giới tính thiểu số là Nữ, không lỗi', r90.minorityGender === 'Nữ');
}

// ---------------------------------------------------------------------------
section('6. Hiệu năng: 200 sinh viên chia thành 40 nhóm');
{
  const roster200 = generateSyntheticRoster(200);
  const t0 = Date.now();
  const result = splitIntoTeams(roster200, { numTeams: 40, seed: 'perf', iterations: 20000 });
  const elapsed = Date.now() - t0;
  console.log('  Thời gian chạy: ' + elapsed + 'ms (200 sinh viên, 40 nhóm, 20.000 vòng lặp tối ưu)');
  check('Chạy dưới 1000ms', elapsed < 1000, elapsed + 'ms');
  check('Sĩ số các nhóm vẫn chênh lệch ≤ 1', result.audit.sizeGap <= 1);
}

// ---------------------------------------------------------------------------
console.log('\n=== TỔNG KẾT ===');
if (failures === 0) {
  console.log('Tất cả kiểm định đều ĐẠT.');
} else {
  console.log(failures + ' kiểm định KHÔNG đạt. Xem chi tiết [FAIL] ở trên.');
  process.exitCode = 1;
}
