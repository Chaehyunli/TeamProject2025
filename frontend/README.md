# 🖥️ ClubMoa Frontend

> ClubMoa 동아리 통합 플랫폼의 React 클라이언트

📖 프로젝트 전체 소개는 [루트 README](../README.md)를 참고하세요.

---

## 🛠️ 기술 스택

| 기술 | 버전 | 설명 |
|------|------|------|
| React | 18.2.0 | UI 라이브러리 |
| React Router | 7.1.5 | 라우팅 |
| Tailwind CSS | 3.x | 스타일링 |
| Axios | 1.7.9 | HTTP 클라이언트 |
| SockJS + Webstomp | 1.6.1 / 1.2.6 | 실시간 채팅 (STOMP) |
| Day.js | 1.11.13 | 날짜 처리 |
| React Icons | 5.4.0 | 아이콘 |

---

## 🚀 시작하기

### Prerequisites

- Node.js 18 이상
- npm
- 백엔드 서버 실행 중 (Spring Boot, `http://localhost:8080`)

### 설치 및 실행

```bash
npm install       # 의존성 설치 (최초 1회)
npm start         # 개발 서버 실행 (http://localhost:3000)
```

### 빌드

```bash
npm run build     # production 빌드 (build/ 디렉터리 생성)
```

### Docker

```bash
docker build -t clubmoa-frontend .
docker run -p 3000:80 clubmoa-frontend
```

---

## ⚙️ 환경 변수

| 파일 | 용도 |
|------|------|
| `.env` | 기본 환경 변수 |
| `.env.development` | 개발 환경 (npm start) |
| `.env.production` | 운영 환경 (npm run build) |

```properties
# 개발 환경
REACT_APP_API_BASE_URL=http://localhost:8080

# 운영 환경 (.env.production)
REACT_APP_API_BASE_URL=http://<SERVER_IP>:8080
```

---

## 📂 프로젝트 구조

```
frontend/
├── public/                           # 정적 리소스
│   ├── index.html                   #   HTML 엔트리포인트
│   ├── favicon.ico                  #   파비콘
│   ├── banner.png                   #   배너 이미지
│   ├── manifest.json               #   PWA 매니페스트
│   └── robots.txt                   #   크롤러 설정
│
├── src/
│   ├── api/                          # API 클라이언트 모듈
│   │   ├── api.js                   #   API Base URL 상수 정의
│   │   ├── authApi.js               #   인증 API
│   │   ├── clubApi.js               #   동아리 API
│   │   ├── chatApi.js               #   채팅 API + WebSocket/STOMP 로직
│   │   ├── categoryApi.js           #   카테고리 API
│   │   ├── commentApi.js            #   댓글 API
│   │   ├── userApi.js               #   유저 API
│   │   └── uploadApi.js             #   파일 업로드 (Presigned URL + ProtectedImage)
│   │
│   ├── components/                   # UI 컴포넌트 (39개)
│   │   ├── TopNavbar.js             #   상단 네비게이션 바
│   │   ├── ClubCard.js              #   동아리 카드
│   │   ├── ClubList.js              #   동아리 목록
│   │   ├── LoginForm.js             #   로그인 폼
│   │   ├── RegisterForm.js          #   회원가입 폼
│   │   ├── ProtectedRoute.js        #   인증 라우트 가드
│   │   ├── Comment.js               #   댓글 (대댓글 지원)
│   │   ├── DirectMessageButton.js   #   1:1 채팅 버튼
│   │   ├── FileUpload.js            #   파일 업로드
│   │   ├── Spinner.js               #   로딩 스피너
│   │   └── ...
│   │
│   ├── pages/                        # 페이지 컴포넌트 (23개)
│   │   ├── HomePage.js              #   메인 페이지
│   │   ├── LoginPage.js             #   로그인
│   │   ├── RegisterPage.js          #   회원가입
│   │   ├── ClubDetailPage.js        #   동아리 상세
│   │   ├── ClubRegisterPage.js      #   동아리 생성
│   │   ├── MyChatPage.js            #   채팅 목록
│   │   ├── StompChatPage.js         #   채팅방 (실시간)
│   │   ├── ProfilePage.js           #   프로필
│   │   ├── MySubmissionsPage.js     #   내 지원서 목록
│   │   └── ...
│   │
│   ├── context/                      # React Context
│   │   ├── AuthContext.js           #   인증 상태 (로그인/로그아웃)
│   │   └── ChatContext.js           #   채팅 참여자 상태 관리
│   │
│   ├── layouts/
│   │   └── ChatLayout.js            #   채팅 레이아웃
│   │
│   ├── constants/
│   │   └── DefaultImage.js          #   기본 이미지 상수
│   │
│   ├── assets/                       # 이미지 · 아이콘 리소스
│   ├── index.js                      # 앱 엔트리포인트
│   ├── index.css                     # 글로벌 스타일 (Tailwind 지시자)
│   ├── App.js                        # 루트 컴포넌트 (라우터 설정)
│   ├── App.css                       # 앱 스타일
│   ├── App.test.js                   # 앱 테스트
│   ├── setupTests.js                 # 테스트 설정
│   ├── reportWebVitals.js            # 성능 측정
│   └── logo.svg                      # 로고 이미지
│
├── .env                              # 기본 환경 변수
├── .env.development                  # 개발 환경 변수
├── .env.production                   # 운영 환경 변수
├── Dockerfile                        # Docker 이미지 (nginx 기반)
├── tailwind.config.js                # Tailwind CSS 설정
├── postcss.config.js                 # PostCSS 설정
└── package.json                      # 의존성 및 스크립트
```

---

## 📡 주요 API 연동

| 모듈 | 백엔드 엔드포인트 | 설명 |
|------|-------------------|------|
| `authApi` | `/api/v1/auth/*` | 로그인, 로그아웃, 이메일 인증, 비밀번호 재설정, 아이디 찾기, 유저 밴 |
| `userApi` | `/api/v1/users/*` | 회원가입, 프로필, 지원서 관리 |
| `clubApi` | `/api/v1/clubs/*` | 동아리 CRUD, 게시글, 공지, 멤버십 |
| `chatApi` | `/api/v1/chat/*` | 채팅방 관리, 메시지 내역 |
| `commentApi` | `/api/v1/comment/*` | 댓글 CRUD |
| `categoryApi` | `/api/v1/categories` | 카테고리 목록 |
| `uploadApi` | `/api/v1/upload/*` | Presigned URL 발급 |

### 실시간 채팅 (WebSocket)

```
SockJS 연결: /connect
STOMP publish: /publish/{roomId}
STOMP subscribe: /topic/{roomId}
```
