import { OmitType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./createShow.dto";

export class UpdateShowDto extends OmitType(CreateShowDto, ['showDate', 'artists']) {}