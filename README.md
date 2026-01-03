# AI Face Insight - 얼굴 외모 분석기

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)

**AI 기반 얼굴 분석으로 당신만의 고유한 매력을 발견하세요**

</div>

## 소개

AI Face Insight는 Google Gemini AI를 활용한 얼굴 외모 분석 웹 애플리케이션입니다. 사용자의 얼굴 사진을 분석하여 매력 지수, 얼굴 특성, 닮은 연예인, 그리고 개인화된 스타일 조언을 제공합니다.

> 이 프로젝트는 Google AI Studio에서 시작되어 Claude Code에서 정교화 개발이 진행되고 있습니다.
>
> [AI Studio 원본 보기](https://ai.studio/apps/drive/19Yb0zvMl3gf_JhWvvhkVPq_ID4p92lbl)

## 주요 기능

| 기능 | 설명 |
|------|------|
| **카메라 촬영** | 웹캠을 통한 실시간 셀피 촬영 |
| **이미지 업로드** | 갤러리에서 사진 선택 |
| **종합 매력 지수** | 0-100점 기반 종합 평가 |
| **세부 분석** | 대칭성, 피부톤, 조화, 분위기 점수 |
| **닮은 연예인** | AI가 분석한 유사 연예인 추천 |
| **스타일 조언** | 헤어스타일, 안경, 컬러 등 개인화 제안 |
| **레이더 차트** | 시각적 분석 결과 표시 |

## 스크린샷

```
┌─────────────────────────────────────┐
│         AI Face Insight             │
│   당신만의 고유한 매력을 발견해 보세요   │
├─────────────────────────────────────┤
│                                     │
│            🤳                        │
│       시작해볼까요?                   │
│                                     │
│   [카메라로 촬영]  [사진 업로드]        │
│                                     │
└─────────────────────────────────────┘
```

## 빠른 시작

### 사전 요구사항

- Node.js 18+
- Google Gemini API 키 ([발급받기](https://aistudio.google.com/apikey))

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd venus

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 GEMINI_API_KEY 입력
```

### 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 키 | O |

`.env.local` 파일 예시:
```env
GEMINI_API_KEY=AIzaSy...your-api-key
```

## 기술 스택

### 프론트엔드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Recharts** - 레이더 차트 시각화

### 빌드 & 개발
- **Vite** - 빠른 개발 서버 & 빌드

### AI
- **Google Gemini** - 멀티모달 AI 분석 (`gemini-3-flash-preview`)

## 프로젝트 구조

```
venus/
├── App.tsx                 # 메인 앱 (상태 관리)
├── types.ts                # TypeScript 타입 정의
├── components/
│   ├── CameraView.tsx      # 카메라 UI
│   ├── ResultDisplay.tsx   # 결과 화면
│   └── ui/
│       └── Button.tsx      # 버튼 컴포넌트
├── services/
│   └── geminiService.ts    # Gemini API 연동
└── ...설정 파일들
```

## 개발자 가이드

개발에 참여하시려면 [CLAUDE.md](./CLAUDE.md)를 참고해 주세요.

## 프라이버시

- 업로드된 이미지는 분석 즉시 삭제됩니다
- 서버에 어떤 이미지도 저장하지 않습니다
- 분석은 클라이언트 → Gemini API 직접 통신으로 이루어집니다

## 면책 조항

이 앱의 분석 결과는 AI의 가상 평가이며, 실제 외모의 절대적인 지표가 아닙니다. 모든 결과는 재미와 참고용으로만 활용해 주세요. **당신은 그 자체로 충분히 아름답습니다.**

## 라이선스

MIT License

---

<div align="center">

**Powered by Google Gemini AI**

[문제 신고](../../issues) · [기능 제안](../../issues)

</div>
