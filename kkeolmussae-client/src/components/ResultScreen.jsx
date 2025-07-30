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
      <div 
        id="result-content" 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '30px', 
          padding: '32px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          width: '90%'
        }}
      >
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#333'
        }}>
          그때 샀다면 지금쯤...
        </h2>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: result > 0 ? '#10b981' : result < 0 ? '#ef4444' : '#6b7280',
          marginBottom: '16px',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {result > 0 ? '+' : ''}{result.toFixed(2)}%
        </div>
        <p style={{ 
          fontSize: '20px',
          color: mentColor,
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          {ment}
        </p>
        <div style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          padding: '12px',
          borderRadius: '12px',
          marginTop: '16px'
        }}>
          {stock.name} • {new Date(date).getFullYear()}년 {new Date(date).getMonth() + 1}월
        </div>
      </div>
      
      <div style={{ 
        marginTop: '32px', 
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
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            ':hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(107, 114, 128, 0.4)' }
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
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            opacity: isSharing ? 0.7 : 1,
            transform: isSharing ? 'scale(0.95)' : 'scale(1)',
            ':hover': isSharing ? {} : { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(59, 130, 246, 0.4)' }
          }} 
          onClick={handleShare}
          disabled={isSharing}
        >
          {isSharing ? '공유 중...' : '공유하기'}
        </button>
      </div>
      
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

export default ResultScreen; 