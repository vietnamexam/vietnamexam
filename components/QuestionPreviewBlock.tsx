import React, { useState, useEffect } from 'react';

const QuestionPreviewBlock = ({ data, onUpdateSingle }) => {
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise().catch((err) => console.log(err));
    }
  }, [data, editingItem]);

  if (!data || data.length === 0) return null;

  // --- Hàm lưu từ Modal về AdminPanel ---
  const handleLocalSave = (updatedItem) => {
    onUpdateSingle(updatedItem); // Gọi hàm update đẩy lên Sheet
    setEditingItem(null); // Đóng modal
  };

  return (
    <div className="h-full space-y-8 overflow-y-auto pr-4 no-scrollbar">
      {data.map((item, index) => (
        <div key={index} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm relative group animate-fade-in">
          
          {/* NÚT SỬA CỐ ĐỊNH (Không ẩn) */}
          <button 
            onClick={() => setEditingItem({ ...item, index })}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 z-10"
          >
            <i className="fa-solid fa-pen"></i> SỬA NHANH
          </button>

          {/* Header & Nội dung (Thầy giữ nguyên logic cũ của thầy ở đây) */}
          <div className="absolute top-0 left-0 bg-slate-900 text-white px-6 py-2 rounded-br-[1.5rem] font-black text-xs">
             Câu {index + 1}
          </div>
          <div className="mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: item.question }} />
          
          {/* ... (Phần RenderOptions và Lời giải giữ nguyên như code cũ của thầy) ... */}

        </div>
      ))}

      {/* ================= MODAL SỬA TẠI CHỖ ================= */}
      {editingItem && (
        <QuickEditModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={handleLocalSave} 
        />
      )}
    </div>
  );
};

// --- COMPONENT MODAL SỬA ---
const QuickEditModal = ({ item, onClose, onSave }) => {
  const [temp, setTemp] = useState({ ...item });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-black text-slate-800">SỬA NỘI DUNG CÂU {item.index + 1}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Câu hỏi (HTML/Text)</label>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 h-32 focus:border-blue-500 outline-none transition-all text-sm"
              value={temp.question}
              onChange={e => setTemp({...temp, question: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phương án (JSON)</label>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 h-32 focus:border-blue-500 outline-none text-xs font-mono"
                value={temp.options}
                onChange={e => setTemp({...temp, options: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Đáp án</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-blue-600"
                  value={temp.answer}
                  onChange={e => setTemp({...temp, answer: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ClassTag</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none"
                  value={temp.classTag}
                  onChange={e => setTemp({...temp, classTag: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Lời giải</label>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 h-24 focus:border-blue-500 outline-none text-sm"
              value={temp.loigiai}
              onChange={e => setTemp({...temp, loigiai: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-b-[2.5rem] flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-200 text-slate-600 rounded-2xl font-black">HỦY BỎ</button>
          <button 
            onClick={() => onSave(temp)}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            LƯU & ĐẨY LÊN SHEET
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreviewBlock;
