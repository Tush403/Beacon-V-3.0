
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
import { Loader2, RotateCcw, Settings2, Filter, ChevronsUpDown, Check, PlusCircle, GitCompare } from 'lucide-react';
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
}

const defaultFormValues: FilterFormValues = {
  applicationUnderTest: 'all',
  testType: 'all',
  operatingSystem: 'all',
  codingRequirement: 'any',
  codingLanguage: 'any',
  pricingModel: 'any',
  reportingAnalytics: 'any',
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


export function FilterForm({ onSubmit, isLoading, defaultValues }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const { toast } = useToast();
  const [isEstimatingEffort, setIsEstimatingEffort] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxCompare1Open, setComboboxCompare1Open] = useState(false);
  const [comboboxCompare2Open, setComboboxCompare2Open] = useState(false);
  const [comboboxCompare3Open, setComboboxCompare3Open] = useState(false);

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
    const toolsToCompare = [formData.toolToCompare1, formData.toolToCompare2, formData.toolToCompare3].filter(Boolean);
    if (toolsToCompare.length < 2) {
      toast({
        title: "Select More Tools",
        description: "Please select at least two tools to compare.",
        variant: "destructive",
      });
      return;
    }
    console.log("Comparing tools:", toolsToCompare);
    // Placeholder for actual comparison logic
    toast({
      title: "Comparison Initiated",
      description: `Comparing: ${toolsToCompare.join(', ')}. Display functionality coming soon.`,
    });
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
        if (!['automationTool', 'complexityLow', 'complexityMedium', 'complexityHigh', 'complexityHighlyComplex', 'useStandardFramework', 'cicdPipelineIntegrated', 'qaTeamSize', 'toolToCompare1', 'toolToCompare2', 'toolToCompare3'].includes(key)) {
          acc[key as keyof FilterFormValues] = defaultFormValues[key as keyof FilterFormValues];
        }
        return acc;
      }, {} as Partial<FilterFormValues>);
    form.reset({...form.getValues(), ...toolFilterDefaults});
  };
  
  const renderToolCombobox = (fieldName: "automationTool" | "toolToCompare1" | "toolToCompare2" | "toolToCompare3", popoverOpen: boolean, setPopoverOpen: (open: boolean) => void, placeholder: string) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        const searchTerm = field.value || "";
        const isCustomTool = searchTerm && !automationToolOptions.some(opt => opt.value.toLowerCase() === searchTerm.toLowerCase());
        
        return (
          <FormItem>
            <FormLabel>{fieldName.startsWith("toolToCompare") ? `Tool ${fieldName.slice(-1)}` : "Automation Tool (Optional)"}</FormLabel>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between text-xs",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? automationToolOptions.find(
                          (option) => option.value === field.value
                        )?.label || field.value
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command
                  value={field.value || ""}
                  onValueChange={(currentValue) => {
                    field.onChange(currentValue);
                  }}
                >
                  <CommandInput
                    placeholder="Search tool or type custom..."
                    className="text-xs"
                  />
                  <CommandEmpty>
                    {searchTerm && !automationToolOptions.some(opt => opt.value.toLowerCase() === searchTerm.toLowerCase())
                      ? `Press Enter or click to use "${searchTerm}"`
                      : "No tool found."}
                  </CommandEmpty>
                  <CommandList>
                    {automationToolOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          form.setValue(fieldName, option.value, { shouldValidate: true });
                          setPopoverOpen(false);
                        }}
                        className="text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                    {isCustomTool && (
                      <CommandItem
                        key={searchTerm}
                        value={searchTerm}
                        onSelect={() => {
                          form.setValue(fieldName, searchTerm, { shouldValidate: true });
                          setPopoverOpen(false);
                        }}
                        className="text-xs"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Use custom tool: "{searchTerm}"
                      </CommandItem>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
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
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Provide project details to get an effort estimation.
              </p>
              {renderToolCombobox("automationTool", comboboxOpen, setComboboxOpen, "Select a tool or type custom")}
              
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

          <AccordionItem value="compare-tools">
            <AccordionTrigger>
              <div className="flex items-center text-base font-semibold text-primary hover:no-underline">
                <GitCompare className="mr-2 h-5 w-5" />
                Compare Tools
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pt-4 pb-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Select up to 3 tools for a side-by-side comparison.
              </p>
              {renderToolCombobox("toolToCompare1", comboboxCompare1Open, setComboboxCompare1Open, "Select Tool 1 or type custom")}
              {renderToolCombobox("toolToCompare2", comboboxCompare2Open, setComboboxCompare2Open, "Select Tool 2 or type custom")}
              {renderToolCombobox("toolToCompare3", comboboxCompare3Open, setComboboxCompare3Open, "Select Tool 3 or type custom")}
              <Button 
                type="button" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                onClick={handleCompareTools}
              >
                Compare Selected Tools
              </Button>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </form>
    </Form>
  );
}

