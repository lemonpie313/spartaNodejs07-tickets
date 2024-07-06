import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOne', async: false })
export class AtLeastOneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedProperty1, relatedProperty2] = args.constraints;
    const relatedValue1 = (args.object as any)[relatedProperty1];
    const relatedValue2 = (args.object as any)[relatedProperty2];
    return relatedValue1 || relatedValue2;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName1, relatedPropertyName2] = args.constraints;
    return '공연id 혹은 공연명을 입력...어쩌고..';
  }
}
