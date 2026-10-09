(function(root) {
"use strict";
const clean = v => String(v || "").trim().replace(/\s+/g, " ");
function region(district, neighborhood, override) {
  if (clean(override)) return clean(override);
  const aliases = {"서울특별시":"서울","부산광역시":"부산","인천광역시":"인천","대구광역시":"대구","대전광역시":"대전","광주광역시":"광주","울산광역시":"울산","세종특별자치시":"세종시","경기도":"경기","강원특별자치도":"강원","전북특별자치도":"전북","제주특별자치도":"제주"};
  const parts = clean(district).split(" ").filter(Boolean).map(x => aliases[x] || x);
  const town = clean(neighborhood);
  if (town) return [parts[parts.length - 1], town].filter(Boolean).join(" ");
  return parts.slice(-2).join(" ");
}
function draw(canvas, location, service) {
  canvas.width = canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("썸네일을 생성할 수 없는 브라우저입니다.");
  const bg = ctx.createLinearGradient(0,0,0,1200);
  bg.addColorStop(0,"#074bc5"); bg.addColorStop(0.55,"#063ba7"); bg.addColorStop(1,"#001b58");
  ctx.fillStyle=bg; ctx.fillRect(0,0,1200,1200);
  ctx.textAlign="center"; ctx.textBaseline="middle";
  function text(value,y,maxSize,maxWidth,color,centerInk=false) {
    let size=maxSize;
    do { ctx.font='900 '+size+'px "Arial", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif'; if(ctx.measureText(value).width<=maxWidth) break; size-=1; } while(size>12);
    if (centerInk) {
      const metrics = ctx.measureText(value);
      if (Number.isFinite(metrics.actualBoundingBoxAscent) && Number.isFinite(metrics.actualBoundingBoxDescent)) {
        y += (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      }
    }
    ctx.fillStyle=color; ctx.fillText(value,600,y);
  }
  text(location || "지역명 동·읍·면",215,174,1090,"#ffffff");
  text(service || "하수구막힘",490,228,1100,"#fff100");
  ctx.fillStyle="#fff100";
  ctx.beginPath(); ctx.roundRect(245,665,710,182,24); ctx.fill();
  text("24시 출동",665 + 182 / 2,139,645,"#002267",true);
  ctx.fillStyle="#ffffff"; ctx.fillRect(55,879,1090,6);
  text("1877-0558",1015,195,1100,"#ffffff");
  return canvas;
}
function image(canvas) {
  const url=canvas.toDataURL("image/png");
  if(!url.startsWith("data:image/png;base64,")) throw new Error("썸네일 이미지 변환에 실패했습니다.");
  return {data:url.split(",")[1],width:1200,height:1200};
}
const api={region,draw,image};
if(typeof module!=="undefined" && module.exports) module.exports=api;
else root.CaseThumbnail=api;
})(typeof window!=="undefined"?window:globalThis);
