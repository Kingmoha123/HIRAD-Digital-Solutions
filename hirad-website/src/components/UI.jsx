import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import hiradIcon from '../assets/hirad-icon.svg';

// Section heading with animated badge + title
export function SectionHeading({ badge, title, subtitle, center = true, className = '' }) {
  const { dark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`section-heading ${center ? 'text-center' : ''} ${className}`}
    >
      {badge && (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5 ${
          dark
            ? 'bg-blue-950/50 text-[#06B6D4] border border-cyan-800/40'
            : 'bg-blue-50 text-[#2563EB] border border-blue-100'
        }`} style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          {badge}
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`section-heading__subtitle text-base sm:text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// Animated card wrapper
export function AnimatedCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tech visual for hero section
export function TechVisual({ dark = false }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '480px' }}>
      {/* Outer rotating ring */}
      <div
        className="absolute inset-0 m-auto rounded-full border border-blue-400/15"
        style={{ width: '420px', height: '420px', animation: 'spinSlow 30s linear infinite' }}
      />
      <div
        className="absolute inset-0 m-auto rounded-full border border-cyan-400/10"
        style={{ width: '320px', height: '320px', animation: 'spinSlow 20s linear infinite reverse' }}
      />

      {/* Center glow */}
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(6,182,212,0.12) 60%, transparent 100%)',
          animation: 'pulseSlow 3s ease-in-out infinite',
        }}
      />

      {/* Center H logo large */}
      <div
        className="relative z-10 flex items-center justify-center rounded-2xl"
        style={{
          width: '100px',
          height: '100px',
          background: dark
            ? 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))'
            : 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))',
          border: '2px solid rgba(37,99,235,0.3)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(37,99,235,0.3)',
        }}
      >
        <img src={hiradIcon} alt="HIRAD icon" style={{ width: '58px', height: '58px' }} />
      </div>

      {/* Floating nodes */}
      {[
        { angle: 0, r: 150, label: 'Web Dev', icon: '⬡' },
        { angle: 60, r: 150, label: 'Mobile', icon: '◈' },
        { angle: 120, r: 150, label: 'UI/UX', icon: '◎' },
        { angle: 180, r: 150, label: 'Software', icon: '⬟' },
        { angle: 240, r: 150, label: 'Cloud', icon: '◇' },
        { angle: 300, r: 150, label: 'AI', icon: '⬢' },
      ].map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * node.r;
        const y = Math.sin(rad) * node.r;
        return (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{
                background: dark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(37,99,235,0.25)',
                backdropFilter: 'blur(10px)',
                color: '#2563EB',
                boxShadow: '0 4px 20px rgba(37,99,235,0.15)',
              }}
            >
              {node.icon}
            </div>
            <span
              className="text-xs font-medium whitespace-nowrap"
              style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(11,18,32,0.4)', fontFamily: 'Manrope, sans-serif' }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Connection lines SVG */}
      <svg
        className="absolute inset-0"
        style={{ width: '420px', height: '420px', margin: 'auto', top: 0, bottom: 0, left: 0, right: 0 }}
        viewBox="-210 -210 420 420"
      >
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 150;
          const y = Math.sin(rad) * 150;
          return (
            <line
              key={i}
              x1="0" y1="0"
              x2={x} y2={y}
              stroke={dark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.12)'}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
    </div>
  );
}

// Service icon wrapper
export function ServiceIcon({ icon: Icon, color = '#2563EB', dark = false }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
      style={{
        background: dark
          ? `rgba(37,99,235,0.12)`
          : `rgba(37,99,235,0.08)`,
        border: `1px solid rgba(37,99,235,0.2)`,
      }}
    >
      <Icon size={22} color={color} />
    </div>
  );
}
