import { Module } from '@nestjs/common';
import { StaticFileService } from "@/modules/staticfile/service/staticfile.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [StaticFileService],
  exports: [StaticFileService, TypeOrmModule]
})
export class StaticFileModule {}