const crypto = require("crypto");
const OWNER_REPO = () => {
  const raw = process.env.GITHUB_REPO || "";
  const [owner, repo] = raw.split("/");
  return { owner, repo };
};
const BRANCH = () => process.env.GITHUB_BRANCH || "main";
const DOMAIN = "https://shillaplumbing.kr";
const BUSINESS = {
  name: "신라건축설비",
  address: "서울 서초구 반포동 703-12",
  phone: "1877-0558",
  phoneHref: "18770558",
  hours: "24시간 연중무휴",
  mapShare: "https://maps.app.goo.gl/ojkHvdA8wFKuHzH18?g_st=ac",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x357ca38253f7b64f%3A0xd50e7582734fe5c7!2z7Iug65286rG07LaV7ISk67mEIO2VmOyImOq1rOunie2emCDriITsiJjtg5Dsp4Ag67Cw6rSA6rO17IKs7KCE66y4IOuzgOq4sOunie2emCDsi7HtgazrjIDrp4ntnpg!5e0!3m2!1sko!2skr!4v1787122302967!5m2!1sko!2skr",
  reviewUrl: "https://g.page/r/CcflT3OCdQ7VEAI/review",
};
const INDEXNOW_KEY = "7dd96f0ce8412a761700b09f320dc453";
const SEOUL_AREAS = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];
const GYEONGGI_AREAS = [
  "수원시",
  "용인시",
  "고양시",
  "화성시",
  "성남시",
  "부천시",
  "남양주시",
  "안산시",
  "평택시",
  "안양시",
  "시흥시",
  "파주시",
  "김포시",
  "의정부시",
  "광주시",
  "하남시",
  "광명시",
  "군포시",
  "양주시",
  "오산시",
  "이천시",
  "안성시",
  "구리시",
  "의왕시",
  "포천시",
  "양평군",
  "여주시",
  "동두천시",
  "과천시",
  "가평군",
  "연천군",
];
const districtSlugs = {
  강남구: "gangnam",
  강동구: "gangdong",
  강북구: "gangbuk",
  강서구: "gangseo",
  관악구: "gwanak",
  광진구: "gwangjin",
  구로구: "guro",
  금천구: "geumcheon",
  노원구: "nowon",
  도봉구: "dobong",
  동대문구: "dongdaemun",
  동작구: "dongjak",
  마포구: "mapo",
  서대문구: "seodaemun",
  서초구: "seocho",
  성동구: "seongdong",
  성북구: "seongbuk",
  송파구: "songpa",
  양천구: "yangcheon",
  영등포구: "yeongdeungpo",
  용산구: "yongsan",
  은평구: "eunpyeong",
  종로구: "jongno",
  중구: "jung",
  중랑구: "jungnang",
  수원시: "suwon",
  용인시: "yongin",
  고양시: "goyang",
  화성시: "hwaseong",
  성남시: "seongnam",
  부천시: "bucheon",
  남양주시: "namyangju",
  안산시: "ansan",
  평택시: "pyeongtaek",
  안양시: "anyang",
  시흥시: "siheung",
  파주시: "paju",
  김포시: "gimpo",
  의정부시: "uijeongbu",
  광주시: "gwangju",
  하남시: "hanam",
  광명시: "gwangmyeong",
  군포시: "gunpo",
  양주시: "yangju",
  오산시: "osan",
  이천시: "icheon",
  안성시: "anseong",
  구리시: "guri",
  의왕시: "uiwang",
  포천시: "pocheon",
  양평군: "yangpyeong",
  여주시: "yeoju",
  동두천시: "dongducheon",
  과천시: "gwacheon",
  가평군: "gapyeong",
  연천군: "yeoncheon",
};

const GYEONGGI_CHILD_TO_CITY = {
  "수지구": "용인시",
  "단원구": "안산시",
  "상록구": "안산시",
};
function parentCityForDistrict(district = "") {
  const m = String(district).match(/^(.+?시)\s+(.+구)$/);
  if (m) return m[1];
  return GYEONGGI_CHILD_TO_CITY[district] || "";
}
function childDistrictLabel(district = "") {
  const m = String(district).match(/^(.+?시)\s+(.+구)$/);
  return m ? m[2] : district;
}
function topAreaForDistrict(district = "") {
  return parentCityForDistrict(district) || district;
}
function topAreaSlug(area = "") {
  return districtSlugs[area] || districtSlugFor(area);
}
const serviceNames = {
  "toilet-clog": "변기막힘",
  "sink-clog": "싱크대막힘",
  "drain-clog": "하수구막힘",
  "high-pressure-cleaning": "고압세척",
  "leak-detection": "누수탐지",
  "pipe-work": "배관공사",
  odor: "하수구악취",
};

const CORE_SERVICE_SEO = {
  "toilet-clog": { intent: "변기뚫는업체", title: "변기막힘·변기뚫는업체", symptoms: "물이 천천히 내려가거나 수위가 차오르는 막힘, 이물질 막힘, 반복 막힘, 변기 역류", methods: "석션·에어건·내시경 점검·변기 탈거와 오수관 확인" },
  "sink-clog": { intent: "싱크대뚫는업체", title: "싱크대막힘·싱크대뚫는업체", symptoms: "물이 천천히 빠지는 증상, 싱크대 역류, 기름때·슬러지로 인한 반복 막힘", methods: "석션·샤프트·배관내시경 점검과 배관 스케일링" },
  "drain-clog": { intent: "하수구뚫는업체", title: "하수구막힘·하수구뚫는업체", symptoms: "바닥 배수구 역류, 여러 배수구의 동시 막힘, 악취와 반복되는 배수 불량", methods: "배관내시경·샤프트·석션·고압세척과 공용배관 점검" },
};
function serviceLabel(key) { return CORE_SERVICE_SEO[key]?.title || serviceNames[key] || key; }

