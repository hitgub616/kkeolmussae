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
    try {
      const res = await axios.get(`/api/calculate`, { params: { ticker: stock.ticker, date } });
      setResult(res.data.return_rate);
      setPage('result');
    } catch (error) {
      console.error("API Error:", error.response || error.message);
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '30px', 
        padding: '32px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        position: 'relative',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          껄무새 시뮬레이션
        </h1>
        <p style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#333',
          lineHeight: '1.5'
        }}>
          아… <span style={{ 
            color: '#3b82f6', 
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'all 0.3s ease',
            ':hover': { color: '#1d4ed8' }
          }} onClick={() => setShowDateModal(true)}>
            {date ? `${new Date(date).getFullYear()}년 ${new Date(date).getMonth() + 1}월` : '[이때]'}
          </span> 내가 <span style={{ 
            color: '#3b82f6', 
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'all 0.3s ease',
            ':hover': { color: '#1d4ed8' }
          }} onClick={() => setShowStockModal(true)}>
            {stock ? stock.name : '[이거]'}
          </span> 샀으면...
        </p>
      </div>
      
      {stock && date && (
        <button 
          style={{ 
            marginTop: '24px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '25px', 
            border: 'none', 
            cursor: 'pointer', 
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            fontSize: '18px',
            fontWeight: 'bold',
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
      
      {showDateModal && <DatePicker onClose={() => setShowDateModal(false)} onSelect={(selectedDate) => setDate(selectedDate)} />}
      {showStockModal && <StockSearchModal onClose={() => setShowStockModal(false)} onSelect={(selectedStock) => setStock(selectedStock)} />}
      
      <img 
        src="/kkeolmussae.png" 
        alt="껄무새" 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          width: '60px', 
          height: 'auto',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          transition: 'transform 0.3s ease',
          ':hover': { transform: 'scale(1.1)' }
        }} 
      />
    </div>
  );
};

export default HomeScreen;