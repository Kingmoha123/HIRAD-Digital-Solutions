import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Layers, Smartphone, Megaphone, ClipboardList, Globe } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { CAREERS } from '../data/brand';

const ICON_MAP = { Code2, Layers, Smartphone, Megaphone, ClipboardList, Globe };

const perks = [
  { icon: '🚀', title: 'Exciting Projects', desc: 'Work on real digital products that impact businesses and communities.' },
  { icon: '📈', title: 'Career Growth', desc: 'Learn from a team of experienced engineers and designers.' },
  { icon: '🤝', title: 'Collaborative Culture', desc: 'A supportive, transparent, and innovative team environment.' },
  { icon: '🌍', title: 'Make an Impact', desc: 'Help build Somalia\'s digital infrastructure and future.' },
  { icon: '⚡', title: 'Modern Tools', desc: 'Work with the latest technologies, frameworks, and design tools.' },
  { icon: '🎯', title: 'Purposeful Work', desc: 'Every project solves a real problem for real people.' },
];

export default function Careers() {
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
              JOIN THE TEAM
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
              Build the Future <span className="gradient-text">With HIRAD</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto mb-10 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              We are always interested in connecting with talented people who are passionate about technology, design, and innovation.
            </p>
            <Link to="/contact" className="btn-primary text-base py-4 px-8">
              <span>Join HIRAD</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading badge="Why Join Us" title="Life at HIRAD" subtitle="We build more than software — we build careers and futures." />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <AnimatedCard key={i} delay={i * 0.08}>
                <div className={`p-7 rounded-2xl card-hover ${dark ? 'bg-white/4 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}>
                  <div className="text-3xl mb-4">{perk.icon}</div>
                  <h3 className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {perk.title}
                  </h3>
                  <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{perk.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Open Roles" title="Areas We're Hiring In" subtitle="We're building a diverse team of technologists, designers, and innovators." />
          <div className="mt-16 space-y-4">
            {CAREERS.map((career, i) => {
              const Icon = ICON_MAP[career.icon] || Globe;
              return (
                <AnimatedCard key={i} delay={i * 0.08} className="group">
                  <div className={`card-hover p-7 rounded-2xl flex items-center gap-6 ${
                    dark ? 'bg-white/4 border border-white/8 hover:border-blue-500/30' : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                  }`}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
                    >
                      <Icon size={20} color="#2563EB" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        {career.title}
                      </h3>
                      <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{career.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold hidden sm:block"
                        style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.25)', fontFamily: 'Sora, sans-serif' }}
                      >
                        Open
                      </span>
                      <Link to="/contact" className="btn-primary py-2.5 px-5 text-sm">
                        <span>Apply</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl px-8 sm:px-16 py-20 text-center"
            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1e3a5f 50%, #0B1220 100%)' }}>
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.25) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'Sora, sans-serif' }}>
                Don't See Your Role?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                We're always open to talented people. Send us your CV and portfolio and let's talk.
              </p>
              <Link to="/contact" className="btn-primary text-base py-4 px-8">
                <span>Send Us Your CV</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
