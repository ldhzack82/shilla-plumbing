(function (root) {
  const MAX = 10;
  function parse(value) {
    const items = Array.isArray(value) ? value : [value];
    return [...new Set(items.flatMap(item => typeof item === 'string' ? item.split(/[/,\n]/) : []).map(s => s.trim().replace(/^#+/, '').trim()).filter(Boolean))];
  }
  function normalize(value) {
    const tags = parse(value);
    if (tags.length > MAX) throw new Error('태그는 중복을 제외하고 최대 10개까지 입력해주세요.');
    return tags;
  }
  const escape = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(value) {
    const tags = parse(value).slice(0, MAX);
    if (!tags.length) return '';
    return `<div class="case-tags"><p>이 현장의 주요 키워드</p><ul aria-label="현장 태그">${tags.map(tag => `<li><span class="case-tag" data-tag="${escape(tag)}">#${escape(tag)}</span></li>`).join('')}</ul></div>`;
  }
  const api = {MAX, parse, normalize, render};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CaseTags = api;
})(typeof globalThis === 'object' ? globalThis : this);
