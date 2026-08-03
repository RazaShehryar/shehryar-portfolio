import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#07070a",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,122,48,0.30) 0%, rgba(7,7,10,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#ff7a30",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#ff7a30", display: "flex" }} />
          Portfolio
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 94,
            fontWeight: 700,
            color: "#f2f2f5",
            letterSpacing: -3,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 40,
            color: "#9a9aa8",
            letterSpacing: -1,
            display: "flex",
          }}
        >
          {site.role}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#6a6a78",
            maxWidth: 900,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Product engineering, mobile and web — and the agentic AI systems around them.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 80,
            fontSize: 24,
            color: "#ff7a30",
            display: "flex",
          }}
        >
          shehryar-raza.dev
        </div>
      </div>
    ),
    size,
  );
}
