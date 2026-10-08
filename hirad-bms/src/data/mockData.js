// ============================================================
// HIRAD BMS — Mock Data (replaces a real database for demo)
// ============================================================

// ---- Users & Auth ----
export const mockUsers = [
  {
    id: 'u1',
    name: 'Ahmad Karimi',
    email: 'admin@hirad.io',
    password: 'admin123',
    role: 'super_admin',
    avatar: null,
    position: 'CEO & Founder',
    department: 'Management',
    status: 'active',
    joinDate: '2022-01-01',
    phone: '+98 912 000 0001',
  },
  {
    id: 'u2',
    name: 'Sara Hosseini',
    email: 'manager@hirad.io',
    password: 'manager123',
    role: 'admin',
    avatar: null,
    position: 'Operations Manager',
    department: 'Management',
    status: 'active',
    joinDate: '2022-03-15',
    phone: '+98 912 000 0002',
  },
  {
    id: 'u3',
    name: 'Reza Ahmadi',
    email: 'pm@hirad.io',
    password: 'pm123',
    role: 'project_manager',
    avatar: null,
    position: 'Project Manager',
    department: 'Development',
    status: 'active',
    joinDate: '2022-06-01',
    phone: '+98 912 000 0003',
  },
  {
    id: 'u4',
    name: 'Mina Tehrani',
    email: 'dev@hirad.io',
    password: 'dev123',
    role: 'developer',
    avatar: null,
    position: 'Senior Developer',
    department: 'Development',
    status: 'active',
    joinDate: '2023-01-10',
    phone: '+98 912 000 0004',
  },
  {
    id: 'u5',
    name: 'Davar Mohammadi',
    email: 'designer@hirad.io',
    password: 'design123',
    role: 'designer',
    avatar: null,
    position: 'UI/UX Designer',
    department: 'Design',
    status: 'active',
    joinDate: '2023-04-01',
    phone: '+98 912 000 0005',
  },
  {
    id: 'u6',
    name: 'Leila Rashidi',
    email: 'finance@hirad.io',
    password: 'finance123',
    role: 'accountant',
    avatar: null,
    position: 'Accountant',
    department: 'Finance',
    status: 'active',
    joinDate: '2022-09-01',
    phone: '+98 912 000 0006',
  },
];

// ---- Clients ----
export const mockClients = [
  {
    id: 'c1',
    name: 'Mehdi Alavi',
    company: 'TechVision Co.',
    email: 'mehdi@techvision.ir',
    phone: '+98 21 8800 0001',
    address: 'Tehran, Iran',
    website: 'https://techvision.ir',
    industry: 'Technology',
    status: 'active',
    totalRevenue: 45000,
    activeProjects: 2,
    createdAt: '2023-02-15',
    notes: 'Long-term strategic client',
  },
  {
    id: 'c2',
    name: 'Neda Sadeghi',
    company: 'BrightRetail',
    email: 'neda@brightretail.ir',
    phone: '+98 21 8800 0002',
    address: 'Isfahan, Iran',
    website: 'https://brightretail.ir',
    industry: 'Retail',
    status: 'active',
    totalRevenue: 28000,
    activeProjects: 1,
    createdAt: '2023-05-20',
    notes: 'E-commerce focused',
  },
  {
    id: 'c3',
    name: 'Farhad Moradi',
    company: 'HealthPlus Clinic',
    email: 'farhad@healthplus.ir',
    phone: '+98 21 8800 0003',
    address: 'Mashhad, Iran',
    website: 'https://healthplus.ir',
    industry: 'Healthcare',
    status: 'active',
    totalRevenue: 18500,
    activeProjects: 1,
    createdAt: '2024-01-10',
    notes: 'Healthcare portal project',
  },
  {
    id: 'c4',
    name: 'Zahra Karimi',
    company: 'EduWorld Institute',
    email: 'zahra@eduworld.ir',
    phone: '+98 21 8800 0004',
    address: 'Shiraz, Iran',
    website: 'https://eduworld.ir',
    industry: 'Education',
    status: 'inactive',
    totalRevenue: 12000,
    activeProjects: 0,
    createdAt: '2023-08-01',
    notes: 'LMS project completed',
  },
  {
    id: 'c5',
    name: 'Kamran Nazari',
    company: 'FinServ Group',
    email: 'kamran@finserv.ir',
    phone: '+98 21 8800 0005',
    address: 'Tehran, Iran',
    website: 'https://finserv.ir',
    industry: 'Finance',
    status: 'prospect',
    totalRevenue: 0,
    activeProjects: 0,
    createdAt: '2024-09-15',
    notes: 'In proposal stage',
  },
  {
    id: 'c6',
    name: 'Parisa Ebrahimi',
    company: 'StartupHub',
    email: 'parisa@startuphub.ir',
    phone: '+98 21 8800 0006',
    address: 'Tehran, Iran',
    website: 'https://startuphub.ir',
    industry: 'Technology',
    status: 'lead',
    totalRevenue: 0,
    activeProjects: 0,
    createdAt: '2024-10-01',
    notes: 'Referral from TechVision',
  },
];

