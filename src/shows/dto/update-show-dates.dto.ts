import { PickType } from '@nestjs/mapped-types';
import { CreateShowDto } from './create-show.dto';

export class UpdateShowDatesDto extends PickType(CreateShowDto, ['showDate']) {}
