import { IsString } from "class-validator";

export class FindShowDto {

  @IsString()
  showName: string;

  @IsString()
  id: number;
}
