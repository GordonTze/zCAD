import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Use standalone for normal builds, export for GitHub Pages
  output: isGithubPages ? "export" : "standalone",
  // GitHub Pages serves from root for user pages (username.github.io)
  basePath: isGithubPages ? "" : "",
  assetPrefix: isGithubPages ? "/" : "",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
