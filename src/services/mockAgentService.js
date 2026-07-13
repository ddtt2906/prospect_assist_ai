import { calculateIntentScore, determineNextBestAction } from './scoringEngine';
import { engineerFeatures } from './featureEngineering';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAgentService = {
  runIntentAgent: async (events, expectedDecision) => {
    await sleep(100);
    // Use surrogate score, but optionally merge with expected decision for demo smoothness
    const result = calculateIntentScore(events);
    return {
      intentScore: result.score > 0 ? result.score : expectedDecision.intentScore,
      intentBand: result.score > 0 ? result.band : expectedDecision.intentBand,
      reasonCodes: result.components.map(c => c.label),
      confidence: 94,
      latencyMs: 842,
      version: "intent-surrogate-v1.0"
    };
  },

  runIncomeAgent: async (transactions, expectedDecision) => {
    await sleep(100);
    const features = engineerFeatures(transactions, 40000, 8500); // hardcoded mock inputs for the standalone agent if needed
    return {
      sustainableIncome: expectedDecision.sustainableIncome,
      stressAdjustedIncome: expectedDecision.stressAdjustedIncome,
      incomeConfidence: expectedDecision.incomeConfidence,
      excludedInternalTransfers: 18200,
      excludedRefunds: 4100,
      latencyMs: 1105,
      version: "income-reconstruction-v1.2"
    };
  },

  runCapacityAgent: async (features, expectedDecision) => {
    await sleep(100);
    return {
      stressSafeEmi: expectedDecision.stressSafeEmi,
      recommendedAmount: expectedDecision.recommendedAmount,
      requestedAmountStatus: expectedDecision.recommendedAmount < 1000000 ? "ABOVE_STRESS_SAFE_ENVELOPE" : "WITHIN_SAFE_ENVELOPE",
      latencyMs: 945,
      version: "capacity-engine-v1.0"
    };
  },

  runEligibilityAgent: async (capacityOutputs, expectedDecision) => {
    await sleep(100);
    return {
      status: expectedDecision.eligibilityStatus,
      warnings: expectedDecision.barrier ? [expectedDecision.barrier] : [],
      latencyMs: 610,
      version: "eligibility-rules-demo-v1.0"
    };
  },

  runNextBestActionAgent: async (intent, capacity, expectedDecision) => {
    await sleep(100);
    return {
      recommendedAction: expectedDecision.recommendedAction,
      conversionWithoutAction: expectedDecision.conversionWithoutAction,
      conversionWithAction: expectedDecision.conversionWithAction,
      incrementalUplift: expectedDecision.incrementalUplift,
      contactReason: expectedDecision.barrier,
      latencyMs: 1215,
      version: "uplift-simulator-demo-v1.0"
    };
  }
};
