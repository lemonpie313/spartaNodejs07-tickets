import { IsNotEmpty, IsString } from "class-validator";
import { DeleteShowDto } from "./deleteShow.dto";

export class deleteSectionDto extends DeleteShowDto {
    @IsString()
    @IsNotEmpty({message: '구역 이름을 입력해주세요.'})
    section: string;
}