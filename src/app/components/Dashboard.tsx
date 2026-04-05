import { Wallet, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { calculateTotalBalance, calculateTotalIncome, calculateTotalExpenses, formatCurrency } from '../../utils/helpers';
import { SummaryCard } from './dashboard/SummaryCard';
import { BalanceChart } from './dashboard/BalanceChart';
import { SpendingChart } from './dashboard/SpendingChart';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const { transactions } = useFinanceStore();

  const totalBalance = calculateTotalBalance(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-13">
          Track your financial health at a glance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="w-6 h-6 text-white" />}
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={{
            value: 12.5,
            isPositive: true
          }}
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBgColor="bg-gradient-to-br from-green-500 to-emerald-600"
          trend={{
            value: 8.2,
            isPositive: true
          }}
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          iconBgColor="bg-gradient-to-br from-red-500 to-pink-600"
          trend={{
            value: 4.1,
            isPositive: false
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart />
        <SpendingChart />
      </div>
    </div>
  );
};
