"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormulaExplanation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  param1: z.coerce.number().min(0, "Value must be non-negative"),
  param2: z.coerce.number().min(0, "Value must be non-negative"),
});

const B0 = 10;
const B1 = 0.5;
const B2 = 1.2;

export function RegressionDemonstrator() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      param1: 0,
      param2: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPredicting(true);
    setPrediction(null);
    await new Promise((resolve) => setTimeout(resolve, 750));
    const result = B0 + B1 * values.param1 + B2 * values.param2;
    setPrediction(result);
    setIsPredicting(false);
  }

  const handleFetchExplanation = async (value: string) => {
    if (value !== 'item-1' || explanation || isExplanationLoading) return;
    setIsExplanationLoading(true);
    const result = await getFormulaExplanation();
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setExplanation(result.explanation ?? null);
    }
    setIsExplanationLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">
          Regression Reactor
        </CardTitle>
        <CardDescription>
          Predict outcomes with a simple linear regression model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="param1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Parameter 1 (x₁)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" placeholder="Enter first value" {...field} className="pl-10 text-base" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="param2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Parameter 2 (x₂)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" placeholder="Enter second value" {...field} className="pl-10 text-base" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full font-bold" disabled={isPredicting}>
              {isPredicting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Predict
            </Button>
          </form>
        </Form>
        
        {(isPredicting || prediction !== null) && (
            <div className="pt-6">
                {isPredicting ? (
                    <div className="text-center rounded-lg border border-dashed p-4 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Calculating...</p>
                        <Skeleton className="h-10 w-1/2 mx-auto"/>
                    </div>
                ) : prediction !== null ? (
                    <div className="text-center rounded-lg border border-lime-500/30 bg-lime-500/10 p-4 transition-all animate-in fade-in-50">
                        <p className="text-sm font-medium text-muted-foreground">Predicted Output (y)</p>
                        <p className="text-4xl font-bold text-[#32CD32]">
                            {prediction.toFixed(2)}
                        </p>
                    </div>
                ) : null}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full" onValueChange={handleFetchExplanation}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Formula</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-center text-lg font-mono tracking-wider bg-muted p-3 rounded-md">
                y = {B0} + {B1}x₁ + {B2}x₂
              </p>
              {isExplanationLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                explanation && <p className="text-muted-foreground text-sm leading-relaxed">{explanation}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
