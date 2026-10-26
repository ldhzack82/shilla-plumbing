const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const video=require('../lib/case-video');
process.env.ADMIN_PASSWORD='test-only';
const blobs=new Map();
async function gh(path,options){
  if(options){const input=JSON.parse(options.body);const sha=crypto.createHash('sha1').update(input.content).digest('hex');blobs.set(sha,input.content);return {sha};}
  return {content:blobs.get(path.split('/').pop())};
}
(async()=>{
  const bytes=Buffer.concat([Buffer.from('0000ftypisom'),Buffer.alloc(3*1024*1024)]);
  const receipts=[];
  for(let offset=0;offset<bytes.length;offset+=2*1024*1024) receipts.push(await video.uploadChunk(bytes.subarray(offset,offset+2*1024*1024).toString('base64'),gh));
  assert.deepEqual(Buffer.from((await video.assemble(receipts,gh)).data,'base64'),bytes);
  await assert.rejects(()=>video.assemble([{...receipts[0],size:1}],gh));
  await assert.rejects(()=>video.assemble([{...receipts[0],expires:0}],gh));
  await assert.rejects(()=>video.assemble(Array(11).fill(receipts[0]),gh));
  const bad=await video.uploadChunk(Buffer.from('not a video file').toString('base64'),gh);
  await assert.rejects(()=>video.assemble([bad],gh),/MP4/);
  await assert.rejects(()=>video.uploadChunk('!',gh));
  const old={video:{url:'/case/video.mp4'},videoCaption:'통수 확인'};
  const c={};video.normalize(c,old);assert.deepEqual(c.video,old.video);
  const removed={removeVideo:true};video.normalize(removed,old);assert.equal(removed.video,undefined);assert.equal(video.render(removed,s=>s),'');
  const fresh={video:{url:'untrusted'}};video.normalize(fresh);assert.equal(fresh.video,undefined);
  const html=video.render(c,s=>s);assert.ok(html.includes('controls playsinline preload="none"'));assert.ok(!html.includes('autoplay'));
  console.log('PASS: chunk reconstruction, tampering, expiry, size/type checks, optional video, preservation, removal, no autoplay');
})().catch(e=>{console.error(e);process.exitCode=1;});
