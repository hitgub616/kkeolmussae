import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import date, timedelta

logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

@app.route('/calculate', methods=['GET'])
def calculate():
    ticker = request.args.get('ticker')
    date_str = request.args.get('date')
    if not ticker or not date_str:
        logging.error("Missing ticker or date in request")
        return jsonify({"error": "ticker와 date 파라미터가 필요합니다."}), 400
    try:
        start_date = date.fromisoformat(date_str)
        stock = yf.Ticker(ticker)
        end_date = date.today() + timedelta(days=1)
        hist = stock.history(start=start_date, end=end_date)
        if hist.empty:
            logging.error(f"No data found for {ticker} from {start_date}")
            return jsonify({"error": "유효하지 않은 종목이거나 데이터를 불러올 수 없습니다."}), 404
        use_start_date = hist.index[0].date()
        if use_start_date != start_date:
            logging.info(f"Used next trading day {use_start_date} instead of {start_date} for {ticker}")
        start_price = hist['Close'].iloc[0]
        current_price = hist['Close'].iloc[-1]
        return_rate = ((current_price - start_price) / start_price) * 100
        return jsonify({"ticker": ticker, "return_rate": return_rate})
    except ValueError as ve:
        logging.error(f"Invalid date format: {date_str} - {str(ve)}")
        return jsonify({"error": "날짜 형식은 YYYY-MM-DD여야 합니다."}), 400
    except Exception as e:
        logging.error(f"Error calculating for {ticker} on {date_str}: {str(e)}")
        return jsonify({"error": "유효하지 않은 종목이거나 데이터를 불러올 수 없습니다."}), 404

if __name__ == '__main__':
    print("🔍 Starting Flask on http://0.0.0.0:5001")
    # Bind to all interfaces and disable the reloader to ensure single-process startup
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)