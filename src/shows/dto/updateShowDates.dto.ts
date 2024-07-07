import { PickType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./createShow.dto";

export class UpdateShowDatesDto extends PickType(CreateShowDto, ['showDate']) {}