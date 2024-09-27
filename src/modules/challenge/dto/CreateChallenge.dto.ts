import { IsString, IsNumber, IsDate, IsNotEmpty, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  entryFee: number;

  @IsNumber()
  @IsNotEmpty()
  prize: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsBoolean()
  isPublic: boolean;
}