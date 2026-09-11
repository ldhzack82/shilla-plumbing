// Local-only metadata refresh. Does not publish, commit, or call external APIs.
// Run from the repository root: node scripts/refresh-seo.cjs
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const root = path.resolve(__dirname, "..");
const seo = require("../lib/seo");
const apiPath = path.join(root, "api/admin.js");
const renderer = new Module(apiPath, module);
renderer.filename = apiPath;
renderer.paths = Module._nodeModulePaths(path.dirname(apiPath));
renderer._compile(fs.readFileSync(apiPath, "utf8") + "\nmodule.exports = { hubFiles, updateList, updateRss };", apiPath);
const cases = JSON.parse(fs.readFileSync(path.join(root, "content/admin-cases.json"), "utf8"));
const metadata = new Map();
metadata.set("index.html", {title:seo.MAIN_TITLE, description:seo.MAIN_DESCRIPTION});
metadata.set("field-notes/index.html", seo.LIST_METADATA);
for (const c of cases) metadata.set(`${c.path}/index.html`, seo.caseMetadata(c));
for (const f of renderer.exports.hubFiles(cases)) {
  const title = f.content.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = f.content.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (title && description) metadata.set(f.path, {title, description});
}
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
    if ([".git", ".sites-runtime", "node_modules"].includes(e.name)) return [];
    const file = path.join(dir, e.name);
    return e.isDirectory() ? walk(file) : [file];
  });
}
let count = 0;
for (const file of walk(root).filter(p=>p.endsWith(".html"))) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (rel.startsWith("admin/")) continue;
  let html = fs.readFileSync(file,"utf8"), before = html;
  let meta = metadata.get(rel);
  if (!meta) {
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const descriptionTag = (html.match(/<meta\b[^>]*>/gi) || []).find(tag=>/name=["']description["']/.test(tag));
    const description = descriptionTag?.match(/content=["']([^"']*)["']/)?.[1];
    if (title && description) meta = {title:seo.fit(title,40), description:seo.fit(description,80)};
  }
  if (!meta) continue;
  html = seo.withMetadata(html, meta);
  const c = cases.find(c=>`${c.path}/index.html` === rel);
  if (c) {
    html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${meta.title.replace(/ 신라건축설비$/, "")}</h1>`);
    html = html.replace(/(<h1>[^<]*<\/h1>\s*<p>)[\s\S]*?(<\/p>)/, `$1${meta.description}$2`);
  } else if (rel === "field-notes/index.html") {
    html = renderer.exports.updateList(html, cases);
  } else if (rel !== "index.html") {
    // Keep page layout and body intact while synchronizing case-card labels.
    for (const c of cases) {
      const escapedPath = c.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(<a\\b[^>]*href="[^\"]*${escapedPath}/"[^>]*>[\\s\\S]*?<h[23]\\b[^>]*>)[\\s\\S]*?(</h[23]>)`, "g");
      html = html.replace(re, `$1${seo.caseMetadata(c).title.replace(/ 신라건축설비$/, "")}$2`);
    }
  }
  if (html !== before) {fs.writeFileSync(file, html); count++;}
}
const rssPath = path.join(root, "rss.xml");
if (fs.existsSync(rssPath)) {
  const oldRss = fs.readFileSync(rssPath, "utf8"), newRss = renderer.exports.updateRss(cases);
  const withoutBuildDate = text => text.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, "");
  if (withoutBuildDate(oldRss) !== withoutBuildDate(newRss)) fs.writeFileSync(rssPath, newRss);
}
console.log(JSON.stringify({updatedHtml:count, cases:cases.length}));
