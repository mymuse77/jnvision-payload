import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

export const metadata: Metadata = {
  description: '北京捷诺视讯数码科技有限公司——智能化软件平台开发商与行业数字化解决方案提供商。',
  icons: { icon: '/favicon.svg' },
  title: '北京捷诺｜行业数字化与智能化解决方案',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
