// ============ Review câu hỏi lẻ ==============
import React, { useState } from "react";

export default function ReviewEditor({ questions, onSave }) {

  const [data, setData] = useState(
    questions.map(q => {
      try {
        const obj = JSON.parse(q.question);
        return { ...q, parsed: obj };
      } catch {
        return { ...q, parsed: {} };
      }
    })
  );

 const updateField = (idx, field, value) => {

  const copy = [...data];

  copy[idx] = {
    ...copy[idx],
    parsed: {
      ...copy[idx].parsed,
      [field]: value
    }
  };

  setData(copy);
};

  const updateOption = (idx, optIdx, value) => {

  const copy = [...data];

  const options = [...(copy[idx].parsed.o || ["","","",""])];

  options[optIdx] = value;

  copy[idx] = {
    ...copy[idx],
    parsed: {
      ...copy[idx].parsed,
      o: options
    }
  };

  setData(copy);
};

  const handleSave = () => {
    const result = data.map(q => ({
      id: q.id,
      classTag: q.classTag,
      type: q.type,
      question: JSON.stringify(q.parsed)
    }));

    onSave(result);
  };

  return (
    <div className="space-y-8 mt-8">

      {data.map((q, idx) => {

        const obj = q.parsed || {};
        const type = obj.type || q.type;

        return (
          <div key={idx} className="border p-6 rounded-xl bg-white shadow">

            <div className="font-bold mb-2 flex justify-between">
            <span>Câu {idx + 1}</span>
            <span className="text-xs text-gray-500">{type}</span>
            </div>

            {/* QUESTION */}
            <textarea
  className="w-full border p-3 rounded mb-4 min-h-[160px] font-mono text-sm"
  value={obj.question || ""}
  onChange={e =>
    updateField(idx, "question", e.target.value)
  }
/>

            {/* MCQ */}
            {type === "mcq" && (
              <div className="space-y-2">

                {(obj.o || ["", "", "", ""]).map((opt, i) => (
                  <div key={i} className="flex gap-2">

                    <div className="font-bold w-6">
                      {String.fromCharCode(65 + i)}
                    </div>

                    <input
                      className="flex-1 border p-2 rounded"
                      value={opt}
                      onChange={e =>
                        updateOption(idx, i, e.target.value)
                      }
                    />

                  </div>
                ))}

                <div className="mt-2">
                  Answer:

                  <select
                    className="border ml-2 p-1"
                    value={obj.a || ""}
                    onChange={e =>
                      updateField(idx, "a", e.target.value)
                    }
                  >
                    <option value="">--</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>

                </div>

              </div>
            )}

            {/* SHORT ANSWER */}
            {(type === "sa" || type === "short-answer") && (
              <div className="mt-3">

                <input
                  className="border p-2 rounded w-full"
                  placeholder="Đáp án"
                  value={obj.a || ""}
                  onChange={e =>
                    updateField(idx, "a", e.target.value)
                  }
                />

              </div>
            )}

          </div>
        );
      })}

      <button
        onClick={handleSave}
        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
      >
        LƯU CÂU HỎI
      </button>

    </div>
  );
}
