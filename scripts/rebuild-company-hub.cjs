"use strict";
// Local build only. This script neither publishes nor calls remote services.
// Run after editing lib/company-hub.js: node scripts/rebuild-company-hub.cjs
const fs = require("node:fs");
const path = require("node:path");
const hub = require("../lib/company-hub");
const root = path.resolve(__dirname, "..");
const records = JSON.parse(fs.readFileSync(path.join(root, "content/admin-cases.json"), "utf8"));
const output = path.join(root, hub.PATH);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, hub.renderCompanyHub(records), "utf8");
console.log(JSON.stringify({ page: hub.PATH, caseCount: records.length, published: false }));
