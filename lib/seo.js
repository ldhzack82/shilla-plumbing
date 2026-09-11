// Shared metadata rules for existing pages and future admin publications.
const BRAND = "신라건축설비";
const MAIN_TITLE = "신라건축설비 서울경기인천 변기막힘 싱크대막힘 하수구막힘 배관전문가 24시";
const MAIN_DESCRIPTION = "변기뚫는업체 싱크대뚫는업체 하수구뚫는업체 변기막힘 싱크대막힘 하수구막힘부터 누수탐지 고압세척 배관공사 원인진단 완벽해결 24시 서울경기인천";
const SERVICES = {
  "toilet-clog": ["변기막힘", "변기뚫는업체", "변기 내부 이물질과 오수관 막힘 진단 및 실제 해결사례"],
  "sink-clog": ["싱크대막힘", "싱크대뚫는업체", "기름때와 음식물로 인한 배수 불량 진단 및 실제 해결사례"],
  "drain-clog": ["하수구막힘", "하수구뚫는업체", "바닥 배수구 역류와 공용배관 막힘 진단 및 실제 해결사례"],
  "high-pressure-cleaning": ["고압세척", "고압세척업체", "배관 내부 오염물 세척 과정과 실제 작업 결과"],
  "leak-detection": ["누수탐지", "누수탐지업체", "누수 의심 구간 진단과 실제 점검 및 작업 결과"],
  "pipe-work": ["배관공사", "배관공사업체", "배관 상태 점검과 보수 및 교체 작업 기록"],
  odor: ["하수구악취", "하수구냄새", "배수구와 배관 악취 원인 점검 및 실제 작업 기록"],
};
function clean(value = "") {
  return String(value).normalize("NFC").replace(/<[^>]*>/g, " ")
    .replace(/서울\s*[·ㆍ,/]\s*경기\s*[·ㆍ,/]\s*인천/g, "서울경기인천")
    .replace(/24\s*시간/g, "24시").replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ").trim();
}
function fit(value, max) {
  const words = clean(value).split(" ");
  let result = "";
  for (const word of words) {
    const next = result ? `${result} ${word}` : word;
    if ([...next].length > max) break;
    result = next;
  }
  return result || [...clean(value)].slice(0, max).join("");
}
function stripContext(value, c) {
  let out = clean(value);
  const service = SERVICES[c.service]?.[0] || c.service;
  const terms = [BRAND, c.district, c.neighborhood, service].map(clean).filter(Boolean).sort((a,b)=>b.length-a.length);
  // Remove repeated prefixes only; keep service words needed inside the result.
  let changed = true;
  while (changed) {
    changed = false;
    for (const term of terms) {
      if (out === term || out.startsWith(`${term} `)) {
        out = out.slice(term.length).trim(); changed = true; break;
      }
    }
  }
  if (out.endsWith(` ${BRAND}`)) out = out.slice(0, -BRAND.length).trim();
  return clean(out.replace(/^현장사례입니다\s*/, "").replace(/\s*(현장사례|작업 사례|사례)$/, ""));
}
function caseMetadata(c) {
  const service = SERVICES[c.service]?.[0] || c.service;
  const region = clean(`${c.district} ${c.neighborhood}`);
  const prefix = clean(`${service} ${region}`);
  const subject = stripContext(c.title, c) || stripContext(c.result, c);
  const room = Math.max(1, 40 - [...prefix].length - [...BRAND].length - 2);
  const title = `${prefix} ${fit(subject, room)} ${BRAND}`;
  const detail = stripContext(c.summary, c) || stripContext(c.result, c);
  return { title, description: fit(`${region} ${service} ${detail}`, 80) };
}
function serviceMetadata(key, district = "", count) {
  const [service, intent, detail] = SERVICES[key] || [key, "배관전문업체", "실제 현장 작업 기록"];
  const title = district ? `${service} ${district} ${intent} ${BRAND}` : `${service} ${intent} 24시 ${BRAND}`;
  const records = Number.isInteger(count) ? ` ${count}건` : "";
  return { title: fit(title, 40), description: fit(`${district || "서울경기인천"} ${detail}${records} 작업 과정과 비용 안내 확인 24시 상담`, 80) };
}
function areaMetadata(area, count) {
  return {
    title: fit(`${area} 변기막힘 싱크대막힘 하수구막힘 현장사례 ${BRAND}`, 40),
    description: fit(`${area} 배관 현장사례${Number.isInteger(count) ? ` ${count}건` : ""} 변기막힘 싱크대막힘 하수구막힘 진단과 실제 작업 결과를 지역별로 확인하세요`, 80),
  };
}
const LIST_METADATA = {
  title: "변기막힘 싱크대막힘 하수구막힘 현장사례 신라건축설비",
  description: "서울경기인천 변기막힘 싱크대막힘 하수구막힘 실제 현장사례 지역별 증상과 원인 진단부터 작업 과정과 해결 결과까지 확인하세요",
};
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c]));
}
function withMetadata(html, metadata) {
  const { title, description } = metadata;
  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = output.replace(/<meta\b[^>]*>/gi, tag => {
    const key = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1];
    const value = ["description", "og:description", "twitter:description"].includes(key) ? description
      : ["og:title", "twitter:title"].includes(key) ? title : null;
    return value === null ? tag : tag.replace(/\bcontent\s*=\s*(["'])[\s\S]*?\1/i, `content="${escapeHtml(value)}"`);
  });
  output = output.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (all, start, body, end) => {
    try {
      const data = JSON.parse(body);
      function visit(node) {
        if (!node || typeof node !== "object") return;
        if (node["@type"] === "Article") { node.headline = title; node.description = description; }
        Object.values(node).forEach(v => Array.isArray(v) ? v.forEach(visit) : visit(v));
      }
      visit(data);
      return start + JSON.stringify(data).replace(/</g, "\\u003c") + end;
    } catch { return all; }
  });
  return output;
}
module.exports = { BRAND, MAIN_TITLE, MAIN_DESCRIPTION, SERVICES, LIST_METADATA, clean, fit, caseMetadata, serviceMetadata, areaMetadata, withMetadata };
