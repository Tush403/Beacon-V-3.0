/**
 * @fileOverview A mapping of tool names to their corresponding logo image paths.
 *
 * This file provides a centralized place to manage tool logos.
 * The keys should be the lowercase version of the tool name for consistent lookups.
 * The paths should point to images stored in the `/public` directory.
 *
 * For example, if you have a logo at `public/logos/functionize.svg`,
 * the entry should be: 'functionize': '/logos/functionize.svg'
 */
export const toolLogos: Record<string, string> = {
  // Add your tool logos here. Example:
  'functionize': '/logos/functionize.svg',
  'zeta automation': '/logos/zeta_automation.png',
  'selenium': '/logos/selenium.svg',
  'playwright': '/logos/playwright.svg',
  'cypress': '/logos/cypress.svg',
  'postman': '/logos/postman.svg',
  'appium': '/logos/appium.svg',
  'jmeter': '/logos/jmeter.svg',
  'katalon studio': '/logos/katalon.svg',
};
