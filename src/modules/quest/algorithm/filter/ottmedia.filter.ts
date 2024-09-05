function containsAny(targetString: string, list: string[]): boolean {
    return list.some((item) => targetString.includes(item));
}

export default class OTTMediaFilter {

    static Netflix(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          'netflix', '넷플릭스'
        ]);
    }

    static Wave(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          '웨이브', 'wave', '푹TV', '푹티비'
        ]);
    }

    static TVING(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          'tving', '티빙'
        ]);
    }

    static Watcha(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          '왓챠', 'watcha'
        ]);
    }

    static DisneyPlus(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          '디즈니+', 'disney+', '디즈니플러스', 'disney mobile', '월트디즈니컴퍼니'
        ]);
    }

    static CoupangPlay(merchantName: string) {
        return containsAny(merchantName.toLowerCase(), [
          '쿠팡와우월회비',
        ]);
    }
}