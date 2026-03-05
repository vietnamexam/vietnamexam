if (action === "saveOnlyQuestions") {
      const sheet = ss.getSheetByName("exam_data") || ss.insertSheet("exam_data");
      const qArray = data.questions;
      const examCode = data.examCode;
      const force = data.force || false; // Nhận lệnh ghi đè từ React
      const lastRow = sheet.getLastRow();

      if (!Array.isArray(qArray)) return createResponse("error", "questions không phải mảng!");

      // --- LOGIC DÒ MÃ EXAMS ---
      const fullData = sheet.getDataRange().getValues();
      const exists = fullData.some(row => row[0].toString() === examCode.toString());

      if (exists && !force) {
        return createResponse("exists", `Mã exams ${examCode} đã có câu hỏi!`);
      }

      // Nếu thầy chọn GHI ĐÈ (force = true), tiến hành xóa các hàng cũ của mã đó
      if (exists && force) {
        // Xóa từ dưới lên để không bị lệch Index
        for (let i = fullData.length - 1; i >= 0; i--) {
          if (fullData[i][0].toString() === examCode.toString()) {
            sheet.deleteRow(i + 1);
          }
        }
      }
      // -------------------------

      const rows = qArray.map(q => {
        // Xử lý Lời giải: Nếu trống thì ghi "Đang cập nhật..."
        let finalLG = (q.loigiai && q.loigiai.trim() !== "") ? q.loigiai : "Đang cập nhật...";

        return [
          examCode,              // Cột A: Mã đề (exams)
          q.id || "",            // Cột B: ID
          q.classTag || "1001.a", // Cột C: ClassTag (Theo format lớp 10 của thầy)
          q.type || "mcq",       // Cột D: Loại câu
          q.question || "",      // Cột E: Phần (Nên có cột này để đồng bộ Admin)         
          finalLG,               // Cột I: Lời giải
          new Date()             // Cột J: Ngày nạp
        ];
      });

      // Lưu ý: Số cột bây giờ là 7 (từ A đến J)
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
      
      // Định dạng lại cho đẹp
      sheet.getRange("F:I").setWrap(true); // Gói văn bản cho các cột nội dung dài

      // Tự chỉnh chiều cao từ dòng 2 trở xuống
      if (lastRow > 1) {
        sheet.autoResizeRows(2, lastRow - 1);
      }
      return createResponse("success", `Đã nạp ${rows.length} câu vào mã ${examCode}`);
    }
