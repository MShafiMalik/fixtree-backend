import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that exactly one of the given properties has a value (not undefined, null, or empty string).
 */
export function ExactlyOne(
  propertyNames: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'exactlyOne',
      target: object.constructor,
      propertyName,
      constraints: [propertyNames],
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const [properties] = args.constraints as [string[]];
          const obj = args.object as Record<string, unknown>;
          const count = properties.filter((prop) => {
            const value = obj[prop];
            return value !== undefined && value !== null && value !== '';
          }).length;
          return count === 1;
        },
      },
    });
  };
}
