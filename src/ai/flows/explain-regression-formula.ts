'use server';

/**
 * @fileOverview Explains the linear regression formula used in the app.
 *
 * - explainRegressionFormula - A function that returns an explanation of the linear regression formula.
 * - ExplainRegressionFormulaInput - The input type for the explainRegressionFormula function.
 * - ExplainRegressionFormulaOutput - The return type for the explainRegressionFormula function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRegressionFormulaInputSchema = z.object({
  formula: z.string().describe('The linear regression formula to explain.'),
});
export type ExplainRegressionFormulaInput = z.infer<
  typeof ExplainRegressionFormulaInputSchema
>;

const ExplainRegressionFormulaOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the linear regression formula.'),
});
export type ExplainRegressionFormulaOutput = z.infer<
  typeof ExplainRegressionFormulaOutputSchema
>;

export async function explainRegressionFormula(
  input: ExplainRegressionFormulaInput
): Promise<ExplainRegressionFormulaOutput> {
  return explainRegressionFormulaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRegressionFormulaPrompt',
  input: {schema: ExplainRegressionFormulaInputSchema},
  output: {schema: ExplainRegressionFormulaOutputSchema},
  prompt: `You are an expert in explaining mathematical formulas to non-technical users.

  Explain the following linear regression formula in simple terms:

  Formula: {{{formula}}}`,
});

const explainRegressionFormulaFlow = ai.defineFlow(
  {
    name: 'explainRegressionFormulaFlow',
    inputSchema: ExplainRegressionFormulaInputSchema,
    outputSchema: ExplainRegressionFormulaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
