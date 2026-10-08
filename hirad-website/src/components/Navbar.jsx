import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiradLogo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { NAV_LINKS } from '../data/brand';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggleDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? dark
              ? 'bg-[#0B1220]/95 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/20'
              : 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="site-header-inner flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <HiradLogo dark={dark} size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="site-nav hidden lg:flex items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`site-nav-link relative rounded-lg font-semibold transition-all duration-200 font-sora ${
                    isActive(link.href)
                      ? 'text-[#2563EB]'
                      : dark
                        ? 'text-gray-300 hover:text-white hover:bg-white/8'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2563EB]"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleDark}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  dark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/contact" className="btn-primary text-sm">
                <span>Start a Project</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleDark}
                className={`p-2 rounded-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(o => !o)}
                className={`p-2 rounded-lg ${dark ? 'text-white' : 'text-gray-900'}`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-40 ${dark ? 'bg-[#0B1220]' : 'bg-white'}`}
            style={{ paddingTop: '80px' }}
          >
            <div className="container-custom py-8 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className={`block px-5 py-4 rounded-xl text-lg font-semibold transition-all ${
                      isActive(link.href)
                        ? 'text-[#2563EB] bg-blue-50 dark:bg-blue-950/30'
                        : dark
                          ? 'text-gray-200 hover:bg-white/8'
                          : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Link to="/contact" className="btn-primary w-full justify-center text-base py-4">
                  <span>Start a Project</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