// ---- Projects ----
export const mockProjects = [
  {
    id: 'p1',
    name: 'TechVision Corporate Portal',
    client: 'c1',
    clientName: 'TechVision Co.',
    service: 'Web Development',
    description: 'Full corporate intranet portal with employee self-service, document management, and reporting.',
    manager: 'u3',
    managerName: 'Reza Ahmadi',
    team: ['u3', 'u4', 'u5'],
    status: 'active',
    priority: 'high',
    progress: 72,
    startDate: '2024-06-01',
    deadline: '2024-12-15',
    budget: 22000,
    spent: 14500,
    createdAt: '2024-05-20',
  },
  {
    id: 'p2',
    name: 'BrightRetail E-Commerce Platform',
    client: 'c2',
    clientName: 'BrightRetail',
    service: 'Web Development',
    description: 'Modern e-commerce platform with inventory, orders, and multi-payment gateway integration.',
    manager: 'u3',
    managerName: 'Reza Ahmadi',
    team: ['u3', 'u4'],
    status: 'active',
    priority: 'high',
    progress: 45,
    startDate: '2024-08-01',
    deadline: '2025-01-31',
    budget: 18000,
    spent: 7200,
    createdAt: '2024-07-15',
  },
  {
    id: 'p3',
    name: 'HealthPlus Patient App',
    client: 'c3',
    clientName: 'HealthPlus Clinic',
    service: 'Mobile App Development',
    description: 'React Native app for patient appointments, records, and teleconsultation.',
    manager: 'u3',
    managerName: 'Reza Ahmadi',
    team: ['u3', 'u4', 'u5'],
    status: 'planning',
    priority: 'medium',
    progress: 15,
    startDate: '2024-10-01',
    deadline: '2025-04-30',
    budget: 15000,
    spent: 1200,
    createdAt: '2024-09-20',
  },
  {
    id: 'p4',
    name: 'EduWorld LMS Platform',
    client: 'c4',
    clientName: 'EduWorld Institute',
    service: 'Software Development',
    description: 'Learning management system with course builder, quizzes, and student tracking.',
    manager: 'u3',
    managerName: 'Reza Ahmadi',
    team: ['u3', 'u4'],
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2023-09-01',
    deadline: '2024-03-31',
    budget: 12000,
    spent: 11800,
    createdAt: '2023-08-20',
  },
  {
    id: 'p5',
    name: 'HIRAD Website Redesign',
    client: null,
    clientName: 'Internal',
    service: 'UI/UX Design',
    description: 'Complete redesign of HIRAD public website with new branding and animations.',
    manager: 'u2',
    managerName: 'Sara Hosseini',
    team: ['u4', 'u5'],
    status: 'completed',
    priority: 'low',
    progress: 100,
    startDate: '2024-03-01',
    deadline: '2024-07-15',
    budget: 5000,
    spent: 4800,
    createdAt: '2024-02-15',
  },
  {
    id: 'p6',
    name: 'FinServ Digital Transformation',
    client: 'c5',
    clientName: 'FinServ Group',
    service: 'Digital Transformation',
    description: 'End-to-end digital transformation strategy and implementation.',
    manager: 'u3',
    managerName: 'Reza Ahmadi',
    team: ['u3'],
    status: 'on_hold',
    priority: 'low',
    progress: 5,
    startDate: '2024-10-15',
    deadline: '2025-06-30',
    budget: 30000,
    spent: 800,
    createdAt: '2024-10-01',
  },
];

