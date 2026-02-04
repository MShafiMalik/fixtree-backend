import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOne(
  propertyNames: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName,
      constraints: [propertyNames],
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const [properties] = args.constraints as [string[]];
          const obj = args.object as Record<string, unknown>;
          return properties.some((property) => {
            const value = obj[property];
            return value !== undefined && value !== null && value !== '';
          });
        },
      },
    });
  };
}
