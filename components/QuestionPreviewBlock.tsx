import React, { useEffect, useState } from 'react';

const QuestionPreviewBlock = ({ data, onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempItem, setTempItem] = useState(null);

  useEffect(() => {
    if (window.MathJax) {
      const timer = setTimeout(() => {
        window.MathJax.typesetPromise().catch((err) => console.log(err));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [data, editingIndex]);

  if (!data || data.length === 0) return null;

  const handleSave = () => {
    const newData = [...data];
    newData[editingIndex] = tempItem;
    onChange(newData);
    setEditingIndex(null);
    setTempItem(null);
  };

  const startEdit = (item, index) => {
    setEditingIndex(index);
    setTempItem({ ...item });
  };

  const renderOptions = (item) => {
    try {
      const isShortAnswer = !item.options || item.options === "" || item.options === "[]";
      if (isShortAnswer) {
        return (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-100 rounded-[1.5rem] flex items-center justify-between">
            <span className="text-[10px] font-black text-blue-600 uppercase">Đáp số:</span>
            <b className="text-xl text-blue-700 tracking-widest">{item.answer}</b>
          </div>
        );
      }

      const options = typeof item.options === 'string'
        ? JSON.parse(item.options)
        : item.options;

      const labels = ['A', 'B', 'C', 'D'];
      const entries = Array.isArray(options) ? options : Object.values(options);

      return (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {entries.map((text, i) => {
              const isCorrect = item.answer === labels[i];
              return (
                <div key={i} className={`p-3 rounded-xl border-2 flex items-center gap-3 ${isCorrect ? 'border-rose-200 bg-rose-50/30' : 'border-slate-50 bg-white'}`}>
                  <b className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] ${isCorrect ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {labels[i]}
                  </b>
                  <span className={`text-sm ${isCorrect ? 'font-semibold text-rose-900' : 'text-slate-600'}`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end">
            <div className="bg-rose-600 text-white px-6 py-2 rounded-2xl shadow-lg">
              <b className="text-xl font-black">ĐÁP ÁN: {item.answer}</b>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return <div className="mt-2 p-3 bg-slate-100 rounded-lg text-xs italic text-rose-500">Lỗi dữ liệu</div>;
    }
  };

  return (
    <div className="h-full space-y-8 overflow-y-auto pr-4">
      {data.map((item, index) => (
        <div key={index} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm relative group">

          {/* HEADER */}
          <div className="absolute top-0 left-0 flex items-center">
            <div className="bg-slate-900 text-white px-6 py-2 rounded-br-[1.5rem] font-black text-xs uppercase">
              Câu {index + 1}
            </div>
            <div className="px-4 text-[10px] font-bold text-slate-400">
              ID: {item.id} • {item.classTag}
            </div>
          </div>

          {/* NÚT SỬA */}
          <button
            onClick={() => startEdit(item, index)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition"
          >
            SỬA
          </button>

          {/* NỘI DUNG */}
          {editingIndex === index ? (
            <div className="mt-8 space-y-4">

              <textarea
                className="w-full p-4 border rounded-xl"
                value={tempItem.question}
                onChange={(e) =>
                  setTempItem({ ...tempItem, question: e.target.value })
                }
              />

              <textarea
                className="w-full p-4 border rounded-xl"
                value={tempItem.options}
                onChange={(e) =>
                  setTempItem({ ...tempItem, options: e.target.value })
                }
              />

              <input
                className="w-full p-4 border rounded-xl"
                value={tempItem.answer}
                onChange={(e) =>
                  setTempItem({ ...tempItem, answer: e.target.value })
                }
              />

              <textarea
                className="w-full p-4 border rounded-xl"
                value={tempItem.loigiai}
                onChange={(e) =>
                  setTempItem({ ...tempItem, loigiai: e.target.value })
                }
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                >
                  LƯU
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="px-6 py-3 bg-slate-200 rounded-xl font-bold text-xs"
                >
                  HỦY
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="mt-8 text-slate-800 font-medium leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: item.question }}
              />
              {renderOptions(item)}
              {item.loigiai && (
                <div className="mt-6 p-6 bg-slate-50 rounded-[2.5rem] border border-dashed">
                  <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase">
                    Hướng dẫn giải
                  </span>
                  <div
                    className="text-sm text-slate-600 italic"
                    dangerouslySetInnerHTML={{ __html: item.loigiai }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className="h-20"></div>
    </div>
  );
};

export default QuestionPreviewBlock;