// ---- Tasks ----
export const mockTasks = [
  { id: 't1', name: 'Design Homepage Mockups', project: 'p1', projectName: 'TechVision Corporate Portal', assignee: 'u5', assigneeName: 'Davar Mohammadi', priority: 'high', status: 'completed', startDate: '2024-06-05', dueDate: '2024-06-20', estimatedHours: 16, actualHours: 18, description: 'Create wireframes and final mockups for the homepage sections.' },
  { id: 't2', name: 'Backend API Development', project: 'p1', projectName: 'TechVision Corporate Portal', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'high', status: 'in_progress', startDate: '2024-07-01', dueDate: '2024-10-30', estimatedHours: 120, actualHours: 80, description: 'Develop all REST APIs for the portal backend.' },
  { id: 't3', name: 'Frontend Integration', project: 'p1', projectName: 'TechVision Corporate Portal', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'medium', status: 'in_progress', startDate: '2024-08-15', dueDate: '2024-11-15', estimatedHours: 80, actualHours: 35, description: 'Connect React frontend with backend APIs.' },
  { id: 't4', name: 'Product Catalog Design', project: 'p2', projectName: 'BrightRetail E-Commerce Platform', assignee: 'u5', assigneeName: 'Davar Mohammadi', priority: 'medium', status: 'review', startDate: '2024-08-10', dueDate: '2024-09-30', estimatedHours: 24, actualHours: 22, description: 'Design product listing and detail pages.' },
  { id: 't5', name: 'Payment Gateway Integration', project: 'p2', projectName: 'BrightRetail E-Commerce Platform', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'high', status: 'todo', startDate: '2024-10-15', dueDate: '2024-11-30', estimatedHours: 40, actualHours: 0, description: 'Integrate Zarinpal and Stripe payment gateways.' },
  { id: 't6', name: 'Requirements Gathering', project: 'p3', projectName: 'HealthPlus Patient App', assignee: 'u3', assigneeName: 'Reza Ahmadi', priority: 'high', status: 'completed', startDate: '2024-10-01', dueDate: '2024-10-15', estimatedHours: 8, actualHours: 10, description: 'Gather all requirements from client stakeholders.' },
  { id: 't7', name: 'App Architecture Design', project: 'p3', projectName: 'HealthPlus Patient App', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'high', status: 'in_progress', startDate: '2024-10-16', dueDate: '2024-10-31', estimatedHours: 20, actualHours: 8, description: 'Design the technical architecture for the mobile app.' },
  { id: 't8', name: 'SEO Optimization', project: 'p5', projectName: 'HIRAD Website Redesign', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'low', status: 'completed', startDate: '2024-07-01', dueDate: '2024-07-15', estimatedHours: 10, actualHours: 9, description: 'Optimize all pages for search engines.' },
  { id: 't9', name: 'Client Discovery Call', project: 'p6', projectName: 'FinServ Digital Transformation', assignee: 'u3', assigneeName: 'Reza Ahmadi', priority: 'urgent', status: 'todo', startDate: '2024-10-20', dueDate: '2024-10-25', estimatedHours: 2, actualHours: 0, description: 'Initial discovery call to understand FinServ requirements.' },
  { id: 't10', name: 'Database Schema Design', project: 'p1', projectName: 'TechVision Corporate Portal', assignee: 'u4', assigneeName: 'Mina Tehrani', priority: 'high', status: 'completed', startDate: '2024-06-15', dueDate: '2024-06-30', estimatedHours: 12, actualHours: 14, description: 'Design MongoDB schema for all entities.' },
];

// ---- Leads ----
export const mockLeads = [
  { id: 'l1', name: 'Hassan Ahmadzadeh', company: 'CloudSystems Ltd', email: 'hassan@cloudsys.ir', phone: '+98 912 111 0001', service: 'Cloud Solutions', source: 'Website', status: 'new', assignee: 'u2', estimatedValue: 15000, createdAt: '2024-10-01', notes: 'Interested in cloud migration services' },
  { id: 'l2', name: 'Maryam Taheri', company: 'MediaFlow', email: 'maryam@mediaflow.ir', phone: '+98 912 111 0002', service: 'Web Development', source: 'Referral', status: 'contacted', assignee: 'u3', estimatedValue: 8000, createdAt: '2024-09-20', notes: 'Needs full website redesign' },
  { id: 'l3', name: 'Ali Shafiei', company: 'AgriTech Solutions', email: 'ali@agritech.ir', phone: '+98 912 111 0003', service: 'Mobile App', source: 'LinkedIn', status: 'proposal', assignee: 'u3', estimatedValue: 20000, createdAt: '2024-09-10', notes: 'Proposal submitted, waiting for response' },
  { id: 'l4', name: 'Bahar Montazeri', company: 'EcoEnergy', email: 'bahar@ecoenergy.ir', phone: '+98 912 111 0004', service: 'UI/UX Design', source: 'Instagram', status: 'negotiation', assignee: 'u2', estimatedValue: 5000, createdAt: '2024-09-01', notes: 'Negotiating price for dashboard redesign' },
  { id: 'l5', name: 'Dariush Kiani', company: 'SmartHome Ltd', email: 'dariush@smarthome.ir', phone: '+98 912 111 0005', service: 'IoT Solutions', source: 'Conference', status: 'won', assignee: 'u2', estimatedValue: 35000, createdAt: '2024-08-15', notes: 'Contract signed, converting to client' },
  { id: 'l6', name: 'Samin Rahmani', company: 'FashionHub', email: 'samin@fashionhub.ir', phone: '+98 912 111 0006', service: 'E-Commerce', source: 'Cold Outreach', status: 'lost', assignee: 'u3', estimatedValue: 12000, createdAt: '2024-08-01', notes: 'Went with competitor, budget constraints' },
];

