
import { Topic, ExamCodeDefinition, NewsItem, FixedConfig } from './types';
export const DANHGIA_URL = "https://script.google.com/macros/s/AKfycbwZdb9kvZk6acp9aVkZBvsV-4hXpnQOdHYzOS1jHFmvwPsYcjXz7IDBQ8xuF_PgB3Bkkg/exec";
// export const KETQUA_URL = "https://script.google.com/macros/s/AKfycbw06Dnf2Spsrm19NseYX-mucqa8b8Ayg0ni8B2hZNGVmjb3uoGW7VGkKSnOepKeYFQdGQ/exec";
export const ADMIN2_URL = "https://script.google.com/macros/s/AKfycbyQzEh1xGZFoAEas0fmxBY0bcz3P82nBtqSZKpbu9K7JzGEjVxCvCM8lIs24mp8IGg/exec";
export const SPREADSHEET_ID_ADMIN = "1LlFAI1J0b7YQ84BL674r2kr3wSoW9shgsXSIXVPDypM"; // Admin 1
export const URL_MAP = {
  "toan": "https://script.google.com/macros/s/AKfycbw06Dnf2Spsrm19NseYX-mucqa8b8Ayg0ni8B2hZNGVmjb3uoGW7VGkKSnOepKeYFQdGQ/exec",
  "vat-li": "https://script.google.com/macros/s/AKfycbw-DpEUUMXOxjk3NpSW8Luc3np7m6mLjbFau20pjgtA_tsBqosdhyYZ0i0toPhFfGoo/exec",
  "hoa-hoc": "https://script.google.com/macros/s/ID_SCRIPT_HOA/exec",
  "sinh-hoc": "https://script.google.com/macros/s/ID_SCRIPT_SINH/exec",
  "ngu-van": "https://script.google.com/macros/s/ID_SCRIPT_VAN/exec",
  "tieng-anh": "https://script.google.com/macros/s/ID_SCRIPT_ANH/exec",
  "lich-su": "https://script.google.com/macros/s/ID_SCRIPT_SU/exec",
  "dia-li": "https://script.google.com/macros/s/ID_SCRIPT_DIA/exec",
  "kt-pl": "https://script.google.com/macros/s/ID_SCRIPT_KTPL/exec",
  "cn-cn": "https://script.google.com/macros/s/ID_SCRIPT_CNCN/exec",
  "cn-nn": "https://script.google.com/macros/s/ID_SCRIPT_CNNN/exec"
};

// --- HÀM KIỂM TRA CHỌN MÔN DÙNG CHUNG ---
// --- HÀM KIỂM TRA & TRẢ VỀ URL MÔN HỌC ---
// Sửa handle_chonmon để linh hoạt hơn
export const handle_chonmon = (selectedMon: any) => {
  if (!selectedMon || !selectedMon.id) {
    alert("⚠️ Vui lòng chọn MÔN HỌC trước nhé cưng!");
    return null;
  }
  const KETQUA_URL = URL_MAP[selectedMon.id as keyof typeof URL_MAP];
  if (!KETQUA_URL || KETQUA_URL.includes("ID_SCRIPT")) {
    alert(`❌ Môn ${selectedMon.name} chưa được cấu hình hoặc đang bảo trì`);
    return null;
  }
  return KETQUA_URL;
};

