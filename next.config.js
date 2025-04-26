/** @type {import('next').NextConfig} */

const headers = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin',
  },
];
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://www.unirideus.com/api',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyAOtGKS-WQKCVSgJgqXKdmorgzVrh-2JYM',
    NEXT_PUBLIC_NEXTAUTH_SECRET: 'vZm2zMbZ6nDsns1Eik4fAg59yayyRa8L6/5FLmsje3c=',
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: 'pk_test_yDgZEShai3aN7mhuouM2hUPG00Tyk0KRtu',
    NEXTAUTH_URL: 'https://localhost:3000/api/auth',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  async headers() {
    return [
      {
        headers,
        source: '/(.*)',
      },
    ];
  },
  images: {
    domains: ['https://www.unirideus.com', 'blogadmin.uberinternal.com'],
  },
  reactStrictMode: true,
};
module.exports = nextConfig;
