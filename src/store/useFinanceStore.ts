import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense';
export type CategoryType = 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Entertainment' | 'Healthcare' | 'Salary' | 'Freelance' | 'Investment' | 'Other';
export type UserRole = 'viewer' | 'admin';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: CategoryType;
  type: TransactionType;
  description: string;
}

interface FinanceState {
  transactions: Transaction[];
  userRole: UserRole;
  darkMode: boolean;
  searchQuery: string;
  filterCategory: CategoryType | 'all';
  filterType: TransactionType | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  currency: string;
  notifications: boolean;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  setUserRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: CategoryType | 'all') => void;
  setFilterType: (type: TransactionType | 'all') => void;
  setSortBy: (sortBy: 'date' | 'amount') => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  setCurrency: (currency: string) => void;
  toggleNotifications: () => void;
}

// Mock data generator
const generateMockTransactions = (): Transaction[] => {
  const categories: CategoryType[] = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Salary', 'Freelance', 'Investment'];
  const descriptions: Record<CategoryType, string[]> = {
    Food: ['Grocery Shopping', 'Restaurant Dinner', 'Coffee Shop', 'Fast Food', 'Meal Delivery'],
    Travel: ['Flight Ticket', 'Hotel Booking', 'Taxi Ride', 'Train Ticket', 'Car Rental'],
    Bills: ['Electricity Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Rent Payment'],
    Shopping: ['Online Purchase', 'Clothing Store', 'Electronics', 'Home Decor', 'Books'],
    Entertainment: ['Movie Tickets', 'Concert', 'Streaming Subscription', 'Gaming', 'Theme Park'],
    Healthcare: ['Doctor Visit', 'Pharmacy', 'Dental Care', 'Lab Tests', 'Insurance'],
    Salary: ['Monthly Salary', 'Bonus', 'Commission'],
    Freelance: ['Client Project', 'Consulting', 'Design Work'],
    Investment: ['Stock Dividend', 'Interest Income', 'Crypto Gain'],
    Other: ['Miscellaneous', 'Gift', 'Donation']
  };

  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const category = categories[Math.floor(Math.random() * categories.length)];
    const isIncome = ['Salary', 'Freelance', 'Investment'].includes(category);
    const type: TransactionType = isIncome ? 'income' : 'expense';

    const amount = isIncome
      ? Math.floor(Math.random() * 5000) + 2000
      : Math.floor(Math.random() * 500) + 20;

    const descList = descriptions[category];
    const description = descList[Math.floor(Math.random() * descList.length)];

    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      type,
      description
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      userRole: 'admin',
      darkMode: false,
      searchQuery: '',
      filterCategory: 'all',
      filterType: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      currency: 'USD',
      notifications: true,

      addTransaction: (transaction) => set((state) => ({
        transactions: [
          {
            ...transaction,
            id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          },
          ...state.transactions
        ]
      })),

      updateTransaction: (id, updatedTransaction) => set((state) => ({
        transactions: state.transactions.map((txn) =>
          txn.id === id ? { ...txn, ...updatedTransaction } : txn
        )
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((txn) => txn.id !== id)
      })),

      clearAllTransactions: () => set({
        transactions: []
      }),

      setUserRole: (role) => set({ userRole: role }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setFilterType: (type) => set({ filterType: type }),
      setSortBy: (sortBy) => set({ sortBy }),
      toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
      })),
      resetFilters: () => set({
        searchQuery: '',
        filterCategory: 'all',
        filterType: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
      }),
      setCurrency: (currency) => set({ currency }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications }))
    }),
    {
      name: 'finance-dashboard-storage'
    }
  )
);
