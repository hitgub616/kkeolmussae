import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import html2canvas from 'html2canvas';

const ResultScreen = () => {
  const { result, setPage, stock, date } = useContext(AppContext);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const element = document.getElementById('result-content');
      const canvas = await html2canvas(element);
      canvas.toBlob(async (blob) => {
        const files = [new File([blob], 'result.png', { type: 'image/png' })];
        if (navigator.canShare && navigator.canShare({ files })) {
          await navigator.share({
            files,
            title: '껄무새 시뮬레이션 결과',
            text: `그때 ${stock.name} 샀으면 ${result > 0 ? '+' : ''}${result.toFixed(2)}%`,
          });
        } else {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          alert('이미지가 클립보드에 복사되었습니다!');
        }
      });
    } catch (error) {
      console.error('Share error:', error);
      alert('공유에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  // 치킨 계산 (100만원 기준, 치킨 18,000원)
  const calculateChicken = () => {
    const initialInvestment = 1000000; // 100만원
    const chickenPrice = 18000; // 치킨 가격
    const finalAmount = initialInvestment * (1 + result / 100);
    const chickenCount = Math.round(finalAmount / chickenPrice);
    
    // 디버그용 콘솔 로그
    console.log('치킨 계산:', {
      initialInvestment: initialInvestment.toLocaleString() + '원',
      result: result + '%',
      finalAmount: finalAmount.toLocaleString() + '원',
      chickenPrice: chickenPrice.toLocaleString() + '원',
      chickenCount: chickenCount + '마리'
    });
    
    return chickenCount;
  };

  let ment = '';
  let mentColor = '#333';
  if (result > 0) {
    ment = '와 진짜 이걸 놓침? 😭';
    mentColor = '#dc2626';
  } else if (result < 0) {
    ment = '다행히 안 사서 다행이야! 😅';
    mentColor = '#059669';
  } else {
    ment = '변화 없음... 🤔';
    mentColor = '#6b7280';
  }

  const chickenCount = calculateChicken();

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
      <div 
        id="result-content" 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '30px', 
          padding: '40px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          marginBottom: '20px',
          color: '#333'
        }}>
          그때 샀다면 지금쯤...
        </h2>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: '700', 
          color: result > 0 ? '#10b981' : result < 0 ? '#ef4444' : '#6b7280',
          marginBottom: '20px',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {result > 0 ? '+' : ''}{result.toFixed(2)}%
        </div>
        <p style={{ 
          fontSize: '22px',
          color: mentColor,
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          {ment}
        </p>
        
        {/* 치킨 계산 결과 */}
        <div style={{ 
          backgroundColor: '#fef3c7',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #f59e0b'
        }}>
          <p style={{ 
            fontSize: '18px',
            color: '#92400e',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            🍗 100만원으로 시작했다면...
          </p>
          <p style={{ 
            fontSize: '24px',
            color: '#92400e',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            치킨 {chickenCount}마리! 🍗
          </p>
          <p style={{ 
            fontSize: '14px',
            color: '#92400e',
            fontWeight: '500',
            margin: '0',
            opacity: 0.8
          }}>
            (치킨 가격: 18,000원 기준)
          </p>
        </div>
        
        <div style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '500'
        }}>
          {stock.name} • {new Date(date).getFullYear()}년 {new Date(date).getMonth() + 1}월
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        display: 'flex', 
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          style={{ 
            backgroundColor: '#6b7280', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '25px', 
            border: 'none', 
            cursor: 'pointer', 
            boxShadow: '0 8px 16px rgba(107, 114, 128, 0.3)',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }} 
          onClick={() => setPage('home')}
        >
          다시 해보기
        </button>
        <button 
          style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '25px', 
            border: 'none', 
            cursor: isSharing ? 'not-allowed' : 'pointer', 
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: isSharing ? 0.7 : 1,
            transform: isSharing ? 'scale(0.95)' : 'scale(1)'
          }} 
          onClick={handleShare}
          disabled={isSharing}
        >
          {isSharing ? '공유 중...' : '공유하기'}
        </button>
      </div>
      
      {/* 앵무새 이미지 */}
      <img 
        src="/kkeolmussae.png" 
        alt="껄무새" 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          width: '80px', 
          height: 'auto',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          transition: 'transform 0.3s ease'
        }} 
      />
    </div>
  );
};

export default ResultScreen; 