/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  // Ensure Next.js serves the static files from the public directory
  distDir: '.next',
  // Disable the automatic static optimization for API routes
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
