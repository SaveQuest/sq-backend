import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { Mileage } from "../entity/mileage.entity";
import { UsedAmountDto } from "../dto/usedAmount.dto";
import { UserNotFoundException } from "../exception/UserNotFoundException";
import { TransactionAnalysisService } from "@/modules/quest/service/analyzer.service";

@Injectable()
export class MileageService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Mileage)
        private readonly mileageRepository: Repository<Mileage>,
        private readonly analyzerService: TransactionAnalysisService,
    ) {}

    async getTotalMileageForUser(userId: number): Promise<number> {
        const targetUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!targetUser) {
            throw new UserNotFoundException(userId);
        }
        return targetUser.mileage.reduce((acc, mileage) => acc + mileage.amount, 0);
    }

    async getLastApprovalTime(userId: number) {
        const targetUser = await this.userRepository.findOne({ where: { id: userId } , relations: ['mileage']});
        if (!targetUser) {
            throw new UserNotFoundException(userId);
        }
        if (targetUser.mileage.length === 0) {
            return 0;
        }
        const lastMileage = targetUser.mileage[targetUser.mileage.length - 1];
        return lastMileage.approvalTime;
    }


    async updateCardHistory(userId: number, cardHistory: UsedAmountDto[]) {
        const targetUser = await this.userRepository.findOne({ where: { id: userId } , relations: ['mileage']});
        if (!targetUser) {
            throw new UserNotFoundException(userId);
        }

        const cardHistoryAppend = cardHistory.map(async (history) => {
            const isApprovalNumberExists = targetUser.mileage.some(
              mileage => mileage.approvalNumber === history.approvalNumber
            );
            if (isApprovalNumberExists) {
                return
            }
            const newMileage = this.mileageRepository.create(
              {
                  amount: history.amount,
                  cardIssuer: history.cardIssuer,
                  approvalNumber: history.approvalNumber,
                  approvalTime: new Date(history.approvalTime * 1000),
                  merchantId: history.merchant.id,
                  merchantName: history.merchant.name,
                  merchantBusinessNumber: history.merchant.businessNumber,
                  merchantIsForeign: history.merchant.isForeign,
              }
            )
            return await this.mileageRepository.save(newMileage)
        });
        const mileageEntities = await Promise.all(cardHistoryAppend);
        const updateMileageEntities = mileageEntities.filter(item => item !== undefined);
        targetUser.mileage = [...targetUser.mileage || [], ...updateMileageEntities];
        await this.analyzerService.updateQuestWithTransactionData(userId, updateMileageEntities);
        await this.userRepository.save(targetUser);
        return {"status": "success", "transaction": updateMileageEntities}
    }
}
