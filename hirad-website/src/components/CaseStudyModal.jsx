import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Layers, Cpu, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CaseStudyModal({ project, isOpen, onClose, dark = true }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

  const gallery = project?.caseStudy?.gallery || (project ? [{ url: project.image, caption: project.title }] : []);

  const prevImage = useCallback(() => {
    setActiveImageIndex((i) => (i > 0 ? i - 1 : gallery.length - 1));
  }, [gallery.length]);

  const nextImage = useCallback(() => {
    setActiveImageIndex((i) => (i < gallery.length - 1 ? i + 1 : 0));
  }, [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, prevImage, nextImage]);

  if (!isOpen || !project || !project.caseStudy) return null;

  const { caseStudy } = project;
  const currentImage = gallery[activeImageIndex] || gallery[0];
  const isConcept = project.status.toLowerCase().includes('concept');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1220]/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative w-full max-w-4xl my-auto rounded-3xl overflow-hidden shadow-2xl border ${
            dark ? 'bg-[#0E1726] border-white/10 text-white' : 'bg-white border-gray-200 text-[#0B1220]'
          }`}
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* ─── Sticky Header ─── */}
          <div
            className={`sticky top-0 z-20 flex items-center justify-between px-5 sm:px-7 py-4 border-b backdrop-blur-md ${
              dark ? 'bg-[#0E1726]/92 border-white/10' : 'bg-white/92 border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                  isConcept
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {project.status}
              </span>
              <span className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {project.category}
              </span>
            </div>

            <button
              onClick={onClose}
              className={`flex-shrink-0 p-2 rounded-xl transition-colors ${
                dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* ─── Scrollable Body ─── */}
          <div className="overflow-y-auto p-5 sm:p-8 space-y-8">

            {/* Title & Overview */}
            <div>
              <h2
                className={`text-2xl sm:text-3xl font-bold mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {project.title}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {caseStudy.overview}
              </p>

              {isConcept && (
                <div
                  className={`mt-4 p-4 rounded-xl text-xs sm:text-sm border flex items-start gap-3 ${
                    dark
                      ? 'bg-purple-950/30 border-purple-800/40 text-purple-200'
                      : 'bg-purple-50 border-purple-200 text-purple-900'
                  }`}
                >
                  <span className="text-base flex-shrink-0">💡</span>
                  <div>
                    <span className="font-semibold">Project Notice:</span> This is a HIRAD concept and demonstration project created to illustrate practical application architecture and interface workflows.
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                    style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.08em' }}
                  >
                    Project Visuals & Screenshots
                  </h3>
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {activeImageIndex + 1} / {gallery.length}
                  </span>
                </div>

                {/* Main Image */}
                <div
                  className={`relative rounded-2xl overflow-hidden border ${
                    dark ? 'bg-[#090E17] border-white/10' : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  <img
                    key={currentImage.url}
                    src={currentImage.url}
                    alt={currentImage.caption || project.title}
                    className="w-full max-h-[380px] sm:max-h-[420px] object-contain mx-auto block"
                  />

                  {/* Prev/Next navigation */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-sm"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-sm"
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {currentImage.caption && (
                    <div
                      className={`p-3 text-xs text-center border-t ${
                        dark ? 'bg-black/40 text-gray-300 border-white/5' : 'bg-white/80 text-gray-700 border-gray-200'
                      }`}
                    >
                      {currentImage.caption}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5" style={{ scrollbarWidth: 'thin' }}>
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#2563EB] shadow-md scale-105'
                            : dark
                              ? 'border-white/10 opacity-55 hover:opacity-100'
                              : 'border-gray-200 opacity-55 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Screenshot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-5">
              <div
                className={`p-5 sm:p-6 rounded-2xl border ${
                  dark ? 'bg-white/4 border-white/8' : 'bg-[#F4F7FB] border-gray-100'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                >
                  <Layers size={20} />
                </div>
                <h4
                  className={`text-base font-bold mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  The Challenge
                </h4>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {caseStudy.challenge}
                </p>
              </div>

              <div
                className={`p-5 sm:p-6 rounded-2xl border ${
                  dark ? 'bg-white/4 border-white/8' : 'bg-[#F4F7FB] border-gray-100'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                >
                  <Cpu size={20} />
                </div>
                <h4
                  className={`text-base font-bold mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Our Solution
                </h4>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            {/* Key Features */}
            {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
              <div
                className={`p-5 sm:p-7 rounded-2xl border ${
                  dark ? 'bg-white/3 border-white/8' : 'bg-[#F8FAFC] border-gray-100'
                }`}
              >
                <h4
                  className={`text-sm font-bold mb-4 uppercase tracking-wider ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                  style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.06em' }}
                >
                  Key System Features
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {caseStudy.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#06B6D4] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies & Project Type */}
            <div className="grid sm:grid-cols-2 gap-5 pt-1">
              <div>
                <h4
                  className={`text-xs font-bold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.08em' }}
                >
                  Technologies & Architecture
                </h4>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        dark
                          ? 'bg-blue-950/40 text-blue-300 border-blue-800/40'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4
                  className={`text-xs font-bold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.08em' }}
                >
                  Project Classification
                </h4>
                <div
                  className={`p-3.5 rounded-xl border text-sm ${
                    dark ? 'bg-white/4 border-white/8 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{caseStudy.projectType}</div>
                  <div className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Category: {project.category}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sticky Footer ─── */}
          <div
            className={`sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-t backdrop-blur-md ${
              dark ? 'bg-[#0E1726]/95 border-white/10' : 'bg-white/95 border-gray-100'
            }`}
          >
            <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Interested in a similar digital solution?
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="btn-secondary text-xs sm:text-sm py-2 px-4">
                Close
              </button>
              <Link to="/contact" onClick={onClose} className="btn-primary text-xs sm:text-sm py-2 px-5">
                <span>Discuss Your Project</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
