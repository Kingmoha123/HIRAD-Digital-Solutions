import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { HiradLogo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { BRAND } from '../data/brand';

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const footerLinks = {
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'Mobile App Development', href: '/services' },
    { label: 'Business Systems', href: '/services' },
    { label: 'UI/UX & Branding', href: '/services' },
  ],
  Solutions: [
    { label: 'Business Digitization', href: '/solutions' },
    { label: 'Operations Management', href: '/solutions' },
    { label: 'Customer Management', href: '/solutions' },
    { label: 'Workflow Automation', href: '/solutions' },
  ],
  Company: [
    { label: 'About HIRAD', href: '/about' },
    { label: 'Portfolio & Case Studies', href: '/projects' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer className={`border-t ${dark ? 'bg-[#080E1A] border-white/8' : 'bg-[#F4F7FB] border-gray-200'}`}>
      {/* CTA Banner */}
      <div className={`border-b ${dark ? 'border-white/8' : 'border-gray-200'}`}>
        <div className="container-custom footer-cta">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Have an Idea? Let's Build It.
              </h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Turn your vision into a real digital product with HIRAD.
              </p>
            </div>
            <Link to="/contact" className="btn-primary flex-shrink-0">
              <span>Start a Project</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom footer-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <HiradLogo dark={dark} size="md" />
            </Link>
            <p className={`text-sm leading-relaxed mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {BRAND.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: LinkedinIcon, href: BRAND.social.linkedin, label: 'LinkedIn' },
                { Icon: Globe, href: BRAND.social.twitter, label: 'Twitter' },
                { Icon: InstagramIcon, href: BRAND.social.instagram, label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`p-2 rounded-lg transition-all duration-200 ${dark
                    ? 'text-gray-500 hover:text-white hover:bg-white/10'
                    : 'text-gray-400 hover:text-[#2563EB] hover:bg-blue-50'
                    }`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className={`font-bold text-sm uppercase tracking-widest mb-5 ${dark ? 'text-gray-200' : 'text-gray-800'
                  }`}
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-all duration-200 hover:translate-x-1 inline-block ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4
              className={`font-bold text-sm uppercase tracking-widest mb-5 ${dark ? 'text-gray-200' : 'text-gray-800'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{BRAND.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#2563EB] flex-shrink-0" />
                <a
                  href={`mailto:${BRAND.email}`}
                  className={`text-sm transition-colors ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#2563EB] flex-shrink-0" />
                <a
                  href={`tel:${BRAND.phone}`}
                  className={`text-sm transition-colors ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {BRAND.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${dark ? 'border-white/8' : 'border-gray-200'}`}>
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2026 HIRAD Digital Solutions. All rights reserved.
          </p>
          <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}
            style={{ letterSpacing: '0.15em', fontFamily: 'Sora, sans-serif' }}
          >
            TECHNOLOGY · CREATIVITY · GROWTH
          </p>
        </div>
      </div>
    </footer>
  );
}
