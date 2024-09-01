import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { Mileage } from "../entity/mileage.entity";  // 'mileage' 엔티티를 'Mileage'로 수정

@Injectable()
export class MileageService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Mileage)  // 'Mileage' 엔티티로 수정
        private readonly mileageRepository: Repository<Mileage>
    ) { }

    // 사용자 ID로 사용자 조회
    async findUserById(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: userId } });
    }

    // 마일리지를 데이터베이스에 저장하는 메소드
    async insertMileageByUsers(
        userId: number,
        amount: number,
        date: Date,
        cardIssuer: 'hanacard' | 'kbcard' | 'worricard' | 'bccard' | 'lottecard' | 'kakaomini' | 'tossuss',
        approvalTime: number,
        merchantName: string,
        approvalNumber?: string,
        merchantCategory?: string,
        merchantId?: string,
        merchantBusinessNumber?: string
    ): Promise<Mileage> {
        // 해당 사용자 조회
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // 새로운 마일리지 엔티티 생성
        const newMileage = new Mileage();
        newMileage.userId = user;  // User 엔티티와 연결
        newMileage.spend_at = date;  // 사용 날짜
        newMileage.amount = amount;  // 결제 금액

        // 카드 결제 관련 정보 설정
        newMileage.cardIssuer = cardIssuer;
        newMileage.approvalTime = approvalTime;
        newMileage.merchantName = merchantName;

        // Optional한 필드들 설정
        if (approvalNumber) newMileage.approvalNumber = approvalNumber;
        if (merchantCategory) newMileage.merchantCategory = merchantCategory;
        if (merchantId) newMileage.merchantId = merchantId;
        if (merchantBusinessNumber) newMileage.merchantBusinessNumber = merchantBusinessNumber;

        // 마일리지 정보 저장
        return await this.mileageRepository.save(newMileage);
    }

    // 특정 유저의 총 소비량 계산
    async getTotalMileageForUser(userId: number): Promise<number> {
        // 사용자 ID로 검색하는데, 올바른 관계 매핑 확인
        const mileages = await this.mileageRepository.find({ 
            where: { userId: { id: userId } }, // `userId`가 `User` 객체와 매핑된 경우
            relations: ['userId'], // 관계를 명시적으로 포함하여 정확한 검색
        });
    
        // amount 값이 `null`이거나 `undefined`일 경우에 대한 방어 코드
        return mileages.reduce((total, mileage) => total + (mileage.amount || 0), 0);
    }
    
}
