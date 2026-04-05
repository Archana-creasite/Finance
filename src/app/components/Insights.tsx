import { TrendingUp, DollarSign, Target, Calendar, Lightbulb, BarChart3 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { getHighestSpendingCategory, getMonthlyComparison, formatCurrency, calculateTotalExpenses } from '../../utils/helpers';
import { InsightCard } from './insights/InsightCard';
import { motion } from 'motion/react';

export const Insights = () => {
  const { transactions } = useFinanceStore();

  const highestCategory = getHighestSpendingCategory(transactions);
  const monthlyComparison = getMonthlyComparison(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const avgDailySpending = totalExpenses / 90;

  const percentageChange = monthlyComparison.percentageChange;
  const isSpendingUp = percentageChange > 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Financial Insights
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-13">
          Understand your spending patterns and trends
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <InsightCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          title="Highest Spending Category"
          value={highestCategory.category}
          description={`Total spent: ${formatCurrency(highestCategory.amount)}`}
          index={0}
        />

        <InsightCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          title="Monthly Comparison"
          value={formatCurrency(monthlyComparison.currentMonth)}
          description="Current month expenses"
          trend={{
            value: `${isSpendingUp ? '+' : ''}${percentageChange.toFixed(1)}% vs last month`,
            isPositive: !isSpendingUp
          }}
          index={1}
        />

        <InsightCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          title="Average Daily Spending"
          value={formatCurrency(avgDailySpending)}
          description="Based on last 90 days"
          index={2}
        />

        <InsightCard
          icon={<Target className="w-6 h-6 text-white" />}
          title="Spending Insight"
          value={isSpendingUp ? 'Above Average' : 'Below Average'}
          description={
            isSpendingUp
              ? `You spent ${Math.abs(percentageChange).toFixed(0)}% more this month`
              : `You saved ${Math.abs(percentageChange).toFixed(0)}% this month`
          }
          trend={{
            value: isSpendingUp ? 'Consider reducing expenses' : 'Great job staying on budget!',
            isPositive: !isSpendingUp
          }}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Smart Tip</h3>
            </div>
            <p className="text-blue-50 leading-relaxed">
              {isSpendingUp
                ? `Your ${highestCategory.category} expenses are high. Consider setting a budget limit for this category to improve your financial health.`
                : `You're doing great! Your spending is ${Math.abs(percentageChange).toFixed(0)}% lower than last month. Keep up the good work!`}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Monthly Summary</h3>
            </div>
            <div className="space-y-3 text-green-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Month:</span>
                <span className="text-lg font-bold">{formatCurrency(monthlyComparison.lastMonth)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Month:</span>
                <span className="text-lg font-bold">{formatCurrency(monthlyComparison.currentMonth)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-sm font-medium">Difference:</span>
                <span className={`text-lg font-bold ${isSpendingUp ? 'text-red-200' : 'text-green-200'}`}>
                  {isSpendingUp ? '+' : ''}{formatCurrency(Math.abs(monthlyComparison.currentMonth - monthlyComparison.lastMonth))}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
