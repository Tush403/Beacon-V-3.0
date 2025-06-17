
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, RotateCcw } from 'lucide-react';
import type { FilterCriteria } from '@/types';

const filterSchema = z.object({
  applicationUnderTest: z.string().min(1, 'Please select an option').default('all'),
  testType: z.string().min(1, 'Please select an option').default('all'),
  operatingSystem: z.string().min(1, 'Please select an option').default('all'),
  codingRequirement: z.string().min(1, 'Please select an option').default('any'),
  codingLanguage: z.string().min(1, 'Please select an option').default('any'),
  pricingModel: z.string().min(1, 'Please select an option').default('any'),
  reportingAnalytics: z.string().min(1, 'Please select an option').default('any'),
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
};

export function FilterForm({ onSubmit, isLoading, defaultValues }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        {(Object.keys(filterOptions) as Array<keyof typeof filterOptions>).map((key) => (
          <FormField
            key={key}
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={filterOptions[key].find(opt => opt.value === defaultFormValues[key])?.label || "Select an option"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filterOptions[key].map((option) => (
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
            onClick={() => form.reset(defaultFormValues)}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
