import { motion } from 'motion/react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  Moon,
  Sun,
  User,
  Bell,
  DollarSign,
  Download,
  Trash2,
  Shield,
  Mail,
  Globe,
  Palette,
  Key,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const {
    darkMode,
    toggleDarkMode,
    userRole,
    setUserRole,
    currency,
    setCurrency,
    notifications,
    toggleNotifications,
    clearAllTransactions
  } = useFinanceStore();

  // ✅ NEW STATES
  const [emailNotifications, setEmailNotifications] = useState(true);

  // ✅ HANDLERS
  const handleExportCSV = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    if (!transactions.length) {
      alert('No data to export');
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(transactions[0]).join(","),
        ...transactions.map((row: any) => Object.values(row).join(","))
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateEmail = () => {
    const newEmail = prompt('Enter new email');
    if (!newEmail || !newEmail.includes('@')) {
      alert('Invalid email');
      return;
    }
    localStorage.setItem('userEmail', newEmail);
    alert('Email updated successfully');
  };

  const handleUpdatePassword = () => {
    const newPassword = prompt('Enter new password');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    localStorage.setItem('userPassword', newPassword);
    alert('Password updated successfully');
  };

  const handleUpdateCard = () => {
    const card = prompt('Enter new card number');
    if (card) alert('Card updated successfully');
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          description: 'Toggle between light and dark theme',
          icon: darkMode ? Moon : Sun,
          action: (
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: darkMode ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          ),
        },
        {
          label: 'Currency',
          description: 'Select your preferred currency',
          icon: DollarSign,
          action: (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          ),
        },
      ],
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          label: 'User Role',
          description: 'Switch between viewer and admin access',
          icon: Shield,
          action: (
            <div className="flex gap-2">
              <Button
                variant={userRole === 'viewer' ? 'primary' : 'outline'}
                onClick={() => setUserRole('viewer')}
                className="text-sm"
              >
                Viewer
              </Button>
              <Button
                variant={userRole === 'admin' ? 'primary' : 'outline'}
                onClick={() => setUserRole('admin')}
                className="text-sm"
              >
                Admin
              </Button>
            </div>
          ),
        },
        {
          label: 'Email',
          description: localStorage.getItem('userEmail') || 'admin@gmail.com',
          icon: Mail,
          action: (
            <Button variant="outline" className="text-sm" onClick={handleUpdateEmail}>
              Change Email
            </Button>
          ),
        },
        {
          label: 'Password',
          description: 'Last changed recently',
          icon: Key,
          action: (
            <Button variant="outline" className="text-sm" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications about transactions',
          icon: Bell,
          action: (
            <button
              onClick={toggleNotifications}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: notifications ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          ),
        },
        {
          label: 'Email Notifications',
          description: 'Get weekly summary emails',
          icon: Mail,
          action: (
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                emailNotifications
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: emailNotifications ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Billing',
      icon: CreditCard,
      items: [
        {
          label: 'Current Plan',
          description: 'Premium - $9.99/month',
          icon: CreditCard,
          action: (
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => alert('Redirecting to billing...')}
            >
              Manage Plan
            </Button>
          ),
        },
        {
          label: 'Payment Method',
          description: 'Visa ending in 4242',
          icon: CreditCard,
          action: (
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleUpdateCard}
            >
              Update Card
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      icon: Shield,
      items: [
        {
          label: 'Export Data',
          description: 'Download all your transaction data',
          icon: Download,
          action: (
            <Button variant="outline" className="text-sm" onClick={handleExportCSV}>
              Export CSV
            </Button>
          ),
        },
        {
          label: 'Clear All Data',
          description: 'Permanently delete all transactions',
          icon: Trash2,
          action: (
            <Button
              variant="danger"
              className="text-sm"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to delete all transactions? This cannot be undone.'
                  )
                ) {
                  clearAllTransactions();
                }
              }}
            >
              Clear Data
            </Button>
          ),
        },
        {
          label: 'Privacy Policy',
          description: 'View our privacy policy and terms',
          icon: Globe,
          action: (
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => window.open('/privacy-policy', '_blank')}
            >
              View Policy
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences and application settings
        </p>
      </motion.div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card className="overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start justify-between gap-4 pb-6 border-b last:border-0 border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div>{item.action}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}