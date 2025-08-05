import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import DatePicker from './DatePicker.jsx';
import ResultScreen from './ResultScreen.jsx';
import axios from 'axios';

const HomeScreen = () => {
  const { stock, setStock, date, setDate, result, setResult } = useContext(AppContext);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // 검색 결과 가져오기
  const searchStocks = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`/api/search-stocks?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('주식 검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 디바운스된 검색
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchStocks(searchQuery);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 결과가 있으면 결과 화면 표시
  if (result !== null) {
    return <ResultScreen />;
  }

  const handleCalculate = async () => {
    if (!stock || !date) {
      alert('종목과 날짜를 모두 선택해주세요!');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await axios.post('/api/calculate', {
        symbol: stock.symbol,
        date: date
      });

      const resultData = response.data;
      
      // 최소 5초 로딩 시간 보장
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 5000 - elapsed);
      
      setTimeout(() => {
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
    setStock(stock);
    setSearchQuery(stock.name);
    setSearchResults([]);
    setShowDropdown(false);
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
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            minWidth: '400px'
          }}>
            <p style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#333',
              margin: 0,
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              아… <span style={{ 
                color: '#3b82f6', 
                fontWeight: '700',
                textDecoration: 'underline',
                cursor: 'pointer'
              }} onClick={() => setShowDateModal(true)}>
                {date ? `${new Date(date).getFullYear()}년 ${new Date(date).getMonth() + 1}월` : '[이 때]'}
              </span> 내가 
              
              {/* 인라인 검색창 */}
              <div ref={searchRef} style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="종목명 입력"
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    textDecoration: 'underline',
                    minWidth: '120px',
                    maxWidth: '200px',
                    textAlign: 'center'
                  }}
                />
                {isSearching && (
                  <span style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px'
                  }}>
                    🔄
                  </span>
                )}
                
                {/* 드롭다운 결과 */}
                {showDropdown && searchResults.length > 0 && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e5e7eb',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1001,
                      marginTop: '5px',
                      minWidth: '250px'
                    }}
                  >
                    {searchResults.map((stockItem, index) => (
                      <div
                        key={stockItem.symbol}
                        onClick={() => handleStockSelect(stockItem)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          {stockItem.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          {stockItem.symbol}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              샀으면...
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

        {/* 선택된 종목 정보 */}
        {stock && (
          <div style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '30px',
            padding: '12px 20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            fontWeight: '500'
          }}>
            선택된 종목: {stock.name} ({stock.symbol})
          </div>
        )}

        <button 
          onClick={handleCalculate}
          disabled={!stock || !date || isLoading}
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
    </div>
  );
};

export default HomeScreen;