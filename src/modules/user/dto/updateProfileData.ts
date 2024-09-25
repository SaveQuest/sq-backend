import { IsString, IsBoolean, IsOptional } from 'class-validator';


export class UpdateProfileData {

  @IsString()
  @IsOptional()
  name?: string

  @IsBoolean()
  @IsOptional()
  isProfilePublic?: boolean
}
