// ============ Review câu hỏi lẻ ==============
// ============ Review câu hỏi lẻ ==============
import React, { useState } from "react";

export default function ReviewEditor({ questions, onSave }) {

  const [data, setData] = useState(questions);

  const updateField = (idx, field, value) => {
    const copy = [...data];
    copy[idx] = {
      ...copy[idx],
      [field]: value
    };
    setData(copy);
  };

  const updateOption = (idx, optIdx, value) => {
    const copy = [...data];
    const options = [...(copy[idx].o || ["","","",""])];
    options[optIdx] = value;

    copy[idx] = {
      ...copy[idx],
      o: options
    };

    setData(copy);
  };

  const updateTrueFalse = (idx, sIdx, field, value) => {
    const copy = [...data];
    const list = [...(copy[idx].s || [])];

    list[sIdx] = {
      ...list[sIdx],
      [field]: value
    };

    copy[idx] = {
      ...copy[idx],
      s: list
    };

    setData(copy);
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="space-y-8 mt-8">

      {data.map((q, idx) => {

        const type = q.type;

        return (
          <div key={idx} className="border p-6 rounded-xl bg-white shadow">

            <div className="font-bold mb-3 flex justify-between">
              <span>Câu {idx + 1}</span>
              <span className="text-xs text-gray-500">{type}</span>
            </div>

            {/* QUESTION */}
            <textarea
              className="w-full border p-3 rounded mb-4 min-h-[160px] font-mono text-sm"
              value={q.question || ""}
              onChange={e =>
                updateField(idx, "question", e.target.value)
              }
            />

            {/* PREVIEW */}
            <div
              className="prose max-w-none mb-4 p-3 bg-gray-50 rounded"
              dangerouslySetInnerHTML={{ __html: q.question }}
            />

            {/* ================= MCQ ================= */}
            {type === "mcq" && (
              <div className="space-y-2">

                {(q.o || ["","","",""]).map((opt, i) => (
                  <div key={i} className="flex gap-2 items-start">

                    <div className="font-bold w-6 pt-2">
                      {String.fromCharCode(65+i)}
                    </div>

                    <textarea
                      className="flex-1 border p-2 rounded"
                      rows={2}
                      value={opt}
                      onChange={e =>
                        updateOption(idx, i, e.target.value)
                      }
                    />

                  </div>
                ))}

                <div className="mt-3">
                  Answer:

                  <select
                    className="border ml-2 p-1"
                    value={q.a || ""}
                    onChange={e =>
                      updateField(idx, "a", e.target.value)
                    }
                  >
                    <option value="">--</option>
                    <option value={q.o?.[0]}>A</option>
                    <option value={q.o?.[1]}>B</option>
                    <option value={q.o?.[2]}>C</option>
                    <option value={q.o?.[3]}>D</option>
                  </select>

                </div>

              </div>
            )}

            {/* ================= TRUE FALSE ================= */}
            {type === "true-false" && (
              <div className="space-y-3">

                {(q.s || []).map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">

                    <div className="font-bold pt-2">
                      {String.fromCharCode(97+i)}
                    </div>

                    <textarea
                      className="flex-1 border p-2 rounded"
                      rows={2}
                      value={item.text}
                      onChange={e =>
                        updateTrueFalse(idx, i, "text", e.target.value)
                      }
                    />

                    <select
                      className="border p-2"
                      value={item.a ? "true" : "false"}
                      onChange={e =>
                        updateTrueFalse(idx, i, "a", e.target.value === "true")
                      }
                    >
                      <option value="true">Đúng</option>
                      <option value="false">Sai</option>
                    </select>

                  </div>
                ))}

              </div>
            )}

            {/* ================= SHORT ANSWER ================= */}
            {(type === "short-answer" || type === "sa") && (
              <div className="mt-3">

                <input
                  className="border p-2 rounded w-full"
                  placeholder="Đáp án"
                  value={q.a || ""}
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
