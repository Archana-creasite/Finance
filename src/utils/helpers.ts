import { Transaction, TransactionType, CategoryType } from '../store/useFinanceStore';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getCategoryIcon = (category: CategoryType): string => {
  const icons: Record<CategoryType, string> = {
    Food: '🍔',
    Travel: '✈️',
    Bills: '📄',
    Shopping: '🛍️',
    Entertainment: '🎬',
    Healthcare: '⚕️',
    Salary: '💰',
    Freelance: '💼',
    Investment: '📈',
    Other: '📌'
  };
  return icons[category] || '📌';
};

export const getCategoryColor = (category: CategoryType): string => {
  const colors: Record<CategoryType, string> = {
    Food: '#FF6B6B',
    Travel: '#4ECDC4',
    Bills: '#45B7D1',
    Shopping: '#FFA07A',
    Entertainment: '#DDA15E',
    Healthcare: '#06D6A0',
    Salary: '#118AB2',
    Freelance: '#073B4C',
    Investment: '#06FFA5',
    Other: '#95A4AB'
  };
  return colors[category] || '#95A4AB';
};

export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, txn) => {
    return txn.type === 'income' ? total + txn.amount : total - txn.amount;
  }, 0);
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((txn) => txn.type === 'income')
    .reduce((total, txn) => total + txn.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((total, txn) => total + txn.amount, 0);
};

export const getSpendingByCategory = (transactions: Transaction[]): { name: string; value: number; color: string }[] => {
  const expensesByCategory: Record<string, number> = {};

  transactions
    .filter((txn) => txn.type === 'expense')
    .forEach((txn) => {
      expensesByCategory[txn.category] = (expensesByCategory[txn.category] || 0) + txn.amount;
    });

  return Object.entries(expensesByCategory)
    .map(([category, value]) => ({
      name: category,
      value,
      color: getCategoryColor(category as CategoryType)
    }))
    .sort((a, b) => b.value - a.value);
};

export const getBalanceTrend = (transactions: Transaction[]): { date: string; balance: number }[] => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;
  const balanceData: { date: string; balance: number }[] = [];
  const dateMap = new Map<string, number>();

  sortedTransactions.forEach((txn) => {
    const change = txn.type === 'income' ? txn.amount : -txn.amount;
    runningBalance += change;
    dateMap.set(txn.date, runningBalance);
  });

  dateMap.forEach((balance, date) => {
    balanceData.push({ date, balance });
  });

  return balanceData;
};

export const filterTransactions = (
  transactions: Transaction[],
  searchQuery: string,
  filterCategory: CategoryType | 'all',
  filterType: TransactionType | 'all'
): Transaction[] => {
  return transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || txn.category === filterCategory;
    const matchesType = filterType === 'all' || txn.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });
};

export const sortTransactions = (
  transactions: Transaction[],
  sortBy: 'date' | 'amount',
  sortOrder: 'asc' | 'desc'
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      comparison = a.amount - b.amount;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

export const getMonthlyComparison = (transactions: Transaction[]): {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
} => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthExpenses = transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      return txn.type === 'expense' && txnDate >= currentMonthStart;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const lastMonthExpenses = transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      return txn.type === 'expense' && txnDate >= lastMonthStart && txnDate <= lastMonthEnd;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const percentageChange = lastMonthExpenses === 0
    ? 0
    : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  return {
    currentMonth: currentMonthExpenses,
    lastMonth: lastMonthExpenses,
    percentageChange
  };
};

export const getHighestSpendingCategory = (transactions: Transaction[]): { category: string; amount: number } => {
  const spending = getSpendingByCategory(transactions);
  if (spending.length === 0) {
    return { category: 'None', amount: 0 };
  }
  return { category: spending[0].name, amount: spending[0].value };
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((txn) => [
    txn.date,
    txn.description,
    txn.category,
    txn.type,
    txn.amount.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
