// Regenerates the printable QR code that points to /menu.
// Run with: npm run generate:qr
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const TARGET_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/menu`
  : "https://partners.buds.digital/menu";

const outDir = path.join(process.cwd(), "public", "qr");
await mkdir(outDir, { recursive: true });

// Vector version for high-quality printing.
const svg = await QRCode.toString(TARGET_URL, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#161819", light: "#FFFFFF" },
});
await writeFile(path.join(outDir, "menu-qr.svg"), svg, "utf-8");

// Raster version for quick previews / non-vector print tools.
await QRCode.toFile(path.join(outDir, "menu-qr.png"), TARGET_URL, {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1024,
  color: { dark: "#161819", light: "#FFFFFF" },
});

console.log(`QR code generated for ${TARGET_URL}`);
console.log(" -> public/qr/menu-qr.svg");
console.log(" -> public/qr/menu-qr.png");
