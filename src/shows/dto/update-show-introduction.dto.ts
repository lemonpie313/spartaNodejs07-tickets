import { PickType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./create-show.dto";

export class UpdateShowIntroductionDto extends PickType(CreateShowDto, ['introduction']) {}