import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onSelect, dark = true }) {
  const isConcept = project.status.toLowerCase().includes('concept');
  const isHiradProject = project.status.toLowerCase().includes('hirad') && !isConcept;

  const statusBadgeStyle = isConcept
    ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
    : isHiradProject
      ? 'bg-blue-950/80 text-cyan-300 border border-cyan-500/40'
      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40';

  return (
    <div
      className={`card-hover rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${
        dark
          ? 'bg-[#0E1726] border border-white/10 hover:border-blue-500/40 shadow-xl shadow-black/20'
          : 'bg-white border border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl'
      }`}
    >
      {/* ─── Large Visual Preview ─────────────────────────────── */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-[#070D18] flex items-center justify-center group">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Real Screenshot Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-transparent to-black/30 pointer-events-none" />

        {/* Status Badge — top left */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${statusBadgeStyle}`}
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {project.status}
          </span>
        </div>

        {/* Tag — top right */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-md bg-black/60 text-gray-200 border border-white/15"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {project.tag || 'System'}
          </span>
        </div>
      </div>

      {/* ─── Card Body ────────────────────────────────────────── */}
      <div className="p-6 sm:p-7 flex flex-col flex-1">

        {/* Category */}
        <div
          className="text-[11px] font-bold text-[#06B6D4] mb-2 uppercase tracking-wider"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {project.category}
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-xl mb-3 leading-snug ${dark ? 'text-white' : 'text-[#0B1220]'}`}
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-5 flex-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.shortDescription}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                  dark
                    ? 'bg-white/5 text-gray-300 border border-white/10'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className={`px-2 py-1 rounded-md text-[11px] ${
                  dark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer: CTA */}
        <div
          className="pt-4 border-t flex items-center justify-between"
          style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#06B6D4] transition-colors group/btn"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span>View Case Study</span>
            <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
          </button>

          {project.caseStudy?.gallery && project.caseStudy.gallery.length > 1 && (
            <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {project.caseStudy.gallery.length} screenshots
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