const REGION_INFO = {
  seoul: { name: "서울", title: "서울특별시" },
  gyeonggi: { name: "경기", title: "경기도" },
  incheon: { name: "인천", title: "인천광역시" },
};
const INCHEON_AREAS = ["부평구", "계양구", "남동구", "미추홀구", "연수구", "서구", "동구", "중구", "강화군", "옹진군"];
function regionForDistrict(district = "") {
  if (SEOUL_AREAS.includes(district)) return "seoul";
  if (INCHEON_AREAS.includes(district)) return "incheon";
  if (GYEONGGI_AREAS.includes(district)) return "gyeonggi";
  if (["수지구", "단원구"].includes(district)) return "gyeonggi";
  if (GYEONGGI_AREAS.some((area) => district.includes(area.replace(/[시군]$/, "")))) return "gyeonggi";
  return "gyeonggi";
}
function districtSlugFor(district = "") {
  return districtSlugs[district] || slug(district) || "service-area";
}
const serviceQuestions = {
  "toilet-clog": [
    "변기를 꼭 탈거해야 하나요?",
    "작업 전 비용을 알 수 있나요?",
    "같은 증상이 다시 생기면 어떻게 하나요?",
  ],
  "sink-clog": [
    "싱크대 물이 천천히 내려가면 바로 점검해야 하나요?",
    "작업 전 비용을 알 수 있나요?",
    "약품으로 해결되지 않으면 어떻게 하나요?",
  ],
  "drain-clog": [
    "여러 배수구가 동시에 역류하면 공용배관 문제인가요?",
    "고압세척이 항상 필요한가요?",
    "작업 전 추가 비용을 확인할 수 있나요?",
  ],
  "high-pressure-cleaning": [
    "고압세척은 어떤 경우에 필요한가요?",
    "배관내시경도 함께 사용하나요?",
    "작업 범위와 비용은 어떻게 정하나요?",
  ],
  "leak-detection": [
    "누수탐지는 어떤 장비로 진행하나요?",
    "탐지 후 공사비는 별도인가요?",
    "보험 제출 자료를 받을 수 있나요?",
  ],
  "pipe-work": [
    "공사 전에 견적을 받을 수 있나요?",
    "추가 공사가 생기면 바로 진행하나요?",
    "작업 후 A/S는 어떻게 되나요?",
  ],
  odor: [
    "하수구 냄새 원인을 바로 찾을 수 있나요?",
    "트랩 교체만으로 해결되나요?",
    "재발하면 다시 점검받을 수 있나요?",
  ],
};
function json(res, status, data) {
  res
    .status(status)
    .setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}
