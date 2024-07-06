import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'useUserInfoOption', async: false })
export class UseUserInfoConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [useUserInfoProperty, optionalProperty1, optionalProperty2] = args.constraints;
    const useUserInfo = (args.object as any)[useUserInfoProperty];
    const optionalValue1 = (args.object as any)[optionalProperty1];
    const optionalValue2 = (args.object as any)[optionalProperty2];
    return this.isValid(useUserInfo, optionalValue1, optionalValue2);
  }

  private isValid (useUserInfo: boolean, value1: string, value2: string): boolean {
    if (useUserInfo==true) {
        return true;
    }
    if (value1!=undefined && value2!=undefined) {
        return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return '수령자 정보를 입력해주세요.';
  }
}
