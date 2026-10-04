import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Globe, Smartphone, Layers, Code2, Zap, BarChart3,
  Building2, GraduationCap, Heart, Truck, Users, Database,
  Search, PenTool, Rocket, Cpu, User, TrendingUp, Shield,
  MessageSquare, Headphones, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard, TechVisual } from '../components/UI';
import {
  SERVICES, SOLUTIONS, PROJECTS, PROCESS_STEPS, WHY_HIRAD, STATS,
} from '../data/brand';

const ICON_MAP = {
  Globe, Smartphone, Layers, Code2, Zap, BarChart3,
  Building2, GraduationCap, Heart, Truck, Users, Database,
  Search, PenTool, Rocket, Cpu, User, TrendingUp, Shield,
  MessageSquare, Headphones,
};

const PROJECT_COLORS = ['#2563EB', '#06B6D4', '#8B5CF6'];
const PROJECT_ICONS = ['🚦', '💊', '🏋️'];

export default function Home() {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        className="home-hero relative flex items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 grid-pattern" />
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
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
                <span className="gradient-text">Solutions</span>
                {' '}for a Smarter Future.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-lg leading-relaxed mb-10 max-w-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                HIRAD Digital Solutions helps businesses and organizations transform ideas into modern digital products, software, and experiences.
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

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-14 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-8"
                style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(11,18,32,0.06)' }}
              >
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <div
                      className="text-2xl font-bold gradient-text mb-1"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {stat.value}
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
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

      {/* ─── TRUST / INTRO ───────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading
            badge="Our Capabilities"
            title="Technology That Moves Your Business Forward"
            subtitle="HIRAD Digital Solutions provides reliable and innovative digital solutions designed to help businesses, organizations, and entrepreneurs grow in an increasingly digital world."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⬡', title: 'Digital Solutions', desc: 'End-to-end digital products tailored to your goals' },
              { icon: '◈', title: 'Web & Mobile', desc: 'Responsive websites and powerful mobile applications' },
              { icon: '◎', title: 'UI/UX Design', desc: 'Beautiful, user-centered interface and experience design' },
              { icon: '⬟', title: 'Business Technology', desc: 'Systems that drive efficiency and digital growth' },
            ].map((item, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div
                  className={`card-hover p-7 rounded-2xl ${
                    dark
                      ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                      : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                  }`}
                >
                  <div className="text-3xl mb-4" style={{ color: '#2563EB' }}>{item.icon}</div>
                  <h3
                    className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="What We Do" title="Our Services" subtitle="We build complete digital experiences — from design and development to deployment and beyond." />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Globe;
              return (
                <AnimatedCard key={service.id} delay={i * 0.08} className="group">
                  <div
                    className={`card-hover p-8 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-blue-50'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                      style={{ background: `rgba(37,99,235,0.1)`, border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={22} color="#2563EB" />
                    </div>
                    <h3
                      className={`font-bold text-lg mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {service.title}
                    </h3>
                    <p className={`text-sm flex-1 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] group-hover:gap-2.5 transition-all"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Learn More <ArrowRight size={14} />
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

      {/* ─── ABOUT ───────────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
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
                A Technology Company Built for the Future
              </h2>
              <p className={`text-base leading-relaxed mb-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                HIRAD Digital Solutions is a technology company focused on creating practical, scalable, and innovative digital solutions.
              </p>
              <p className={`text-base leading-relaxed mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Our goal is to help businesses and organizations use technology to solve real problems, improve efficiency, and create better digital experiences.
              </p>

              <div className="space-y-5 mb-10">
                {[
                  { title: 'Innovation', desc: 'We continuously explore better ways to solve digital challenges.' },
                  { title: 'Quality', desc: 'We focus on reliable, scalable, and user-friendly solutions.' },
                  { title: 'Partnership', desc: 'We work closely with our clients from idea to implementation.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
                    >
                      <span className="text-white text-xs font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-sm mb-1 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                      <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
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
                    ? 'linear-gradient(135deg, #111827, #1e3a5f)'
                    : 'linear-gradient(135deg, #EFF6FF, #E0F2FE)',
                  padding: '48px',
                  minHeight: '420px',
                }}
              >
                {/* Abstract grid */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    backgroundImage: dark
                      ? 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)'
                      : 'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
                {/* Decorative elements */}
                <div
                  className="absolute top-8 right-8 w-24 h-24 rounded-2xl"
                  style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }}
                />
                <div
                  className="absolute bottom-12 left-8 w-16 h-16 rounded-xl"
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}
                />

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col gap-4">
                  {[
                    { icon: '⚡', label: 'Fast Delivery', value: 'Agile Process' },
                    { icon: '🛡️', label: 'Reliable Code', value: 'Tested & Secure' },
                    { icon: '📱', label: 'Responsive Design', value: 'All Devices' },
                    { icon: '🌍', label: 'Global Standard', value: 'Modern Tech Stack' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                        border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(37,99,235,0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div
                          className={`text-xs font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-sm font-bold ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.value}
                        </div>
                      </div>
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTIONS ───────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Solutions" title="Solutions Built Around Real Problems" subtitle="We tackle the real challenges that businesses and organizations face with purpose-built digital tools." />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SOLUTIONS.map((sol, i) => {
              const Icon = ICON_MAP[sol.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.06} className="group">
                  <div
                    className={`card-hover p-6 rounded-2xl text-center ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={20} color="#2563EB" />
                    </div>
                    <h3
                      className={`font-bold text-sm mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {sol.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{sol.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ────────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading badge="Portfolio" title="Our Recent Work" subtitle="A selection of our featured digital concepts and completed solutions." />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((project, i) => (
              <AnimatedCard key={project.id} delay={i * 0.12} className="group">
                <div
                  className={`card-hover rounded-2xl overflow-hidden ${
                    dark ? 'bg-[#0F1A2E] border border-white/8' : 'bg-white border border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Project visual */}
                  <div
                    className="relative h-48 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}11)` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '25px 25px',
                      }}
                    />
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `rgba(255,255,255,${dark ? 0.07 : 0.9})`,
                        border: `2px solid ${project.color}40`,
                        boxShadow: `0 8px 30px ${project.color}30`,
                      }}
                    >
                      {PROJECT_ICONS[i]}
                    </div>
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: `${project.color}22`,
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                        fontFamily: 'Sora, sans-serif',
                      }}
                    >
                      {project.category}
                    </div>
                    <div
                      className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs"
                      style={{
                        background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                        color: dark ? '#94A3B8' : '#64748B',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      {project.tag}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <h3
                      className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {project.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {project.description}
                    </p>
                    <Link
                      to="/projects"
                      className={`inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all`}
                      style={{ color: project.color, fontFamily: 'Sora, sans-serif' }}
                    >
                      View Project <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/projects" className="btn-secondary">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="How We Work" title="Our Process" subtitle="A clear, structured approach that delivers results every time." />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{ background: dark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.15)', top: '40px' }}
            />

            {PROCESS_STEPS.map((step, i) => {
              const Icon = ICON_MAP[step.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.12}>
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
                    <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{step.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY HIRAD ───────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading badge="Why HIRAD" title="Why Work With HIRAD?" subtitle="We combine modern technology, professional design, and dedicated support to deliver exceptional digital solutions." />

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
                      <p className={`text-sm leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-3xl px-8 sm:px-16 py-20 text-center"
            style={{
              background: 'linear-gradient(135deg, #0B1220 0%, #1e3a5f 50%, #0B1220 100%)',
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Glow */}
            <div
              className="absolute inset-0"
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
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                From a simple idea to a complete digital product, HIRAD can help turn your vision into reality.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact" className="btn-primary text-base py-4 px-8">
                  <span>Start a Project</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-secondary text-base py-4 px-8" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
