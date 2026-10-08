import { motion } from 'framer-motion';
import { Code2, Palette, Video, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { TEAM_ROLES, TEAM_GROUP_PHOTO } from '../data/brand';
import { SectionHeading, AnimatedCard } from './UI';

const ROLE_ICONS = {
  tech: Code2,
  brand: Palette,
  media: Video,
  operations: Briefcase,
};

export default function TeamSection({ dark = true, showHeading = true, showGroupBanner = true }) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        {showHeading && (
          <SectionHeading
            badge="Meet the Team"
            title="People Behind HIRAD"
            subtitle="HIRAD is driven by dedicated functional leads across engineering, creative design, digital media, and operations."
          />
        )}

        {/* Group Photo Feature Showcase */}
        {showGroupBanner && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mt-12 rounded-3xl p-6 sm:p-8 lg:p-10 border relative overflow-hidden ${
              dark
                ? 'bg-gradient-to-br from-[#0e172a] via-[#0d1c38] to-[#0a1224] border-blue-500/20 shadow-2xl shadow-blue-950/30'
                : 'bg-gradient-to-br from-white via-blue-50/50 to-slate-50 border-blue-100 shadow-xl'
            }`}
          >
            {/* Background subtle glow */}
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
            />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Group Photo Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900">
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={TEAM_GROUP_PHOTO.url}
                      alt={TEAM_GROUP_PHOTO.caption}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Badge on Photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-white text-xs font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                        HIRAD Digital Solutions Team
                      </p>
                    </div>
                    <p className="text-gray-300 text-[11px] mt-0.5">
                      Mogadishu, Somalia
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Info Content */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit mb-4 ${
                    dark ? 'bg-blue-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>ONE UNIFIED COLLECTIVE</span>
                </div>

                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-4 leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Driven by Collaboration & Direct Execution
                </h3>

                <p className={`text-sm sm:text-base leading-relaxed mb-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Behind every system, interface, and media asset at HIRAD is a tight-knit core team working in harmony. We unite full-stack software development, brand identity design, motion media production, and business operations to deliver complete, practical digital solutions.
                </p>

                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Whether building enterprise business platforms like the <strong className={dark ? 'text-cyan-300' : 'text-blue-600'}>HIRAD BMS</strong> or crafting modern hospitality platforms like <strong className={dark ? 'text-amber-300' : 'text-amber-600'}>Al-Cadaala Restaurant</strong>, our team manages every detail in-house.
                </p>

                {/* 4 Pillars List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  {[
                    { title: 'Software Engineering', desc: 'Web apps, APIs & business systems' },
                    { title: 'Graphic & UI/UX Design', desc: 'Brand identities & modern interfaces' },
                    { title: 'Video & Motion Media', desc: 'Promotions, reels & media assets' },
                    { title: 'Business & Operations', desc: 'Problem solving & strategic growth' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className={`text-xs font-semibold ${dark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                          {item.title}
                        </div>
                        <div className={`text-[11px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section divider & title for cards */}
        <div className="mt-14 mb-8 flex items-center justify-between">
          <div>
            <h4
              className={`text-xl sm:text-2xl font-bold ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Meet Our Functional Leads
            </h4>
            <p className={`text-xs sm:text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              The key specialists driving day-to-day creation, code, design, and operations at HIRAD.
            </p>
          </div>
        </div>

        {/* Individual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_ROLES.map((member, i) => {
            const Icon = ROLE_ICONS[member.id] || Briefcase;
            return (
              <AnimatedCard key={member.id} delay={i * 0.1} className="group">
                <div
                  className={`card-hover rounded-2xl h-full flex flex-col overflow-hidden transition-all duration-300 ${
                    dark
                      ? 'bg-white/4 border border-white/8 hover:border-blue-500/30'
                      : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Top Accent Bar */}
                  <div
                    className="h-0.5 w-full transition-opacity duration-300 opacity-70 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, ${member.color}, #06B6D4)` }}
                  />

                  {/* Photo Area */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-900">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: member.photoPosition || '50% 15%' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, ${member.color}ee 0%, rgba(11,18,32,0.4) 40%, transparent 65%)`,
                      }}
                    />

                    {/* Role icon badge */}
                    <div
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ background: `${member.color}dd`, backdropFilter: 'blur(8px)' }}
                    >
                      <Icon size={16} color="#fff" />
                    </div>

                    {/* Name over photo at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8">
                      <p
                        className="text-white font-bold text-sm leading-snug"
                        style={{ fontFamily: 'Sora, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                      >
                        {member.name}
                      </p>
                      <span
                        className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{
                          background: `${member.color}cc`,
                          fontFamily: 'Sora, sans-serif',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Initials badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${member.color}, #06B6D4)`, fontFamily: 'Sora, sans-serif' }}
                      >
                        {member.initials}
                      </div>
                      <span
                        className={`text-[11px] font-semibold tracking-wide uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        HIRAD Core Team
                      </span>
                    </div>

                    {/* Focus */}
                    <p className={`text-xs leading-relaxed flex-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {member.focus}
                    </p>

                    {/* Bottom separator */}
                    <div
                      className="mt-4 pt-3 border-t flex items-center gap-1.5"
                      style={{ borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: member.color }} />
                      <span
                        className={`text-[11px] font-medium tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                        Functional Lead
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
