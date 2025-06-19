
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
import { Loader2, RotateCcw, Settings2, Filter, ChevronsUpDown, Check, PlusCircle, GitCompare, XCircle, SlidersHorizontal } from 'lucide-react';
import type { FilterCriteria, EstimateEffortInput } from '@/types';
import { useState, useEffect } from 'react';
import { estimateEffortAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


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

  toolToCompare1: z.string().optional(),
  toolToCompare2: z.string().optional(),
  toolToCompare3: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface FilterFormProps {
  onSubmit: (data: FilterFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<FilterCriteria>;
  onCompareSubmit: (toolDisplayNames: string[]) => Promise<void>;
  isComparing: boolean;
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
  toolToCompare1: undefined,
  toolToCompare2: undefined,
  toolToCompare3: undefined,
};

const automationToolOptions = [
  { value: "selenium", label: "Selenium" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
  { value: "appium", label: "Appium" },
  { value: "katalon_studio", label: "Katalon Studio" },
  { value: "testcomplete", label: "TestComplete" },
  { value: "ranorex", label: "Ranorex" },
  { value: "postman", label: "Postman" },
  { value: "restassured", label: "Rest Assured" },
  { value: "jmeter", label: "JMeter" },
  { value: "soapui", label: "SoapUI" },
  { value: "puppeteer", label: "Puppeteer" },
  { value: "webdriverio", label: "WebdriverIO" },
  { value: "robot_framework", label: "Robot Framework" },
  { value: "testcafe", label: "TestCafe" },
  { value: "mabl", label: "Mabl (AI)" },
  { value: "testim", label: "Testim (AI)" },
  { value: "accelq", label: "ACCELQ (AI, Codeless)" },
  { value: "tricentis_tosca", label: "Tricentis Tosca" },
  { value: "eggplant", label: "Eggplant (by Keysight)" },
  { value: "lambdatest", label: "LambdaTest (Cloud Platform)" },
  { value: "browserstack_automate", label: "BrowserStack Automate (Cloud Platform)" },
  { value: "percy", label: "Percy (Visual Testing, AI)" },
  { value: "kobiton", label: "Kobiton (Mobile Cloud)" },
  { value: "perfecto", label: "Perfecto (Mobile & Web Cloud)" },
  { value: "functionize", label: "Functionize (AI)" },
  { value: "applitools", label: "Applitools (Visual AI)" },
  { value: "saucelabs", label: "Sauce Labs (Cloud Platform)" },
  { value: "testsigma", label: "TestSigma (AI, Low-code)" },
  { value: "leapwork", label: "Leapwork (Codeless)" },
  { value: "gauge", label: "Gauge (by ThoughtWorks)" },
  { value: "karate_dsl", label: "Karate DSL (API/UI)" },
  { value: "cucumber", label: "Cucumber (BDD)" },
  { value: "specflow", label: "SpecFlow (BDD for .NET)" },
  { value: "k6", label: "Grafana k6 (Performance)" },
  { value: "gatling", label: "Gatling (Performance)" },
  { value: "sahi_pro", label: "Sahi Pro (Web Automation)" },
  { value: "uft_one", label: "Micro Focus UFT One" },
  { value: "reflect_run", label: "Reflect (Codeless, AI)" },
  { value: "ghost_inspector", label: "Ghost Inspector (Codeless, UI Monitoring)" },
  { value: "detox", label: "Detox (Mobile E2E for React Native)" },
  { value: "espresso", label: "Espresso (Android UI Testing)" },
  { value: "xcuitest", label: "XCUITest (iOS UI Testing)" },
  { value: "newman", label: "Newman (Postman CLI)" },
];


export function FilterForm({ onSubmit, isLoading, defaultValues, onCompareSubmit, isComparing }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const { toast } = useToast();
  const [isEstimatingEffort, setIsEstimatingEffort] = useState(false);

  const [automationToolPopoverOpen, setAutomationToolPopoverOpen] = useState(false);
  const [toolToCompare1PopoverOpen, setToolToCompare1PopoverOpen] = useState(false);
  const [toolToCompare2PopoverOpen, setToolToCompare2PopoverOpen] = useState(false);
  const [toolToCompare3PopoverOpen, setToolToCompare3PopoverOpen] = useState(false);

  const [automationToolSearch, setAutomationToolSearch] = useState('');
  const [toolToCompare1Search, setToolToCompare1Search] = useState('');
  const [toolToCompare2Search, setToolToCompare2Search] = useState('');
  const [toolToCompare3Search, setToolToCompare3Search] = useState('');


  const handleGetEstimate = async () => {
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

  const handleCompareTools = () => {
    const formData = form.getValues();
    const toolValues = [formData.toolToCompare1, formData.toolToCompare2, formData.toolToCompare3].filter(Boolean) as string[];

    if (toolValues.length < 2) {
      toast({
        title: "Select More Tools",
        description: "Please select at least two tools to compare.",
        variant: "destructive",
      });
      return;
    }

    const toolDisplayNames = toolValues.map(value => {
      const option = automationToolOptions.find(opt => opt.value === value);
      return option ? option.label : value;
    });

    onCompareSubmit(toolDisplayNames);
  };
  
  const handleResetCompareTools = () => {
    form.setValue('toolToCompare1', undefined);
    form.setValue('toolToCompare2', undefined);
    form.setValue('toolToCompare3', undefined);
    setToolToCompare1Search('');
    setToolToCompare2Search('');
    setToolToCompare3Search('');
    setToolToCompare1PopoverOpen(false);
    setToolToCompare2PopoverOpen(false);
    setToolToCompare3PopoverOpen(false);
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
    setAutomationToolSearch('');
    handleResetCompareTools(); 
  };


  const renderToolCombobox = (
    fieldName: "automationTool" | "toolToCompare1" | "toolToCompare2" | "toolToCompare3",
    popoverOpen: boolean,
    setPopoverOpen: (open: boolean) => void,
    placeholder: string,
    currentSearchValue: string,
    setCurrentSearchValue: (value: string) => void
  ) => {
    const currentFieldValue = form.watch(fieldName);

    useEffect(() => {
      if (popoverOpen) {
        const selectedOption = automationToolOptions.find(opt => opt.value === currentFieldValue);
        setCurrentSearchValue(selectedOption ? selectedOption.label : currentFieldValue || '');
      }
    }, [popoverOpen, currentFieldValue, setCurrentSearchValue]);
    
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldName.startsWith("toolToCompare") ? `Tool ${fieldName.slice(-1)}` : "Automation Tool (Optional)"}</FormLabel>
            <Popover open={popoverOpen} onOpenChange={(isOpen) => {
              setPopoverOpen(isOpen);
              if (!isOpen) { 
                const selectedOption = automationToolOptions.find(opt => opt.value === field.value);
                setCurrentSearchValue(selectedOption ? selectedOption.label : field.value || '');
              } else { 
                 const selectedOption = automationToolOptions.find(opt => opt.value === field.value);
                 setCurrentSearchValue(selectedOption ? selectedOption.label : field.value || '');
              }
            }}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className={cn(
                      "w-full justify-between text-xs",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? automationToolOptions.find(option => option.value === field.value)?.label || field.value
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search tool or type custom..."
                    className="text-xs"
                    value={currentSearchValue}
                    onValueChange={setCurrentSearchValue}
                  />
                  <CommandEmpty>
                    {currentSearchValue.trim() && !automationToolOptions.some(opt => opt.label.toLowerCase() === currentSearchValue.trim().toLowerCase())
                      ? `No tool found. Click to use "${currentSearchValue.trim()}"`
                      : "No tool found."}
                  </CommandEmpty>
                  <CommandList>
                    {automationToolOptions
                      .filter(option => option.label.toLowerCase().includes(currentSearchValue.toLowerCase().trim()))
                      .map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label} 
                        onSelect={() => {
                          form.setValue(fieldName, option.value, { shouldValidate: true });
                          setCurrentSearchValue(option.label);
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
                    {currentSearchValue.trim() && !automationToolOptions.some(opt => opt.label.toLowerCase() === currentSearchValue.trim().toLowerCase()) && (
                      <CommandItem
                        key={currentSearchValue.trim()}
                        value={currentSearchValue.trim()}
                        onSelect={() => {
                          form.setValue(fieldName, currentSearchValue.trim(), { shouldValidate: true });
                          setPopoverOpen(false);
                        }}
                        className="text-xs"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Use custom tool: "{currentSearchValue.trim()}"
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
  
  const RecommendationActionButtons = () => (
    <div className="space-y-3 pt-6 border-t mt-4">
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
        onClick={handleResetAllFilters}
        className="w-full"
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
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
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

          <AccordionItem value="advanced-filters">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
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


          <AccordionItem value="ai-estimator">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
                <Settings2 className="mr-2 h-5 w-5" />
                AI Effort Estimator
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Provide project details to get an effort estimation.
              </p>
              {renderToolCombobox(
                "automationTool",
                automationToolPopoverOpen,
                setAutomationToolPopoverOpen,
                "Select a tool or type custom",
                automationToolSearch,
                setAutomationToolSearch
              )}

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
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
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

          <AccordionItem value="compare-tools">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
                <GitCompare className="mr-2 h-5 w-5" />
                Compare Tools
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Select 2 to 3 tools for a side-by-side comparison.
              </p>
              {renderToolCombobox(
                "toolToCompare1",
                toolToCompare1PopoverOpen,
                setToolToCompare1PopoverOpen,
                "Select Tool 1 or type custom",
                toolToCompare1Search,
                setToolToCompare1Search
              )}
              {renderToolCombobox(
                "toolToCompare2",
                toolToCompare2PopoverOpen,
                setToolToCompare2PopoverOpen,
                "Select Tool 2 or type custom",
                toolToCompare2Search,
                setToolToCompare2Search
              )}
              {renderToolCombobox(
                "toolToCompare3",
                toolToCompare3PopoverOpen,
                setToolToCompare3PopoverOpen,
                "Select Tool 3 or type custom",
                toolToCompare3Search,
                setToolToCompare3Search
              )}
              <div className="space-y-2">
                <Button
                  type="button"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleCompareTools}
                  disabled={isComparing ||
                    (form.watch('toolToCompare1') ? 0 : 1) +
                    (form.watch('toolToCompare2') ? 0 : 1) +
                    (form.watch('toolToCompare3') ? 0 : 1) > 1 
                  }
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    'Compare Selected Tools'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResetCompareTools}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reset Selections
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}

