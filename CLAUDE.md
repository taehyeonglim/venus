# CLAUDE.md - AI Face Insight 개발 가이드

## 프로젝트 개요

AI Face Insight는 Google AI Studio에서 시작된 얼굴 외모 분석기 앱입니다. Gemini AI를 활용하여 사용자의 얼굴 사진을 분석하고 매력 지수, 닮은 연예인, 스타일 제안 등을 제공합니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19.2 |
| 언어 | TypeScript 5.8 |
| 빌드 도구 | Vite 6.2 |
| AI API | Google Gemini (`gemini-3-flash-preview`) |
| 스타일링 | Tailwind CSS (CDN) |
| 차트 | Recharts 3.6 |

## 프로젝트 구조

```
venus/
├── App.tsx                    # 메인 앱 컴포넌트 (상태 관리, 라우팅)
├── index.tsx                  # React 엔트리 포인트
├── index.html                 # HTML 템플릿 + Tailwind CDN
├── types.ts                   # TypeScript 인터페이스/enum 정의
├── components/
│   ├── CameraView.tsx         # 웹캠 캡처 컴포넌트
│   ├── ResultDisplay.tsx      # 분석 결과 표시 컴포넌트
│   └── ui/
│       └── Button.tsx         # 재사용 버튼 컴포넌트
├── services/
│   └── geminiService.ts       # Gemini API 호출 서비스
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 주요 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 환경 변수 설정

`.env.local` 파일 생성 필요:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 앱 상태 흐름

```
WELCOME → CAPTURE/파일업로드 → ANALYZING → RESULT
    ↑                                        │
    └────────────── 다시 측정하기 ────────────┘
```

| 상태 | 설명 |
|------|------|
| `WELCOME` | 시작 화면, 카메라/업로드 선택 |
| `CAPTURE` | 웹캠 활성화, 실시간 촬영 |
| `ANALYZING` | Gemini API 분석 중 (로딩) |
| `RESULT` | 분석 결과 표시 |

## 핵심 데이터 타입

```typescript
interface AnalysisResult {
  overallScore: number;        // 종합 점수 (0-100)
  categories: {
    symmetry: number;          // 대칭성
    skinTone: number;          // 피부톤
    facialHarmony: number;     // 조화
    visualAura: number;        // 분위기
  };
  feedback: string;            // AI 상세 피드백
  celebrityLookalike?: string; // 닮은 연예인
  bestFeatures: string[];      // 강점 리스트
  styleAdvice: string;         // 스타일 조언
}
```

## 개발 시 주의사항

1. **API 키 보안**: `GEMINI_API_KEY`는 절대 커밋하지 않음 (`.gitignore`에 포함됨)
2. **카메라 권한**: HTTPS 또는 localhost에서만 카메라 접근 가능
3. **이미지 형식**: Base64 JPEG로 변환하여 API 전송
4. **응답 스키마**: Gemini API는 JSON 스키마를 통해 구조화된 응답 반환

## 현재 개선 필요 사항

### 높은 우선순위
- [ ] Tailwind CSS 빌드 통합 (CDN → npm 패키지)
- [ ] 에러 바운더리 추가
- [ ] 로딩 상태 개선 (스켈레톤 UI)

### 중간 우선순위
- [ ] ESLint + Prettier 설정
- [ ] 테스트 프레임워크 추가 (Vitest)
- [ ] PWA 지원 (오프라인, 설치)

### 낮은 우선순위
- [ ] 다국어 지원 (i18n)
- [ ] 분석 히스토리 저장
- [ ] 소셜 공유 기능

## 코드 스타일 가이드

- 컴포넌트: PascalCase (`CameraView.tsx`)
- 함수/변수: camelCase (`handleCapture`)
- 상수: UPPER_SNAKE_CASE (`AppState.WELCOME`)
- 파일: 컴포넌트는 `.tsx`, 유틸은 `.ts`

## 관련 링크

- [Google AI Studio 원본](https://ai.studio/apps/drive/19Yb0zvMl3gf_JhWvvhkVPq_ID4p92lbl)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Vite 문서](https://vitejs.dev/)
- [Recharts 문서](https://recharts.org/)
