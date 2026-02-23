import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI简历助手 - 一键生成专业简历 | 智能简历优化工具',
    template: '%s | AI简历助手'
  },
  description: 'AI驱动的简历生成和优化工具，通过对话快速创建专业简历。支持多种模板、简历评分、智能诊断、一键导出PDF。让求职更轻松，让简历更出色。',
  keywords: ['简历生成', '简历优化', 'AI简历', '求职简历', '简历模板', '简历评分', '简历诊断', '求职助手', '简历制作', '在线简历'],
  authors: [{ name: 'AI简历助手' }],
  creator: 'AI简历助手',
  publisher: 'AI简历助手',
  metadataBase: new URL('https://resume-ai.vercel.app'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://resume-ai.vercel.app',
    siteName: 'AI简历助手',
    title: 'AI简历助手 - 一键生成专业简历',
    description: 'AI驱动的简历生成和优化工具，通过对话快速创建专业简历',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI简历助手',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI简历助手 - 一键生成专业简历',
    description: 'AI驱动的简历生成和优化工具，通过对话快速创建专业简历',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://resume-ai.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
