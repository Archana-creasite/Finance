import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  index: number;
}

export const InsightCard = ({ icon, title, value, description, trend, index }: InsightCardProps) => {
  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-green-500 to-emerald-600',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden relative h-[168px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">{value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              {trend && (
                <div className={`mt-3 text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {trend.value}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
