# 신라건축설비 현장사례 관리자 설정

관리자 주소: `https://shillaplumbing.kr/admin/`

## Vercel 환경변수

Vercel 프로젝트의 **Settings → Environment Variables**에서 아래 값을 Production에 등록합니다.

- `ADMIN_PASSWORD`: 관리자 화면에서 사용할 비밀번호
- `GITHUB_TOKEN`: GitHub Fine-grained personal access token
- `GITHUB_REPO`: `저장소소유자/저장소이름` 형식 (예: `ldhzack82/shilla-plumbing`)
- `GITHUB_BRANCH`: `main`
- `OPENAI_API_KEY`: 관리자 AI SEO 원고 생성에 사용할 OpenAI API 키
- `OPENAI_MODEL`: 선택사항. 비워두면 `gpt-5.6` 사용
- `GOOGLE_MAP_CID`: 선택사항. Google 비즈니스 프로필 CID 숫자
- `GOOGLE_REVIEW_URL`: 선택사항. Google 비즈니스 프로필의 직접 리뷰 작성 링크

환경변수를 저장한 뒤 **Deployments → 최신 배포 → Redeploy**를 한 번 실행합니다.

## GitHub 토큰 권한

GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens에서 발급합니다.

- Repository access: 신라건축설비 홈페이지 저장소만 선택
- Repository permissions → Contents: Read and write
- 만료일: 관리 가능한 기간으로 지정하고 만료일을 기록

토큰은 홈페이지 코드나 관리자 입력창에 넣지 않고 Vercel 환경변수에만 저장합니다.

## 게시 흐름

1. `/admin/` 로그인
2. 지역·서비스·현장 내용을 작성
3. 짧은 현장 메모를 입력하고 `AI SEO 원고 생성`을 눌러 원고 검토·수정
4. 실사진 2장 선택
5. `현장사례 게시하기`
6. 관리 API가 사례 페이지, 현장기록 목록, 사이트맵을 한 번에 GitHub에 커밋
7. Vercel이 GitHub 변경을 감지해 자동 배포

사진은 브라우저에서 WebP, 긴 변 1600px 이하로 자동 최적화됩니다. 관리자 페이지와 API에는 검색엔진 색인 방지 설정이 적용되어 있습니다.

AI API 키는 브라우저로 전달되지 않고 Vercel 서버 함수에서만 사용됩니다. AI 원고는 입력한 현장 사실을 확장하는 초안이므로 게시 전에 사실관계와 표현을 확인합니다.

모든 신규 사례 하단에는 서울 25개 구·경기도 31개 시군 출동지역, Google 지도, 주소, 24시간 영업, 길찾기, 리뷰, 대표번호가 자동 삽입됩니다. CID나 직접 리뷰 링크가 없으면 제공된 Google 지도 공유 링크를 사용합니다.

게시·수정·삭제 시 `sitemap.xml`과 `rss.xml`이 자동 갱신됩니다. IndexNow 키 파일은 `/indexnow-key.txt`에 포함되어 있고, 게시 직후와 배포 예상 시점에 새 URL·사이트맵·RSS 변경 알림을 보냅니다.