// ---- Services ----
export const mockServices = [
  { id: 's1', name: 'Web Development', description: 'Full-stack web application development using modern technologies like React, Node.js, and MongoDB.', startingPrice: 5000, status: 'active', deliveryTime: '4-12 weeks', category: 'Development' },
  { id: 's2', name: 'Mobile App Development', description: 'Cross-platform mobile applications built with React Native for iOS and Android.', startingPrice: 8000, status: 'active', deliveryTime: '8-20 weeks', category: 'Development' },
  { id: 's3', name: 'UI/UX Design', description: 'User-centered design solutions including wireframes, prototypes, and design systems.', startingPrice: 2000, status: 'active', deliveryTime: '2-6 weeks', category: 'Design' },
  { id: 's4', name: 'Software Development', description: 'Custom software solutions including APIs, microservices, and enterprise applications.', startingPrice: 10000, status: 'active', deliveryTime: '8-24 weeks', category: 'Development' },
  { id: 's5', name: 'Digital Transformation', description: 'End-to-end digital transformation consulting and implementation for businesses.', startingPrice: 15000, status: 'active', deliveryTime: '12-52 weeks', category: 'Consulting' },
  { id: 's6', name: 'IT Consulting', description: 'Expert technology consulting, architecture review, and digital strategy services.', startingPrice: 1500, status: 'active', deliveryTime: '1-4 weeks', category: 'Consulting' },
  { id: 's7', name: 'Cloud Solutions', description: 'Cloud infrastructure setup, migration, and optimization on AWS, GCP, and Azure.', startingPrice: 3000, status: 'active', deliveryTime: '2-8 weeks', category: 'Infrastructure' },
  { id: 's8', name: 'SEO & Digital Marketing', description: 'Search engine optimization and digital marketing strategy for online businesses.', startingPrice: 800, status: 'inactive', deliveryTime: 'Ongoing', category: 'Marketing' },
];

// ---- Invoices ----
export const mockInvoices = [
  { id: 'inv1', number: 'INV-2024-001', client: 'c1', clientName: 'TechVision Co.', project: 'p1', projectName: 'TechVision Corporate Portal', issueDate: '2024-07-01', dueDate: '2024-07-31', items: [{ description: 'Backend API Development - Phase 1', qty: 1, unitPrice: 8000 }], tax: 9, discount: 0, total: 8720, status: 'paid', paidDate: '2024-07-28' },
  { id: 'inv2', number: 'INV-2024-002', client: 'c1', clientName: 'TechVision Co.', project: 'p1', projectName: 'TechVision Corporate Portal', issueDate: '2024-09-01', dueDate: '2024-09-30', items: [{ description: 'Frontend Development - Phase 2', qty: 1, unitPrice: 6000 }], tax: 9, discount: 5, total: 6234, status: 'paid', paidDate: '2024-09-25' },
  { id: 'inv3', number: 'INV-2024-003', client: 'c2', clientName: 'BrightRetail', project: 'p2', projectName: 'BrightRetail E-Commerce Platform', issueDate: '2024-09-15', dueDate: '2024-10-15', items: [{ description: 'E-Commerce Platform - Phase 1', qty: 1, unitPrice: 9000 }], tax: 9, discount: 0, total: 9810, status: 'sent', paidDate: null },
  { id: 'inv4', number: 'INV-2024-004', client: 'c3', clientName: 'HealthPlus Clinic', project: 'p3', projectName: 'HealthPlus Patient App', issueDate: '2024-10-01', dueDate: '2024-10-31', items: [{ description: 'Discovery & Architecture Phase', qty: 1, unitPrice: 3000 }], tax: 9, discount: 0, total: 3270, status: 'draft', paidDate: null },
  { id: 'inv5', number: 'INV-2024-005', client: 'c1', clientName: 'TechVision Co.', project: 'p1', projectName: 'TechVision Corporate Portal', issueDate: '2024-08-01', dueDate: '2024-08-31', items: [{ description: 'UI Design & Prototyping', qty: 1, unitPrice: 4000 }], tax: 9, discount: 0, total: 4360, status: 'overdue', paidDate: null },
  { id: 'inv6', number: 'INV-2024-006', client: 'c4', clientName: 'EduWorld Institute', project: 'p4', projectName: 'EduWorld LMS Platform', issueDate: '2024-03-01', dueDate: '2024-03-31', items: [{ description: 'LMS Final Delivery', qty: 1, unitPrice: 6000 }], tax: 9, discount: 10, total: 5886, status: 'paid', paidDate: '2024-04-05' },
];

