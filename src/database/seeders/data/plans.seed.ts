export interface PlanSeedData {
  name: string;
  countryCode: string;
  description: string;
  serviceLimit: number;
  price: number;
  canExtendBookingTime: boolean;
  isDefault: boolean;
}

export const getPlansSeedData = (): PlanSeedData[] => {
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN', 'PK'];
  const plans: PlanSeedData[] = [];

  // Pricing by country in cents (example prices)
  const pricing: Record<
    string,
    { basic: number; plus: number; premium: number }
  > = {
    US: { basic: 0, plus: 999, premium: 1999 }, // $9.99, $19.99
    UK: { basic: 0, plus: 799, premium: 1599 }, // £7.99, £15.99
    CA: { basic: 0, plus: 1299, premium: 2499 }, // C$12.99, C$24.99
    AU: { basic: 0, plus: 1499, premium: 2999 }, // A$14.99, A$29.99
    DE: { basic: 0, plus: 899, premium: 1799 }, // €8.99, €17.99
    FR: { basic: 0, plus: 899, premium: 1799 }, // €8.99, €17.99
    IN: { basic: 0, plus: 499, premium: 999 }, // ₹499, ₹999
    PK: { basic: 0, plus: 1999, premium: 3999 }, // PKR 1999, PKR 3999
  };

  countries.forEach((countryCode) => {
    const prices = pricing[countryCode] ?? {
      basic: 0,
      plus: 999,
      premium: 1999,
    };

    // Basic Plan
    plans.push({
      name: 'Basic',
      countryCode,
      description: 'Basic plan allows up to 5 services',
      serviceLimit: 5,
      price: prices.basic,
      canExtendBookingTime: false,
      isDefault: true,
    });

    // Plus Plan
    plans.push({
      name: 'Plus',
      countryCode,
      description: 'Plus plan allows up to 10 services',
      serviceLimit: 10,
      price: prices.plus,
      canExtendBookingTime: false,
      isDefault: false,
    });

    // Premium Plan
    plans.push({
      name: 'Premium',
      countryCode,
      description:
        'Premium plan allows up to 30 services with booking time extension feature',
      serviceLimit: 30,
      price: prices.premium,
      canExtendBookingTime: true,
      isDefault: false,
    });
  });

  return plans;
};
