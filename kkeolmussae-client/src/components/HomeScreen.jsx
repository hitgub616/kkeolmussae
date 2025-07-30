import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import DatePicker from './DatePicker.jsx';
import StockSearchModal from './StockSearchModal.jsx';
import axios from 'axios';

const HomeScreen = () => {
  const { stock, setStock, date, setDate, setPage, setResult } = useContext(AppContext);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const handleCalculate = async () => {
    setPage('loading');
    try {
      const res = await axios.get(`/api/calculate`, { params: { ticker: stock.ticker, date } });
      setResult(res.data.return_rate);
      setPage('result');
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      alert("계산에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setPage('home');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', position: 'relative', backgroundColor: '#f0f8ff' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          아… <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setShowDateModal(true)}>
            {date ? `${new Date(date).getFullYear()}년 ${new Date(date).getMonth() + 1}월` : '[이때]'}
          </span> 내가 <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setShowStockModal(true)}>
            {stock ? stock.name : '[이거]'}
          </span> 샀으면...
        </p>
      </div>
      {stock && date && (
        <button style={{ marginTop: '16px', backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onClick={handleCalculate}>
          얼마 벌었을까?
        </button>
      )}
      {showDateModal && <DatePicker onClose={() => setShowDateModal(false)} onSelect={(selectedDate) => setDate(selectedDate)} />}
      {showStockModal && <StockSearchModal onClose={() => setShowStockModal(false)} onSelect={(selectedStock) => setStock(selectedStock)} />}
      <img src="/kkeolmussae.png" alt="껄무새" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: 'auto' }} />
    </div>
  );
};

export default HomeScreen;