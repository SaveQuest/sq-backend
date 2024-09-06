import { Service, MetaData, DataFilter } from '@/modules/quest/analyzer/decorators'

export class OTTMediaFilter {

  @Service(50)
  @MetaData('name', '넷플릭스')
  @MetaData('description', 'netflix.com')
  static Netflix(@DataFilter('merchantName') merchantName: string): boolean {
    return this.containsAny(merchantName.toLowerCase(), ['netflix', '넷플릭스']);
  }

  @Service(40)
  @MetaData('name', '웨이브')
  @MetaData('description', 'wave')
  static Wave(@DataFilter('merchantName') merchantName: string): boolean {
    return this.containsAny(merchantName.toLowerCase(), ['wave', '웨이브', '푹티비', '푹TV']);
  }

  @Service(30)
  @MetaData('name', '왓챠')
  @MetaData('description', 'watcha')
  static Watcha(@DataFilter('merchantName') merchantName: string): boolean {
    return this.containsAny(merchantName.toLowerCase(), ['watcha', '왓챠']);
  }

  @Service(60)
  @MetaData('name', '디즈니플러스')
  @MetaData('description', 'disneyplus.com')
  static DisneyPlus(@DataFilter('merchantName') merchantName: string): boolean {
    return this.containsAny(merchantName.toLowerCase(), ['디즈니+', 'disney+', '디즈니플러스', 'disney mobile', '월트디즈니컴퍼니']);
  }

  @Service(60)
  @MetaData('name', '쿠팡플레이')
  @MetaData('description', 'coupang, 쿠팡와우')
  static CoupangPlay(@DataFilter('merchantName') merchantName: string): boolean {
    return this.containsAny(merchantName.toLowerCase(), ['쿠팡와우월회비']);
  }

  private static containsAny(targetString: string, list: string[]): boolean {
    return list.some((item) => targetString.includes(item));
  }
}