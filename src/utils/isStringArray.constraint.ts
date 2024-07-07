import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'useUserInfoOption', async: false })
export class IsStringArrayConstraints implements ValidatorConstraintInterface {
  validate(arr: string[][], args: ValidationArguments) {
    for (let cur of arr) {
      var date = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
      var time = RegExp(/^([01][0-9]|2[0-3]):([0-5][0-9])$/);
      if (!(date.test(cur[0])) && !(time.test(cur[1]))) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return '공연 날짜를 정확히 입력해주세요.';
  }
}
