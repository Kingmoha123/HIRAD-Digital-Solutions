import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Building2, Users, Globe, Cpu, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { SOLUTIONS } from '../data/brand';

const ICON_MAP = {
  Layers,
  Building2,
  Users,
  Globe,
  Cpu,
  TrendingUp,
};

export default function Solutions() {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                dark ? 'bg-blue-950/60 text-[#06B6D4] border border-cyan-800/40' : 'bg-blue-50 text-[#2563EB] border border-blue-100'
              }`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              BUSINESS PROBLEMS WE SOLVE
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Solutions Built Around <span className="gradient-text">Real Problems</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              We solve the operational, organizational, and technical bottlenecks that growing businesses encounter every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid (6 Business Problems) */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS.map((sol, i) => {
              const Icon = ICON_MAP[sol.icon] || Layers;
              return (
                <AnimatedCard key={sol.id} delay={i * 0.08} className="group">
                  <div
                    className={`card-hover p-8 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${sol.color}15`,
                        border: `1px solid ${sol.color}35`,
                      }}
                    >
                      <Icon size={22} style={{ color: sol.color }} />
                    </div>

                    <h3
                      className={`font-bold text-xl mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {sol.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-6 flex-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {sol.description}
                    </p>

                    <div
                      className="pt-4 border-t flex items-start gap-2.5 text-xs font-medium"
                      style={{
                        borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        color: dark ? '#22D3EE' : '#0284C7',
                      }}
                    >
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-[#06B6D4]" />
                      <span>{sol.outcome}</span>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practical Transformation Framework */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="Our Approach"
            title="How We Approach Solution Engineering"
            subtitle="From identifying operational friction to deploying tested systems."
          />

          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Operational Assessment',
                desc: 'We examine your existing manual workflows, recordkeeping bottlenecks, and customer touchpoints.',
              },
              {
                step: '02',
                title: 'Tailored System Architecture',
                desc: 'We structure a purpose-built digital tool or platform matching your team size, budget, and day-to-day habits.',
              },
              {
                step: '03',
                title: 'Deployment & Training',
                desc: 'We ensure a smooth system rollout, hands-on team onboarding, and responsive ongoing maintenance.',
              },
            ].map((col, idx) => (
              <div
                key={idx}
                className={`p-7 rounded-2xl border ${
                  dark ? 'bg-white/4 border-white/8' : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                <div
                  className="text-2xl font-bold gradient-text mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {col.step}
                </div>
                <h4
                  className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {col.title}
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Facing an Operational Challenge?
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Tell us about your business friction points. We will recommend practical digital solutions.
          </p>
          <Link to="/contact" className="btn-primary text-base py-4 px-8">
            <span>Discuss Your Business Challenge</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
