'use client'

import { Code2, ChartBar, Cpu, Layers } from 'lucide-react'

interface SkillsPreviewProps {
  skills?: { id: string; category: string; name: string }[]
}

const DOMAIN_SKILLS = [
  {
    category: 'Software & Web Development',
    icon: <Code2 size={18} className="text-blue-400" />,
    description: 'Production-ready web applications, modular system architecture, and accessible interfaces.',
    skills: ['TypeScript', 'React & Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Git'],
  },
  {
    category: 'Data Analysis & Insights',
    icon: <ChartBar size={18} className="text-emerald-400" />,
    description: 'Structured exploratory analysis, clean SQL modeling, and visual reporting dashboards.',
    skills: ['Python (Pandas / NumPy)', 'SQL Modeling', 'Data Visualization', 'Power BI', 'Statistical Analysis'],
  },
  {
    category: 'AI Automation & Systems',
    icon: <Cpu size={18} className="text-indigo-400" />,
    description: 'Streamlining operational workflows through LLM integrations, agents, and API orchestration.',
    skills: ['LLM Workflows', 'Prompt Architecture', 'Agentic Pipelines', 'API Integration', 'Process Automation'],
  },
]

export default function SkillsPreview({ skills = [] }: SkillsPreviewProps) {
  const categories = skills.length > 0
    ? Object.entries(
        skills.reduce<Record<string, string[]>>((acc, s) => {
          if (!acc[s.category]) acc[s.category] = []
          acc[s.category].push(s.name)
          return acc
        }, {})
      ).map(([category, names]) => ({
        category,
        icon: <Layers size={18} className="text-blue-400" />,
        description: 'Applied tools and engineering competencies.',
        skills: names,
      }))
    : DOMAIN_SKILLS

  return (
    <section
      id="skills-overview"
      className="bg-[#0a0d13] py-14 sm:py-20 border-b border-white/[0.06]"
    >
      <div className="page-container">

        <div className="max-w-2xl mb-8 sm:mb-10">
          <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-2">
            Capabilities
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            Technical Disciplines &amp; Skills
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A practical foundation spanning full-stack software development, empirical data analysis, and workflow automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((domain) => (
            <div
              key={domain.category}
              className="flex flex-col h-full bg-[#141822] border border-white/[0.08] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  {domain.icon}
                </div>
                <h3 className="font-bold text-white text-base tracking-tight">
                  {domain.category}
                </h3>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                {domain.description}
              </p>

              <div className="mt-auto pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <span key={skill} className="tech-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
