# FunDrone - 드론 정보 포털

FunDrone은 FPV 및 교육용 드론에 관한 정보를 제공하는 웹사이트입니다.

## 주요 기능

- 드론 문서 게시판: 드론의 기본 원리, 조립 방법, 조종 기술에 관한 문서 제공
- Q&A 게시판: 드론에 관한 질문과 답변 커뮤니티
- 드론 영상/사진 갤러리: 드론으로 촬영한 영상과 사진 공유
- 날씨 정보: 드론 비행에 적합한 날씨 정보 제공

## 기술 스택

- HTML5, CSS3, JavaScript
- 반응형 웹 디자인
- 폰트 어썸 아이콘

## 시작하기

1. 이 저장소를 클론합니다:
   ```
   git clone https://github.com/yourusername/fundrone.git
   ```

2. 웹 브라우저에서 `index.html` 파일을 엽니다.

## 디렉토리 구조

```
fundrone/
├── css/               # 스타일시트 파일
├── js/                # 자바스크립트 파일
├── images/            # 이미지 파일
├── pages/             # 각 페이지 파일
│   ├── board/         # 게시판 페이지
│   ├── gallery/       # 갤러리 페이지
│   └── promotion/     # 홍보 페이지
└── index.html         # 메인 페이지
```

## 이미지 파일

웹사이트에 필요한 이미지 파일은 다음 디렉토리에 추가해야 합니다:

- `images/hero-bg.jpg`: 메인 페이지 배경 이미지
- `images/board-header-bg.jpg`: 게시판 헤더 배경 이미지
- `images/gallery/drone-photo-1.jpg` ~ `drone-photo-3.jpg`: 갤러리 썸네일
- `images/gallery/drone-video-1.jpg` ~ `drone-video-3.jpg`: 비디오 썸네일
- `images/gallery/drone-photo-1-full.jpg`: 전체 크기 사진
- `images/promotion/hero-bg.jpg`: 홍보 페이지 배경 이미지
- `images/promotion/about-image.jpg`: 소개 이미지
- `images/promotion/member1.jpg` ~ `member3.jpg`: 팀원 사진
- `images/fpv-drone.jpg`: FPV 드론 이미지
- `images/education-drone.jpg`: 교육용 드론 이미지
- `images/assembly-guide.jpg`: 조립 가이드 이미지
- `images/flight-techniques.jpg`: 비행 테크닉 이미지
- `images/drone-footage.jpg`: 드론 영상 이미지

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

## Node.js 파일 업로드 서버 실행 방법

1. 의존성 설치

```bash
npm install express multer cors
```

2. 서버 실행

```bash
node server.js
```

3. 업로드 파일은 `/uploads` 폴더에 저장됩니다.

---
