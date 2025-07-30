import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import html2canvas from 'html2canvas';

const ResultScreen = () => {
  const { result, setPage, stock, date } = useContext(AppContext);

  const handleShare = async () => {
    const element = document.getElementById('result-content');
    const canvas = await html2canvas(element);
    canvas.toBlob(async (blob) => {
      const files = [new File([blob], 'result.png', { type: 'image/png' })];
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: '껄무새 시뮬레이션 결과',
          text: `그때 ${stock.name} 샀으면 +${result}%`,
        });
      } else {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        alert('이미지가 클립보드에 복사되었습니다!');
      }
    });
  };

  let ment = '';
  if (result > 0) {
    ment = '와 진짜 이걸 놓침?';
  } else if (result < 0) {
    ment = '다행히 안 사서 다행이야!';
  } else {
    ment = '변화 없음...';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', position: 'relative', backgroundColor: '#f0f8ff' }}>
      <div id="result-content" style={{ backgroundColor: 'white', borderRadius: '30px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>그때 샀다면 지금쯤...</p>
        <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginTop: '16px' }}>{result > 0 ? '+' : ''}{result.toFixed(2)}% 수익이었을걸요!</p>
        <p style={{ marginTop: '16px' }}>{ment}</p>
      </div>
      <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
        <button style={{ backgroundColor: '#6b7280', color: 'white', padding: '12px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onClick={() => setPage('home')}>
          다시 해보기
        </button>
        <button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onClick={handleShare}>
          공유하기
        </button>
      </div>
      <img src="/kkeolmussae.png" alt="껄무새" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: 'auto' }} />
    </div>
  );
};

export default ResultScreen; 