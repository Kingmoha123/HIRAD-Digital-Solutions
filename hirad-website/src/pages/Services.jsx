import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  Smartphone,
  Building2,
  Layers,
  Palette,
  Video,
  Megaphone,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { SERVICES } from '../data/brand';

const ICON_MAP = {
  Globe,
  Smartphone,
  Building2,
  Layers,
  Palette,
  Video,
  Megaphone,
  Cpu,
};

export default function Services() {
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
              WHAT WE PROVIDE
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              Practical, end-to-end digital services tailored to your technical and operational requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (8 Core Services) */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${service.color}15`,
                        border: `1px solid ${service.color}35`,
                      }}
                    >
                      <Icon size={22} style={{ color: service.color }} />
                    </div>

                    <h3
                      className={`font-bold text-lg mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {service.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-5 flex-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {service.description}
                    </p>

                    {/* Deliverables / Capabilities */}
                    {service.deliverables && (
                      <div className="space-y-1.5 pt-4 border-t mb-5" style={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                        {service.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 size={13} className="text-[#06B6D4] flex-shrink-0" />
                            <span className={dark ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#06B6D4] transition-colors"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Inquire About This Service <ArrowRight size={13} />
                    </Link>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engagement Flow */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom text-center">
          <SectionHeading
            badge="Working Together"
            title="How We Collaborate With Clients"
            subtitle="Clear communication, well-defined milestones, and reliable technical delivery from day one."
          />
          <div className="mt-12">
            <Link to="/contact" className="btn-primary text-base py-4 px-8">
              <span>Discuss Your Requirements</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
