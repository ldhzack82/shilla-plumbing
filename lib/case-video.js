const crypto = require('node:crypto');
const MAX = 20 * 1024 * 1024;
const CHUNK = 2 * 1024 * 1024;
function sign(receipt) {
  return crypto.createHmac('sha256', process.env.ADMIN_PASSWORD).update(JSON.stringify(receipt)).digest('hex');
}
function verify(receipt) {
  if (!receipt || !/^[a-f0-9]{40}$/.test(receipt.sha) || !Number.isInteger(receipt.size) || receipt.size < 1 || receipt.size > CHUNK || !Number.isInteger(receipt.expires) || receipt.expires < Date.now()) throw new Error('영상 업로드가 만료되었거나 올바르지 않습니다. 다시 선택해주세요.');
  const payload = {sha:receipt.sha,size:receipt.size,expires:receipt.expires};
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(String(receipt.signature || ''));
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error('영상 업로드 확인에 실패했습니다.');
}
async function uploadChunk(data, gh) {
  if (typeof data !== 'string' || data.length > Math.ceil(CHUNK / 3) * 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) throw new Error('영상 조각 형식이 올바르지 않습니다.');
  const size = Buffer.from(data,'base64').length;
  if (!size || size > CHUNK) throw new Error('영상 조각이 너무 큽니다.');
  const blob = await gh('/git/blobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:data,encoding:'base64'})});
  const receipt = {sha:blob.sha,size,expires:Date.now()+60*60*1000};
  return {...receipt,signature:sign(receipt)};
}
async function assemble(receipts, gh) {
  if (!Array.isArray(receipts) || !receipts.length || receipts.length > 10) throw new Error('영상은 20MB 이하의 MP4 파일을 선택해주세요.');
  receipts.forEach(verify);
  const size = receipts.reduce((n,r)=>n+r.size,0);
  if (size > MAX) throw new Error('영상은 20MB 이하여야 합니다.');
  const chunks=[];
  for (const r of receipts) {
    const blob=await gh('/git/blobs/'+r.sha);
    const bytes=Buffer.from(blob.content,'base64');
    if(bytes.length!==r.size) throw new Error('영상 크기 검증에 실패했습니다.');
    chunks.push(bytes);
  }
  const bytes=Buffer.concat(chunks);
  if(bytes.length<12 || bytes.toString('ascii',4,8)!=='ftyp') throw new Error('MP4 영상 파일이 아닙니다.');
  return {data:bytes.toString('base64'),size};
}
function normalize(c, existing) {
  delete c.video;
  if (!c.removeVideo && existing?.video) c.video=existing.video;
  c.videoCaption=String(c.videoCaption ?? existing?.videoCaption ?? '').trim().slice(0,300);
}
function render(c, esc) {
  if (!c.video) return '';
  return `<section class="case-video"><h2>현장 영상</h2><figure><video controls playsinline preload="none" style="display:block;width:100%;max-height:640px;background:#111" aria-label="${esc(c.videoCaption || '현장 작업 영상')}"><source src="${esc(c.video.url)}" type="video/mp4">영상 재생을 지원하는 브라우저를 이용해주세요.</video>${c.videoCaption ? `<figcaption>${esc(c.videoCaption)}</figcaption>`:''}</figure></section>`;
}
module.exports={uploadChunk,assemble,normalize,render,verify};
