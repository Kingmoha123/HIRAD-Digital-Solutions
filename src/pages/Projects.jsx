import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import { PROJECTS } from '../data/brand';

const PROJECT_ICONS = ['🚦', '💊', '🏋️'];

const allProjects = [
  ...PROJECTS,
  {
    id: 'school-mgmt',
    title: 'School Management System',
    category: 'Featured Concept',
    tag: 'Education',
    description: 'Full-featured school administration platform with student records, attendance, and grading.',
    color: '#2563EB',
  },
  {
    id: 'restaurant',
    title: 'Restaurant POS System',
    category: 'Selected Project',
    tag: 'Business',
    description: 'Point-of-sale system with inventory management, order tracking, and sales reporting.',
    color: '#06B6D4',
  },
  {
    id: 'delivery',
    title: 'Delivery Tracking App',
    category: 'Featured Concept',
    tag: 'Logistics',
    description: 'Real-time delivery tracking and fleet management for logistics businesses.',
    color: '#8B5CF6',
  },
];

const allIcons = ['🚦', '💊', '🏋️', '🏫', '🍽️', '📦'];

export default function Projects() {
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
              PORTFOLIO
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
              Our <span className="gradient-text">Recent Work</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              A selection of our featured digital concepts and completed solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project, i) => (
              <AnimatedCard key={project.id} delay={i * 0.08} className="group">
                <div className={`card-hover rounded-2xl overflow-hidden ${
                  dark ? 'bg-[#0F1A2E] border border-white/8' : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  {/* Visual */}
                  <div
                    className="relative h-52 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}11)` }}
                  >
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                      backgroundSize: '25px 25px',
                    }} />
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `rgba(255,255,255,${dark ? 0.07 : 0.9})`,
                        border: `2px solid ${project.color}40`,
                        boxShadow: `0 8px 30px ${project.color}30`,
                      }}
                    >
                      {allIcons[i % allIcons.length]}
                    </div>
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}40`, fontFamily: 'Sora, sans-serif' }}
                    >
                      {project.category}
                    </div>
                    <div
                      className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs"
                      style={{
                        background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                        color: dark ? '#94A3B8' : '#64748B',
                      }}
                    >
                      {project.tag}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <h3 className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      {project.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {project.description}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                      style={{ color: project.color, fontFamily: 'Sora, sans-serif' }}
                    >
                      View Project <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}>
            Have a Project in Mind?
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Let's turn your idea into a polished digital product.
          </p>
          <Link to="/contact" className="btn-primary text-base py-4 px-8">
            <span>Start Your Project</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