// Sửa hàm fetch để trả về dữ liệu thay vì gán biến ngoài
export const fetchAdminConfig = async (selectedMon: any) => {
  const KETQUA_URL = handle_chonmon(selectedMon);
  if (!KETQUA_URL) return null;

  try {
    const response = await fetch(`${KETQUA_URL}?action=getAppConfig`);
    const result = await response.json();
    if (result.status === "success") return result.data.topics; 
  } catch (e) {
    console.error("Lỗi nạp chuyên đề:", e);
  }
  return null;
};
// Khởi tạo rỗng, chúng ta sẽ lấp đầy nó sau khi App chạy
export let TOPICS_DATA: Record<string, Topic[]> = {
  "6": [], "7": [], "8": [], "9": [], "10": [], "11": [], "12": []
};
export const GRADES = [6, 7, 8, 9, 10, 11, 12];
// Hàm này sẽ gọi lên Script Admin để lấy danh sách link
// Nạp chuyên đề
// config.ts
export const fetchAdminConfig = async (selectedMon: any) => {
  try {
    const KETQUA_URL = handle_chonmon(selectedMon);
    if (!KETQUA_URL) return false;
    const response = await fetch(`${KETQUA_URL}?action=getAppConfig`);
    const result = await response.json();

    if (result.status === "success" && result.data) {
      const { topics } = result.data;
      const newTopics: Record<string, Topic[]> = { 
        "6": [], "7": [], "8": [], "9": [], "10": [], "11": [], "12": [] 
      };
      
      topics.forEach((t: any) => {
        const gradeStr = t.grade.toString().trim(); // Ép Khối về String
        const idStr = t.id.toString().trim();       // Ép ID về String

        if (newTopics[gradeStr]) {
          newTopics[gradeStr].push({
            id: idStr,
            name: t.name.toString()
          });
        }
      });

      TOPICS_DATA = newTopics;
      return true;
    }
  } catch (e) { 
    console.error("Lỗi nạp chuyên đề:", e); 
  }
  return false;
};

export const CLASS_ID = ["9A", "10A1", "11A1", "12A1", "Lớp khác"];
export const ADMIN_CONFIG = {  
  quizPassword: "6688",
  schools: [
    "THPT Yên Dũng số 2",
    "THPT Yên Dũng số 1",
    "THPT Lạng Giang số 1",
    "Trường khác"
  ],
  banks: ["Vietcombank", "Agribank", "MB Bank", "Ngân hàng khác"],
  CLASS_ID: CLASS_ID
};
export const OTHER_APPS = [
  { label: "Nhóm Zalo hỗ trợ", icon: "fab fa-comment", link: "https://zalo.me/0988948882" },
  { label: "Kênh Youtube Toán", icon: "fab fa-youtube", link: "https://youtube.com/..." },
  { label: "Máy tính Online", icon: "fas fa-calculator", link: "https://www.desmos.com/scientific" },
  { label: "Từ điển Toán học", icon: "fas fa-language", link: "https://..." }
];

// Loại 45 phút : MCQ = 12 (0.5đ); TF = 2 (1đ, 1 câu mức 3); SA = 4 (0.5đ, 1 câu mức 3, 1 câu mức 4)
const CONFIG_45P: FixedConfig = {
  duration: 45,
  numMC: [12], scoreMC: 0.5, mcL3: [0], mcL4: [0],
  numTF: [2], scoreTF: 1, tfL3: [1], tfL4: [0],
  numSA: [4], scoreSA: 0.5, saL3: [1], saL4: [1]
};

// Loại 90 phút : MCQ = 12 (0.25đ); TF = 4 (1đ, 2 câu mức 3); SA = 6 (0.5đ, 1 câu mức 3, 1 câu mức 4)
const CONFIG_90P: FixedConfig = {
  duration: 90,
  numMC: [12], scoreMC: 0.25, mcL3: [0], mcL4: [0],
  numTF: [4], scoreTF: 1, tfL3: [2], tfL4: [0],
  numSA: [6], scoreSA: 0.5, saL3: [1], saL4: [1]
};

export const EXAM_CODES: Record<number, ExamCodeDefinition[]> = {
 
  10: [
    { code: "TD_45_K10", name: "Tự do 45 phút (Khối 10)", topics: 'manual', fixedConfig: CONFIG_45P },
    { code: "TD_90_K10", name: "Tự do 90 phút (Khối 10)", topics: 'manual', fixedConfig: CONFIG_90P }
  ],
  11: [
    { code: "TD_45_K11", name: "Tự do 45 phút (10+11)", topics: 'manual', fixedConfig: CONFIG_45P },
    { code: "TD_90_K11", name: "Tự do 90 phút (10+11)", topics: 'manual', fixedConfig: CONFIG_90P }
  ],
  12: [
    { code: "TD_45_K12", name: "Tự do 45 phút (10+11+12)", topics: 'manual', fixedConfig: CONFIG_45P },
    { code: "TD_90_K12", name: "Tự do 90 phút (10+11+12)", topics: 'manual', fixedConfig: CONFIG_90P }
  ]
};
