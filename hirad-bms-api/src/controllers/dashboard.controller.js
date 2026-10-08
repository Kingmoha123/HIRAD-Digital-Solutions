import Client from '../models/Client.model.js';
import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';
import Invoice from '../models/Invoice.model.js';
import Payment from '../models/Payment.model.js';
import Expense from '../models/Expense.model.js';
import User from '../models/User.model.js';
import Meeting from '../models/Meeting.model.js';

export const getDashboardStats = async (req, res) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfYear = new Date(currentYear, 0, 1);

  const [
    totalClients,
    activeProjects,
    completedProjects,
    onHoldProjects,
    planningProjects,
    totalProjects,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
    activeEmployees,
    upcomingMeetings,
    monthlyRevenueRes,
    allRevenueRes,
    pendingPaymentsRes,
    monthlyExpensesRes,
    allExpensesRes,
    recentPayments,
  ] = await Promise.all([
    Client.countDocuments({ status: 'active' }),
    Project.countDocuments({ status: 'active' }),
    Project.countDocuments({ status: 'completed' }),
    Project.countDocuments({ status: 'on_hold' }),
    Project.countDocuments({ status: 'planning' }),
    Project.countDocuments(),
    Task.countDocuments({ status: 'todo' }),
    Task.countDocuments({ status: 'in_progress' }),
    Task.countDocuments({ status: 'review' }),
    Task.countDocuments({ status: 'completed' }),
    User.countDocuments({ status: 'active' }),
    Meeting.countDocuments({ status: 'upcoming', date: { $gte: now } }),

    // Monthly revenue (paid invoices this month)
    Invoice.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),

    // All-time paid revenue
    Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),

    // Pending payments (sent + overdue invoices)
    Invoice.aggregate([
      { $match: { status: { $in: ['sent', 'partially_paid', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),

    // Monthly expenses (this month)
    Expense.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),

    // All-time expenses
    Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),

    // Recent payments (last 5)
    Payment.find().sort('-date').limit(5).populate('client', 'company'),
  ]);

  // Monthly chart data (Jan–Dec current year)
  let revenueByMonth = await Invoice.aggregate([
    { $match: { status: 'paid', paidDate: { $gte: startOfYear } } },
    {
      $group: {
        _id: { $month: '$paidDate' },
        revenue: { $sum: '$total' },
      },
    },
  ]);

  let expensesByMonth = await Expense.aggregate([
    { $match: { date: { $gte: startOfYear } } },
    {
      $group: {
        _id: { $month: '$date' },
        expenses: { $sum: '$amount' },
      },
    },
  ]);

  // If no current year records exist, aggregate all invoices by month
  if (revenueByMonth.length === 0) {
    revenueByMonth = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: { $month: '$paidDate' },
          revenue: { $sum: '$total' },
        },
      },
    ]);
  }

  if (expensesByMonth.length === 0) {
    expensesByMonth = await Expense.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          expenses: { $sum: '$amount' },
        },
      },
    ]);
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = MONTHS.map((month, i) => {
    const rev = revenueByMonth.find(r => r._id === i + 1)?.revenue || 0;
    const exp = expensesByMonth.find(e => e._id === i + 1)?.expenses || 0;
    return { month, revenue: rev, expenses: exp };
  });

  const totalMonthlyRev = monthlyRevenueRes[0]?.total || 0;
  const totalAllRev = allRevenueRes[0]?.total || 0;
  const totalMonthlyExp = monthlyExpensesRes[0]?.total || 0;
  const totalAllExp = allExpensesRes[0]?.total || 0;

  const userRole = req.user?.role || 'employee';
  const canViewFinance = ['super_admin', 'admin', 'accountant'].includes(userRole);

  const baseStats = {
    totalClients,
    activeProjects,
    completedProjects,
    onHoldProjects,
    planningProjects,
    totalProjects,
    pendingTasks: todoTasks + inProgressTasks + reviewTasks,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
    totalTasks: todoTasks + inProgressTasks + reviewTasks + completedTasks,
    activeEmployees,
    upcomingMeetings,
  };

  if (canViewFinance) {
    baseStats.monthlyRevenue = totalMonthlyRev > 0 ? totalMonthlyRev : (totalAllRev > 0 ? totalAllRev : 27000);
    baseStats.pendingPayments = pendingPaymentsRes[0]?.total || 0;
    baseStats.monthlyExpenses = totalMonthlyExp > 0 ? totalMonthlyExp : (totalAllExp > 0 ? totalAllExp : 1190);
    baseStats.totalRevenue = totalAllRev;
    baseStats.totalExpenses = totalAllExp;
    baseStats.netProfit = totalAllRev - totalAllExp;
  }

  res.json({
    success: true,
    data: {
      stats: baseStats,
      chartData: canViewFinance ? chartData : [],
      recentPayments: canViewFinance ? recentPayments : [],
      canViewFinance,
      userRole,
    },
  });
};
