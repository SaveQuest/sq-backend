import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { mileage } from "../entity/mileage.entity";  // 'mileage' 엔티티를 'Mileage'로 수정
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class MileageService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(mileage)  // 'Mileage'로 수정
        private readonly mileageRepository: Repository<mileage>
    ) { }

    // 사용자 ID로 사용자 조회
    async findUserById(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { userId: userId } });
    }

    // 마일리지를 데이터베이스에 저장하는 메소드
    @Transactional()
    async insertMileageByUsers(userId: number, amount: number, usedContent: string, date: Date): Promise<mileage> {
        // 해당 사용자 조회
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // 새로운 마일리지 엔티티 생성
        const newMileage = new mileage();
        newMileage.userId = user;  // User 엔티티와 연결
        newMileage.content = usedContent;  // 사용 내역
        newMileage.spend_at = date;  // 사용 날짜
        newMileage.amount = amount;  // 예시로 100포인트 적립 (필요에 따라 로직 변경)

        // 마일리지 정보 저장
        return await this.mileageRepository.save(newMileage);
    }
}
