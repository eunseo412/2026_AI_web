# 🧭 TripPick (취향 맞춤형 국내 여행지 추천 웹 서비스)

> **"나에게 딱 맞는 여행지를 찾아보세요."**  
> 사용자가 적은 자유로운 텍스트 입력창에서 원하는 여행 스타일과 취향 키워드를 똑똑하게 포착하여 가장 어울리는 국내 여행지 3곳을 매칭해 드립니다.

이 프로젝트는 **Next.js App Router, TypeScript, Tailwind CSS** 기반으로 제작되었으며, 외부 API 레이턴시 없이 브라우저 고속 필터링 연산을 지원하는 정밀 설계된 MVP 버전으로 Vercel 배포가 즉각 가능합니다.

---

## ✨ 주요 기능

1. **자연어 기반 취향 분석 엔진**
   - 텍스트 입력값에서 핵심 19개 테마 키워드(바다, 힐링, 맛집, 야경, 카페, 역사, 자연 등)를 고속 매칭하여 점수화합니다.
2. **반응형 추천 결과 카드 (Result Grid Card)**
   - 매칭률이 높은 순서대로 최대 3개의 여행지를 미려한 반응형 카드로 렌더링합니다.
   - 각 카드에는 여행지명, 이모지 아이콘, 매칭 점수, 상세 소개글, 전체 태그 및 개인별 **추천 사유 가이드**가 포함됩니다.
3. **지능형 클릭 태그 도우미 (Interactive Suggested Chips)**
   - 사용자가 직접 타이핑하지 않고도 자주 쓰이는 여행 키워드 칩들을 터치 및 클릭하여 자동 단어 조합을 하도록 돕습니다.
4. **유효성 검사 및 자동 예외 보완 처리 (Warm Fallback)**
   - 비어있는 텍스트 전송에 대해 즉각적인 경고 메시지를 노출합니다.
   - 분석 결과 일치하는 단어가 전혀 없을 때, TripPick의 검증된 대표 한국 관광지 3곳(제주도, 부산, 서울)을 따뜻하게 매칭해 줍니다.
5. **학습성 높은 싱글 페이지 디자인**
   - 영감을 주는 **Hero**, 핵심 입력 창인 **Recommend**, 결과를 확인하는 **Result**, 원리를 명쾌히 설명하는 **About**, 협업 정보를 담은 **Team** 섹션까지 한 화면에서 부드럽게 유영합니다.

---

## 🛠️ 기술 스택

- **Framework**: `Next.js 15+ (App Router)`
- **Language**: `TypeScript (Strictly Typed)`
- **Styling**: `Tailwind CSS (Tailwind v4.0 `@theme inline` 구조)`
- **Deployment**: `Vercel`
- **Dependency**: 완전한 순수 클라이언트 로직으로 추가 비용이나 API 키 등록이 필요 없는 경량 최적화 MVP

---

## 📂 파일 구조

```
team_A2/
├── app/
│   ├── layout.tsx         # 글로벌 레이아웃 (SEO 메타데이터 및 폰트)
│   ├── page.tsx           # 메인 페이지 (Hero, 추천, 결과, 소개, 팀 섹션)
│   └── globals.css        # Tailwind 지시어 및 글로벌 스타일링 정의
├── components/
│   ├── RecommendationForm.tsx # 취향 텍스트 입력창 및 키워드 추천 칩 폼
│   ├── DestinationCard.tsx    # 개별 여행지 점수/설명 매칭 결과 카드
│   └── SectionTitle.tsx       # 섹션별 일관된 헤더 컴포넌트
├── data/
│   └── destinations.ts    # 10대 국내 여행지 고품질 데이터베이스 세트
├── lib/
│   └── recommend.ts       # 형태소 및 텍스트 포함 여부 스코어링 알고리즘
├── package.json           # 설치 패키지 목록 및 빌드 스크립트
└── README.md              # 이 문서 (프로젝트 안내서)
```

---

## 🚀 설치 및 시작 방법

### 1. 사전 요구사항
컴퓨터에 [Node.js (v18.0 이상 추천)](https://nodejs.org/)이 설치되어 있어야 합니다.

### 2. 패키지 설치
프로젝트 루트 디렉토리(`/Users/eunseo/Documents/2026-1/ai_programming/team_A2`)에서 아래 명령어를 실행하여 필요한 패키지를 내려받습니다.

```bash
npm install
```

### 3. 로컬 개발 서버 실행
로컬 개발 환경에서 프로젝트를 즉시 구동합니다.

```bash
npm run dev
```

터미널에 안내가 표시되면, 웹 브라우저를 열고 `http://localhost:3000`에 접속합니다.

### 4. 프로덕션 빌드 테스트
Vercel 배포 전에 코드가 에러 없이 정상적으로 빌드되는지 미리 검사합니다.

```bash
npm run build
```

---

## ☁️ Vercel 배포 방법

이 프로젝트는 별도의 서버 인프라 구성 없이 Vercel로 쉽게 배포 가능합니다.

### 방법 A: Vercel CLI 활용 배포 (로컬 터미널)
1. 로컬 터미널에서 Vercel 패키지를 글로벌로 실행하거나 npx로 즉시 배포합니다:
   ```bash
   npx vercel
   ```
2. 로그인 안내에 따라 계정을 연동합니다.
3. 설정 옵션이 나올 때, 모두 Enter(디폴트값)를 치면 수 초 만에 배포 URL이 발급됩니다.
4. 프로덕션 최종 배포를 발행하려면 다음 명령어를 적용합니다:
   ```bash
   npx vercel --prod
   ```

### 방법 B: GitHub 연동 배포 (권장)
1. 본 프로젝트 폴더 전체를 개인 **GitHub 저장소**에 업로드(push)합니다.
2. [Vercel 대시보드](https://vercel.com/)로 이동하여 로그인합니다.
3. **"Add New Project"**를 누른 뒤, 생성한 GitHub 저장소를 Import 합니다.
4. Framework Preset이 **Next.js**로 지정되어 있는지 확인하고 **"Deploy"** 버튼을 클릭합니다.
5. 이후 GitHub 레포에 새로운 수정사항을 `git push` 할 때마다 Vercel이 무료로 자동 배포를 업데이트합니다.

---

## 👥 팀원 역할 및 분담

협업 프로세스의 성공을 증명하기 위해 아래와 같이 명확한 역할 분담 하에 진행되었습니다.

* **은서 (Lead Frontend Developer & UI Designer)**
  - **역할**: 프로젝트 아키텍처 초안 설정, Tailwind CSS 반응형 디자인 시스템 구축, 레이아웃 프레임(`app/layout.tsx`, `app/page.tsx`), `SectionTitle`, `DestinationCard` 컴포넌트 마크업 및 애니메이션 효과 총괄.
* **[팀원 2 이름] (Algorithm & API Engineer)**
  - **역할**: 입력 문자열을 클렌징하고 키워드를 점수화하는 알고리즘 모듈(`lib/recommend.ts`) 핵심 함수 작성, 상태 관리 로직 최적화, 스크롤 이동 인터랙션 구현.
* **[팀원 3 이름] (Database & QA Engineer)**
  - **역할**: 전국 10대 명소 데이터베이스 스키마 및 한국어 메타데이터 팩(`data/destinations.ts`) 구성, 로컬 엣지 케이스 디버깅, Vercel 배포 최적화 및 기술 문서 구성.
