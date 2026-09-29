// Shared review and booking links for existing and newly published case studies.
const links = {
  naver: 'https://m.place.naver.com/place/2064625748/review/visitor',
  booking: 'https://m.place.naver.com/place/2064625748/ticket',
  google: 'https://maps.app.goo.gl/ojkHvdA8wFKuHzH18?g_st=ac'
};
function render() {
  return `<div class="wrap"><nav class="case-engagement" aria-label="고객 리뷰 확인 및 간편 예약">
<a class="engagement-card engagement-naver" href="${links.naver}" target="_blank" rel="noopener noreferrer" aria-label="네이버 고객 리뷰 확인하기 (새 창)"><span class="engagement-brand">NAVER</span><strong class="engagement-title">고객 리뷰</strong><span class="engagement-caption">후기 확인하기 <span aria-hidden="true">→</span></span></a>
<a class="engagement-card engagement-booking" href="${links.booking}" target="_blank" rel="noopener noreferrer" aria-label="내 일정에 맞춘 네이버 예약 (새 창)"><span class="engagement-brand">내 일정에 맞춘</span><strong class="engagement-title">쉬운 예약</strong><span class="engagement-caption">네이버로 간편하게 예약하기 <span aria-hidden="true">→</span></span></a>
<a class="engagement-card engagement-google" href="${links.google}" target="_blank" rel="noopener noreferrer" aria-label="구글 지도에서 고객 리뷰 확인하기 (새 창)"><span class="engagement-brand engagement-google-brand" aria-label="Google"><span aria-hidden="true"><i>G</i><i>o</i><i>o</i><i>g</i><i>l</i><i>e</i></span></span><strong class="engagement-title">고객 리뷰</strong><span class="engagement-caption">후기 확인하기 <span aria-hidden="true">→</span></span></a>
</nav></div>`;
}
module.exports = { render, links };
