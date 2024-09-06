// mileage.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { Mileage } from "../entity/mileage.entity";
import { UsedAmountDto } from "../dto/usedAmount.dto";
import { UserNotFoundException } from "../exception/UserNotFoundException";
import { InsufficientAmountException } from "../exception/InsufficientAmountException";

@Injectable()
export class MileageService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Mileage)  // 'Mileage' 엔티티로 수정
        private readonly mileageRepository: Repository<Mileage>
    ) {}


    // 사용자의 카드 거래내역을 업데이트하는 메소드
    async updateCardHistory(userId: number, cardHistory: UsedAmountDto[]) {
        const targetUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!targetUser) {
            throw new UserNotFoundException(userId);
        }

        // 사용자의 마일리지 정보를 업데이트
        const saveCardHistory = cardHistory.map(async (history) => {
            const newMileage = new Mileage();
            newMileage.spend_at = history.date;
            newMileage.amount = history.amount;
            newMileage.cardIssuer = history.cardIssuer;
            newMileage.approvalTime = history.approvalTime;
            newMileage.merchantName = history.merchantName;
            newMileage.approvalNumber = history.approvalNumber;
            newMileage.merchantCategory = history.merchantCategory;
            newMileage.merchantId = history.merchantId;
            newMileage.merchantBusinessNumber = history.merchantBusinessNumber;
            targetUser.dailyUsage += history.amount;
            await this.mileageRepository.save(newMileage);

            return newMileage;
        });

        const savedCardHistory = await Promise.all(saveCardHistory);
        savedCardHistory.forEach((history) => {
            targetUser.mileage.push(history);
        });

        return await this.userRepository.save(targetUser);
    }

    // 사용자 ID로 사용자 조회
    async findUserById(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: userId } });
    }
    //
    // // 마일리지를 데이터베이스에 저장하는 메소드
    // async insertMileageByUsers(usedAmountDto: UsedAmountDto): Promise<Mileage> {
    //     const {
    //         userId,
    //         amount,
    //         date,
    //         cardIssuer,
    //         approvalTime,
    //         merchantName,
    //         approvalNumber,
    //         merchantCategory,
    //         merchantId,
    //         merchantBusinessNumber,
    //     } = usedAmountDto;
    //
    //     // 해당 사용자 조회
    //     const user = await this.findUserById(userId);
    //     if (!user) {
    //         throw new UserNotFoundException(userId);
    //     }
    //
    //     if (amount <= 0) {
    //         throw new InsufficientAmountException();
    //     }
    //
    //     // 새로운 마일리지 엔티티 생성
    //     const newMileage = new Mileage();
    //     newMileage.userId = user;  // User 엔티티와 연결
    //     newMileage.spend_at = date;  // 사용 날짜
    //     newMileage.amount = amount;  // 결제 금액
    //
    //     newMileage.cardIssuer = cardIssuer;
    //     newMileage.approvalTime = approvalTime;
    //     newMileage.merchantName = merchantName;
    //     newMileage.approvalNumber = approvalNumber;
    //     newMileage.merchantCategory = merchantCategory;
    //     newMileage.merchantId = merchantId;
    //     newMileage.merchantBusinessNumber = merchantBusinessNumber;
    //
    //     // 마일리지 정보 저장
    //     return await this.mileageRepository.save(newMileage);
    // }
    //
    // 특정 유저의 총 소비량 계산
    async getTotalMileageForUser(userId: number): Promise<number> {
        // 사용자 ID로 검색하는데, 올바른 관계 매핑 확인
        const mileages = await this.mileageRepository.find({
            where: { id:  userId  }, // `userId`가 `User` 객체와 매핑된 경우
            relations: ['userId'], // 관계를 명시적으로 포함하여 정확한 검색
        });

        // amount 값이 `null`이거나 `undefined`일 경우에 대한 방어 코드
        return mileages.reduce((total, mileage) => total + (mileage.amount || 0), 0);
    }
}
