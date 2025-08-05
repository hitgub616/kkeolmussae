import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import time
import threading
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import signal

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 간단한 메모리 캐시 (빠른 응답용)
search_cache = {}
cache_lock = threading.Lock()

def get_stock_info_fast(symbol, timeout=2):
    """빠른 주식 정보 조회 (타임아웃 적용)"""
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(yf.Ticker(symbol).info)
            return future.result(timeout=timeout)
    except (TimeoutError, Exception):
        return None

@app.route('/api/search-stocks', methods=['GET'])
def search_stocks():
    """주식 검색 API - 초고속 검색 (캐시 + 타임아웃)"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify([])
        
        # 캐시 확인
        cache_key = query.upper()
        with cache_lock:
            if cache_key in search_cache:
                cached_time, cached_result = search_cache[cache_key]
                # 5분 캐시
                if time.time() - cached_time < 300:
                    logger.info(f"Cache hit for query: {query}")
                    return jsonify(cached_result)
        
        logger.info(f"Searching for stocks with query: {query}")
        start_time = time.time()
        
        matching_stocks = []
        query_upper = query.upper()
        
        # 1단계: 가장 가능성 높은 심볼만 빠르게 확인 (타임아웃 2초)
        primary_symbols = [query_upper, f"{query_upper}.KS"]
        
        for symbol in primary_symbols:
            if len(matching_stocks) >= 5:  # 더 빠른 응답을 위해 5개로 제한
                break
                
            # 2초 타임아웃으로 빠른 검색
            info = get_stock_info_fast(symbol, timeout=2)
            if info and 'symbol' in info and 'longName' in info:
                stock_data = {
                    'symbol': info['symbol'],
                    'name': info['longName'],
                    'shortName': info.get('shortName', info['longName'])
                }
                matching_stocks.append(stock_data)
                logger.info(f"Found stock: {stock_data['symbol']} - {stock_data['name']}")
        
        # 2단계: 빠른 폴백 - 샘플 데이터 우선 사용
        if not matching_stocks:
            logger.info("Using fast sample data fallback")
            sample_stocks = [
                {'symbol': 'AAPL', 'name': 'Apple Inc.', 'shortName': 'Apple'},
                {'symbol': 'MSFT', 'name': 'Microsoft Corporation', 'shortName': 'Microsoft'},
                {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'shortName': 'Alphabet'},
                {'symbol': 'AMZN', 'name': 'Amazon.com Inc.', 'shortName': 'Amazon'},
                {'symbol': 'TSLA', 'name': 'Tesla Inc.', 'shortName': 'Tesla'},
                {'symbol': 'NVDA', 'name': 'NVIDIA Corporation', 'shortName': 'NVIDIA'},
                {'symbol': 'META', 'name': 'Meta Platforms Inc.', 'shortName': 'Meta'},
                {'symbol': 'NFLX', 'name': 'Netflix Inc.', 'shortName': 'Netflix'},
                {'symbol': 'IBM', 'name': 'International Business Machines Corporation', 'shortName': 'IBM'},
                {'symbol': 'AMD', 'name': 'Advanced Micro Devices, Inc.', 'shortName': 'AMD'},
                {'symbol': 'INTC', 'name': 'Intel Corporation', 'shortName': 'Intel'},
                {'symbol': 'CRM', 'name': 'Salesforce, Inc.', 'shortName': 'Salesforce'},
                {'symbol': 'ORCL', 'name': 'Oracle Corporation', 'shortName': 'Oracle'},
                {'symbol': 'ADBE', 'name': 'Adobe Inc.', 'shortName': 'Adobe'},
                {'symbol': 'SBUX', 'name': 'Starbucks Corporation', 'shortName': 'Starbucks'},
                {'symbol': 'DIS', 'name': 'The Walt Disney Company', 'shortName': 'Disney'},
                {'symbol': 'BA', 'name': 'The Boeing Company', 'shortName': 'Boeing'},
                {'symbol': 'JPM', 'name': 'JPMorgan Chase & Co.', 'shortName': 'JPMorgan'},
                {'symbol': 'JNJ', 'name': 'Johnson & Johnson', 'shortName': 'J&J'},
                {'symbol': 'PG', 'name': 'The Procter & Gamble Company', 'shortName': 'P&G'},
                {'symbol': '005930.KS', 'name': 'Samsung Electronics Co Ltd', 'shortName': 'Samsung'},
                {'symbol': '035420.KS', 'name': 'NAVER Corporation', 'shortName': 'NAVER'},
                {'symbol': '035720.KS', 'name': 'Kakao Corporation', 'shortName': 'Kakao'},
                {'symbol': '005380.KS', 'name': 'Hyundai Motor Company', 'shortName': 'Hyundai'},
                {'symbol': '000660.KS', 'name': 'SK Hynix Inc', 'shortName': 'SK Hynix'}
            ]
            
            query_lower = query.lower()
            for stock in sample_stocks:
                if (query_lower in stock['name'].lower() or 
                    query_lower in stock['shortName'].lower() or 
                    query_lower in stock['symbol'].lower()):
                    matching_stocks.append(stock)
                    if len(matching_stocks) >= 8:  # 빠른 응답
                        break
        
        # 관련성 정렬 (간소화)
        def sort_key(stock):
            symbol_lower = stock['symbol'].lower()
            name_lower = stock['name'].lower()
            query_lower = query.lower()
            
            if symbol_lower.startswith(query_lower):
                return 0
            elif query_lower in symbol_lower:
                return 1
            elif query_lower in name_lower:
                return 2
            else:
                return 3
        
        matching_stocks.sort(key=sort_key)
        result = matching_stocks[:8]  # 8개로 제한
        
        # 캐시 저장
        with cache_lock:
            search_cache[cache_key] = (time.time(), result)
            # 캐시 크기 제한 (최대 100개)
            if len(search_cache) > 100:
                oldest_key = min(search_cache.keys(), key=lambda k: search_cache[k][0])
                del search_cache[oldest_key]
        
        elapsed = time.time() - start_time
        logger.info(f"Found {len(result)} stocks for query '{query}' in {elapsed:.2f}s")
        return jsonify(result)
        
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