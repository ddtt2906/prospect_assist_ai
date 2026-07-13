/**
 * Generates transactions deterministically based on the customer data.
 */
export function generateTransactions(customer) {
  const transactions = [];
  const startMonthDate = new Date("2025-07-01");

  // Riya uses specific accounts as per prompt
  const mainAccount = `ACC-IDBI-${customer.customerId.split('-')[1]}`;
  const extAccount = `ACC-EXT-${customer.customerId.split('-')[1]}`;

  for (let month = 0; month < 12; month++) {
    const currentDate = new Date(startMonthDate);
    currentDate.setMonth(startMonthDate.getMonth() + month);
    const datePrefix = currentDate.toISOString().slice(0, 7); // YYYY-MM
    let baseBalance = 50000;

    // Genuine Income
    if (customer.monthlyGenuineIncome && customer.monthlyGenuineIncome[month]) {
      const inc = customer.monthlyGenuineIncome[month];
      transactions.push({
        transactionId: `TXN-${customer.initials}-${datePrefix}-001`,
        customerId: customer.customerId,
        accountId: mainAccount,
        date: `${datePrefix}-03`,
        description: customer.employmentType === 'SALARIED' ? 'MONTHLY SALARY NEFT' : 'CLIENT PAYMENT',
        credit: inc,
        debit: 0,
        balance: baseBalance += inc,
        category: customer.employmentType === 'SALARIED' ? 'SALARY' : 'FREELANCE_RECEIPT',
        includedInIncome: true,
        classificationConfidence: 96,
        reason: "Recurring client-originated receipt"
      });
    }

    // Essential Expense
    if (customer.monthlyEssentialExpense && customer.monthlyEssentialExpense[month]) {
      const exp = customer.monthlyEssentialExpense[month];
      transactions.push({
        transactionId: `TXN-${customer.initials}-${datePrefix}-002`,
        customerId: customer.customerId,
        accountId: mainAccount,
        date: `${datePrefix}-10`,
        description: 'ESSENTIAL EXPENDITURE (RENT/UTILITIES)',
        credit: 0,
        debit: exp,
        balance: baseBalance -= exp,
        category: 'UTILITY',
        includedInIncome: false,
        classificationConfidence: 90,
        reason: "Standard essential expense"
      });
    }

    // Discretionary Expense
    if (customer.monthlyDiscretionaryExpense && customer.monthlyDiscretionaryExpense[month]) {
      const disc = customer.monthlyDiscretionaryExpense[month];
      transactions.push({
        transactionId: `TXN-${customer.initials}-${datePrefix}-003`,
        customerId: customer.customerId,
        accountId: mainAccount,
        date: `${datePrefix}-15`,
        description: 'POS/E-COMMERCE PAYMENT',
        credit: 0,
        debit: disc,
        balance: baseBalance -= disc,
        category: 'DISCRETIONARY_SPEND',
        includedInIncome: false,
        classificationConfidence: 85,
        reason: "Lifestyle expense"
      });
    }

    // Internal Transfers
    if (customer.monthlyInternalTransfers && customer.monthlyInternalTransfers[month]) {
      const trans = customer.monthlyInternalTransfers[month];
      if (trans > 0) {
        transactions.push({
          transactionId: `TXN-${customer.initials}-${datePrefix}-004`,
          customerId: customer.customerId,
          accountId: mainAccount,
          date: `${datePrefix}-20`,
          description: 'OWN ACCOUNT TRANSFER',
          credit: trans, // It's coming into the main account
          debit: 0,
          balance: baseBalance += trans,
          category: 'INTERNAL_TRANSFER',
          includedInIncome: false,
          classificationConfidence: 99,
          reason: "Sender and receiver PAN match"
        });
      }
    }

    // Refunds
    if (customer.monthlyRefunds && customer.monthlyRefunds[month]) {
      const ref = customer.monthlyRefunds[month];
      if (ref > 0) {
        transactions.push({
          transactionId: `TXN-${customer.initials}-${datePrefix}-005`,
          customerId: customer.customerId,
          accountId: mainAccount,
          date: `${datePrefix}-22`,
          description: 'E-COMMERCE REFUND',
          credit: ref,
          debit: 0,
          balance: baseBalance += ref,
          category: 'REFUND',
          includedInIncome: false,
          classificationConfidence: 95,
          reason: "Reversal of previous transaction"
        });
      }
    }
    
    // Loan Proceeds
    if (customer.monthlyLoanProceeds && customer.monthlyLoanProceeds[month]) {
      const proc = customer.monthlyLoanProceeds[month];
      if (proc > 0) {
        transactions.push({
          transactionId: `TXN-${customer.initials}-${datePrefix}-006`,
          customerId: customer.customerId,
          accountId: mainAccount,
          date: `${datePrefix}-05`,
          description: 'LOAN DISBURSAL CREDIT',
          credit: proc,
          debit: 0,
          balance: baseBalance += proc,
          category: 'LOAN_PROCEEDS',
          includedInIncome: false,
          classificationConfidence: 99,
          reason: "Credit from loan account"
        });
      }
    }
  }

  return transactions;
}
