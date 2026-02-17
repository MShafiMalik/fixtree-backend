import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that minimumPrice is less than or equal to maximumPrice
 * Only validates when both values are provided
 */
export function PriceRange(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'priceRange',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const obj = args.object as {
            minimumPrice?: number;
            maximumPrice?: number;
          };

          const minPrice = obj.minimumPrice;
          const maxPrice = obj.maximumPrice;

          // Only validate if both prices are provided
          if (minPrice !== undefined && maxPrice !== undefined) {
            return minPrice <= maxPrice;
          }

          // If only one or neither is provided, validation passes
          return true;
        },
        defaultMessage(): string {
          return (
            (validationOptions?.message as string) ||
            'Minimum price cannot be greater than maximum price'
          );
        },
      },
    });
  };
}
