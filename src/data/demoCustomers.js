export const demoCustomers = [
  {
    customerId: "CUST-1007",
    name: "Riya Sharma",
    initials: "RS",
    city: "Bengaluru",
    ageBand: "30-35",
    employmentType: "FREELANCER",
    relationshipMonths: 38,
    requestedProduct: "AUTO_LOAN",
    requestedAmount: 1000000,
    requestedTenureMonths: 60,
    statedDownPayment: 150000,
    purchaseTimelineDays: 30,
    declaredMonthlyIncome: 110000,
    existingMonthlyEmi: 8500,
    creditScoreBand: "PRIME",
    demoScenario: "MISSED_VIABLE_BORROWER",

    monthlyGenuineIncome: [
      78000, 92000, 114000, 69000,
      126000, 97000, 109000, 83000,
      101000, 119000, 87000, 111000
    ],

    monthlyEssentialExpense: [
      41000, 42000, 40000, 43000,
      44000, 42000, 41000, 43000,
      42000, 44000, 42000, 43000
    ],

    monthlyDiscretionaryExpense: [
      14000, 12000, 16000, 11000,
      17000, 13000, 15000, 12000,
      14000, 16000, 13000, 14000
    ],

    monthlyInternalTransfers: [
      18000, 0, 15000, 20000,
      0, 18000, 0, 16000,
      0, 22000, 0, 18000
    ],

    monthlyRefunds: [
      0, 4500, 0, 0,
      3200, 0, 0, 2800,
      0, 0, 5000, 0
    ],

    monthlyEndingBalance: [
      78000, 85000, 92000, 65000,
      110000, 88000, 96000, 72000,
      86000, 103000, 80000, 99000
    ],

    expectedDecision: {
      intentScore: 92,
      intentBand: "HIGH",
      sustainableIncome: 99000,
      stressAdjustedIncome: 86000,
      incomeConfidence: 89,
      stressSafeEmi: 18500,
      recommendedAmount: 840000,
      eligibilityStatus: "CONDITIONALLY_ELIGIBLE",
      trustConfidence: 94,
      recommendedAction: "RM_ASSISTED_REVISED_OFFER",
      conversionWithoutAction: 29,
      conversionWithAction: 57,
      incrementalUplift: 28,
      barrier: "FREELANCER_INCOME_DOCUMENTATION"
    },

    behaviouralTimeline: [
      {
        offsetMinutes: 0,
        eventType: "loan_product_viewed",
        properties: { product: "AUTO_LOAN" }
      },
      {
        offsetMinutes: 1,
        eventType: "emi_calculator_opened",
        properties: { product: "AUTO_LOAN" }
      },
      {
        offsetMinutes: 2,
        eventType: "emi_calculator_changed",
        properties: {
          previousAmount: 800000,
          requestedAmount: 1000000,
          tenureMonths: 48
        }
      },
      {
        offsetMinutes: 3,
        eventType: "tenure_changed",
        properties: { previousTenure: 48, tenureMonths: 60 }
      },
      {
        offsetMinutes: 4,
        eventType: "document_list_viewed",
        properties: { section: "FREELANCER_INCOME_DOCUMENTS" }
      },
      {
        offsetMinutes: 6,
        eventType: "application_started",
        properties: { product: "AUTO_LOAN" }
      },
      {
        offsetMinutes: 8,
        eventType: "application_step_completed",
        properties: { step: "PERSONAL_INFORMATION", completionPct: 35 }
      },
      {
        offsetMinutes: 10,
        eventType: "application_step_completed",
        properties: {
          step: "EMPLOYMENT_INFORMATION",
          employmentType: "FREELANCER",
          completionPct: 62
        }
      },
      {
        offsetMinutes: 13,
        eventType: "application_abandoned",
        properties: {
          step: "INCOME_VERIFICATION",
          timeSpentSeconds: 142,
          completionPct: 62
        }
      },
      {
        offsetMinutes: 4320,
        eventType: "application_resumed",
        properties: { step: "INCOME_VERIFICATION" }
      },
      {
        offsetMinutes: 4322,
        eventType: "chat_started",
        properties: { language: "ENGLISH" }
      }
    ]
  },
  {
    customerId: "CUST-1012",
    name: "Rahul Verma",
    initials: "RV",
    city: "Gurugram",
    ageBand: "35-40",
    employmentType: "SALARIED",
    relationshipMonths: 62,
    requestedProduct: "HOME_LOAN",
    requestedAmount: 4500000,
    requestedTenureMonths: 240,
    purchaseTimelineDays: 365,
    declaredMonthlyIncome: 170000,
    existingMonthlyEmi: 24000,
    creditScoreBand: "PRIME",
    demoScenario: "HIGH_CAPACITY_WINDOW_SHOPPER",

    monthlyGenuineIncome: [
      168000, 170000, 171000, 169000,
      172000, 170000, 173000, 171000,
      169000, 174000, 172000, 171000
    ],

    monthlyEssentialExpense: [
      59000, 60000, 58000, 61000,
      60000, 62000, 59000, 60000,
      61000, 59000, 60000, 61000
    ],

    monthlyDiscretionaryExpense: [
      28000, 26000, 30000, 29000,
      27000, 31000, 25000, 28000,
      32000, 26000, 29000, 27000
    ],

    expectedDecision: {
      intentScore: 32,
      intentBand: "LOW",
      sustainableIncome: 171000,
      stressAdjustedIncome: 169000,
      incomeConfidence: 97,
      stressSafeEmi: 32000,
      recommendedAmount: 3700000,
      eligibilityStatus: "POTENTIALLY_ELIGIBLE",
      trustConfidence: 97,
      recommendedAction: "DIGITAL_NURTURE",
      conversionWithoutAction: 10,
      conversionWithAction: 12,
      incrementalUplift: 2,
      barrier: "NO_NEAR_TERM_PURCHASE_INTENT"
    },

    behaviourSummary: {
      productViews7d: 5,
      calculatorUses7d: 2,
      applicationStarted: false,
      documentViews: 0,
      confirmedTimelineDays: 365,
      chatStatement: "I am only comparing market rates."
    }
  },
  {
    customerId: "CUST-1021",
    name: "Meena Iyer",
    initials: "MI",
    city: "Chennai",
    ageBand: "40-45",
    employmentType: "SALARIED",
    relationshipMonths: 28,
    requestedProduct: "PERSONAL_LOAN",
    requestedAmount: 1200000,
    requestedTenureMonths: 60,
    purchaseTimelineDays: 7,
    declaredMonthlyIncome: 72000,
    existingMonthlyEmi: 25000,
    creditScoreBand: "NEAR_PRIME",
    demoScenario: "HIGH_INTENT_LOW_CAPACITY",

    monthlyGenuineIncome: [
      71000, 72000, 72000, 73000,
      72000, 71000, 73000, 72000,
      72000, 73000, 71000, 72000
    ],

    monthlyEssentialExpense: [
      37000, 38000, 37000, 39000,
      38000, 37000, 39000, 38000,
      37000, 39000, 38000, 38000
    ],

    expectedDecision: {
      intentScore: 95,
      intentBand: "VERY_HIGH",
      sustainableIncome: 72000,
      stressAdjustedIncome: 71000,
      incomeConfidence: 96,
      stressSafeEmi: 4000,
      recommendedAmount: 180000,
      eligibilityStatus: "REQUESTED_AMOUNT_UNAFFORDABLE",
      trustConfidence: 92,
      recommendedAction: "RESPONSIBLE_SMALLER_OFFER",
      conversionWithoutAction: 21,
      conversionWithAction: 33,
      incrementalUplift: 12,
      barrier: "HIGH_EXISTING_OBLIGATION"
    },

    behaviourSummary: {
      productViews7d: 8,
      calculatorUses7d: 12,
      applicationStarted: true,
      applicationCompletionPct: 82,
      callbackRequested: true,
      confirmedTimelineDays: 7
    }
  },
  {
    customerId: "CUST-1034",
    name: "Arjun Singh",
    initials: "AS",
    city: "Lucknow",
    ageBand: "25-30",
    employmentType: "GIG_WORKER",
    relationshipMonths: 9,
    requestedProduct: "AUTO_LOAN",
    requestedAmount: 650000,
    requestedTenureMonths: 60,
    purchaseTimelineDays: 45,
    declaredMonthlyIncome: 65000,
    existingMonthlyEmi: 6000,
    creditScoreBand: "THIN_FILE",
    demoScenario: "INSUFFICIENT_DATA",

    monthlyGenuineIncome: [
      46000, 62000, 31000, 74000,
      53000, 39000, 81000, 44000,
      68000, 36000, 77000, 49000
    ],

    monthlyEssentialExpense: [
      30000, 31000, 30000, 32000,
      31000, 30000, 32000, 31000,
      30000, 32000, 31000, 31000
    ],

    expectedDecision: {
      intentScore: 86,
      intentBand: "HIGH",
      sustainableIncome: 51000,
      stressAdjustedIncome: 40250,
      incomeConfidence: 56,
      stressSafeEmi: 1500,
      recommendedAmount: 0,
      eligibilityStatus: "MORE_DATA_REQUIRED",
      trustConfidence: 80,
      recommendedAction: "REQUEST_ADDITIONAL_DATA",
      conversionWithoutAction: 17,
      conversionWithAction: 25,
      incrementalUplift: 8,
      barrier: "HIGH_INCOME_VOLATILITY"
    },

    behaviourSummary: {
      productViews7d: 6,
      calculatorUses7d: 8,
      applicationStarted: true,
      applicationCompletionPct: 54,
      confirmedTimelineDays: 45
    }
  },
  {
    customerId: "CUST-1040",
    name: "Neha Kapoor",
    initials: "NK",
    city: "Mumbai",
    ageBand: "30-35",
    employmentType: "SALARIED",
    relationshipMonths: 74,
    requestedProduct: "PERSONAL_LOAN",
    requestedAmount: 500000,
    requestedTenureMonths: 36,
    purchaseTimelineDays: 14,
    declaredMonthlyIncome: 125000,
    existingMonthlyEmi: 0,
    creditScoreBand: "PRIME",
    demoScenario: "DIGITAL_SURE_THING",

    monthlyGenuineIncome: [
      124000, 125000, 125000, 126000,
      125000, 124000, 126000, 125000,
      125000, 126000, 124000, 125000
    ],

    monthlyEssentialExpense: [
      44000, 45000, 44000, 46000,
      45000, 44000, 46000, 45000,
      44000, 46000, 45000, 45000
    ],

    expectedDecision: {
      intentScore: 89,
      intentBand: "HIGH",
      sustainableIncome: 125000,
      stressAdjustedIncome: 124000,
      incomeConfidence: 98,
      stressSafeEmi: 25000,
      recommendedAmount: 500000,
      eligibilityStatus: "ELIGIBLE",
      trustConfidence: 98,
      recommendedAction: "DIGITAL_SELF_SERVICE",
      conversionWithoutAction: 81,
      conversionWithAction: 83,
      incrementalUplift: 2,
      barrier: "NONE"
    },

    behaviourSummary: {
      productViews7d: 3,
      calculatorUses7d: 4,
      applicationStarted: true,
      applicationCompletionPct: 94,
      offerViewed: true,
      confirmedTimelineDays: 14
    }
  },
  {
    customerId: "CUST-1055",
    name: "Vikram Malhotra",
    initials: "VM",
    city: "Delhi",
    ageBand: "40-45",
    employmentType: "SELF_EMPLOYED",
    relationshipMonths: 14,
    requestedProduct: "MORTGAGE_LOAN",
    requestedAmount: 3000000,
    requestedTenureMonths: 120,
    purchaseTimelineDays: 10,
    declaredMonthlyIncome: 180000,
    existingMonthlyEmi: 18000,
    creditScoreBand: "NEAR_PRIME",
    demoScenario: "HIGH_INTENT_LOW_TRUST",

    monthlyGenuineIncome: [
      95000, 110000, 105000, 98000,
      115000, 102000, 108000, 93000,
      117000, 99000, 106000, 111000
    ],

    monthlyInternalTransfers: [
      80000, 70000, 90000, 75000,
      85000, 95000, 60000, 100000,
      80000, 70000, 90000, 85000
    ],

    monthlyLoanProceeds: [
      0, 0, 0, 250000,
      0, 0, 0, 0,
      0, 0, 0, 0
    ],

    monthlyEssentialExpense: [
      60000, 63000, 61000, 65000,
      62000, 64000, 61000, 66000,
      62000, 63000, 65000, 64000
    ],

    expectedDecision: {
      intentScore: 94,
      intentBand: "VERY_HIGH",
      sustainableIncome: 105500,
      stressAdjustedIncome: 98250,
      incomeConfidence: 62,
      stressSafeEmi: 7000,
      recommendedAmount: 0,
      eligibilityStatus: "VERIFICATION_HOLD",
      trustConfidence: 38,
      recommendedAction: "ENHANCED_VERIFICATION",
      conversionWithoutAction: 9,
      conversionWithAction: 11,
      incrementalUplift: 2,
      barrier: "CIRCULAR_TRANSFERS_AND_NON_INCOME_CREDITS"
    },

    behaviourSummary: {
      productViews7d: 11,
      calculatorUses7d: 14,
      applicationStarted: true,
      applicationCompletionPct: 91,
      callbackRequested: true,
      confirmedTimelineDays: 10
    }
  }
];
