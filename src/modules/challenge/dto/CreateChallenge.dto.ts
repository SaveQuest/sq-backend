// dto/create-challenge.dto.ts
import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

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
  endDate: Date;
}