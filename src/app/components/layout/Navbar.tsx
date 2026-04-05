import { Moon, Sun, User, Download, Bell } from 'lucide-react';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { exportToCSV } from '../../../utils/helpers';

export const Navbar = () => {
  const { darkMode, toggleDarkMode, userRole, setUserRole, transactions } = useFinanceStore();

  const handleExportCSV = () => {
    exportToCSV(transactions);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent lg:block hidden">
                Welcome back Admin
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                Here's what's happening with your finances today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="hidden sm:flex hover:shadow-md transition-shadow"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </Button>

            <div className="flex items-center gap-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setUserRole('viewer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  userRole === 'viewer'
                    ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Viewer</span>
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  userRole === 'admin'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
