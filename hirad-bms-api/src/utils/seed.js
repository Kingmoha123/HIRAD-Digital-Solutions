/**
 * HIRAD BMS — Database Seeder
 * Run with: npm run seed
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.model.js';
import Client from '../models/Client.model.js';
import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';
import Lead from '../models/Lead.model.js';
import Invoice from '../models/Invoice.model.js';
import Payment from '../models/Payment.model.js';
import Expense from '../models/Expense.model.js';
import Meeting from '../models/Meeting.model.js';
import Service from '../models/Service.model.js';
import Proposal from '../models/Proposal.model.js';
import Contract from '../models/Contract.model.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log('🌱 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Client.deleteMany({}), Project.deleteMany({}),
    Task.deleteMany({}), Lead.deleteMany({}), Invoice.deleteMany({}),
    Payment.deleteMany({}), Expense.deleteMany({}), Meeting.deleteMany({}),
    Service.deleteMany({}), Proposal.deleteMany({}), Contract.deleteMany({}),
  ]);

  // ── Users ──────────────────────────────────────────────────────────────
  console.log('👥 Seeding users...');
  const users = await User.create([
    { name: 'Ahmad Karimi', email: 'admin@hirad.io', password: 'admin123', role: 'super_admin', position: 'CEO & Founder', department: 'Management', phone: '+252 61 000 0001' },
    { name: 'Fatuma Hassan', email: 'manager@hirad.io', password: 'manager123', role: 'admin', position: 'Operations Manager', department: 'Management', phone: '+252 61 000 0002' },
    { name: 'Bilal Yusuf', email: 'pm@hirad.io', password: 'pm123456', role: 'project_manager', position: 'Project Manager', department: 'Projects', phone: '+252 61 000 0003' },
    { name: 'Nasrin Mohammadi', email: 'dev@hirad.io', password: 'dev123456', role: 'developer', position: 'Senior Developer', department: 'Engineering', phone: '+252 61 000 0004' },
    { name: 'Omar Sheikh', email: 'designer@hirad.io', password: 'design123', role: 'designer', position: 'UI/UX Designer', department: 'Design', phone: '+252 61 000 0005' },
    { name: 'Hodan Ali', email: 'finance@hirad.io', password: 'finance123', role: 'accountant', position: 'Finance Manager', department: 'Finance', phone: '+252 61 000 0006' },

  ]);

  const [ceo, manager, pm, dev, designer, accountant] = users;

  // ── Services ───────────────────────────────────────────────────────────
  console.log('🔧 Seeding services...');
  await Service.create([
    { name: 'Web Development', description: 'Full-stack web app development', category: 'Development', startingPrice: 2500, deliveryTime: '4-12 weeks', features: ['React/Next.js', 'Node.js API', 'MongoDB', 'Deployment'], createdBy: ceo._id },
    { name: 'Mobile App Development', description: 'iOS & Android apps', category: 'Development', startingPrice: 4000, deliveryTime: '8-16 weeks', features: ['React Native', 'Push notifications', 'App Store deployment'], createdBy: ceo._id },
    { name: 'UI/UX Design', description: 'User interface & experience design', category: 'Design', startingPrice: 800, deliveryTime: '2-4 weeks', features: ['Figma designs', 'Prototyping', 'User research'], createdBy: designer._id },
    { name: 'Digital Marketing', description: 'SEO, social media & paid ads', category: 'Marketing', startingPrice: 500, deliveryTime: 'Monthly', features: ['SEO optimization', 'Social media', 'Google Ads'], createdBy: manager._id },
    { name: 'IT Consulting', description: 'Tech strategy & architecture consulting', category: 'Consulting', startingPrice: 150, deliveryTime: 'Hourly/Per project', features: ['Architecture review', 'Tech stack advice', 'Performance audit'], createdBy: ceo._id },
  ]);

  // ── Clients ────────────────────────────────────────────────────────────
  console.log('🏢 Seeding clients...');
  const clients = await Client.create([
    { name: 'Abdi Warsame', company: 'Hormuud Group', email: 'abdi@hormuud.so', phone: '+252 61 111 0001', industry: 'Telecom', status: 'active', totalRevenue: 45000, website: 'https://hormuud.so', createdBy: ceo._id },
    { name: 'Maryan Farah', company: 'Dahabshiil Bank', email: 'maryan@dahabshiil.com', phone: '+252 61 111 0002', industry: 'Banking', status: 'active', totalRevenue: 28000, createdBy: ceo._id },
    { name: 'Khalid Salah', company: 'NaSa Group', email: 'khalid@nasagroup.so', phone: '+252 61 111 0003', industry: 'Real Estate', status: 'active', totalRevenue: 18500, createdBy: pm._id },
    { name: 'Ifrah Duale', company: 'Jubba Airways', email: 'ifrah@jubba.so', phone: '+252 61 111 0004', industry: 'Aviation', status: 'active', totalRevenue: 32000, createdBy: manager._id },
    { name: 'Hassan Omar', company: 'Premier Bank Somalia', email: 'hassan@premierbank.so', phone: '+252 61 111 0005', industry: 'Banking', status: 'prospect', totalRevenue: 0, createdBy: ceo._id },
    { name: 'Amina Jama', company: 'Dara Salaam Bank', email: 'amina@darasalaam.so', phone: '+252 61 111 0006', industry: 'Banking', status: 'active', totalRevenue: 12000, createdBy: manager._id },
  ]);

  const [hormuud, dahabshiil, nasa, jubba, premier, dara] = clients;

  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth();
  const d = (m, day = 15) => new Date(Y, m, day);

  // ── Projects ───────────────────────────────────────────────────────────
  console.log('📁 Seeding projects...');
  const projects = await Project.create([
    { name: 'Hormuud Customer Portal', client: hormuud._id, clientName: hormuud.company, manager: pm._id, managerName: pm.name, team: [pm._id, dev._id, designer._id], status: 'active', priority: 'high', progress: 65, startDate: d(0, 1), deadline: d(11, 30), budget: 25000, spent: 16200, service: 'Web Development', createdBy: ceo._id },
    { name: 'Dahabshiil Mobile App', client: dahabshiil._id, clientName: dahabshiil.company, manager: pm._id, managerName: pm.name, team: [dev._id, designer._id], status: 'active', priority: 'urgent', progress: 40, startDate: d(2, 1), deadline: d(11, 15), budget: 35000, spent: 14000, service: 'Mobile App Development', createdBy: ceo._id },
    { name: 'NaSa Group Website', client: nasa._id, clientName: nasa.company, manager: manager._id, managerName: manager.name, team: [designer._id, dev._id], status: 'active', priority: 'medium', progress: 85, startDate: d(1, 1), deadline: d(10, 31), budget: 8500, spent: 7200, service: 'Web Development', createdBy: pm._id },
    { name: 'Jubba Airways Brand Refresh', client: jubba._id, clientName: jubba.company, manager: manager._id, managerName: manager.name, team: [designer._id], status: 'completed', priority: 'medium', progress: 100, startDate: d(0, 1), deadline: d(3, 30), budget: 12000, spent: 11500, service: 'UI/UX Design', createdBy: ceo._id },
    { name: 'Premier Bank IT Audit', client: premier._id, clientName: premier.company, manager: ceo._id, managerName: ceo.name, team: [dev._id], status: 'planning', priority: 'high', progress: 0, startDate: d(9, 1), deadline: d(11, 31), budget: 6000, spent: 0, service: 'IT Consulting', createdBy: ceo._id },
  ]);

  const [portalProject, mobileProject, websiteProject] = projects;

  // ── Tasks ──────────────────────────────────────────────────────────────
  console.log('✅ Seeding tasks...');
  await Task.create([
    { name: 'Design dashboard wireframes', project: portalProject._id, projectName: portalProject.name, assignee: designer._id, assigneeName: designer.name, status: 'completed', priority: 'high', dueDate: d(M, 5), estimatedHours: 16, actualHours: 14, createdBy: pm._id },
    { name: 'Develop API authentication', project: portalProject._id, projectName: portalProject.name, assignee: dev._id, assigneeName: dev.name, status: 'completed', priority: 'urgent', dueDate: d(M, 8), estimatedHours: 24, actualHours: 22, createdBy: pm._id },
    { name: 'Build customer dashboard UI', project: portalProject._id, projectName: portalProject.name, assignee: dev._id, assigneeName: dev.name, status: 'in_progress', priority: 'high', dueDate: d(M, 20), estimatedHours: 40, createdBy: pm._id },
    { name: 'Mobile app UI screens', project: mobileProject._id, projectName: mobileProject.name, assignee: designer._id, assigneeName: designer.name, status: 'in_progress', priority: 'urgent', dueDate: d(M, 25), estimatedHours: 30, createdBy: pm._id },
    { name: 'Setup React Native project', project: mobileProject._id, projectName: mobileProject.name, assignee: dev._id, assigneeName: dev.name, status: 'completed', priority: 'high', dueDate: d(M, 2), estimatedHours: 8, actualHours: 6, createdBy: pm._id },
    { name: 'Integrate payment gateway', project: mobileProject._id, projectName: mobileProject.name, assignee: dev._id, assigneeName: dev.name, status: 'todo', priority: 'urgent', dueDate: d(Math.min(M + 1, 11), 10), estimatedHours: 20, createdBy: pm._id },
    { name: 'Content upload & SEO', project: websiteProject._id, projectName: websiteProject.name, assignee: manager._id, assigneeName: manager.name, status: 'review', priority: 'medium', dueDate: d(M, 28), estimatedHours: 10, createdBy: pm._id },
    { name: 'QA testing & bug fixes', project: websiteProject._id, projectName: websiteProject.name, assignee: dev._id, assigneeName: dev.name, status: 'in_progress', priority: 'high', dueDate: d(M, 30), estimatedHours: 16, createdBy: pm._id },
  ]);

  // ── Invoices ───────────────────────────────────────────────────────────
  console.log('🧾 Seeding invoices...');
  const invoices = await Invoice.create([
    { number: `INV-${Y}-001`, client: hormuud._id, clientName: hormuud.company, project: portalProject._id, projectName: portalProject.name, items: [{ description: 'Phase 1 — Discovery & Design', qty: 1, unitPrice: 5000 }, { description: 'UI/UX Design Mockups', qty: 1, unitPrice: 3000 }], subtotal: 8000, tax: 0, total: 8000, status: 'paid', issueDate: d(M > 1 ? M - 2 : 0, 1), dueDate: d(M > 1 ? M - 2 : 0, 28), paidDate: d(M > 1 ? M - 2 : 0, 25), createdBy: accountant._id },
    { number: `INV-${Y}-002`, client: dahabshiil._id, clientName: dahabshiil.company, project: mobileProject._id, projectName: mobileProject.name, items: [{ description: 'Mobile App — Sprint 1', qty: 1, unitPrice: 7000 }], subtotal: 7000, tax: 0, total: 7000, status: 'paid', issueDate: d(M > 0 ? M - 1 : 0, 1), dueDate: d(M > 0 ? M - 1 : 0, 28), paidDate: d(M > 0 ? M - 1 : 0, 20), createdBy: accountant._id },
    { number: `INV-${Y}-003`, client: nasa._id, clientName: nasa.company, project: websiteProject._id, projectName: websiteProject.name, items: [{ description: 'Website Development — Full', qty: 1, unitPrice: 8500 }], subtotal: 8500, tax: 0, total: 8500, status: 'sent', issueDate: d(M, 1), dueDate: d(Math.min(M + 1, 11), 1), createdBy: accountant._id },
    { number: `INV-${Y}-004`, client: hormuud._id, clientName: hormuud.company, project: portalProject._id, projectName: portalProject.name, items: [{ description: 'Phase 2 — Backend Development', qty: 1, unitPrice: 12000 }], subtotal: 12000, tax: 0, total: 12000, status: 'overdue', issueDate: d(M > 0 ? M - 1 : 0, 5), dueDate: d(M, 1), createdBy: accountant._id },
    { number: `INV-${Y}-005`, client: jubba._id, clientName: jubba.company, items: [{ description: 'Brand Refresh Project', qty: 1, unitPrice: 12000 }], subtotal: 12000, tax: 0, total: 12000, status: 'paid', issueDate: d(M, 2), dueDate: d(M, 25), paidDate: d(M, 10), createdBy: accountant._id },
  ]);

  // ── Payments ───────────────────────────────────────────────────────────
  console.log('💳 Seeding payments...');
  await Payment.create([
    { paymentId: 'PAY-001', client: hormuud._id, clientName: hormuud.company, invoice: invoices[0]._id, invoiceNumber: `INV-${Y}-001`, amount: 8000, method: 'bank_transfer', date: d(M > 1 ? M - 2 : 0, 25), reference: 'WIRE-HG-001', recordedBy: accountant._id },
    { paymentId: 'PAY-002', client: dahabshiil._id, clientName: dahabshiil.company, invoice: invoices[1]._id, invoiceNumber: `INV-${Y}-002`, amount: 7000, method: 'bank_transfer', date: d(M > 0 ? M - 1 : 0, 20), reference: 'WIRE-DB-001', recordedBy: accountant._id },
    { paymentId: 'PAY-003', client: jubba._id, clientName: jubba.company, invoice: invoices[4]._id, invoiceNumber: `INV-${Y}-005`, amount: 12000, method: 'card', date: d(M, 10), reference: 'CARD-JA-001', recordedBy: accountant._id },
  ]);

  // ── Expenses ───────────────────────────────────────────────────────────
  console.log('💸 Seeding expenses...');
  await Expense.create([
    { title: 'AWS Server Hosting', category: 'software', amount: 280, date: d(M, 1), method: 'card', addedBy: ceo._id, addedByName: ceo.name, approved: true },
    { title: 'Office Internet — Mogadishu', category: 'internet', amount: 150, date: d(M, 5), method: 'cash', addedBy: manager._id, addedByName: manager.name, approved: true },
    { title: 'Figma Pro License', category: 'software', amount: 45, date: d(M, 8), method: 'card', addedBy: designer._id, addedByName: designer.name, approved: true },
    { title: 'Transportation — Client Visits', category: 'transportation', amount: 120, date: d(M, 12), method: 'cash', addedBy: pm._id, addedByName: pm.name, approved: true },
    { title: 'Office Supplies', category: 'office', amount: 95, date: d(M, 15), method: 'cash', addedBy: manager._id, addedByName: manager.name, approved: true },
    { title: 'Marketing Campaign — Meta Ads', category: 'marketing', amount: 500, date: d(M, 18), method: 'card', addedBy: manager._id, addedByName: manager.name, approved: false },
  ]);

  // ── Leads ──────────────────────────────────────────────────────────────
  console.log('🎯 Seeding leads...');
  await Lead.create([
    { name: 'Abdullahi Mohamed', company: 'Somali Telecom', email: 'a.mohamed@somalitelecom.so', phone: '+252 61 222 0001', service: 'Web Development', source: 'LinkedIn', status: 'new', estimatedValue: 15000, assignee: pm._id, createdBy: manager._id },
    { name: 'Khadija Ali', company: 'Red Sea Hotel', email: 'khadija@redsea.so', phone: '+252 61 222 0002', service: 'UI/UX Design', source: 'Referral', status: 'proposal', estimatedValue: 4500, assignee: designer._id, createdBy: ceo._id },
    { name: 'Yusuf Ibrahim', company: 'Golis Telecom', email: 'yusuf@golis.so', phone: '+252 61 222 0003', service: 'Mobile App Development', source: 'Website', status: 'negotiation', estimatedValue: 28000, assignee: dev._id, createdBy: ceo._id },
    { name: 'Asad Hassan', company: 'National Insurance', email: 'asad@natins.so', phone: '+252 61 222 0004', service: 'IT Consulting', source: 'Conference', status: 'won', estimatedValue: 8000, assignee: ceo._id, createdBy: ceo._id },
  ]);

  // ── Meetings ───────────────────────────────────────────────────────────
  console.log('📅 Seeding meetings...');
  const futureDate = (days) => new Date(Date.now() + days * 86400000);
  await Meeting.create([
    { title: 'Hormuud Q4 Project Review', type: 'client', client: hormuud._id, clientName: hormuud.company, date: futureDate(3), time: '10:00 AM', duration: 60, participants: [ceo._id, pm._id], location: 'Hormuud HQ, Mogadishu', status: 'upcoming', createdBy: pm._id },
    { title: 'Sprint Planning — Mobile App', type: 'internal', date: futureDate(1), time: '02:00 PM', duration: 90, participants: [pm._id, dev._id, designer._id], link: 'https://meet.google.com/xxx-yyyy-zzz', status: 'upcoming', createdBy: pm._id },
    { title: 'New Client Onboarding — Premier Bank', type: 'client', client: premier._id, clientName: premier.company, date: futureDate(7), time: '11:00 AM', duration: 120, participants: [ceo._id, manager._id], location: 'Premier Bank HQ', status: 'upcoming', createdBy: ceo._id },
  ]);

  // ── Proposals ─────────────────────────────────────────────────────────
  console.log('📄 Seeding proposals...');
  await Proposal.create([
    { number: `PROP-${Y}-001`, client: premier._id, clientName: premier.company, services: ['Web Development', 'IT Consulting'], description: 'Digital banking portal with customer account management', price: 18000, status: 'sent', validUntil: d(Math.min(M + 1, 11), 30), createdBy: ceo._id },
    { number: `PROP-${Y}-002`, client: dara._id, clientName: dara.company, services: ['Mobile App Development'], description: 'Mobile banking app for iOS & Android', price: 32000, status: 'draft', validUntil: d(Math.min(M + 2, 11), 31), createdBy: pm._id },
  ]);

  // ── Contracts ─────────────────────────────────────────────────────────
  console.log('📋 Seeding contracts...');
  await Contract.create([
    { number: `CON-${Y}-001`, client: hormuud._id, clientName: hormuud.company, project: portalProject._id, projectName: portalProject.name, startDate: d(0, 1), endDate: d(11, 31), value: 25000, status: 'active', terms: 'Net 30 payment terms. Milestone-based delivery.', createdBy: ceo._id },
    { number: `CON-${Y}-002`, client: dahabshiil._id, clientName: dahabshiil.company, project: mobileProject._id, projectName: mobileProject.name, startDate: d(2, 1), endDate: d(Math.min(M + 3, 11), 31), value: 35000, status: 'active', createdBy: ceo._id },
    { number: `CON-${Y}-003`, client: jubba._id, clientName: jubba.company, startDate: d(0, 1), endDate: d(3, 30), value: 12000, status: 'expired', createdBy: ceo._id },
  ]);

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('📧 Demo Accounts:');
  console.log('   admin@hirad.io       → admin123   (Super Admin)');
  console.log('   manager@hirad.io     → manager123 (Admin)');
  console.log('   pm@hirad.io          → pm123      (Project Manager)');
  console.log('   dev@hirad.io         → dev123     (Developer)');
  console.log('   designer@hirad.io    → design123  (Designer)');
  console.log('   finance@hirad.io     → finance123 (Accountant)');
  console.log('─────────────────────────────────────────\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
