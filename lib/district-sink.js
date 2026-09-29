// Preserve case-grounded guidance when regional hubs are regenerated.
const guides = {
  '서초구': {
    cases: [
      ['잠원동: 싱크대 하부 배관의 기름 슬러지', '/seocho/sink-clog/seocho-sink-clog-002/', '좁은 하부 공간에서 배수호스를 분리해 기름 슬러지를 석션하고, 다시 조립한 뒤 배수를 확인한 사례입니다.'],
      ['방배동: 내시경으로 확인하며 배관 세척', '/seocho/sink-clog/seocho-sink-clog-001/', '배관 내시경과 샤프트를 함께 사용해 오염 구간을 확인하며 배관 벽면을 정리한 사례입니다.'],
      ['양재동: 실내 배관과 공용배관 점검', '/seocho/sink-clog/seocho-sink-clog-003/', '실내 배관과 공용배관을 점검하고 샤프트 작업과 고압세척으로 배수 흐름을 확보한 사례입니다.']
    ],
    questions: [
      ['싱크대 한 곳이 막혀도 공용배관을 확인하나요?', '한 곳에서만 발생하는지, 다른 배수구나 여러 세대에서도 함께 나타나는지 먼저 확인합니다. 잠원동처럼 하부 연결부에 오염이 집중된 경우와 양재동처럼 공용배관까지 살펴야 하는 경우는 점검 범위가 다릅니다. 증상만으로 공용배관 문제를 확정하지 않고 배관 경로와 현장 상태를 확인합니다.'],
      ['석션과 샤프트, 고압세척을 모두 사용하나요?', '모든 장비를 일괄 적용하지 않습니다. 회수할 수 있는 오염물은 석션으로 제거하고, 벽면에 붙은 오염층은 샤프트 등으로 정리합니다. 고압세척 여부는 막힌 구간과 배관 상태, 접근 위치를 확인해 결정합니다.'],
      ['상담 전에 무엇을 확인하면 좋을까요?', '처음 막힌 시점, 반복 여부, 물이 올라오는 위치와 다른 배수구의 상태를 알려주세요. 약품을 사용했다면 제품과 사용 여부도 전달해주세요. 물이 역류하면 사용을 멈추고, 작업 범위와 출장·야간·추가 장비 비용 조건을 작업 전에 확인하세요.'],
      ['작업 후에는 어떻게 관리하나요?', '남은 기름과 음식물 건더기를 배수구로 보내지 않고 거름망을 자주 비워주세요. 배수 지연이나 역류가 반복되면 단순히 다시 뚫는 작업에 앞서 남은 오염물과 배관 구조를 점검합니다. 공용 구간이 의심되면 관리사무소와 점검 범위를 협의합니다.']
    ]
  },
  '동작구': {
    cases: [['상도동: 내시경 진단 후 샤프트 배관스케일링', '/dongjak/sink-clog/dongjak-sink-clog-001/', '물이 원활하게 빠지지 않는 주방 배관을 내시경으로 확인한 뒤, 벽면에 붙은 기름 슬러지와 음식물 찌꺼기를 샤프트로 제거했습니다. 작업 후 배관 내부와 연결 상태, 정상 배수를 확인한 사례입니다.']],
    questions: [
      ['배수구 입구를 청소해도 물이 느리게 빠지는 이유는 무엇인가요?', '입구보다 깊은 주방 배수관에 오염물이 쌓였을 수 있습니다. 상도동 사례에서는 내시경으로 배관 벽면을 두껍게 덮은 기름 슬러지를 확인했습니다. 배수 속도만으로 원인을 확정하지 않고 하부 연결부와 배관 안쪽을 함께 살핍니다.'],
      ['샤프트 작업과 단순 관통은 어떻게 다른가요?', '단순 관통으로 물길이 열려도 배관 벽면의 오염층이 남을 수 있습니다. 상도동에서는 회전하는 샤프트로 부착물을 정리하는 배관스케일링을 진행했습니다. 장비는 배관 재질과 굴곡, 오염 상태를 확인한 뒤 선택합니다.'],
      ['작업이 끝났다는 것은 어떻게 확인하나요?', '물을 흘려보내 정체나 역류가 없는지 확인하고, 작업한 배관 내부와 분리했던 연결부 상태를 살핍니다. 상도동 사례도 오염물을 제거한 뒤 내시경과 배수 확인을 진행했습니다. 확인 과정과 남아 있는 관리 사항을 안내받으세요.'],
      ['반복 막힘을 줄이려면 어떻게 해야 하나요?', '조리 후 남은 기름은 따로 처리하고 음식물 건더기는 거름망으로 걸러주세요. 약품만 반복해서 사용하기보다 배수 속도 저하나 반복 역류가 나타나는 구간을 확인하는 것이 좋습니다. 점검을 요청할 때 이전 작업과 약품 사용 여부를 알려주세요.']
    ]
  }
};
function enhance(html, district) {
  const guide = guides[district];
  if (!guide || html.includes('id="district-sink-guide"')) return html;
  const section = `<div class="wrap content"><article class="article" id="district-sink-guide"><section><h2>${district} 싱크대막힘 사례에서 확인한 원인과 작업</h2><p>같은 배수 불량이라도 막힌 위치와 필요한 작업은 다릅니다. 아래 실제 사례를 통해 점검 범위와 장비 선택 과정을 확인하세요.</p>${guide.cases.map(([title,url,text])=>`<section><h3><a href="${url}">${title}</a></h3><p>${text}</p></section>`).join('')}</section><section><h2>싱크대막힘 상담 전 확인할 질문</h2>${guide.questions.map(([q,a])=>`<section><h3>${q}</h3><p>${a}</p></section>`).join('')}</section><nav class="related-links" aria-label="관련 안내"><a href="/services/sink-clog/">싱크대막힘 서비스와 지역별 사례</a></nav></article></div>`;
  const schema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:guide.questions.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
  return html.replace('</main>',section+'</main>').replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
}
module.exports = { enhance };
