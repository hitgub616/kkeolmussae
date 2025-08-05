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
    """주식 검색 API - 실시간 yfinance 검색"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify([])
        
        logger.info(f"Searching for stocks with query: {query}")
        
        # 실시간 yfinance 검색
        matching_stocks = []
        
        try:
            # 주요 거래소별로 검색 시도
            search_suffixes = ['', '.KS', '.KQ', '.TO', '.L', '.HK', '.SS', '.SZ', '.T']
            
            for suffix in search_suffixes:
                if len(matching_stocks) >= 20:  # 최대 20개로 제한
                    break
                    
                try:
                    # 심볼로 직접 검색
                    symbol = query.upper() + suffix
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    
                    if info and 'symbol' in info and 'longName' in info:
                        stock_data = {
                            'symbol': info['symbol'],
                            'name': info['longName'],
                            'shortName': info.get('shortName', info['longName'])
                        }
                        
                        # 중복 확인
                        if not any(s['symbol'] == stock_data['symbol'] for s in matching_stocks):
                            matching_stocks.append(stock_data)
                            logger.info(f"Found stock: {stock_data['symbol']} - {stock_data['name']}")
                            
                except Exception as e:
                    logger.debug(f"Failed to get info for {symbol}: {e}")
                    continue
            
            # 추가로 일반적인 검색어 패턴 시도
            if len(matching_stocks) < 10:
                common_patterns = [
                    query.upper(),
                    query.upper() + 'O',  # 클래스 A/B 주식
                    query.upper() + 'A',
                    query.upper() + 'B',
                ]
                
                for pattern in common_patterns:
                    if len(matching_stocks) >= 20:
                        break
                        
                    try:
                        ticker = yf.Ticker(pattern)
                        info = ticker.info
                        
                        if info and 'symbol' in info and 'longName' in info:
                            stock_data = {
                                'symbol': info['symbol'],
                                'name': info['longName'],
                                'shortName': info.get('shortName', info['longName'])
                            }
                            
                            # 중복 확인 및 관련성 확인
                            if (not any(s['symbol'] == stock_data['symbol'] for s in matching_stocks) and
                                (query.lower() in stock_data['name'].lower() or 
                                 query.lower() in stock_data['shortName'].lower() or
                                 query.lower() in stock_data['symbol'].lower())):
                                matching_stocks.append(stock_data)
                                logger.info(f"Found stock: {stock_data['symbol']} - {stock_data['name']}")
                                
                    except Exception as e:
                        logger.debug(f"Failed to get info for {pattern}: {e}")
                        continue
        
        except Exception as e:
            logger.error(f"Error in yfinance search: {e}")
        
        # 백업 샘플 데이터 (yfinance 완전 실패 시)
        if not matching_stocks:
            logger.info("yfinance search failed, using backup sample data")
            sample_stocks = [
                {'symbol': 'AAPL', 'name': 'Apple Inc.', 'shortName': 'Apple'},
                {'symbol': 'MSFT', 'name': 'Microsoft Corporation', 'shortName': 'Microsoft'},
                {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'shortName': 'Alphabet'},
                {'symbol': 'AMZN', 'name': 'Amazon.com Inc.', 'shortName': 'Amazon'},
                {'symbol': 'TSLA', 'name': 'Tesla Inc.', 'shortName': 'Tesla'},
                {'symbol': 'NVDA', 'name': 'NVIDIA Corporation', 'shortName': 'NVIDIA'},
                {'symbol': 'META', 'name': 'Meta Platforms Inc.', 'shortName': 'Meta'},
                {'symbol': 'NFLX', 'name': 'Netflix Inc.', 'shortName': 'Netflix'},
                {'symbol': '005930.KS', 'name': 'Samsung Electronics Co Ltd', 'shortName': 'Samsung'},
                {'symbol': '035420.KS', 'name': 'NAVER Corporation', 'shortName': 'NAVER'},
                {'symbol': '035720.KS', 'name': 'Kakao Corporation', 'shortName': 'Kakao'},
                {'symbol': '005380.KS', 'name': 'Hyundai Motor Company', 'shortName': 'Hyundai'},
                {'symbol': '000660.KS', 'name': 'SK Hynix Inc', 'shortName': 'SK Hynix'},
                {'symbol': '051910.KS', 'name': 'LG Chem Ltd', 'shortName': 'LG Chem'},
                {'symbol': '006400.KS', 'name': 'Samsung SDI Co Ltd', 'shortName': 'Samsung SDI'}
            ]
            
            query_lower = query.lower()
            for stock in sample_stocks:
                if (query_lower in stock['name'].lower() or 
                    query_lower in stock['shortName'].lower() or 
                    query_lower in stock['symbol'].lower()):
                    matching_stocks.append(stock)
        
        # 관련성에 따른 정렬
        def sort_key(stock):
            name_lower = stock['name'].lower()
            short_name_lower = stock['shortName'].lower()
            symbol_lower = stock['symbol'].lower()
            query_lower = query.lower()
            
            # 심볼 정확 매칭이 최우선
            if symbol_lower.startswith(query_lower):
                return 0
            # 심볼 포함
            elif query_lower in symbol_lower:
                return 1
            # 회사명 시작
            elif name_lower.startswith(query_lower) or short_name_lower.startswith(query_lower):
                return 2
            # 회사명 포함
            elif query_lower in name_lower or query_lower in short_name_lower:
                return 3
            else:
                return 4
        
        matching_stocks.sort(key=sort_key)
        
        logger.info(f"Found {len(matching_stocks)} stocks for query '{query}'")
        return jsonify(matching_stocks[:20])  # 최대 20개 결과
        
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