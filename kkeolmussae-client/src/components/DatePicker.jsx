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
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        padding: '32px', 
        borderRadius: '20px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          textAlign: 'center',
          color: '#333'
        }}>
          📅 날짜 선택
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          justifyContent: 'center'
        }}>
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))} 
            style={{ 
              padding: '12px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':focus': { borderColor: '#3b82f6', outline: 'none' }
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}년</option>)}
          </select>
          
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))} 
            style={{ 
              padding: '12px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':focus': { borderColor: '#3b82f6', outline: 'none' }
            }}
          >
            {months.map(m => <option key={m} value={m}>{m}월</option>)}
          </select>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={handleSubmit} 
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }
            }}
          >
            ✅ 확인
          </button>
          
          <button 
            onClick={onClose} 
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)' }
            }}
          >
            ❌ 취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker; 