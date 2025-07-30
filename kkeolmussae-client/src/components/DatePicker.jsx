import { useState } from 'react';

const DatePicker = ({ onClose, onSelect }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(1);
  const years = Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i);
  const months = Array.from({length: 12}, (_, i) => i + 1);

  const handleSubmit = () => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-01`;
    onSelect(dateStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">날짜 선택</h2>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="mr-2 p-2 border">
          {years.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="p-2 border">
          {months.map(m => <option key={m} value={m}>{m}월</option>)}
        </select>
        <button onClick={handleSubmit} className="ml-4 bg-green-500 text-white px-4 py-2 rounded">
          확인
        </button>
        <button onClick={onClose} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">
          취소
        </button>
      </div>
    </div>
  );
};

export default DatePicker; 