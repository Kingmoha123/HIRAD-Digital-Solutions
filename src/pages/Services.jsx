import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Smartphone, Layers, Code2, Zap, BarChart3 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { SERVICES } from '../data/brand';

const ICON_MAP = { Globe, Smartphone, Layers, Code2, Zap, BarChart3 };

export default function Services() {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* Page Hero */}
      <section
        className="page-hero relative overflow-hidden"
      >
        <div className="absolute inset-0 grid-pattern" />
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.1) 0%, transparent 70%)'
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
              WHAT WE DO
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              We build complete digital experiences — from design and development to deployment and long-term support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Globe;
              return (
                <AnimatedCard key={service.id} delay={i * 0.1} className="group">
                  <div
                    className={`card-hover p-10 rounded-2xl h-full flex flex-col ${
                      dark
                        ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                        : 'bg-white border border-gray-100 hover:border-blue-100 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))',
                        border: '1px solid rgba(37,99,235,0.25)',
                        boxShadow: 'group-hover: 0 0 20px rgba(37,99,235,0.3)',
                      }}
                    >
                      <Icon size={24} color="#2563EB" />
                    </div>
                    <h3
                      className={`font-bold text-xl mb-4 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {service.title}
                    </h3>
                    <p className={`text-base flex-1 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description}
                    </p>

                    {/* Capability tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {['Strategy', 'Design', 'Development', 'Launch'].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)',
                            color: '#2563EB',
                            border: '1px solid rgba(37,99,235,0.2)',
                            fontFamily: 'Sora, sans-serif',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/contact"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] group-hover:gap-3 transition-all"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process teaser */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom text-center">
          <SectionHeading badge="Our Approach" title="How We Deliver Results" subtitle="Every engagement starts with deep understanding and ends with a polished, supported product." />
          <div className="mt-12">
            <Link to="/contact" className="btn-primary text-base py-4 px-8">
              <span>Start Working Together</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
