import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";
import { StaticFileService } from "@/modules/staticfile/service/staticfile.service";
import { UpdateProfileData } from "@/modules/user/dto/updateProfileData";
import { InventoryItem } from "@/modules/inventory/entities/inventory.entity";
import { handleNotificationDataDto } from "@/modules/user/dto/handleNotification.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly staticFileService: StaticFileService,
        @InjectRepository(InventoryItem)
        private readonly inventoryItemRepository: Repository<InventoryItem>,
    ) { }

    getRandomElement<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateRandomNickname(): string {
        const adjectives = [
            "절약하는", "주식하는", "공부하는", "절약왕", "용감한", "계획적인", "성실한",
        ];

        const animals = [
            "코알라", "토끼", "호랑이", "펭귄", "북극곰", "사자", "여우", "늑대", "고양이"
        ];

        const numbers = Math.floor(Math.random() * 100);

        const adjective = this.getRandomElement(adjectives);
        const animal = this.getRandomElement(animals);

        return `${adjective}${animal}${numbers}`;
    }
    async getNotificationDetail(userId: number, notificationId: string) {
        if (notificationId === "ef436f77-63b0-4a82-b45f-89c54a771ab4") {
            return {
                "id": userId,
                "element": {
                    "top": {
                        "iconUrl": null,
                        "rightText": "회원가입을 환영합니다!",
                    },
                    "content": "SaveQuest 회원가입을 환영합니다! 여기를 클릭해 코인을 받아보세요!",
                    "bottom": {
                        "iconUrl": null,
                        "bottomText": "1000코인"
                    },
                    "handler": {
                        "type": "REQUEST",
                        "uri": "/user/collect",
                        "data": {
                            "id": "6fd67fa5-3020-4901-8afc-1419e045540d"
                        }
                    }
                }
            }
        }
        throw new Error("Notification not found");
    }

    async getNotification(userId: number) {
        return {
            id: userId, element: [
                {
                    "type": "NOTIFICATION_CARD",
                    "id": "ef436f77-63b0-4a82-b45f-89c54a771ab4",
                    "content": {
                        "leftRowTopText": "회원가입을 환영합니다!",
                        "leftRowBottomText": "2021-08-01T00:00:00.000Z",
                        "descriptionText": "여기를 눌러 보상을 받으세요!"
                    },
                    "right": {
                        "type": "NOTIFICATION_INTERACT_COLLECT",
                        "content": {
                            "rewardAmountText": "300"
                        }
                    },
                    "handler": {
                        "type": "REQUEST",
                        "uri": "/user/collect",
                        "data": {
                            "id": "6fd67fa5-3020-4901-8afc-1419e045540d"
                        }
                    }
                }
            ]
        }
    }

    async getUserRoom(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["inventory"]
        });
        const userInventory = user.inventory;
        const equippedCharacter = userInventory.find(i => i.isEquipped && i.itemType === "character");
        const equippedPet = userInventory.find(i => i.isEquipped && i.itemType === "pet");
        const equippedTag = userInventory.find(i => i.isEquipped && i.itemType === "tag");
        return {
            character: equippedCharacter ? {
                id: equippedCharacter.id,
                name: equippedCharacter.name,
                imageUrl: await this.staticFileService.StaticFile(userId, equippedCharacter.imageId)
            } : null,
            pet: equippedPet ? {
                id: equippedPet.id,
                name: equippedPet.name,
                imageUrl: await this.staticFileService.StaticFile(userId, equippedPet.imageId)
            } : null,
            tag: equippedTag ? {
                id: equippedTag.id,
                name: equippedTag.name,
                imageUrl: await this.staticFileService.StaticFile(userId, equippedTag.imageId)
            } : null
        }
    }

    @Transactional()
    async getUserOrCreate(phoneNumber: string) {
        const user = await this.userRepository.findOne({
            where: { phoneNumber }
        })

        if (user !== null) return {
            user, newUser: false
        }

        const newFirstTag = await this.inventoryItemRepository.save({
            itemType: "tag", name: "절약 초보자", imageId: "", content: "절약 초보자", isEquipped: true
        })
        const newUserEntity = await this.userRepository.save({
            phoneNumber, name: this.generateRandomNickname(), inventory: [newFirstTag]
        })
        return {
            user: newUserEntity, newUser: true
        }
    }

    async updateProfile(userId: number, data: UpdateProfileData) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (data.name != null) {
            user.name = data.name
        }
        if (data.isProfilePublic != null) {
            user.metadata.isProfilePublic = data.isProfilePublic
        }
        await this.userRepository.save(user)
        return user
    }

    async setProfileImage(userId: number, file: Express.Multer.File) {
        // TODO: r2 bucket 연동하기
    }

    async getProfile(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } , relations: ['quests']});
        return {
            id: userId,
            name: user.name,
            exp: user.exp,
            level: user.level,
            tag: user.titleBadge,
            profileImage: user.profileImageId ? await this.staticFileService.StaticFile(userId, user.profileImageId) : null,
            element: [
                {
                    name: "지금까지 줄인 소비금액",
                    value: `₩ ${user.totalSavedUsage.toLocaleString('ko-KR')}`
                }, {
                    name: "성공한 도전과제",
                    value: `${user.quests.filter(q => q.status === "completed").length}개`
                }
            ],
            questLog: {
                totalEarned: user.totalEarned.quest,
                totalCompleted: user.quests.filter(q => q.status === "completed").length,
                totalFailed: user.quests.filter(q => q.status === "failed").length,
                isProfilePublic: user.metadata.isProfilePublic
            }
        }
    }

    async getDSTHeader(userId: number) {
        const user = await this.userRepository.findOne({where: {id: userId}, select: ["name", "points", "notifications"] });
        return {
            id: userId, name: user.name, points: user.points, notificationCount: user.notifications?.length || 0
        }
    }

    async getDSTHome(userId: number) {
        return {
            id: userId,
            elements: [
                {
                    type: "CAROUSEL_BASIC_CARD",
                    content: {
                        topRowText: "SaveQuest 정식 출시",
                        bottomRowText: "Play Store에서 SaveQuest 리뷰 남기기"
                    },
                    right: {
                        imageUri: await this.staticFileService.StaticFile(userId, "/dstCarouselImage/70a3ceae-d5dc-463e-a98b-48d6243a6a80.png")
                    },
                    handler: {
                        type: "WEBLINK",
                        url: "https://play.google.com/store/apps/details?id=me.ychan.savequest"
                    }
                }
            ]
        }
    }

    async getInventory(
      userId: number,
      category: "character" | "pet" | "tag"
    ) {
        const user = await this.userRepository.findOne({where: {id: userId}, relations: ["inventory"]});
        const inventoryItems = user.inventory.filter(i => i.itemType === category);
        return inventoryItems.map(async item => ({
            id: item.id, name: item.name, isEquipped: item.isEquipped,
            imageUrl: await this.staticFileService.StaticFile(userId, item.imageId),
        }));
    }

    async equipItem(userId: number, itemId: string) {
        const user = await this.userRepository.findOne({where: {id: userId}, relations: ["inventory"]});
        const item = user.inventory.find(i => i.id === itemId);
        if (item == null) {
            throw new Error("Item not found");
        }
        const equippedCharacter = user.inventory.find(i => i.itemType === "character" && i.isEquipped);
        if (equippedCharacter != null) {
            equippedCharacter.isEquipped = false;
            await this.inventoryItemRepository.save(equippedCharacter);
        }
        item.isEquipped = true;
        await this.userRepository.save(user);
        return {status: "success", item: item}
    }

    async unequipItem(userId: number, itemId: string) {
        const user = await this.userRepository.findOne({where: {id: userId}, relations: ["inventory"]});
        const item = user.inventory.find(i => i.id === itemId);
        if (item == null) {
            throw new Error("Item not found");
        }
        item.isEquipped = false;
        await this.userRepository.save(user);
        return {status: "success", item: item}
    }

    async handle(userId: number, data: handleNotificationDataDto) {
        const user = await this.userRepository.findOne({where: {id: userId}});
        if (data.uri === "/user/collect") {
            if (data.objectId === "6fd67fa5-3020-4901-8afc-1419e045540d") {
                user.points += 300;
                await this.userRepository.save(user);
                return {"success": true, "message": "Reward successfully claimed"}
            } else {
                throw new Error("Invalid handle object id");
            }
        } else {
            throw new Error("Invalid handle uri");
        }
    }
}