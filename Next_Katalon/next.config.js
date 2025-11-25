/** @type {import('next').NextConfig} */
const NEXT_PORT = process.env.NEXT_PORT || '3000'
const API_PORT = process.env.API_PORT || '8000'

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PORT,
    NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT || API_PORT,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.NEXT_PUBLIC_API_PORT || API_PORT}`,
  },
}

module.exports = nextConfig

