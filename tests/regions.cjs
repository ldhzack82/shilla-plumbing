const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'api/admin.js');
const mod = new Module(file, module);
mod.filename = file;
mod.paths = module.paths;
mod._compile(fs.readFileSync(file, 'utf8') + '\nmodule.exports={canonicalDistrict,regionForDistrict,districtSlugFor,normalize,makeIdentity,hubFiles,article,registry};', file);
const api = mod.exports;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const cases = JSON.parse(read('content/admin-cases.json'));
const examples = [
  ['서울특별시 서초구','서초구','seoul'], ['서울서초구','서초구','seoul'],
  [' 서울   강남구 ','강남구','seoul'], ['경기도 광주시','광주시','gyeonggi'],
  ['경기 광주시','광주시','gyeonggi'], ['경기도 용인시 수지구','수지구','gyeonggi'],
  ['용인시수지구','수지구','gyeonggi'], ['경기 수원시 팔달구','수원시 팔달구','gyeonggi'],
  ['영통구','수원시 영통구','gyeonggi'], ['인천광역시 부평구','부평구','incheon'],
  ['인천 중구','인천 중구','incheon'], ['서울 중구','중구','seoul'],
  ['인천 서구','서구','incheon'], ['인천 검단구','검단구','incheon'],
  ['경기도 화성시 동탄구','화성시 동탄구','gyeonggi'],
];
for (const [input,district,region] of examples) {
  assert.equal(api.canonicalDistrict(input), district, input);
  assert.equal(api.regionForDistrict(input), region, input);
  const normalized = api.normalize({...cases[0],district:input});
  assert.equal(normalized.district, district);
  assert.equal(api.canonicalDistrict(district),district,'normalization must be idempotent');
}
for (const input of ['', '미입력지역','부산 강서구','서울 광주시','경기 서초구','인천 강남구','광주광역시','수원시 가짜구','광주아무곳','강남구 역삼동']) {
  assert.throws(()=>api.normalize({...cases[0],district:input}), /지역/);
  assert.throws(()=>api.regionForDistrict(input), /지역/);
}
for(const district of ['중구','서구','동구','강서구'])
  assert.throws(()=>api.normalize({...cases[0],district}), /시·도/);
assert.notEqual(api.districtSlugFor('서울 중구'),api.districtSlugFor('인천 중구'));
const hubs = new Map(api.hubFiles(cases).map(f=>[f.path,f.content]));
assert.equal(hubs.size,api.hubFiles(cases).length,'no overlapping hub paths');
for(const c of cases) {
  assert.equal(api.canonicalDistrict(c.district),c.district,c.path);
  assert.equal(api.normalize({...c,originalPath:c.path},cases).district,c.district);
  assert.equal(api.makeIdentity({...c,originalPath:c.path},cases).path,c.path);
  const slug=api.districtSlugFor(c.district), region=api.regionForDistrict(c.district);
  for(const p of [`${slug}/index.html`,`${slug}/${c.service}/index.html`]) {
    assert(fs.existsSync(path.join(root,p)),`missing published hub ${p}`);
    if(p.includes(`/${c.service}/`)) assert(hubs.get(p)?.includes(c.path+'/'),`case missing from generated hub ${p}: ${c.path}`);
  }
  for(const html of [read(c.path+'/index.html'), api.article(c)]) {
    const breadcrumb=html.match(/<div class="wrap breadcrumbs">([\s\S]*?)<\/div>/)?.[1];
    assert(breadcrumb,`breadcrumb missing: ${c.path}`);
    const links=[...breadcrumb.matchAll(/href=["']([^"']+)["']/g)].map(m=>decodeURI(new URL(m[1],`https://shillaplumbing.kr/${c.path}/`).pathname));
    for(const expected of [`/${region}/`,`/${slug}/`,`/${slug}/${c.service}/`]) assert(links.includes(expected),`${c.path} missing ${expected}`);
    for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  }
}
const redirects=JSON.parse(read('vercel.json')).redirects;
for(const old of ['서울-서초구','경기도-광주시','용인시-수지구']) {
  assert(redirects.some(r=>r.source===encodeURI('/'+old)+'/'));
  assert(!read('sitemap.xml').includes(`<loc>https://shillaplumbing.kr/${old}/</loc>`));
}
// A broken registry must abort publication, never replace the existing cases with an empty list.
(async()=>{
  const oldFetch=global.fetch;
  process.env.GITHUB_REPO='test/test';
  global.fetch=async()=>({ok:true,json:async()=>({content:Buffer.from('invalid json').toString('base64')})});
  try { await assert.rejects(api.registry(), /기존 사례 보호/); }
  finally { global.fetch=oldFetch; }
  console.log(`PASS: ${cases.length} case routes, existing/new generated breadcrumbs, hub membership, district variants, rejected ambiguous/invalid input, preserved edit URLs and registry corruption guard.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
