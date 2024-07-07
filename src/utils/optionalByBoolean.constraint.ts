import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'useUserInfoOption', async: false })
export class OptionalByBooleanConstraint implements ValidatorConstraintInterface {
  validate(boolValue: boolean, args: ValidationArguments) {
    let arr = [];
    for (let property of args.constraints) {
      const value = (args.object as any)[property];
      arr.push(value);
    }
    return this.isValid(boolValue, arr);
  }

  private isValid(boolValue: boolean, arr: any[]): boolean {
    if (boolValue == true) {
      return true;
    } else {
      for (let cur of arr) {
        if (cur==undefined) {
          return false;
        }
      }
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return '수령자 정보를 입력해주세요.';
  }
}
