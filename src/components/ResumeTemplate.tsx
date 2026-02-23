'use client'

import { ResumeData, TemplateType } from '@/lib/templates'

interface ResumeTemplateProps {
  data: ResumeData
  template: TemplateType
}

export function ResumeTemplate({ data, template }: ResumeTemplateProps) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} />
    case 'modern':
      return <ModernTemplate data={data} />
    case 'minimal':
      return <MinimalTemplate data={data} />
    case 'creative':
      return <CreativeTemplate data={data} />
    default:
      return <ClassicTemplate data={data} />
  }
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 font-serif" style={{ width: '210mm', minHeight: '297mm' }}>
      <header className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name || '您的姓名'}</h1>
        <div className="text-gray-600 text-sm">
          {data.phone && <span className="mr-4">📞 {data.phone}</span>}
          {data.email && <span>✉️ {data.email}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">个人简介</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">教育背景</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{edu.school}</span>
                <span className="text-gray-600 text-sm">{edu.time}</span>
              </div>
              <div className="text-gray-700">{edu.major} | {edu.degree}</div>
            </div>
          ))}
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">工作经历</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <span className="font-semibold">{exp.company}</span>
                <span className="text-gray-600 text-sm">{exp.time}</span>
              </div>
              <div className="text-gray-700 mb-1">{exp.position}</div>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">项目经验</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{project.name}</span>
                <span className="text-gray-600 text-sm">{project.time}</span>
              </div>
              <div className="text-gray-700 text-sm">{project.role}</div>
              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">专业技能</h2>
          <p className="text-gray-700">{data.skills.join(' | ')}</p>
        </section>
      )}
    </div>
  )
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white flex" style={{ width: '210mm', minHeight: '297mm' }}>
      <aside className="w-1/3 bg-slate-800 text-white p-6">
        <div className="mb-8">
          <div className="w-24 h-24 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
            {data.name?.charAt(0) || '?'}
          </div>
          <h1 className="text-2xl font-bold text-center">{data.name || '您的姓名'}</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-600 pb-2 mb-3">联系方式</h2>
          {data.phone && <p className="text-sm mb-2">📞 {data.phone}</p>}
          {data.email && <p className="text-sm break-all">✉️ {data.email}</p>}
        </div>

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-600 pb-2 mb-3">专业技能</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-slate-600 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="w-2/3 p-6">
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-1 mb-3">个人简介</h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-1 mb-3">教育背景</h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">{edu.school}</h3>
                    <p className="text-gray-600 text-sm">{edu.major} · {edu.degree}</p>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{edu.time}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-1 mb-3">工作经历</h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-slate-800">{exp.company}</h3>
                    <p className="text-blue-600 text-sm">{exp.position}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{exp.time}</span>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">▸</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-1 mb-3">项目经验</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-800">{project.name}</h3>
                  <span className="text-gray-500 text-sm">{project.time}</span>
                </div>
                <p className="text-blue-600 text-sm">{project.role}</p>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-12" style={{ width: '210mm', minHeight: '297mm' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">{data.name || '您的姓名'}</h1>
        <div className="text-gray-500 text-sm">
          {[data.phone, data.email].filter(Boolean).join(' · ')}
        </div>
      </header>

      {data.summary && (
        <section className="mb-8">
          <p className="text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-4">{data.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">教育</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3 flex justify-between">
              <div>
                <span className="text-gray-900">{edu.school}</span>
                <span className="text-gray-400 mx-2">—</span>
                <span className="text-gray-600">{edu.major}, {edu.degree}</span>
              </div>
              <span className="text-gray-400 text-sm">{edu.time}</span>
            </div>
          ))}
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">经历</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between mb-1">
                <span className="text-gray-900 font-medium">{exp.company}</span>
                <span className="text-gray-400 text-sm">{exp.time}</span>
              </div>
              <p className="text-gray-500 text-sm mb-2">{exp.position}</p>
              <div className="text-gray-600 text-sm space-y-1">
                {exp.achievements.map((achievement, i) => (
                  <p key={i}>{achievement}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">项目</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <span className="text-gray-900">{project.name}</span>
                <span className="text-gray-400 text-sm">{project.time}</span>
              </div>
              <p className="text-gray-500 text-sm">{project.role}</p>
              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">技能</h2>
          <p className="text-gray-600">{data.skills.join(' · ')}</p>
        </section>
      )}
    </div>
  )
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50" style={{ width: '210mm', minHeight: '297mm' }}>
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{data.name || '您的姓名'}</h1>
        <div className="flex gap-4 text-purple-100">
          {data.phone && <span>📞 {data.phone}</span>}
          {data.email && <span>✉️ {data.email}</span>}
        </div>
      </header>

      <div className="p-8">
        {data.summary && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">👤</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">关于我</h2>
            </div>
            <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg shadow-sm">{data.summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">🎓</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">教育背景</h2>
            </div>
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                    <p className="text-purple-600">{edu.major} · {edu.degree}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">{edu.time}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">💼</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">工作经历</h2>
            </div>
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{exp.company}</h3>
                    <p className="text-blue-600">{exp.position}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{exp.time}</span>
                </div>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-600 text-sm flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">🚀</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">项目经验</h2>
            </div>
            {data.projects.map((project, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  <span className="text-gray-500 text-sm">{project.time}</span>
                </div>
                <p className="text-orange-600 text-sm">{project.role}</p>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600">⚡</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">专业技能</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
