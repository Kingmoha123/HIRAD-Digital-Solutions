import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Palette, Video, Briefcase, Shield, Cpu, Users, HeartHandshake } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import TeamSection from '../components/TeamSection';
import { BRAND, CAPABILITY_HIGHLIGHTS } from '../data/brand';

export default function About() {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* Page Hero */}
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
              ABOUT HIRAD
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              About <span className="gradient-text">HIRAD</span>
            </h1>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              {BRAND.statement}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description & Mission */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Practical Digital Solutions for Real Growth
              </h2>
              <p className={`text-base leading-relaxed mb-5 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                HIRAD is a Somali digital solutions company helping businesses and organizations turn ideas into practical digital products and services.
              </p>
              <p className={`text-base leading-relaxed mb-8 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                HIRAD combines technology, design, media and digital strategy to help businesses improve their digital presence and operations.
              </p>

              {/* Pillars (Replacing unverified numbers) */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Technology', desc: 'Modern software and robust systems' },
                  { title: 'Design', desc: 'Clean, user-centered digital interfaces' },
                  { title: 'Media', desc: 'Engaging brand visuals and multimedia' },
                  { title: 'Strategy', desc: 'Targeted digital presence and growth' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      dark ? 'bg-white/4 border-white/8' : 'bg-[#F4F7FB] border-gray-100'
                    }`}
                  >
                    <div
                      className={`text-sm font-bold mb-1 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {item.title}
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-8 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Our Core Principles
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: '⚡',
                    title: 'Practical Innovation',
                    desc: 'We focus on practical, functional solutions that solve real business challenges rather than unnecessary complexity.',
                  },
                  {
                    icon: '🛡️',
                    title: 'Engineering Rigor',
                    desc: 'Clean code, modern tech stacks, responsive interfaces, and maintainable application structures.',
                  },
                  {
                    icon: '🤝',
                    title: 'Authentic Partnership',
                    desc: 'Transparent milestones, honest communication, and direct collaboration from initial concept through deployment.',
                  },
                  {
                    icon: '🌍',
                    title: 'Local Insight, Global Standards',
                    desc: 'Deep appreciation of local enterprise needs combined with modern international software design standards.',
                  },
                ].map((val, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 p-5 rounded-xl border ${
                      dark ? 'bg-white/4 border-white/8' : 'bg-white border-gray-100 shadow-sm'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{val.icon}</span>
                    <div>
                      <h4
                        className={`font-bold text-base mb-1 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {val.title}
                      </h4>
                      <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section (Functional Roles with Editable Placeholders) */}
      <div className={`border-t ${dark ? 'border-white/8 bg-[#080E1A]' : 'border-gray-100 bg-[#F4F7FB]'}`}>
        <TeamSection dark={dark} />
      </div>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Ready to Build With HIRAD?
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Let's discuss your organization's goals and how our practical digital solutions can support your operations.
          </p>
          <Link to="/contact" className="btn-primary text-base py-4 px-8">
            <span>Get In Touch</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
