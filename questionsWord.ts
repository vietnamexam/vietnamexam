import { Question } from './types';
import { handle_chonmon } from './config';

export let questionsBankW: Question[] = [];

// Hàm trộn mảng ngẫu nhiên cơ bản
const shuffle = <T>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const shuffleByTypeParts = (data: Question[]): Question[] => {
  const mcq: Question[] = [];
  const tf: Question[] = [];
  const sa: Question[] = [];
  const other: Question[] = [];

   data.forEach(q => {
    const type = (q.type || '').toLowerCase().trim();

    const newQ: Question = { ...q };

    if (type === 'mcq' && Array.isArray(newQ.o)) {
      newQ.o = shuffle(newQ.o);
    }

    if (type === 'true-false' && Array.isArray(newQ.s)) {
      newQ.s = shuffle(newQ.s);
    }

    if (type === 'mcq') mcq.push(newQ);
    else if (type === 'true-false' || type === 'tf') tf.push(newQ);
    else if (type === 'short-answer' || type === 'sa') sa.push(newQ);
    else other.push(newQ);
  });
  console.log("MCQ shuffled:", mcq);
  console.log("TF shuffled:", tf);

  return [
    ...shuffle(mcq),
    ...shuffle(tf),
    ...shuffle(sa),
    ...shuffle(other)
  ];
};

export const fetchQuestionsBankW = async (
  selectedMon,
  examCode?: string,
  idgv?: string,
  customUrl?: string
): Promise<Question[]> => {
  try {
    const KETQUA_URL = handle_chonmon(selectedMon);
    if (!KETQUA_URL) return [];       
    const finalUrl = examCode
      ? `${KETQUA_URL}?action=getQuestionsByCode&examCode=${examCode}`
      : `${KETQUA_URL}?action=getQuestions`;

    const response = await fetch(finalUrl);
    const result = await response.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      // THỰC HIỆN TRỘN THEO PHẦN TRƯỚC KHI GÁN
      questionsBankW = shuffleByTypeParts(result.data);
      console.log("Dữ liệu đã trộn theo Type:", questionsBankW);
      return questionsBankW;
    }
    return [];
  } catch (error) {
    console.error("Lỗi fetch questions:", error);
    return [];
  }
};
