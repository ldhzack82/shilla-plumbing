# 신라건축설비 현장사례 관리자 설정

관리자 주소: `https://shillaplumbing.kr/admin/`

## Vercel 환경변수 4개

Vercel 프로젝트의 **Settings → Environment Variables**에서 아래 값을 Production에 등록합니다.

- `ADMIN_PASSWORD`: 관리자 화면에서 사용할 비밀번호
- `GITHUB_TOKEN`: GitHub Fine-grained personal access token
- `GITHUB_REPO`: `저장소소유자/저장소이름` 형식 (예: `ldhzack82/shilla-plumbing`)
- `GITHUB_BRANCH`: `main`

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
3. 실사진 2장 선택
4. `현장사례 게시하기`
5. 관리 API가 사례 페이지, 현장기록 목록, 사이트맵을 한 번에 GitHub에 커밋
6. Vercel이 GitHub 변경을 감지해 자동 배포

사진은 브라우저에서 WebP, 긴 변 1600px 이하로 자동 최적화됩니다. 관리자 페이지와 API에는 검색엔진 색인 방지 설정이 적용되어 있습니다.
