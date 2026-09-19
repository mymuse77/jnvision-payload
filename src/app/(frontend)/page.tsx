import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { fallbackInsights, formatInsightDate, type InsightCard } from '@/lib/insights'
import { ContactForm } from './ContactForm'

type SolutionCard = { eyebrow: string; title: string; summary: string; highlights: string[] }
type ProductCard = { englishTitle: string; title: string; category: string; summary: string; capabilities: string[] }

const fallbackSolutions: SolutionCard[] = [
  {
    eyebrow: 'ENERGY INDUSTRY',
    title: '油气能源行业',
    summary: '面向石油、石化、管网、电力与矿山，贯通集团级视频资源、生产安全、设备运维与站场数字孪生。',
    highlights: ['工业视频“一张网”', '智能安防与运维', '三维智慧站场'],
  },
  {
    eyebrow: 'PUBLIC SECURITY',
    title: '公安及政府公共安全',
    summary: '服务智慧城市、平安城市、雪亮工程与城市生命线，以视频、物联和AI提升预警、指挥与应急处置能力。',
    highlights: ['雪亮工程运维', '视图数据治理', '全面信创适配'],
  },
  {
    eyebrow: 'AI + MANUFACTURING',
    title: 'AI技术赋能智能制造',
    summary: '把工业平台、大模型与数字孪生融入研发、生产和供应链，形成从感知、决策到执行的智能闭环。',
    highlights: ['工业智能体', '数字人交互', '实时数字孪生'],
  },
]

const fallbackProducts: ProductCard[] = [
  { englishTitle: 'Video Monitoring System', title: '视频监控系统', category: '视频融合', summary: '兼容主流厂商平台与 ONVIF、GB/T-28181、SNMP 等协议，形成大规模图像信息共享与集中告警能力。', capabilities: ['多源接入', '流媒体与转码', 'GIS与移动应用'] },
  { englishTitle: 'Intelligent Maintenance', title: '智能运维系统', category: '智能运维', summary: '围绕“可视、可测、可控、可管”，实现设备监看、问题检测、流程管控与全生命周期管理。', capabilities: ['全网监测', '实时告警', '量化考核'] },
  { englishTitle: 'Smart Station Fusion', title: '站场智慧融合系统', category: '数字站场', summary: '把站场多专业系统汇聚为一张图，覆盖巡检、预警、计量、能耗、运行、安防、诊断和视频融合。', capabilities: ['一张图管理', '多系统联动', '三维可视化'] },
  { englishTitle: 'Integrated Security', title: '综合安防一体化系统', category: '安全生产', summary: '统一视频、门禁、周界、报警、AI分析和三维可视化，形成感知、预警、研判、处置闭环。', capabilities: ['统一管控', 'AI分析', '联动处置'] },
  { englishTitle: 'Video 3D Digital Twin', title: '实景三维数字孪生', category: '空间智能', summary: '以像素级精度把实时视频融入三维空间，为园区、城市和工业现场提供可计算、可模拟的分析环境。', capabilities: ['实景融合', '态势推演', '空间计算'] },
  { englishTitle: 'AI Intelligent Assistant', title: 'AI智能体 / 数字人', category: '行业大模型', summary: '构建具备行业知识、场景感知与自然交互能力的数字助手，服务安全监管、公共预警和指挥决策。', capabilities: ['知识问答', '智能研判', '数字化交互'] },
]

