import { Injectable } from '@nestjs/common';
import { Mileage } from '@/modules/mileage/entity/mileage.entity';
import { OTTMediaFilter } from '@/modules/quest/analyzer/filter/ottmedia.filter';
import 'reflect-metadata';

type ServiceScore = {
  serviceName: string;
  totalAmount: number;
  transactionCount: number;
  baseScore: number;
  totalScore: number;
};

@Injectable()
export class CardTransactionAnalyzerService {
  private serviceTransactions: { [service: string]: Mileage[] } = {};
  private filters = [OTTMediaFilter];

  private categorizeService(transaction: Mileage): string | null {
    for (const filter of this.filters) {
      const serviceMethods = Object.getOwnPropertyNames(filter).filter(prop => typeof filter[prop] === 'function');

      for (const method of serviceMethods) {
        const filters = Reflect.getMetadata('dataFilters', filter, method) || [];

        for (const filterInfo of filters) {
          if (filterInfo.filterKey === 'name') {
            const isService = filter[method](transaction.merchantName);
            const name = Reflect.getMetadata('name', filter, method);
            if (isService) {
              return name;
            }
          }
        }
      }
    }
    return null;
  }

  private calculateServiceScores(): ServiceScore[] {
    const serviceScores: ServiceScore[] = [];

    for (const service in this.serviceTransactions) {
      const transactions = this.serviceTransactions[service];
      const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const transactionCount = transactions.length;
      const baseScore = this.getBaseScore(service);

      const totalScore = totalAmount + baseScore + transactionCount * 10;
      serviceScores.push({ serviceName: service, totalAmount, transactionCount, baseScore, totalScore });
    }

    return serviceScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);
  }

  private getBaseScore(serviceName: string): number {
    for (const filter of this.filters) {
      const serviceMethods = Object.getOwnPropertyNames(filter).filter(prop => typeof filter[prop] === 'function');

      for (const method of serviceMethods) {
        const name = Reflect.getMetadata('name', filter, method);
        const baseScore = Reflect.getMetadata('baseScore', filter, method);

        if (name === serviceName) {
          return baseScore || 0;
        }
      }
    }

    return 0;
  }

  public analyzeTransactions(transactions: Mileage[]): ServiceScore[] {
    transactions.forEach((transaction) => {
      const service = this.categorizeService(transaction);
      if (service) {
        if (!this.serviceTransactions[service]) {
          this.serviceTransactions[service] = [];
        }
        this.serviceTransactions[service].push(transaction);
      }
    });

    return this.calculateServiceScores();
  }
}