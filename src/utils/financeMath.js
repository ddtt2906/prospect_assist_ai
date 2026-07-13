export function calculateEmi(principal, annualRate, tenureMonths) {
  if (!principal || !annualRate || !tenureMonths) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export function calculatePrincipalFromEmi(emi, annualRate, tenureMonths) {
  if (!emi || !annualRate || !tenureMonths) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const principal = emi * (Math.pow(1 + monthlyRate, tenureMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
  return Math.round(principal);
}

export const DEMO_PRODUCT_RATES = {
  PERSONAL_LOAN: 12.5,
  AUTO_LOAN: 9.2,
  HOME_LOAN: 8.6,
  MORTGAGE_LOAN: 10.25
};
