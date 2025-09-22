'use server';

import { explainRegressionFormula } from '@/ai/flows/explain-regression-formula';

const FORMULA = 'y = 10 + 0.5 * x1 + 1.2 * x2';

export async function getFormulaExplanation(): Promise<{ explanation?: string, error?: string }> {
  try {
    const result = await explainRegressionFormula({ formula: FORMULA });
    return { explanation: result.explanation };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get explanation from AI. Please try again later." };
  }
}
