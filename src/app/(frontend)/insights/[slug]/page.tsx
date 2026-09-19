import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Insight } from '@/payload-types'
import config from '@/payload.config'
import { formatInsightDate, getFallbackInsight } from '@/lib/insights'

type PageProps = { params: Promise<{ slug: string }> }

type ArticleData = {
  title: string
  topic: string
  date: string
  excerpt: string
  paragraphs?: string[]
  richText?: Insight['body']
}

const loadArticle = cache(async (slug: string): Promise<ArticleData | null> => {
  const fallback = getFallbackInsight(slug)

  if (fallback) {
    return {
      title: fallback.title,
      topic: fallback.topic,
      date: fallback.date,
      excerpt: fallback.excerpt,
      paragraphs: fallback.body,
    }
  }

  const id = Number(slug)
  if (!Number.isInteger(id) || id < 1) return null

  try {
    const payload = await getPayload({ config })
    const article = await payload.findByID({ collection: 'insights', id })

    return {
      title: article.title,
      topic: article.topic,
      date: formatInsightDate(article.publishedAt),
      excerpt: article.excerpt,
      richText: article.body,
    }
  } catch {
    return null
  }
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await loadArticle(slug)

  if (!article) return { title: '内容未找到｜北京捷诺' }

  return {
    title: `${article.title}｜北京捷诺`,
    description: article.excerpt,
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = await loadArticle(slug)

  if (!article) notFound()

  return (
    <div className="article-page">
      <header className="article-header">
        <Link className="brand" href="/" aria-label="返回北京捷诺首页">
          <Image src="/jnvision-logo.png" alt="北京捷诺" width={176} height={55} priority />
        </Link>
        <Link className="article-back" href="/#insights"><span aria-hidden="true">←</span> 返回技术洞察</Link>
      </header>

      <main>
        <section className="article-hero">
          <div className="article-hero-grid" aria-hidden="true" />
          <div className="article-hero-inner">
            <p className="article-meta"><span>{article.topic}</span><time>{article.date}</time></p>
            <h1>{article.title}</h1>
            <p className="article-lead">{article.excerpt}</p>
          </div>
        </section>

        <article className="article-shell">
          <aside className="article-aside">
            <span>JN / INSIGHT</span>
            <p>技术实践与行业观察</p>
          </aside>
          <div className="article-body">
            {article.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {article.richText && <RichText data={article.richText} />}
          </div>
        </article>

        <section className="article-next">
          <p>继续了解捷诺的行业实践</p>
          <Link href="/#insights">查看全部技术洞察 <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  )
}
