import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import time

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/search-stocks', methods=['GET'])
def search_stocks():
    """주식 검색 API - 회사명으로 검색"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify([])
        
        logger.info(f"Searching for stocks with query: {query}")
        
        # yfinance의 검색 기능 사용
        search_results = yf.Tickers(query)
        
        # 검색 결과를 정리
        stocks = []
        for ticker in search_results.tickers:
            try:
                info = ticker.info
                if info and 'symbol' in info and 'longName' in info:
                    stocks.append({
                        'symbol': info['symbol'],
                        'name': info['longName'],
                        'shortName': info.get('shortName', info['longName'])
                    })
            except Exception as e:
                logger.warning(f"Error getting info for {ticker}: {e}")
                continue
        
        # 중복 제거 및 정렬
        unique_stocks = []
        seen_symbols = set()
        for stock in stocks:
            if stock['symbol'] not in seen_symbols:
                unique_stocks.append(stock)
                seen_symbols.add(stock['symbol'])
        
        # 검색어와 유사도에 따라 정렬 (간단한 정렬)
        def sort_key(stock):
            name_lower = stock['name'].lower()
            symbol_lower = stock['symbol'].lower()
            query_lower = query.lower()
            
            # 정확한 매칭이 가장 높은 우선순위
            if query_lower in name_lower or query_lower in symbol_lower:
                return 0
            # 부분 매칭
            elif any(word in name_lower for word in query_lower.split()):
                return 1
            else:
                return 2
        
        unique_stocks.sort(key=sort_key)
        
        logger.info(f"Found {len(unique_stocks)} stocks for query '{query}'")
        return jsonify(unique_stocks[:20])  # 최대 20개 결과
        
    except Exception as e:
        logger.error(f"Error in stock search: {e}")
        return jsonify({'error': '주식 검색 중 오류가 발생했습니다.'}), 500

@app.route('/api/calculate', methods=['POST'])
def calculate_return():
    """주식 수익률 계산 API"""
    try:
        data = request.get_json()
        symbol = data.get('symbol')
        date_str = data.get('date')
        
        if not symbol or not date_str:
            return jsonify({'error': '종목 코드와 날짜가 필요합니다.'}), 400
        
        logger.info(f"Calculating return for {symbol} from {date_str}")
        
        # 날짜 파싱
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': '올바른 날짜 형식이 아닙니다.'}), 400
        
        # 주식 데이터 가져오기
        stock = yf.Ticker(symbol)
        
        # 과거 데이터 가져오기 (시작일부터 현재까지)
        hist = stock.history(start=target_date)
        
        if hist.empty:
            return jsonify({'error': '해당 날짜의 주식 데이터를 찾을 수 없습니다.'}), 404
        
        # 시작가와 현재가 비교
        start_price = hist.iloc[0]['Close']
        current_price = hist.iloc[-1]['Close']
        
        # 수익률 계산
        return_rate = ((current_price - start_price) / start_price) * 100
        
        logger.info(f"Return calculation: {symbol} from {date_str} = {return_rate:.2f}%")
        
        return jsonify({
            'symbol': symbol,
            'start_date': date_str,
            'start_price': start_price,
            'current_price': current_price,
            'return_rate': return_rate
        })
        
    except Exception as e:
        logger.error(f"Error calculating return: {e}")
        return jsonify({'error': '수익률 계산 중 오류가 발생했습니다.'}), 500

if __name__ == '__main__':
    print("🔍 Starting Flask on http://0.0.0.0:5001")
    app.run(debug=True, port=5001, host='0.0.0.0')