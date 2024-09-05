// dto/join-challenge.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';

export class JoinChallengeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}