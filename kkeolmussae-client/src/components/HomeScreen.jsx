import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import DatePicker from './DatePicker.jsx';
import StockSearchModal from './StockSearchModal.jsx';
import axios from 'axios';

const HomeScreen = () => {
  const { stock, setStock, date, setDate, setPage, setResult } = useContext(AppContext);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setIsLoading(true);
    setPage('loading');
    
    const startTime = Date.now();
    const minimumLoadingTime = 5000; // 5초

    try {
      const res = await axios.get(`/api/calculate`, { params: { ticker: stock.ticker, date } });
      
      // 최소 로딩 시간 보장
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setResult(res.data.return_rate);
      setPage('result');
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      
      // 에러가 발생해도 최소 로딩 시간 보장
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      alert("계산에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setPage('home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      position: 'relative', 
      backgroundColor: '#f0f8ff',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* 메인 콘텐츠 영역 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '32px',
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* 제목 */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          textAlign: 'center', 
          color: 'white',
          margin: '0',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          껄무새 시뮬레이션
        </h1>

        {/* 말풍선과 앵무새 영역 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '20px',
          width: '100%',
          justifyContent: 'center'
        }}>
          {/* 말풍선 */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '25px', 
            padding: '24px 32px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)', 
            position: 'relative',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '500px',
            flex: '1'
          }}>
            {/* 말풍선 꼬리 */}
            <div style={{
              position: 'absolute',
              right: '-15px',
              bottom: '30px',
              width: '0',
              height: '0',
              borderLeft: '20px solid rgba(255, 255, 255, 0.95)',
              borderTop: '15px solid transparent',
              borderBottom: '15px solid transparent',
              filter: 'drop-shadow(2px 0 2px rgba(0,0,0,0.1))'
            }}></div>
            
            <p style={{ 
              fontSize: '20px', 
              fontWeight: '500', 
              textAlign: 'center', 
              color: '#333',
              lineHeight: '1.6',
              margin: '0'
            }}>
              아… <span style={{ 
                color: '#3b82f6', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }} onClick={() => setShowDateModal(true)}>
                {date ? `${new Date(date).getFullYear()}년 ${new Date(date).getMonth() + 1}월` : '[이때]'}
              </span> 내가 <span style={{ 
                color: '#3b82f6', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }} onClick={() => setShowStockModal(true)}>
                {stock ? stock.name : '[이거]'}
              </span> 샀으면...
            </p>
          </div>

          {/* 앵무새 이미지 */}
          <img 
            src="/kkeolmussae.png" 
            alt="껄무새" 
            style={{ 
              width: '120px', 
              height: 'auto',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
              transition: 'transform 0.3s ease',
              flexShrink: 0
            }} 
          />
        </div>

        {/* 계산 버튼 */}
        {stock && date && (
          <button 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '18px 36px', 
              borderRadius: '30px', 
              border: 'none', 
              cursor: 'pointer', 
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              transform: isLoading ? 'scale(0.95)' : 'scale(1)',
              opacity: isLoading ? 0.7 : 1
            }} 
            onClick={handleCalculate}
            disabled={isLoading}
          >
            {isLoading ? '계산 중...' : '얼마 벌었을까?'}
          </button>
        )}
      </div>
      
      {/* 모달들 */}
      {showDateModal && <DatePicker onClose={() => setShowDateModal(false)} onSelect={(selectedDate) => setDate(selectedDate)} />}
      {showStockModal && <StockSearchModal onClose={() => setShowStockModal(false)} onSelect={(selectedStock) => setStock(selectedStock)} />}
    </div>
  );
};

export default HomeScreen;