// dto/create-challenge.dto.ts
import { IsString, IsNumber, IsDate, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @IsNotEmpty()
  @IsBoolean()
  isFinished: boolean;
}