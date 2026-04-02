const fs = require("fs");
let html = fs.readFileSync("index copy.html", "utf8");

// Put the magnifying glass effect BACK ONLY ON THE CURSOR
html = html.replace(/#cursor-glow \{[\s\S]*?z-index: 9999;/, (match) => {
    return match.replace(/backdrop-filter: blur\(12px\) saturate\(1\.5\);/g, "backdrop-filter: contrast(1.15) saturate(1.2) brightness(1.05);")
                .replace(/-webkit-backdrop-filter: blur\(12px\) saturate\(1\.5\);/g, "-webkit-backdrop-filter: contrast(1.15) saturate(1.2) brightness(1.05);");
});

fs.writeFileSync("index copy.html", html, "utf8");
console.log("Cursor fixed to lens again.");
