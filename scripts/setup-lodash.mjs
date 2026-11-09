import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const destDir = path.join(process.cwd(), "node_modules", "lodash");
fs.mkdirSync(destDir, { recursive: true });

console.log("Downloading lodash to:", destDir);
const tgzUrl = "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz";

https.get(tgzUrl, (res) => {
  if (res.statusCode !== 200) {
    console.error("HTTP error:", res.statusCode);
    process.exit(1);
  }

  const gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  const tarPath = path.join(process.cwd(), "lodash.tar");
  const out = fs.createWriteStream(tarPath);
  gunzip.pipe(out);

  out.on("finish", () => {
    try {
      const tarBuf = fs.readFileSync(tarPath);
      let offset = 0;
      let count = 0;
      while (offset < tarBuf.length - 512) {
        const nameBuf = tarBuf.subarray(offset, offset + 100);
        const name = nameBuf.toString("utf8").replace(/\0+$/, "");
        if (!name) break;

        const sizeStr = tarBuf.subarray(offset + 124, offset + 136).toString("utf8").replace(/\0+$/, "").trim();
        const size = parseInt(sizeStr, 8) || 0;
        offset += 512;

        if (size > 0) {
          const fileData = tarBuf.subarray(offset, offset + size);
          // strip "package/" prefix
          const relPath = name.replace(/^package\//, "");
          const outPath = path.join(destDir, relPath);
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, fileData);
          count++;
          offset += Math.ceil(size / 512) * 512;
        }
      }
      fs.unlinkSync(tarPath);
      console.log(`Extracted ${count} lodash files!`);
    } catch (e) {
      console.error("Error extracting lodash:", e);
    }
  });
}).on("error", console.error);

