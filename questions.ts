import { Question } from './types';
import { DANHGIA_URL, API_ROUTING  } from './config';

// 1. Lưu trữ ngân hàng câu hỏi
export let questionsBank: Question[] = [];

// 2. Hàm nạp dữ liệu từ Google Sheet
export const fetchQuestionsBank = async (): Promise<Question[]> => {
  try {
    const response = await fetch(`${DANHGIA_URL}?action=getQuestions`);
    const result = await response.json();
    
    if (result.status === "success" && Array.isArray(result.data)) {
      questionsBank = result.data;
      console.log(`✅ Đã nạp ${questionsBank.length} câu hỏi vào hệ thống.`);
      return questionsBank;
    } 
    return [];
  } catch (error) {
    console.error("❌ Lỗi kết nối ngân hàng câu hỏi:", error);
    return [];
  }
};
// Hàm chuẩn hóa câu hỏi: loại bỏ Latex và dấu câu để so sánh lời dẫn
const normalizeQuestion = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\$.*?\$/g, " [MATH] ") // Khử Latex
    .toLowerCase()
    // Thêm dấu : vào list loại bỏ bên dưới
    .replace(/[.,?!:\-\(\)]/g, " ") 
    .trim()
    .replace(/\s+/g, " "); // Dọn dẹp khoảng trắng thừa
};

// Tính tỉ lệ trùng dựa trên số từ (Word-based Jaccard-ish)
const getSimilarityScore = (q1: string, q2: string): number => {
  const s1 = new Set(normalizeQuestion(q1).split(" "));
  const s2 = new Set(normalizeQuestion(q2).split(" "));
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  return (2.0 * intersection.size) / (s1.size + s2.size);
};

// 3. Hàm trộn mảng
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// 4. Hàm lấy đề thi thông minh
export const pickQuestionsSmart = (
  topicIds: string[], 
  counts: { mc: number[], tf: number[], sa: number[] },
  levels: { mc3: number[], mc4: number[], tf3: number[], tf4: number[], sa3: number[], sa4: number[] }
) => {
  let selectedPart1: Question[] = [];
  let selectedPart2: Question[] = [];
  let selectedPart3: Question[] = [];
  
  if (questionsBank.length === 0) return [];

  topicIds.forEach((tid, idx) => {
    const tidStr = tid.toString();
    const pool = questionsBank.filter(q => {
      const tag = q.classTag.toString();
      return tag === tidStr || tag.startsWith(tidStr + ".");
    });

    // --- HÀM LẤY CÂU HỎI THÔNG MINH MỚI ---
    const getSub = (type: string, l3: number, l4: number, total: number) => {
      const typePool = pool.filter(q => q.type === type);
      
      const p4 = shuffleArray(typePool.filter(q => q.classTag.toString().endsWith(".d")));
      const p3 = shuffleArray(typePool.filter(q => q.classTag.toString().endsWith(".c")));
      const pOther = shuffleArray(typePool.filter(q => 
        !q.classTag.toString().endsWith(".c") && !q.classTag.toString().endsWith(".d")
      ));

      let result: Question[] = [];

      // Hàm con để chọn câu hỏi và lọc tương tự
      const pickFromPool = (source: Question[], limit: number) => {
        let pickedCount = 0;
        for (const candidate of source) {
          if (pickedCount >= limit) break;

          // Kiểm tra tương tự với các câu đã chọn TRONG CÙNG NHÓM (tidStr)
          const isSimilar = result.some(selected => {
            // Lớp 1: 4 ký tự đầu classTag giống nhau
            const tagMatch = selected.classTag.toString().substring(0, 4) === candidate.classTag.toString().substring(0, 4);
            // Lớp 2: Type giống nhau (đã lọc ở typePool)
            // Lớp 3: So sánh question
            if (tagMatch) {
              return getSimilarityScore(selected.question, candidate.question) > 0.85; // Ngưỡng 85%
            }
            return false;
          });

          if (!isSimilar) {
            result.push(candidate);
            pickedCount++;
          }
        }
      };

      // Thực hiện chọn theo thứ tự ưu tiên mức độ
      pickFromPool(p4, l4);
      const deficit4 = Math.max(0, l4 - result.length);
      pickFromPool(p3, l3 + deficit4);
      
      const remainingNeeded = total - result.length;
      if (remainingNeeded > 0) {
        pickFromPool(pOther, remainingNeeded);
      }

      return result;
    };
    // --- KẾT THÚC HÀM LẤY CÂU HỎI MỚI ---

    selectedPart1 = [...selectedPart1, ...getSub('mcq', levels.mc3[idx] || 0, levels.mc4[idx] || 0, counts.mc[idx] || 0)];
    selectedPart2 = [...selectedPart2, ...getSub('true-false', levels.tf3[idx] || 0, levels.tf4[idx] || 0, counts.tf[idx] || 0)];
    selectedPart3 = [...selectedPart3, ...getSub('short-answer', levels.sa3[idx] || 0, levels.sa4[idx] || 0, counts.sa[idx] || 0)];
  });
  // Trộn đáp án trước khi xuất xưởng
  return [...selectedPart1, ...selectedPart2, ...selectedPart3].map(q => {
    const newQ = { ...q };
    if (newQ.o && newQ.type === 'mcq') {
      newQ.shuffledOptions = shuffleArray(newQ.o);
    }
    if (newQ.s && newQ.type === 'true-false') {
      newQ.s = shuffleArray(newQ.s);
    }
    return newQ;
  });
};
export const fetchScore = async (
  idgv: string,
  sbd: string,
  exams: string
) => {

  if (!API_ROUTING[idgv]) {
    await fetchApiRouting();   // 👈 bắt buộc load lại
  }

  const baseUrl = API_ROUTING[idgv];
  if (!baseUrl) return null;

  const url = `${baseUrl}?action=getScore&sbd=${sbd}&exams=${exams}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "success") {
    return data.data;
  }

  return null;
};
export const resetQuiz = async () => {

  if (!API_ROUTING["admin2"]) {
    await fetchApiRouting();
  }

  const baseUrl = API_ROUTING["admin2"];

  if (!baseUrl) {
    alert("Không tìm thấy routing admin2");
    return false;
  }

  try {
    const res = await fetch(`${baseUrl}?action=resetQuiz`);
    const data = await res.json();

    return data.status === "success";
  } catch (err) {
    console.error("Lỗi resetQuiz:", err);
    return false;
  }
};


