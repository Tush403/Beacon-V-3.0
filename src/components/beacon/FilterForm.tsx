
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
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
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, RotateCcw, Settings2, Filter, Check, PlusCircle, SlidersHorizontal, X, CheckCircle } from 'lucide-react';
import type { FilterCriteria, EstimateEffortInput, EstimateEffortOutput } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { automationToolOptions } from '@/lib/tool-options';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EffortEstimationResultCard } from './EffortEstimationResultCard';
import { useToast } from '@/hooks/use-toast';


const filterSchema = z.object({
  applicationUnderTest: z.string().min(1, 'Please select an option').default('all'),
  testType: z.string().min(1, 'Please select an option').default('all'),
  operatingSystem: z.string().min(1, 'Please select an option').default('all'),
  codingRequirement: z.string().min(1, 'Please select an option').default('any'),
  codingLanguage: z.string().min(1, 'Please select an option').default('any'),
  pricingModel: z.string().min(1, 'Please select an option').default('any'),
  reportingAnalytics: z.string().min(1, 'Please select an option').default('any'),

  // Advanced Filters
  applicationSubCategory: z.string().optional().default('any'),
  integrationCapabilities: z.string().optional().default('any'),
  teamSizeSuitability: z.string().optional().default('any'),
  keyFeatureFocus: z.string().optional().default('any'),

  automationTool: z.string().optional(),
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
  onEstimate: (input: EstimateEffortInput) => void;
  estimationResult: EstimateEffortOutput | null;
  onClearEstimation: () => void;
}

const defaultFormValues: FilterFormValues = {
  applicationUnderTest: 'all',
  testType: 'all',
  operatingSystem: 'all',
  codingRequirement: 'any',
  codingLanguage: 'any',
  pricingModel: 'any',
  reportingAnalytics: 'any',

  applicationSubCategory: 'any',
  integrationCapabilities: 'any',
  teamSizeSuitability: 'any',
  keyFeatureFocus: 'any',

  automationTool: undefined,
  complexityLow: undefined,
  complexityMedium: undefined,
  complexityHigh: undefined,
  complexityHighlyComplex: undefined,
  useStandardFramework: false,
  cicdPipelineIntegrated: false,
  qaTeamSize: undefined,
};

const ToolCombobox = ({
  fieldName,
  placeholder,
}: {
  fieldName: 'automationTool';
  placeholder: string;
}) => {
  const form = useFormContext<FilterFormValues>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const currentFieldValue = form.watch(fieldName);

  useEffect(() => {
      const selectedOption = automationToolOptions.find(opt => opt.value === currentFieldValue);
      setSearchValue(selectedOption ? selectedOption.label : currentFieldValue || '');
  }, [currentFieldValue, popoverOpen]);
  
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Automation Tool (Optional)</FormLabel>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className={cn(
                    "w-full justify-between items-center text-xs h-9 px-2 py-2 font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <span className="line-clamp-1 text-left">
                    {field.value
                      ? automationToolOptions.find(option => option.value === field.value)?.label || String(field.value)
                      : placeholder}
                  </span>
                  
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search tool or type custom..."
                  className="text-xs"
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>
                  {searchValue.trim() && !automationToolOptions.some(opt => opt.label.toLowerCase() === searchValue.trim().toLowerCase())
                    ? `No tool found. Click to use "${searchValue.trim()}"`
                    : "No tool found."}
                </CommandEmpty>
                <CommandList>
                  {automationToolOptions
                    .filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase().trim()))
                    .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label} 
                      onSelect={() => {
                        form.setValue(fieldName, option.value, { shouldValidate: true });
                        setPopoverOpen(false);
                      }}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                  {searchValue.trim() && !automationToolOptions.some(opt => opt.label.toLowerCase() === searchValue.trim().toLowerCase()) && (
                    <CommandItem
                      key={searchValue.trim()}
                      value={searchValue.trim()}
                      onSelect={() => {
                        form.setValue(fieldName, searchValue.trim(), { shouldValidate: true });
                        setPopoverOpen(false);
                      }}
                      className="text-xs"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Use custom tool: "{searchValue.trim()}"
                    </CommandItem>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function FilterForm({ onSubmit, isLoading, defaultValues, onEstimate, estimationResult, onClearEstimation }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });
  const { toast } = useToast();

  const estimatorRef = useRef<HTMLDivElement>(null);
  const advancedFiltersRef = useRef<HTMLDivElement>(null);


  const handleGetEstimate = () => {
    const formData = form.getValues();
    const effortInput: EstimateEffortInput = {
      automationTool: formData.automationTool ? (automationToolOptions.find(opt => opt.value === formData.automationTool)?.label || formData.automationTool) : 'None',
      complexityLow: formData.complexityLow,
      complexityMedium: formData.complexityMedium,
      complexityHigh: formData.complexityHigh,
      complexityHighlyComplex: formData.complexityHighlyComplex,
      useStandardFramework: formData.useStandardFramework || false,
      cicdPipelineIntegrated: formData.cicdPipelineIntegrated || false,
      qaTeamSize: formData.qaTeamSize,
      projectDescription: formData.automationTool ? `Effort estimation considering ${automationToolOptions.find(opt => opt.value === formData.automationTool)?.label || formData.automationTool}.` : undefined,
    };
    onEstimate(effortInput);
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
      { value: 'ai-ml', label: 'AI/ML' },
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

  const advancedFilterOptions = {
    applicationSubCategory: [
        { value: 'any', label: 'Any Sub-Category' },
        { value: 'e-commerce', label: 'E-commerce' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'fintech', label: 'Fintech' },
        { value: 'saas', label: 'SaaS' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'media-entertainment', label: 'Media/Entertainment' },
        { value: 'social-media', label: 'Social Media' },
        { value: 'education', label: 'Education' },
        { value: 'travel-hospitality', label: 'Travel/Hospitality' },
        { value: 'other-specific', label: 'Other Specific Industry' },
    ],
    integrationCapabilities: [
        { value: 'any', label: 'Any Integrations' },
        { value: 'jira', label: 'Jira' },
        { value: 'jenkins-ci-cd', label: 'Jenkins / General CI/CD' },
        { value: 'slack-teams', label: 'Slack / Teams' },
        { value: 'git', label: 'Version Control (Git)' },
        { value: 'test-management', label: 'Test Management Tools (e.g., TestRail, Zephyr)' },
        { value: 'bi-tools', label: 'BI Tools (e.g., Tableau, PowerBI)' },
    ],
    teamSizeSuitability: [
        { value: 'any', label: 'Any Team Size' },
        { value: 'individual', label: 'Individual Developer' },
        { value: 'small-team', label: 'Small Team (2-10)' },
        { value: 'medium-team', label: 'Medium Team (11-50)' },
        { value: 'large-team', label: 'Large Team (51-200)' },
        { value: 'enterprise', label: 'Enterprise (>200)' },
    ],
    keyFeatureFocus: [
        { value: 'any', label: 'Any Key Feature' },
        { value: 'visual-regression', label: 'Visual Regression Testing' },
        { value: 'bdd-support', label: 'BDD Support (Cucumber, SpecFlow)' },
        { value: 'ai-scripting', label: 'AI-assisted Scripting/Maintenance' },
        { value: 'cross-platform-cloud', label: 'Cross-browser/Device Cloud Execution' },
        { value: 'api-mocking', label: 'API Mocking/Service Virtualization' },
        { value: 'security-focus', label: 'Security Testing Features (SAST/DAST)' },
        { value: 'performance-focus', label: 'Performance/Load Testing Focus' },
        { value: 'accessibility-focus', label: 'Accessibility Testing Features' },
    ],
  };


  const handleResetAllFilters = () => {
    form.reset(defaultFormValues);
    onClearEstimation();
    toast({
      variant: 'success',
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold">Filters Cleared</span>
        </div>
      ),
      description: 'All your filter selections have been reset.',
      duration: 2000,
    });
  };


  const RecommendationActionButtons = () => (
    <div className="space-y-3 pt-6 border-t mt-4">
      <Button type="submit" className="w-full" variant="accent" disabled={isLoading}>
        Get AI Recommendations
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleResetAllFilters}
        className="w-full"
        disabled={isLoading}
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset All Filters
      </Button>
    </div>
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-1">
        <Accordion type="multiple" className="w-full" defaultValue={['filter-tools']}>
          <AccordionItem value="filter-tools">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-foreground hover:no-underline">
                <Filter className="mr-2 h-5 w-5" />
                Filter Tools
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
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
                          value={field.value?.toString() ?? ""}
                          disabled={isLoading}
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
              <RecommendationActionButtons />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced-filters" ref={advancedFiltersRef}>
            <AccordionTrigger
              onClick={() => {
                setTimeout(() => {
                  advancedFiltersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
              }}
            >
              <div className="flex items-center text-base font-semibold text-foreground hover:no-underline">
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Advanced Filters
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              {(Object.keys(advancedFilterOptions) as Array<keyof typeof advancedFilterOptions>)
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
                          value={field.value?.toString() ?? ""}
                          disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={advancedFilterOptions[key as keyof typeof advancedFilterOptions].find(opt => opt.value === defaultFormValues[key as keyof FilterFormValues])?.label || "Select an option"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {advancedFilterOptions[key as keyof typeof advancedFilterOptions].map((option) => (
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
               <RecommendationActionButtons />
            </AccordionContent>
          </AccordionItem>


          <AccordionItem value="ai-estimator" ref={estimatorRef}>
            <AccordionTrigger onClick={() => {
              setTimeout(() => {
                estimatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }}>
              <div className="flex items-center text-base font-semibold text-foreground hover:no-underline">
                <Settings2 className="mr-2 h-5 w-5" />
                AI Effort Estimator
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              {estimationResult ? (
                <EffortEstimationResultCard 
                  estimationResult={estimationResult}
                  onClose={onClearEstimation}
                />
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Provide project details to get an effort estimation.
                  </p>
                  <ToolCombobox
                    fieldName="automationTool"
                    placeholder="Select a tool or type custom"
                  />

                  <FormField
                    control={form.control}
                    name="complexityLow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complexity - Low (Test Cases)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} onWheel={(e) => (e.target as HTMLElement).blur()} />
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
                          <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} onWheel={(e) => (e.target as HTMLElement).blur()} />
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
                          <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} onWheel={(e) => (e.target as HTMLElement).blur()} />
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
                          <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} onWheel={(e) => (e.target as HTMLElement).blur()} />
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
                            <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} onWheel={(e) => (e.target as HTMLElement).blur()} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="accent"
                    className="w-full"
                    onClick={handleGetEstimate}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Get Estimate'}
                  </Button>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
