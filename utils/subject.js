
export const getSubjectFromPass = (pass) => {
  const p = String(pass || "").toUpperCase();
  
  if (p.startsWith('TO')) return { id: 'toan', name: 'Toán học', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  if (p.startsWith('LY')) return { id: 'ly', name: 'Vật lý', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
  if (p.startsWith('HO')) return { id: 'hoa', name: 'Hóa học', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (p.startsWith('SI')) return { id: 'sinh', name: 'Sinh học', color: 'bg-purple-100 text-purple-700 border-purple-200' };
  if (p.startsWith('TA')) return { id: 'anh', name: 'T.Anh', color: 'bg-blue-100 text-blue-700 border-blue-200' }; 
  if (p.startsWith('SU')) return { id: 'su', name: 'Lịch sử', color: 'bg-green-100 text-green-700 border-green-200' };  
  if (p.startsWith('DI')) return { id: 'dia', name: 'Địa lý', color: 'bg-green-100 text-green-700 border-green-200' }; 
  if (p.startsWith('KT')) return { id: 'ktpl', name: 'KTPL', color: 'bg-green-100 text-green-700 border-green-200' }; 
  if (p.startsWith('CN')) return { id: 'cn', name: 'CNCN', color: 'bg-green-100 text-green-700 border-green-200' };  
  if (p.startsWith('NN')) return { id: 'nn', name: 'CNNN', color: 'bg-green-100 text-green-700 border-green-200' };  
  if (p.startsWith('TT')) return { id: 'chung', name: 'Chung', color: 'bg-green-100 text-green-700 border-green-200' };  
  
  return { id: 'unknown', name: 'Hệ thống', color: 'bg-slate-100 text-slate-700 border-slate-200' };
};
