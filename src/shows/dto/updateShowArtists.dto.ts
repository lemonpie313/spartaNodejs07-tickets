import { PickType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./createShow.dto";

export class UpdateShowArtistsDto extends PickType(CreateShowDto, ['artists']) {}