import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  Smartphone,
  Layers,
  Code2,
  Cpu,
  Palette,
  Video,
  Megaphone,
  Building2,
  Users,
  TrendingUp,
  Search,
  PenTool,
  Rocket,
  User,
  Shield,
  MessageSquare,
  Headphones,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard, TechVisual } from '../components/UI';
import ProjectCard from '../components/ProjectCard';
import CaseStudyModal from '../components/CaseStudyModal';
import TeamSection from '../components/TeamSection';
import {
  BRAND,
  CAPABILITY_HIGHLIGHTS,
  SERVICES,
  SOLUTIONS,
  PROJECTS,
  PROCESS_STEPS,
  WHY_HIRAD,
} from '../data/brand';

const ICON_MAP = {
  Globe,
  Smartphone,
  Layers,
  Code2,
  Cpu,
  Palette,
  Video,
  Megaphone,
  Building2,
  Users,
  TrendingUp,
  Search,
  PenTool,
  Rocket,
  User,
  Shield,
  MessageSquare,
  Headphones,
};

export default function Home() {
  const { dark } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="home-hero relative flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern" />
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.14) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: dark
              ? 'linear-gradient(to top, #0B1220, transparent)'
              : 'linear-gradient(to top, #ffffff, transparent)',
          }}
        />

        <div className="container-custom home-hero-content relative z-10">
          <div className="home-hero-grid grid lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 ${
                  dark
                    ? 'bg-blue-950/60 text-[#06B6D4] border border-cyan-800/40'
                    : 'bg-blue-50 text-[#2563EB] border border-blue-100'
                }`}
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                MOGADISHU, SOMALIA
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
              >
                Building Digital{' '}
                <span className="gradient-text">Solutions</span>{' '}
                for a Smarter Future.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-lg leading-relaxed mb-10 max-w-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {BRAND.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/contact" className="btn-primary text-base py-4 px-7">
                  <span>Start a Project</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn-secondary text-base py-4 px-7">
                  Explore Our Services
                </Link>
              </motion.div>

              {/* Verified Capability Highlights (Replaces unverified statistics) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-14 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-5"
                style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(11,18,32,0.08)' }}
              >
                {CAPABILITY_HIGHLIGHTS.map((cap, i) => {
                  const Icon = ICON_MAP[cap.icon] || Code2;
                  return (
                    <div key={i} className="group flex flex-col gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${cap.color}18`, border: `1px solid ${cap.color}30` }}
                      >
                        <Icon size={15} style={{ color: cap.color }} />
                      </div>
                      <div
                        className="text-sm font-bold group-hover:text-[#06B6D4] transition-colors"
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          color: dark ? '#FFFFFF' : '#0B1220',
                        }}
                      >
                        {cap.title}
                      </div>
                      <div className={`text-xs leading-snug ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {cap.subtitle}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right: Tech Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <TechVisual dark={dark} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITY HIGHLIGHTS CARDS ─────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="Our Capabilities"
            title="What We Bring to Every Project"
            subtitle="HIRAD combines technology, creative design, digital media, and strategic execution to help businesses and organizations grow digitally."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITY_HIGHLIGHTS.map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Code2;
              return (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <div
                    className={`card-hover p-7 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                    >
                      <Icon size={22} style={{ color: item.color }} />
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {item.title}
                    </h3>
                    <p className={`text-sm leading-relaxed flex-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO / PROJECTS ────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Portfolio"
            title="Featured Projects & Systems"
            subtitle="Explore our verified systems and working digital concepts, featuring real user interfaces and architectural overviews."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, i) => (
              <AnimatedCard key={project.id} delay={i * 0.1}>
                <ProjectCard
                  project={project}
                  onSelect={(proj) => setSelectedProject(proj)}
                  dark={dark}
                />
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/projects" className="btn-secondary">
              <span>View Full Portfolio</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="What We Provide"
            title="Our Core Services"
            subtitle="End-to-end digital services tailored to businesses, organizations, and growing institutions."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Globe;
              return (
                <AnimatedCard key={service.id} delay={i * 0.06} className="group">
                  <div
                    className={`card-hover p-7 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)' }}
                    >
                      <Icon size={22} color="#2563EB" />
                    </div>
                    <h3
                      className={`font-bold text-base mb-2.5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {service.title}
                    </h3>
                    <p className={`text-xs leading-relaxed flex-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] group-hover:gap-2.5 transition-all"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Learn More <ArrowRight size={13} />
                    </Link>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/services" className="btn-secondary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SUMMARY ───────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                  dark ? 'bg-blue-950/60 text-[#06B6D4] border border-cyan-800/40' : 'bg-blue-50 text-[#2563EB] border border-blue-100'
                }`}
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                WHO WE ARE
              </div>
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {BRAND.statement}
              </h2>
              <p className={`text-base leading-relaxed mb-5 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                HIRAD is a Somali digital solutions company helping businesses and organizations turn ideas into practical digital products and services.
              </p>
              <p className={`text-base leading-relaxed mb-8 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                HIRAD combines technology, design, media and digital strategy to help businesses improve their digital presence and operations.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { title: 'Technology First', desc: 'Practical software engineering built for stability and scalability.' },
                  { title: 'Design & Media', desc: 'Clear visual identity and user-centric design that builds credibility.' },
                  { title: 'Reliable Partnership', desc: 'Direct technical support from concept through deployment.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
                    >
                      <span className="text-white text-xs font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-sm mb-0.5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                      <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn-primary">
                <span>Learn More About HIRAD</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-3xl overflow-hidden relative"
                style={{
                  background: dark
                    ? 'linear-gradient(135deg, #0E1726, #16243A)'
                    : 'linear-gradient(135deg, #EFF6FF, #E0F2FE)',
                  padding: '40px',
                  minHeight: '400px',
                }}
              >
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="relative z-10 flex flex-col gap-4">
                  {[
                    { label: 'Technology Stack', value: 'Modern Web, React & Cloud APIs', icon: '⚡' },
                    { label: 'Engineering Standards', value: 'Tested, Structured & Maintainable', icon: '🛡️' },
                    { label: 'Design Excellence', value: 'Accessible, Responsive & Branded', icon: '🎨' },
                    { label: 'Regional Focus', value: 'Built in Mogadishu for Global Reach', icon: '🌍' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
                        border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(37,99,235,0.12)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.label}
                        </div>
                        <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-[#0B1220]'}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTIONS (BUSINESS PROBLEMS SOLVED) ─────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="Solutions"
            title="Solving Business & Operational Challenges"
            subtitle="Purpose-built digital systems that resolve day-to-day operational pain points."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((sol, i) => {
              const Icon = ICON_MAP[sol.icon] || Building2;
              return (
                <AnimatedCard key={sol.id} delay={i * 0.08} className="group">
                  <div
                    className={`card-hover p-7 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={20} color="#2563EB" />
                    </div>
                    <h3
                      className={`font-bold text-base mb-2.5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {sol.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {sol.description}
                    </p>
                    <div
                      className="mt-auto pt-3 border-t text-xs font-medium text-[#06B6D4]"
                      style={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                    >
                      Outcome: {sol.outcome}
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/solutions" className="btn-secondary">
              <span>Explore All Solutions</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MEET THE TEAM ────────────────────────────────────── */}
      <TeamSection dark={dark} />

      {/* ─── PROCESS ─────────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="How We Work"
            title="Our Delivery Process"
            subtitle="A structured, collaborative development methodology ensuring clear progress and high quality."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div
              className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px pointer-events-none"
              style={{ background: dark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.15)', top: '40px' }}
            />

            {PROCESS_STEPS.map((step, i) => {
              const Icon = ICON_MAP[step.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto mb-6">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative"
                        style={{
                          background: dark
                            ? 'linear-gradient(135deg, #111827, #1e3a5f)'
                            : 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                          border: '2px solid rgba(37,99,235,0.3)',
                          boxShadow: '0 0 0 8px ' + (dark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.05)'),
                        }}
                      >
                        <Icon size={24} color="#2563EB" />
                        <div
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontFamily: 'Sora, sans-serif' }}
                        >
                          {i + 1}
                        </div>
                      </div>
                    </div>
                    <h3
                      className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY HIRAD ───────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Why HIRAD"
            title="A Dedicated Technology Partner"
            subtitle="We bring engineering rigor, transparent collaboration, and continuous support to every engagement."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_HIRAD.map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.08} className="group">
                  <div
                    className={`card-hover p-7 rounded-2xl flex gap-5 ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={20} color="#2563EB" />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MEET THE TEAM ─────────────────────────────────────── */}
      <div className={`border-t ${dark ? 'border-white/8 bg-[#080E1A]' : 'border-gray-100 bg-[#F4F7FB]'}`}>
        <TeamSection dark={dark} />
      </div>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-3xl px-8 sm:px-16 py-20 text-center"
            style={{
              background: 'linear-gradient(135deg, #0B1220 0%, #172846 50%, #0B1220 100%)',
            }}
          >
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.25) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                GET STARTED
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
              >
                Have an Idea? Let's Build It Together.
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                From a clear idea to a practical digital product, HIRAD is ready to partner with you to engineer your digital solution.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact" className="btn-primary text-base py-4 px-8">
                  <span>Start a Project</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-secondary text-base py-4 px-8" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        dark={dark}
      />
    </div>
  );
}
