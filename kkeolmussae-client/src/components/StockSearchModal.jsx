const stocks = [
  {name: '삼성전자', ticker: '005930.KS'},
  {name: 'Apple', ticker: 'AAPL'},
  {name: 'Tesla', ticker: 'TSLA'},
  {name: 'Microsoft', ticker: 'MSFT'},
  {name: 'Amazon', ticker: 'AMZN'},
  {name: 'Google', ticker: 'GOOGL'},
  {name: 'Naver', ticker: '035420.KS'},
  {name: 'Kakao', ticker: '035720.KS'},
  {name: 'Hyundai', ticker: '005380.KS'},
  {name: 'NVIDIA', ticker: 'NVDA'},
];

const StockSearchModal = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">종목 선택</h2>
        <div className="grid grid-cols-2 gap-2">
          {stocks.map(s => (
            <button key={s.ticker} onClick={() => { onSelect(s); onClose(); }} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
              {s.name}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          닫기
        </button>
      </div>
    </div>
  );
};

export default StockSearchModal; 