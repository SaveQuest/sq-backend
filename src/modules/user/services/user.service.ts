 import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserSerivce {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    @Transactional()
    async getUserOrCreate(phoneNumber: string) {
        const user = await this.userRepository.findOne({
            where: { phoneNumber }
        })

        if (user !== null) return user

        return await this.userRepository.save({
            phoneNumber,
        })
    }

    findUserById(userId: number) {
        return this.userRepository.findOne({ where: { id: userId } })
    }

    insertUser(){
        //return this.
    }
}