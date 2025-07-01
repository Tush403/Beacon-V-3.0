
// src/lib/tool-analysis-data.ts
import type { ToolAnalysisItem } from '@/types';

// Using a Record with a consistent key (lowercase tool name) for fast lookups.
// The data object omits the `toolName` property as it's redundant with the key.
export const localToolAnalysisData: Record<string, Omit<ToolAnalysisItem, 'toolName'>> = {
  'zeta automation': {
    strengths: 'High script reusability\nBroad automation coverage (UI, API, etc.)\nExcellent parallel execution support\nTemplate-based creation speed',
    weaknesses: 'Requires moderate Java and Maven knowledge\nIncludes the overhead of managing internal open-source infrastructure',
    applicationTypes: ['Web', 'API', 'DB', 'Security'],
    testTypes: ['UI Testing', 'API Testing', 'Security Testing'],
  },
  'functionize': {
    strengths: 'AI-powered self-healing capabilities dramatically reduce test maintenance\nVery fast test creation using natural language\nExcellent for testing highly dynamic applications',
    weaknesses: "Can be a 'black box', making complex debugging difficult\nLess granular control compared to code-based frameworks\nSubscription cost may be a factor",
    applicationTypes: ['Web', 'API'],
    testTypes: ['UI Testing', 'API Testing', 'E2E Testing'],
  },
  'playwright': {
    strengths: 'Reliable end-to-end testing across all modern browsers\nAuto-waits and reliable execution prevent flakiness\nPowerful tooling like Codegen, Trace Viewer, and Test Runner',
    weaknesses: 'Primarily focused on web applications\nCan have a steeper learning curve than codeless tools',
    applicationTypes: ['Web'],
    testTypes: ['E2E Testing', 'API Testing', 'Component Testing'],
  },
  'postman': {
    strengths: 'Comprehensive toolset for the entire API lifecycle\nUser-friendly interface for creating and testing requests\nStrong collaboration and documentation features',
    weaknesses: 'Can be resource-intensive\nUI testing capabilities are limited compared to specialized tools',
    applicationTypes: ['API'],
    testTypes: ['API Testing', 'Integration Testing'],
  },
  'selenium': {
    strengths: 'Massive community support and extensive documentation\nSupports a wide range of programming languages\nHighly flexible and extensible for complex scenarios',
    weaknesses: 'Steeper learning curve; requires strong programming skills\nNo built-in reporting tools\nCan be prone to flaky tests without careful design',
    applicationTypes: ['Web'],
    testTypes: ['UI Testing', 'Regression Testing', 'E2E Testing'],
  },
  'cypress': {
    strengths: 'Excellent developer experience with real-time reloads\nPowerful debugging tools (time travel, snapshots)\nAll-in-one framework, less setup required',
    weaknesses: "Only supports JavaScript/TypeScript\nLimited to single-browser instance testing within a single test run\nDoesn't support multiple tabs or iframes as easily as Playwright",
    applicationTypes: ['Web'],
    testTypes: ['E2E Testing', 'Component Testing', 'Integration Testing'],
  },
  'testcomplete': {
    strengths: 'Supports desktop, web, and mobile applications\nAI-powered object recognition for robust UI tests\nKeyword-driven and data-driven testing support',
    weaknesses: 'Primarily Windows-based for test creation\nCan be expensive for small teams\nUI can feel dated compared to modern tools',
    applicationTypes: ['Desktop', 'Web', 'Mobile'],
    testTypes: ['UI Testing', 'Functional Testing', 'Regression Testing'],
  },
  'ranorex studio': {
    strengths: 'Powerful object recognition for desktop and web\nCodeless test creation and full code-based flexibility\nExcellent for testing legacy desktop applications',
    weaknesses: 'Windows-only environment\nLicensing can be costly\nLess suited for pure API testing compared to specialized tools',
    applicationTypes: ['Desktop', 'Web', 'Mobile'],
    testTypes: ['UI Testing', 'E2E Testing', 'Regression Testing'],
  },
  'appium': {
    strengths: 'Open-source standard for mobile app automation\nSupports both iOS and Android native/hybrid apps\nUses standard WebDriver protocol, allowing language flexibility',
    weaknesses: 'Setup can be complex and time-consuming\nExecution can be slower than native frameworks (Espresso/XCUITest)\nDependent on OS and device updates',
    applicationTypes: ['Mobile'],
    testTypes: ['UI Testing', 'Functional Testing'],
  },
  'katalon studio': {
    strengths: 'User-friendly interface for both beginners and experts\nBuilt-in keywords and templates for faster test creation\nSupports Web, API, Mobile, and Desktop testing',
    weaknesses: 'Can be slow and resource-heavy\nFree version has limitations, pushing users to paid tiers\nDebugging can be less intuitive than code-native tools',
    applicationTypes: ['Web', 'API', 'Mobile', 'Desktop'],
    testTypes: ['UI Testing', 'API Testing', 'E2E Testing'],
  },
  'mabl': {
    strengths: 'AI-driven low-code test automation\nSelf-healing tests adapt to UI changes automatically\nExcellent for CI/CD integration and fast feedback',
    weaknesses: 'Less control for complex, customized test logic\nCloud-based, which may not suit all security requirements\nSubscription cost can be high',
    applicationTypes: ['Web'],
    testTypes: ['UI Testing', 'E2E Testing', 'Visual Testing'],
  },
  'testim': {
    strengths: 'AI-powered locators for stable tests\nFast test authoring with record-and-playback\nGood for cross-browser and responsive testing',
    weaknesses: 'Can be a "black box" for debugging\nPrimarily focused on web UI testing\nPricing based on test runs can become expensive',
    applicationTypes: ['Web'],
    testTypes: ['UI Testing', 'E2E Testing', 'Functional Testing'],
  },
  'cucumber': {
    strengths: 'Promotes collaboration with BDD (Behavior-Driven Development)\nPlain language specifications are easy for non-tech stakeholders to understand\nIntegrates well with other automation frameworks like Selenium',
    weaknesses: 'Adds an extra layer of abstraction which can be complex\nRequires discipline to maintain feature files\nNot a standalone testing tool; needs a driver like Selenium/Playwright',
    applicationTypes: ['Web', 'API', 'Mobile'],
    testTypes: ['Acceptance Testing', 'BDD'],
  },
  'jmeter': {
    strengths: 'Powerful open-source tool for performance and load testing\nHighly extensible with plugins\nCan test a wide variety of protocols (HTTP, FTP, JDBC, etc.)',
    weaknesses: 'GUI can be resource-intensive; CLI mode is preferred for heavy loads\nSteep learning curve\nReporting capabilities are basic out-of-the-box',
    applicationTypes: ['API', 'Web Services', 'Web'],
    testTypes: ['Performance Testing', 'Load Testing', 'Stress Testing'],
  },
};
