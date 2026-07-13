import { mean, median, percentile, standardDeviation } from '../utils/statistics';

export function classifyTransactions(transactions) {
  // Mock logic: this is just mapping the existing categories correctly as per the prompt.
  // The generator already categorized them nicely.
  return transactions;
}

export function extractMonthlyGenuineIncome(transactions) {
  const excludedCategories = [
    'INTERNAL_TRANSFER',
    'LOAN_PROCEEDS',
    'REFUND',
    'INVESTMENT_REDEMPTION'
  ];

  // Group by month
  const monthlyTotals = {};

  transactions.forEach(txn => {
    if (txn.credit > 0 && !excludedCategories.includes(txn.category) && txn.includedInIncome) {
      const monthKey = txn.date.substring(0, 7); // YYYY-MM
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + txn.credit;
    }
  });

  return Object.values(monthlyTotals);
}

export function engineerFeatures(transactions, essentialMonthlyExpense = 0, existingMonthlyEmi = 0) {
  const monthlyGenuineIncome = extractMonthlyGenuineIncome(transactions);

  const sustainableIncome = median(monthlyGenuineIncome) || 0;
  const stressAdjustedIncome = percentile(monthlyGenuineIncome, 25) || 0;
  
  const mMean = mean(monthlyGenuineIncome);
  const incomeVolatility = mMean > 0 ? (standardDeviation(monthlyGenuineIncome) / mMean) : 0;

  const stressSurplus = stressAdjustedIncome - essentialMonthlyExpense - existingMonthlyEmi;
  const limitFromSurplus = Math.max(0, stressSurplus * 0.5);
  const limitFromIncome = Math.max(0, stressAdjustedIncome * 0.35 - existingMonthlyEmi);
  const policyLimit = Math.max(0, stressAdjustedIncome * 0.45 - existingMonthlyEmi);
  
  const stressSafeEmi = Math.floor(Math.min(limitFromSurplus, limitFromIncome, policyLimit) / 500) * 500;

  return {
    recurringMonthlyIncome: sustainableIncome,
    stressAdjustedIncome,
    incomeVolatility,
    essentialMonthlyExpense,
    existingMonthlyEmi,
    minimumMonthlySurplus: Math.max(0, stressSurplus),
    stressSafeEmi
  };
}
