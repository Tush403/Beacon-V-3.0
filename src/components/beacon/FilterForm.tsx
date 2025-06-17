
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, RotateCcw, Settings2, Filter } from 'lucide-react';
import type { FilterCriteria, EstimateEffortInput } from '@/types'; 
import { useState } from 'react'; 
import { estimateEffortAction } from '@/app/actions'; 
import { useToast } from '@/hooks/use-toast';


const filterSchema = z.object({
  applicationUnderTest: z.string().min(1, 'Please select an option').default('all'),
  testType: z.string().min(1, 'Please select an option').default('all'),
  operatingSystem: z.string().min(1, 'Please select an option').default('all'),
  codingRequirement: z.string().min(1, 'Please select an option').default('any'),
  codingLanguage: z.string().min(1, 'Please select an option').default('any'),
  pricingModel: z.string().min(1, 'Please select an option').default('any'),
  reportingAnalytics: z.string().min(1, 'Please select an option').default('any'),

  automationTool: z.string().optional().default('none'),
  complexityLow: z.coerce.number().min(0, 'Must be zero or positive').optional(),
  complexityMedium: z.coerce.number().min(0, 'Must be zero or positive').optional(),
  complexityHigh: z.coerce.number().min(0, 'Must be zero or positive').optional(),
  complexityHighlyComplex: z.coerce.number().min(0, 'Must be zero or positive').optional(),
  useStandardFramework: z.boolean().default(false),
  cicdPipelineIntegrated: z.boolean().default(false),
  qaTeamSize: z.coerce.number().min(0, 'Must be zero or positive').optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface FilterFormProps {
  onSubmit: (data: FilterFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<FilterCriteria>;
}

const defaultFormValues: FilterFormValues = {
  applicationUnderTest: 'all',
  testType: 'all',
  operatingSystem: 'all',
  codingRequirement: 'any',
  codingLanguage: 'any',
  pricingModel: 'any',
  reportingAnalytics: 'any',
  automationTool: 'none',
  complexityLow: undefined,
  complexityMedium: undefined,
  complexityHigh: undefined,
  complexityHighlyComplex: undefined,
  useStandardFramework: false,
  cicdPipelineIntegrated: false,
  qaTeamSize: undefined,
};

export function FilterForm({ onSubmit, isLoading, defaultValues }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const { toast } = useToast();
  const [isEstimatingEffort, setIsEstimatingEffort] = useState(false);

  const handleGetEstimate = async () => {
    const formData = form.getValues();
    const effortInput: EstimateEffortInput = {
      automationTool: formData.automationTool || 'None',
      complexityLow: formData.complexityLow,
      complexityMedium: formData.complexityMedium,
      complexityHigh: formData.complexityHigh,
      complexityHighlyComplex: formData.complexityHighlyComplex,
      useStandardFramework: formData.useStandardFramework || false,
      cicdPipelineIntegrated: formData.cicdPipelineIntegrated || false,
      qaTeamSize: formData.qaTeamSize,
    };

    setIsEstimatingEffort(true);
    try {
      const result = await estimateEffortAction(effortInput);
      toast({
        title: "AI Effort Estimation Result",
        description: (
          <div className="text-sm space-y-1.5">
            <p>
              <span className="font-semibold text-foreground">Estimated Effort: </span>
              {result.estimatedEffortDaysMin} - {result.estimatedEffortDaysMax} person-days
            </p>
            {result.confidenceScore !== undefined && (
               <p>
                 <span className="font-semibold text-foreground">Confidence: </span>
                 {result.confidenceScore}%
               </p>
            )}
            <div>
              <span className="font-semibold text-foreground">Explanation:</span>
              <p className="text-muted-foreground whitespace-pre-line text-xs mt-1">{result.explanation}</p>
            </div>
          </div>
        ),
        duration: 15000, 
      });
    } catch (e: any) {
      toast({
        title: 'Estimation Error',
        description: e.message || 'Failed to get effort estimate.',
        variant: 'destructive',
      });
    } finally {
      setIsEstimatingEffort(false);
    }
  };

  const filterOptions = {
    applicationUnderTest: [
      { value: 'all', label: 'All Applications' },
      { value: 'web', label: 'Web Applications' },
      { value: 'mobile', label: 'Mobile Applications' },
      { value: 'api', label: 'API / Web Services' },
      { value: 'desktop', label: 'Desktop Applications' },
    ],
    testType: [
      { value: 'all', label: 'All Test Types' },
      { value: 'ui', label: 'UI Testing' },
      { value: 'api', label: 'API Testing' },
      { value: 'performance', label: 'Performance Testing' },
      { value: 'security', label: 'Security Testing' },
      { value: 'unit', label: 'Unit Testing' },
      { value: 'integration', label: 'Integration Testing' },
    ],
    operatingSystem: [
      { value: 'all', label: 'All OS' },
      { value: 'windows', label: 'Windows' },
      { value: 'macos', label: 'MacOS' },
      { value: 'linux', label: 'Linux' },
      { value: 'cross-platform', label: 'Cross-platform' },
    ],
    codingRequirement: [
      { value: 'any', label: 'Any Requirement' },
      { value: 'codeless', label: 'Codeless' },
      { value: 'low-code', label: 'Low Code' },
      { value: 'scripting', label: 'Scripting Heavy' },
    ],
    codingLanguage: [
      { value: 'any', label: 'Any Language' },
      { value: 'javascript', label: 'JavaScript / TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'other', label: 'Other' },
    ],
    pricingModel: [
      { value: 'any', label: 'Any Model' },
      { value: 'open-source', label: 'Open Source' },
      { value: 'freemium', label: 'Freemium' },
      { value: 'subscription', label: 'Subscription-based' },
      { value: 'perpetual', label: 'Perpetual License' },
    ],
    reportingAnalytics: [
      { value: 'any', label: 'Any Analytics' },
      { value: 'basic', label: 'Basic Reporting' },
      { value: 'advanced', label: 'Advanced Analytics & Dashboards' },
      { value: 'real-time', label: 'Real-time Monitoring' },
      { value: 'integration', label: 'Integration with BI Tools' },
    ],
  };

  const handleResetToolFilters = () => {
    const toolFilterDefaults = (Object.keys(defaultFormValues) as Array<keyof FilterFormValues>)
      .reduce((acc, key) => {
        if (!['automationTool', 'complexityLow', 'complexityMedium', 'complexityHigh', 'complexityHighlyComplex', 'useStandardFramework', 'cicdPipelineIntegrated', 'qaTeamSize'].includes(key)) {
          acc[key as keyof FilterFormValues] = defaultFormValues[key as keyof FilterFormValues];
        }
        return acc;
      }, {} as Partial<FilterFormValues>);
    form.reset({...form.getValues(), ...toolFilterDefaults});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-1">
        <Accordion type="multiple" defaultValue={['filter-tools', 'ai-estimator']} className="w-full">
          <AccordionItem value="filter-tools">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
                <Filter className="mr-2 h-5 w-5" />
                Filter Tools
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {(Object.keys(filterOptions) as Array<keyof typeof filterOptions>)
              .map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof FilterFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </FormLabel>
                      <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString() ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={filterOptions[key as keyof typeof filterOptions].find(opt => opt.value === defaultFormValues[key as keyof FilterFormValues])?.label || "Select an option"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filterOptions[key as keyof typeof filterOptions].map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="space-y-3 pt-4">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    'Get AI Recommendations'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetToolFilters}
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset Tool Filters
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai-estimator">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
                <Settings2 className="mr-2 h-5 w-5" />
                AI Effort Estimator
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Provide project details to get an effort estimation.
              </p>
              <FormField
                control={form.control}
                name="automationTool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Automation Tool</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Enter tool name, or 'None'" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexityLow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity - Low (Test Cases)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexityMedium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity - Medium (Test Cases)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexityHigh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity - High (Test Cases)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexityHighlyComplex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity - Highly Complex (Test Cases)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useStandardFramework"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Using a Standard Test Framework?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cicdPipelineIntegrated"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>CI/CD Pipeline Integrated?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qaTeamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QA Team Size (Engineers)</FormLabel>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">N</AvatarFallback>
                      </Avatar>
                      <FormControl>
                        <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full" 
                onClick={handleGetEstimate}
                disabled={isEstimatingEffort}
              >
                {isEstimatingEffort ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Estimating...
                  </>
                ) : (
                  'Get Estimate'
                )}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
    
