const stocks = [
  {name: '삼성전자', ticker: '005930.KS', emoji: '📱'},
  {name: 'Apple', ticker: 'AAPL', emoji: '🍎'},
  {name: 'Tesla', ticker: 'TSLA', emoji: '🚗'},
  {name: 'Microsoft', ticker: 'MSFT', emoji: '💻'},
  {name: 'Amazon', ticker: 'AMZN', emoji: '📦'},
  {name: 'Google', ticker: 'GOOGL', emoji: '🔍'},
  {name: 'Naver', ticker: '035420.KS', emoji: '🌐'},
  {name: 'Kakao', ticker: '035720.KS', emoji: '💬'},
  {name: 'Hyundai', ticker: '005380.KS', emoji: '🚙'},
  {name: 'NVIDIA', ticker: 'NVDA', emoji: '🎮'},
];

const StockSearchModal = ({ onClose, onSelect }) => {
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
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          textAlign: 'center',
          color: '#333'
        }}>
          📈 종목 선택
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {stocks.map(s => (
            <button 
              key={s.ticker} 
              onClick={() => { onSelect(s); onClose(); }} 
              style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '16px 12px', 
                borderRadius: '12px',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                ':hover': { 
                  backgroundColor: '#3b82f6', 
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{s.emoji}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
        
        <div style={{ textAlign: 'center' }}>
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
            ❌ 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSearchModal; 