async function loadManagedContent() {
  try {
    const payload = await getPayload({ config })
    const [solutionsResult, productsResult, insightsResult, settingsResult] = await Promise.allSettled([
      payload.find({ collection: 'solutions', limit: 20, sort: 'order' }),
      payload.find({ collection: 'products', limit: 20, sort: 'order' }),
      payload.find({ collection: 'insights', limit: 12, sort: '-publishedAt' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])

    const solutions = solutionsResult.status === 'fulfilled' && solutionsResult.value.docs.length
      ? solutionsResult.value.docs.map((item) => ({ eyebrow: item.eyebrow || item.sector, title: item.title, summary: item.summary, highlights: item.highlights?.map((x) => x.text) || [] }))
      : fallbackSolutions
    const products = productsResult.status === 'fulfilled' && productsResult.value.docs.length
      ? productsResult.value.docs.map((item) => ({ englishTitle: item.englishTitle || item.category, title: item.title, category: item.category, summary: item.summary, capabilities: item.capabilities?.map((x) => x.text) || [] }))
      : fallbackProducts
    const insights = insightsResult.status === 'fulfilled' && insightsResult.value.docs.length
      ? insightsResult.value.docs.map((item): InsightCard => ({ slug: String(item.id), topic: item.topic, date: formatInsightDate(item.publishedAt), title: item.title, excerpt: item.excerpt, body: [] }))
      : fallbackInsights
    const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null

    return { solutions, products, insights, settings }
  } catch {
    return { solutions: fallbackSolutions, products: fallbackProducts, insights: fallbackInsights, settings: null }
  }
}

export default async function HomePage() {
  const { solutions, products, insights, settings } = await loadManagedContent()
  const phone = settings?.phone || '010-58851134/5/6/7/8'
  const address = settings?.address || '北京市海淀区上地东路一号盈创动力E座504室'

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="北京捷诺首页">
          <Image src="/jnvision-logo.png" alt="北京捷诺" width={176} height={55} priority />
        </a>
        <nav className="site-nav" aria-label="主导航">
          <a href="#about">关于捷诺</a><a href="#business">业务领域</a><a href="#products">产品与服务</a><a href="#insights">技术洞察</a>
        </nav>
        <a className="header-cta" href="#contact">联系团队</a>
        <details className="mobile-nav"><summary aria-label="打开导航">菜单</summary><div><a href="#about">关于捷诺</a><a href="#business">业务领域</a><a href="#products">产品与服务</a><a href="#contact">联系我们</a></div></details>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-image" src="/hero-city.jpg" alt="数字化城市与全域互联网络" fill sizes="100vw" priority />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-scan" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-a" aria-hidden="true"><span /></div>
          <div className="hero-orbit hero-orbit-b" aria-hidden="true"><span /></div>
          <div className="hero-content">
            <p className="eyebrow"><span>JN / VISION</span> 1997—2026</p>
            <h1 id="hero-title">让每一个复杂场景<br />都拥有清晰的数字视野</h1>
            <p className="hero-copy">面向能源、公共安全与智能制造，以视频融合、人工智能、物联网和三维数字孪生，构建可感知、可分析、可协同的行业数字底座。</p>
            <div className="hero-actions"><a className="button button-primary" href="#business">探索业务领域</a><a className="button button-ghost" href="#products">查看产品能力 <span>↗</span></a></div>
          </div>
          <aside className="hero-status" aria-label="核心能力概览">
            <div className="status-top"><span className="pulse" /> 全栈自主技术能力 <em>LIVE</em></div><div className="status-meter"><span /></div>
            <div className="status-list"><p><strong>100+</strong><span>知识产权</span></p><p><strong>2,000+</strong><span>成功案例</span></p><p><strong>1,000,000+</strong><span>项目规模</span></p></div>
          </aside>
        </section>

        <section className="capability-strip" aria-label="核心业务"><p>能源数智化</p><p>公共安全</p><p>智能制造</p><p>全面信创</p></section>

        <section className="section about-section" id="about">
          <div className="section-kicker"><span>01</span> COMPANY PROFILE</div>
          <div className="about-grid">
            <div><h2>长期主义，<br />写进每一行代码。</h2></div>
            <div className="about-copy">
              <p className="lead">北京捷诺成立于1997年，注册资金1500万元，是国家高新技术企业和双软企业，也是智能化软件平台开发商与行业解决方案提供商。</p>
              <p>公司持续服务石油、石化、管网等油气能源客户，深度参与智慧城市、平安城市、雪亮工程等公共安全项目，并面向央国企、政府和重点行业推进信创适配。</p>
              <p>从AIoT、视频融合到三维实景孪生，从能源安全管控到应急管理和智能制造，捷诺以自主产品、自研算法和跨行业整合能力，把复杂技术转化为可落地的场景价值。</p>
            </div>
          </div>
          <div className="research-band">
            <span>研发网络</span><strong>北京</strong><i /> <strong>重庆</strong><i /> <strong>大连</strong><i /> <strong>武汉</strong><i /> <strong>郑州</strong>
          </div>
        </section>

        <section className="section business-section" id="business">
          <div className="section-heading"><div className="section-kicker"><span>02</span> BUSINESS FIELDS</div><h2>深耕行业场景，<br />让技术真正进入现场。</h2></div>
          <div className="business-grid">
            {solutions.map((item, index) => (
              <article className={`business-card business-${index + 1}`} key={item.title} style={{ position: 'relative' }}>
                {index === 0 && <Image src="/energy.jpg" alt="油气能源生产场景" fill sizes="(max-width: 900px) 100vw, 45vw" />}
                {index === 2 && <Image src="/ai-manufacturing.jpg" alt="人工智能赋能制造业" fill sizes="(max-width: 900px) 100vw, 45vw" />}
                <div className="business-overlay" />
                <div className="business-content"><span className="card-index">0{index + 1}</span><p>{item.eyebrow}</p><h3>{item.title}</h3><div className="card-summary">{item.summary}</div><ul>{item.highlights.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </article>
            ))}
          </div>
        </section>

        <section className="security-band">
          <div className="security-intro"><p className="eyebrow"><span>TRUSTED INFRASTRUCTURE</span></p><h2>以自主可控，筑牢关键行业数字底座</h2><p>从芯、端到云完成全栈信创适配，兼顾渐进式升级、业务连续性和安全合规，让平台在国产化环境中稳定运行。</p></div>
          <div className="security-matrix"><div><b>01</b><span>雪亮工程视频运维</span></div><div><b>02</b><span>公安视图数据治理</span></div><div><b>03</b><span>城市生命线监测</span></div><div><b>04</b><span>全链条信创适配</span></div></div>
        </section>

        <section className="section products-section" id="products">
          <div className="section-heading split"><div><div className="section-kicker"><span>03</span> PRODUCTS & SERVICES</div><h2>一个技术底座，<br />六类核心产品。</h2></div><p>兼容多源设备与协议，把数据汇聚、智能分析、空间建模和业务协同封装为可组合能力。</p></div>
          <div className="product-grid">
            {products.map((item, index) => (
              <article className="product-card" key={item.title}>
                <div className="product-top"><span>{String(index + 1).padStart(2, '0')}</span><i>{item.category}</i></div>
                <p className="product-en">{item.englishTitle}</p><h3>{item.title}</h3><p>{item.summary}</p>
                <ul>{item.capabilities.map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="twin-section">
          <div className="twin-visual" aria-hidden="true"><div className="twin-orbit orbit-one" /><div className="twin-orbit orbit-two" /><div className="twin-core">LIVE<br />TWIN</div><span className="node n1" /><span className="node n2" /><span className="node n3" /><span className="node n4" /></div>
          <div className="twin-content"><div className="section-kicker"><span>04</span> REAL-SCENE DIGITAL TWIN</div><h2>从“看得见”，走向<br />“可计算、可推演、可决策”。</h2><p>以统一时空坐标为基准，将图纸、实测与精细建模结合；通过视频拼接、空间配准和像素级贴合，把实时画面、多源感知与业务数据汇聚为全息数字空间。</p>
            <div className="twin-list"><div><b>01</b><span>统一时空坐标</span></div><div><b>02</b><span>实时视频实景融合</span></div><div><b>03</b><span>全类型感知汇聚</span></div><div><b>04</b><span>高效时空引擎</span></div></div>
          </div>
        </section>

        <section className="section insights-section" id="insights">
          <div className="section-heading split"><div><div className="section-kicker"><span>05</span> INSIGHTS & CASES</div><h2>来自一线场景的<br />技术实践。</h2></div><p>从30万路工业视频资源汇聚，到海上油田智能安防与3DGS空间重建，持续沉淀可复用的方法和产品能力。</p></div>
          <div className="insight-list">
            {insights.map((item, index) => <Link className="insight-item" href={`/insights/${item.slug}`} key={item.title}><span className="insight-no">{String(index + 1).padStart(2, '0')}</span><div><p>{item.topic} · {item.date}</p><h3>{item.title}</h3><span>{item.excerpt}</span></div><i aria-hidden="true">↗</i></Link>)}
          </div>
        </section>

        <section className="section history-section">
          <div className="section-heading"><div className="section-kicker"><span>06</span> DEVELOPMENT</div><h2>从视频联网，走向<br />场景智能。</h2></div>
          <div className="timeline"><article><time>1997</time><h3>企业成立</h3><p>自主研发视频监控联网软件，推动安防行业从数字化迈向网络化。</p></article><article><time>2002</time><h3>企业成长期</h3><p>推出综合安防、行业解决方案及监控系统运维管理平台。</p></article><article><time>2014</time><h3>公司转型期</h3><p>深耕行业应用场景，持续为能源企业提供可信赖的定制化产品与服务。</p></article><article><time>2020</time><h3>生态赋能期</h3><p>以标准能力组件、深度定制开发和联合解决方案构建开放生态。</p></article><article><time>2025</time><h3>智能融合期</h3><p>将AI、大模型与数字孪生深入制造与能源现场，构建智能闭环。</p></article></div>
          <blockquote>“以创新技术筑牢发展根基，共创安全、智慧、可持续的数字未来。”<span>企业愿景</span></blockquote>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-info"><div className="section-kicker"><span>07</span> CONTACT</div><h2>把需求交给真正<br />理解现场的团队。</h2><p>开放生态合作，以客户为中心，提供可持续演进的产品定制与专业服务。</p>
            <dl><div><dt>联系电话</dt><dd>{phone}</dd></div><div><dt>传真</dt><dd>{settings?.fax || '010-58851134-209'}</dd></div><div><dt>总部地址</dt><dd>{address}</dd></div></dl>
          </div><ContactForm />
        </section>
      </main>

      <footer><div className="footer-brand"><Image src="/jnvision-logo.png" alt="北京捷诺" width={176} height={55} /><p>场景化 · 数字化 · 智能化</p></div><div><a href="#business">业务领域</a><a href="#products">产品服务</a><Link href="/admin">内容管理</Link></div><p>© 北京捷诺视讯数码科技有限公司<br />{settings?.icp || '京ICP备14042411号-1'}</p></footer>
    </div>
  )
}
