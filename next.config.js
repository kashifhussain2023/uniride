/** @type {import('next').NextConfig} */

const headers = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin",
  },
];

const nextConfig = {
  images: {
    domains: ["https://www.unirideus.com"],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

module.exports = nextConfig;
