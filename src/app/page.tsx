import Link from 'next/link'
import Image from 'next/image'
import { Header, HeaderNav, HeaderLink, Footer, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { FeatureCard, StepCard } from '@/components/home'

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: '对话式交互',
    description: '像聊天一样描述你的经历，AI自动整理成专业简历，告别繁琐的表单填写',
    color: 'blue' as const
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '智能优化',
    description: '根据目标岗位JD，自动优化简历内容，突出关键技能，提高面试机会',
    color: 'green' as const
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '多种模板',
    description: '提供多种精美简历模板，支持PDF、Markdown等多种格式导出',
    color: 'purple' as const
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: '简历评分',
    description: '多维度简历评分系统，帮你发现简历问题，提供针对性改进建议',
    color: 'orange' as const
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: '面试准备',
    description: '根据简历内容生成面试题，帮你提前准备，轻松应对面试',
    color: 'pink' as const
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: '简历上传',
    description: '支持PDF、Word、TXT格式上传，AI自动解析并优化现有简历',
    color: 'indigo' as const
  }
]

const steps = [
  { step: 1, title: '开始对话', description: '告诉AI你的求职意向和基本信息', showConnector: true },
  { step: 2, title: 'AI生成简历', description: 'AI根据你的描述生成专业简历内容', showConnector: true },
  { step: 3, title: '导出使用', description: '选择模板，一键导出PDF或复制使用', showConnector: false }
]

const stats = [
  { number: '10万+', label: '用户信赖' },
  { number: '50万+', label: '简历生成' },
  { number: '95%', label: '满意度' },
  { number: '3分钟', label: '平均用时' }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header>
        <HeaderNav>
          <HeaderLink href="#features">功能</HeaderLink>
          <HeaderLink href="#how-it-works">使用流程</HeaderLink>
          <HeaderLink href="/chat">开始对话</HeaderLink>
          <HeaderLink href="/chat" variant="primary">免费使用</HeaderLink>
        </HeaderNav>
      </Header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
        <Container className="relative py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <span className="animate-pulse-soft">✨</span>
                AI驱动的智能简历生成工具
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                让AI帮你打造
                <br />
                <span className="gradient-text">完美简历</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                通过对话方式，AI帮你生成和优化专业简历。
                无需填写复杂表单，就像和朋友聊天一样简单。
                支持简历上传、智能评分、面试准备等功能。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/chat">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    开始生成简历
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    了解更多
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Preview */}
            <div className="relative hidden lg:block">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  AI生成中...
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-100 rounded mt-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                    <div className="h-3 w-4/6 bg-gray-100 rounded" />
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 transform -rotate-3">
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">简历优化完成</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大的简历功能
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              从生成到优化，从评分到面试，全方位助力你的求职之路
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.color}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              简单三步，生成专业简历
            </h2>
            <p className="text-lg text-gray-600">
              无需复杂操作，AI帮你搞定一切
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <StepCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                showConnector={step.showConnector}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-white/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              多种精美模板
            </h2>
            <p className="text-lg text-gray-600">
              适合不同行业和职位的简历模板
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['经典风格', '现代风格', '极简风格', '创意风格'].map((template, index) => (
              <div key={template} className="group cursor-pointer">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute inset-4 bg-white rounded shadow-sm p-4">
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-3/4 bg-gray-100 rounded mb-1" />
                      <div className="h-3 w-2/3 bg-gray-100 rounded" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900">{template}</h3>
                    <p className="text-sm text-gray-500 mt-1">点击查看详情</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户怎么说
            </h2>
            <p className="text-lg text-gray-600">
              听听他们的使用体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: '张小明',
                role: '前端开发',
                content: '用了这个工具后，我的简历通过率提高了好多！AI优化的内容非常专业。'
              },
              {
                name: '李华',
                role: '产品经理',
                content: '对话式生成太方便了，再也不用纠结怎么写简历了，强烈推荐！'
              },
              {
                name: '王芳',
                role: '应届毕业生',
                content: '作为应届生，简历经验很少，这个工具帮我生成了很专业的简历，拿到了心仪的offer。'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h2>
            <p className="text-lg text-gray-600">
              解答你的疑惑
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: '使用这个工具需要付费吗？',
                a: '基础功能完全免费，包括简历生成、模板选择、PDF导出等。部分高级功能可能需要付费。'
              },
              {
                q: '我的简历信息安全吗？',
                a: '我们非常重视用户隐私，所有简历数据都经过加密处理，不会泄露给第三方。'
              },
              {
                q: '生成的简历可以直接使用吗？',
                a: '是的，AI生成的简历内容专业规范，你可以直接使用，也可以根据需要进行调整。'
              },
              {
                q: '支持哪些简历格式导出？',
                a: '目前支持PDF格式导出，后续会支持Word、Markdown等更多格式。'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              免费使用，无需注册即可体验。让AI帮你打造一份完美的简历，开启你的职业新篇章。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto">
                  立即开始
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
