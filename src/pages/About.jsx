import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { SectionHeading, AnimatedCard } from '../components/UI';

const timeline = [
  { year: '2019', title: 'Company Founded', desc: 'HIRAD was established in Mogadishu with a vision to build Somalia\'s digital future.' },
  { year: '2020', title: 'First Products Launched', desc: 'Delivered our first web and mobile solutions to local businesses and organizations.' },
  { year: '2022', title: 'Team Growth', desc: 'Expanded our team of engineers, designers, and digital strategists.' },
  { year: '2024', title: 'Enterprise Solutions', desc: 'Began delivering enterprise-level software and digital transformation projects.' },
  { year: '2026', title: 'Growing Impact', desc: 'Serving 30+ clients across Somalia with modern digital solutions.' },
];

const team = [
  { name: 'Hirad Leadership', role: 'Founder & CEO', initial: 'H', color: '#2563EB' },
  { name: 'Technology Lead', role: 'CTO', initial: 'T', color: '#06B6D4' },
  { name: 'Design Director', role: 'Head of Design', initial: 'D', color: '#8B5CF6' },
  { name: 'Dev Lead', role: 'Lead Engineer', initial: 'L', color: '#2563EB' },
];

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
              WHO WE ARE
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              About <span className="gradient-text">HIRAD</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              A technology company built in Somalia, for Somalia — and the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Our Mission
              </h2>
              <p className={`text-base leading-relaxed mb-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                HIRAD Digital Solutions is a technology company focused on creating practical, scalable, and innovative digital solutions. We are a team of engineers, designers, and digital strategists committed to building meaningful technology.
              </p>
              <p className={`text-base leading-relaxed mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Our goal is to help businesses and organizations use technology to solve real problems, improve efficiency, and create better digital experiences — with a deep understanding of the East African market and a global standard of quality.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Founded', value: '2019' },
                  { label: 'Location', value: 'Mogadishu, SO' },
                  { label: 'Team', value: '10+ Experts' },
                  { label: 'Projects', value: '50+ Delivered' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-[#F4F7FB] border border-gray-100'}`}
                  >
                    <div className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.05em' }}>
                      {item.label}
                    </div>
                    <div
                      className={`text-xl font-bold ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Values */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-8 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Our Values
              </h2>
              <div className="space-y-5">
                {[
                  { icon: '⚡', title: 'Innovation', desc: 'We continuously explore better ways to solve digital challenges, staying ahead of technology trends.' },
                  { icon: '🛡️', title: 'Quality', desc: 'We focus on reliable, scalable, and user-friendly solutions that stand the test of time.' },
                  { icon: '🤝', title: 'Partnership', desc: 'We work closely with our clients from idea to implementation — and beyond.' },
                  { icon: '🌍', title: 'Impact', desc: 'Our technology is designed to create real, measurable positive impact in businesses and communities.' },
                ].map((val, i) => (
                  <div
                    key={i}
                    className={`flex gap-5 p-5 rounded-xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}
                  >
                    <span className="text-2xl flex-shrink-0">{val.icon}</span>
                    <div>
                      <h4
                        className={`font-bold text-base mb-1 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {val.title}
                      </h4>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom">
          <SectionHeading badge="Our Journey" title="HIRAD Through the Years" subtitle="From a small team with big ideas to a growing technology company." />
          <div className="mt-16 relative">
            {/* Center line */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px"
              style={{ background: dark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.15)' }}
            />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <div className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                      <div
                        className={`p-6 rounded-2xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}
                      >
                        <span
                          className="gradient-text text-sm font-bold mb-2 block"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.year}
                        </span>
                        <h3
                          className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.title}
                        </h3>
                        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                    {/* Dot */}
                    <div
                      className="hidden md:flex w-5 h-5 rounded-full flex-shrink-0 relative z-10"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}
                    />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="The Team" title="The People Behind HIRAD" subtitle="A dedicated group of engineers, designers, and strategists." />
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div
                  className={`text-center p-8 rounded-2xl card-hover ${dark ? 'bg-white/4 border border-white/8' : 'bg-[#F4F7FB] border border-gray-100'}`}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                    style={{ background: `linear-gradient(135deg, ${member.color}, #06B6D4)`, fontFamily: 'Sora, sans-serif' }}
                  >
                    {member.initial}
                  </div>
                  <h4
                    className={`font-bold text-sm ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {member.name}
                  </h4>
                  <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{member.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-padding ${dark ? 'bg-[#080E1A]' : 'bg-[#F4F7FB]'}`}>
        <div className="container-custom text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-5 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Ready to Work With Us?
          </h2>
          <p className={`text-lg mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Let's build something meaningful together.
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
