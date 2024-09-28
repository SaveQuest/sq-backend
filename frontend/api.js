import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASEURL = {
  development: 'http://localhost:3000',
  production: 'https://sq-api.ychan.me'
}
export const IMAGE_BASEURL = "https://sqstatic.ychan.me"

class APIRequester {
  /**
   * APIRequester 생성자
   * @param mode 개발모드 또는 프로덕션 모드
   * @param isDummyMode 더미모드 여부 (true일 경우 더미 데이터를 사용합니다.)
   */
  constructor(mode, isDummyMode) {
    this.session = axios.create({
      baseURL: BASEURL[process.env.NODE_ENV],
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.token = null;
    this.isDummyMode = isDummyMode || false;
    this.session.interceptors.request.use(
      async (config) => {
        if (config.auth !== false) {
          const token = await this.getToken();
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        if (this.isDummyMode) {
          config.headers['X-Dummy-Mode'] = 'true';
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * 저장된 토큰을 가져옵니다.
   * @returns {Promise<string|null>} 저장된 토큰 또는 null
   * @example
   * const token = await apiRequester.getToken();
   * console.log(token); // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  async getToken() {
    if (this.token) {
      return this.token;
    }
    try {
      this.token = await AsyncStorage.getItem('token');
      return this.token;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 새 토큰을 설정하고 저장합니다.
   * @param {string} token - 저장할 새 토큰
   * @example
   * await apiRequester.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
   */
  async setToken(token) {
    this.token = token;
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 저장된 토큰을 제거합니다.
   * @example
   * await apiRequester.removeToken();
   */
  async removeToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 인증 코드를 요청합니다.
   * @param {string} phoneNumber - 인증 코드를 받을 전화번호
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.requestCode("+821012345678");
   * console.log(response);
   * @data
   * // {
   * //  "phoneNumber": "01012345678",
   * //  "uuid": "ac2acd11-fb5e-4cf6-b523-d9160bfcf0a8",
   * //  "expiredAt": "2021-08-01T00:00:00.000Z"
   * // }
   * @note
   * 정상작동 확인함.
   */
  async requestCode(phoneNumber) {
    const response = await this.session.post(
      '/auth/requestCode', {
        "phoneNumber": phoneNumber,
      }, { auth: false }
    );
    return response.data;
  }

  /**
   * 인증 코드로 로그인합니다.
   * @param {string} requestUUID - 인증 요청 UUID
   * @param {string} code - 인증 코드
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.authenticate("550e8400-e29b-41d4-a716-446655440000", "123456");
   * console.log(response.data); // { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." , "newUser": true}
   * @note
   * newUser로 신규 유저 여부를 확인할 수 있음. 신규 유저인 경우, user/profile로 이름 수정하기
   * ,서버에서는 이름이 랜덤생성되므로 가입시에 입력받았던 이름으로 바꿔줘야함.
   */
  async authenticate(requestUUID, code) {
    const response = await this.session.post(
      '/auth/authenticate', {
        "uuid": requestUUID,
        "code": code,
      }, { auth: false }
    );
    return response.data;
  }

  /**
   * DST 헤더 정보를 가져옵니다.
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.getDSTHeader();
   * console.log(response.data);
   * // {
   * //  "name": "주현명",
   * //  "points": 0,
   * //  "notificationCount": 0
   * // }
   * @note
   * 정상작동 확인함. 홈 화면에서 요청하는 내용임.
   */
  async getDSTHeader() {
    const response = await this.session.get('/user/dst/header');
    return response.data;
  }

  /**
   * DST 홈 화면 정보를 가져옵니다. (carouselCard)
   * @returns {Promise<Record<string, Any>>} 응답 데이터
   * @example
   * const response = await apiRequester.getDSTHome();
   * console.log(response);
   * @data https://jsoneditoronline.org/#left=cloud.4d9be3f3c9b74f968d1de1321eaa036a
   * @note
   * 정상작동 확인함. element type 획인할 것. CAROUSEL_BASIC_CARD, CAROUSEL_PERCENT_CARD 차이 확인해야함.
   */
  async getDSTHome() {
    const response = await this.session.get('/user/dst/home');
    return response.data;
  }

  /**
   * DST 홈 화면 퀘스트 정보를 가져옵니다. (quest)
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.getDSTQuest();
   * console.log(response);
   * @data
   * {"quest": [
   * {"id": "59195", "name": "편의점에서 총 5,000원 이하로 사용하기", "reward": "500", "percent": 43},
   * {"id": "59195", "name": "편의점에서 총 5,000원 이하로 사용하기", "reward": "500", "percent": 43},
   * ]}
   * @note
   * 정상작동 확인. 만약 카드거래내역이 업로드가 안되어있어 도전과제 자동생성이 안되면 리스트가 비어있을 수 있음.
   */
  async getDSTQuest() {
    const response = await this.session.get('/quest/dst');
    return response.data;
  }

  /**
   * DST 알림 정보를 가져옵니다.
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.getDSTNotification();
   * console.log(response);
   * @data https://jsoneditoronline.org/#left=cloud.744c5126bb05477e9298342431f6e398
   */
  async getDSTNotification() {
    const response = await this.session.get('/user/dst/notification');
    return response.data;
  }

  /**
   * DST 알림 상세 정보를 가져옵니다.
   * @param notificationId
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.getDSTNotificationDetail('1234');
   * console.log(response);
   * @data https://jsoneditoronline.org/#left=cloud.4f5d5390e8df4ccb923413521be429f7
   */
  async getDSTNotificationDetail(notificationId) {
    const response = await this.session.get('/user/dst/notification/detail?id=' + notificationId);
    return response.data;
  }

  /**
   * DST 알림 핸들러를 요청합니다. (보상 수령 등)
   * @param uri
   * @param objectId
   * @returns {Promise<Dict<string, string>>}
   * @example
   * const response = await apiRequester.requestNotificationHandler('/user/collect', '591nf0al1p');
   * console.log(response);
   * @data {"success": true, "message": "Reward successfully claimed"}
   */
  async requestNotificationHandler(uri, objectId) {
    const response = await this.session.post('/user/notification/handler', {
      uri: uri,
      objectId: objectId
    });
    return response.data;
  }

  /**
   * 참가 가능한 모든 챌린지 목록을 가져옵니다.
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchPublicChallenge();
   * console.log(response.data);
   * @data
   * {"challenges": [{"id": "1234", "name": "한달동안 평균 소비 금액 줄이기", "people": 100, "totalReward": 900, "entryFee": 100, "endsAt": "2021-08-01T00:00:00.000Z", joined: true}]}
   * @note
   * 정상작동 확인함.
   */
  async fetchPublicChallenge() {
    const response = await this.session.get('/challenge');
    return response.data;
  }

  /**
   * 참가한 챌린지 정보를 가져옵니다.
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchMyChallenge();
   * console.log(response.data);
   * @data
   * https://jsoneditoronline.org/#left=cloud.649a09ce9af7470b8441c983ebec4485
   * @note
   * 정상작동함. ranking 추가함.
   */
  async fetchDSTChallenge() {
    const response = await this.session.get('/challenge/dst');
    return response.data;
  }

  /**
   * 특정 챌린지의 세부 정보를 가져옵니다.
   * @param {string} challengeId - 챌린지 ID
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchChallengeDetail('1234');
   * console.log(response.data);
   * @data
   * {
   *   "id": "1234",
   *   "name": "챌린지 이름",
   *   "endsAt": "2021-08-01T00:00:00.000Z",
   *   "ranking": [
   *     {"rank": 1, "name": "주현명", "level": "998", "element": [
   *         "name": "지금까지 줄은 소비 금액",
   *         "value": "5,500",
   *       ]}
   *   ],
   *   "people": 100,
   *   "totalReward": 900,
   * }
   */
  async fetchChallengeDetail(challengeId){
    const response = await this.session.get(`/challenge/${challengeId}/detail`);
    return response.data;
  }

  /**
   * 챌린지에 참가합니다.
   * @param {string} challengeId - 챌린지 ID
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.joinChallenge('1234');
   * console.log(response.data);
   */
  async joinChallenge(challengeId){
    const response = await this.session.post(`/challenge/${challengeId}/join`);
    return response.data;
  }

  /**
   * 챌린지 랭킹을 가져옵니다.
   * @param {string} challengeId - 챌린지 ID
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchChallengeRanking('1234');
   * console.log(response.data);
   * @data
   * {"ranking": [
   *   {"rank": 1, "name": "주현명", "level": "998", "element": [
   *         "name": "지금까지 줄은 소비 금액",
   *         "value": "5,500",
   *       ]}
   * ]}
    */
  async fetchChallengeRanking(challengeId){
    const response = await this.session.get(`/challenge/${challengeId}/ranking`);
    return response.data;
  }

  /**
   * 카드거래내역을 업데이트합니다.
   * @param {Record<string, any>[]} transactions - 카드거래내역 리스트
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.updateCardTransaction([]);
   * console.log(response.data);
   */
  async updateCardTransaction(transactions) {
    const response = await this.session.post('/mileage/updateTransaction', transactions);
    return response.data;
  }

  /**
   * 상점 상품 목록을 가져옵니다.
   * @param {'character' || 'pet' || 'background' || 'randomBox'} category - 상품 카테고리
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchStoreProducts('character');
   * console.log(response.data);
   * @data
   * {"products": [
   *   {
   *     "id" : "1234",
   *     "name": "상품",
   *     "price": 1000,
   *     "image": "https://sqstatic.ychan.me/product/5gna1.jpg?key=fn1k661",
   *   }
   * ]}
   */
  async fetchStoreProducts(category) {
    const response = await this.session.get(`/store/product?=${category}`);
    return response.data;
  }

  /**
   * 상품의 세부 정보를 가져옵니다.
   * @param {string} productId - 상품 ID
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchStoreProductDetail('1234');
   * console.log(response.data);
   * @data
   * {
   *   "id": "1234",
   *   "name": "상품",
   *   "price": 1000,
   *   "image": "https://sqstatic.ychan.me/product/5gna1.jpg?key=fn1k661",
   *   "description": "상품 설명",
   *   "isPurchasable": true,
   * }
   */
  async fetchStoreProductDetail(productId) {
    const response = await this.session.get(`/store/product/${productId}`);
    return response.data;
  }

  /**
   * 상품을 구매합니다.
   * @param {string} productId - 상품 ID
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.purchaseStoreProduct('1234');
   * console.log(response.data);
   */
  async purchaseStoreProduct(productId) {
    const response = await this.session.post(`/store/product/${productId}/purchase`);
    return response.data;
  }

  /**
   * 사용자 프로필 정보를 가져옵니다.
   * @returns {Promise<Record<string, Any>>}
   * @example
   * const response = await apiRequester.fetchProfile();
   * console.log(response.data);
   * @data
   * {
   *   "name": "주현명",
   *   "level": 998,
   *   "tag": "절약의 신",
   *   "profileImage": "https://sqstatic.ychan.me/profile/5gna1.jpg?key=fn1k661",
   *   "element": [
   *     { "name": "지금까지 줄인 소비금액", "value": "99,000" },
   *     { "name": "성공한 도전과제", "value": "321개" }
   *   ],
   *   "questLog": {
   *     "totalEarned": 1000,
   *     "totalCompleted": 100,
   *     "totalFailed": 10,
   *   }
   * }
   */
  async fetchProfile() {
    const response = await this.session.get('/user/profile');
    return response.data;
  }

  /**
   * 사용자 프로필 정보를 업데이트합니다.
   * @param {Record<string, Record<string, string>>}profileData
   * @returns {Promise<any>}
   * @example
   * const response = await apiRequester.updateProfile({
   *   "name": "새로운개쩌는이름",
   *   "isProfilePublic": true,
   * });
   * console.log(response);
   * // 다른 field는 없습니다, name이랑 isProfilePublic만 가능합니다.
   */
  async updateProfile(profileData) {
    const response = await this.session.post('/user/profile', profileData);
    return response.data;
  }

  /**
   * 사용자 프로필 정보를 업데이트합니다.
   * @param {FormData} imageFormData
   * @returns {Promise<Record<string, string>>}
   * @example
   * const formData = new FormData();
   * formData.append('image', imageFile);
   * const response = await apiRequester.updateProfileImage(formData);
   * console.log(response);
   */
  async updateProfileImage(imageFormData) {
    const response = await this.session.post(
      '/user/profile/image', imageFormData, { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  /**
   * 사용자 인벤토리를 카테고리별로 가져옵니다.
   * @param {'character' || 'pet' || 'tag' || 'randomBox'} category - 인벤토리 카테고리
   * @returns {Promise<Record<string, string>>}
   * @example
   * const response = await apiRequester.fetchInventory('character');
   * console.log(response);
   * @data
   * {"inventory": [
   *  {
   *  "id": "1234",
   *  "name": "아이템",
   *  "imageUrl": "https://sqstatic.ychan.me/inventory/5gna1.jpg?key=fn1k661",
   *  "isEquipped": true,
   *  }
   *  ]}
   */
  async fetchInventory(category) {
    const response = await this.session.get('/user/inventory?category=' + category);
    return response.data;
  }


  /**
   * 인벤토리 아이템을 장착합니다.
   * @param {string} itemId - 장착할 아이템의 ID
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.equipInventoryItem("item123");
   * console.log(response); // { "success": true, "message": "Item equipped successfully" }
   */
  async equipInventoryItem(itemId) {
    const response = await this.session.post(`/user/inventory/${itemId}/equip`);
    return response.data;
  }

  /**
   * 인벤토리 아이템을 해제합니다.
   * @param {string} itemId - 해제할 아이템의 ID
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.unequipInventoryItem("item123");
   * console.log(response); // { "success": true, "message": "Item unequipped successfully" }
   */
  async unequipInventoryItem(itemId) {
    const response = await this.session.post(`/user/inventory/${itemId}/unequip`)
    return response.data;
  }

  /**
   * 주간 퀘스트 정보를 가져옵니다. (퀘스트 선택 전)
   * @returns {Promise<Record<string, Record<string, string>[]>>} 응답 데이터
   * @example
   * const response = await apiRequester.fetchWeeklyQuest();
   * console.log(response);
   * // {"quest": [
   * //  {"id": "59195", "name": "편의점에서 총 5,000원 이하로 사용하기", "reward": "500"},
   * //  {"id": "59195", "name": "편의점에서 총 5,000원 이하로 사용하기", "reward": "500"},
   * // ]}
   */
  async fetchWeeklyQuest() {
    const response = await this.session.get('/quest/daily');
    return response.data;
  }

  /**
   * 주간 퀘스트를 선택합니다.
   * @param {string[]} questIds - 선택할 퀘스트의 ID
   * @returns {Promise<Record<string, string>>} 응답 데이터
   * @example
   * const response = await apiRequester.selectWeeklyQuest(["59195", "59196"]);
   * console.log(response); // { "success": true, "message": "Quest selected successfully" }
   */
  async selectWeeklyQuest(questIds) {
    const response = await this.session.post(`/quest/daily/select`, { quest: questIds });
    return response.data;
  }

  async fetchUserRoom() {
    const response = await this.session.get('/user/room');
    return response.data;
  }

}

const requester = new APIRequester('development', false);