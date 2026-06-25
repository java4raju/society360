import { Transaction } from '../shared/models/models';

const incomeDesc = ['Maintenance Collection', 'Parking Fee', 'Clubhouse Booking', 'Late Fee', 'Interest Income', 'Hall Rental', 'Guest Charges'];
const expenseDesc = ['Security Salary', 'Housekeeping', 'Electricity Bill', 'Water Charges', 'Lift Maintenance', 'Garden Upkeep', 'Plumbing Repair', 'Generator Diesel', 'Insurance Premium', 'Pest Control'];
const incomeCat = ['Maintenance', 'Parking', 'Amenities', 'Penalty', 'Investment'];
const expenseCat = ['Salaries', 'Utilities', 'Maintenance', 'Repairs', 'Insurance'];
const methods = ['UPI', 'Bank Transfer', 'Cheque', 'Cash', 'Card'];
const statuses: Transaction['status'][] = ['Completed', 'Completed', 'Completed', 'Pending', 'Failed'];

export const TRANSACTIONS: Transaction[] = Array.from({ length: 100 }, (_, i) => {
  const isIncome = i % 5 !== 0;
  const month = (i % 12) + 1;
  const day = (i % 27) + 1;
  return {
    id: `TXN${(1000 + i)}`,
    date: `2026-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    description: isIncome ? incomeDesc[i % incomeDesc.length] : expenseDesc[i % expenseDesc.length],
    category: isIncome ? incomeCat[i % incomeCat.length] : expenseCat[i % expenseCat.length],
    amount: isIncome ? 5000 + (i * 731 % 95000) : 3000 + (i * 523 % 60000),
    type: isIncome ? 'Income' : 'Expense',
    status: statuses[i % statuses.length],
    method: methods[i % methods.length]
  };
});
