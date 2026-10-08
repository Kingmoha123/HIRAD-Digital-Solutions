import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, CheckCircle2, Globe } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { BRAND } from '../data/brand';

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const services = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Software Development',
  'Digital Transformation',
  'IT Consulting',
  'Other',
];

export default function Contact() {
  const { dark } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappMessage = [
      'New HIRAD project enquiry',
      '',
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || 'Not provided'}`,
      `Company: ${formData.company || 'Not provided'}`,
      `Service: ${formData.service || 'Not selected'}`,
      '',
      'Project details:',
      formData.message,
    ].join('\n');

    window.open(
      `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setSubmitted(true);
  };

  return (
    <div className={dark ? 'bg-[#0B1220] text-white' : 'bg-white text-[#0B1220]'}>
      {/* Hero */}
      <section className="contact-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0" style={{
          background: dark
            ? 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(37,99,235,0.05) 0%, transparent 70%)',
        }} />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${dark ? 'bg-blue-950/60 text-[#06B6D4] border border-cyan-800/40' : 'bg-blue-50 text-[#2563EB] border border-blue-100'
              }`} style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.1em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              CONTACT US
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${dark ? 'text-white' : 'text-[#0B1220]'}`}
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
              Let's Talk About Your <span className="gradient-text">Project</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              We'd love to hear about your project. Fill in the form below or reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding contact-content">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8 xl:gap-10">
            {/* Info Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Contact cards */}
              {[
                { Icon: MapPin, label: 'Our Location', value: BRAND.location, color: '#2563EB' },
                { Icon: Mail, label: 'Email Us', value: BRAND.email, color: '#06B6D4' },
                { Icon: Phone, label: 'Call Us', value: BRAND.phone, color: '#2563EB' },
              ].map(({ Icon, label, value, color }) => (
                <div
                  key={label}
                  className={`flex gap-5 p-6 rounded-2xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-[#F4F7FB] border border-gray-100'}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                      style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.05em' }}>
                      {label}
                    </div>
                    <div className={`font-semibold ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className={`p-6 rounded-2xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-[#F4F7FB] border border-gray-100'}`}>
                <h4 className={`font-bold text-sm mb-4 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                  style={{ fontFamily: 'Sora, sans-serif' }}>
                  Follow HIRAD
                </h4>
                <div className="flex gap-3">
                  {[
                    { Icon: LinkedinIcon, href: '#' },
                    { Icon: Globe, href: '#' },
                    { Icon: InstagramIcon, href: '#' },
                  ].map(({ Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${dark
                          ? 'bg-white/8 text-gray-400 hover:bg-blue-600 hover:text-white'
                          : 'bg-white text-gray-400 hover:bg-blue-600 hover:text-white border border-gray-100'
                        }`}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map visual */}
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ height: '200px', background: dark ? '#0F1A2E' : '#EFF6FF', border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(37,99,235,0.12)' }}
              >
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', boxShadow: '0 0 30px rgba(37,99,235,0.5)' }}
                  >
                    <MapPin size={20} color="white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      Mogadishu, Somalia
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      2°02′N, 45°20′E
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div
                  className={`rounded-3xl p-12 text-center ${dark ? 'bg-white/4 border border-white/8' : 'bg-[#F4F7FB] border border-gray-100'}`}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
                  >
                    <CheckCircle2 size={36} color="white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    WhatsApp Is Ready
                  </h3>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-500'} mb-8`}>
                    Your project details are ready to send to the HIRAD team on WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className={`rounded-3xl p-8 sm:p-10 ${dark ? 'bg-white/4 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}
                >
                  <h3 className={`text-xl font-bold mb-6 ${dark ? 'text-white' : 'text-[#0B1220]'}`}
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    Tell Us About Your Project
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Full Name */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark
                            ? 'bg-white/6 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-white/8'
                            : 'bg-[#F4F7FB] border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
                          }`}
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark
                            ? 'bg-white/6 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-white/8'
                            : 'bg-[#F4F7FB] border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
                          }`}
                      />
                    </div>
                    {/* Phone */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+252 ..."
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark
                            ? 'bg-white/6 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-white/8'
                            : 'bg-[#F4F7FB] border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
                          }`}
                      />
                    </div>
                    {/* Company */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        Company / Organization
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your organization"
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark
                            ? 'bg-white/6 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-white/8'
                            : 'bg-[#F4F7FB] border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div className="mb-5">
                    <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      Service Interested In
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`contact-service-select w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark
                          ? 'bg-white/6 border-white/10 text-white focus:border-blue-500 focus:bg-white/8'
                          : 'bg-[#F4F7FB] border-gray-200 text-gray-900 focus:border-blue-400 focus:bg-white'
                        }`}
                    >
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="mb-7">
                    <label className={`block text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      Project Details *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border resize-none ${dark
                          ? 'bg-white/6 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-white/8'
                          : 'bg-[#F4F7FB] border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
                        }`}
                    />
                  </div>

                  <button
                    id="contact-submit"
                    type="submit"
                    className="btn-primary w-full justify-center text-base py-4"
                  >
                    <span>Send Message</span>
                    <Send size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
