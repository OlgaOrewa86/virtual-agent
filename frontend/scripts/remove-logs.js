const fs = require("fs");
const path = require("path");

function removeLogs(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      removeLogs(fullPath);
      continue;
    }

    if (entry.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Remove console.log(...) safely without breaking minified code
      content = content.replace(/console\.log\([^)]*\);?/g, "");

      // Remove console.debug(...)
      content = content.replace(/console\.debug\([^)]*\);?/g, "");

      // Remove console.info(...)
      content = content.replace(/console\.info\([^)]*\);?/g, "");

      // Remove console.warn(...) — optional, but safe
      content = content.replace(/console\.warn\([^)]*\);?/g, "");

      // Remove console.error(...) — optional, but safe
      // If you want to keep backend errors visible in browser, comment this out
      content = content.replace(/console\.error\([^)]*\);?/g, "");

      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

removeLogs("./build");
