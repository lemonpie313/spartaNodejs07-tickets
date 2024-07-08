import { PickType } from "@nestjs/mapped-types";
import { CreateShowDto } from "./create-show.dto";

export class UpdateShowArtistsDto extends PickType(CreateShowDto, ['artists']) {}