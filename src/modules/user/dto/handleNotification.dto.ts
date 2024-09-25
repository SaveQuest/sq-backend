import { IsString } from 'class-validator';


export class handleNotificationDataDto {

  @IsString()
  uri: string

  @IsString()
  objectId: string
}
