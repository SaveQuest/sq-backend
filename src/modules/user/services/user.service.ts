import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserSerivce {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUserOrCreate(phoneNumber: string) {
        const user = await this.userRepository.findOne({
            where: { phoneNumber }
        })

        if (user !== null) return user

        return await this.userRepository.save({
            phoneNumber,
            exp: 0,
            points: 0
        })
    }

    findUserById(userId: number) {
        return this.userRepository.findOne({ where: { userId } })
    }
}