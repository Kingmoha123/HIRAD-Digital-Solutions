// HIRAD brand data and constants
export const BRAND = {
  name: 'HIRAD',
  tagline: 'Digital Solutions',
  statement: 'A technology company built in Somalia, for Somalia — and the world.',
  description:
    'HIRAD is a Somali digital solutions company helping businesses and organizations turn ideas into practical digital products and services. HIRAD combines technology, design, media and digital strategy to help businesses improve their digital presence and operations.',
  email: 'info@hirad.so',
  phone: '+252 61 728 6400',
  whatsapp: '252617286400',
  location: 'Mogadishu, Somalia',
  social: {
    linkedin: '#',
    twitter: '#',
    instagram: '#',
    facebook: '#',
  },
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Projects', href: '/projects' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

// Verified Capability Highlights (replacing unverified numerical statistics)
export const CAPABILITY_HIGHLIGHTS = [
  {
    title: 'Technology',
    subtitle: 'Digital products & business systems',
    icon: 'Code2',
    color: '#2563EB',
  },
  {
    title: 'Creative',
    subtitle: 'Branding, design & media',
    icon: 'Palette',
    color: '#06B6D4',
  },
  {
    title: 'Strategy',
    subtitle: 'Digital growth & marketing',
    icon: 'TrendingUp',
    color: '#8B5CF6',
  },
  {
    title: 'Support',
    subtitle: 'Long-term digital partnership',
    icon: 'Headphones',
    color: '#2563EB',
  },
];

// Services: What HIRAD provides
export const SERVICES = [
  {
    id: 'web-dev',
    icon: 'Globe',
    title: 'Web Development',
    description: 'Modern, high-performance web applications and responsive sites tailored to your organizational goals.',
    color: '#2563EB',
    deliverables: ['Custom Web Apps', 'Responsive Portals', 'Performance Optimization', 'API Integration'],
  },
  {
    id: 'mobile-dev',
    icon: 'Smartphone',
    title: 'Mobile App Development',
    description: 'Cross-platform iOS and Android applications designed for intuitive mobile user experiences.',
    color: '#06B6D4',
    deliverables: ['iOS & Android Apps', 'Cross-Platform Frameworks', 'Offline Support', 'Backend Connectivity'],
  },
  {
    id: 'business-systems',
    icon: 'Building2',
    title: 'Business Systems',
    description: 'Centralized management systems and internal platforms that consolidate operations and data.',
    color: '#2563EB',
    deliverables: ['Operations Hubs', 'Inventory & POS', 'Role-Based Access', 'Data Dashboards'],
  },
  {
    id: 'ui-ux',
    icon: 'Layers',
    title: 'UI/UX Design',
    description: 'User-centered interface design, wireframing, and interactive design systems built for clarity.',
    color: '#8B5CF6',
    deliverables: ['Interface Design', 'Design Systems', 'User Research', 'Interactive Prototypes'],
  },
  {
    id: 'branding',
    icon: 'Palette',
    title: 'Branding & Graphic Design',
    description: 'Distinct visual identities, brand guidelines, typography, and professional brand assets.',
    color: '#06B6D4',
    deliverables: ['Brand Guidelines', 'Logo & Identity', 'Print & Digital Collateral', 'Visual Typography'],
  },
  {
    id: 'media-production',
    icon: 'Video',
    title: 'Video & Media Production',
    description: 'Professional visual storytelling, product demonstrations, and engaging commercial multimedia.',
    color: '#8B5CF6',
    deliverables: ['Promotional Videos', 'Product Walkthroughs', 'Photography', 'Motion Graphics'],
  },
  {
    id: 'digital-marketing',
    icon: 'Megaphone',
    title: 'Digital Marketing',
    description: 'Targeted digital campaigns, search presence, and multi-channel strategies to reach customers.',
    color: '#2563EB',
    deliverables: ['Campaign Strategy', 'Audience Growth', 'Social Engagement', 'Analytics & Insights'],
  },
  {
    id: 'business-automation',
    icon: 'Cpu',
    title: 'Business Automation',
    description: 'Streamlined routine processes and automated digital workflows that eliminate repetitive tasks.',
    color: '#06B6D4',
    deliverables: ['Workflow Automation', 'System Integrations', 'Notification Pipelines', 'Digital Forms'],
  },
];

// Solutions: Business problems HIRAD helps solve
export const SOLUTIONS = [
  {
    id: 'business-digitization',
    icon: 'Layers',
    title: 'Business Digitization',
    description: 'Transition paper-based operations and manual records into secure, accessible digital systems.',
    outcome: 'Eliminates lost records and provides instant access to organizational information.',
    color: '#2563EB',
  },
  {
    id: 'operations-management',
    icon: 'Building2',
    title: 'Operations Management',
    description: 'Organize day-to-day business activities, departments, and project deliverables through one hub.',
    outcome: 'Brings cross-functional teams onto a unified operational cadence.',
    color: '#06B6D4',
  },
  {
    id: 'customer-management',
    icon: 'Users',
    title: 'Customer Management',
    description: 'Track client interactions, incoming leads, service inquiries, and ongoing relationships.',
    outcome: 'Builds organized customer records and improves client communication response time.',
    color: '#8B5CF6',
  },
  {
    id: 'online-presence',
    icon: 'Globe',
    title: 'Online Presence',
    description: 'Establish a credible, professional digital footprint that demonstrates trust to potential clients.',
    outcome: 'Equips your business with a polished public presence and clear value communication.',
    color: '#2563EB',
  },
  {
    id: 'workflow-automation',
    icon: 'Cpu',
    title: 'Workflow Automation',
    description: 'Connect internal tools and automate approvals, notifications, and scheduled status reports.',
    outcome: 'Reduces repetitive data entry and minimizes administrative bottlenecks.',
    color: '#06B6D4',
  },
  {
    id: 'digital-growth',
    icon: 'TrendingUp',
    title: 'Digital Growth',
    description: 'Expand your market reach through targeted digital strategy, channels, and modern digital products.',
    outcome: 'Opens new customer touchpoints and scalable revenue opportunities.',
    color: '#8B5CF6',
  },
];

// Verified Portfolio Projects
// Only projects with authentic existing visuals/screenshots are included.
export const PROJECTS = [
  {
    id: 'bms',
    title: 'Business Management System',
    category: 'Business Systems / Web Development',
    status: 'HIRAD Project',
    tag: 'Web Platform',
    shortDescription:
      'A comprehensive business operations platform featuring CRM, project workflows, task delegation, finance tracking, and client management.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Recharts'],
    image: '/images/projects/bms/bms-showcase.jpg',
    color: '#2563EB',
    caseStudy: {
      overview:
        'The HIRAD Business Management System (BMS) is an enterprise web platform developed to unify essential business workflows — including customer relationship management, project task execution, team communication, and financial tracking — under a single, secure environment.',
      challenge:
        'Growing businesses frequently depend on fragmented spreadsheets, separate messaging channels, and disconnected invoicing software. This fragmentation leads to operational silos, missed deadlines, and poor executive visibility.',
      solution:
        'We engineered a responsive, modular web platform with role-based access control, dedicated CRM pipelines, sprint task boards, and structured financial recording to provide teams with complete operational oversight.',
      keyFeatures: [
        'Centralized CRM module to capture leads, track conversions, and maintain client directories',
        'Interactive task board with sprint velocity, priority tags, and deadline monitoring',
        'Financial management supporting invoices, payment recording, and operational expenses',
        'Granular role-based access control (RBAC) ensuring data boundaries for every team member',
        'Executive dashboard with live analytics and visual activity monitoring',
      ],
      technologies: ['React 18', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Recharts', 'REST API'],
      projectType: 'HIRAD Project (Internal Enterprise Product)',
      gallery: [
        {
          url: '/images/projects/bms/bms-showcase.jpg',
          caption: 'HIRAD BMS Operations Dashboard & Live Module View',
        },
      ],
    },
  },
  {
    id: 'pharmacy-mgmt',
    title: 'Pharmacy Management System',
    category: 'Business Systems / Digital Solutions',
    status: 'HIRAD Project',
    tag: 'Digital Solution',
    shortDescription:
      'A specialized digital solution for pharmacy operations — managing medication inventory, point-of-sale cashiering, customer portals, and comprehensive sales reporting.',
    technologies: ['Web Systems', 'Point-of-Sale (POS)', 'Inventory Engine', 'Sales Reporting'],
    image: '/images/projects/pharmacy/admin-dashboard.png',
    color: '#06B6D4',
    caseStudy: {
      overview:
        'A comprehensive pharmacy management application designed to handle drug inventory tracking, rapid point-of-sale customer checkout, prescription records, and financial transaction auditing.',
      challenge:
        'Community pharmacies deal with thousands of stock units, expiration dates, and high transaction volumes during peak hours. Inaccurate manual stock records lead to stockouts and billing errors.',
      solution:
        'Developed a multi-role digital system with distinct interfaces for administrators and dispensing pharmacists, providing real-time stock notifications, search-based lookup, and automated transaction summaries.',
      keyFeatures: [
        'Real-time inventory catalog with stock levels, batch alerts, and quick update controls',
        'Streamlined Point-of-Sale (POS) cashier counter designed for fast counter checkout',
        'Role-scoped workflows for system administrators, dispensary pharmacists, and customers',
        'Detailed sales summaries, daily revenue logs, and stock replenishment alerts',
        'Structured customer profiles and purchase history lookup',
      ],
      technologies: ['Web Architecture', 'Point-of-Sale (POS)', 'Inventory Control', 'Data Analytics', 'Audit Logging'],
      projectType: 'HIRAD Project',
      gallery: [
        {
          url: '/images/projects/pharmacy/admin-dashboard.png',
          caption: 'Pharmacy Administration & Operational Dashboard',
        },
        {
          url: '/images/projects/pharmacy/admin-inventory.png',
          caption: 'Medication Inventory Catalog & Stock Control Interface',
        },
        {
          url: '/images/projects/pharmacy/admin-pos.png',
          caption: 'Point-of-Sale (POS) Cashier Checkout System',
        },
        {
          url: '/images/projects/pharmacy/admin-report.png',
          caption: 'Comprehensive Sales & Inventory Reporting Suite',
        },
        {
          url: '/images/projects/pharmacy/customer-home.png',
          caption: 'Digital Customer Product Portal View',
        },
        {
          url: '/images/projects/pharmacy/admin-user-management.png',
          caption: 'User & Role Management — Admin Interface',
        },
      ],
    },
  },
  {
    id: 'koryaal-fitness',
    title: 'Koriyaal Fitness Website',
    category: 'Web Development / Client Solutions',
    status: 'Client Project',
    tag: 'Web Platform',
    shortDescription:
      'A modern, high-converting brand website and digital platform for Koriyaal Fitness gym in Mogadishu, featuring interactive membership plans, trainer profiles, class schedules, and WhatsApp booking.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Lucide Icons', 'Responsive UI'],
    image: '/images/projects/koryaal/hero-preview.png',
    color: '#8B5CF6',
    caseStudy: {
      overview:
        'Koriyaal Fitness is a premier fitness center and modern gym located in Mogadishu, Somalia. We designed and engineered a dynamic, mobile-first brand website to showcase gym memberships, class timetables, expert trainers, and facilities while driving direct member onboarding via digital channels.',
      challenge:
        'Prospective gym members in Mogadishu often struggled to discover membership tiers, trainer availability, and scheduled workout sessions without physically visiting the facility. The gym needed a modern, trustworthy digital presence that reflects its high-standard equipment and converts online visitors into active members.',
      solution:
        'HIRAD developed a modern, responsive web application equipped with dark/light themes, transparent membership packages, certified trainer profiles, an interactive BMI fitness calculator, and automated WhatsApp inquiry routing for instantaneous client acquisition.',
      keyFeatures: [
        'Engaging hero section with authentic gym visuals and direct call-to-action flows',
        'Transparent membership tiers (Fat Lost & Muscle Gain) with detailed benefit breakdowns',
        'Certified trainers showcase highlighting specializations, experience, and 1-on-1 booking',
        'Weekly class schedules with timings, trainer assignments, and slot capacities',
        'Interactive BMI (Body Mass Index) calculator tool for prospective fitness trainees',
        'Curated facility gallery showcasing strength equipment, cardio floors, and workout studios',
        'Direct WhatsApp integration enabling instant member support and registration inquiries',
      ],
      technologies: ['React 18', 'Vite', 'Tailwind CSS', 'Lucide React', 'Framer Motion', 'REST API'],
      projectType: 'Client Project (Commercial Web Platform)',
      gallery: [
        {
          url: '/images/projects/koryaal/hero-preview.png',
          caption: 'Koriyaal Fitness — High-Impact Homepage & Digital Hero View',
        },
        {
          url: '/images/projects/koryaal/memberships.png',
          caption: 'Interactive Membership Plans & Pricing Comparison',
        },
        {
          url: '/images/projects/koryaal/trainers-classes.png',
          caption: 'Certified Trainers Showcase & Weekly Class Schedule',
        },
        {
          url: '/images/projects/koryaal/contact-footer.png',
          caption: 'Location Map, Opening Hours & Contact Operations',
        },
        {
          url: '/images/projects/koryaal/cardio-floor.jpg',
          caption: 'Modern Cardio Floor & Fitness Facility Showcase',
        },
        {
          url: '/images/projects/koryaal/group-fitness.jpg',
          caption: 'High-Energy Athlete Training & Group Workout Arena',
        },
      ],
    },
  },
  {
    id: 'alcadaala',
    title: 'Al-Cadaala Restaurant Website',
    category: 'Hospitality & Dining / Web Development',
    status: 'Client Project',
    tag: 'Web Platform',
    shortDescription:
      'An elegant digital dining platform for Al-Cadaala Restaurant in Mogadishu, featuring interactive menus, online checkout with EVC Plus & e-Dahab, table reservations, and heritage storytelling.',
    technologies: ['HTML5 / CSS3', 'JavaScript', 'Online Ordering', 'Table Booking', 'Mobile Payments'],
    image: '/images/projects/alcadaala/hero-preview.png',
    color: '#D97706',
    caseStudy: {
      overview:
        'Al-Cadaala is a distinguished Somali fine-dining establishment located on Maka Al-Mukarama Road in Mogadishu. We engineered a responsive, high-end web platform and digital ordering system that merges authentic Somali culinary heritage with modern guest convenience.',
      challenge:
        'Upscale hospitality venues require a digital presence that reflects their fine physical ambience while delivering practical utility: hassle-free table reservations, appetizing visual menu discovery, and frictionless takeaway ordering supported by local mobile payment options.',
      solution:
        'HIRAD created an inviting, mobile-first web experience featuring real-time table booking with session and atmosphere preferences (VIP Family, Main Hall, Terrace), digital menu filtering, cart drawer checkout, and direct mobile money payment options (Hormuud EVC Plus, e-Dahab, and Cash on Delivery).',
      keyFeatures: [
        'Interactive Table Reservation engine with dining session, guest count, time slots, and atmosphere selection (VIP Family, Main Hall, Terrace)',
        'Digital Menu & Ordering system with instant category filtering, search, and real-time cart drawer',
        'Local Mobile Money checkout integration supporting Hormuud EVC Plus, e-Dahab, and Cash on Delivery',
        'Rich culinary storytelling highlighting heritage spices, farm-to-table sourcing from the Shabelle region, and chef profiles',
        'Signature specialties showcase featuring detailed flavor profiles, dietary tags, and pricing',
        'Customer review and testimonial showcase with food critic ratings',
        'Interactive location panel with operating hours, contact channels, and Google Maps routing',
      ],
      technologies: ['Semantic HTML5', 'Vanilla CSS Design System', 'Modern JavaScript (ES6+)', 'Schema.org SEO', 'Local Payment Gateway Integration'],
      projectType: 'Client Project (Hospitality & Fine Dining)',
      gallery: [
        {
          url: '/images/projects/alcadaala/hero-preview.png',
          caption: 'Al-Cadaala — Fine Dining Hero & Digital Experience',
        },
        {
          url: '/images/projects/alcadaala/menu-preview.png',
          caption: 'Digital Menu, Search & Interactive Cart Drawer',
        },
        {
          url: '/images/projects/alcadaala/reserve-preview.png',
          caption: 'Table Reservation System with VIP Room & Atmosphere Selection',
        },
        {
          url: '/images/projects/alcadaala/restaurant-interior.jpg',
          caption: 'Heritage Restaurant Interior & Fine Dining Ambiance',
        },
        {
          url: '/images/projects/alcadaala/lamb-platter.jpg',
          caption: 'Signature Dish — Tender Lamb Platter & Saffron Rice',
        },
        {
          url: '/images/projects/alcadaala/grilled-chicken.jpg',
          caption: 'Heritage Spice Grilled Chicken Specialty',
        },
        {
          url: '/images/projects/alcadaala/somali-chef.jpg',
          caption: 'Executive Chef & Farm-to-Table Culinary Artistry',
        },
      ],
    },
  },
];

