import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import DatePicker from './DatePicker.jsx';
import LoadingScreen from './LoadingScreen.jsx';
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

  // 로딩 상태일 때 LoadingScreen 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 결과가 있을 때 ResultScreen 표시
  if (result !== null) {
    return <ResultScreen />;
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 비디오 */}
      <video 
        src="/loading.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          height: '60vh', // 화면에 꽉 차지 않게 60% 높이로 제한
          zIndex: -1,
          opacity: 0.3 // 배경이므로 투명도 낮춤
        }} 
      />
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '30px', 
        padding: '40px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        maxWidth: '600px',
        width: '100%',
        position: 'relative'
      }}>
        {/* 로고 이미지 */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <img 
            src="/logo.png" 
            alt="껄무새 로고" 
            style={{ 
              width: '120px', 
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }} 
          />
        </div>

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
            backgroundColor: '#f8fafc',
            borderRadius: '25px',
            padding: '25px',
            position: 'relative',
            border: '2px solid #e2e8f0',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            minWidth: '400px',
            // 구름 느낌의 테두리
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
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
            
            {/* 말풍선 꼬리 (구름 느낌) */}
            <div style={{
              position: 'absolute',
              right: '-15px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '0',
              height: '0',
              borderTop: '15px solid transparent',
              borderBottom: '15px solid transparent',
              borderLeft: '15px solid #f8fafc',
              filter: 'drop-shadow(2px 0 2px rgba(0,0,0,0.05))'
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