import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Mileage } from "@/modules/mileage/entity/mileage.entity";
import { User } from "@/modules/user/entities/user.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";

function Category(categoryName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('category', categoryName, target, propertyKey);
    return descriptor;
  };
}

function Analyzer(options: { categories: string[] }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('analyzer', options, target, propertyKey);
    return descriptor;
  };
}

interface SpendingEntry {
  name: string;
  amount: number;
  isCategory: boolean;
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

  @Category('편의점')
  async isConvenienceStore(merchantName: string): Promise<boolean> {
    const convenienceStores = ['gs25', 'cu', '세븐일레븐', '이마트24', '미니스톱'];
    return convenienceStores.some(store => merchantName.toLowerCase().includes(store));
  }

  @Category('음식점')
  async isRestaurant(merchantName: string): Promise<boolean> {
    const restaurantKeywords = ['식당', '레스토랑', '카페', '분식', '치킨'];
    return restaurantKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  @Category('온라인쇼핑')
  async isOnlineShopping(merchantName: string): Promise<boolean> {
    const onlineShoppingKeywords = ['쿠팡', '11번가', 'g마켓', '옥션', '티몬', '위메프'];
    return onlineShoppingKeywords.some(keyword => merchantName.toLowerCase().includes(keyword));
  }

  @Analyzer({ categories: ['편의점', '음식점', '온라인쇼핑'] })
  async analyzeTransactions(transactions: Mileage[]): Promise<Quest[]> {
    const spending: SpendingEntry[] = [];
    const now = new Date();
    const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));

    for (const transaction of transactions) {
      const category = await this.getCategoryForMerchant(transaction.merchantName);
      this.updateSpending(spending, category, transaction.amount, true);
      this.updateSpending(spending, transaction.merchantName, transaction.amount, false);
    }

    spending.sort((a, b) => b.amount - a.amount);

    const challenges: Quest[] = [];
    const processedCategories = new Set<string>();

    for (const entry of spending) {
      if (challenges.length >= 7) break;

      if (entry.isCategory) {
        processedCategories.add(entry.name);
      } else if (processedCategories.has(await this.getCategoryForMerchant(entry.name))) {
        continue;
      }

      const targetAmount = Math.round(entry.amount * 0.7);
      challenges.push({
        id: uuidv4(),
        name: `${entry.name}에서 ${targetAmount.toLocaleString()}원 이하로 쓰기`,
        description: `${entry.name}에서 ${targetAmount.toLocaleString()}원 이하로 사용하세요.`,
        limitUsage: targetAmount,
        discriminator: entry.isCategory ? `category:${entry.name}` : `name:${entry.name}`,
        reward: 50,
        deadline: oneMonthLater,
        createdAt: new Date(),
        status: 'inProgress',
      });
    }

    return challenges;
  }

  private async getCategoryForMerchant(merchantName: string): Promise<string> {
    const categoryFunctions = [
      this.isConvenienceStore,
      this.isRestaurant,
      this.isOnlineShopping
    ];

    for (const func of categoryFunctions) {
      const category = Reflect.getMetadata('category', this, func.name);
      if (await func.call(this, merchantName)) {
        return category;
      }
    }

    return '기타';
  }

  private updateSpending(spending: SpendingEntry[], name: string, amount: number, isCategory: boolean) {
    const existingEntry = spending.find(entry => entry.name === name && entry.isCategory === isCategory);
    if (existingEntry) {
      existingEntry.amount += amount;
    } else {
      spending.push({ name, amount, isCategory });
    }
  }
}
