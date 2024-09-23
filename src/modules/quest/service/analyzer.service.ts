import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid";
import { Mileage } from "@/modules/mileage/entity/mileage.entity";
import { User } from "@/modules/user/entities/user.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";

function Category(categoryName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('category', categoryName, target, propertyKey);
    return descriptor;
  };
}

@Injectable()
export class TransactionAnalysisService {
  constructor(
    @InjectRepository(Mileage)
    private readonly mileageRepository: Repository<Mileage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,
  ) {
  }

  async createQuest(userId: number): Promise<Quest[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId }, relations: ['mileage', 'quests']
    });
    user.quests = await this.analyzeTransactions(user.mileage);
    await this.questRepository.save(user.quests);
    return user.quests;
  }

  @Category('편의점')
  async isConvenienceStore(merchantName: string): Promise<boolean> {
    const convenienceStores = ['(GS)25', 'cu', '세븐일레븐', '이마트24', '미니스톱', '지에스'];
    return convenienceStores.some(store => merchantName.toLowerCase().includes(store));
  }

  @Category('카페')
  async isCafe(merchantName: string): Promise<boolean> {
    const cafeKeywords = ['메가엠지씨커피', '스타벅스', '이디야', '투썸플레이스', '카페베네', '커피빈', '할리스', '탐앤탐스'];
    return cafeKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  @Category('배달')
  async isDelivery(merchantName: string): Promise<boolean> {
    const deliveryKeywords = ['쿠팡이츠', '우아한형제들', '요기요', '위대한상상'];
    return deliveryKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  @Category('패스트푸드')
  async isFastFood(merchantName: string): Promise<boolean> {
    const fastFoodKeywords = ['맥도날드', '버거킹', '비케이알', 'KFC', '롯데리아', '맘스터치', '파파존스'];
    return fastFoodKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  @Category('온라인쇼핑')
  async isOnlineShopping(merchantName: string): Promise<boolean> {
    const onlineShoppingKeywords = ['쿠팡', '11번가', 'g마켓', '옥션', '티몬', '위메프'];
    return onlineShoppingKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  async analyzeTransactions(transactions: Mileage[]): Promise<Quest[]> {
    const categoryStore: Record<string, number> = {};
    const merchantStore: Record<string, number> = {};
    const challenges: Quest[] = [];
    const now = new Date();
    const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
    const createdChallenges = new Set<string>();

    // 1. 카테고리별 총 사용 금액 계산
    for (const transaction of transactions) {
      const merchantName = transaction.merchantName;
      const amount = transaction.amount;

      // 상점별 총 사용 금액 계산
      if (!merchantStore[merchantName]) {
        merchantStore[merchantName] = 0;
      }
      merchantStore[merchantName] += amount;

      // 카테고리별 총 사용 금액 계산
      const category = await this.getCategoryForMerchant(merchantName);
      if (category && category !== merchantName) {
        if (!categoryStore[category]) {
          categoryStore[category] = 0;
        }
        categoryStore[category] += amount;
      }
    }

    for (const category in categoryStore) {
      const totalAmount = categoryStore[category];
      if (totalAmount >= 3000) {
        const targetAmount = Math.floor(totalAmount * 0.7 / 10) * 10;
        if (!createdChallenges.has(`category:${category}`)) {
          challenges.push({
            id: uuidv4(),
            name: `${category}에서 ${targetAmount.toLocaleString()}원 이하로 쓰기`,
            description: `${category}에서 ${targetAmount.toLocaleString()}원 이하로 사용하세요.`,
            limitUsage: targetAmount,
            discriminator: `category:${category}`,
            reward: this.calculateReward(totalAmount),
            totalUsage: 0,
            deadline: oneMonthLater,
            createdAt: new Date(),
            status: 'inProgress'
          });
          createdChallenges.add(`category:${category}`);
        }
      }
    }

    const topMerchants = Object.entries(merchantStore)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 3);

    for (const [merchantName, totalAmount] of topMerchants) {
      const targetAmount = Math.floor(totalAmount * 0.7 / 10) * 10;
      if (!createdChallenges.has(`name:${merchantName}`)) {
        challenges.push({
          id: uuidv4(),
          name: `${merchantName}에서 ${targetAmount.toLocaleString()}원 이하로 쓰기`,
          description: `${merchantName}에서 ${targetAmount.toLocaleString()}원 이하로 사용하세요.`,
          limitUsage: targetAmount,
          discriminator: `name:${merchantName}`,
          reward: this.calculateReward(totalAmount),
          totalUsage: 0,
          deadline: oneMonthLater,
          createdAt: new Date(),
          status: 'inProgress'
        });
        createdChallenges.add(`name:${merchantName}`);
      }
    }

    return challenges;
  }

  private async getCategoryForMerchant(merchantName: string): Promise<string> {
    const categoryFunctions = [
      this.isConvenienceStore,
      this.isCafe,
      this.isDelivery,
      this.isFastFood,
      this.isOnlineShopping,
    ];

    for (const func of categoryFunctions) {
      const category = Reflect.getMetadata('category', this, func.name);
      if (await func.call(this, merchantName)) {
        return category;
      }
    }

    return merchantName;
  }

  private calculateReward(totalAmount: number): number {
    if (totalAmount >= 10000) {
      return 100;
    } else if (totalAmount >= 5000) {
      return 70;
    } else {
      return 50;
    }
  }
}
