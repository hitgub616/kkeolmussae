# 껄무새 (Kkeolmussae) 🦜

**"아… 그때 내가 이거 샀으면..."** - 주식 투자자들을 위한 재미있는 시뮬레이션 웹 서비스

## 📖 프로젝트 소개

껄무새는 특정 날짜에 주식을 샀다면 얼마나 수익이 났을지 계산해주는 재미있는 시뮬레이션 도구입니다. 투자 조언이 아닌 감정적 몰입과 바이럴성을 목표로 한 엔터테인먼트 서비스입니다.

## ✨ 주요 기능

- **주식 & 날짜 기반 시뮬레이션**: 특정 날짜에 주식을 샀다면 현재까지의 수익률 계산
- **캐릭터 기반 UX**: 인터랙티브한 텍스트와 말풍선 ("아… [이때] 내가 [이거] 샀으면...")
- **로딩 화면**: 루핑 비디오와 변화하는 후회 메시지
- **결과 화면**: 계산된 수익률 표시 및 공유 기능 (이미지, 텍스트, 링크)
- **공유 기능**: html2canvas와 Web Share API를 활용한 결과 공유

## 🎨 디자인 가이드라인

- **캐릭터**: 픽사 스타일의 열대 앵무새
- **말풍선**: 구름 모양의 말풍선
- **타이포그래피**: "Gaegu" 또는 "Nanum Pen Script" 폰트
- **전체적인 미학**: 심플하고 캐릭터 중심의 배경

## 🛠 기술 스택

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Axios** (API 통신)
- **HTML2Canvas** (이미지 캡처)
- **Web Share API** (공유 기능)

### Backend
- **Python Flask**
- **Flask-CORS**
- **yfinance** (주식 데이터)

### 상태 관리
- **React Context API**

### 에러 처리
- **React Error Boundaries**
- **Python logging**

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/hitgub616/kkeolmussae.git
cd kkeolmussae
```

### 2. Backend 설정
```bash
cd kkeolmussae-server
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python3 app.py
```

### 3. Frontend 설정
```bash
cd kkeolmussae-client
npm install
npm run dev
```

### 4. 접속
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## 📁 프로젝트 구조

```
kkeolmussae/
├── kkeolmussae-server/          # Flask 백엔드
│   ├── app.py                   # 메인 Flask 애플리케이션
│   ├── requirements.txt         # Python 의존성
│   └── venv/                    # Python 가상환경
├── kkeolmussae-client/          # React 프론트엔드
│   ├── src/
│   │   ├── components/          # React 컴포넌트들
│   │   ├── context/             # React Context
│   │   ├── App.jsx              # 메인 앱 컴포넌트
│   │   └── main.jsx             # 앱 진입점
│   ├── public/
│   │   └── kkeolmussae.png      # 껄무새 캐릭터 이미지
│   ├── package.json             # Node.js 의존성
│   └── vite.config.js           # Vite 설정
└── README.md                    # 프로젝트 문서
```

## 🔧 API 엔드포인트

### GET /calculate
주식 수익률을 계산합니다.

**Query Parameters:**
- `ticker` (string): 주식 티커 심볼 (예: "AAPL", "TSLA")
- `date` (string): 구매 날짜 (YYYY-MM-DD 형식)

**Response:**
```json
{
  "return_rate": 25.5,
  "message": "success"
}
```

## 🎯 사용법

1. **날짜 선택**: "[이때]" 텍스트를 클릭하여 년도와 월을 선택
2. **주식 선택**: "[이거]" 텍스트를 클릭하여 주식을 선택
3. **계산**: "얼마 벌었을까?" 버튼을 클릭
4. **결과 확인**: 계산된 수익률과 메시지 확인
5. **공유**: "공유하기" 버튼을 통해 결과를 공유

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## ⚠️ 면책 조항

이 서비스는 엔터테인먼트 목적으로만 제공됩니다. 실제 투자 결정에 사용하지 마시고, 투자 관련 조언은 전문가와 상담하시기 바랍니다.

## 📞 연락처

프로젝트 링크: [https://github.com/hitgub616/kkeolmussae](https://github.com/hitgub616/kkeolmussae)

---

**"아… 그때 내가 이거 샀으면..."** 🦜✨ 