function auth(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const actual = String(req.headers["x-admin-password"] || "");
  if (!expected || !actual) return false;
  const a = Buffer.from(expected),
    b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function missing() {
  return ["ADMIN_PASSWORD", "GITHUB_TOKEN", "GITHUB_REPO"].filter(
    (k) => !process.env[k],
  );
}
function esc(v = "") {
  return String(v).replace(
    /[&<>'"]/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        s
      ],
  );
}
function text(v = "") {
  return esc(v).replace(/\r?\n/g, "<br>");
}
function slug(v = "") {
  return String(v)
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
function safePath(p = "") {
  return String(p)
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.\./g, "");
}
async function gh(path, options = {}) {
  const { owner, repo } = OWNER_REPO();
  if (!owner || !repo)
    throw new Error("GITHUB_REPO 환경변수 형식은 소유자/저장소입니다.");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}${path}`,
    {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "shilla-admin",
        ...(options.headers || {}),
      },
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub 오류 ${res.status}: ${body.slice(0, 240)}`);
  }
  return res.status === 204 ? null : res.json();
}
async function getFile(path) {
  try {
    const d = await gh(
      `/contents/${encodeURI(path)}?ref=${encodeURIComponent(BRANCH())}`,
    );
    return Buffer.from(d.content, "base64").toString("utf8");
  } catch (e) {
    if (String(e.message).includes("GitHub 오류 404")) return null;
    throw e;
  }
}
async function registry() {
  const raw = await getFile("content/admin-cases.json");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
async function commitFiles(files, message) {
  const branch = BRANCH();
  const ref = await gh(`/git/ref/heads/${encodeURIComponent(branch)}`);
  const parentSha = ref.object.sha;
  const parent = await gh(`/git/commits/${parentSha}`);
  const entries = [];
  for (const f of files) {
    if (f.delete) {
      entries.push({ path: f.path, mode: "100644", type: "blob", sha: null });
      continue;
    }
    const blob = await gh("/git/blobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: f.base64
          ? f.content
          : Buffer.from(f.content, "utf8").toString("base64"),
        encoding: "base64",
      }),
    });
    entries.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const tree = await gh("/git/trees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries }),
  });
  const commit = await gh("/git/commits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
  });
  await gh(`/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return commit.sha;
}
function normalize(c) {
  const allowed = Object.keys(serviceNames);
  for (const k of [
    "date",
    "service",
    "district",
    "neighborhood",
    "title",
    "summary",
    "symptom",
    "cause",
    "equipment",
    "result",
    "intro",
    "step1",
    "step2",
    "closing",
    "caption1",
    "caption2",
  ]) {
    c[k] = String(c[k] || "").trim();
    if (!c[k]) throw new Error(`${k} 항목을 입력해주세요.`);
  }
  if (!allowed.includes(c.service))
    throw new Error("지원하지 않는 서비스입니다.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date))
    throw new Error("게시일 형식이 올바르지 않습니다.");
  c.thumbnailIndex = Number(c.thumbnailIndex) === 1 ? 1 : 0;
  return c;
}
function makeIdentity(c, cases) {
  const districtSlug =
    districtSlugs[c.district] || slug(c.district) || "service-area";
  const base = `${districtSlug}-${c.service}`;
  let id = String(c.originalPath || "")
    .split("/")
    .pop();
  if (!id) {
    let n = 1;
    while (
      cases.some(
        (x) =>
          x.path ===
          `${districtSlug}/${c.service}/${base}-${String(n).padStart(3, "0")}`,
      )
    )
      n++;
    id = `${base}-${String(n).padStart(3, "0")}`;
  }
  return { districtSlug, id, path: `${districtSlug}/${c.service}/${id}` };
}
function imageNames(c) {
  const local = `${districtSlugs[c.district] || slug(c.district) || "field"}-${c.service}`;
  return [`${local}-work-01.webp`, `${local}-work-02.webp`];
}
function regionBlock(c) {
  const service = serviceNames[c.service];
  return `<section class="service-areas"><h2>${esc(service)} 서울·경기 출동지역</h2><p>신라건축설비는 ${esc(c.district)} ${esc(c.neighborhood)} 현장을 포함해 서울 25개 구와 경기도 31개 시·군의 배관 문제를 상담합니다. 현장 거리와 기사 배정 상황에 따라 출동 가능 여부를 먼저 안내드립니다.</p><h3>서울 전 지역</h3><p class="area-list">${SEOUL_AREAS.map(esc).join(" · ")}</p><h3>경기도 주요 출동지역</h3><p class="area-list">${GYEONGGI_AREAS.map(esc).join(" · ")}</p></section>`;
}
function businessBlock() {
  const mapUrl = BUSINESS.mapShare,
    reviewUrl = process.env.GOOGLE_REVIEW_URL || BUSINESS.reviewUrl,
    directions = BUSINESS.mapShare;
  return `<section class="google-business"><h2>신라건축설비 위치·상담 안내</h2><div class="business-grid"><div class="map-frame"><iframe src="${esc(BUSINESS.mapEmbed)}" title="신라건축설비 Google 지도" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="business-info"><h3>${BUSINESS.name}</h3><dl><div><dt>주소</dt><dd>${BUSINESS.address}</dd></div><div><dt>영업시간</dt><dd>${BUSINESS.hours}</dd></div><div><dt>대표번호</dt><dd><a href="tel:${BUSINESS.phoneHref}">${BUSINESS.phone}</a></dd></div></dl><div class="business-actions"><a href="${esc(mapUrl)}" target="_blank" rel="noopener">Google 지도 프로필</a><a href="${esc(reviewUrl)}" target="_blank" rel="noopener">Google 리뷰 작성</a><a href="${esc(directions)}" target="_blank" rel="noopener">길찾기</a><a class="call" href="tel:${BUSINESS.phoneHref}">대표번호 전화</a></div></div></div></section>`;
}
function article(c) {
  const service = serviceNames[c.service],
    url = `${DOMAIN}/${c.path}/`,
    imgs = c.photos.map((p) => `${url}${p.name}`),
    thumbIndex = Number(c.thumbnailIndex) === 1 ? 1 : 0,
    thumb = imgs[thumbIndex];
  const title = `${c.district} ${c.neighborhood} ${service} | ${c.title}`.slice(
    0,
    100,
  );
  const desc =
    `${c.district} ${c.neighborhood} ${service} 현장사례입니다. ${c.summary}`.slice(
      0,
      160,
    );
  const q = serviceQuestions[c.service] || serviceQuestions["pipe-work"];
  const faq = [
    [
      q[0],
      `${c.symptom}처럼 증상이 나타나더라도 원인은 현장마다 다를 수 있습니다. 장비와 배관 구조를 확인한 뒤 필요한 작업 범위를 안내합니다.`,
    ],
    [
      q[1],
      `작업 전 증상과 현장 여건을 확인해 예상 범위와 비용을 먼저 안내합니다. 변기 탈거, 장비 추가 투입 또는 공용배관 작업이 필요한 경우 고객 동의 없이 임의로 진행하지 않습니다.`,
    ],
    [
      q[2],
      `완료 후 정상 작동을 함께 확인하고 작업 범위에 따른 사후 안내를 드립니다. 동일 증상이 반복되면 현장 기록을 기준으로 원인을 다시 점검합니다.`,
    ],
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: desc,
        image: imgs,
        author: { "@id": `${DOMAIN}/#business` },
        publisher: { "@id": `${DOMAIN}/#business` },
        mainEntityOfPage: url,
        datePublished: c.date,
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "Plumber",
        "@id": `${DOMAIN}/#business`,
        name: BUSINESS.name,
        url: DOMAIN,
        telephone: BUSINESS.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "반포동 703-12",
          addressLocality: "서초구",
          addressRegion: "서울특별시",
          addressCountry: "KR",
        },
        openingHours: "Mo-Su 00:00-23:59",
        areaServed: [...SEOUL_AREAS, ...GYEONGGI_AREAS],
      },
    ],
  };
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><link rel="alternate" type="application/rss+xml" title="신라건축설비 현장기록 RSS" href="${DOMAIN}/rss.xml">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${thumb}"><meta property="og:url" content="${url}">
<link rel="stylesheet" href="../../../field-notes/styles.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script></head>
<body><header class="topbar"><div class="wrap"><a class="brand" href="../../../">신라건축설비</a><nav class="nav-actions" aria-label="페이지 이동"><a class="home-link primary" href="../../../">홈으로</a><a class="home-link" href="../../../field-notes/">현장기록 전체보기</a></nav></div></header><main>
<section class="hero"><div class="wrap"><p class="eyebrow">${esc(c.district)} · ${esc(c.neighborhood)} · ${esc(service)}</p><h1>${esc(c.title)}</h1><p>${esc(c.summary)}</p></div></section>
<div class="wrap breadcrumbs"><a href="../../../">홈</a> › <a href="../../../field-notes/">현장기록</a> › <a href="../../../${regionForDistrict(c.district)}/">${esc(REGION_INFO[regionForDistrict(c.district)].name)}</a> › <a href="../../../${districtSlugFor(c.district)}/">${esc(c.district)}</a> › <a href="../../../${districtSlugFor(c.district)}/${c.service}/">${esc(service)}</a> › ${esc(c.neighborhood)}</div>
<div class="wrap"><dl class="summary"><div><dt>지역</dt><dd>${esc(c.district)} ${esc(c.neighborhood)}</dd></div><div><dt>증상</dt><dd>${esc(c.symptom)}</dd></div><div><dt>확인 원인</dt><dd>${esc(c.cause)}</dd></div><div><dt>작업 방법</dt><dd>${esc(c.equipment)}</dd></div></dl></div>
<div class="wrap content"><article class="article">
<section><h2>${esc(c.district)} ${esc(c.neighborhood)} ${esc(service)}, 현장 도착 후 진단</h2><p>${text(c.intro)}</p></section>
<section><h2>1단계: 증상 확인과 필요한 장비 작업</h2><p>${text(c.step1)}</p><figure class="article-image"><img src="${esc(c.photos[0].name)}" width="${c.photos[0].width}" height="${c.photos[0].height}" loading="lazy" alt="${esc(`${c.district} ${c.neighborhood} ${service} ${c.caption1}`)}"><figcaption>${esc(c.caption1)}</figcaption></figure></section>
<section><h2>2단계: 원인 구간 처리와 정상 작동 확인</h2><p>${text(c.step2)}</p><figure class="article-image"><img src="${esc(c.photos[1].name)}" width="${c.photos[1].width}" height="${c.photos[1].height}" loading="lazy" alt="${esc(`${c.district} ${c.neighborhood} ${service} ${c.caption2}`)}"><figcaption>${esc(c.caption2)}</figcaption></figure></section>
<section class="result"><h2>작업 결과와 재발 방지 안내</h2><p>${text(c.closing)}</p><p><strong>최종 조치:</strong> ${esc(c.result)}</p></section>
<section><h2>현장 방문 전 확인하는 비용과 작업 범위</h2><p>신라건축설비는 현장 증상과 배관 구조를 확인한 뒤 필요한 작업과 예상 비용을 안내합니다. 단순 관통으로 해결되는지, 배관내시경·석션·고압세척 또는 ${c.service === "toilet-clog" ? "변기 탈거" : "추가 장비"}가 필요한지는 현장 상태에 따라 달라집니다. 출장비와 야간 작업비, 추가 장비 비용이 발생할 수 있는 경우 작업 전에 먼저 설명하고 동의를 받은 범위에서 진행합니다.</p></section>
<section><h2>업체를 선택할 때 확인할 사항</h2><p>무조건적인 ‘0원’ 표현보다 실제 작업 범위, 추가 비용 조건, 사용 장비와 사후 대응 기준을 확인하는 것이 중요합니다. 해결되지 않았을 때의 비용 기준과 작업 후 동일 증상 발생 시 점검 범위를 사전에 문의해두면 불필요한 분쟁을 줄일 수 있습니다.</p></section>
<section class="faq"><h2>${esc(c.district)} ${esc(service)} 자주 묻는 질문</h2>${faq.map(([a, b]) => `<details><summary>${esc(a)}</summary><p>${esc(b)}</p></details>`).join("")}</section>
${regionBlock(c)}
<nav class="related-links" aria-label="관련 서비스"><h2>${esc(c.district)} ${esc(service)} 관련 안내</h2>${CORE_SERVICE_SEO[c.service] ? `<a href="../../../services/${c.service}/">${esc(serviceLabel(c.service))} 전문 서비스 안내</a>` : ""}<a href="../../../${districtSlugFor(c.district)}/${c.service}/">${esc(c.district)} ${esc(service)} 현장사례 모아보기</a><a href="../../../${districtSlugFor(c.district)}/">${esc(c.district)} 전체 배관 현장</a><a href="../../../${regionForDistrict(c.district)}/">${esc(REGION_INFO[regionForDistrict(c.district)].name)} 지역별 현장</a><a href="../../../field-notes/">신라건축설비 전체 현장기록</a></nav>
${businessBlock()}
<aside class="cta"><h2>${esc(c.neighborhood)} ${esc(service)}, 원인 구간부터 확인하세요</h2><p>증상과 발생 위치를 말씀해주시면 필요한 점검 순서와 예상 작업 범위를 먼저 안내합니다.</p><a class="btn" href="tel:18770558">1877-0558 전화상담</a></aside>
</article></div></main><footer class="footer"><div class="wrap">신라건축설비 · 서울·경기 24시간 배관 상담 · 1877-0558</div></footer></body></html>`;
}
function card(c) {
  const service = serviceNames[c.service],
    date = c.date.replaceAll("-", "."),
    thumbIndex = Number(c.thumbnailIndex) === 1 ? 1 : 0,
    thumb = c.photos[thumbIndex],
    caption = thumbIndex === 1 ? c.caption2 : c.caption1;
  return `<!-- ADMIN-CASE:${c.path} --><article class="board-row"><a href="../${c.path}/"><img class="board-thumb" src="../${c.path}/${thumb.name}" width="320" height="240" loading="lazy" alt="${esc(`${c.district} ${c.neighborhood} ${service} ${caption}`)}"><div class="board-copy"><div class="board-meta">${esc(c.district)} · ${esc(c.neighborhood)} · ${esc(service)}</div><h2 class="board-title">${esc(c.title)}</h2><p class="board-summary">${esc(c.summary)}</p></div><time class="board-date" datetime="${c.date}">${date}</time></a></article><!-- /ADMIN-CASE:${c.path} -->`;
}
function caseTimestamp(c) {
  return String(c.updatedAt || `${c.date}T00:00:00.000Z`);
}
function updateList(html, cases) {
  html = html || "";
  html = html.replace(
    /<!-- ADMIN-CASE:[\s\S]*?<!-- \/ADMIN-CASE:[^>]*-->/g,
    "",
  );
  const cards = [...cases]
    .sort((a, b) => caseTimestamp(b).localeCompare(caseTimestamp(a)))
    .map(card)
    .join("\n");
  html = html.replace(/(<div class="wrap board-list">)/, `$1\n${cards}`);
  const existing = (html.match(/<article class="board-row">/g) || []).length;
  html = html.replace(
    /<span class="board-count"[^>]*>전체 \d+건<\/span>/,
    `<span class="board-count">전체 ${existing}건</span>`,
  );
  html = html.replaceAll(
    "https://shilla-plumbing.vercel.app",
    "https://shillaplumbing.kr",
  );
  return html;
}
function hubCard(c, prefix = "") {
  const service = serviceNames[c.service] || c.service,
    date = c.date.replaceAll("-", "."),
    thumbIndex = Number(c.thumbnailIndex) === 1 ? 1 : 0,
    thumb = c.photos[thumbIndex];
  return `<article class="board-row"><a href="${prefix}${c.path}/"><img class="board-thumb" src="${prefix}${c.path}/${thumb.name}" width="320" height="240" loading="lazy" alt="${esc(`${c.district} ${c.neighborhood} ${service} 현장`)}"><div class="board-copy"><div class="board-meta">${esc(c.district)} · ${esc(c.neighborhood)} · ${esc(service)}</div><h2 class="board-title">${esc(c.title)}</h2><p class="board-summary">${esc(c.summary)}</p></div><time class="board-date" datetime="${c.date}">${date}</time></a></article>`;
}
function districtHub(cases, district) {
  const slugName = districtSlugFor(district), region = regionForDistrict(district), regionName = REGION_INFO[region].name;
  const rows = cases.filter((c) => c.district === district).sort((a,b)=>caseTimestamp(b).localeCompare(caseTimestamp(a)));
  const groups = Object.keys(serviceNames).map((key) => [key, rows.filter((c)=>c.service===key)]).filter(([,list])=>list.length);
  const latest = rows[0]?.date || new Date().toISOString().slice(0,10);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(district)} 배관 현장사례 | 변기·싱크대·하수구 | 신라건축설비</title><meta name="description" content="${esc(district)} 변기막힘, 싱크대막힘, 하수구막힘, 배관공사 실제 현장사례 ${rows.length}건을 서비스별로 확인하세요."><link rel="canonical" href="${DOMAIN}/${slugName}/"><link rel="stylesheet" href="../field-notes/styles.css"></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../">신라건축설비</a><nav class="nav-actions"><a class="home-link" href="../${region}/">${regionName} 지역</a><a class="home-link" href="../field-notes/">전체 현장기록</a></nav></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">${regionName} · ${esc(district)}</p><h1>${esc(district)} 배관 현장사례</h1><p>신라건축설비가 ${esc(district)}에서 직접 진단하고 해결한 실제 작업 기록입니다.</p></div></section><div class="wrap breadcrumbs"><a href="../">홈</a> › <a href="../${region}/">${regionName}</a> › ${esc(district)}</div><div class="wrap"><div class="path-links">${groups.map(([key,list])=>`<a class="path-link" href="./${key}/">${esc(district)} ${esc(serviceNames[key])}<small>실제 현장사례 ${list.length}건</small></a>`).join("")}</div></div><div class="wrap board-tools"><span class="board-count">전체 ${rows.length}건</span></div><div class="wrap board-list">${rows.slice(0,12).map((c)=>hubCard(c,"../")).join("")}</div></main><footer class="footer"><div class="wrap">신라건축설비 · ${esc(district)} 배관 상담 · 1877-0558</div></footer></body></html>`;
}
function serviceHub(cases, district, serviceKey) {
  const slugName = districtSlugFor(district), region = regionForDistrict(district), regionName = REGION_INFO[region].name, service = serviceNames[serviceKey], seo = CORE_SERVICE_SEO[serviceKey];
  const rows = cases.filter((c)=>c.district===district && c.service===serviceKey).sort((a,b)=>caseTimestamp(b).localeCompare(caseTimestamp(a)));
  const seoTitle = seo ? `${district} ${seo.title}` : `${district} ${service}`;
  const intro = seo ? `${district}에서 실제로 해결한 ${service} 사례를 바탕으로 ${seo.intent}를 찾을 때 확인할 증상과 작업 방법을 정리했습니다. ${seo.symptoms} 등은 원인이 서로 다를 수 있어 현장 진단 후 필요한 범위를 안내합니다.` : `${district}에서 실제로 확인하고 해결한 ${service} 작업 기록입니다.`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(seoTitle)} 현장사례 | 신라건축설비</title><meta name="description" content="${esc(district)} ${esc(service)} 실제 해결 사례 ${rows.length}건. ${seo ? `${seo.intent}, ${seo.symptoms}, ${seo.methods}` : "증상, 원인, 사용 장비와 작업 결과"}를 실제 현장 기록으로 확인하세요."><link rel="canonical" href="${DOMAIN}/${slugName}/${serviceKey}/"><link rel="stylesheet" href="../../field-notes/styles.css"></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../../">신라건축설비</a><nav class="nav-actions"><a class="home-link" href="../">${esc(district)} 전체</a>${seo ? `<a class="home-link primary" href="../../services/${serviceKey}/">${esc(seo.title)}</a>` : ""}<a class="home-link" href="../../${region}/">${regionName} 지역</a><a class="home-link" href="../../field-notes/">전체 현장기록</a></nav></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">${regionName} · ${esc(district)} · ${esc(service)}</p><h1>${esc(seoTitle)} 현장사례</h1><p>${esc(intro)}</p></div></section><div class="wrap breadcrumbs"><a href="../../">홈</a> › ${seo ? `<a href="../../services/${serviceKey}/">${esc(seo.title)}</a> › ` : ""}<a href="../../${region}/">${regionName}</a> › <a href="../">${esc(district)}</a> › ${esc(service)}</div>${seo ? `<div class="wrap"><section class="seo-intro"><h2>${esc(district)} ${esc(seo.intent)}를 찾는다면 실제 해결 기록부터 확인하세요</h2><p>${esc(seo.symptoms)}처럼 비슷해 보이는 증상도 원인 구간은 다를 수 있습니다. 신라건축설비는 실제 출동 기록을 기준으로 증상·원인·사용 장비·작업 결과를 공개합니다.</p><p><strong>주요 점검·작업:</strong> ${esc(seo.methods)}</p><a class="text-link" href="../../services/${serviceKey}/">${esc(seo.title)} 전체 서비스와 지역별 사례 보기 →</a></section></div>` : ""}<div class="wrap board-tools"><span class="board-count">전체 ${rows.length}건</span></div><div class="wrap board-list">${rows.map((c)=>hubCard(c,"../../")).join("")}</div></main><footer class="footer"><div class="wrap">신라건축설비 · ${esc(district)} ${esc(service)} 상담 · 1877-0558</div></footer></body></html>`;
}
function globalServiceHub(cases, serviceKey) {
  const seo = CORE_SERVICE_SEO[serviceKey], service = serviceNames[serviceKey];
  if (!seo) return "";
  const rows = cases.filter((c)=>c.service===serviceKey).sort((a,b)=>caseTimestamp(b).localeCompare(caseTimestamp(a)));
  const districts = [...new Set(rows.map((c)=>c.district))].sort();
  const regionCounts = Object.keys(REGION_INFO).map(r=>[r,rows.filter(c=>regionForDistrict(c.district)===r).length]).filter(([,n])=>n);
  const desc = `서울·경기·인천 ${seo.title} 전문 신라건축설비. ${seo.symptoms} 등 실제 ${service} 해결 사례 ${rows.length}건과 지역별 출동 기록, ${seo.methods} 정보를 확인하세요.`;
  const schema={"@context":"https://schema.org","@graph":[{"@type":"Service","name":seo.title,"serviceType":service,"provider":{"@id":`${DOMAIN}/#business`},"areaServed":["서울특별시","경기도","인천광역시"],"url":`${DOMAIN}/services/${serviceKey}/`},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":`${DOMAIN}/`},{"@type":"ListItem","position":2,"name":seo.title,"item":`${DOMAIN}/services/${serviceKey}/`}]}]};
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(seo.title)} | 서울·경기 24시간 신라건축설비</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${DOMAIN}/services/${serviceKey}/"><link rel="stylesheet" href="../../field-notes/styles.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../../">신라건축설비</a><nav class="nav-actions"><a class="home-link primary" href="../../field-notes/">실제 현장사례</a><a class="home-link" href="tel:18770558">1877-0558</a></nav></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">서울 · 경기 · 인천 24시간 배관 전문</p><h1>${esc(seo.title)}</h1><p>${esc(desc)}</p></div></section><div class="wrap breadcrumbs"><a href="../../">홈</a> › ${esc(seo.title)}</div><div class="wrap content"><article class="article"><section><h2>${esc(service)} 증상은 원인 구간부터 확인합니다</h2><p>${esc(seo.symptoms)} 등 같은 ${service} 증상이라도 변기·배수구 내부, 연결 배관, 오수관 또는 공용배관처럼 원인이 발생한 위치가 다를 수 있습니다. 신라건축설비는 증상만 보고 작업을 정하지 않고 현장 상태를 확인한 뒤 필요한 작업 범위와 비용 조건을 먼저 안내합니다.</p><p><strong>주요 점검·작업:</strong> ${esc(seo.methods)}</p></section><section><h2>${esc(seo.intent)} 선택 전 실제 작업사례를 확인하세요</h2><p>광고 문구만이 아니라 실제로 어떤 증상을 어떤 장비로 진단하고 해결했는지가 중요합니다. 현재 신라건축설비 홈페이지에는 ${service} 실제 현장사례 ${rows.length}건이 공개되어 있으며 지역, 원인, 작업 과정과 결과를 확인할 수 있습니다.</p></section><section><h2>지역별 ${esc(seo.title)} 실제 출동 기록</h2><div class="path-links">${districts.map(d=>{const n=rows.filter(c=>c.district===d).length;return `<a class="path-link" href="../../${districtSlugFor(d)}/${serviceKey}/">${esc(d)} ${esc(seo.title)}<small>실제 현장사례 ${n}건</small></a>`}).join("")}</div></section><section><h2>최근 ${esc(service)} 해결사례</h2><div class="board-list">${rows.slice(0,12).map(c=>hubCard(c,"../../")).join("")}</div></section><section><h2>서울·경기·인천 ${esc(service)} 출동</h2><p>${regionCounts.map(([r,n])=>`${REGION_INFO[r].name} ${n}건`).join(" · ")}의 실제 기록을 기반으로 지역별 사례를 연결합니다. 새로운 현장사례가 등록되면 해당 서비스와 지역 허브에 함께 누적됩니다.</p><div class="path-links">${regionCounts.map(([r,n])=>`<a class="path-link" href="../../${r}/">${REGION_INFO[r].name} 지역 현장<small>${n}건의 ${esc(service)} 기록</small></a>`).join("")}</div></section><aside class="cta"><h2>${esc(seo.title)} 상담</h2><p>현재 증상과 위치를 알려주시면 필요한 점검 순서와 예상 작업 범위를 먼저 안내합니다.</p><a class="btn" href="tel:18770558">1877-0558 전화상담</a></aside></article></div></main><footer class="footer"><div class="wrap">신라건축설비 · ${esc(seo.title)} · 서울·경기·인천 24시간 상담 · 1877-0558</div></footer></body></html>`;
}
function cityHub(cases, city) {
  const slugName = topAreaSlug(city);
  const rows = cases.filter((c)=>regionForDistrict(c.district)==="gyeonggi" && topAreaForDistrict(c.district)===city).sort((a,b)=>caseTimestamp(b).localeCompare(caseTimestamp(a)));
  const districts = [...new Set(rows.map((c)=>c.district))].sort();
  const childOnly = districts.some((d)=>d!==city);
  const childLinks = childOnly ? `<section><h2>${esc(city)} 세부 지역 현장</h2><div class="path-links">${districts.map((d)=>{const n=rows.filter((c)=>c.district===d).length;return `<a class="path-link" href="../${districtSlugFor(d)}/">${esc(childDistrictLabel(d))} 배관 현장<small>실제 현장사례 ${n}건</small></a>`}).join("")}</div></section>` : "";
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(city)} 배관 현장사례 | 신라건축설비</title><meta name="description" content="${esc(city)} 변기막힘, 싱크대막힘, 하수구막힘, 배관공사 실제 현장사례 ${rows.length}건을 지역별로 확인하세요."><link rel="canonical" href="${DOMAIN}/${slugName}/"><link rel="stylesheet" href="../field-notes/styles.css"></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../">신라건축설비</a><nav class="nav-actions"><a class="home-link" href="../gyeonggi/">경기 지역</a><a class="home-link" href="../field-notes/">전체 현장기록</a></nav></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">경기 · ${esc(city)}</p><h1>${esc(city)} 배관 현장사례</h1><p>신라건축설비가 ${esc(city)}에서 직접 진단하고 해결한 실제 작업 기록입니다.</p></div></section><div class="wrap breadcrumbs"><a href="../">홈</a> › <a href="../gyeonggi/">경기</a> › ${esc(city)}</div><div class="wrap">${childLinks}</div><div class="wrap board-tools"><span class="board-count">전체 ${rows.length}건</span></div><div class="wrap board-list">${rows.slice(0,12).map((c)=>hubCard(c,"../")).join("")}</div></main><footer class="footer"><div class="wrap">신라건축설비 · ${esc(city)} 배관 상담 · 1877-0558</div></footer></body></html>`;
}
function regionHub(cases, region) {
  const info = REGION_INFO[region];
  const rows = cases.filter((c)=>regionForDistrict(c.district)===region).sort((a,b)=>caseTimestamp(b).localeCompare(caseTimestamp(a)));
  const areas = region === "gyeonggi" ? [...new Set(rows.map((c)=>topAreaForDistrict(c.district)))] : [...new Set(rows.map((c)=>c.district))];
  areas.sort();
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${info.title} 배관 현장사례 | 신라건축설비</title><meta name="description" content="${info.title} 변기막힘, 싱크대막힘, 하수구막힘, 배관공사 실제 현장사례를 지역별로 확인하세요."><link rel="canonical" href="${DOMAIN}/${region}/"><link rel="stylesheet" href="../field-notes/styles.css"></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../">신라건축설비</a><a class="home-link" href="../field-notes/">전체 현장기록</a></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">${info.title} FIELD NOTES</p><h1>${info.name} 지역별 배관 현장사례</h1><p>실제 출동 기록이 있는 지역을 중심으로 변기·싱크대·하수구·배관 작업 사례를 연결합니다.</p></div></section><div class="wrap breadcrumbs"><a href="../">홈</a> › ${info.name}</div><div class="wrap"><div class="path-links">${areas.map((a)=>{const n=rows.filter((c)=>(region==="gyeonggi"?topAreaForDistrict(c.district):c.district)===a).length;const href=region==="gyeonggi"?topAreaSlug(a):districtSlugFor(a);return `<a class="path-link" href="../${href}/">${esc(a)} 배관 현장<small>실제 현장사례 ${n}건</small></a>`}).join("")}</div></div><div class="wrap board-tools"><span class="board-count">전체 ${rows.length}건</span></div><div class="wrap board-list">${rows.slice(0,12).map((c)=>hubCard(c,"../")).join("")}</div></main><footer class="footer"><div class="wrap">신라건축설비 · ${info.name} 배관 상담 · 1877-0558</div></footer></body></html>`;
}
function hubFiles(cases) {
  const files = Object.keys(REGION_INFO).map((region)=>({path:`${region}/index.html`,content:regionHub(cases,region)}));
  for (const serviceKey of Object.keys(CORE_SERVICE_SEO)) files.push({path:`services/${serviceKey}/index.html`,content:globalServiceHub(cases,serviceKey)});
  for (const district of [...new Set(cases.map((c)=>c.district))]) {
    const dslug = districtSlugFor(district);
    files.push({path:`${dslug}/index.html`,content:districtHub(cases,district)});
    for (const serviceKey of [...new Set(cases.filter((c)=>c.district===district).map((c)=>c.service))])
      files.push({path:`${dslug}/${serviceKey}/index.html`,content:serviceHub(cases,district,serviceKey)});
  }
  const cities = [...new Set(cases.filter((c)=>regionForDistrict(c.district)==="gyeonggi").map((c)=>parentCityForDistrict(c.district)).filter(Boolean))];
  for (const city of cities) files.push({path:`${topAreaSlug(city)}/index.html`,content:cityHub(cases,city)});
  return files;
}
function setSitemapLastmod(xml, url, date) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(<url>\\s*<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`,
  );
  return xml.replace(re, `$1${date}$2`);
}
function updateSitemap(xml, cases) {
  xml = (
    xml ||
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
  )
    .replace(
      /<url>\s*<loc>https:\/\/shillaplumbing\.kr\/[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<!-- admin-case -->\s*<\/url>/g,
      "",
    )
    .replaceAll(
      "https://shilla-plumbing.vercel.app",
      "https://shillaplumbing.kr",
    );
  const sorted = [...cases].sort((a, b) =>
      caseTimestamp(b).localeCompare(caseTimestamp(a)),
    ),
    latest = sorted[0]?.date;
  if (latest) xml = setSitemapLastmod(xml, `${DOMAIN}/field-notes/`, latest);
  const hubDates = new Map();
  for (const c of cases) {
    // Hub URLs are based on the case metadata, not the legacy case path.
    // Some older cases intentionally keep historical URLs that do not match
    // their current district slug (e.g. a Seocho case under /seoul/...).
    const dslug = districtSlugFor(c.district),
      district = `${DOMAIN}/${dslug}/`,
      service = `${DOMAIN}/${dslug}/${c.service}/`,
      region = `${DOMAIN}/${regionForDistrict(c.district)}/`,
      city = parentCityForDistrict(c.district) ? `${DOMAIN}/${topAreaSlug(parentCityForDistrict(c.district))}/` : "";
    for (const url of [district, service, region, city].filter(Boolean))
      if (!hubDates.has(url) || hubDates.get(url) < c.date)
        hubDates.set(url, c.date);
  }
  for (const [url, date] of hubDates) xml = setSitemapLastmod(xml, url, date);
  const nodes = sorted
    .map(
      (c) =>
        `  <url><loc>${DOMAIN}/${c.path}/</loc><lastmod>${c.date}</lastmod><!-- admin-case --></url>`,
    )
    .join("\n");
  const existingUrls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const hubUrls = Object.keys(CORE_SERVICE_SEO).map((serviceKey)=>`${DOMAIN}/services/${serviceKey}/`);
  for (const region of Object.keys(REGION_INFO)) hubUrls.push(`${DOMAIN}/${region}/`);
  for (const city of [...new Set(cases.map((c)=>parentCityForDistrict(c.district)).filter(Boolean))]) hubUrls.push(`${DOMAIN}/${topAreaSlug(city)}/`);
  for (const district of [...new Set(cases.map((c) => c.district))]) {
    const dslug = districtSlugFor(district);
    hubUrls.push(`${DOMAIN}/${dslug}/`);
    for (const serviceKey of [...new Set(cases.filter((c)=>c.district===district).map((c)=>c.service))]) hubUrls.push(`${DOMAIN}/${dslug}/${serviceKey}/`);
  }
  const hubNodes = hubUrls.filter((u)=>!existingUrls.has(u)).map((u)=>`  <url><loc>${u}</loc><lastmod>${latest || new Date().toISOString().slice(0,10)}</lastmod><!-- admin-hub --></url>`).join("\n");
  return xml.replace("</urlset>", `${nodes ? `\n${nodes}\n` : ""}${hubNodes ? `\n${hubNodes}\n` : ""}</urlset>`);
}
function xml(v = "") {
  return String(v).replace(
    /[<>&"']/g,
    (s) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[s],
  );
}
function updateRss(cases) {
  const items = [...cases]
    .sort((a, b) =>
      (b.updatedAt || b.date).localeCompare(a.updatedAt || a.date),
    )
    .slice(0, 50)
    .map((c) => {
      const url = `${DOMAIN}/${c.path}/`,
        service = serviceNames[c.service] || c.service,
        body = `<h2>${c.district} ${c.neighborhood} ${service}</h2><p>${c.summary}</p><h3>현장 증상과 원인</h3><p>${c.symptom}</p><p>${c.cause}</p><h3>작업 과정</h3><p>${c.intro}</p><p>${c.step1}</p><p>${c.step2}</p><h3>작업 결과</h3><p>${c.closing}</p>`;
      return `<item><title>${xml(c.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${c.date}T00:00:00+09:00`).toUTCString()}</pubDate><description>${xml(c.summary)}</description><content:encoded><![CDATA[${body.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded></item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>신라건축설비 현장기록</title><link>${DOMAIN}/field-notes/</link><description>서울·경기 변기막힘, 싱크대막힘, 하수구막힘, 누수탐지, 고압세척 현장사례</description><language>ko-KR</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>\n`;
}
async function notifyIndexNow(urls) {
  const urlList = [
    ...new Set(
      (urls || []).map(String).filter((u) => u.startsWith(`${DOMAIN}/`)),
    ),
  ].slice(0, 100);
  if (!urlList.length) return { ok: false };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "shillaplumbing.kr",
      key: INDEXNOW_KEY,
      keyLocation: `${DOMAIN}/indexnow-key.txt`,
      urlList,
    }),
  });
  if (!res.ok && res.status !== 202)
    throw new Error(`IndexNow 알림 오류 ${res.status}`);
  return { ok: true, status: res.status };
}
module.exports = async (req, res) => {
  if (req.method !== "POST")
    return json(res, 405, { error: "POST 요청만 지원합니다." });
  if (!auth(req))
    return json(res, 401, {
      error: process.env.ADMIN_PASSWORD
        ? "비밀번호가 올바르지 않습니다."
        : "Vercel에 ADMIN_PASSWORD를 먼저 설정해주세요.",
    });
  try {
    const action = req.body?.action;
    if (action === "status")
      return json(res, 200, { ok: true, setupMissing: missing() });
    if (action === "indexnow")
      return json(res, 200, await notifyIndexNow(req.body.urls || []));
    if (missing().some((k) => k !== "ADMIN_PASSWORD"))
      throw new Error(
        `Vercel 환경변수를 먼저 설정해주세요: ${missing().join(", ")}`,
      );
    if (action === "list") return json(res, 200, { cases: await registry() });
    if (action === "publish") {
      let cases = await registry(),
        c = normalize(req.body.caseData || {}),
        oldPath = safePath(c.originalPath);
      const id = makeIdentity(c, cases);
      c.path = id.path;
      const names = imageNames(c);
      const old = cases.find((x) => x.path === oldPath);
      c.photos = [0, 1].map((i) => {
        const img = c.images?.[i],
          prev = c.oldPhotos?.[i] || old?.photos?.[i];
        if (img)
          return {
            name: names[i],
            width: Number(img.width) || 1200,
            height: Number(img.height) || 900,
          };
        if (prev) return prev;
        throw new Error(`사진 ${i + 1}이 필요합니다.`);
      });
      c.updatedAt = new Date().toISOString();
      cases = cases.filter((x) => x.path !== oldPath && x.path !== c.path);
      cases.push({
        ...c,
        images: undefined,
        oldPhotos: undefined,
        originalPath: undefined,
      });
      const list = updateList(await getFile("field-notes/index.html"), cases),
        sitemap = updateSitemap(await getFile("sitemap.xml"), cases),
        rss = updateRss(cases);
      const files = [
        { path: `${c.path}/index.html`, content: article(c) },
        ...hubFiles(cases),
        { path: "field-notes/index.html", content: list },
        { path: "sitemap.xml", content: sitemap },
        { path: "rss.xml", content: rss },
        {
          path: "content/admin-cases.json",
          content: JSON.stringify(cases, null, 2) + "\n",
        },
      ];
      for (let i = 0; i < 2; i++)
        if (c.images?.[i]?.data)
          files.push({
            path: `${c.path}/${c.photos[i].name}`,
            content: c.images[i].data,
            base64: true,
          });
      if (oldPath && oldPath !== c.path) {
        files.push({ path: `${oldPath}/index.html`, delete: true });
        for (const p of old?.photos || [])
          files.push({ path: `${oldPath}/${p.name}`, delete: true });
      }
      const sha = await commitFiles(files, `현장사례 게시: ${c.title}`);
      notifyIndexNow([
        `${DOMAIN}/${c.path}/`,
        `${DOMAIN}/sitemap.xml`,
        `${DOMAIN}/rss.xml`,
      ]).catch(console.error);
      return json(res, 200, { ok: true, path: c.path, commit: sha });
    }
    if (action === "delete") {
      const path = safePath(req.body.path),
        cases = await registry(),
        target = cases.find((x) => x.path === path);
      if (!target) throw new Error("삭제할 사례를 찾지 못했습니다.");
      const next = cases.filter((x) => x.path !== path),
        list = updateList(await getFile("field-notes/index.html"), next),
        sitemap = updateSitemap(await getFile("sitemap.xml"), next),
        rss = updateRss(next);
      const files = [
        { path: `${path}/index.html`, delete: true },
        ...hubFiles(next),
        ...target.photos.map((p) => ({
          path: `${path}/${p.name}`,
          delete: true,
        })),
        { path: "field-notes/index.html", content: list },
        { path: "sitemap.xml", content: sitemap },
        { path: "rss.xml", content: rss },
        {
          path: "content/admin-cases.json",
          content: JSON.stringify(next, null, 2) + "\n",
        },
      ];
      await commitFiles(files, `현장사례 삭제: ${target.title}`);
      notifyIndexNow([
        `${DOMAIN}/${path}/`,
        `${DOMAIN}/sitemap.xml`,
        `${DOMAIN}/rss.xml`,
      ]).catch(console.error);
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { error: "지원하지 않는 작업입니다." });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: e.message || "서버 오류가 발생했습니다." });
  }
};
