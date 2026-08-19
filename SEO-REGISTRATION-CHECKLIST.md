# 신라건축설비 검색 노출 등록 체크리스트

## 현재 소스 점검 결과

- `robots.txt`: 전체 검색 허용, `/admin/`과 `/api/`만 차단
- `sitemap.xml`: 정상 XML이며 현장기록 상세 URL 포함
- 네이버 소유확인 파일: 루트 경로에 포함
- IndexNow: 새 글 게시·삭제 후 URL, sitemap, RSS 자동 알림
- 상세 페이지: canonical, meta description, Article/Plumber 구조화 데이터 포함
- 새 글 게시 시: 현장기록 목록·해당 구·해당 서비스 허브의 `lastmod` 자동 갱신

## Google Search Console

1. `https://search.google.com/search-console/`에서 `shillaplumbing.kr` 속성을 확인합니다.
2. 도메인 속성이 없다면 DNS TXT 방식으로 소유권을 확인합니다.
3. `Sitemaps` 메뉴에 `https://shillaplumbing.kr/sitemap.xml`을 제출합니다.
4. `URL 검사`에서 홈페이지, 현장기록 목록, 최신 현장기록 URL을 각각 검사합니다.
5. 아직 색인되지 않은 최신 글은 `색인 생성 요청`을 실행합니다.
6. 제출 후 `페이지 색인 생성`과 `향상된 기능` 보고서의 오류를 확인합니다.

## 네이버 서치어드바이저

1. `https://searchadvisor.naver.com/`에서 `https://shillaplumbing.kr` 사이트 소유확인 상태를 확인합니다.
2. `요청 → 사이트맵 제출`에서 `https://shillaplumbing.kr/sitemap.xml`을 제출합니다.
3. `요청 → RSS 제출`에서 `https://shillaplumbing.kr/rss.xml`을 제출합니다.
4. `검증 → robots.txt`에서 수집 허용과 sitemap 인식을 확인합니다.
5. `요청 → 웹 페이지 수집`에서 홈페이지, 현장기록 목록, 최신 글 URL을 요청합니다.
6. `리포트 → 사이트 최적화`와 `콘텐츠 노출/수집 현황`을 주기적으로 확인합니다.

## 배포 후 빠른 확인 URL

- `https://shillaplumbing.kr/robots.txt`
- `https://shillaplumbing.kr/sitemap.xml`
- `https://shillaplumbing.kr/rss.xml`
- `https://shillaplumbing.kr/field-notes/`

검색엔진 수집과 색인 반영에는 시간이 걸릴 수 있으며, 사이트맵 제출이나 수집 요청이 즉시 검색 노출을 보장하지는 않습니다.
