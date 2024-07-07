import { PickType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./createShow.dto";

export class UpdateShowIntroductionDto extends PickType(CreateShowDto, ['introduction']) {}