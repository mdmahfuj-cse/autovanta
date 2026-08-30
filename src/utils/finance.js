/**
 * Loan math — pure functions, no side effects.
 * All amounts are raw BDT; format for display at the view layer.
 */

/**
 * Standard amortizing loan (EMI).
 * calculateLoan({ price: 8500000, downPayment: 2550000, months: 60, annualRatePercent: 9.8 })
 *   → { financed, monthly, totalPaid, totalInterest }
 */
export function calculateLoan({ price, downPayment = 0, months, annualRatePercent }) {
  const financed = Math.max(Number(price) - Number(downPayment), 0);
  const n = Math.max(Number(months), 1);
  const r = Number(annualRatePercent) / 100 / 12;

  let monthly;
  if (financed === 0) {
    monthly = 0;
  } else if (r === 0) {
    monthly = financed / n;
  } else {
    monthly = (financed * r) / (1 - Math.pow(1 + r, -n));
  }

  const paidViaInstallments = monthly * n;
  return {
    financed,
    monthly,
    totalPaid: paidViaInstallments + Number(downPayment),
    totalInterest: paidViaInstallments - financed,
  };
}

/** Month-by-month amortization schedule (for the Phase 6 breakdown chart). */
export function amortizationSchedule({ price, downPayment = 0, months, annualRatePercent }) {
  const { monthly } = calculateLoan({ price, downPayment, months, annualRatePercent });
  const r = Number(annualRatePercent) / 100 / 12;
  let balance = Math.max(Number(price) - Number(downPayment), 0);

  const rows = [];
  for (let m = 1; m <= months && balance > 0; m += 1) {
    const interest = balance * r;
    const principal = Math.min(monthly - interest, balance);
    balance = Math.max(balance - principal, 0);
    rows.push({ month: m, principal, interest, balance });
  }
  return rows;
}
