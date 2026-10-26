// Group original records by recorded work, without copying case pages.
const methods = {
  'pipe-inspection': { name: '배관내시경', matches: c => /내시경/.test(c.equipment || ''), intro: '배관 내부를 내시경으로 확인한 진단과 작업 기록입니다.' },
  'high-pressure-cleaning': { name: '고압세척', matches: c => c.service === 'high-pressure-cleaning' || /고압\s*세척/.test(c.equipment || ''), intro: '배관과 공용배관의 오염물을 고압세척한 실제 작업 기록입니다.' },
  'pipe-work': { name: '배관공사', matches: c => c.service === 'pipe-work', intro: '배관 상태를 확인하고 보수·교체한 실제 공사 기록입니다.' },
};
function files(cases, card) {
  return Object.entries(methods).map(([key, method]) => {
    const rows = cases.filter(method.matches).sort((a,b) => String(b.date).localeCompare(String(a.date)));
    const title = `${method.name} 실제 작업사례 | 신라건축설비`;
    return { path: `services/${key}/index.html`, content: `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="서울·경기·인천 ${method.name} 현장사례. ${method.intro}"><link rel="canonical" href="https://shillaplumbing.kr/services/${key}/"><link rel="stylesheet" href="../../field-notes/styles.css"></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../../">신라건축설비</a><nav class="nav-actions"><a class="home-link" href="../../#services">전문 서비스</a><a class="home-link" href="../../field-notes/">전체 현장사례</a></nav></div></header><main><section class="hero"><div class="wrap"><p class="eyebrow">서울 · 경기 · 인천 실제 작업 기록</p><h1>${method.name} 작업사례</h1><p>${method.intro}</p></div></section><div class="wrap breadcrumbs"><a href="../../">홈</a> › ${method.name} 사례</div><div class="wrap board-tools"><span class="board-count">전체 ${rows.length}건</span></div><div class="wrap board-list">${rows.map(c=>card(c,'../../')).join('') || '<p>등록된 작업사례를 준비 중입니다.</p>'}</div></main><footer class="footer"><div class="wrap">신라건축설비 · ${method.name} 상담 · <a href="tel:18770558">1877-0558</a></div></footer></body></html>` };
  });
}
module.exports = { methods, files };
