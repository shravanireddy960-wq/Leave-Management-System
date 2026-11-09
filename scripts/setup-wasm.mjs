import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// Download @next/swc-wasm-nodejs tarball and extract to node_modules/next/wasm
const destDir = path.join(process.cwd(), "node_modules", "next", "wasm");
fs.mkdirSync(destDir, { recursive: true });

console.log("Setting up wasm swc at:", destDir);
const tgzUrl = "https://registry.npmjs.org/@next/swc-wasm-nodejs/-/swc-wasm-nodejs-14.2.23.tgz";

https.get(tgzUrl, (res) => {
  if (res.statusCode !== 200) {
    console.error("HTTP error:", res.statusCode);
    process.exit(1);
  }

  // Next expects: next-swc.wasm and next-swc.js in node_modules/next/wasm
  // Inside the tgz, files are under package/wasm/*
  const gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  gunzip.on("error", (e) => console.error("Gunzip error:", e));

  // Use simple stream extractor or write tar
  const tarPath = path.join(process.cwd(), "swc-wasm.tar");
  const out = fs.createWriteStream(tarPath);
  gunzip.pipe(out);

  out.on("finish", () => {
    console.log("Tar downloaded. Extracting...");
    // Read tar and extract files
    try {
      const tarBuf = fs.readFileSync(tarPath);
      // Simple TAR parser in pure JS (standard UStar format)
      let offset = 0;
      while (offset < tarBuf.length - 512) {
        const nameBuf = tarBuf.subarray(offset, offset + 100);
        const name = nameBuf.toString("utf8").replace(/\0+$/, "");
        if (!name) break;

        const sizeStr = tarBuf.subarray(offset + 124, offset + 136).toString("utf8").replace(/\0+$/, "").trim();
        const size = parseInt(sizeStr, 8) || 0;
        offset += 512;

        if (size > 0) {
          const fileData = tarBuf.subarray(offset, offset + size);
          const baseName = path.basename(name);
          if (baseName.endsWith(".wasm") || baseName.endsWith(".js") || baseName.endsWith(".json")) {
            const outPath = path.join(destDir, baseName);
            fs.writeFileSync(outPath, fileData);
            console.log("Extracted:", baseName, "size:", size);
          }
          offset += Math.ceil(size / 512) * 512;
        }
      }
      fs.unlinkSync(tarPath);
      console.log("Wasm SWC setup complete!");
    } catch (err) {
      console.error("Extract error:", err);
    }
  });
}).on("error", (e) => console.error("Request error:", e));