// Team Roles: 4 real HIRAD team members
export const TEAM_ROLES = [
  {
    id: 'brand',
    role: 'Graphic Designer',
    name: 'Mohamed Abdullahi Abdi',
    initials: 'MA',
    photo: '/images/team/mohamed-designer.png',
    photoPosition: '50% 15%',
    focus: 'Brand identity systems, UI/UX interaction design, visual systems, and creative direction.',
    color: '#06B6D4',
  },
  {
    id: 'tech',
    role: 'Software Developer',
    name: 'Mohamed Abdullahi Abdikariin',
    initials: 'MA',
    photo: '/images/team/mohamed-developer.png',
    photoPosition: '50% 10%',
    focus: 'Full-stack software engineering, system architecture, and building modern digital products.',
    color: '#2563EB',
  },
  {
    id: 'media',
    role: 'Video Editor & Motion Graphics',
    name: 'Mustaf Abdi Hussein',
    initials: 'MH',
    photo: '/images/team/mustaf-media.png',
    photoPosition: '50% 12%',
    focus: 'Visual storytelling, video production, motion graphics, and commercial media content.',
    color: '#8B5CF6',
  },
  {
    id: 'operations',
    role: 'Business & Operations',
    name: 'Abdiwahaab Adi Hassan',
    initials: 'AH',
    photo: '/images/team/abdiwahaab-ops.png',
    photoPosition: '50% 15%',
    focus: 'Creative problem-solving, business strategy, client operations, and innovative idea development.',
    color: '#D97706',
  },
];

