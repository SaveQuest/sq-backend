import dayjs from "dayjs";
import OTTMediaFilter from '@/modules/quest/algorithm/filter/ottmedia.filter';
import { Quest } from '@/modules/quest/entity/quest.entity';
import { Mileage } from "@/modules/mileage/entity/mileage.entity";

export function match(merchantName: string): string | boolean {
    const filters = [
        OTTMediaFilter.Netflix,
        OTTMediaFilter.Wave,
        OTTMediaFilter.TVING,
        OTTMediaFilter.Watcha,
        OTTMediaFilter.DisneyPlus,
        OTTMediaFilter.CoupangPlay
    ];

    for (const filter of filters) {
        if (filter(merchantName)) {
            return filter.name;
        }
    }

    return false

}

export function generate(filterName: string): Quest {
    const serviceName = {
        Netflix: "넷플릭스",
        Wave: "웨이브",
        TVING: "티빙",
        Watcha: "왓챠",
        DisneyPlus: "디즈니플러스",
        CoupangPlay: "쿠팡플레이"
    }
    const quest = new Quest();
    quest.name = `${serviceName[filterName]} 구독하지 않기`;
    quest.description = `${serviceName[filterName]} 구독을 해지하고 고정 지출을 줄여보세요.`;
    quest.limitUsage = 0;
    quest.category = `OTT/${filterName}`;
    quest.reward = 200;
    quest.deadline = dayjs()
      .add(1, "month")
      .add(15, "day")
      .toDate()
    quest.status = "inProgress";
    return quest;
}

export function check(record: Mileage, quest: Quest): boolean {
    if (match(record.merchantName) === quest.category.split("/")[1]) {
        if (record.amount > quest.limitUsage) {
            return false;
        }
    }
    return true;
}