// ---- Payments ----
export const mockPayments = [
  { id: 'pay1', paymentId: 'PAY-001', client: 'c1', clientName: 'TechVision Co.', invoice: 'inv1', invoiceNumber: 'INV-2024-001', amount: 8720, method: 'bank_transfer', currency: 'USD', date: '2024-07-28', reference: 'TXN-88001', notes: 'Phase 1 payment received' },
  { id: 'pay2', paymentId: 'PAY-002', client: 'c1', clientName: 'TechVision Co.', invoice: 'inv2', invoiceNumber: 'INV-2024-002', amount: 6234, method: 'bank_transfer', currency: 'USD', date: '2024-09-25', reference: 'TXN-88045', notes: 'Phase 2 payment received' },
  { id: 'pay3', paymentId: 'PAY-003', client: 'c4', clientName: 'EduWorld Institute', invoice: 'inv6', invoiceNumber: 'INV-2024-006', amount: 5886, method: 'mobile_money', currency: 'USD', date: '2024-04-05', reference: 'TXN-77012', notes: 'Final project payment' },
];

// ---- Expenses ----
export const mockExpenses = [
  { id: 'e1', title: 'Office Rent - October 2024', category: 'office', amount: 2500, date: '2024-10-01', method: 'bank_transfer', description: 'Monthly office rental fee', receipt: null, addedBy: 'u6', addedByName: 'Leila Rashidi' },
  { id: 'e2', title: 'AWS Cloud Hosting', category: 'software', amount: 450, date: '2024-10-01', method: 'card', description: 'AWS monthly hosting for client projects', receipt: null, addedBy: 'u6', addedByName: 'Leila Rashidi' },
  { id: 'e3', title: 'Figma Pro Licenses x3', category: 'software', amount: 135, date: '2024-10-01', method: 'card', description: 'Monthly Figma team licenses', receipt: null, addedBy: 'u6', addedByName: 'Leila Rashidi' },
  { id: 'e4', title: 'Internet Service', category: 'internet', amount: 180, date: '2024-10-01', method: 'bank_transfer', description: 'Monthly fiber internet subscription', receipt: null, addedBy: 'u6', addedByName: 'Leila Rashidi' },
  { id: 'e5', title: 'Client Meeting Transportation', category: 'transportation', amount: 75, date: '2024-09-28', method: 'cash', description: 'Taxi for client meeting at TechVision HQ', receipt: null, addedBy: 'u3', addedByName: 'Reza Ahmadi' },
  { id: 'e6', title: 'Social Media Ads - September', category: 'marketing', amount: 600, date: '2024-09-30', method: 'card', description: 'LinkedIn and Instagram promotional campaigns', receipt: null, addedBy: 'u2', addedByName: 'Sara Hosseini' },
  { id: 'e7', title: 'New Development Laptop', category: 'equipment', amount: 1800, date: '2024-09-15', method: 'bank_transfer', description: 'MacBook Pro for new developer onboarding', receipt: null, addedBy: 'u1', addedByName: 'Ahmad Karimi' },
];

// ---- Meetings ----
export const mockMeetings = [
  { id: 'm1', title: 'TechVision Project Review', type: 'client', client: 'c1', clientName: 'TechVision Co.', date: '2024-10-10', time: '10:00', duration: 60, participants: ['u1', 'u3'], location: 'Google Meet', link: 'https://meet.google.com/xxx', agenda: 'Review project progress and discuss Phase 3 requirements', notes: 'Client is happy with progress', actionItems: [], status: 'completed' },
  { id: 'm2', title: 'Weekly Team Standup', type: 'internal', client: null, clientName: null, date: '2024-10-14', time: '09:00', duration: 30, participants: ['u1', 'u2', 'u3', 'u4', 'u5'], location: 'Office - Conference Room A', link: null, agenda: 'Weekly progress updates from all team members', notes: '', actionItems: [], status: 'upcoming' },
  { id: 'm3', title: 'BrightRetail Kickoff Meeting', type: 'client', client: 'c2', clientName: 'BrightRetail', date: '2024-10-15', time: '14:00', duration: 90, participants: ['u2', 'u3', 'u5'], location: 'Zoom', link: 'https://zoom.us/xxx', agenda: 'Project kickoff - discuss scope, timeline, and milestones', notes: '', actionItems: [], status: 'upcoming' },
  { id: 'm4', title: 'HealthPlus Requirements Session', type: 'client', client: 'c3', clientName: 'HealthPlus Clinic', date: '2024-10-20', time: '11:00', duration: 120, participants: ['u3', 'u4'], location: 'Client Office', link: null, agenda: 'Detailed requirements gathering for patient app', notes: '', actionItems: [], status: 'upcoming' },
];

