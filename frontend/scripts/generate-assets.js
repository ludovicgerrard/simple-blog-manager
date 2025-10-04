// scripts/generate-assets.js
import fs from "fs";
import path from "path";
import { createCanvas, Image } from "canvas"; // ✅ Import Image from canvas

const outDir = path.resolve("public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// --- SVG Logo ---
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#60A5FA"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#grad)"/>
  <text x="50%" y="58%" font-size="260" text-anchor="middle" fill="white" font-family="Poppins, sans-serif" font-weight="700">B3</text>
</svg>
`;

fs.writeFileSync(path.join(outDir, "logo.svg"), svg);

// --- PNG + Favicon ---
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext("2d");

const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, 512, 512);
  const pngBuffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(outDir, "logo.png"), pngBuffer);

  // Favicon
  const favicon = createCanvas(32, 32);
  const fctx = favicon.getContext("2d");
  fctx.drawImage(canvas, 0, 0, 32, 32);
  fs.writeFileSync(
    path.join(outDir, "favicon.ico"),
    favicon.toBuffer("image/png")
  );

  console.log("✅ Generated logo.svg, logo.png, favicon.ico");
};
img.src = Buffer.from(svg);

// --- Manifest ---
const manifest = {
  name: "B3 App",
  short_name: "B3",
  icons: [
    { src: "/logo.png", sizes: "512x512", type: "image/png" },
    { src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
  ],
  theme_color: "#3B82F6",
  background_color: "#FFFFFF",
  display: "standalone",
};
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
