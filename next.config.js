/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 压缩配置
  compress: true,
  
  // 实验性功能
  experimental: {
    // 优化包体积
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  
  // 输出配置
  output: 'standalone',
  
  // 重写规则（如果需要）
  async rewrites() {
    return []
  },
  
  // 重定向规则
  async redirects() {
    return [
      {
        source: '/resume',
        destination: '/chat',
        permanent: true,
      },
    ]
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
