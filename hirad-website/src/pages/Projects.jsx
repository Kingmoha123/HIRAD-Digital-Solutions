import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';
import ProjectCard from '../components/ProjectCard';
import CaseStudyModal from '../components/CaseStudyModal';
import { PROJECTS } from '../data/brand';

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'hirad', label: 'HIRAD Systems' },
  { id: 'client', label: 'Client Projects' },
];

export default function Projects() {
  const { dark } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hirad') return p.status.toLowerCase().includes('hirad') && !p.status.toLowerCase().includes('concept');
    if (activeFilter === 'client') return p.status.toLowerCase().includes('client');
    if (activeFilter === 'concept') return p.status.toLowerCase().includes('concept');
    return true;
  });

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* ─── PAGE HERO ─────────────────────────────────────────── */}
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
              PORTFOLIO & CASE STUDIES
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Featured <span className="gradient-text">Work & Systems</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore our software systems and verified digital platforms. Every project features authentic visual previews and detailed architectural case studies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER TABS ───────────────────────────────────────── */}
      <section className="pt-10 pb-4">
        <div className="container-custom flex justify-center">
          <div
            className={`inline-flex p-1.5 rounded-2xl border gap-1 ${
              dark ? 'bg-[#0E1726] border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
          >
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeFilter === cat.id
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : dark
                      ? 'text-gray-400 hover:text-white hover:bg-white/8'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS GRID ─────────────────────────────────────── */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, i) => (
                <AnimatedCard key={project.id} delay={i * 0.08}>
                  <ProjectCard
                    project={project}
                    onSelect={(proj) => setSelectedProject(proj)}
                    dark={dark}
                  />
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── AUTHENTICITY COMMITMENT ───────────────────────────── */}
      <section className={`py-14 border-y ${dark ? 'bg-[#080E1A] border-white/8' : 'bg-[#F4F7FB] border-gray-200'}`}>
        <div className="container-custom">
          <div className={`flex flex-col sm:flex-row items-center gap-6 max-w-3xl mx-auto p-7 rounded-2xl border ${
            dark ? 'bg-white/4 border-white/8' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className="flex-shrink-0">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}
              >
                <ShieldCheck size={26} color="#2563EB" />
              </div>
            </div>
            <div>
              <h3
                className={`text-base font-bold mb-1.5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Our Commitment to Authenticity
              </h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                At HIRAD, we prioritize credibility and transparent representation. We do not invent client rosters, artificial metrics, or fabricated testimonials. Every portfolio piece presented is a genuine HIRAD product or clearly labeled concept demonstration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className={`section-padding ${dark ? 'bg-[#0B1220]' : 'bg-white'}`}>
        <div className="container-custom text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Have a Project in Mind?
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Let's turn your idea into a practical, modern digital product with clean engineering and dedicated support.
          </p>
          <Link to="/contact" className="btn-primary text-base py-4 px-8">
            <span>Start Your Project</span>
            <ArrowRight size={18} />
          </Link>
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
