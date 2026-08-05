import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * What the browser is allowed to load and talk to.
 *
 * `unsafe-inline` on scripts is unavoidable without a nonce: Next inlines its
 * own bootstrap and flight payload, and the JSON-LD block is inline too.
 * `unsafe-eval` is a dev-only concession to the Turbopack refresh runtime.
 *
 * `frame-src https:` is wider than it looks by necessity — the project pages
 * embed live client sites (makolahub.com, contango.ae, hera.app and the rest),
 * and that list grows whenever a project is added.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Firestore and the identity endpoints behind the admin portal's sign-in.
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.google.com wss://*.firebaseio.com",
  "frame-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // A stray lockfile higher up the tree makes Turbopack infer the wrong
  // workspace root, so pin it to this project.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },

  redirects() {
    return [
      {
        // Both hosts were answering 200, which splits the site in two as far
        // as search engines are concerned. The apex is the canonical one, and
        // it is what every canonical tag and the sitemap already point at.
        source: "/:path*",
        has: [{ type: "host", value: "www.shehryar-raza.dev" }],
        destination: "https://shehryar-raza.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
