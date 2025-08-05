import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import DatePicker from './DatePicker.jsx';
import StockSearchModal from './StockSearchModal.jsx';
import ResultScreen from './ResultScreen.jsx';
import axios from 'axios';

const HomeScreen = () => {
  const { stock, setStock, date, setDate, result, setResult } = useContext(AppContext);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockInput, setStockInput] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  // 결과가 있으면 결과 화면 표시
  if (result !== null) {
    return <ResultScreen />;
  }

  const handleCalculate = async () => {
    if (!selectedStock || !date) {
      alert('종목과 날짜를 모두 선택해주세요!');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await axios.post('/api/calculate', {
        symbol: selectedStock.symbol,
        date: date
      });

      const resultData = response.data;
      
      // 최소 5초 로딩 시간 보장
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 5000 - elapsed);
      
      setTimeout(() => {
        setStock(selectedStock);
        setResult(resultData.return_rate);
        setIsLoading(false);
      }, remainingTime);

    } catch (error) {
      console.error('계산 오류:', error);
      alert(error.response?.data?.error || '계산 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setStockInput(stock.name);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '30px', 
        padding: '40px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '700',
          marginBottom: '30px',
          color: '#333',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          껄무새 🦜
        </h1>

        {/* 말풍선과 앵무새 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '20px',
          marginBottom: '40px',
          position: 'relative'
        }}>
          <div style={{ 
            backgroundColor: '#f0f8ff',
            borderRadius: '20px',
            padding: '20px',
            position: 'relative',
            border: '2px solid #e0e7ff',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <p style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#333',
              margin: 0,
              lineHeight: '1.4'
            }}>
              아… <span style={{ 
                color: '#3b82f6', 
                fontWeight: '700',
                textDecoration: 'underline',
                cursor: 'pointer'
              }} onClick={() => setShowDateModal(true)}>
                {date ? `${new Date(date).getFullYear()}년 ${new Date(date).getMonth() + 1}월` : '[이 때]'}
              </span> 내가 <span style={{ 
                color: '#3b82f6', 
                fontWeight: '700',
                textDecoration: 'underline',
                cursor: 'pointer'
              }} onClick={() => setShowStockModal(true)}>
                {selectedStock ? selectedStock.name : '[이거]'}
              </span> 샀으면...
            </p>
            
            {/* 말풍선 꼬리 */}
            <div style={{
              position: 'absolute',
              right: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: '10px solid #e0e7ff'
            }}></div>
          </div>
          
          <img 
            src="/kkeolmussae.png" 
            alt="껄무새" 
            style={{ 
              width: '120px', 
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }} 
          />
        </div>

        {/* 검색 입력 필드 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            position: 'relative',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onClick={() => setShowStockModal(true)}
              placeholder="회사명을 입력하세요 (예: Apple, Samsung, Tesla)"
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
              readOnly
            />
            <div style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6b7280'
            }}>
              🔍
            </div>
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '20px'
          }}>
            {selectedStock ? `선택된 종목: ${selectedStock.name} (${selectedStock.symbol})` : '종목을 선택해주세요'}
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          disabled={!selectedStock || !date || isLoading}
          style={{ 
            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '25px', 
            border: 'none', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: isLoading ? 0.7 : 1,
            transform: isLoading ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {isLoading ? '계산 중...' : '계산하기'}
        </button>
      </div>

      {showDateModal && (
        <DatePicker 
          onClose={() => setShowDateModal(false)} 
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setShowDateModal(false);
          }} 
        />
      )}

      {showStockModal && (
        <StockSearchModal 
          isOpen={showStockModal}
          onClose={() => setShowStockModal(false)} 
          onSelect={handleStockSelect} 
        />
      )}
    </div>
  );
};

export default HomeScreen;