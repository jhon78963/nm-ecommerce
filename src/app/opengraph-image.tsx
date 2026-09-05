import { ImageResponse } from "next/og";

import { SITE_META } from "@/features/seo/constants/site-meta";

export const runtime = "edge";
export const alt = "Novedades Maritex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #374151 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fbbf24",
            marginBottom: 24,
          }}
        >
          Novedades Maritex
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          {SITE_META.siteTagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, color: "#e5e7eb", maxWidth: 920 }}>
          {SITE_META.description}
        </div>
      </div>
    ),
    size,
  );
}
