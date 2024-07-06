import { IsOptional, IsString } from "class-validator";
import { Genre } from "../types/genre.type";

export class ReadShowsByGenreDto {
  @IsString()
  @IsOptional()
  genre: Genre
}