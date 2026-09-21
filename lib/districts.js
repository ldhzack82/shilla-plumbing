// Keep historical case URLs stable; normalize only geographic labels.
const GYEONGGI_CHILDREN = {
  수원시: ["장안구", "권선구", "팔달구", "영통구"],
  용인시: ["처인구", "기흥구", "수지구"],
  고양시: ["덕양구", "일산동구", "일산서구"],
  성남시: ["수정구", "중원구", "분당구"],
  안양시: ["만안구", "동안구"],
  안산시: ["상록구", "단원구"],
  부천시: ["원미구", "소사구", "오정구"],
  화성시: ["만세구", "효행구", "병점구", "동탄구"],
};
// Preserve the short labels already used by published hubs.
const SHORT_DISTRICTS = new Set(["수지구", "단원구", "상록구"]);
const AMBIGUOUS = new Set(["중구", "동구", "서구", "강서구"]);
function createDistrictResolver(seoul, gyeonggi, incheon) {
  function gyeonggiLabel(value) {
    if (gyeonggi.includes(value)) return value;
    for (const [city, children] of Object.entries(GYEONGGI_CHILDREN)) {
      for (const child of children) {
        if ([child, `${city} ${child}`, `${city}${child}`].includes(value))
          return SHORT_DISTRICTS.has(child) ? child : `${city} ${child}`;
      }
    }
    return null;
  }
  function resolve(input) {
    const value = String(input || "").normalize("NFC").trim().replace(/\s+/g, " ");
    const prefix = value.match(/^(서울특별시|서울시|서울|인천광역시|인천시|인천|경기도|경기)\s*/)?.[1];
    const rest = prefix ? value.slice(prefix.length).trim() : value;
    if (prefix?.startsWith("서울")) return seoul.includes(rest) ? { district: rest, region: "seoul" } : null;
    if (prefix?.startsWith("인천")) return incheon.includes(rest) ? { district: rest === "중구" ? "인천 중구" : rest, region: "incheon" } : null;
    if (prefix?.startsWith("경기")) {
      const district = gyeonggiLabel(rest);
      return district ? { district, region: "gyeonggi" } : null;
    }
    // Bare Seoul labels retain their meaning for existing published records.
    if (seoul.includes(value)) return { district: value, region: "seoul" };
    if (incheon.includes(value)) return { district: value, region: "incheon" };
    const district = gyeonggiLabel(value);
    return district ? { district, region: "gyeonggi" } : null;
  }
  function validate(input, existingDistrict) {
    const value = String(input || "").trim();
    if (AMBIGUOUS.has(value) && existingDistrict !== value)
      throw new Error("같은 이름의 구가 여러 도시에 있습니다. ‘서울 중구’, ‘인천 서구’처럼 시·도 이름을 함께 입력해주세요.");
    const result = resolve(value);
    if (!result) throw new Error("지역을 확인할 수 없습니다. ‘서울 서초구’, ‘경기 광주시’, ‘경기 용인시 수지구’, ‘인천 부평구’처럼 정확한 시·군·구를 입력해주세요.");
    return result;
  }
  return { resolve, validate };
}
module.exports = { createDistrictResolver };
