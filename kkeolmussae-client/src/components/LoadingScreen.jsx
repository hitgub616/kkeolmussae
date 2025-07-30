import { useEffect, useState } from 'react';

const ments = [
  "그날 아침에 진짜 사자고 다짐했었는데...",
  "왜 하필 그때 안 샀을까...",
  "아, 후회돼!",
  "그때 샀으면 지금쯤...",
];

const LoadingScreen = () => {
  const [ment, setMent] = useState(ments[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMent(ments[Math.floor(Math.random() * ments.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen">
      <video src="/loading.mp4" autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg">
        Loading...
      </div>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-3xl p-4 shadow-lg opacity-80">
        {ment}
      </div>
    </div>
  );
};

export default LoadingScreen; 