// ---- Proposals ----
export const mockProposals = [
  { id: 'pr1', number: 'PROP-2024-001', client: 'c5', clientName: 'FinServ Group', project: null, services: ['Digital Transformation', 'IT Consulting'], description: 'Comprehensive digital transformation strategy for FinServ Group.', price: 32000, validUntil: '2024-11-30', status: 'sent', createdAt: '2024-10-01', createdBy: 'u2' },
  { id: 'pr2', number: 'PROP-2024-002', client: 'c6', clientName: 'StartupHub', project: null, services: ['Web Development'], description: 'Modern startup platform with team collaboration and project management features.', price: 14000, validUntil: '2024-11-15', status: 'draft', createdAt: '2024-10-03', createdBy: 'u3' },
  { id: 'pr3', number: 'PROP-2024-003', client: 'c2', clientName: 'BrightRetail', project: 'p2', services: ['Web Development', 'UI/UX Design'], description: 'Phase 2 expansion including mobile app and advanced analytics.', price: 22000, validUntil: '2024-12-31', status: 'accepted', createdAt: '2024-08-01', createdBy: 'u2' },
];

// ---- Contracts ----
export const mockContracts = [
  { id: 'con1', number: 'CON-2024-001', client: 'c1', clientName: 'TechVision Co.', project: 'p1', projectName: 'TechVision Corporate Portal', startDate: '2024-06-01', endDate: '2024-12-15', value: 22000, status: 'active', documentUrl: null, createdAt: '2024-05-25' },
  { id: 'con2', number: 'CON-2024-002', client: 'c2', clientName: 'BrightRetail', project: 'p2', projectName: 'BrightRetail E-Commerce Platform', startDate: '2024-08-01', endDate: '2025-01-31', value: 18000, status: 'active', documentUrl: null, createdAt: '2024-07-20' },
  { id: 'con3', number: 'CON-2024-003', client: 'c3', clientName: 'HealthPlus Clinic', project: 'p3', projectName: 'HealthPlus Patient App', startDate: '2024-10-01', endDate: '2025-04-30', value: 15000, status: 'active', documentUrl: null, createdAt: '2024-09-25' },
  { id: 'con4', number: 'CON-2024-004', client: 'c4', clientName: 'EduWorld Institute', project: 'p4', projectName: 'EduWorld LMS Platform', startDate: '2023-09-01', endDate: '2024-03-31', value: 12000, status: 'expired', documentUrl: null, createdAt: '2023-08-25' },
];

