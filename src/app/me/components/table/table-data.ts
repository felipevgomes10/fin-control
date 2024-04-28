import type { FixedExpenses } from "./fixed-expenses-columns";
import type { MonthlyExpense } from "./monthly-expenses-columns";

export const mockedMonthlyExpenses: MonthlyExpense[] = [
  {
    id: "1",
    label: "Test 1",
    month: "January",
    totalExpenses: 1000,
    target: 2000,
  },
  {
    id: "2",
    label: "Test 2",
    month: "February",
    totalExpenses: 2000,
    target: 3000,
  },
  {
    id: "3",
    label: "Test 3",
    month: "March",
    totalExpenses: 3000,
    target: 4000,
  },
  {
    id: "4",
    label: "Test 4",
    month: "April",
    totalExpenses: 4000,
    target: 5000,
  },
  {
    id: "5",
    label: "Test 5",
    month: "May",
    totalExpenses: 5000,
    target: 6000,
  },
  {
    id: "6",
    label: "Test 6",
    month: "June",
    totalExpenses: 6000,
    target: 7000,
  },
  {
    id: "7",
    label: "Test 7",
    month: "July",
    totalExpenses: 7000,
    target: 8000,
  },
  {
    id: "8",
    label: "Test 8",
    month: "August",
    totalExpenses: 8000,
    target: 9000,
  },
  {
    id: "9",
    label: "Test 9",
    month: "September",
    totalExpenses: 9000,
    target: 10000,
  },
  {
    id: "10",
    label: "Test 10",
    month: "October",
    totalExpenses: 10000,
    target: 11000,
  },
  {
    id: "11",
    label: "Test 11",
    month: "November",
    totalExpenses: 11000,
    target: 12000,
  },
  {
    id: "12",
    label: "Test 12",
    month: "December",
    totalExpenses: 12000,
    target: 13000,
  },
];

export const mockedFixedExpenses: FixedExpenses[] = [
  {
    id: "1",
    label: "Rent",
    amount: 1000,
    createdAt: new Date().toUTCString(),
  },
  {
    id: "2",
    label: "Utilities",
    amount: 200,
    createdAt: new Date().toUTCString(),
  },
  {
    id: "3",
    label: "Internet",
    amount: 50,
    createdAt: new Date().toUTCString(),
  },
];
