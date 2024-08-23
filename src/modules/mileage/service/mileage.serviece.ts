import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class MileageService {
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
        return this.userRepository.findOne({ where: { userId } })
    }

    insertMileageByUsers(userId: number){
        //return this.
    }
}