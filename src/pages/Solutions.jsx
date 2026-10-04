import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, Heart, Truck, Users, Database, Globe, Smartphone } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { SOLUTIONS } from '../data/brand';

const ICON_MAP = { Building2, GraduationCap, Heart, Truck, Users, Database, Globe, Smartphone };

const caseStudies = [
  {
    icon: '🏥',
    title: 'Healthcare Digitalization',
    desc: 'How digital patient records transformed clinic efficiency by 60%.',
    tag: 'Healthcare',
    color: '#06B6D4',
  },
  {
    icon: '🎓',
    title: 'School Management Platform',
    desc: 'A centralized education system for student, teacher, and admin management.',
    tag: 'Education',
    color: '#2563EB',
  },
  {
    icon: '🚚',
    title: 'Logistics Tracking System',
    desc: 'Real-time fleet tracking and delivery management across Mogadishu.',
    tag: 'Logistics',
    color: '#8B5CF6',
  },
];

export default function Solutions() {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0" style={{
          background: dark
            ? 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.05) 0%, transparent 70%)',
        }} />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${
              dark ? 'bg-blue-950/60 text-[#06B6D4] border border-cyan-800/40' : 'bg-blue-50 text-[#2563EB] border border-blue-100'
            }`} style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              SOLUTIONS
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Solutions Built Around <span className="gradient-text">Real Problems</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              We tackle the real challenges that businesses and organizations face with purpose-built digital tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((sol, i) => {
              const Icon = ICON_MAP[sol.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.07} className="group">
                  <div className={`card-hover p-7 rounded-2xl h-full flex flex-col ${
                    dark
                      ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                      : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                  }`}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={20} color="#2563EB" />
                    </div>
                    <h3 className={`font-bold text-base mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      {sol.title}
                    </h3>
                    <p className={`text-sm flex-1 leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{sol.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading badge="Case Studies" title="Real Solutions, Real Results" subtitle="How HIRAD's solutions have transformed businesses and organizations." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((cs, i) => (
              <AnimatedCard key={i} delay={i * 0.12} className="group">
                <div className={`card-hover p-8 rounded-2xl flex flex-col ${
                  dark ? 'bg-white/4 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  <div className="text-4xl mb-5">{cs.icon}</div>
                  <span
                    className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit"
                    style={{ background: `${cs.color}18`, color: cs.color, border: `1px solid ${cs.color}30`, fontFamily: 'Sora, sans-serif' }}
                  >
                    {cs.tag}
                  </span>
                  <h3 className={`font-bold text-lg mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {cs.title}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{cs.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}>
            Need a Custom Solution?
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            We build tailored digital tools around your specific needs and industry.
          </p>
          <Link to="/contact" className="btn-primary text-base py-4 px-8">
            <span>Discuss Your Project</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