export const TEAM_GROUP_PHOTO = {
  url: '/images/team/team-group.png',
  caption: 'HIRAD Digital Solutions Core Team',
  tagline: 'United by Purpose, Driven by Technology',
};

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'We understand your business, goals, and challenges through focused consultation and technical research.',
    icon: 'Search',
  },
  {
    number: '02',
    title: 'Design',
    description: 'We structure the solution, draft user flows, and establish clean visual directions for the product.',
    icon: 'PenTool',
  },
  {
    number: '03',
    title: 'Develop',
    description: 'We build reliable, responsive, and tested digital solutions using modern industry-standard frameworks.',
    icon: 'Code2',
  },
  {
    number: '04',
    title: 'Deploy & Support',
    description: 'We launch your system smoothly and provide reliable ongoing technical maintenance and support.',
    icon: 'Rocket',
  },
];

export const WHY_HIRAD = [
  {
    icon: 'Cpu',
    title: 'Modern Technology',
    description: 'We build with modern frameworks and clean architecture to ensure longevity and scalability.',
  },
  {
    icon: 'User',
    title: 'User-Centered Design',
    description: 'Every interface is engineered for clarity, usability, and smooth workflows for real people.',
  },
  {
    icon: 'TrendingUp',
    title: 'Scalable Solutions',
    description: 'Our digital tools are built to grow naturally alongside your business operations.',
  },
  {
    icon: 'Shield',
    title: 'Reliable Engineering',
    description: 'We prioritize clean code, thorough testing, and robust security across every deliverable.',
  },
  {
    icon: 'MessageSquare',
    title: 'Transparent Communication',
    description: 'Direct collaboration with clear milestones, regular updates, and honest technical guidance.',
  },
  {
    icon: 'Headphones',
    title: 'Long-Term Support',
    description: 'We act as your dedicated digital partner with continuous updates and technical assistance.',
  },
];

export const CAREERS = [
  { title: 'Software Development', description: 'Full-stack and frontend engineers passionate about building solid digital products.', icon: 'Code2' },
  { title: 'UI/UX Design', description: 'Product designers who create clear, aesthetic, and functional digital experiences.', icon: 'Layers' },
  { title: 'Mobile Development', description: 'Engineers focused on high-performance iOS and Android mobile solutions.', icon: 'Smartphone' },
  { title: 'Digital Strategy', description: 'Strategic minds who understand business workflows, digital presence, and growth.', icon: 'Megaphone' },
  { title: 'Project Coordination', description: 'Organized coordinators who keep timelines crisp and clients satisfied.', icon: 'ClipboardList' },
];
