import { useEffect, useState } from 'react';

const ments = [
  "그날 아침에 진짜 사자고 다짐했었는데... 😔",
  "왜 하필 그때 안 샀을까... 🤦‍♂️",
  "아, 후회돼! 😭",
  "그때 샀으면 지금쯤... 💭",
  "진짜 그때가 기회였는데... 🥺",
  "다시 그때로 돌아갈 수 있다면... ⏰",
];

const LoadingScreen = () => {
  const [ment, setMent] = useState(ments[0]);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setMent(ments[Math.floor(Math.random() * ments.length)]);
        setFadeIn(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
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
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.7
        }} 
      />
      
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <div style={{ 
          fontSize: '24px', 
          color: 'white', 
          fontWeight: 'bold',
          marginBottom: '16px',
          textShadow: '0 4px 8px rgba(0,0,0,0.5)'
        }}>
          계산 중...
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '20px', 
          padding: '20px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}>
          <p style={{ 
            fontSize: '18px', 
            color: '#333',
            fontWeight: 'bold',
            lineHeight: '1.4',
            margin: 0
          }}>
            {ment}
          </p>
        </div>
        
        <div style={{ 
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
          }}></div>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            animation: 'pulse 1.5s ease-in-out infinite 0.4s'
          }}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen; 