// ---- Employees ----
export const mockEmployees = [
  { id: 'emp1', userId: 'u1', name: 'Ahmad Karimi', email: 'admin@hirad.io', phone: '+98 912 000 0001', position: 'CEO & Founder', department: 'Management', joinDate: '2022-01-01', status: 'active', skills: ['Leadership', 'Strategy', 'Business Development'], avatar: null },
  { id: 'emp2', userId: 'u2', name: 'Sara Hosseini', email: 'manager@hirad.io', phone: '+98 912 000 0002', position: 'Operations Manager', department: 'Management', joinDate: '2022-03-15', status: 'active', skills: ['Operations', 'HR', 'Client Relations'], avatar: null },
  { id: 'emp3', userId: 'u3', name: 'Reza Ahmadi', email: 'pm@hirad.io', phone: '+98 912 000 0003', position: 'Project Manager', department: 'Development', joinDate: '2022-06-01', status: 'active', skills: ['Project Management', 'Agile', 'Scrum', 'Client Communication'], avatar: null },
  { id: 'emp4', userId: 'u4', name: 'Mina Tehrani', email: 'dev@hirad.io', phone: '+98 912 000 0004', position: 'Senior Developer', department: 'Development', joinDate: '2023-01-10', status: 'active', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'], avatar: null },
  { id: 'emp5', userId: 'u5', name: 'Davar Mohammadi', email: 'designer@hirad.io', phone: '+98 912 000 0005', position: 'UI/UX Designer', department: 'Design', joinDate: '2023-04-01', status: 'active', skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'], avatar: null },
  { id: 'emp6', userId: 'u6', name: 'Leila Rashidi', email: 'finance@hirad.io', phone: '+98 912 000 0006', position: 'Accountant', department: 'Finance', joinDate: '2022-09-01', status: 'active', skills: ['Accounting', 'Financial Reporting', 'Invoicing'], avatar: null },
];

// ---- Notifications ----
export const mockNotifications = [
  { id: 'n1', type: 'task', title: 'New Task Assigned', message: 'You have been assigned to "Payment Gateway Integration"', read: false, createdAt: '2024-10-04T14:30:00', link: '/tasks' },
  { id: 'n2', type: 'invoice', title: 'Invoice Overdue', message: 'INV-2024-005 from TechVision Co. is overdue', read: false, createdAt: '2024-10-03T09:00:00', link: '/finance/invoices' },
  { id: 'n3', type: 'meeting', title: 'Meeting Tomorrow', message: 'Weekly Team Standup at 09:00 tomorrow', read: false, createdAt: '2024-10-03T17:00:00', link: '/meetings' },
  { id: 'n4', type: 'payment', title: 'Payment Received', message: 'Payment of $6,234 received from TechVision Co.', read: true, createdAt: '2024-09-25T10:15:00', link: '/finance/payments' },
  { id: 'n5', type: 'proposal', title: 'Proposal Accepted', message: 'BrightRetail accepted PROP-2024-003', read: true, createdAt: '2024-09-10T11:00:00', link: '/proposals' },
];

// ---- Activity Log ----
export const mockActivityLog = [
  { id: 'a1', user: 'u1', userName: 'Ahmad Karimi', action: 'created', entity: 'client', entityName: 'FinServ Group', date: '2024-10-01T08:30:00' },
  { id: 'a2', user: 'u3', userName: 'Reza Ahmadi', action: 'created', entity: 'project', entityName: 'HealthPlus Patient App', date: '2024-09-20T10:00:00' },
  { id: 'a3', user: 'u5', userName: 'Davar Mohammadi', action: 'completed', entity: 'task', entityName: 'Design Homepage Mockups', date: '2024-09-18T16:00:00' },
  { id: 'a4', user: 'u6', userName: 'Leila Rashidi', action: 'created', entity: 'invoice', entityName: 'INV-2024-004', date: '2024-10-01T09:00:00' },
  { id: 'a5', user: 'u6', userName: 'Leila Rashidi', action: 'recorded', entity: 'payment', entityName: 'PAY-002 from TechVision Co.', date: '2024-09-25T10:15:00' },
  { id: 'a6', user: 'u2', userName: 'Sara Hosseini', action: 'scheduled', entity: 'meeting', entityName: 'BrightRetail Kickoff Meeting', date: '2024-10-03T14:00:00' },
  { id: 'a7', user: 'u2', userName: 'Sara Hosseini', action: 'sent', entity: 'proposal', entityName: 'PROP-2024-001 to FinServ Group', date: '2024-10-01T11:00:00' },
];

// ---- Revenue Chart Data ----
export const mockRevenueData = [
  { month: 'Jan', revenue: 8200, expenses: 5100 },
  { month: 'Feb', revenue: 9500, expenses: 4800 },
  { month: 'Mar', revenue: 7800, expenses: 5500 },
  { month: 'Apr', revenue: 11200, expenses: 5200 },
  { month: 'May', revenue: 9800, expenses: 4900 },
  { month: 'Jun', revenue: 13500, expenses: 6200 },
  { month: 'Jul', revenue: 14200, expenses: 5800 },
  { month: 'Aug', revenue: 12800, expenses: 6100 },
  { month: 'Sep', revenue: 15600, expenses: 5900 },
  { month: 'Oct', revenue: 11200, expenses: 5740 },
  { month: 'Nov', revenue: 0, expenses: 0 },
  { month: 'Dec', revenue: 0, expenses: 0 },
];

// ---- Documents ----
export const mockDocuments = [
  { id: 'd1', name: 'TechVision Project Brief.pdf', category: 'project_files', project: 'p1', client: 'c1', size: '2.4 MB', type: 'pdf', uploadedBy: 'u3', uploadedByName: 'Reza Ahmadi', uploadedAt: '2024-06-01', url: '#' },
  { id: 'd2', name: 'BrightRetail Contract.pdf', category: 'contracts', project: 'p2', client: 'c2', size: '1.1 MB', type: 'pdf', uploadedBy: 'u1', uploadedByName: 'Ahmad Karimi', uploadedAt: '2024-08-01', url: '#' },
  { id: 'd3', name: 'HealthPlus Requirements.docx', category: 'project_files', project: 'p3', client: 'c3', size: '540 KB', type: 'docx', uploadedBy: 'u3', uploadedByName: 'Reza Ahmadi', uploadedAt: '2024-10-01', url: '#' },
  { id: 'd4', name: 'HIRAD Company Profile 2024.pdf', category: 'company', project: null, client: null, size: '5.2 MB', type: 'pdf', uploadedBy: 'u1', uploadedByName: 'Ahmad Karimi', uploadedAt: '2024-01-15', url: '#' },
  { id: 'd5', name: 'FinServ Proposal.pdf', category: 'proposals', project: null, client: 'c5', size: '820 KB', type: 'pdf', uploadedBy: 'u2', uploadedByName: 'Sara Hosseini', uploadedAt: '2024-10-01', url: '#' },
  { id: 'd6', name: 'EduWorld Invoice Dec.pdf', category: 'invoices', project: 'p4', client: 'c4', size: '310 KB', type: 'pdf', uploadedBy: 'u6', uploadedByName: 'Leila Rashidi', uploadedAt: '2024-03-01', url: '#' },
];

// ---- Time Entries ----
export const mockTimeEntries = [
  { id: 'te1', user: 'u4', userName: 'Mina Tehrani', project: 'p1', projectName: 'TechVision Corporate Portal', task: 't2', taskName: 'Backend API Development', description: 'Working on auth module', hours: 6.5, date: '2024-10-04' },
  { id: 'te2', user: 'u5', userName: 'Davar Mohammadi', project: 'p2', projectName: 'BrightRetail E-Commerce Platform', task: 't4', taskName: 'Product Catalog Design', description: 'Finalizing product card designs', hours: 4, date: '2024-10-04' },
  { id: 'te3', user: 'u3', userName: 'Reza Ahmadi', project: 'p3', projectName: 'HealthPlus Patient App', task: 't7', taskName: 'App Architecture Design', description: 'Architecture review session', hours: 3, date: '2024-10-04' },
  { id: 'te4', user: 'u4', userName: 'Mina Tehrani', project: 'p1', projectName: 'TechVision Corporate Portal', task: 't3', taskName: 'Frontend Integration', description: 'API integration for dashboard components', hours: 7, date: '2024-10-03' },
  { id: 'te5', user: 'u5', userName: 'Davar Mohammadi', project: 'p1', projectName: 'TechVision Corporate Portal', task: 't1', taskName: 'Design Homepage Mockups', description: 'Final revisions and export', hours: 5, date: '2024-10-02' },
];

// Summary stats for dashboard
export const dashboardStats = {
  totalClients: 6,
  activeProjects: 3,
  pendingTasks: 4,
  completedTasks: 4,
  monthlyRevenue: 11200,
  pendingPayments: 13080,
  monthlyExpenses: 5740,
  activeEmployees: 6,
};

export const ROLES = {
  super_admin: { label: 'Super Admin', color: 'purple' },
  admin: { label: 'Admin / Manager', color: 'blue' },
  project_manager: { label: 'Project Manager', color: 'cyan' },
  developer: { label: 'Developer', color: 'green' },
  designer: { label: 'UI/UX Designer', color: 'pink' },
  accountant: { label: 'Accountant', color: 'amber' },
  employee: { label: 'Employee', color: 'gray' },
};

export const PROJECT_STATUSES = {
  planning: { label: 'Planning', color: 'info' },
  active: { label: 'Active', color: 'active' },
  on_hold: { label: 'On Hold', color: 'warning' },
  review: { label: 'Review', color: 'purple' },
  completed: { label: 'Completed', color: 'cyan' },
  cancelled: { label: 'Cancelled', color: 'danger' },
};

export const TASK_STATUSES = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'info' },
  review: { label: 'Review', color: 'warning' },
  completed: { label: 'Completed', color: 'active' },
};

export const TASK_PRIORITIES = {
  low: { label: 'Low', color: 'gray' },
  medium: { label: 'Medium', color: 'info' },
  high: { label: 'High', color: 'warning' },
  urgent: { label: 'Urgent', color: 'danger' },
};

export const INVOICE_STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  sent: { label: 'Sent', color: 'info' },
  partially_paid: { label: 'Partially Paid', color: 'warning' },
  paid: { label: 'Paid', color: 'active' },
  overdue: { label: 'Overdue', color: 'danger' },
  cancelled: { label: 'Cancelled', color: 'gray' },
};

export const LEAD_STATUSES = {
  new: { label: 'New', color: 'info' },
  contacted: { label: 'Contacted', color: 'purple' },
  proposal: { label: 'Proposal', color: 'warning' },
  negotiation: { label: 'Negotiation', color: 'cyan' },
  won: { label: 'Won', color: 'active' },
  lost: { label: 'Lost', color: 'danger' },
};
