export interface CountrySeedData {
  name: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
}

export const getCountriesSeedData = (): CountrySeedData[] => [
  {
    name: 'United States',
    code: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
  },
  {
    name: 'United Kingdom',
    code: 'UK',
    currencyCode: 'GBP',
    currencySymbol: '£',
  },
  {
    name: 'Canada',
    code: 'CA',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
  },
  {
    name: 'Australia',
    code: 'AU',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
  },
  {
    name: 'Germany',
    code: 'DE',
    currencyCode: 'EUR',
    currencySymbol: '€',
  },
  {
    name: 'France',
    code: 'FR',
    currencyCode: 'EUR',
    currencySymbol: '€',
  },
  {
    name: 'India',
    code: 'IN',
    currencyCode: 'INR',
    currencySymbol: '₹',
  },
  {
    name: 'Pakistan',
    code: 'PK',
    currencyCode: 'PKR',
    currencySymbol: 'Rs',
  },
];
