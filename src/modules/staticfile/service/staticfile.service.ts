import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { envSchema } from '@/config/env.validator';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { Repository } from "typeorm";

dotenv.config();
const env = envSchema.parse(process.env)


@Injectable()
export class StaticFileService {
  private readonly BASEURL = 'https://sqstatic.ychan.me';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async StaticFile(userId: number, path: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }, select: ["staticFileRequestKey"]
    })

    if (user.staticFileRequestKey === null) {
      user.staticFileRequestKey = await this.generateStaticFileRequestKey(userId);
      await this.userRepository.save(user);
    }
    return `${this.BASEURL}${path}?key=${user.staticFileRequestKey}`;
  }

  async generateStaticFileRequestKey(userId: number) {
    const response = await axios.post("https://sqstatic.ychan.me/register-key", {
      "username": userId,
      "adminKey": env.STATIC_FILE_ADMIN_KEY,
    })
    return response.data.key;
  }
}
