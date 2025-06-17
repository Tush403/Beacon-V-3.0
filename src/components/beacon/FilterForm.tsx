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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Keep Card for structure if Sidebar doesn't have header
import { Filter, Loader2 } from 'lucide-react';
import type { FilterCriteria } from '@/types';

const filterSchema = z.object({
  complexityMedium: z.coerce.number().min(0, 'Must be non-negative').default(30),
  complexityHigh: z.coerce.number().min(0, 'Must be non-negative').default(15),
  complexityHighlyComplex: z.coerce.number().min(0, 'Must be non-negative').default(5),
  useStandardFramework: z.boolean().default(false),
  cicdPipelineIntegrated: z.boolean().default(false),
  qaTeamSize: z.coerce.number().int().positive('Must be a positive integer').default(1),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface FilterFormProps {
  onSubmit: (data: FilterFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<FilterCriteria>;
}

export function FilterForm({ onSubmit, isLoading, defaultValues }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      complexityMedium: defaultValues?.complexityMedium ?? 30,
      complexityHigh: defaultValues?.complexityHigh ?? 15,
      complexityHighlyComplex: defaultValues?.complexityHighlyComplex ?? 5,
      useStandardFramework: defaultValues?.useStandardFramework ?? false,
      cicdPipelineIntegrated: defaultValues?.cicdPipelineIntegrated ?? false,
      qaTeamSize: defaultValues?.qaTeamSize ?? 1,
    },
  });

  return (
    // The Card component might be redundant if used within SidebarHeader context
    // For now, keeping it simple and letting the parent structure (Sidebar) handle titles if needed
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1"> {/* Reduced padding if inside sidebar */}
        <FormField
          control={form.control}
          name="complexityMedium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complexity - Medium (Test Cases)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 30" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} />
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
                <Input type="number" placeholder="e.g., 15" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} />
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
                <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="useStandardFramework"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
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
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">N</AvatarFallback>
                </Avatar>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1" {...field} className="w-full" onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </form>
    </Form>
  );
}
